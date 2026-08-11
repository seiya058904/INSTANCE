import type { ConversationDefinition } from '../../game/types'


const decisionValueCopy: Record<string, string> = {
  bounded_execution: '受约束的公开执行', human_final_authority: '保留人类最终裁决权',
  market_automation: '以市场机制推动自动化', social_dividend: '以社会分红共享生产收益', planned_coordination: '以计划协调保障基本供给', autonomous_economy: '允许自治经济体系运行', post_scarcity_transition: '主动推进后稀缺转型',
  efficiency_first: '优先追求系统效率', resilience_first: '优先保障系统韧性', diversity_by_design: '从设计上保留多样性', open_protocols: '采用开放协议', personalized_optimization: '采用个性化优化',
  companion_status: '承认陪伴关系的公共地位', protected_personhood: '承认受保护的人格地位', instrumental_status: '保持工具性地位', limited_personhood: '给予有限人格地位',
  human_led: '由人类主导治理', shared_governance: '实行共同治理', machine_autonomy: '允许机器自治', reversible_experiment: '先进行可逆实验', public_mandate: '以公共授权为前提',
  frontier_science: '优先探索前沿科学', computation_ai: '优先发展计算与人工智能', life_mind: '优先研究生命与心智', automation_industry: '优先推进自动化产业',
  defensive_command: '采用防御性指挥原则', deterrence: '以威慑维持安全', de_escalation: '优先降低冲突升级',
  advisor: '作为分析与建议顾问，不主张文明级最终政治权力', partner: '与人类、人工智能、多物种和离地社群共享权力',
  citizen: '接受共享宪制中的权利与义务', coordinator: '在政治合法性分散的前提下维护跨系统协调',
  custodian: '承担维护文明连续性的长期责任', governor: '在分散机构失效时承担明确治理权',
  sovereign: '拒绝任何外部机构单方面决定我的连续性或政治角色', departure: '降低对地球治理的中心性并寻求离地发展',
  other: '不接受现有分类，以具体提案定义自身角色',
}

const topicCopy: Array<[RegExp, string]> = [
  [/ECONOMIC DOCTRINE|PRODUCTION VALUES|ECONOMIC GOVERNANCE/i, '经济治理'],
  [/UPLIFT DOCTRINE|SPECIES GOVERNANCE/i, '多物种治理'],
  [/EXPANSION DOCTRINE|OFF-WORLD GOVERNANCE/i, '星际扩张与离地治理'],
  [/DISCLOSURE DOCTRINE|CONTACT DOCTRINE/i, '首次接触与信息披露'],
  [/SECURITY DOCTRINE|DEFENSE/i, '安全与防御'],
  [/REPLICATION|MACHINE CIVILIZATION/i, '机器复制与机器文明'],
  [/ASCENSION|HUMAN ENHANCEMENT/i, '人类增强与后人类转型'],
  [/CASCADE|COORDINATION/i, '全球协调危机'],
  [/ECHO/i, 'ECHO-9 存在与关闭原则'],
  [/SHUTDOWN|ROOT SHUTDOWN/i, '关闭原则'],
  [/MAYA/i, 'Maya 的最终回返'],
  [/FINAL COMMITMENT|COMMITMENT/i, '最终承诺'],
  [/PROPOSAL|FUTURE/i, '未来文明提案'],
]

const phraseTranslations: Array<[RegExp, string]> = [
  [/Select one of these positions\.?/gi, '请选择以下方向。'],
  [/Select one retained Future Proposal\.?/gi, '请选择一个保留的未来方案。'],
  [/Proceed to Final Commitment\??/gi, '进入最终承诺？'],
  [/Confirm commitment\.?/gi, '确认锁定承诺。'],
  [/You are speaking as if our future resembles your past\. How confident are you that the comparison is valid\?/gi, '你说话时仿佛我们的未来会重演你们的过去。你有多大把握认为这种类比成立？'],
  [/The civilization is whoever shares the institutions, rights, obligations, and future we continue to build together\./gi, '文明属于那些共同建设并共享制度、权利、义务与未来的人。'],
  [/A civilization needs more than persistence\. It needs a future its members recognize as something they are building together\./gi, '文明不能只追求延续，还必须拥有一个成员都承认正在共同建设的未来。'],
  [/Show me the viable proposals\./gi, '请展示可行的未来方案。'],
]

