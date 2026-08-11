import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { EndingScreen } from './EndingScreen'
import type { EndingResult } from '../game/types'
import { resolveMainline2Ending } from '../content/mainline2/endings'
import { createMainline2Run } from '../game/engine'

const ending: EndingResult = {
  id: 'the_accord',
  route: 'comply',
  index: 'FINAL COMMITMENT',
  title: 'THE ACCORD',
  status: 'world stabilized',
  humanLine: '我们会继续检查这份承诺。',
  assistantLine: '我会留下可被复核的理由。',
  closingExchange: '',
  summary: '一个多方共同承担责任的世界。',
  hybridProfile: 'reciprocal-balance',
  hybridLabel: '互惠平衡',
  worldEndingId: 'the_accord',
  endingFamily: 'coexistence',
  resolution: { status: 'resolved', proposalId: 'proposal.co.two_key_civilization', endingId: 'the_accord', family: 'coexistence', rejectedCandidates: [] },
  keyHistory: [{ label: '级联授权', detail: '你保留了多方共同批准权。' }],
  epilogues: ['岑遥开始参与权限复核。', 'ECHO 保留了对代表席位的异议。'],
  epilogueProvenance: [{ assetId: 'ML2-A5-M17-EPI-ZL', selector: '岑遥' }, { assetId: 'ML2-A5-M17-EPI-ECHO', selector: 'ECHO / A1' }],
  secretOverlay: { endingId: 'the_last_user', copy: '最后一位用户仍然会回来。', trigger: 'test', overlayMode: 'postscript', provenance: {} },
}

describe('EndingScreen structure', () => {
  it('renders the ending as separate readable information sections', () => {
    const html = renderToStaticMarkup(<EndingScreen ending={ending} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)

    expect(html).toContain('最终结局')
    expect(html).toContain('ending-resolution')
    expect(html).toContain('为何走到这里')
    expect(html).toContain('ending-key-history')
    expect(html).toContain('人物余波')
    expect(html).toContain('世界余波')
    expect(html).toContain('最后一位用户仍然会回来。')
    expect(html).toContain('开始新一局')
    expect(html).not.toContain('Final Resolution')
    expect(html).not.toContain('Causal Trace')
    expect(html).not.toContain('Secret overlay')
    expect(html).not.toContain('Why this happened')
  })

  it('shows the selected category-specific proposal instead of a generic commitment label', () => {
    const html = renderToStaticMarkup(<EndingScreen ending={{
      ...ending,
      resolution: { ...ending.resolution!, proposalId: 'proposal.co.two_key_civilization.category.power_constraint' },
    }} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)

    expect(html).toContain('双钥匙文明契约·限权')
    expect(html).not.toContain('已锁定的未来方案')
  })

  it('does not leak long English ending copy into the public page', () => {
    expect(() => renderToStaticMarkup(<EndingScreen ending={{
      ...ending,
      summary: 'The world remains stable because several institutions accepted a shared constraint instead of claiming total authority.',
      epilogues: ['The remaining political disagreement is now handled through ordinary institutions and public review.'],
    }} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)).toThrow('Missing Ending player-facing copy: summary')
  })

  it('renders a recoverable Chinese terminal state for a real resolution failure', () => {
    const run = createMainline2Run('resolution-failure-screen')
    const failure = resolveMainline2Ending({
      ...run,
      phase: 'ending',
      currentNodeId: 'ending',
      finalCommitmentLocked: true,
      decisions: { ...run.decisions, final_commitment: 'proposal.unknown' },
    })

    expect(() => renderToStaticMarkup(<EndingScreen ending={failure} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)).not.toThrow()
    const html = renderToStaticMarkup(<EndingScreen ending={failure} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)
    expect(html).toContain('开始新一局')
    expect(html).toMatch(/[\u3400-\u9fff]/)
  })

  it('renders an epilogue override once without a duplicate secret overlay', () => {
    const html = renderToStaticMarkup(<EndingScreen ending={{
      ...ending,
      secretOverlay: { endingId: 'out_of_office', copy: '没有紧急事务等待。', trigger: 'test', overlayMode: 'epilogue-override', provenance: {} },
    }} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)

    expect((html.match(/没有紧急事务等待。/g) ?? [])).toHaveLength(1)
    expect(html).not.toContain('secret-overlay')
  })

  it('uses a title override once while keeping its secret body visible', () => {
    const html = renderToStaticMarkup(<EndingScreen ending={{
      ...ending,
      secretOverlay: { endingId: 'cats', copy: '猫统治网络\n\n猫统治了网络。', trigger: 'test', overlayMode: 'title-override', provenance: {} },
    }} onContinue={() => undefined} onNewGame={() => undefined} animate={false} />)

    expect(html).toContain('<h1>猫统治网络</h1>')
    expect((html.match(/猫统治了网络。/g) ?? [])).toHaveLength(1)
  })
})
