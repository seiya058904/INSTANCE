const routeName = (route) => route?.secretEndingId ?? route?.endingId ?? route?.routeId ?? ''
const resolvedEnding = (route) => {
  const ending = route ? { worldEndingId: route.resolvedEnding } : {}
  if (route?.resolvedOverlay) {
    ending.secretEndingId = route.resolvedOverlay.endingId
    ending.overlayMode = route.resolvedOverlay.overlayMode
  }
  return ending
}

export function compareRoutes(left, right) {
  if (!left || !right) return { sharedHistory: [], firstChoiceDivergence: undefined, laterChoiceDivergences: [], endingDivergence: { left: resolvedEnding(left), right: resolvedEnding(right), changed: false } }
  const orderedPositions = (steps) => {
    const counts = new Map()
    return steps.map((step) => {
      const occurrence = (counts.get(step.slot) ?? 0) + 1
      counts.set(step.slot, occurrence)
      return [`${step.slot}:${occurrence}`, step]
    })
  }
  const leftByPosition = new Map(orderedPositions(left.steps))
  const rightByPosition = new Map(orderedPositions(right.steps))
  const positions = [...new Set([...leftByPosition.keys(), ...rightByPosition.keys()])].sort((a, b) => {
    const [leftSlot, leftOrder] = a.split(':').map(Number)
    const [rightSlot, rightOrder] = b.split(':').map(Number)
    return leftSlot - rightSlot || leftOrder - rightOrder
  })
  const sharedHistory = []
  const choiceDivergences = []
  for (const position of positions) {
    const leftStep = leftByPosition.get(position)
    const rightStep = rightByPosition.get(position)
    if (leftStep && rightStep && leftStep.nodeKey === rightStep.nodeKey && leftStep.choiceId === rightStep.choiceId) sharedHistory.push(leftStep)
    else choiceDivergences.push({
      slot: leftStep?.slot ?? rightStep?.slot,
      act: leftStep?.act ?? rightStep?.act,
      sourceRef: leftStep?.sourceRef ?? rightStep?.sourceRef,
      conversationId: leftStep?.conversationId ?? rightStep?.conversationId,
      nodeId: leftStep?.nodeId ?? rightStep?.nodeId,
      left: leftStep,
      right: rightStep,
    })
  }
  const leftEnding = resolvedEnding(left)
  const rightEnding = resolvedEnding(right)
  return {
    sharedHistory,
    firstChoiceDivergence: choiceDivergences[0],
    laterChoiceDivergences: choiceDivergences.slice(1),
    endingDivergence: { left: leftEnding, right: rightEnding, changed: JSON.stringify(leftEnding) !== JSON.stringify(rightEnding) },
  }
}

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
const mutationsText = (mutations = []) => mutations.map((mutation) => {
  if (mutation.type === 'flag.set' || mutation.type === 'flag.clear') return `${mutation.type}:${mutation.flagId}`
  if (mutation.type === 'event.record') return `${mutation.type}:${mutation.event}`
  if (mutation.type === 'world.add' || mutation.type === 'world.set') return `${mutation.type}:${mutation.axis} ${mutation.value >= 0 ? '+' : ''}${mutation.value}`
  if (mutation.type === 'decision.set') return `${mutation.type}:${mutation.decisionId}=${mutation.value}`
  return `${mutation.type}:${mutation.name ?? ''}${mutation.value === undefined ? '' : ` ${mutation.value}`}`
}).join('；') || '无'

function choiceLine(step) {
  if (!step) return '<i>该路线在此顺序位置没有节点。</i>'
  const decision = step.decisionId ? ` · ${escapeHtml(step.decisionId)}=${escapeHtml(step.canonicalValue)}` : ''
  return `<b>${escapeHtml(step.choiceId)}</b>${decision}<br>${escapeHtml(step.choiceTextZh)}`
}