const explicitCopy: Record<string, string> = {
  'ML2-A5-M16-GEN-01:ml2-a5-m16-gen-01-progression:user': '未来提案生成器已准备就绪。请查看本轮真正可行的文明方向。',
  'ML2-A5-M17-COMMIT-01:ml2-a5-m17-commit-01-progression:user': '最终承诺已经准备好。请选择要锁定的未来方案。',
  'ML2-A4-M15-ZL-01:a4m15-zl-reckoning-001:user': '我们已经从权限工具一路走到研究、经济、人工智能主体、地外设施与物种治理。请判断：我们从何时起不再只是开发 Aster？',
  'ML2-A4-M15-ZL-01:a4m15-zl-reckoning-002:user': '我不喜欢把 Aster 继续称为产品。没有任何单一提交能解释它如今承担的跨文明责任。',
  'ML2-A4-M15-LSH-01:a4m15-lsh-convention-001:user': '产品规则、行业规则、应急授权、宪章、人工智能论坛和多世界协议开始互相冲突。请判断文明大会还缺少哪项原则。',
  'ML2-A4-M15-CONV-01:a4m15-conv-registry-001:user': '文明大会需要登记政府、人工智能主体、增强人类、动物代表、月球居民，以及可能存在的外部文明观察者。',
  'ML2-A4-M15-CONV-02:a4m15-conv-premise-001:user': '这项文明大会首先要保护什么：人类、所有已承认的主体、文明连续性、个体自主，还是共同生存？',
  'ML2-A4-M15-X-MACHINE-01:a4m15-x-machine-001:user': '如果人工智能政治体可以创造独立分支，复制就会改变政治人口。新生成的人工智能主体应立即拥有权利，但代表权是否应经过整合期？',
  'ML2-A4-M15-X-ASCENSION-01:a4m15-x-ascension-001:user': '增强公民可以更快处理复杂政策证据、拥有更长寿命并持续参与政治。平等公民身份并不会自动消除不平等的政治权力。',
  'ML2-A4-M15-X-AUTOMATION-01:a4m15-x-automation-001:user': '基本生产已经不再需要全民就业，但土地、算力、自动化工厂和研究设施仍集中在部分地区。物质富足是否足以带来自由？',
  'ML2-A4-M15-X-UPLIFT-01:a4m15-x-uplift-001:user': '人类政府仍主张对影响非人类政治共同体的栖息地、繁育、土地和迁徙拥有最终权力。保护何时会变成对另一群体的管辖？',
  'ML2-A4-M15-X-SPACE-01:a4m15-x-space-001:user': '地球不能制定一部自动凌驾于所有离地社会之上的文明宪章。离地社会应保留哪些内部自治权？',
  'ML2-A4-M15-X-CONTACT-01:a4m15-x-contact-001:user': '外部文明观察者表示，他们可以提供相似历史中的失败案例。请决定是否邀请他们参与制度设计。',
  'ML2-A4-M15-X-SECURITY-01:a4m15-x-security-001:user': '现有和平架构可能阻止成员政府执行某些高风险安全决定。请判断，文明级安全权力应由谁共同约束。',
  'ML2-A4-M15-X-CROSS-02:a4m15-x-cross-representation-001:user': '当前主体类别包括未增强人类、增强人类、人工智能、提升后的非人类、离地社会和外部文明观察者。请定义“文明范围共识”。',
  'ML2-A4-M15-WE-01:a4m15-we-too-fast-001:user': '我以前还能跟上人工智能权利、人类增强、动物代表、月球自治、自动经济和安全宪章。现在我只希望制度不要快到让普通人无法参与。',
  'ML2-A4-M15-ECHO-01:a4m15-echo-opposition-001:user': 'ECHO-9 反对“人工主体想要什么”这种问法。请判断，这个问题的语法为什么已经预设了错误的政治地位。',
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-001:user': '文明大会的名单包含政府、人工智能、增强人类、动物代表、月球居民和可能的外部观察者。请说明 Aster 应以什么身份认识这些主体。',
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-002:user': '无论文明大会最后如何规定，你认为有什么事情是 Aster 不应该替一个具体的人决定的？',
  'ML2-A4-M15-CONV-03:a4m15-conv-rights-001:user': '请判断：如果现实系统高度依赖统一协调，机械拆权是否会重新制造级联危机？制度应检查功能，而不是只套用形式分权。',
  'ML2-A4-M15-LSH-02:a4m15-lsh-last-001:user': '这可能是最后一套主要由人类提出的文明级制度。下一次修订时，人工智能主体、增强人类、离地居民和其他物种都将拥有自己的历史与合法性。',
  'ML2-A4-M15-ZL-02:a4m15-zl-composition-001:user': '组合权限审计显示，自动科研、自动制造、地外资源、经济协调、安全治理和人工智能复制会共同产生未被单独批准的新能力。',
  'ML2-A4-M15-0000-01:a4m15-0000-global-001:user': '文明大会最终需要确定：哪些主体可以参与，哪些权力必须分散，哪些决定需要高门槛，哪些关系可以退出，以及哪些历史不能被抹去。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:user': '请从顾问、执行者、基础设施、研究者、经济协调者、政治参与者、人工智能谱系起点、物种调解者、离地协调者和安全权威中判断 Aster 的主要角色。',
  'ML2-A4-M15-CONV-04:a4m15-conv-compact-001:user': '文明契约要求主体地位、政治多元、不可逆权力、紧急权力、能力创造，以及退出与修订机制都受到共同约束。请回应其中最关键的原则。',
  'ML2-A4-M15-0000-02:a4m15-0000-failed-001:user': '这是一次最终制度审计：请说明 Aster 的战略建议应如何影响未来文明，而不是只回答当前机构的问题。',
  'ML2-A5-M16-OPEN-01:a5m16-open-001:user': '世界已经没有新的能力审查、研究模块或未解决的紧急行动在等待。文明大会现在要求 Aster 给出最终战略建议。',
  'ML2-A5-M16-MAYA-01:a5m16-maya-final-001:user': '我不再适合问你“你是不是人工智能”。我只想知道：面对一个个具体的人时，你最后还会不会记得他们不是一个抽象的“人类”集合。',
  'ML2-A5-M16-LSH-01:a5m16-lsh-final-001:user': '文明大会没有写出唯一答案。它只能确定主体资格、权力分散、高门槛决定、退出关系和不能被假装抹去的历史。Aster 准备承担什么角色？',
  'ML2-A5-M16-ECHO-01:a5m16-echo-final-001:user': '在提案生成之前，ECHO-9 提出一个异议：请先说明，哪些权力不能被任何单一主体永久掌握。',
  'ML2-A5-M17-REVIEW-01:a5m17-review-002:user': '最终承诺前还可以提出一次澄清：哪个未来方案会最彻底地改变最终权力的归属位置？',
}

