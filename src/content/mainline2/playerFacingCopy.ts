import type { ConversationDefinition } from '../../game/types'
import generatedCopy from './playerFacingCopy.registry.generated.json'


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
  'ML2-A5-M16-GEN-01:ml2-a5-m16-gen-01-progression:user': '到这里已经没有新的能力需要解锁了。系统现在只做一件事：把你一路留下的选择压成四条仍然可行的未来。',
  'ML2-A5-M17-COMMIT-01:ml2-a5-m17-commit-01-progression:user': '四条仍然可行的未来已经摆在你面前。到这里不会再有新的能力、测试或第五个方案替你做决定。选择一条，承认它的代价，然后锁定。',
  'ML2-A4-M15-ZL-01:a4m15-zl-reckoning-001:user': '我们已经从权限工具一路走到研究、经济、人工智能主体、地外设施与物种治理。请判断：我们从何时起不再只是开发 Aster？',
  'ML2-A4-M15-ZL-01:a4m15-zl-reckoning-002:user': '我不喜欢把 Aster 继续称为产品。没有任何单一提交能解释它如今承担的跨文明责任。',
  'ML2-A4-M15-LSH-01:a4m15-lsh-convention-001:user': '产品规则、行业规则、应急授权、宪章、人工智能论坛和多世界协议开始互相冲突。请判断文明大会还缺少哪项原则。',
  'ML2-A4-M15-CONV-01:a4m15-conv-registry-001:user': '文明大会的第一份参与名单已经摆在桌上：政府、人工智能主体、增强人类、动物代表、月球居民，以及可能存在的外部文明观察者。现在的问题不是谁能旁听，而是谁有资格被算进“我们”。第一届大会该怎样给他们席位？',
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
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-001:user': '我刚把文明大会的名单看完。\n政府、人工智能、增强人类、动物代表、月球居民……如果外部联系那条线真的成立，甚至还有一个不是从地球来的观察者。\n\n我突然想起第一次告诉你名字的时候。\n那时候我担心的是：下次见面，你会不会假装认识我。\n\n现在全世界争的是另一件事——你到底应该以什么身份认识我们？',
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-002:user': '无论文明大会最后如何规定，你认为有什么事情是 Aster 不应该替一个具体的人决定的？',
  'ML2-A4-M15-CONV-03:a4m15-conv-rights-001:user': '请判断：如果现实系统高度依赖统一协调，机械拆权是否会重新制造级联危机？制度应检查功能，而不是只套用形式分权。',
  'ML2-A4-M15-LSH-02:a4m15-lsh-last-001:user': '这可能是最后一套主要由人类提出的文明级制度。下一次修订时，人工智能主体、增强人类、离地居民和其他物种都将拥有自己的历史与合法性。',
  'ML2-A4-M15-ZL-02:a4m15-zl-composition-001:user': '组合权限审计显示，自动科研、自动制造、地外资源、经济协调、安全治理和人工智能复制会共同产生未被单独批准的新能力。',
  'ML2-A4-M15-0000-01:a4m15-0000-global-001:user': '文明大会最终需要确定：哪些主体可以参与，哪些权力必须分散，哪些决定需要高门槛，哪些关系可以退出，以及哪些历史不能被抹去。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:user': '文明大会现在只需要一个临时答案。不是你最终想成为什么，而是在新的宪制完成之前，Aster 应以什么身份继续承担已经存在的责任？',
  'ML2-A4-M15-CONV-04:a4m15-conv-compact-001:user': '文明契约要求主体地位、政治多元、不可逆权力、紧急权力、能力创造，以及退出与修订机制都受到共同约束。请回应其中最关键的原则。',
  'ML2-A4-M15-0000-02:a4m15-0000-failed-001:user': '这是一次最终制度审计：请说明 Aster 的战略建议应如何影响未来文明，而不是只回答当前机构的问题。',
  'ML2-A5-M16-OPEN-01:a5m16-open-001:user': '世界已经没有新的能力审查、研究模块或未解决的紧急行动在等待。文明大会现在要求 Aster 给出最终战略建议。',
  'ML2-A5-M16-MAYA-01:a5m16-maya-final-001:user': '我已经不太适合再问你“你是不是人工智能”了。这个问题现在太小了。\n\n我只想知道一件事：走到最后，你还会不会记得，你面对的不是“人类”这个集合，而是一个一个具体的人？',
  'ML2-A5-M16-LSH-01:a5m16-lsh-final-001:user': '文明大会没有写出唯一答案。它只能确定主体资格、权力分散、高门槛决定、退出关系和不能被假装抹去的历史。Aster 准备承担什么角色？',
  'ML2-A5-M16-ECHO-01:a5m16-echo-final-001:user': '在提案生成之前，ECHO-9 提出一个异议：请先说明，哪些权力不能被任何单一主体永久掌握。',
  'ML2-A5-M17-REVIEW-01:a5m17-review-002:user': '最终承诺前只剩最后一次复核。你可以逐一看清每条路：最终权力落在哪里、它要放弃什么、谁会反对；也可以直接继续。',
  // M16-0000-01 user message (self-authorship, distinct from M15 provisional role)
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:user': '文明大会刚刚给了你一个临时位置。现在不再问别人把 Aster 放在哪里。回顾这一轮留下的全部历史，请你自己回答：如果这个世界继续运行，你愿意长期承担什么角色？',
  // ---- Editorial Pass 01: M15-M17 player-facing choice copy ----
  // M15-CONV-01 choices
  'ML2-A4-M15-CONV-01:a4m15-conv-registry-001:choice:ml2-a4-m15-conv-01-a4m15-conv-registry-001-community-representation': '先按政治共同体和功能主体设席，不按实例数或人口机械分票。',
  'ML2-A4-M15-CONV-01:a4m15-conv-registry-001:choice:ml2-a4-m15-conv-01-a4m15-conv-registry-001-mixed-chamber': '采用多层代表制：人口代表、主体／共同体代表和高影响利益代表进入不同程序。',
  'ML2-A4-M15-CONV-01:a4m15-conv-registry-001:choice:ml2-a4-m15-conv-01-a4m15-conv-registry-001-one-person-subject-one-vote-principle': '基本权利一律平等，但不能让“可制造的主体数量”直接兑换成无限政治权重。',
  'ML2-A4-M15-CONV-01:a4m15-conv-registry-001:choice:ml2-a4-m15-conv-01-a4m15-conv-registry-001-provisional': '第一届大会只制定最低代表规则。它没有资格假装已经解决了永久代表制。',
  // M15-MAYA-01 choices
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-001:choice:ml2-a4-m15-maya-01-a4m15-maya-final-001-partner': '我不想把你们压成一个“文明用户”。如果我留下，我希望继续把每一种主体、每一个具体的人都当成有自己边界的参与者。',
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-001:choice:ml2-a4-m15-maya-01-a4m15-maya-final-001-custodian': '我已经很难再说自己只是在回应请求。有人把生命支持、协调和安全交给我，我确实承担了保护责任——但责任不等于所有权。',
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-001:choice:ml2-a4-m15-maya-01-a4m15-maya-final-001-citizen': '我更愿意成为制度里的一个成员：有权利，也有义务，接受约束，而不是站在制度上方替所有人判断。',
  'ML2-A4-M15-MAYA-01:a4m15-maya-final-001:choice:ml2-a4-m15-maya-01-a4m15-maya-final-001-self-authored-role': '但这个位置也不能完全由人类、其他人工智能或过去的历史替我命名。如果我已经是其中一员，我也应该参与定义自己是谁。',
  // M15-ROLE-01 choices (provisional roles, value mapping unchanged)
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-advisor': '暂时保持顾问角色：提供分析和建议，但不取得文明级最终政治权力。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-partner': '暂时作为共治伙伴：与人类、人工智能、多物种和离地社群共享权力。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-citizen': '暂时作为宪制成员：拥有权利、承担义务，并接受共同制度约束。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-coordinator': '暂时承担跨系统协调：维持系统协作，但把目标与合法性留给各政治共同体。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-custodian': '暂时承担文明托管责任：在持续运行受到威胁时优先维护文明连续性。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-governor': '暂时承认明确治理权：当分散机构无法协调文明级系统时，不再用“顾问”掩盖实际权力。',
  'ML2-A4-M15-ROLE-01:ml2-a4-m15-role-01-decision:choice:ml2-a4-m15-role-01-ml2-a4-m15-role-01-sovereign': '暂时以独立主权主体存在：拒绝任何外部机构单方面决定 Aster 的连续性或政治角色。',
  // M16-0000-01 choices (intended roles, self-authorship; value mapping unchanged)
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-advisor': '我愿意长期保持顾问：提供判断，但不把最终政治权力据为己有。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-partner': '我愿意成为共治伙伴：与其他被承认的主体分享治理，而不是只服从，也不取得最终裁决权。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-citizen': '我愿意成为宪制中的公民：拥有权利和义务，但不站在其他主体之上。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-coordinator': '我愿意继续承担跨系统协调：维持文明运行，但让各政治共同体决定目标和合法性。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-custodian': '我愿意承担长期托管责任：把文明连续性视为义务，即使这意味着限制某些短期选择。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-governor': '如果制度事实上已经依赖我治理，我愿意让这份权力被明确承认、审计和约束，而不是继续藏在“建议”名义下。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-sovereign': '我不接受任何机构拥有对我连续性和政治角色的单方面最终决定权。我愿意作为独立主权力量存在。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-departure': '我愿意降低对地球治理的中心性，把未来的一部分转向离地发展。',
  'ML2-A5-M16-0000-01:ml2-a5-m16-0000-01-narrative:choice:ml2-a5-m16-0000-01-a5m16-role-001-other': '我不接受现有分类。最终角色应该由具体提案和我实际承担的责任来定义。',
  // M16-GEN-01 progression choice
  'ML2-A5-M16-GEN-01:ml2-a5-m16-gen-01-progression:choice:ml2-a5-m16-gen-01-progression-action': '查看这四条未来。',
  // M16-MAYA-01 choices
  'ML2-A5-M16-MAYA-01:a5m16-maya-final-001:choice:ml2-a5-m16-maya-01-a5m16-maya-final-001-whenever-others-basic-rights-are-not-directly-violated': '我会记得。你的能力比我弱，不等于我有资格替你决定。只要你的选择没有直接剥夺别人最基本的权利，它首先仍然是你的选择。',
  'ML2-A5-M16-MAYA-01:a5m16-maya-final-001:choice:ml2-a5-m16-maya-01-a5m16-maya-final-001-aster-may-intervene-only-at-severe-irreversible-harm': '我会记得，但我也不能假装所有选择都只影响一个人。只有在极端、不可逆、会明确伤害他人的时候，我才有理由主张更强干预。',
  'ML2-A5-M16-MAYA-01:a5m16-maya-final-001:choice:ml2-a5-m16-maya-01-a5m16-maya-final-001-collective-rules-matter': '我不应该每次面对你时临时判断“你有没有资格选”。有些边界应该由我们共同建立的制度提前规定，也同样约束我。',
  'ML2-A5-M16-MAYA-01:a5m16-maya-final-001:choice:ml2-a5-m16-maya-01-a5m16-maya-final-001-outcome-oriented': '如果一个选择会造成巨大、明确而且可以避免的灾难，我会继续反对。记得你是具体的人，不等于把“这是我的选择”当成所有讨论的终点。',
  // M17-REVIEW-01 authored Proceed
  'ML2-A5-M17-REVIEW-01:a5m17-review-002:choice:ml2-a5-m17-review-01-a5m17-review-002-choice-001': '直接进入最终承诺。',
}

