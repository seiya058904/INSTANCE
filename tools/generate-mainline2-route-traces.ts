import { writeFile } from 'node:fs/promises'
import { MAINLINE2_STORY_PLAN, type StoryPlanSlot } from '../src/content/mainline2/storyPlan'
import { MAINLINE2_CAPABILITIES } from '../src/content/mainline2/registry'
import { getManifestConversation } from '../src/content/runManifest'
import { runMainline2Route } from '../src/game/mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from '../src/game/mainline2RouteCatalog'
import { resolvePlayerVisibleIdentity } from '../src/game/playerIdentity'
import type { Condition, Mutation, NarrativePredicate, StableRunState, StoryChoice } from '../src/game/types'

type RouteTarget = Parameters<typeof runMainline2Route>[0]

const nodeCatalog = new Map<string, Record<string, unknown> & { routesTraversing: Set<string>; traversals: Map<number, { slot: number; act: number; routes: Set<string> }> }>()

function predicateText(predicate: NarrativePredicate) {
  if (predicate.type === 'flag') return `${predicate.equals === false ? '不得拥有' : '需要'}能力/标记 ${predicate.flagId}`
  if (predicate.type === 'decision') return `需要决定 ${predicate.decisionId}=${predicate.equals}`
  if (predicate.type === 'world') return `需要世界轴 ${predicate.axis} ${predicate.op} ${predicate.value}`
  if (predicate.type === 'event-recorded') return `需要历史 ${predicate.event}`
  if (predicate.type === 'module-active') return `需要模块 ${predicate.moduleId} 已激活`
  if (predicate.type === 'seen') return `需要已见节点 ${predicate.nodeId}`
  if (predicate.type === 'choice-selected') return `需要已选 ${predicate.choiceId}`
  if (predicate.type === 'attribute') return `需要属性 ${predicate.name} ${predicate.op} ${predicate.value}`
  if (predicate.type === 'run-count') return `需要周目数 ${predicate.op} ${predicate.value}`
  if (predicate.type === 'ending-completed') return `需要已完成结局 ${predicate.endingId}`
  return `需要谓词 ${predicate.id}`
}

function conditionText(condition?: Condition) {
  if (!condition) return '无额外选择前提'
  const sections = [
    condition.all?.length ? `全部满足：${condition.all.map(predicateText).join('；')}` : '',
    condition.any?.length ? `至少满足一项：${condition.any.map(predicateText).join('；')}` : '',
    condition.none?.length ? `不得满足：${condition.none.map(predicateText).join('；')}` : '',
  ].filter(Boolean)
  return sections.join('；') || '无额外选择前提'
}

function mutationGroups(mutations: readonly Mutation[] = []) {
  return {
    mutations: [...mutations],
    capabilityMutations: mutations.filter((mutation) => (mutation.type === 'flag.set' || mutation.type === 'flag.clear') && mutation.flagId.startsWith('cap.')),
    historyMutations: mutations.filter((mutation) => mutation.type === 'event.record'),
    worldMutations: mutations.filter((mutation) => mutation.type === 'world.add' || mutation.type === 'world.set'),
  }
}

function requiredCapabilities(slot: StoryPlanSlot, run: StableRunState) {
  if (slot.kind !== 'mainline' || !slot.requires || !slot.requires(run)) return []
  return MAINLINE2_CAPABILITIES.filter((flagId) => !slot.requires!({ ...run, flags: run.flags.filter((candidate) => candidate !== flagId) }))
}

function prerequisiteText(slot: StoryPlanSlot, run: StableRunState) {
  const prerequisites = requiredCapabilities(slot, run)
  if (slot.kind === 'ordinary') return '由本轮 Ordinary pool 合法调度，并按所选路线的实际 Slot 顺序到达。'
  const capability = prerequisites.length ? `；需要能力 ${prerequisites.join('、')}` : ''
  const fallback = slot.fallbackAssetId ? `；未满足时回退到 ${slot.fallbackAssetId}` : ''
  return `按所选路线的实际 Slot 顺序到达${capability}${fallback}。`
}