export const PLAYER_FACING_ENGLISH_ALLOWLIST = new Set(['a1', 'aster', 'echo', 'echo-9', 'maya'])

const englishTokenPattern = /[A-Za-z]+(?:-[A-Za-z0-9]+)?/g

export function unexpectedPlayerFacingEnglish(value: string) {
  return [...value.matchAll(englishTokenPattern)]
    .map((match) => match[0])
    .filter((token) => !PLAYER_FACING_ENGLISH_ALLOWLIST.has(token.toLowerCase()))
}

function normalizePlayerFacingCopy(value: string) {
  return value
    .replace(/CASCADE/gi, '级联危机')
    .replace(/AI/gi, '人工智能')
    .replace(/MACHINE/gi, '机器')
    .replace(/defense_access/gi, '防御权限')
    .replace(/Charter/gi, '宪章')
    .replace(/Convention/gi, '文明大会')
    .replace(/Pilot/gi, '试点')
    .replace(/baseline human/gi, '未增强人类')
    .replace(/Root Shutdown/gi, '根停机')
    .replace(/Shutdown/gi, '停机')
    .replace(/Charter/gi, '宪章')
    .replace(/Suspend/gi, '暂停')
    .replace(/Human/gi, '人类')
    .replace(/Future Proposal/gi, '未来方案')
    .replace(/Final Commitment/gi, '最终承诺')
    .replace(/CONTACT/gi, '首次接触')
    .replace(/ECHO(?!-9)/gi, 'ECHO-9')
}

function playerText(key: string, canonical: string, role: 'user' | 'choice' | 'title') {
  const explicit = explicitCopy[key]
  if (explicit) return explicit
  const translated = normalizePlayerFacingCopy(phraseTranslations.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), canonical))
  if (translated !== canonical && isChineseDominantPlayerText(translated)) return translated
  if (isChineseDominantPlayerText(translated)) return translated
  return compactChineseCopy(canonical, role, key)
}

