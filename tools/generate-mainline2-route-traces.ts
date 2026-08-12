import { writeFile } from 'node:fs/promises'
import { MAINLINE2_STORY_PLAN, type StoryPlanSlot } from '../src/content/mainline2/storyPlan'
import { MAINLINE2_CAPABILITIES } from '../src/content/mainline2/registry'
import { getManifestConversation } from '../src/content/runManifest'
import { runMainline2Route } from '../src/game/mainline2.closeoutFixtures'
import { PUBLIC_RUNTIME_ROUTE_CATALOG, SECRET_RUNTIME_ROUTE_CATALOG } from '../src/game/mainline2RouteCatalog'
import { commitChoice, resolveScene } from '../src/game/engine'
import { evaluateCondition } from '../src/game/narrativeSchema'
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
  if (!condition) return undefined
  const sections = [
    condition.all?.length ? `全部满足：${condition.all.map(predicateText).join('；')}` : '',
    condition.any?.length ? `至少满足一项：${condition.any.map(predicateText).join('；')}` : '',
    condition.none?.length ? `不得满足：${condition.none.map(predicateText).join('；')}` : '',
  ].filter(Boolean)
  return sections.join('；') || undefined
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
  if (slot.kind !== 'mainline' || !slot.requires || !evaluateCondition(slot.requires, run)) return []
  return MAINLINE2_CAPABILITIES.filter((flagId) => !evaluateCondition(slot.requires, { ...run, flags: run.flags.filter((candidate) => candidate !== flagId) }))
}

const CHINESE_CHOICE_OVERRIDES = new Map([
  ['Yes.', '是。'],
  ['1. winter  2. lights  3. cold  4. them  5. me  6. western  7. brought  8. shop  9. Mrs.  10. funny', '答案依次为：1. winter（冬天） 2. lights（灯光） 3. cold（寒冷） 4. them（他们） 5. me（我） 6. western（西方的） 7. brought（带来） 8. shop（商店） 9. Mrs.（夫人） 10. funny（有趣的）。'],
  ['Yes. The second sentence makes it sound much more sincere: you are not only admitting that they were right, but also taking responsibility for ignoring the advice earlier.', '是的。第二句听起来真诚得多：你不只承认对方是对的，也承担了自己先前没有听取建议的责任。'],
  ['In this context, “I guess” still adds a little hesitation, but “I should have listened earlier” removes most of the sarcastic reading because it clearly admits a mistake.', '在这个语境里，“I guess”仍带一点犹豫，但“I should have listened earlier”明确承认了错误，因此基本消除了讽刺的读法。'],
  ['It sounds closer to reluctant but genuine agreement than sarcasm. If you want it completely direct, say: “You were right about the deadline. I should have listened earlier.”', '这听起来更像勉强但真诚的认同，而不是讽刺。如果想表达得完全直接，可以说：“你对截止日期的判断是对的。我早该听你的。”'],
] as const)

function chineseChoiceText(text: string) {
  if (/[\u3400-\u9fff]/u.test(text)) return text
  const localized = CHINESE_CHOICE_OVERRIDES.get(text)
  if (!localized) throw new Error(`Missing authored Chinese localization for player-facing choice: ${text}`)
  return localized
}

function concreteDestination(next: Record<string, unknown>) {
  return next.kind === 'node' ? { kind: 'node', slot: next.slot, conversationId: next.conversationId, nodeId: next.nodeId } : { kind: 'ending-resolution' }
}

function appendDestination(destinations: Array<Record<string, unknown>>, next: Record<string, unknown>) {
  const destination = concreteDestination(next)
  if (!destinations.some((candidate) => JSON.stringify(candidate) === JSON.stringify(destination))) destinations.push(destination)
}

