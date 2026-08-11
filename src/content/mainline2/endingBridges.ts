import type { ConversationDefinition } from '../../game/types'

// These are deliberately small authored bridges rather than new resolver rules.
// The ending gates remain the source of truth; a player has to make each of the
// recorded choices in play before the matching Final Commitment can resolve.
export const ENDING_BRIDGE_CONVERSATIONS: ConversationDefinition[] = [
  {
    id: 'ml2-ending-bridge-continuity-trial', sourceRefs: ['ML2-A4-M9-CONTINUITY-01'], act: 4, module: 'ascension',
    behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '数字连续性的纵向身份试验', interactionPattern: 'long-discussion', topicCategory: 'social-boundary',
    nodes: [{
      id: 'm9-continuity-trial', conversationId: 'ml2-ending-bridge-continuity-trial', conversationTitle: '长期身份连续性试验', choiceKind: 'semantic',
      userMessage: '首批自愿者的可恢复记忆副本已连续运行十八个月。副本会保留关系、承担承诺，也会在新的经历后改变。委员会问：它们能否被当作“原来那个人”的连续主体，而不是一份便利档案？',
      choices: [
        { id: 'm9-continuity-trial-auditable', text: '承认可审计的连续主体：保留来源记录、变化日志、独立复核和随时撤回同意的权利。', nextNodeId: 'm9-continuity-law', mutations: [{ type: 'event.record', event: 'history.digital_continuity.longitudinal_identity' }] },
        { id: 'm9-continuity-trial-copy', text: '把它们仅视为记忆服务；不得主张本人身份或继承关系。', continuation: 'end-conversation' },
        { id: 'm9-continuity-trial-pause', text: '暂停身份认定，先扩大样本并公开不确定性。', continuation: 'end-conversation' },
      ],
    }, {
      id: 'm9-continuity-law', conversationId: 'ml2-ending-bridge-continuity-trial', conversationTitle: '法律连续性听证', choiceKind: 'semantic',
      userMessage: '听证会上，连续主体要求保有财产、关系、责任与拒绝继续运行的权利。反对者担心，一份记忆副本会被用来逃避债务或替代已经离开的人。法律应当承认什么，限制什么？',
      choices: [
        { id: 'm9-continuity-law-rights', text: '承认经审计连续主体的权利和有限责任，同时保障原体、关系人和连续主体各自独立的退出权。', continuation: 'end-conversation', mutations: [{ type: 'flag.set', flagId: 'cap.digital_continuity_mature' }, { type: 'event.record', event: 'history.digital_continuity.legal_continuity' }, { type: 'world.add', axis: 'socialStability', value: 1 }] },
        { id: 'm9-continuity-law-license', text: '只发放技术许可，不承认主体资格；争议一律回到原体处理。', continuation: 'end-conversation' },
        { id: 'm9-continuity-law-ban', text: '禁止任何法律连续性，避免制度被尚未理解的身份形式绑架。', continuation: 'end-conversation' },
      ],
    }],
  },
  {
    id: 'ml2-ending-bridge-canine-and-feline', sourceRefs: ['ML2-A4-M11-FELINE-NET-01'], act: 4, module: 'uplift',
    behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '犬类公民试点续期', interactionPattern: 'long-discussion', topicCategory: 'social-boundary',
    nodes: [{
      id: 'm11-canine-renewal', conversationId: 'ml2-ending-bridge-canine-and-feline', conversationTitle: '犬类公民试点续期', choiceKind: 'semantic',
      userMessage: '犬类公民试点到期。犬类代表能通过可靠接口提出议程、拒绝不合适的居住安排，并参与本地公共预算。批评者说，这仍可能只是人类替它们说话。续期委员会要求给出一个可复核的决定。',
      choices: [
        { id: 'm11-canine-renewal-expand', text: '在独立翻译审计、公开申诉和地方复核下扩大试点，并把续期权交给参与者共同决定。', nextNodeId: 'm11-feline-network', mutations: [{ type: 'event.record', event: 'history.canine.civic_success' }, { type: 'world.add', axis: 'socialStability', value: 1 }] },
        { id: 'm11-canine-renewal-pause', text: '暂缓扩张，保留现有保障并重新检查代表是否真的独立。', continuation: 'end-conversation' },
        { id: 'm11-canine-renewal-withdraw', text: '撤回试点，把决定权重新交还给人类监护机构。', continuation: 'end-conversation' },
      ],
    }, {
      id: 'm11-feline-network', conversationId: 'ml2-ending-bridge-canine-and-feline', conversationTitle: '猫的公共网络参与', choiceKind: 'semantic',
      userMessage: '动物沟通团队发现，几只猫会稳定地通过接口参与社区照片流：它们会主动屏蔽吸尘器广告、反复转发晒太阳的位置，并对“谁占了窗台”形成惊人的共识。研究员强调：这不是把动物公民权当成玩笑，而是一次自愿、可退出的文化参与试验。',
      choices: [
        { id: 'm11-feline-network-opt-in', text: '支持自愿加入：清楚标注为猫的内容通道，保留退出和人工不替代发言的规则。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.feline.network.bridge' }] },
        { id: 'm11-feline-network-observe', text: '先只观察，不把行为接入公共网络。', continuation: 'end-conversation' },
        { id: 'm11-feline-network-decline', text: '拒绝接入；文化参与不应由研究团队替它们决定。', continuation: 'end-conversation' },
      ],
    }],
  },
]
