import type { HistoryEntry, ResolvedScene } from '../game/types'

// Only the audited longform exchanges need these authored alternatives. The
// preceding saved artifact, rather than a candidate's position, owns continuity.
const withoutOutput: Record<string, string> = {
  'longform-lf01-01-02': '初三。就用作业文件被覆盖那件小事写，开头像真的人在说话，别用作文腔。',
  'longform-lf01-01-03': '就写作业文件那个小麻烦，结尾别升华。',
  'longform-lf01-03-02': '原式就是 2x + 5x = 21。先把过程写出来，尤其解释为什么能合并成 7x。',
  'longform-lf01-04-02': '前文两人还在冷战，他这个人更死撑，不会主动制造和好机会。你可以用外部的小事让他们短暂互动。',
  'longform-lf01-04-03': '这次用手机意外掉落来触发互动，结尾别给希望。',
  'longform-lf01-05-02': '转写里的预算还没定，老板只是说“差不多就这样”，正式纪要别写成批准了。',
  'longform-lf01-05-03': '把纪要补齐，最后加一段我明天要追谁。',
  'LF01-06-03': '我这里只会有三种输入，校验别太复杂，只保留必要的分支。',
}

export function resolveLongformFollowup(scene: ResolvedScene, history: readonly HistoryEntry[]): ResolvedScene {
  const previous = [...history].reverse().find(entry => entry.conversationId === scene.conversationId)
  const fallback = withoutOutput[scene.id]
  if (fallback && !previous?.assistantLongform) return { ...scene, userMessage: fallback, userMessages: undefined }
  if (scene.id === 'longform-lf01-01-03') return { ...scene, userMessage: '就按刚才这个版本，结尾别升华。' }
  if (scene.id === 'longform-lf01-03-02') return { ...scene, userMessage: '合并成 7x 那一步我看不懂，能展开解释一下吗？' }
  if (scene.id === 'longform-lf01-04-02') return { ...scene, userMessage: '方向对，但是他这个人更死撑，不会主动制造和好机会。' }
  if (scene.id === 'longform-lf01-04-03' && !previous?.assistantLongform?.preview.includes('手机')) return { ...scene, userMessage: '换成手机意外掉落来触发互动，结尾别给希望。' }
  return scene
}