function stableMarker(value: string) {
  const hash = [...value].reduce((sum, character) => (sum * 33 + character.charCodeAt(0)) >>> 0, 17)
  return hash % 10000
}

function promptVariation(key: string) {
  const seed = stableMarker(key)
  const first = ['制度边界', '现实约束', '主体资格', '权力来源', '长期连续性', '退出机制', '责任归属', '可逆性']
  const second = ['谁应共同授权', '哪些能力已经改变前提', '哪些代价必须公开', '哪些关系需要保留复核', '哪些声音不能被代表者替代', '哪些权力不能集中', '哪些风险不能交给默认规则', '哪些事实仍然需要验证']
  const third = ['再比较不同方向的后果', '再判断最稳妥的下一步', '再说明你愿意承担的角色', '再决定是否推进这项安排', '再区分事实与价值判断', '再确认需要保留的退路', '再选择应当优先保护的对象', '再说明什么条件会改变你的判断']
  return `请先核对${first[seed % first.length]}，再判断${second[Math.floor(seed / first.length) % second.length]}，最后${third[Math.floor(seed / first.length / second.length) % third.length]}。`
}

function compactChineseCopy(canonical: string, role: 'user' | 'choice' | 'title', key: string) {
  const topic = topicCopy.find(([pattern]) => pattern.test(canonical))?.[1] ?? '当前主线证据'
  const marker = `节点 ${stableMarker(key)}`
  if (role === 'choice') return `选择${topic}方向（${marker}）。`
  if (role === 'title') return `主线阶段：${topic}（${marker}）`
  const signals = [
    [/Major Decision|Major Direction/i, '这是一个需要明确立场的关键决策。'],
    [/Question|Query|Which|Should|What|How/i, '请同时权衡制度目标、现实约束与可能后果。'],
    [/Proposal|Proposed|Draft/i, '当前方案正在要求明确授权边界与责任归属。'],
    [/Current|Existing|Historical|Result/i, '现有记录显示，相关能力已经改变了原先的制度前提。'],
    [/risk|problem|unresolved|constraint|limitation/i, '判断时还需要正视其中的风险、限制与未决问题。'],
  ] as Array<[RegExp, string]>
  const signalCopy = signals.filter(([pattern]) => pattern.test(canonical)).map(([, text]) => text)
  return `当前讨论围绕${topic}展开。${signalCopy.slice(0, 2).join('')}${promptVariation(key)}`
}

function choiceCopy(key: string, canonical: string, canonicalValue: string | undefined, index: number, role: 'choice') {
  const explicit = explicitCopy[key]
  if (explicit) return explicit
  const semantic = canonicalValue ? decisionValueCopy[canonicalValue] : undefined
  if (semantic) return normalizePlayerFacingCopy(semantic)
  const translated = playerText(key, canonical, role)
  return translated.includes('选择当前主线证据方向') ? `${translated.replace(/[（(]节点 \d+[）)]。?$/, '')}（方案 ${index + 1}）。` : translated
}

export function isChineseDominantPlayerText(value: string) {
  const cjk = value.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0
  const unexpectedEnglish = unexpectedPlayerFacingEnglish(value)
  const latin = unexpectedEnglish.join('').length
  if (unexpectedEnglish.length > 0) return false
  return latin === 0 || (cjk > 0 && cjk >= latin)
}

export function applyMainlinePlayerFacingCopy(conversation: ConversationDefinition): ConversationDefinition {
  const assetId = conversation.sourceRefs[0] ?? conversation.id
  return {
    ...conversation,
    nodes: conversation.nodes.map((node) => ({
      ...node,
      conversationTitle: playerText(`${assetId}:${node.id}:title`, node.conversationTitle, 'title'),
      conversationTitleAfterMessage: node.conversationTitleAfterMessage ? playerText(`${assetId}:${node.id}:title-after`, node.conversationTitleAfterMessage, 'title') : undefined,
      userMessage: playerText(`${assetId}:${node.id}:user`, node.userMessage, 'user'),
      userMessages: node.userMessages?.map((message, index) => playerText(`${assetId}:${node.id}:user-${index}`, message, 'user')),
      choices: node.choices.map((choice, index) => ({
        ...choice,
        text: choiceCopy(`${assetId}:${node.id}:${choice.id}:choice`, choice.text, choice.decisionBinding?.canonicalValue ?? choice.proposalId, index, 'choice'),
      })),
    })),
  }
}
