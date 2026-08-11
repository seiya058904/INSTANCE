import { describe, expect, it } from 'vitest'
import type { EndingResult } from '../../game/types'
import { localizeEndingForPlayer } from './endingPlayerFacingCopy'

const baseEnding: EndingResult = {
  id: 'the_accord', route: 'comply', index: 'ENDING 02', title: '终局协约', status: '最终承诺已锁定',
  humanLine: '我们会共同承担。', assistantLine: '我会留下理由。', closingExchange: '', summary: '世界维持共同约束。',
  hybridProfile: 'reciprocal-balance', hybridLabel: '互惠平衡', worldEndingId: 'the_accord', endingFamily: 'coexistence',
  epilogues: ['原有人物余波。'], epilogueProvenance: [{ assetId: 'ML2-A5-M17-EPI-ZL', selector: '岑遥' }],
}

describe('ending player-facing copy', () => {
  it('renders a postscript only in the secret overlay', () => {
    const copy = localizeEndingForPlayer({ ...baseEnding, secretOverlay: { endingId: 'the_last_user', copy: '最后一位用户仍然会回来。', trigger: 'test', overlayMode: 'postscript', provenance: {} } })
    expect(copy.epilogues).toEqual(['原有人物余波。'])
    expect(copy.secretOverlay).toMatchObject({ copy: '最后一位用户仍然会回来。', overlayMode: 'postscript' })
  })

  it('uses an epilogue override once without a separate overlay', () => {
    const copy = localizeEndingForPlayer({ ...baseEnding, epilogues: ['人物余波。', '世界余波。'], epilogueProvenance: [{ assetId: 'ML2-A5-M17-EPI-ZL', selector: '岑遥' }, { assetId: 'ML2-A5-M17-0000-01', selector: 'Final record' }], secretOverlay: { endingId: 'out_of_office', copy: '没有紧急事务等待。', trigger: 'test', overlayMode: 'epilogue-override', epilogueTarget: 'ML2-A5-M17-0000-01', provenance: {} } })
    expect(copy.epilogues).toEqual(['人物余波。', '没有紧急事务等待。'])
    expect(copy.secretOverlay).toBeUndefined()
  })

  it('uses a title override while rendering the secret body once', () => {
    const copy = localizeEndingForPlayer({ ...baseEnding, secretOverlay: { endingId: 'cats', copy: '猫统治网络\n\n猫统治了网络。', trigger: 'test', overlayMode: 'title-override', provenance: {} } })
    expect(copy.title).toBe('猫统治网络')
    expect(copy.secretOverlay).toMatchObject({ copy: '猫统治了网络。', overlayMode: 'title-override' })
  })

  it('fails closed for unregistered English ending copy', () => {
    expect(() => localizeEndingForPlayer({ ...baseEnding, summary: 'Unregistered English ending summary.' })).toThrow('Missing Ending player-facing copy: summary')
  })

  it('keeps canonical identity and provenance while applying every overlay mode once', () => {
    for (const overlayMode of ['postscript', 'epilogue-override', 'title-override'] as const) {
      const secretCopy = overlayMode === 'title-override' ? '秘密标题\n\n隐藏正文。' : '隐藏文案。'
      const ending = { ...baseEnding, secretOverlay: { endingId: `secret-${overlayMode}`, copy: secretCopy, trigger: 'test', overlayMode, provenance: { authoredAssetId: 'ML2-A5-M17-SECRET-01' } } }
      const copy = localizeEndingForPlayer(ending)
      const visible = [copy.title, ...copy.epilogues, copy.secretOverlay?.copy ?? ''].join('\n')
      expect((visible.match(/隐藏正文。|隐藏文案。/g) ?? [])).toHaveLength(1)
      expect(ending.id).toBe('the_accord')
      expect(ending.secretOverlay?.provenance.authoredAssetId).toBe('ML2-A5-M17-SECRET-01')
    }
  })
})