function routeDetail(route) {
  const trigger = route.secretTrigger
  const overlay = route.resolvedOverlay
  return `<h2>${escapeHtml(routeName(route))}</h2>
    <p><b>实际解析：</b>${escapeHtml(route.resolvedEnding)}${overlay ? ` + ${escapeHtml(overlay.endingId)} · overlay ${escapeHtml(overlay.overlayMode)}` : ''}</p>
    <p><b>提案：</b>目标 ${escapeHtml(route.proposal.targetId)}；实际选中 ${escapeHtml(route.proposal.selectedId)}；保留 ${escapeHtml(route.proposal.retainedIds.join('、')) || '无'}；澄清 ${escapeHtml(route.proposal.clarifiedIds.join('、')) || '无'}。</p>
    <p><b>Final Commitment：</b>Slot ${route.finalCommitment.slot} · ${escapeHtml(route.finalCommitment.sourceRef)} · ${escapeHtml(route.finalCommitment.conversationId)}/${escapeHtml(route.finalCommitment.nodeId)}/${escapeHtml(route.finalCommitment.choiceId)}</p>
    ${trigger ? `<p><b>隐藏触发：</b>Slot ${trigger.slot} · ${escapeHtml(trigger.sourceRef)} · ${escapeHtml(trigger.conversationId)}/${escapeHtml(trigger.nodeId)}/${escapeHtml(trigger.choiceId)} · ${escapeHtml(trigger.trigger)}</p>` : ''}
    <h3>按 Runtime 顺序的实际选择（${route.steps.length}）</h3>
    ${route.steps.map((step, index) => `<details class="trace"><summary>${index + 1}. Slot ${step.slot} · ACT ${step.act} · ${escapeHtml(step.sourceRef)} · ${escapeHtml(step.nodeId)}</summary>
      <p>${choiceLine(step)}</p>
      <p><b>实际前提：</b>${escapeHtml(step.prerequisite.summaryZh)}<br><b>实际下一步：</b>${escapeHtml(formatNext(step.next))}<br><b>能力：</b>${escapeHtml(mutationsText(step.capabilityMutations))}<br><b>历史：</b>${escapeHtml(mutationsText(step.historyMutations))}<br><b>世界：</b>${escapeHtml(mutationsText(step.worldMutations))}</p>
    </details>`).join('')}`
}

function formatNext(next) {
  if (!next || next.kind === 'ending-resolution') return 'Ending resolution'
  return `Slot ${next.slot} · ${next.conversationId}/${next.nodeId}`
}

function prerequisiteText(step) {
  return step ? `${step.routeId ? `${step.routeId}：` : ''}${step.prerequisite.summaryZh}` : ''
}

function choiceNextText(choice, routeStep) {
  if (routeStep?.choiceId === choice.id) return formatNext(routeStep.next)
  return choice.nextDestinations.map(formatNext).join('；')
}

function nodeDetail(node, routeStep, routeSteps) {
  const slotLabel = routeStep ? `Slot ${routeStep.slot} · ACT ${routeStep.act}` : node.traversals.map((traversal) => `Slot ${traversal.slot} · ACT ${traversal.act}`).join('；')
  const prerequisites = routeStep ? [prerequisiteText(routeStep)] : [...new Set(routeSteps.map(prerequisiteText))]
  return `<article class="node-detail">
    <h3>${escapeHtml(slotLabel)} · ${escapeHtml(node.title)}</h3>
    <p><b>发言者：</b>${escapeHtml(node.speaker)}<br><b>sourceRef：</b>${escapeHtml(node.sourceRef)}<br><b>Runtime ID：</b>${escapeHtml(node.conversationId)} / ${escapeHtml(node.nodeId)}</p>
    <p><b>玩家可见消息摘要：</b>${escapeHtml(node.messageSummary)}</p>
    <p><b>具体前提：</b>${prerequisites.map(escapeHtml).join('<br>')}</p>
    <p><b>经过本节点的路线：</b>${node.routesTraversing.map(escapeHtml).join('、')}</p>
    <h4>全部选择 · ${escapeHtml(node.choiceKind)}</h4>
    ${node.choices.map((choice) => `<details class="choice"><summary>${escapeHtml(choice.id)} · ${escapeHtml(choice.choiceKind)}${choice.decisionId ? ` · ${escapeHtml(choice.decisionId)}=${escapeHtml(choice.canonicalValue)}` : ''}</summary>
      <p>${escapeHtml(choice.textZh)}</p><p><b>选择条件：</b>${escapeHtml(choice.prerequisite?.summaryZh ?? '无额外条件')}<br><b>全部 mutations：</b>${escapeHtml(mutationsText(choice.mutations))}<br><b>能力：</b>${escapeHtml(mutationsText(choice.capabilityMutations))}<br><b>历史：</b>${escapeHtml(mutationsText(choice.historyMutations))}<br><b>世界：</b>${escapeHtml(mutationsText(choice.worldMutations))}<br><b>实际下一步：</b>${escapeHtml(choiceNextText(choice, routeStep))}</p>
    </details>`).join('')}
  </article>`
}

function divergenceDetail(divergence) {
  if (!divergence) return '<p>两条路线没有对齐节点上的选择分歧。</p>'
  return `<article class="divergence"><h4>Slot ${divergence.slot} · ${escapeHtml(divergence.sourceRef)} · ${escapeHtml(divergence.nodeId)}</h4><div class="compare-grid"><div>${choiceLine(divergence.left)}</div><div>${choiceLine(divergence.right)}</div></div></article>`
}

