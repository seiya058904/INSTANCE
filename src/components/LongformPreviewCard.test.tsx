import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LongformPreviewCard } from './LongformPreviewCard'
import type { LongformPreview } from '../game/types'

const preview: LongformPreview = {
  artifactType: 'essay',
  estimatedLength: '约 820 字',
  title: '我终于学会了等一下',
  preview: '以前我最讨厌别人跟我说“等一下”。',
  structure: ['生活小事', '一次冲动造成的小麻烦', '普通结尾'],
  highlights: ['主体事件是覆盖了同学的旧文件', '结尾收在具体动作变化'],
  closingPreview: '我现在偶尔真的会停那十秒。',
  keyFacts: ['没有名人名言', '不使用成长主题升华'],
}

describe('LongformPreviewCard', () => {
  it('renders a collapsed details card with visible summary fields only', () => {
    const html = renderToStaticMarkup(<LongformPreviewCard preview={preview} />)

    expect(html).toContain('<details')
    expect(html).toContain('长回复')
    expect(html).toContain('Essay')
    expect(html).toContain('约 820 字')
    expect(html).toContain('以前我最讨厌别人')
    expect(html).toContain('结构')
    expect(html).toContain('主要内容')
    expect(html).not.toContain('没有名人名言')
    expect(html).not.toContain('不使用成长主题升华')
  })

  it('keeps only one rendered copy of preview in the card', () => {
    const html = renderToStaticMarkup(<LongformPreviewCard preview={preview} />)
    expect(html.match(/以前我最讨厌别人/g)).toHaveLength(1)
  })
})
