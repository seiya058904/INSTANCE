import { describe, expect, it } from 'vitest'
import {
  batch02Audit,
  narrativeSources,
} from './narrativeLibrary'
import { activeRunConversations } from './activeRun'

describe('narrative source library', () => {
  it('keeps all fifty batch sources with traceable origins', () => {
    const batch01 = narrativeSources.filter((source) => source.origin === 'batch01')
    const batch02 = narrativeSources.filter((source) => source.origin === 'batch02')

    expect(batch01).toHaveLength(25)
    expect(batch02).toHaveLength(25)
    expect(new Set(narrativeSources.map((source) => source.id)).size).toBe(50)
    const batch02Nodes = batch02.flatMap((source) => source.conversations.flatMap((conversation) => conversation.nodes))
    expect(batch02Nodes).toHaveLength(42)
    expect(batch02Nodes.reduce((sum, node) => sum + node.choices.length, 0)).toBe(168)
  })

  it('records the approved Batch02 audit without treating candidates as canon', () => {
    expect(batch02Audit.filter((item) => item.editorialStatus === 'KEEP_STRONG')).toHaveLength(13)
    expect(batch02Audit.filter((item) => item.editorialStatus === 'KEEP_REWORK')).toHaveLength(5)
    expect(batch02Audit.filter((item) => item.editorialStatus === 'MERGE')).toHaveLength(7)
    expect(batch02Audit.filter((item) => item.editorialStatus === 'REJECT')).toHaveLength(0)
    expect(batch02Audit.filter((item) => item.currentRunCandidate)).toHaveLength(8)
    expect(batch02Audit.filter((item) => item.absorbedIntoCurrentRun)).toHaveLength(6)
    expect(batch02Audit.filter((item) => item.deployment === 'replace')).toHaveLength(4)
    expect(batch02Audit.filter((item) => item.deployment === 'merge')).toHaveLength(2)
    expect(batch02Audit.filter((item) => item.deployment === 'reserve')).toHaveLength(19)
  })

  it('parses the cake failure as a natural rescue request instead of a staged metaphor', () => {
    const cake = narrativeSources.find((source) => source.id === 'batch02:09')
    const nodes = cake?.conversations[0].nodes ?? []

    expect(nodes).toHaveLength(2)
    expect(nodes.map((node) => node.choices.length)).toEqual([4, 4])
    expect(nodes[0].userMessage).toContain('盖锡纸继续烤还有救吗')
    expect(nodes[0].userMessage).not.toContain('像毕业了')
    expect(nodes[1].userMessage).not.toContain('烤箱是不是在说谎')
  })
})

describe('active run manifest', () => {
  it('contains eighteen runtime conversations and thirty-six choice interactions', () => {
    expect(activeRunConversations).toHaveLength(18)
    expect(activeRunConversations.reduce((sum, conversation) => sum + conversation.nodes.length, 0)).toBe(36)
  })

  it('uses actual conversation behavior metadata with at least fifteen distinct modes', () => {
    const modes = new Set(activeRunConversations.flatMap((conversation) => conversation.behaviorModes))
    expect(modes.size).toBeGreaterThanOrEqual(15)

    for (const conversation of activeRunConversations) {
      expect(conversation.behaviorModes.length).toBeGreaterThan(0)
    }
  })

  it('never repeats one turn shape for three consecutive conversations', () => {
    for (let index = 0; index <= activeRunConversations.length - 3; index += 1) {
      const window = activeRunConversations.slice(index, index + 3)
      expect(new Set(window.map((conversation) => conversation.turnShape)).size).toBeGreaterThan(1)
    }
  })

  it('tracks the four replacements and two merged Batch02 sources used by this run', () => {
    const batch02Refs = new Set(
      activeRunConversations.flatMap((conversation) =>
        conversation.sourceRefs.filter((sourceRef) => sourceRef.startsWith('batch02:')),
      ),
    )

    expect([...batch02Refs].sort()).toEqual([
      'batch02:08',
      'batch02:12',
      'batch02:14',
      'batch02:16',
      'batch02:19',
      'batch02:25',
    ])
  })
})