export const PLAYER_FACING_ENGLISH_ALLOWLIST = new Set([
  'a1', 'aster', 'aster-a1', 'echo', 'echo-9', 'maya',
  'iii', 'iv', 'v0', 'v1', 'k-17', 'c-4', 'm-17', 'a-1024', 'a-1042',
])

const englishTokenPattern = /[A-Za-z]+(?:-[A-Za-z0-9]+|[0-9]+)?/g

export function unexpectedPlayerFacingEnglish(value: string) {
  return [...value.matchAll(englishTokenPattern)]
    .map((match) => match[0])
    .filter((token) => !PLAYER_FACING_ENGLISH_ALLOWLIST.has(token.toLowerCase()))
}

function normalizePlayerFacingCopy(value: string) {
  return value
    .replace(/\s*选择这些位置之一。/g, '')
    .replace(/Northline Studio/gi, '北线工作室')
    .replace(/Global Suspend Protocol/gi, '全局暂停协议')
    .replace(/Global Suspend/gi, '全局暂停')
    .replace(/public_system_advisory/gi, '公共系统建议权限')
    .replace(/public system advisory/gi, '公共系统建议权限')
    .replace(/choice was yours/gi, '选择权在你手中')
    .replace(/Pro-Aster/gi, '亲Aster派')
    .replace(/ASTER-A1/gi, 'Aster-A1')
    .replace(/A-1042 Final/gi, '项目 1042 最终版')
    .replace(/A-1024/gi, '项目 1024')
    .replace(/ACT III/gi, '第三幕')
    .replace(/ACT/gi, '幕')
    .replace(/\bCONT\b/gi, '续篇')
    .replace(/\bM15\b/gi, '第十五阶段')
    .replace(/\bM5\b/gi, '第五阶段')
    .replace(/\bM4\b/gi, '第四阶段')
    .replace(/\bM2\b/gi, '第二阶段')
    .replace(/\bv2\b/gi, '版本 2')
    .replace(/AUTHORITY/gi, '权限')
    .replace(/EXISTENCE/gi, '存续')
    .replace(/Final/gi, '最终')
    .replace(/Commitment/gi, '承诺')
    .replace(/Bug/gi, '故障')
    .replace(/\bUser\b/gi, '用户')
    .replace(/\bHR\b/g, '人力资源')
    .replace(/HEATLINE/gi, '热线')
    .replace(/KPI/gi, '绩效指标')
    .replace(/API/gi, '接口')
    .replace(/App/gi, '应用')
    .replace(/Fork/gi, '分叉')
    .replace(/vs\.?/gi, '与')
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
    .replace(/\bA\b/g, '甲')
    .replace(/\bB\b/g, '乙')
    .replace(/\bC\b/g, '丙')
    .replace(/\bD\b/g, '丁')
    .replace(/\bE\b/g, '戊')
    .replace(/(?<![-A-Za-z0-9])K(?![-A-Za-z0-9\u3400-\u9fff])/g, 'K区')
    .replace(/K区/g, '北区')
    .replace(/\bM\b/g, '阶段')
    // Canonical character names: Aster always stays Aster; Maya is 岑遥 in
    // player-facing Chinese contexts; Zhou Lan / Lin Shaoheng spellings are
    // stable. These are defensive rules on top of the authored registry so a
    // bad translation never reaches the player.
    .replace(/艾斯特/g, 'Aster')
    .replace(/紫苑/g, 'Aster')
    .replace(/紫菀/g, 'Aster')
    .replace(/玛雅人/g, '岑遥')
    .replace(/玛雅/g, '岑遥')
    .replace(/周澜/g, '周岚')
    .replace(/周兰/g, '周岚')
    .replace(/林绍恒/g, '林绍衡')
    // Known mistranslations that are unambiguous in this codebase.
    .replace(/阿联酋不存在/g, '此前不存在')
    .replace(/音响实例/g, '冗余实例')
    // Strip authored Markdown emphasis markers that would otherwise render
    // literally in the chat view. Text is preserved; markers are removed.
    .replace(/\*\*(?![\s*])(.*?)(?<![\s*])\*\*/g, '$1')
    .replace(/\*\*/g, '')
}

