/** Verify explicit editorial records against immutable runtime evidence.
 * No string heuristic creates or upgrades an editorial verdict.
 *
 * node tools/verify-chat-first-audit.mjs --baseline DIR --reviews A.jsonl,B.jsonl
 *   --annotations A.json,B.json --manifest hashes.json [--output NEW.json]
 * Optional --partial verifies a review partition without claiming global coverage.
 * All input files may be gzip-compressed. A manifest has
 * { files: [{path: "relative/or/absolute", sha256: "..."}], expected?: {...} }.
 * Annotation files must be pinned in the manifest. With --allow-unpinned the
 * tool reports hashes for manifest preparation but does not certify hash pins.
 * Supported annotations: {coverage:{reviewId:{annotation,textSha256}},annotations:{id:manual}}
 * or {scenes:{variantId:...},candidates:{"nodeId::choiceId":manual}}.
 */
import {readFile,writeFile}from'node:fs/promises'
import{createHash}from'node:crypto'
import{gunzipSync}from'node:zlib'
import path from'node:path'
const get=(name,required=true)=>{const i=process.argv.indexOf(name);if(i<0){if(required)throw new Error(`Required ${name}`);return undefined}if(!process.argv[i+1])throw new Error(`Missing value ${name}`);return process.argv[i+1]}
if(process.argv.includes('--help')){console.log('Verify frozen review coverage; see this file header for CLI and manifest schema.');process.exit(0)}
const baseline=get('--baseline'),reviewPaths=get('--reviews').split(','),annotationPaths=get('--annotations').split(','),manifestPath=get('--manifest',false),partial=process.argv.includes('--partial'),unpinned=process.argv.includes('--allow-unpinned')
if(!manifestPath&&!unpinned)throw new Error('A hash manifest is required; --allow-unpinned is only for preparing pins')
const hash=bytes=>createHash('sha256').update(bytes).digest('hex')
const fingerprints=new Map()
async function bytes(file){const raw=await readFile(file);fingerprints.set(path.resolve(file),hash(raw));return file.endsWith('.gz')?gunzipSync(raw):raw}
async function json(file){return JSON.parse((await bytes(file)).toString('utf8').replace(/^\uFEFF/,''))}
async function lines(file){return (await bytes(file)).toString('utf8').replace(/^\uFEFF/,'').split(/\r?\n/).filter(Boolean).map((line,i)=>{try{return JSON.parse(line)}catch{throw new Error(`Invalid JSONL ${file}:${i+1}`)}})}
async function baselineFile(name,extension='jsonl'){const file=path.join(baseline,`before-${name}.${extension}`);try{await readFile(file);return file}catch(error){if(error.code!=='ENOENT')throw error;return file+'.gz'}}
const scenes=await lines(await baselineFile('scenes')),forks=await lines(await baselineFile('branches')),histories=await lines(await baselineFile('histories')),summary=await json(await baselineFile('summary','json'))
const reviews=(await Promise.all(reviewPaths.map(lines))).flat(),annotationFiles=await Promise.all(annotationPaths.map(async file=>({file,hash:hash(await readFile(file)),data:await json(file)})))
const errors=[]
const assert=(condition,message)=>{if(!condition)errors.push(message)}
const byVariant=new Map(),byFork=new Map(),byHistory=new Map(),byReview=new Map()
for(const scene of scenes){assert(!byVariant.has(scene.variantId),`Duplicate variant ${scene.variantId}`);byVariant.set(scene.variantId,scene)}
for(const fork of forks){assert(!byFork.has(fork.branchId),`Duplicate branch ${fork.branchId}`);byFork.set(fork.branchId,fork)}
for(const history of histories){assert(!byHistory.has(history.historyId),`Duplicate history ${history.historyId}`);byHistory.set(history.historyId,history)}
const required=['questionIntent','responseIntent','knowledgeEvidenceIds','epistemicVerdict','replyFit','claimVsCapability','futureLeak','branchMeaning','nextTurnImpact','editorialVerdict','recommendedCopy']
const manualFields=['questionIntent','responseIntent','epistemicVerdict','replyFit','claimVsCapability','futureLeak','editorialVerdict','recommendedCopy']
const nonempty=value=>value!==undefined&&value!==null&&(typeof value!=='string'||value.trim()!=='')
const candidateText=row=>row.choiceText??row.candidateText
const canonicalId=row=>`${row.variantId}:${row.choiceId}`
function annotationFor(file,scene,choice){
 const data=file.data,id=`${scene.variantId}:${choice.id}`
 const coverage=data.coverage?.[id]??data.coverage?.[`${scene.variantId}::${choice.id}`]
 if(coverage){
  if(coverage.textSha256)assert(hash(choice.text)===coverage.textSha256,`Annotation text hash mismatch ${id} in ${file.file}`)
  if(coverage.incomingSha256){const incoming=JSON.stringify({userMessage:scene.userMessage,userMessages:scene.userMessages,userContent:scene.userContent,userLongInput:scene.userLongInput});assert(hash(incoming)===coverage.incomingSha256,`Annotation incoming hash mismatch ${id}`)}
  return data.annotations?.[typeof coverage==='string'?coverage:coverage.annotation]
 }
 if(data.scenes?.[scene.variantId])return data.candidates?.[`${scene.nodeId}::${choice.id}`]
 return undefined
}
for(const row of reviews){
 const id=canonicalId(row)
 assert(!byReview.has(id),`Duplicate candidate review ${id}`);byReview.set(id,row)
 const scene=byVariant.get(row.variantId),choice=scene?.choices.find(c=>c.id===row.choiceId)
 if(!scene||!choice){errors.push(`Review has no runtime candidate ${id}`);continue}
 assert(candidateText(row)===choice.text,`Reviewed text differs from visible candidate ${id}`)
 if(row.nodeId!==undefined)assert(row.nodeId===scene.nodeId,`Wrong node ${id}`)
 for(const field of required)assert(Object.hasOwn(row,field),`Missing review field ${field}: ${id}`)
 for(const field of required.filter(f=>f!=='recommendedCopy'))assert(nonempty(row[field]),`Empty review field ${field}: ${id}`)
 assert(Array.isArray(row.knowledgeEvidenceIds)&&row.knowledgeEvidenceIds.length>0,`No knowledge provenance ${id}`)
 assert(typeof row.editorialVerdict==='string'&&/^(?:PASS|NOT-A-BUG|P[0-3]|NEEDS-EVIDENCE)(?:$|[: /-])/.test(row.editorialVerdict),`Unknown explicit verdict ${id}`)
 const matching=annotationFiles.map(file=>({file,annotation:annotationFor(file,scene,choice)})).filter(x=>x.annotation)
 assert(matching.length>0,`No explicit frozen editorial annotation ${id}`)
 assert(matching.some(({annotation})=>manualFields.every(field=>Object.hasOwn(annotation,field)&&JSON.stringify(row[field])===JSON.stringify(annotation[field]))),`Review does not match frozen manual annotation ${id}`)
 if(row.annotationSha256)assert(matching.some(({file})=>file.hash===row.annotationSha256),`Row annotation hash mismatch ${id}`)
 const clicked=scene.selectedCounts?.[choice.id]??0
 const supplied=row.catalogSelectedCount??row.catalogClickedCount??row.catalogSelectedDistinctCount
 if(supplied!==undefined)assert(supplied===clicked,`Catalog selection count mismatch ${id}`)
 if(row.catalogSelected!==undefined)assert(row.catalogSelected===(clicked>0),`Catalog selected flag mismatch ${id}`)
 const impact=row.nextTurnImpact
 const evidenceId=typeof impact==='object'&&(impact.branchId??impact.branchEvidence)
 if(evidenceId)assert(evidenceId===scene.branchEvidence[choice.id],`Review points to wrong fork ${id}`)
}
let candidateCount=0,fourChoiceVariants=0,selectedCandidates=0,reviewedFourChoices=0
const transformedSavedReplies=[]
for(const scene of scenes){
 assert(Array.isArray(scene.choices)&&scene.choices.length>0,`No actual choices ${scene.variantId}`)
 assert(new Set(scene.choices.map(c=>c.id)).size===scene.choices.length,`Duplicate offered ID ${scene.variantId}`)
 for(const reference of scene.savedVisibleHistoryRefs??[])assert(byHistory.has(reference),`Missing saved history ${scene.variantId}:${reference}`)
 for(const context of scene.contexts??[])for(const reference of context.savedVisibleHistoryRefs??[])assert(byHistory.has(reference),`Missing context history ${scene.variantId}:${reference}`)
 const count=scene.choices.filter(choice=>byReview.has(`${scene.variantId}:${choice.id}`)).length
 if(scene.choices.length===4){fourChoiceVariants++;reviewedFourChoices+=count;if(!partial||count)assert(count===4,`Four-choice variant must have exactly four reviews ${scene.variantId}: ${count}`)}
 for(const choice of scene.choices){
  candidateCount++;const id=`${scene.variantId}:${choice.id}`
  if(scene.selectedCounts?.[choice.id]>0)selectedCandidates++
  if(!partial)assert(byReview.has(id),`Missing candidate review ${id}`)
  const branch=byFork.get(scene.branchEvidence[choice.id])
  assert(Boolean(branch),`Missing legal direct fork ${id}`)
  if(!branch)continue
  assert(branch.originVariantId===scene.variantId&&branch.choiceId===choice.id,`Fork identity mismatch ${id}`)
  const expectedSaved=choice.longformPreview?.preview??choice.text
  const clarification=choice.proposalKind==='clarification'
  // engine.commitChoice stores the authored longform preview or a generated
  // proposal clarification instead of the menu label (engine.ts:285-303).
  // Clarification bytes are pinned as recorded runtime evidence, not guessed.
  assert(branch.savedChoice?.choiceId===choice.id&&(clarification?nonempty(branch.savedChoice?.assistantText):branch.savedChoice?.assistantText===expectedSaved),`Saved visible reply mismatch ${id}`)
  if(clarification||choice.longformPreview)transformedSavedReplies.push({reviewId:id,reason:clarification?'generated proposal clarification':'authored longform preview',savedTextSha256:hash(branch.savedChoice?.assistantText??'')})
  assert(Boolean(branch.directNext)||branch.terminalPhase==='ending',`No actual direct response or ending ${id}`)
 }
}
const observed={displayedVariants:scenes.length,displayedCandidates:candidateCount,fourChoiceVariants,fourChoiceCandidates:fourChoiceVariants*4,catalogSelectedDistinctCandidates:selectedCandidates,successfulCandidateForks:forks.length}
for(const[field,value]of Object.entries(observed))if(summary[field]!==undefined)assert(summary[field]===value,`Runtime summary mismatch ${field}: ${summary[field]} != ${value}`)
if(manifestPath){
 const manifest=await json(manifestPath),pins=new Map((manifest.files??[]).map(entry=>[path.resolve(entry.path),entry.sha256.toLowerCase()]))
 for(const file of fingerprints.keys())if(file!==path.resolve(manifestPath))assert(pins.has(file),`Input not pinned in manifest ${file}`)
 for(const[file,expected]of pins){if(!fingerprints.has(file))await bytes(file);assert(fingerprints.get(file)===expected,`Manifest SHA256 mismatch ${file}`)}
 for(const[field,value]of Object.entries(manifest.expected??{}))assert(observed[field]===value,`Manifest count mismatch ${field}`)
}
const result={status:errors.length?'FAIL':'PASS',scope:partial?'partition only':'all runtime candidates',annotationHashesPinned:Boolean(manifestPath),...observed,reviewedCandidates:byReview.size,reviewedFourChoiceCandidates:reviewedFourChoices,catalogUnselectedCandidates:candidateCount-selectedCandidates,transformedSavedReplyCount:transformedSavedReplies.length,transformedSavedReplies,annotationFiles:annotationFiles.map(({file,hash})=>({path:file,sha256:hash})),inputFiles:[...fingerprints].map(([file,sha256])=>({path:file,sha256})),errors}
const output=get('--output',false)
if(output)await writeFile(output,JSON.stringify(result,null,2)+'\n',{encoding:'utf8',flag:'wx'})
console.log(JSON.stringify({...result,inputFiles:undefined,transformedSavedReplies:undefined,errors:errors.slice(0,20)}))
if(errors.length)process.exitCode=1