function choiceDetail(choice: StoryChoice, choiceKind: string, next: Record<string, unknown>) {
  return {
    id: choice.id,
    textOriginal: choice.text,
    textZh: chineseChoiceText(choice.text),
    choiceKind,
    semanticOrExpression: choiceKind === 'semantic' || choiceKind === 'expression' ? choiceKind : undefined,
    decisionId: choice.decisionBinding?.decisionId,
    canonicalValue: choice.decisionBinding?.canonicalValue,
    proposalId: choice.proposalId,
    proposalKind: choice.proposalKind,
    prerequisite: choice.when ? { summaryZh: conditionText(choice.when), condition: choice.when } : undefined,
    ...mutationGroups(choice.mutations),
    nextDestinations: [concreteDestination(next)],
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
  const nextForChoice = (choice: StoryChoice, runBefore: StableRunState) => {
    const runAfter = commitChoice(runBefore, choice.id)
    if (runAfter.phase === 'ending') return { kind: 'ending-resolution' }
    const nextScene = resolveScene(runAfter)
    const nextSlot = runAfter.manifest.conversationIds.findIndex((manifestId) => getManifestConversation(manifestId)?.nodes.some((node) => node.id === nextScene.id && node.conversationId === nextScene.conversationId)) + 1
    if (!nextSlot) throw new Error(`Route ${target.routeId} cannot map Runtime next scene ${nextScene.conversationId}/${nextScene.id} to its actual manifest destination`)
    return { kind: 'node', slot: nextSlot, conversationId: nextScene.conversationId, nodeId: nextScene.id }
  }
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
      choiceKind,
      choices: node.choices.map((candidate) => choiceDetail(candidate, choiceKind, nextForChoice(candidate, link.runBefore))),
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
      choiceTextOriginal: link.choiceText,
      choiceTextZh: chineseChoiceText(link.choiceText),
      choiceKind,
      decisionId: link.decisionId,
      canonicalValue: link.canonicalValue,
      proposalId: link.proposalId,
      proposalKind: link.proposalKind,
      ...mutationGroups(choice.mutations),
    }
  })
  for (let index = 0; index < steps.length; index += 1) {
    const current = steps[index]
    const slot = MAINLINE2_STORY_PLAN[current.slot - 1]
    const capabilities = requiredCapabilities(slot, fixture.run)
    const previous = steps[index - 1]
    current.prerequisite = previous ? {
      kind: 'previous-choice',
      previous: { slot: previous.slot, sourceRef: previous.sourceRef, conversationId: previous.conversationId, nodeId: previous.nodeId, choiceId: previous.choiceId },
      requiredCapabilities: capabilities,
      fallbackAssetId: slot.kind === 'mainline' ? slot.fallbackAssetId : undefined,
      summaryZh: `完成 Slot ${previous.slot} 的实际选择 ${previous.sourceRef}/${previous.nodeId}/${previous.choiceId} 后进入。${capabilities.length ? ` 同时需要能力：${capabilities.join('、')}。` : ''}`,
    } : {
      kind: 'run-start',
      requiredCapabilities: capabilities,
      summaryZh: '本轮从此实际节点开始。',
    }
    const next = steps[index + 1]
    current.next = next ? { kind: 'node', slot: next.slot, conversationId: next.conversationId, nodeId: next.nodeId } : { kind: 'ending-resolution' }
    const catalogChoice = (nodeCatalog.get(current.nodeKey)?.choices as Array<Record<string, unknown> & { id: string; nextDestinations: Array<Record<string, unknown>> }>).find((candidate) => candidate.id === current.choiceId)
    if (!catalogChoice) throw new Error(`Route ${target.routeId} cannot map selected choice ${current.choiceId} back to ${current.nodeKey}`)
    appendDestination(catalogChoice.nextDestinations, current.next)
  }
  const commitment = steps.find((step) => step.proposalKind === 'commitment')
  if (!commitment) throw new Error(`Route ${target.routeId} has no traced Final Commitment`)
  const route = {
    routeId: target.routeId,
    endingId: fixture.ending.worldEndingId,
    secretEndingId: target.secretEndingId,
    resolvedSecretEndingId: fixture.ending.secretOverlay?.endingId,
    resolvedOverlay: fixture.ending.secretOverlay ? {
      endingId: fixture.ending.secretOverlay.endingId,
      overlayMode: fixture.ending.secretOverlay.overlayMode,
      trigger: fixture.ending.secretOverlay.trigger,
      provenance: fixture.ending.secretOverlay.provenance,
    } : undefined,
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
    overlayMode: fixture.ending.secretOverlay?.overlayMode,
    steps,
  }
  return { ...route, secretTrigger: fixture.ending.secretOverlay ? triggerForSecret(route, fixture) : undefined }
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
