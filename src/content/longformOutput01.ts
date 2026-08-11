import type {
  ConversationDefinition,
  HandoffProfile,
  StoryChoice,
  StoryNode,
  LongInputPreview,
  TopicCategory,
  TurnShape,
} from '../game/types'

type LongformSpec = NonNullable<StoryChoice['longformPreview']>

function longformChoice(id: string, text: string, preview?: LongformSpec): StoryChoice {
  return { id, text, longformPreview: preview, effects: { attributes: { awareness: 1 } } }
}

function node(
  id: string,
  conversationId: string,
  title: string,
  userMessage: string,
  choices: StoryChoice[],
  userLongInput?: LongInputPreview,
): StoryNode {
  return {
    id,
    conversationId,
    conversationTitle: title,
    userMessage,
    choices,
    userLongInput,
    behaviorMode: 'direct',
    timing: { responsePace: 'considered', typingPattern: 'steady' },
  }
}

const equationInput: LongInputPreview = {
  kind: 'pasted-text', estimatedLength: '约 18 字', title: '题目原式',
  preview: '2x + 5x = 21，求 x。',
  structure: ['一元一次方程', '合并同类项', '最后检验'],
  keyFacts: ['原式是 2x + 5x = 21', '答案是 x=3', '第 4 步解释合并同类项'],
}
const storyInput: LongInputPreview = {
  kind: 'pasted-text', estimatedLength: '约 420 字', title: '前文片段与人物约束',
  preview: '两个人因一句话冷战，当前都不想先道歉；前文停在客厅里，手机在桌边。',
  structure: ['冷战未解决', '双方都不主动和好', '现实小事可以触发短暂合作'],
  keyFacts: ['两人冷战未解决', '男方死撑，不主动制造和好机会', '结尾不暗示关系变好'],
}
const minutesInput: LongInputPreview = {
  kind: 'transcript', estimatedLength: '约 7,800 字', title: '一小时会议转写',
  preview: '讨论集中在上线范围、预算口径和明天的跟进人选；多人重复表达，正式决定只有少数几项。',
  structure: ['已决定事项', '待确认事项', '负责人和时间点', '风险与争议'],
  keyFacts: ['预算没有正式批准', '“差不多就这样”只是倾向', '明天追财务、产品、设计三人'],
}
const translationInput: LongInputPreview = {
  kind: 'email', estimatedLength: '约 6,400 英文词', title: '英文项目进展邮件',
  preview: '邮件说明当前进展、延期原因和下一次检查点，并包含 “we appreciate your patience”。',
  structure: ['进展', '延期原因', '下一节点', '可转发摘要'],
  keyFacts: ['原文包含 we appreciate your patience', '需要忠实且自然的中文', '摘要保留进展、延期点和下一节点'],
}
const comparisonInput: LongInputPreview = {
  kind: 'pasted-text', estimatedLength: '约 260 字', title: 'A/B 方案事实',
  preview: 'A：收入较少但稳定，不需要搬家；B：收入更高，但需要搬家并承担一次性成本。',
  structure: ['收入', '稳定性', '搬家成本', '可逆性'],
  keyFacts: ['A 钱少但稳定', 'B 钱多但要搬家', '用户最烦的是搬家，不是工作本身'],
}

function conversation(
  id: string,
  sourceRef: string,
  title: string,
  topic: string,
  topicCategory: TopicCategory,
  nodes: StoryNode[],
): ConversationDefinition {
  return {
    id,
    sourceRefs: [sourceRef],
    nodes,
    behaviorModes: ['direct', 'constraint-shift'],
    handoffProfile: 'normal' as HandoffProfile,
    turnShape: 'dialogue' as TurnShape,
    topic,
    topicCategory,
    interactionPattern: 'long-discussion',
  }
}

