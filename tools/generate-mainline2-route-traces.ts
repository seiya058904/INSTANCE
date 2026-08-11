import { writeFile } from 'node:fs/promises'
import { MAINLINE2_STORY_PLAN } from '../src/content/mainline2/storyPlan'
import { MAINLINE2_BY_ID } from '../src/content/mainline2/registry'
import { runMainline2Route } from '../src/game/mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from '../src/game/mainline2RouteCatalog'

const slotByConversation = new Map(MAINLINE2_STORY_PLAN.filter((slot) => slot.kind === 'mainline').map((slot) => [slot.conversationId, slot]))
function trace(target: Parameters<typeof runMainline2Route>[0]) {
  const fixture = runMainline2Route(target)
  return {
    endingId: fixture.ending.worldEndingId,
    secretEndingId: fixture.ending.secretOverlay?.endingId,
    proposalId: target.proposalId,
    resolvedEnding: fixture.ending.worldEndingId,
    overlayMode: fixture.ending.secretOverlay?.overlayMode,
    steps: fixture.links.map((link) => {
      const conversation = MAINLINE2_BY_ID.get(link.conversationId)
      const node = conversation?.nodes.find((candidate) => candidate.id === link.nodeId)
      const choice = node?.choices.find((candidate) => candidate.id === link.choiceId)
      const slot = slotByConversation.get(link.conversationId)
      return { slot: slot?.slot, act: slot?.act, sourceRef: link.sourceRef, conversationId: link.conversationId, nodeId: link.nodeId, title: node?.conversationTitle, userMessage: node?.userMessage, choiceId: link.choiceId, choiceText: link.choiceText, choiceKind: node?.choiceKind, decisionId: link.decisionId, canonicalValue: link.canonicalValue, mutations: choice?.mutations ?? [], proposalId: link.proposalId }
    }),
  }
}
const output = { generatedFrom: 'real clean legal runMainline2Route traces', publicRoutes: PUBLIC_RUNTIME_ROUTE_CATALOG.map(trace), secretRoutes: SECRET_RUNTIME_ROUTE_CATALOG.map(trace) }
await writeFile(new URL('../docs/audits/mainline2-route-traces.json', import.meta.url), `${JSON.stringify(output, null, 2)}\n`, 'utf8')
