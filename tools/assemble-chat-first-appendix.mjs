/** Assemble existing explicit model/agent editorial reviews; never infer a verdict.
 * node tools/assemble-chat-first-appendix.mjs --baseline DIR --reviews A,B,C
 *   --after-comparisons FILE --output docs/.../appendix --work temp/...
 * --prepare writes a pending, temporary package without requiring after data.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const arg = (name, required = true) => {
  const index = process.argv.indexOf(name)
  if (index < 0) { if (required) throw new Error(`Required ${name}`); return undefined }
  return process.argv[index + 1]
}
const baseline = path.resolve(arg('--baseline'))
const reviewFiles = arg('--reviews').split(',').map(file => path.resolve(file))
const output = path.resolve(arg('--output'))
const work = path.resolve(arg('--work'))
const afterFile = arg('--after-comparisons', false)
const sceneComparisonFile = arg('--scene-comparisons', false)
const comparisonSummaryFile = arg('--comparison-summary', false)
const prepare = process.argv.includes('--prepare')
const currentDir = arg('--current', false)
const closureDir = arg('--closure', false)
const relayFile = arg('--relay', false)
if (prepare && !output.startsWith(path.resolve('temp') + path.sep)) throw new Error('Pending packages must stay under temp/')
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const jsonl = rows => rows.map(row => JSON.stringify(row)).join('\n') + '\n'
const parseLines = bytes => bytes.toString('utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean).map(JSON.parse)
const fail = message => { throw new Error(message) }
const [sceneBytes, branchBytes, historyBytes, summaryBytes, sourceBytes] = await Promise.all([
  readFile(path.join(baseline, 'before-scenes.jsonl')), readFile(path.join(baseline, 'before-branches.jsonl')),
  readFile(path.join(baseline, 'before-histories.jsonl')), readFile(path.join(baseline, 'before-summary.json')),
  Promise.all(reviewFiles.map(file => readFile(file))),
])
const scenes = parseLines(sceneBytes)
const summary = JSON.parse(summaryBytes)
const expected = new Map(scenes.flatMap(scene => scene.choices.map(choice => [`${scene.variantId}:${choice.id}`, { scene, choice }])))
const manualFields = ['questionIntent', 'responseIntent', 'epistemicVerdict', 'replyFit', 'claimVsCapability', 'futureLeak', 'editorialVerdict', 'recommendedCopy']
const required = [...manualFields, 'knowledgeEvidenceIds', 'branchMeaning', 'nextTurnImpact']
const sources = sourceBytes.map((bytes, index) => ({ file: reviewFiles[index], sha256: sha(bytes), rows: parseLines(bytes) }))
let after = new Map(), afterSha256, rawAfter, comparisonSummaryBytes, changedSceneBytes
if (afterFile) {
  rawAfter = await readFile(afterFile)
  afterSha256 = sha(rawAfter)
  const entries = parseLines(rawAfter)
  after = new Map(entries.map(entry => [entry.beforeReviewId, entry]))
  if (after.size !== expected.size || entries.length !== expected.size) fail('After comparisons do not cover exactly the frozen candidate set')
  for (const id of expected.keys()) if (!after.has(id)) fail(`Missing exact legal after comparison ${id}`)
}
if (!prepare && (!afterFile || !sceneComparisonFile || !comparisonSummaryFile || !currentDir || !closureDir || !relayFile)) fail('Final packages require legal comparisons, current corpus, explicit closure and relay classification')
if (sceneComparisonFile || comparisonSummaryFile) {
  if (!sceneComparisonFile || !comparisonSummaryFile) fail('Scene comparisons and summary must be supplied together')
  const [sceneComparisonBytes, summaryBytes] = await Promise.all([readFile(sceneComparisonFile), readFile(comparisonSummaryFile)])
  const comparisonSummary = JSON.parse(summaryBytes)
  if (comparisonSummary.status !== 'PASS') fail('Legal semantic comparison has not passed')
  const comparisons = parseLines(sceneComparisonBytes)
  const byId = new Map(comparisons.map(row => [row.beforeVariantId, row]))
  if (byId.size !== scenes.length || comparisons.length !== scenes.length) fail('Scene comparisons do not cover exactly the frozen variants')
  const visible = scene => ({ conversationTitle: scene.conversationTitle, uiIdentity: scene.uiIdentity, userMessage: scene.userMessage, userMessages: scene.userMessages, userContent: scene.userContent, userLongInput: scene.userLongInput, choices: scene.choices.map(choice => ({ id: choice.id, text: choice.text, content: choice.content, longformPreview: choice.longformPreview })) })
  const changed = []
  for (const scene of scenes) {
    const comparison = byId.get(scene.variantId)
    if (!comparison || comparison.nodeId !== scene.nodeId) fail(`Missing exact scene comparison ${scene.variantId}`)
    if (JSON.stringify(visible(comparison.beforeScene)) !== JSON.stringify(visible(comparison.afterScene))) changed.push({ ...comparison, beforeReviewIds: scene.choices.map(choice => `${scene.variantId}:${choice.id}`), changeDetection: 'Actual visible payload comparison; this detects changed samples, not editorial severity or PASS.' })
  }
  comparisonSummaryBytes = summaryBytes
  changedSceneBytes = Buffer.from(jsonl(changed))
}
const rows = [], seen = new Set(), pending = [], materialized = []
const coverage = {}, annotations = {}, annotationBytes = new Map()
for (const source of sources) for (const original of source.rows) {
  const row = { ...original }
  const id = `${row.variantId}:${row.choiceId}`
  if (seen.has(id)) fail(`Duplicate review ${id}`)
  seen.add(id)
  const evidence = expected.get(id)
  if (!evidence) fail(`Review outside immutable baseline ${id}`)
  if ((row.choiceText ?? row.candidateText) !== evidence.choice.text) fail(`Candidate text mismatch ${id}`)
  for (const field of required) if (!Object.hasOwn(row, field)) fail(`Missing ${field}: ${id}`)
  if (!row.recommendedCopy && /^P[12](?:$|[: /-])/.test(row.editorialVerdict)) {
    const actual = after.get(id) ?? after.get(`${row.variantId}::${row.choiceId}`)
    const rendered = actual?.afterScene?.choices?.find(choice => choice.id === row.choiceId)
    if (rendered?.text) {
      row.recommendedCopy = rendered.text
      row.recommendedCopyOrigin = { kind: 'actual legal after render', beforeReviewId: id, renderedTextSha256: sha(rendered.text), comparisonSourceSha256: afterSha256 }
      materialized.push(id)
    } else pending.push(id)
  }
  const manual = Object.fromEntries(manualFields.map(field => [field, row[field]]))
  const bytes = JSON.stringify(manual)
  const annotation = `manual-${sha(bytes).slice(0, 24)}`
  if (annotationBytes.has(annotation) && annotationBytes.get(annotation) !== bytes) fail(`Annotation hash collision ${annotation}`)
  annotationBytes.set(annotation, bytes)
  annotations[annotation] = manual
  const { scene, choice } = evidence
  const incoming = { userMessage: scene.userMessage, userMessages: scene.userMessages, userContent: scene.userContent, userLongInput: scene.userLongInput }
  coverage[id] = { annotation, textSha256: sha(choice.text), incomingSha256: sha(JSON.stringify(incoming)), sourceMatrix: path.basename(source.file), sourceMatrixSha256: source.sha256 }
  rows.push(row)
}
for (const id of expected.keys()) if (!seen.has(id)) fail(`Missing explicit manual review ${id}`)
if (pending.length && !prepare) fail(`${pending.length} P1/P2 recommendations still need real after evidence: ${pending.join(', ')}`)
await Promise.all([mkdir(output, { recursive: true }), mkdir(work, { recursive: true })])
const rawMatrix = Buffer.from(jsonl(rows))
const rawAnnotations = Buffer.from(JSON.stringify({ schemaVersion: 1, reviewMethod: 'explicit-model-editorial-review', provenance: 'Deduplicated existing model/agent editorial annotations; this does not claim a real human playthrough. No verdict is generated or upgraded. Blank P1/P2 copy is materialized only from the same legal after candidate.', sources: sources.map(({ file, sha256, rows }) => ({ file: path.basename(file), sha256, candidates: rows.length })), afterSource: afterFile ? { file: path.basename(afterFile), sha256: afterSha256 } : undefined, coverage, annotations }))
const payloads = new Map([
  ['ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl.gz', rawMatrix], ['manual-annotations.json.gz', rawAnnotations],
  ['before-scenes.jsonl.gz', sceneBytes], ['before-branches.jsonl.gz', branchBytes],
  ['before-histories.jsonl.gz', historyBytes], ['before-summary.json.gz', summaryBytes],
])
if (rawAfter) payloads.set('after-candidate-comparisons.jsonl.gz', rawAfter)
if (comparisonSummaryBytes) payloads.set('semantic-comparison-summary.json.gz', comparisonSummaryBytes)
if (changedSceneBytes) payloads.set('before-after-scenes.jsonl.gz', changedSceneBytes)
let currentSummary, currentMatrixBytes, currentAnnotationsBytes, currentClosureSummary
if (currentDir || closureDir) {
  if (!currentDir || !closureDir) fail('Current corpus and explicit closure must be supplied together')
  const [currentScenesBytes, currentBranchesBytes, currentHistoryBytes, currentSummaryBytes, closureBytes, closureSummaryBytes] = await Promise.all([
    readFile(path.join(currentDir,'after-scenes.jsonl')), readFile(path.join(currentDir,'after-branches.jsonl')),
    readFile(path.join(currentDir,'after-histories.jsonl')), readFile(path.join(currentDir,'after-summary.json')),
    readFile(path.join(closureDir,'after-closure-draft.jsonl')), readFile(path.join(closureDir,'after-closure-summary.json')),
  ])
  currentSummary=JSON.parse(currentSummaryBytes); currentClosureSummary=JSON.parse(closureSummaryBytes)
  if(currentClosureSummary.pending!==0 || currentClosureSummary.unmapped.length) fail('Current editorial closure is incomplete')
  const currentScenes=parseLines(currentScenesBytes), currentRows=parseLines(closureBytes)
  const currentExpected=new Map(currentScenes.flatMap(scene=>scene.choices.map(choice=>[`${scene.variantId}:${choice.id}`,{scene,choice}])))
  const currentCoverage={},currentAnnotations={},currentSeen=new Set()
  for(const row of currentRows){
    const id=`${row.variantId}:${row.choiceId}`, actual=currentExpected.get(id)
    if(!actual||currentSeen.has(id)) fail(`Unknown/duplicate current review ${id}`)
    currentSeen.add(id)
    if(row.candidateText!==actual.choice.text||!row.originalReviewIds?.length)fail(`Current copy or old editorial basis missing ${id}`)
    if(row.closureStatus==='NEEDS_MANUAL_REVIEW'||/^P[12](?:$|[: /-])/.test(row.editorialVerdict))fail(`Unresolved current P1/P2 ${id}`)
    for(const field of required)if(!Object.hasOwn(row,field))fail(`Current field missing ${field}: ${id}`)
    for(const oldId of row.originalReviewIds)if(!seen.has(oldId))fail(`Unknown old review basis ${id}: ${oldId}`)
    const editorial=Object.fromEntries(manualFields.map(field=>[field,row[field]])), annotation=`editorial-${sha(JSON.stringify(editorial)).slice(0,24)}`
    if(currentAnnotations[annotation]&&JSON.stringify(currentAnnotations[annotation])!==JSON.stringify(editorial))fail(`Current annotation collision ${annotation}`)
    currentAnnotations[annotation]=editorial
    const incoming={userMessage:actual.scene.userMessage,userMessages:actual.scene.userMessages,userContent:actual.scene.userContent,userLongInput:actual.scene.userLongInput}
    currentCoverage[id]={annotation,textSha256:sha(actual.choice.text),incomingSha256:sha(JSON.stringify(incoming)),originalReviewIds:row.originalReviewIds,closureStatus:row.closureStatus}
  }
  if(currentSeen.size!==currentExpected.size)fail('Current candidate coverage is incomplete')
  currentMatrixBytes=closureBytes
  currentAnnotationsBytes=Buffer.from(JSON.stringify({schemaVersion:1,reviewMethod:'explicit-model-editorial-review',provenance:'Explicit partition annotations plus unchanged full-payload legal-context inheritance; retained P3/NOT-A-BUG are never upgraded.',manualSources:currentClosureSummary.manualSources,coverage:currentCoverage,annotations:currentAnnotations}))
  for(const[name,bytes]of [['AFTER_VISIBLE_AI_REPLIES_CLOSURE.jsonl.gz',closureBytes],['after-editorial-annotations.json.gz',currentAnnotationsBytes],['after-scenes.jsonl.gz',currentScenesBytes],['after-branches.jsonl.gz',currentBranchesBytes],['after-histories.jsonl.gz',currentHistoryBytes],['after-summary.json.gz',currentSummaryBytes],['after-closure-summary.json.gz',closureSummaryBytes]])payloads.set(name,bytes)
  for(const source of currentClosureSummary.manualSources){
    const bytes=await readFile(source.file)
    if(sha(bytes)!==source.sha256)fail(`Explicit source changed ${source.file}`)
    payloads.set(`editorial-source-${path.basename(source.file)}.gz`,bytes)
  }
  const newCombinations=currentRows.filter(row=>row.linkMethod==='explicit-new-combination-manual')
  const byCurrent=new Map(currentScenes.map(scene=>[scene.variantId,scene]))
  const byBefore=new Map(scenes.map(scene=>[scene.variantId,scene]))
  const newSamples=[...new Set(newCombinations.map(row=>row.variantId))].map(id=>({afterScene:byCurrent.get(id),editorialReviews:newCombinations.filter(row=>row.variantId===id),beforePolicyReviewBasis:[...new Set(newCombinations.filter(row=>row.variantId===id).flatMap(row=>row.originalReviewIds.map(old=>old.split(':')[0])))].map(old=>byBefore.get(old)),mapping:'Explicit editorial review of new source/context combination; old policies supply review basis, not an assertion of identical previous context.'}))
  payloads.set('explicit-new-combinations.jsonl.gz',Buffer.from(jsonl(newSamples)))
}
if(relayFile){const bytes=await readFile(relayFile);if(parseLines(bytes).length!==scenes.length)fail('Relay classification does not cover all baseline scenes');payloads.set('legitimate-relay-classification.jsonl.gz',bytes)}
for(const name of ['contract-display-review.json','contract-normalization-proof.json'])if(comparisonSummaryFile)payloads.set(`${name}.gz`,await readFile(path.join(path.dirname(comparisonSummaryFile),name)))
const files = []
for (const [name, bytes] of payloads) {
  const compressed = gzipSync(bytes, { level: 9, mtime: 0 })
  await writeFile(path.join(output, name), compressed)
  files.push({ path: path.relative(process.cwd(), path.join(output, name)).replaceAll('\\', '/'), archiveName: name, sha256: sha(compressed), uncompressedSha256: sha(bytes), compressedBytes: compressed.length, uncompressedBytes: bytes.length })
}
await writeFile(path.join(work, 'ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl'), rawMatrix)
const counts=s=>Object.fromEntries(['displayedVariants','displayedCandidates','fourChoiceVariants','fourChoiceCandidates','catalogSelectedDistinctCandidates','successfulCandidateForks'].map(field=>[field,s[field]]))
const manifest = { schemaVersion: 1, status: pending.length || prepare ? 'PENDING_AFTER_RECOMMENDATIONS' : 'COMPLETE_MANUAL_REVIEW_PACKAGE', reviewMethod:'explicit-model-editorial-review', sourceSha: summary.sourceSha, expected:counts(summary), currentExpected:currentSummary?counts(currentSummary):undefined, currentClosure:currentClosureSummary, files, changedSceneSamples: changedSceneBytes ? parseLines(changedSceneBytes).length : undefined, pendingRecommendations: pending, materializedRecommendations: materialized, note: 'Hashes pin compressed transport bytes and decoded contents. Canonical source candidate text, verdicts, all legal direct forks and saved histories are retained. Full JSONL is extracted only under the chosen local output directory. Explicit editorial annotations describe model/agent judgment, not a real human playthrough.' }
const manifestPath = path.join(output, 'SHA256SUMS.json')
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
const verification = spawnSync(process.execPath, ['tools/verify-chat-first-audit.mjs', '--baseline', output, '--reviews', path.join(output, 'ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl.gz'), '--annotations', path.join(output, 'manual-annotations.json.gz'), '--manifest', manifestPath], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 })
if (verification.error) throw verification.error
await writeFile(path.join(work, 'strict-verification.json'), verification.stdout)
process.stdout.write(verification.stdout)
if (verification.status !== 0) { process.stderr.write(verification.stderr); process.exitCode = verification.status ?? 1 }
if(currentMatrixBytes){
  await writeFile(path.join(work,'AFTER_VISIBLE_AI_REPLIES_CLOSURE.jsonl'),currentMatrixBytes)
  const normalized=path.join(work,'current-baseline');await mkdir(normalized,{recursive:true})
  const pins=[...files.map(({path,sha256})=>({path,sha256}))]
  for(const name of ['scenes.jsonl','branches.jsonl','histories.jsonl','summary.json']){
    const bytes=await readFile(path.join(currentDir,`after-${name}`)),target=path.join(normalized,`before-${name}`)
    await writeFile(target,bytes);pins.push({path:target,sha256:sha(bytes)})
  }
  const pinFile=path.join(work,'current-verification-manifest.json');await writeFile(pinFile,JSON.stringify({files:pins,expected:counts(currentSummary)},null,2))
  const verified=spawnSync(process.execPath,['tools/verify-chat-first-audit.mjs','--baseline',normalized,'--reviews',path.join(output,'AFTER_VISIBLE_AI_REPLIES_CLOSURE.jsonl.gz'),'--annotations',path.join(output,'after-editorial-annotations.json.gz'),'--manifest',pinFile],{encoding:'utf8',maxBuffer:5*1024*1024})
  await writeFile(path.join(work,'current-strict-verification.json'),verified.stdout);process.stdout.write(verified.stdout)
  if(verified.error)throw verified.error
  if(verified.status!==0){process.stderr.write(verified.stderr);process.exitCode=verified.status??1}
}
console.log(JSON.stringify({ status: manifest.status, output, localJsonl: path.join(work, 'ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl'), candidates: rows.length, uniqueAnnotations: annotationBytes.size, pending: pending.length, materialized: materialized.length, archiveBytes: files.reduce((n, file) => n + file.compressedBytes, 0) }))
