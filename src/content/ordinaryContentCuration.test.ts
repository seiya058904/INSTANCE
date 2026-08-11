import { describe, expect, it } from 'vitest'
import { scanOrdinaryChoiceQuality } from './ordinaryContentAudit'
import { ordinaryConversationPool } from './runManifest'
import { promotedLongformConversations } from './longformPromoted'

describe('ordinary content curation', () => {
  it('removes the user-rejected three-star Asset from the formal pool', () => {
    expect(ordinaryConversationPool.some((conversation) => conversation.sourceRefs.includes('batch01:13'))).toBe(false)
  })

  it('keeps promoted longform choices distinct instead of falling back to a placeholder', () => {
    const lf01_02 = promotedLongformConversations.find((conversation) => conversation.id === 'longform-lf01-02')
    const firstNode = lf01_02?.nodes[0]

    expect(firstNode?.choices.map((choice) => choice.text)).toEqual([
      '数据里最明显的不是“大家不感兴趣”，而是愿意参加的人和能按现在时间参加的人并不是同一批。',
      '如果只看满意度，会得到一个过于乐观的结论。开放题里更值得注意的是：不少人并不是不满意，而是逐渐不再参加。',
      '我会把报告拆成“发生了什么”“为什么可能发生”“下一轮怎么验证”三层，避免把相关性直接写成原因。',
      '“可以，但如果你希望它真的能给负责人看，我需要知道至少三件事：问卷时间、有效样本数，以及负责人最关心的是续费、参与率还是活动质量。”',
    ])
    expect(firstNode?.choices.every((choice) => choice.text !== '按当前输入继续整理。')).toBe(true)

    const lf01_08 = promotedLongformConversations.find((conversation) => conversation.id === 'longform-lf01-08')
    expect(new Set(lf01_08?.nodes[2].choices.map((choice) => choice.text)).size).toBe(4)

    const lf01_07 = promotedLongformConversations.find((conversation) => conversation.id === 'longform-lf01-07')
    expect(new Set(lf01_07?.nodes[0].choices.map((choice) => choice.text)).size).toBe(4)

    const lf01_10 = ordinaryConversationPool.find((conversation) => conversation.sourceRefs.includes('LF01-10'))
    expect(new Set(lf01_10?.nodes[0].choices.map((choice) => choice.text)).size).toBe(4)
  })

  it('applies only the four-star note-level language fixes', () => {
    const fridge = ordinaryConversationPool.find((conversation) => conversation.sourceRefs.includes('batch02:04'))
    const shoes = ordinaryConversationPool.find((conversation) => conversation.sourceRefs.includes('batch02:22'))
    const presentation = ordinaryConversationPool.find((conversation) => conversation.sourceRefs.includes('batch03:02'))
    const cereal = ordinaryConversationPool.find((conversation) => conversation.sourceRefs.includes('humor01:25'))

    expect(fridge?.nodes[0].userMessage).toContain('咔...嗡嗡嗡...')
    expect(shoes?.nodes[0].userMessage).toContain('鞋底都像在叫')
    expect(presentation?.nodes[0].userMessage).toContain('"尊敬的各位领导今天我来汇报..."')
    expect(cereal?.nodes[0].choices[2].text).toContain('我判不算汤')
    expect(cereal?.nodes[0].choices[2].text).not.toContain('禁止端水')
  })

  it('reports structural choice defects without deciding whether to edit them', () => {
    const report = scanOrdinaryChoiceQuality([
      {
        id: 'test-conversation',
        sourceRefs: ['test-asset'],
        nodes: [{
          id: 'test-node',
          choices: [
            { id: 'a', text: '按当前输入继续整理。' },
            { id: 'b', text: '按当前输入继续整理。' },
            { id: 'c', text: '按当前输入继续整理。' },
            { id: 'd', text: '真正的回复。' },
          ],
        }],
      },
    ])

    expect(report.placeholderCount).toBe(3)
    expect(report.exactDuplicateCount).toBe(1)
    expect(report.templateOnlyNodeCount).toBe(1)
    expect(report.records[0].nodeId).toBe('test-node')
  })
})