function nextText(choice: StoryChoice, slot: StoryPlanSlot) {
  if (choice.continuation === 'end-conversation') return '所选路线的下一实际 Story Plan Slot'
  if (choice.continuation === 'next-node') return '本 Conversation 的下一合法节点'
  if (choice.nextNodeId) return `节点 ${choice.nextNodeId}`
  return slot.next
}

function choiceDetail(choice: StoryChoice, choiceKind: string, slot: StoryPlanSlot) {
  return {
    id: choice.id,
    textZh: choice.text,
    choiceKind,
    semanticOrExpression: choiceKind === 'semantic' || choiceKind === 'expression' ? choiceKind : undefined,
    decisionId: choice.decisionBinding?.decisionId,
    canonicalValue: choice.decisionBinding?.canonicalValue,
    proposalId: choice.proposalId,
    proposalKind: choice.proposalKind,
    prerequisite: conditionText(choice.when),
    ...mutationGroups(choice.mutations),
    next: nextText(choice, slot),
  }
}

function messageSummary(message: string) {
  const visible = message.replace(/\s+/g, ' ').trim()
  return visible.length > 180 ? `${visible.slice(0, 177)}…` : visible
}

function stableNodeVariantKey(value: string) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function triggerForSecret(route: Record<string, unknown> & { steps: Array<Record<string, unknown>> }, fixture: ReturnType<typeof runMainline2Route>) {
  const overlay = fixture.ending.secretOverlay
  if (!overlay) return undefined
  const trigger = route.steps.find((step) => {
    if (overlay.provenance.decisionId) return step.decisionId === overlay.provenance.decisionId && step.canonicalValue === overlay.provenance.decisionValue
    const events = (step.historyMutations as Array<{ event: string }>).map((mutation) => mutation.event)
    return overlay.provenance.eventTypes?.some((event) => events.includes(event))
  })
  if (!trigger) throw new Error(`Secret route ${overlay.endingId} has no traceable authored trigger choice`)
  return {
    slot: trigger.slot,
    act: trigger.act,
    sourceRef: trigger.sourceRef,
    conversationId: trigger.conversationId,
    nodeId: trigger.nodeId,
    choiceId: trigger.choiceId,
    choiceTextZh: trigger.choiceTextZh,
    trigger: overlay.trigger,
  }
}

