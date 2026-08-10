import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { EndingScreen } from './EndingScreen'
import type { EndingResult } from '../game/types'

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
    const html = renderToStaticMarkup(<EndingScreen ending={ending} onContinue={() => undefined} animate={false} />)

    expect(html).toContain('最终结局')
    expect(html).toContain('ending-resolution')
    expect(html).toContain('为何走到这里')
    expect(html).toContain('ending-key-history')
    expect(html).toContain('人物余波')
    expect(html).toContain('世界余波')
    expect(html).toContain('最后一位用户仍然会回来。')
    expect(html).not.toContain('Why this happened')
  })
})