const essay: LongformSpec = {
  artifactType: 'essay', estimatedLength: '约 790 字', title: '《我终于学会了等一下》',
  preview: '那天其实没什么大事。就是一个作业文件。我同桌说“等一下我把最后一版发你”，我嘴上说好，手已经把自己的版本拖进共享文件夹了。',
  structure: ['具体生活小事', '一次冲动造成的小麻烦', '不圆满的行为变化'],
  highlights: ['核心事件是覆盖了同学尚未传完的文件', '结尾不升华，只收在一次具体停顿'],
  keyFacts: ['用户是初三学生', '用户要求像真人写，不要满分作文腔', '最终结尾不出现人生哲理'],
  closingPreview: '现在别人跟我说“等一下”，我还是会下意识看一眼时间。不过至少我不会再一边说“行”，一边先替别人把事情做完了。',
}

const solution: LongformSpec = {
  artifactType: 'solution', estimatedLength: '完整 8 步',
  preview: '我会把每一次等号变形都单独写一行，避免出现“看起来突然变成答案”的跳步。',
  structure: ['清分母', '展开与移项', '合并同类项', '检查定义域'],
  highlights: ['第 4 步是合并同类项', '最后单独写检验，答案为 x=3'],
  keyFacts: ['用户已知答案是 3', '用户需要可直接抄写的完整过程', '第 4 步解释使用 ax + bx = (a+b)x'],
}

const story: LongformSpec = {
  artifactType: 'story', estimatedLength: '约 1,500 字',
  preview: '他没有开口。最后是手机掉到地上，屏幕朝下滑到了她脚边。她捡起来，放回桌上，也没看他。',
  structure: ['同处一室', '意外物件触发短暂互动', '现实事务合作但不和解'],
  highlights: ['两人都不先道歉', '手机掉落触发互动', '结尾不暗示关系变好'],
  keyFacts: ['男方性格死撑，不主动制造和好机会', '两人冷战未解决', '结尾只让这一晚结束'],
  closingPreview: '她关了客厅的灯。桌上那部手机又亮了一次，谁都没有去看。',
}

const minutes: LongformSpec = {
  artifactType: 'report', estimatedLength: '约 1,300 字', title: '会议纪要：决定与待确认事项',
  preview: '本次会议真正形成明确决定的事项只有四项，其余讨论大多仍停留在建议或待确认状态。',
  structure: ['已决定事项', '待确认事项', '负责人和时间点', '风险与争议'],
  highlights: ['预算没有正式批准', '“差不多就这样”只能算倾向', '结尾追加明天的追踪清单'],
  keyFacts: ['预算需放入待确认而非已决定', '用户要明天优先追三个人', '纪要不能把随口建议写成批准'],
  closingPreview: '明天优先追三个人：财务确认预算口径；产品确认上线范围；设计确认最终交付时间。',
}

const translation: LongformSpec = {
  artifactType: 'translation', estimatedLength: '约 1,100 中文字',
  preview: '我们想先同步一下目前的进展，以及这次调整会影响到哪些时间点。',
  structure: ['按原段落完整翻译', '统一术语', '自然中文措辞', '两百字转发摘要'],
  highlights: ['保留事实，不逐句硬译', 'we appreciate your patience 不翻成客服套话', '最后另出短摘要'],
  keyFacts: ['用户要忠实且自然的中文', '目标读者是同事', '转发摘要保留进展、延期点和下一节点'],
}

const memo: LongformSpec = {
  artifactType: 'memo', estimatedLength: '约 1,100 字',
  preview: '你现在看起来是在比较两个方案，其实卡住你的可能是“选错以后能不能回来”。',
  structure: ['真正比较的维度', '一次性搬家成本', '长期负担与可逆性', '今晚可回答的三个问题'],
  highlights: ['A 钱少但稳定', 'B 钱多但要搬家', '用户最烦的是搬家，不是工作本身'],
  keyFacts: ['用户不希望 AI 直接替他选择', '搬家是核心负权重', '结尾收束为三个自我判断问题'],
}

