import { describe, expect, it, vi } from 'vitest'

const fixtureLongform = {
  artifactType: 'solution' as const,
  estimatedLength: '约 11 步',
  preview: '第1步：先把等式两边同乘分母的最小公倍式。',
  structure: ['清分母', '展开', '检查定义域'],
  highlights: ['第4步是合并同类项'],
  keyFacts: ['内部事实：原题最终得到 x=3'],
}

vi.mock('../content/runManifest', async () => {
  const actual = await vi.importActual<typeof import('../content/runManifest')>('../content/runManifest')
  return {
    ...actual,
    buildStoryContentForManifest: (manifest: Parameters<typeof actual.buildStoryContentForManifest>[0]) => {
      const story = actual.buildStoryContentForManifest(manifest)
      const first = story.nodes[0]
      first.choices[0] = { ...first.choices[0], longformPreview: fixtureLongform }
      return story
    },
  }
})

import { commitChoice, createRun, resolveScene } from './engine'

describe('longform choice checkpoint', () => {
  it('stores preview as assistantText and the full structured artifact separately', () => {
    const run = createRun('longform-choice')
    const scene = resolveScene(run)
    const next = commitChoice(run, scene.choices[0].id)
    const entry = next.history[0]

    expect(entry.assistantText).toBe(fixtureLongform.preview)
    expect(entry.assistantLongform).toEqual(fixtureLongform)
    expect(entry.assistantLongform).not.toBe(fixtureLongform)
    expect(entry.assistantLongform?.keyFacts).toEqual(fixtureLongform.keyFacts)
  })
})
