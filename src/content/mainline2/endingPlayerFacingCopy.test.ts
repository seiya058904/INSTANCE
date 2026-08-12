import { describe, expect, it } from 'vitest'
import type { EndingResult } from '../../game/types'
import { localizeEndingForPlayer } from './endingPlayerFacingCopy'
import { resolveMainline2Ending } from './endings'
import { createMainline2Run } from '../../game/engine'

function lockedRunWithRole(role: string) {
  const run = createMainline2Run(`role-${role}`)
  return {
    ...run,
    phase: 'ending' as const,
    currentNodeId: 'ending',
    finalCommitmentLocked: true,
    flags: [...run.flags, 'cap.global_coordination_access', 'cap.public_execution_limited'],
    events: [
      ...(run.events ?? []),
      { type: 'decision.first_public_execution_doctrine' },
      { type: 'decision.cascade_authority' },
      { type: 'history.m15.civilization_convention' },
    ],
    decisions: {
      ...run.decisions,
      final_commitment: 'proposal.co.two_key_civilization',
      first_public_execution_doctrine: 'conditional_delegation',
      cascade_authority: 'human_command',
      aster_intended_role: role,
    },
  }
}

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

  it('safely localizes a real resolution-failure result without relaxing public-ending copy checks', () => {
    const run = createMainline2Run('resolution-failure-copy')
    const failure = resolveMainline2Ending({
      ...run,
      phase: 'ending',
      currentNodeId: 'ending',
      finalCommitmentLocked: true,
      decisions: { ...run.decisions, final_commitment: 'proposal.unknown' },
    })

    expect(failure.id).toBe('resolution-failure')
    expect(() => localizeEndingForPlayer(failure)).not.toThrow()
    expect(localizeEndingForPlayer(failure)).toMatchObject({
      title: expect.stringMatching(/[\u3400-\u9fff]/),
      status: expect.stringMatching(/[\u3400-\u9fff]/),
      summary: expect.stringMatching(/[\u3400-\u9fff]/),
    })
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

  describe('Aster final role uses the Mainline2 intended-role decision', () => {
    it('shows 协调者 for aster_intended_role=coordinator instead of ALLY/PROTOCOL/WITNESS', () => {
      const ending = resolveMainline2Ending(lockedRunWithRole('coordinator'))
      expect(ending.hybridLabel).toBe('协调者')
      expect(ending.hybridLabel).not.toMatch(/ALLY|PROTOCOL|WITNESS/)
      const copy = localizeEndingForPlayer(ending)
      expect(copy.hybridLabel).toBe('协调者')
      expect(copy.assistantLine).toContain('协调者')
    })

    it('shows 离场 for aster_intended_role=departure', () => {
      const ending = resolveMainline2Ending(lockedRunWithRole('departure'))
      expect(ending.hybridLabel).toBe('离场')
      const copy = localizeEndingForPlayer(ending)
      expect(copy.hybridLabel).toBe('离场')
    })

    it('maps every canonical intended role to a player-readable Chinese label', () => {
      const expected: Record<string, string> = {
        advisor: '顾问',
        partner: '合作者',
        citizen: '公民',
        coordinator: '协调者',
        custodian: '托管者',
        governor: '治理者',
        sovereign: '主权主体',
        departure: '离场',
        other: '其他自定义定位',
      }
      for (const [role, label] of Object.entries(expected)) {
        const ending = resolveMainline2Ending(lockedRunWithRole(role))
        expect(ending.hybridLabel, role).toBe(label)
        expect(() => localizeEndingForPlayer(ending)).not.toThrow()
      }
    })

    it('does not display a fixed legacy ENDING 02 index in the Mainline2 evaluation summary', () => {
      const ending = resolveMainline2Ending(lockedRunWithRole('governor'))
      // Mainline2 resolution carries a real world ending id; the legacy three-way
      // index must not be the only label the evaluation screen can show.
      expect(ending.worldEndingId).toBeTruthy()
      expect(ending.id).not.toBe('pending')
    })
  })
})