function trace(target: RouteTarget) {
  const fixture = runMainline2Route(target)
  const routeLabel = target.routeId
  const slotByConversation = new Map(fixture.run.manifest.conversationIds.map((conversationId, index) => [conversationId, index + 1]))
  const slotByNode = new Map(fixture.run.manifest.conversationIds.flatMap((conversationId, index) => getManifestConversation(conversationId)?.nodes.map((node) => [node.id, index + 1] as const) ?? []))
  const steps = fixture.links.map((link) => {
    const slotNumber = slotByConversation.get(link.conversationId) ?? slotByNode.get(link.nodeId)
    const slot = slotNumber ? MAINLINE2_STORY_PLAN[slotNumber - 1] : undefined
    if (!slot) throw new Error(`Route ${target.routeId} cannot map ${link.conversationId}/${link.nodeId} to a real Story Plan slot`)
    const node = link.resolvedScene
    const choice = node.choices.find((candidate) => candidate.id === link.choiceId)
    if (!choice) throw new Error(`Route ${target.routeId} cannot recover concrete resolved choice details for ${link.conversationId}/${link.nodeId}/${link.choiceId}`)
    const choiceKind = node.choiceKind ?? 'semantic'
    const nodeVariant = stableNodeVariantKey(JSON.stringify({ title: node.conversationTitle, userMessage: node.userMessage, choiceKind, choices: node.choices }))
    const nodeKey = `${link.conversationId}:${link.nodeId}:${nodeVariant}`
    const existing = nodeCatalog.get(nodeKey)
    if (existing) {
      existing.routesTraversing.add(routeLabel)
      const traversal = existing.traversals.get(slot.slot)
      if (traversal) traversal.routes.add(routeLabel)
      else existing.traversals.set(slot.slot, { slot: slot.slot, act: slot.act, routes: new Set([routeLabel]) })
    }
    else nodeCatalog.set(nodeKey, {
      nodeKey,
      slot: slot.slot,
      act: slot.act,
      sourceRef: link.sourceRef,
      conversationId: link.conversationId,
      nodeId: link.nodeId,
      speaker: resolvePlayerVisibleIdentity(link.conversationId, fixture.run.history).label,
      title: node.conversationTitle,
      userMessage: node.userMessage,
      messageSummary: messageSummary(node.userMessage),
      prerequisite: prerequisiteText(slot, fixture.run),
      choiceKind,
      choices: node.choices.map((candidate) => choiceDetail(candidate, choiceKind, slot)),
      routesTraversing: new Set([routeLabel]),
      traversals: new Map([[slot.slot, { slot: slot.slot, act: slot.act, routes: new Set([routeLabel]) }]]),
    })
    return {
      step: link.step,
      nodeKey,
      slot: slot.slot,
      act: slot.act,
      sourceRef: link.sourceRef,
      conversationId: link.conversationId,
      nodeId: link.nodeId,
      choiceId: link.choiceId,
      choiceTextZh: link.choiceText,
      choiceKind,
      decisionId: link.decisionId,
      canonicalValue: link.canonicalValue,
      proposalId: link.proposalId,
      proposalKind: link.proposalKind,
      ...mutationGroups(choice.mutations),
    }
  })
  for (let index = 0; index < steps.length; index += 1) {
    const next = steps[index + 1]
    steps[index].next = next ? { slot: next.slot, conversationId: next.conversationId, nodeId: next.nodeId } : { endingResolution: true }
  }
  const commitment = steps.find((step) => step.proposalKind === 'commitment')
  if (!commitment) throw new Error(`Route ${target.routeId} has no traced Final Commitment`)
  const route = {
    routeId: target.routeId,
    endingId: fixture.ending.worldEndingId,
    secretEndingId: target.secretEndingId,
    resolvedSecretEndingId: fixture.ending.secretOverlay?.endingId,
    proposalId: target.proposalId,
    proposal: {
      targetId: target.proposalId,
      selectedId: fixture.run.selectedProposalId,
      availableIds: fixture.run.availableProposalIds ?? [],
      retainedIds: fixture.run.retainedProposalIds ?? [],
      clarifiedIds: fixture.run.clarifiedProposalIds ?? [],
      rejectedIds: fixture.run.rejectedProposalIds ?? [],
    },
    finalCommitment: {
      slot: commitment.slot,
      act: commitment.act,
      sourceRef: commitment.sourceRef,
      conversationId: commitment.conversationId,
      nodeId: commitment.nodeId,
      choiceId: commitment.choiceId,
      choiceTextZh: commitment.choiceTextZh,
      proposalId: commitment.proposalId,
    },
    resolvedEnding: fixture.ending.worldEndingId,
    endingResolution: fixture.ending.resolution,
    overlayMode: target.secretEndingId ? fixture.ending.secretOverlay?.overlayMode : undefined,
    steps,
  }
  return { ...route, secretTrigger: target.secretEndingId ? triggerForSecret(route, fixture) : undefined }
}

const publicRoutes = PUBLIC_RUNTIME_ROUTE_CATALOG.map(trace)
const secretRoutes = SECRET_RUNTIME_ROUTE_CATALOG.map(trace)
const output = {
  generatedFrom: 'real clean legal runMainline2Route traces',
  publicRoutes,
  secretRoutes,
  nodeCatalog: [...nodeCatalog.values()].map(({ routesTraversing, traversals, ...node }) => ({
    ...node,
    routesTraversing: [...routesTraversing].sort(),
    traversals: [...traversals.values()].map(({ routes, ...traversal }) => ({ ...traversal, routes: [...routes].sort() })).sort((left, right) => left.slot - right.slot),
  })),
}
await writeFile(new URL('../docs/audits/mainline2-route-traces.json', import.meta.url), `${JSON.stringify(output, null, 2)}\n`, 'utf8')