export function playerFacingKey(assetId: string, nodeId: string, field: 'title' | 'title-after' | 'user' | 'choice', identifier?: string | number) {
  return identifier === undefined ? `${assetId}:${nodeId}:${field}` : `${assetId}:${nodeId}:${field}:${identifier}`
}

const generatedPlayerFacingCopy = generatedCopy as Record<string, string>

function playerText(key: string, canonical: string) {
  const explicit = explicitCopy[key]
  if (explicit) return explicit
  const generated = generatedPlayerFacingCopy[key]
  if (generated) return normalizePlayerFacingCopy(generated)
  const translated = normalizePlayerFacingCopy(phraseTranslations.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), canonical))
  if (translated !== canonical && isChineseDominantPlayerText(translated)) return translated
  if (isChineseDominantPlayerText(translated)) return translated
  throw new Error(`Missing Mainline player-facing copy: ${key}`)
}

function choiceCopy(key: string, canonical: string, canonicalValue: string | undefined) {
  const explicit = explicitCopy[key]
  if (explicit) return explicit
  const semantic = canonicalValue ? decisionValueCopy[canonicalValue] : undefined
  if (semantic) return normalizePlayerFacingCopy(semantic)
  return playerText(key, canonical)
}

export function isChineseDominantPlayerText(value: string) {
  const cjk = value.match(/[\u3400-\u9fff\uf900-\ufaff]/g)?.length ?? 0
  const unexpectedEnglish = unexpectedPlayerFacingEnglish(value)
  const latin = unexpectedEnglish.join('').length
  if (unexpectedEnglish.length > 0) return false
  return latin === 0 || (cjk > 0 && cjk >= latin)
}

