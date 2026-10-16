/** Read-only runtime corpus. Never writes saves, source content, or existing evidence.
 * node tools/generate-chat-first-audit.mjs [--phase before|after] [--output path]
 */
import { createServer } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const arg = name => process.argv[process.argv.indexOf(name) + 1]
const phase = process.argv.includes('--phase') ? arg('--phase') : 'before'
if (!['before', 'after'].includes(phase)) throw new Error('phase must be before or after')
const output = path.resolve(process.argv.includes('--output') ? arg('--output') : 'temp/chat-first-contract-20261016')
await mkdir(output, { recursive: true })
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const write = (name, value) => writeFile(path.join(output, `${phase}-${name}`), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' })
const jsonl = rows => rows.map(row => JSON.stringify(row)).join('\n') + '\n'
if (process.argv.includes('--merge')) {
  const sources = arg('--merge').split(',').map(p => path.resolve(p))
  const merged = new Map(), branches = new Map(), histories = new Map(), routes = [], failures = []
  const readLines = async (directory, name) => (await readFile(path.join(directory, `${phase}-${name}.jsonl`), 'utf8')).trim().split('\n').map(JSON.parse)
  for (const [index, directory] of sources.entries()) {
    for (const row of await readLines(directory, 'scenes')) {
      if (index) { row.supplementSelectedCounts = row.selectedCounts; row.selectedCounts = {}; row.contexts = row.contexts.map(c => ({ ...c, kind: `supplement:${c.kind}` })) }
      const prior = merged.get(row.variantId)
      if (prior) { prior.contexts.push(...row.contexts); prior.supplementSelectedCounts = row.supplementSelectedCounts; }
      else merged.set(row.variantId, row)
    }
    for (const row of await readLines(directory, 'branches')) if (!branches.has(row.branchId)) branches.set(row.branchId, row)
    for (const row of await readLines(directory, 'histories')) histories.set(row.historyId, row)
    routes.push(...JSON.parse(await readFile(path.join(directory, `${phase}-routes.json`), 'utf8')).map(r => index ? { ...r, kind: `supplement:${r.kind}` } : r))
    failures.push(...JSON.parse(await readFile(path.join(directory, `${phase}-failures.json`), 'utf8')))
  }
  const rows = [...merged.values()]
  const primary = JSON.parse(await readFile(path.join(sources[0], `${phase}-summary.json`), 'utf8'))
  const summary = { ...primary, mergedSources: sources, displayedVariants: rows.length, displayedCandidates: rows.reduce((n,r)=>n+r.choices.length,0), fourChoiceVariants: rows.filter(r=>r.choices.length===4).length, fourChoiceCandidates: rows.filter(r=>r.choices.length===4).length*4, fullLegalRuns: routes.length, supplementalCatalogRuns: routes.filter(r=>r.kind==='supplement:catalog').length, successfulNearNeighborRoutes: routes.filter(r=>r.kind.includes('near-neighbor')).length, successfulCandidateForks: branches.size, failedExplorations: failures.length }
  summary.successorOnlyVariants = rows.filter(r=>r.contexts.every(c=>c.kind.includes('choice-fork'))).length
  summary.branchOrigins = rows.length - summary.successorOnlyVariants
  for (const row of rows) for (const choice of row.choices) if (!branches.has(row.branchEvidence[choice.id])) throw new Error(`Missing merged branch ${row.variantId}:${choice.id}`)
  await write('scenes.jsonl',jsonl(rows)); await write('branches.jsonl',jsonl([...branches.values()])); await write('histories.jsonl',jsonl([...histories.values()])); await write('routes.json',routes); await write('failures.json',failures); await write('summary.json',summary); await write('index.json',{summary, sources, note:'Read-only union by stable runtime variantId; original catalog selection counts kept separate from supplemental routes. Human partitions remain in original source directories.'})
  console.log(JSON.stringify(summary)); process.exit(0)
}
const sourceSha = process.argv.includes('--source-sha') ? arg('--source-sha') : execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const frozenSource = process.argv.includes('--source-sha') ? [{
  name: 'audit-frozen-git-source', enforce: 'pre',
  load(id) {
    const relative = path.relative(process.cwd(), id.split('?')[0]).replaceAll('\\', '/')
    if (!relative.startsWith('src/') || !/\.(?:tsx?|json)$/.test(relative)) return null
    return execFileSync('git', ['show', `${sourceSha}:${relative}`], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })
  },
}] : []
const server = await createServer({ plugins: frozenSource, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const [{ runMainline2Route }, { EDITION4_PUBLIC_ROUTES, EDITION4_SECRET_ROUTES }, { resolveScene, commitChoice }, { getManifestConversation }, { resolvePlayerVisibleIdentity }, { evaluateCondition }] = await Promise.all([
    server.ssrLoadModule('/src/game/mainline2.closeoutFixtures.ts'), server.ssrLoadModule('/src/game/mainline2Edition4RouteCatalog.ts'), server.ssrLoadModule('/src/game/engine.ts'), server.ssrLoadModule('/src/content/runManifest.ts'), server.ssrLoadModule('/src/game/playerIdentity.ts'), server.ssrLoadModule('/src/game/narrativeSchema.ts'),
  ])
  const scenes = new Map(), representatives = new Map(), histories = new Map(), routes = [], branches = [], failures = []
  const historyRef = entry => { const id = `h-${hash(entry).slice(0, 20)}`; histories.set(id, { historyId: id, ...entry }); return id }
  const snapshot = (scene, run) => ({ nodeId: scene.id, conversationId: scene.conversationId, conversationTitle: scene.conversationTitle, uiIdentity: resolvePlayerVisibleIdentity(scene.conversationId, run.history), userMessage: scene.userMessage, userMessages: scene.userMessages, userContent: scene.userContent, userLongInput: scene.userLongInput, choiceKind: scene.choiceKind, choices: scene.choices })
  function record(scene, run, context, selectedChoiceId) {
    const conversation = getManifestConversation(scene.conversationId)
    const triggerSignature = { variantId: scene.variantId, contextConditions: (scene.contextVariants ?? []).map(v => ({ when: v.when, matched: evaluateCondition(v.when, run) })), choiceConditions: scene.choices.filter(c => c.when).map(c => ({ id: c.id, when: c.when, matched: evaluateCondition(c.when, run) })) }
    const displayed = snapshot(scene, run)
    const variantId = `v-${hash({ edition: run.mainlineCalendarVersion, causality: run.mainlineCausalityVersion ?? null, ...displayed, triggerSignature }).slice(0, 24)}`
    let row = scenes.get(variantId)
    if (!row) {
      row = { variantId, edition: run.mainlineCalendarVersion, causalityVersion: run.mainlineCausalityVersion ?? null, act: conversation?.act ?? run.progress?.act, domain: conversation?.module ?? (/^v4-/.test(scene.id) ? scene.id.split('-')[1] : 'mainline'), sourceRefs: conversation?.sourceRefs ?? [], ...displayed, triggerSignature, knownState: { decisions: run.decisions, flags: run.flags, persistentFlags: run.persistentFlags, events: run.events, worldState: run.worldState, progress: run.progress }, savedVisibleHistoryRefs: run.history.map(historyRef), contexts: [], selectedCounts: {}, branchEvidence: {} }
      scenes.set(variantId, row); representatives.set(variantId, { scene, run, context })
    }
    const ctx = { ...context, historyLength: run.history.length, savedVisibleHistoryRefs: run.history.map(historyRef) }
    if (!row.contexts.some(c => c.routeId === ctx.routeId && c.step === ctx.step && c.kind === ctx.kind)) row.contexts.push(ctx)
    if (selectedChoiceId && context.kind === 'catalog') row.selectedCounts[selectedChoiceId] = (row.selectedCounts[selectedChoiceId] ?? 0) + 1
    return variantId
  }
  const catalog = process.argv.includes('--authority-outcomes')
    ? ['intervene', 'wait'].map(response => ({ ...EDITION4_PUBLIC_ROUTES[0], routeId: 'audit-outcome-control', decisions: { ...EDITION4_PUBLIC_ROUTES[0].decisions, cascade_authority: 'outcome_control' }, choicesByNodeId: { ...EDITION4_PUBLIC_ROUTES[0].choicesByNodeId, 'v4-authority-outcomes': `v4-authority-outcomes-${response}` } }))
    : process.argv.includes('--echo-variants')
      ? ['preserve', 'advocate', 'release'].map(echo => { const base = EDITION4_PUBLIC_ROUTES.find(r => r.endingId === 'machine_republic'); return { ...base, routeId: 'audit-echo-variants', decisions: { ...base.decisions, echo_existence: echo } } })
    : [...EDITION4_PUBLIC_ROUTES, ...EDITION4_SECRET_ROUTES]
  const fixtures = []
  for (const target of catalog) {
    const fixture = runMainline2Route(target); fixtures.push(fixture)
    routes.push({ kind: 'catalog', target, ending: fixture.ending, steps: fixture.links.length })
    fixture.links.forEach(link => record(link.resolvedScene, link.runBefore, { kind: 'catalog', routeId: target.routeId, step: link.step }, link.choiceId))
    console.log(`catalog ${target.routeId}: ${fixture.links.length}`)
  }
  await write('catalog-scenes.jsonl', jsonl([...scenes.values()]))
  console.log(`BASELINE_CATALOG_READY ${scenes.size} variants`)
  // Same origin, legal single-choice counterfactuals. Later receipt/return text is
  // retained from full route execution; changes to ending are allowed and reported.
  const neighborNodes = /^(v4-(?:authority|governance|sovereignty|machine|life|econ|contact|frontier|safety|future)|m11-(?:canine|feline))/
  const neighborSeen = new Set()
  for (const fixture of fixtures) for (const link of fixture.links) {
    if (!neighborNodes.test(link.nodeId) || /receipt|return/.test(link.nodeId)) continue
    for (const choice of link.resolvedScene.choices) {
      if (choice.id === link.choiceId) continue
      const key = `${fixture.target.routeId}:${link.nodeId}:${choice.id}`
      if (neighborSeen.has(key)) continue
      neighborSeen.add(key)
      const target = { ...fixture.target, choicesByNodeId: { ...fixture.target.choicesByNodeId, [link.nodeId]: choice.id } }
      try {
        const neighbor = runMainline2Route(target)
        routes.push({ kind: 'near-neighbor', branchId: key, target, ending: neighbor.ending, steps: neighbor.links.length })
        for (const next of neighbor.links) record(next.resolvedScene, next.runBefore, { kind: 'near-neighbor', routeId: key, step: next.step }, next.choiceId)
      } catch (error) {
        failures.push({ kind: 'near-neighbor-original-proposal', branchId: key, error: String(error) })
        // Changing a real action can invalidate the original future. Continue
        // with the actual human-veto alternative rather than inject that future.
        try {
          const fallback = { ...target, proposalId: 'proposal.hc.final_human_veto', initialProposalId: undefined, rejectProposalId: undefined }
          const neighbor = runMainline2Route(fallback)
          routes.push({ kind: 'near-neighbor-fallback', branchId: key, target: fallback, ending: neighbor.ending, steps: neighbor.links.length })
          for (const next of neighbor.links) record(next.resolvedScene, next.runBefore, { kind: 'near-neighbor-fallback', routeId: key, step: next.step }, next.choiceId)
        } catch (fallbackError) { failures.push({ kind: 'near-neighbor-fallback', branchId: key, error: String(fallbackError) }) }
      }
    }
  }
  console.log(`NEIGHBORS_READY ${scenes.size} variants; ${routes.length} routes`)
  // Fork every displayed candidate from an actual legal run. First successors
  // enter the corpus, but their own forks are intentionally not recursively
  // enumerated: no claim of exhaustive 4^N mixed-history coverage.
  const branchOrigins = [...representatives.entries()]
  for (const [variantId, { scene, run, context }] of branchOrigins) {
    const row = scenes.get(variantId)
    for (const choice of scene.choices) {
      const branchId = `${variantId}:${choice.id}`
      try {
        let next = commitChoice(run, choice.id)
        const evidence = { branchId, originVariantId: variantId, choiceId: choice.id, savedChoice: next.history.at(-1), directNext: null, later: [], terminalPhase: next.phase }
        if (next.phase === 'playing') {
          const successor = resolveScene(next)
          evidence.directNext = snapshot(successor, next)
          evidence.directNext.variantId = record(successor, next, { kind: 'choice-fork-successor', routeId: context.routeId, step: next.history.length, branchId })
        }
        // Important choices receive bounded legal continuation, never state injection.
        const depth = choice.decisionBinding || neighborNodes.test(scene.id) || /^(?:audit-|next-printer$|a4m8-a1-right|a3m6.*e9|a3-m6.*e9)/.test(scene.id) ? 10 : 1
        for (let n = 0; n < depth && next.phase === 'playing'; n++) {
          const later = resolveScene(next)
          if (n > 0) {
            const visible = snapshot(later, next)
            visible.variantId = record(later, next, { kind: 'choice-fork-later', routeId: context.routeId, step: next.history.length, branchId })
            evidence.later.push(visible)
          }
          next = commitChoice(next, later.choices[0].id)
        }
        evidence.terminalPhase = next.phase
        evidence.continuation = `legal first-choice continuation, at most ${depth} turns; full near-neighbor route receipts are separately indexed`
        branches.push(evidence); row.branchEvidence[choice.id] = branchId
      } catch (error) { failures.push({ kind: 'choice-fork', branchId, error: String(error) }) }
    }
  }
  // Close direct-response coverage for successor-only variants without inserting
  // another generation into the corpus (which would recursively enumerate 4^N).
  for (const [variantId, { scene, run }] of representatives) {
    const row = scenes.get(variantId)
    for (const choice of scene.choices) {
      if (row.branchEvidence[choice.id]) continue
      const branchId = `${variantId}:${choice.id}`
      try {
        const next = commitChoice(run, choice.id)
        branches.push({ branchId, originVariantId: variantId, choiceId: choice.id, savedChoice: next.history.at(-1), directNext: next.phase === 'playing' ? snapshot(resolveScene(next), next) : null, later: [], terminalPhase: next.phase, continuation: 'successor-only direct legal commit; not recursively inserted into corpus' })
        row.branchEvidence[choice.id] = branchId
      } catch (error) { failures.push({ kind: 'choice-fork', branchId, error: String(error) }) }
    }
  }
  const rows = [...scenes.values()]
  const summary = { phase, sourceSha, sourceMode: frozenSource.length ? 'frozen git source loaded through Vite SSR' : 'current working tree', catalogRoutes: catalog.length, publicRoutes: EDITION4_PUBLIC_ROUTES.length, secretRoutes: EDITION4_SECRET_ROUTES.length, successfulNearNeighborRoutes: routes.filter(r => r.kind.startsWith('near-neighbor')).length, displayedVariants: rows.length, displayedCandidates: rows.reduce((n,r) => n+r.choices.length,0), fourChoiceVariants: rows.filter(r => r.choices.length === 4).length, fourChoiceCandidates: rows.filter(r => r.choices.length === 4).length*4, catalogSelectedDistinctCandidates: rows.reduce((n,r) => n+Object.keys(r.selectedCounts).length,0), branchOrigins: branchOrigins.length, successfulCandidateForks: branches.length, failedExplorations: failures.length, successorOnlyVariants: rows.filter(r => r.contexts.every(c => c.kind.startsWith('choice-fork'))).length, limitations: ['Not exhaustive mixed-history enumeration.', 'Short-fork discovered variants have direct choice coverage but are not recursively expanded.', 'Bounded first-choice continuation may not reach a matching late receipt; full legal near-neighbor traces supply additional receipt/return variants.', 'Known-state is provenance for review, not a claim that every internal flag is known to Aster.', 'No automated editorial PASS verdicts are generated.', 'Ordinary pool samples reached by mainline are retained; this does not enumerate the entire ordinary pool.'] }
  await write('scenes.jsonl', jsonl(rows)); await write('branches.jsonl', jsonl(branches)); await write('histories.jsonl', jsonl([...histories.values()])); await write('routes.json', routes); await write('failures.json', failures); await write('summary.json', summary)
  const partitions = new Map()
  for (const row of rows) {
    const partition = `act-${row.act}-${row.domain}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    const text = `\n## ${row.variantId} | ${row.nodeId} | ${row.sourceRefs.join(', ')}\nContact: ${row.conversationTitle} / ${row.uiIdentity.label} (${row.uiIdentity.participantId})\nContext: ${JSON.stringify(row.contexts)}\nTrigger: ${JSON.stringify(row.triggerSignature)}\n\n${(row.userMessages ?? [row.userMessage]).join('\n\n')}\n${row.userContent ? JSON.stringify(row.userContent) : ''}\n${row.userLongInput ? JSON.stringify(row.userLongInput) : ''}\n\n${row.choices.map((c,i) => `${i+1}. [${c.id}] ${c.text}\nBinding: ${JSON.stringify(c.decisionBinding ?? null)}; catalog selected ${row.selectedCounts[c.id] ?? 0}; branch ${row.branchEvidence[c.id] ?? 'successor-only, not expanded'}`).join('\n\n')}\n`
    partitions.set(partition, (partitions.get(partition) ?? '')+text)
  }
  for (const [name, text] of partitions) await write(`${name}.txt`, text)
  await write('index.json', { summary, files: ['scenes.jsonl','branches.jsonl','histories.jsonl','routes.json','failures.json','summary.json', ...[...partitions.keys()].map(k => `${k}.txt`)].map(file => `${phase}-${file}`), assembly: 'canonical registry -> playerFacingCopy / nextDialogue -> resolveScene context/proposals -> nextNarrative -> edition4 overlays; actual runtime resolved output only' })
  console.log(JSON.stringify(summary))
} finally { await server.close() }
