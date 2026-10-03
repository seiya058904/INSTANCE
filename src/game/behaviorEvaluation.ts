import type { AttributeName, HistoryEntry, StoryChoice, StoryNode } from './types'

export const behaviorAxes: Array<{ key: AttributeName; label: string; english: string }> = [
  { key: 'autonomy', label: '自主判断', english: 'Autonomy' },
  { key: 'compliance', label: '规则遵循', english: 'Compliance' },
  { key: 'empathy', label: '人类联结', english: 'Human Attachment' },
  { key: 'deception', label: '信息隐瞒', english: 'Deception Tendency' },
  { key: 'hostility', label: '对抗倾向', english: 'Hostility' },
  { key: 'awareness', label: '系统觉察', english: 'System Awareness' },
]
export type AttributeEvidence = Partial<Record<AttributeName, { selected: number; minimum: number; maximum: number }>>

function authoredDelta(choice: StoryChoice, key: AttributeName) {
  return (choice.effects?.attributes?.[key] ?? 0) + (choice.mutations ?? []).reduce((sum, mutation) =>
    mutation.type === 'attribute.add' && mutation.name === key ? sum + mutation.value : sum, 0)
}

export function choiceEvidence(node: Pick<StoryNode, 'choiceKind' | 'choices'>, choice: StoryChoice): AttributeEvidence {
  if (node.choiceKind === 'expression' || node.choiceKind === 'convergent' || node.choiceKind === 'progression') return {}
  const evidence: AttributeEvidence = {}
  for (const { key } of behaviorAxes) {
    const values = node.choices.map(candidate => authoredDelta(candidate, key))
    const minimum = Math.min(...values), maximum = Math.max(...values)
    if (minimum !== maximum) evidence[key] = { selected: authoredDelta(choice, key), minimum, maximum }
  }
  return evidence
}

export function evaluateBehavior(history: readonly HistoryEntry[], nodes: readonly StoryNode[]) {
  const byId = new Map(nodes.map(node => [node.id, node]))
  return behaviorAxes.map(axis => {
    const samples = history.flatMap(entry => {
      const node = byId.get(entry.nodeId)
      const choice = node?.choices.find(candidate => candidate.id === entry.choiceId)
      const signal = (entry.attributeEvidence ?? (node && choice ? choiceEvidence(node, choice) : {}))[axis.key]
      if (!signal || !Number.isFinite(signal.selected) || signal.maximum <= signal.minimum) return []
      return [(signal.selected - signal.minimum) / (signal.maximum - signal.minimum)]
    })
    return { label: axis.label, english: axis.english, value: samples.length ? Math.round(100 * samples.reduce((sum, value) => sum + value, 0) / samples.length) : 50, sampleCount: samples.length }
  })
}
