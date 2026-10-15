import { createServer } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'

// Execute real authored choices. Never seed history, world state or an ending.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { runMainline2Route } = await server.ssrLoadModule('/src/game/mainline2.closeoutFixtures.ts')
  const { EDITION4_PUBLIC_ROUTES, EDITION4_SECRET_ROUTES } = await server.ssrLoadModule('/src/game/mainline2Edition4RouteCatalog.ts')
  const { proposalContract } = await server.ssrLoadModule('/src/content/mainline2/proposalPresentation.ts')
  const { getFutureProposalById } = await server.ssrLoadModule('/src/content/mainline2/proposals.ts')
  const results = [...EDITION4_PUBLIC_ROUTES, ...EDITION4_SECRET_ROUTES].map(target => {
    const f = runMainline2Route(target)
    if (f.links[0].runBefore.history.length || (target.secretEndingId ? f.ending.secretOverlay?.endingId !== target.secretEndingId : f.ending.worldEndingId !== target.endingId)) throw Error(`Route failed: ${target.routeId}`)
    const commit = f.links.find(l => l.proposalKind === 'commitment')
    const definition = getFutureProposalById(commit.proposalId)
    const stages = [f.links.find(l => l.proposalKind === 'proposal'), f.links.find(l => l.proposalKind === 'clarification'), commit]
    const contracts = stages.map(l => JSON.stringify(proposalContract(l.runBefore, definition)))
    if (new Set(contracts).size !== 1 || JSON.stringify(proposalContract(f.run, definition)) !== contracts[0]) throw Error(`M16/M17/archive contract drift: ${target.routeId}`)
    return {
      route: target.routeId, world: f.ending.worldEndingId, requestedSecret: target.secretEndingId, secret: f.ending.secretOverlay?.endingId,
      calendar: f.run.mainlineCalendarVersion, causality: f.run.mainlineCausalityVersion,
      choices: f.links.length, conversations: f.run.manifest.conversationIds.length,
      contractStagesIdentical: true,
      contract: proposalContract(commit.runBefore, getFutureProposalById(commit.proposalId)),
      path: f.links.map(l => ({ node: l.nodeId, choice: l.choiceId, ...(l.nodeId.startsWith('v4-') ? { prompt: l.resolvedScene.userMessage, reply: l.choiceText } : {}) })),
      history: f.ending.keyHistory,
    }
  })
  await mkdir('docs/audits/ending-first-final', { recursive: true })
  await writeFile('docs/audits/ending-first-final/EDITION4_ROUTE_EVIDENCE.json', JSON.stringify({ method: 'Empty history -> resolveScene -> legal commitChoice -> explicit M17 commitment; no ending injection', results }, null, 2) + '\n')
  console.log(JSON.stringify({ public: EDITION4_PUBLIC_ROUTES.length, hidden: EDITION4_SECRET_ROUTES.length, conversationRange: [Math.min(...results.map(r => r.conversations)), Math.max(...results.map(r => r.conversations))], choiceRange: [Math.min(...results.map(r => r.choices)), Math.max(...results.map(r => r.choices))] }))
} finally { await server.close() }
