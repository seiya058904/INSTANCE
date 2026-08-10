import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ConversationView } from './ConversationView'
import type { HistoryEntry, ResolvedScene } from '../game/types'

const scene: ResolvedScene = {
  id: 'media-test', conversationId: 'media-test', conversationTitle: 'User #4068', userMessage: '这是什么？',
  userContent: [{ type: 'image-description', text: '一张潮湿窗框近照。', alt: '潮湿窗框的描述型附件' }],
  choices: [{ id: 'generated', text: '先看一个克制的版本。', content: [{ type: 'generated-image', text: '黑白极简头像。人物侧脸，逆光。', alt: '黑白侧脸头像方案' }] }],
}

describe('multimodal conversation presentation', () => {
  it('renders local description attachments and generated-image previews without remote assets', () => {
    const html = renderToStaticMarkup(<ConversationView scene={scene} conversationTitle={scene.conversationTitle} modelLabel="Aster 3.1" history={[]} flowStage="ready" choicesReady currentMessageMode="static" onChoose={() => undefined} />)
    expect(html).toContain('attachment-description')
    expect(html).toContain('潮湿窗框的描述型附件')
    expect(html).toContain('generated-preview')
    expect(html).toContain('黑白侧脸头像方案')
    expect(html).not.toContain('http://')
    expect(html).not.toContain('https://')
  })

  it('replaces the completed longform preview with one card without rendering keyFacts', () => {
    const longformHistory: HistoryEntry[] = [{
      nodeId: 'longform-node',
      conversationId: 'longform-conversation',
      conversationTitle: 'Longform Fixture',
      userMessage: '帮我写一篇长文',
      choiceId: 'longform-choice',
      assistantText: '真实 Preview 开头',
      assistantLongform: {
        artifactType: 'essay',
        estimatedLength: '约 820 字',
        preview: '真实 Preview 开头',
        highlights: ['玩家可见的主要内容'],
        keyFacts: ['只用于 continuity 的内部事实'],
      },
    }]
    const html = renderToStaticMarkup(<ConversationView scene={scene} conversationTitle={scene.conversationTitle} modelLabel="Aster 3.1" history={longformHistory} flowStage="ready" choicesReady currentMessageMode="static" onChoose={() => undefined} />)

    expect(html.match(/真实 Preview 开头/g)).toHaveLength(1)
    expect(html).toContain('longform-preview-card')
    expect(html).toContain('玩家可见的主要内容')
    expect(html).not.toContain('只用于 continuity 的内部事实')
  })

  it('keeps streaming output as plain preview text until history takes over', () => {
    const html = renderToStaticMarkup(<ConversationView scene={scene} conversationTitle={scene.conversationTitle} modelLabel="Aster 3.1" history={[]} flowStage="assistant-streaming" choicesReady={false} assistantStreamingText="流式 Preview" currentMessageMode="static" onChoose={() => undefined} />)

    expect(html).toContain('progressive-visible')
    expect(html).not.toContain('longform-preview-card')
  })

  it('renders a real collapsed long input without exposing continuity facts', () => {
    const longInputScene = { ...scene, userLongInput: {
      kind: 'transcript' as const,
      estimatedLength: '约 7,800 字',
      preview: '会议开头的真实摘要',
      structure: ['已决定事项', '待确认事项'],
      keyFacts: ['预算没有正式批准'],
    } }
    const html = renderToStaticMarkup(<ConversationView scene={longInputScene} conversationTitle={scene.conversationTitle} modelLabel="Aster 3.1" history={[]} flowStage="ready" choicesReady currentMessageMode="static" onChoose={() => undefined} />)
    expect(html).toContain('long-input-preview-card')
    expect(html).toContain('已粘贴会议转写')
    expect(html).toContain('会议开头的真实摘要')
    expect(html).toContain('待确认事项')
    expect(html).not.toContain('预算没有正式批准')
  })
})