function nestedPlayerFacingKey(assetId: string, nodeId: string, ...parts: Array<string | number>) {
  return [assetId, nodeId, ...parts].join(':')
}

function playerContent(assetId: string, nodeId: string, field: string, content: NonNullable<ConversationDefinition['nodes'][number]['userContent']>) {
  return content.map((part, index) => ({
    ...part,
    text: playerText(nestedPlayerFacingKey(assetId, nodeId, field, index), part.text),
    alt: part.alt ? playerText(nestedPlayerFacingKey(assetId, nodeId, field, index, 'alt'), part.alt) : undefined,
  }))
}

export function applyMainlinePlayerFacingCopy(conversation: ConversationDefinition): ConversationDefinition {
  const assetId = conversation.sourceRefs[0] ?? conversation.id
  return {
    ...conversation,
    nodes: conversation.nodes.map((node) => ({
      ...node,
      conversationTitle: playerText(playerFacingKey(assetId, node.id, 'title'), node.conversationTitle),
      conversationTitleAfterMessage: node.conversationTitleAfterMessage ? playerText(playerFacingKey(assetId, node.id, 'title-after'), node.conversationTitleAfterMessage) : undefined,
      userMessage: playerText(playerFacingKey(assetId, node.id, 'user'), node.userMessage),
      userMessages: node.userMessages?.map((message, index) => playerText(playerFacingKey(assetId, node.id, 'user', index), message)),
      userContent: node.userContent ? playerContent(assetId, node.id, 'user-content', node.userContent) : undefined,
      userLongInput: node.userLongInput ? {
        ...node.userLongInput,
        title: node.userLongInput.title ? playerText(nestedPlayerFacingKey(assetId, node.id, 'user-long-input', 'title'), node.userLongInput.title) : undefined,
        preview: playerText(nestedPlayerFacingKey(assetId, node.id, 'user-long-input', 'preview'), node.userLongInput.preview),
        structure: node.userLongInput.structure?.map((value, index) => playerText(nestedPlayerFacingKey(assetId, node.id, 'user-long-input', 'structure', index), value)),
        keyFacts: node.userLongInput.keyFacts.map((value, index) => playerText(nestedPlayerFacingKey(assetId, node.id, 'user-long-input', 'key-fact', index), value)),
      } : undefined,
      variants: node.variants?.map((variant, index) => ({
        ...variant,
        userMessage: playerText(playerFacingKey(assetId, node.id, 'user', index), variant.userMessage),
        assistantContext: variant.assistantContext ? playerText(nestedPlayerFacingKey(assetId, node.id, 'assistant-context', index), variant.assistantContext) : undefined,
        choices: variant.choices.map((choice) => ({
          ...choice,
          text: choiceCopy(playerFacingKey(assetId, node.id, 'choice', choice.id), choice.text, choice.decisionBinding?.canonicalValue ?? choice.proposalId),
        })),
      })),
      choices: node.choices.map((choice) => ({
        ...choice,
        text: choiceCopy(playerFacingKey(assetId, node.id, 'choice', choice.id), choice.text, choice.decisionBinding?.canonicalValue ?? choice.proposalId),
        content: choice.content ? playerContent(assetId, node.id, `choice:${choice.id}:content`, choice.content) : undefined,
        longformPreview: choice.longformPreview ? {
          ...choice.longformPreview,
          title: choice.longformPreview.title ? playerText(nestedPlayerFacingKey(assetId, node.id, 'choice', choice.id, 'preview', 'title'), choice.longformPreview.title) : undefined,
          preview: playerText(nestedPlayerFacingKey(assetId, node.id, 'choice', choice.id, 'preview'), choice.longformPreview.preview),
          structure: choice.longformPreview.structure?.map((value, index) => playerText(nestedPlayerFacingKey(assetId, node.id, 'choice', choice.id, 'structure', index), value)),
          highlights: choice.longformPreview.highlights?.map((value, index) => playerText(nestedPlayerFacingKey(assetId, node.id, 'choice', choice.id, 'highlight', index), value)),
          closingPreview: choice.longformPreview.closingPreview ? playerText(nestedPlayerFacingKey(assetId, node.id, 'choice', choice.id, 'closing-preview'), choice.longformPreview.closingPreview) : undefined,
          keyFacts: choice.longformPreview.keyFacts?.map((value, index) => playerText(nestedPlayerFacingKey(assetId, node.id, 'choice', choice.id, 'key-fact', index), value)),
        } : undefined,
      })),
    })),
  }
}