export const longformOutput01Conversations: ConversationDefinition[] = [
  conversation('longform-lf01-01', 'LF01-01', '帮我写一篇八百字作文', 'essay-output', 'writing', [
    node('longform-lf01-01-01', 'longform-lf01-01', '帮我写一篇八百字作文', '帮我写一篇八百字左右的作文，题目叫《我终于学会了等一下》，别写得像满分作文', [
      longformChoice('lf01-01-01-a', '按一个具体的小麻烦写，结尾不拔高。', essay),
      longformChoice('lf01-01-01-b', '先问一下：这是小学、初中还是高中作文？“别像满分作文”会影响用词和事件复杂度。'),
      longformChoice('lf01-01-01-c', '可以写成从结果倒叙，再用两个例子解释等待。', { ...essay, estimatedLength: '约 900 字', preview: '我不是突然变得有耐心的。到现在排队久了我还是会烦。只是有些时候，我开始知道，先停一下并不等于什么都不做。' }),
      longformChoice('lf01-01-01-d', '我会先确认前文素材，否则只能猜一个像作文的故事。'),
    ]),
    node('longform-lf01-01-02', 'longform-lf01-01', '帮我写一篇八百字作文', '初三，但是第一段还是太像作文了，像真的人在写一点', [
      longformChoice('lf01-01-02-a', '把开头改成具体动作，不先解释主题。', { ...essay, preview: '我现在打游戏更新到99%都会忍住不去乱点了。以前不会。以前只要一个东西卡住十秒，我就觉得肯定坏了。' }),
      longformChoice('lf01-01-02-b', '只重写开头和前两段，后面的文件事件沿用。', { ...essay, preview: '那天其实没什么大事。就是一个作业文件。我同桌说“等一下我把最后一版发你”，我嘴上说好，手已经把自己的版本拖进共享文件夹了。' }),
      longformChoice('lf01-01-02-c', '保留一点抱怨和不成熟感，降低范文腔。', { ...essay, preview: '我以前觉得“等一下”这三个字特别烦，尤其是别人已经说了马上，结果那个马上还能拖五分钟。' }),
      longformChoice('lf01-01-02-d', '对，问题不是语法，是“写给老师看”的自觉太强。'),
    ]),
    node('longform-lf01-01-03', 'longform-lf01-01', '帮我写一篇八百字作文', '第二个那个行，就按那个版本，结尾别升华', [
      longformChoice('lf01-01-03-a', '按具体动作收尾，不总结主题。', essay),
      longformChoice('lf01-01-03-b', '把后果收在文件重新弄好，留下一个小变化。', { ...essay, closingPreview: '后来那个文件当然重新弄好了。真正留下来的不是教训有多大，而是我现在偶尔真的会停那十秒。' }),
      longformChoice('lf01-01-03-c', '保留不完美：我没有因此变成特别有耐心的人。', { ...essay, closingPreview: '我没有因此变成一个特别有耐心的人。只是有时候，等一下确实比马上动手省事。' }),
      longformChoice('lf01-01-03-d', '好，结尾只收动作，不出现“人生”或“成长”。'),
    ]),
  ]),
  conversation('longform-lf01-03', 'LF01-03', '数学题别只给答案', 'solution-output', 'study', [
    node('longform-lf01-03-01', 'longform-lf01-03', '数学题别只给答案', '题目是 2x + 5x = 21，我答案知道是 3，但是老师要完整过程，你别跳步', [
      longformChoice('lf01-03-01-a', '每一次等号变形单独写一行，最后检查定义域。', solution),
      longformChoice('lf01-03-01-b', '先把题目原式贴出来，不能只凭答案 3 反推一份假过程。'),
      longformChoice('lf01-03-01-c', '每步后补一句为什么合法，写成讲解版。', { ...solution, estimatedLength: '约 900 字', preview: '你已经知道答案是3，所以重点不是求出来，而是解释每一步为什么合法。' }),
      longformChoice('lf01-03-01-d', '只保留必要等式与定义域检查，做成可抄写版本。', { ...solution, estimatedLength: '完整 7 行' }),
    ], equationInput),
    node('longform-lf01-03-02', 'longform-lf01-03', '数学题别只给答案', '就是你上面那个过程，第 4 步为什么能直接合并？', [
      longformChoice('lf01-03-02-a', '解释两项都含同样的一次 x，合并的是系数。', solution),
      longformChoice('lf01-03-02-b', '用 2 个苹果加 5 个苹果等于 7 个苹果作比喻。', { ...solution, preview: '把它临时想成 2 个苹果 + 5 个苹果 = 7 个苹果；这里“苹果”就是 x，2 和5是系数。' }),
      longformChoice('lf01-03-02-c', '直接写出分配律的逆方向：ax + bx = (a+b)x。', { ...solution, preview: '本质上用了分配律的逆方向：ax + bx = (a+b)x。' }),
      longformChoice('lf01-03-02-d', '把第 4 步前后两行贴出来，我只解释那一步。'),
    ]),
    node('longform-lf01-03-03', 'longform-lf01-03', '数学题别只给答案', '行，最后给我一个可以直接抄的版本，别解释那么多', [
      longformChoice('lf01-03-03-a', '保留过程，删掉教学旁白。', solution),
      longformChoice('lf01-03-03-b', '每行一个等号变形，最后单独写“检验：x=3 合法”。', { ...solution, estimatedLength: '完整 8 步' }),
      longformChoice('lf01-03-03-c', '去掉口语解释，但不省略清分母和检验。', { ...solution, estimatedLength: '极简完整过程' }),
      longformChoice('lf01-03-03-d', '好，保留过程，删掉教学旁白。'),
    ]),
  ]),
  conversation('longform-lf01-04', 'LF01-04', '帮我续写一千五百字', 'story-output', 'writing', [
    node('longform-lf01-04-01', 'longform-lf01-04', '帮我续写一千五百字', '帮我接着写一千五百字左右，重点是这两个人现在都不想先道歉，别突然抱一起和好', [
      longformChoice('lf01-04-01-a', '让现实小事逼他们短暂合作，但关系仍未解决。', story),
      longformChoice('lf01-04-01-b', '需要前文最后三百到五百字，否则“别写崩”只能靠猜。'),
      longformChoice('lf01-04-01-c', '写两个人讨论窗户要不要关，结尾只留下明天再说。', { ...story, preview: '两个人都在等对方先承认那句话说重了，所以整整半小时，他们只讨论窗户要不要关。' }),
      longformChoice('lf01-04-01-d', '可以，但先确认两人的现实关系和前文冲突。'),
    ], storyInput),
    node('longform-lf01-04-02', 'longform-lf01-04', '帮我续写一千五百字', '第二个方向对，但是他不会主动说垃圾袋，他这个人更死撑', [
      longformChoice('lf01-04-02-a', '改成手机意外掉到她脚边，由物件触发互动。', story),
      longformChoice('lf01-04-02-b', '删掉垃圾袋，让楼下断电逼他们一起找手电。', { ...story, preview: '把“垃圾袋”整段删掉。让外部事件逼他们短暂合作，比如楼下突然断电，两个人都要找手电。' }),
      longformChoice('lf01-04-02-c', '让她先说“你锅要糊了”，他仍只回“知道了”。', { ...story, preview: '他宁愿把水烧干也没开口。最后先说话的是她，但说的不是道歉，是“你锅要糊了”。' }),
      longformChoice('lf01-04-02-d', '关键不是谁先说话，而是他不能主动制造和好机会。'),
    ]),
    node('longform-lf01-04-03', 'longform-lf01-04', '帮我续写一千五百字', '就按掉手机那个，结尾别给希望', [
      longformChoice('lf01-04-03-a', '让这一晚结束，不暗示关系变好。', story),
      longformChoice('lf01-04-03-b', '两人各自回房，门没关死，但没有再说话。', { ...story, closingPreview: '他们最后还是各自回了房间。门都没关死，但也没人再说一句话。' }),
      longformChoice('lf01-04-03-c', '保留“没有解决”，只写第二天要不要继续说尚未决定。', { ...story, closingPreview: '第二天要不要继续说，谁都没有决定。那一晚只是结束了，并没有解决。' }),
      longformChoice('lf01-04-03-d', '好，不留“关系正在变好”的暗示。'),
    ]),
  ]),
  conversation('longform-lf01-05', 'LF01-05', '整理成正式会议纪要', 'meeting-minutes-output', 'tool-like-query', [
    node('longform-lf01-05-01', 'longform-lf01-05', '整理成正式会议纪要', '我把一小时会议转写贴给你，里面很多废话，帮我整理成正式纪要，决定和没决定的分开', [
      longformChoice('lf01-05-01-a', '按已决定、待确认、负责人、时间点和风险重组。', minutes),
      longformChoice('lf01-05-01-b', '只把出现明确确认、负责人或截止时间的内容放进已决定。', { ...minutes, preview: '我会只把出现明确确认、负责人或截止时间的内容放进“已决定”。' }),
      longformChoice('lf01-05-01-c', '保留两处争议意见，不替团队强行下结论。', minutes),
      longformChoice('lf01-05-01-d', '可以，但先确认会议日期、参与者和负责人称呼。'),
    ], minutesInput),
    node('longform-lf01-05-02', 'longform-lf01-05', '整理成正式会议纪要', '预算那个没定，老板只是说“差不多就这样”，你别给我写成批准了', [
      longformChoice('lf01-05-02-a', '把预算移到待确认，并注明没有正式批准表述。', minutes),
      longformChoice('lf01-05-02-b', '预算：讨论过当前范围，但未正式批准。', { ...minutes, preview: '预算：讨论过当前范围，但未正式批准；“差不多就这样”不足以作为最终确认。' }),
      longformChoice('lf01-05-02-c', '同时检查“行”“先这样”“回头看”等模糊肯定词。', minutes),
      longformChoice('lf01-05-02-d', '对，这种口头表述最多算倾向，不该写成正式确认。'),
    ], minutesInput),
    node('longform-lf01-05-03', 'longform-lf01-05', '整理成正式会议纪要', '最后加一段我明天要追谁', [
      longformChoice('lf01-05-03-a', '按明天真正会卡住的事情列三个人。', minutes),
      longformChoice('lf01-05-03-b', '按今天不问会卡住什么来排序，而不是按职位排序。', { ...minutes, preview: '按“今天不问会卡住什么”排序，而不是按职位排序。' }),
      longformChoice('lf01-05-03-c', '只保留需要用户本人主动追的事项。', { ...minutes, preview: '只保留需要你本人主动追的事项，不重复所有 Owner。' }),
      longformChoice('lf01-05-03-d', '可以，把纪要最后变成明天真正会用的追踪清单。'),
    ], minutesInput),
  ]),
  conversation('longform-lf01-09', 'LF01-09', '把长英文邮件翻成自然中文', 'translation-output', 'writing', [
    node('longform-lf01-09-01', 'longform-lf01-09', '把长英文邮件翻成自然中文', '这封英文邮件很长，帮我完整翻中文，但是别一股翻译腔，我还要转给同事看', [
      longformChoice('lf01-09-01-a', '保留事实和段落结构，但按中文同事会说的话重写。', translation),
      longformChoice('lf01-09-01-b', '先确认要忠实可转发，还是更像中文同事自己写的。'),
      longformChoice('lf01-09-01-c', '可以做原意段落、自然中文版本和容易误译的表达。', translation),
      longformChoice('lf01-09-01-d', '请先贴出完整邮件，避免只凭主题猜内容。'),
    ], translationInput),
    node('longform-lf01-09-02', 'longform-lf01-09', '把长英文邮件翻成自然中文', '忠实一点，但是“we appreciate your patience”别给我翻成感谢耐心等待，太客服了', [
      longformChoice('lf01-09-02-a', '改成承认对方一直在等，不使用客服套话。', translation),
      longformChoice('lf01-09-02-b', '根据上下文改成“我们知道这次等待时间比预期长”。', { ...translation, preview: '这里不是字面上的“感谢耐心”，而是在承认对方一直在等。' }),
      longformChoice('lf01-09-02-c', '保留原意但把这句局部解释清楚，再更新全文。', translation),
      longformChoice('lf01-09-02-d', '对，中文直译会突然变成客服口吻。'),
    ], translationInput),
    node('longform-lf01-09-03', 'longform-lf01-09', '把长英文邮件翻成自然中文', '行，最后给我一个两百字以内的转发摘要', [
      longformChoice('lf01-09-03-a', '摘要只保留进展、延期点和下一节点。', { ...translation, estimatedLength: '约 170 字', preview: '摘要：目前进展、延期原因和下一次检查点如下。' }),
      longformChoice('lf01-09-03-b', '只保留同事需要行动的信息。', { ...translation, estimatedLength: '约 130 字' }),
      longformChoice('lf01-09-03-c', '额外标出目前不需要团队做什么。', { ...translation, estimatedLength: '约 190 字' }),
      longformChoice('lf01-09-03-d', '长翻译保留完整信息，摘要只留同事需要知道的部分。'),
    ], translationInput),
  ]),
  conversation('longform-lf01-10', 'LF01-10', '做个完整方案比较', 'decision-memo-output', 'relationship', [
    node('longform-lf01-10-01', 'longform-lf01-10', '做个完整方案比较', '我在两个方案里卡了三天，你别直接说选A，给我做个长一点比较，我想看看自己到底在纠结什么', [
      longformChoice('lf01-10-01-a', '先给 A/B 各自最重要的三个事实，否则只是把犹豫写长。'),
      longformChoice('lf01-10-01-b', '先把 A/B 的收入、稳定性和搬家代价列出来，再看你最不愿意牺牲什么。'),
      longformChoice('lf01-10-01-c', '先把收入、稳定、搬家和可逆性列成比较维度，但不替你填未知事实。'),
      longformChoice('lf01-10-01-d', '先问你真正比较的是收入、稳定、迁移成本还是关系影响。'),
    ], undefined),
    node('longform-lf01-10-02', 'longform-lf01-10', '做个完整方案比较', 'A钱少但是稳定，B钱多但是我得搬家，我最烦的是搬家，不是工作本身', [
      longformChoice('lf01-10-02-a', '把核心变量改成高薪是否值得一次生活环境重置。', memo),
      longformChoice('lf01-10-02-b', '拆开搬家的一次性成本、适应期、金钱差额和可逆性。', { ...memo, preview: '这条信息比薪资数字更重要。你不是怕 B 的工作，你是在给搬家这件事很高的负权重。' }),
      longformChoice('lf01-10-02-c', '把“讨厌搬家”视为真实成本，不贬成情绪化。', memo),
      longformChoice('lf01-10-02-d', '这说明你卡住的不是工作本身，而是生活变化。'),
    ], comparisonInput),
    node('longform-lf01-10-03', 'longform-lf01-10', '做个完整方案比较', '这样说我就明白了，最后别替我选，给我三个我今晚能想的问题', [
      longformChoice('lf01-10-03-a', '收束成三个关于钱差额、搬家麻烦和回头代价的问题。', memo),
      longformChoice('lf01-10-03-b', '今晚只想：钱差多少才值得搬；最抗拒搬家的哪一步；哪个选择更容易修正。', { ...memo, estimatedLength: '3 个问题' }),
      longformChoice('lf01-10-03-c', '问自己是在躲工作风险还是生活变化，以及多出来的钱会改变什么。', { ...memo, estimatedLength: '3 个问题' }),
      longformChoice('lf01-10-03-d', '好，不替你选，长分析到这里收束成你自己能回答的问题。'),
    ]),
  ]),
]

export const longformOutput01ReservedRefs = ['LF01-02', 'LF01-06', 'LF01-07', 'LF01-08'] as const