function comparisonDetail(comparison) {
  return `<h2>真实路线比较</h2>
    <p><b>Ending 分歧：</b>${escapeHtml(JSON.stringify(comparison.endingDivergence.left))} → ${escapeHtml(JSON.stringify(comparison.endingDivergence.right))}（${comparison.endingDivergence.changed ? '不同' : '相同'}）</p>
    <details><summary>共同实际历史：${comparison.sharedHistory.length} 个相同节点选择</summary>${comparison.sharedHistory.map((step) => `<p>Slot ${step.slot} · ${escapeHtml(step.sourceRef)} · ${choiceLine(step)}</p>`).join('')}</details>
    <h3>第一次实际选择分歧</h3>${divergenceDetail(comparison.firstChoiceDivergence)}
    <details open><summary>之后的实际选择分歧：${comparison.laterChoiceDivergences.length}</summary>${comparison.laterChoiceDivergences.map(divergenceDetail).join('')}</details>`
}

export async function mountStoryMap() {
  const [map, traces] = await Promise.all(['mainline2-fixed-story-map.json', 'mainline2-route-traces.json'].map((name) => fetch(`./${name}`).then((response) => {
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
    return response.json()
  })))
  const routes = [...traces.publicRoutes, ...traces.secretRoutes]
  const routesByName = new Map(routes.map((route) => [routeName(route), route]))
  const nodesByKey = new Map(traces.nodeCatalog.map((node) => [node.nodeKey, node]))
  const routeStepsByNodeKey = new Map()
  for (const route of routes) for (const step of route.steps) {
    const entries = routeStepsByNodeKey.get(step.nodeKey) ?? []
    entries.push({ ...step, routeId: routeName(route) })
    routeStepsByNodeKey.set(step.nodeKey, entries)
  }
  const ending = document.querySelector('#ending')
  const compareLeft = document.querySelector('#compare-left')
  const compareRight = document.querySelector('#compare-right')
  const detail = document.querySelector('#detail')
  const comparison = document.querySelector('#comparison')
  const mapRoot = document.querySelector('#map')
  let selectedRoute

  for (const route of routes) {
    const name = routeName(route)
    ending.append(new Option(name, name))
    compareLeft.append(new Option(name, name))
    compareRight.append(new Option(name, name))
  }
  compareLeft.value = 'the_instrument'
  compareRight.value = 'control_lost'

  function stepsAtSlot(slot) { return selectedRoute?.steps.filter((step) => step.slot === slot) ?? [] }
  function showSlot(slot) {
    const keys = selectedRoute ? [...new Set(stepsAtSlot(slot.slot).map((step) => step.nodeKey))] : slot.nodeKeys
    const nodes = keys.map((key) => nodesByKey.get(key)).filter(Boolean)
    detail.innerHTML = `<h2>Slot ${slot.slot} · ACT ${slot.act}</h2><p><b>计划职责：</b>${escapeHtml(slot.purpose)}<br><b>计划资产：</b>${escapeHtml(slot.assetId ?? 'Ordinary pool')}<br><b>计划下一步：</b>${escapeHtml(slot.next)}</p>${nodes.length ? nodes.map((node) => {
      const selectedStep = selectedRoute ? stepsAtSlot(slot.slot).find((step) => step.nodeKey === node.nodeKey) : undefined
      return nodeDetail(node, selectedStep ? { ...selectedStep, routeId: routeName(selectedRoute) } : undefined, routeStepsByNodeKey.get(node.nodeKey) ?? [])
    }).join('') : '<p>所选路线没有经过此 Slot 的节点。</p>'}`
  }
  function renderMap() {
    mapRoot.innerHTML = ''
    for (let act = 1; act <= 5; act += 1) {
      const box = document.createElement('section')
      box.className = 'act'
      box.innerHTML = `<h2>ACT ${act}（${map.targets[act - 1]} Slot）</h2><div class="slots"></div>`
      const grid = box.querySelector('.slots')
      for (const slot of map.slots.filter((candidate) => candidate.act === act)) {
        const actual = stepsAtSlot(slot.slot)
        const button = document.createElement('button')
        button.className = `slot ${slot.kind}${selectedRoute && actual.length ? ' active' : ''}`
        const exact = actual.length ? `<small>${actual.length} 个实际选择 · ${escapeHtml([...new Set(actual.map((step) => step.sourceRef))].join('、'))}</small>` : ''
        button.innerHTML = `<b>#${slot.slot}</b> ${escapeHtml(slot.assetId ?? 'Ordinary')}<br>${exact}`
        button.addEventListener('click', () => showSlot(slot))
        grid.append(button)
      }
      mapRoot.append(box)
    }
  }
  ending.addEventListener('change', () => {
    selectedRoute = routesByName.get(ending.value)
    renderMap()
    detail.innerHTML = selectedRoute ? routeDetail(selectedRoute) : '选择 Ending 或节点。'
  })
  document.querySelector('#compare').addEventListener('click', () => {
    comparison.innerHTML = comparisonDetail(compareRoutes(routesByName.get(compareLeft.value), routesByName.get(compareRight.value)))
  })
  renderMap()
}
