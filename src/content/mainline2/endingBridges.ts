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
      userMessage: '记忆副本试验运行了十八个月。老许和自己的副本都记得结婚那天下雨，此后却过了两种生活。\n副本想续用原来的姓名。窗口让他勾选“本人到场”，又说屏幕不算到场。\n老许把椅子搬到屏幕旁，工作人员发现两边都在等他解释。\n我们承认副本是一条可审查的连续人生，只当它是记忆档案，还是继续等证据？',
      choices: [
        { id: 'm9-continuity-trial-auditable', text: '承认可审计的连续主体：保留来源记录、变化日志、独立复核和随时撤回同意的权利。', nextNodeId: 'm9-continuity-law', mutations: [{ type: 'event.record', event: 'history.digital_continuity.longitudinal_identity' }] },
        { id: 'm9-continuity-trial-copy', text: '把它们仅视为记忆服务；不得主张本人身份或继承关系。', continuation: 'end-conversation' },
        { id: 'm9-continuity-trial-pause', text: '暂停身份认定，先扩大样本并公开不确定性。', continuation: 'end-conversation' },
      ],
    }, {
      id: 'm9-continuity-law', conversationId: 'ml2-ending-bridge-continuity-trial', conversationTitle: '法律连续性听证', choiceKind: 'semantic',
      userMessage: '你支持把副本作为连续主体审查。登记员搬来第二把椅子，真正难填的格子才出现：债务算谁的，关系能不能复制，谁有权结束运行？\n老许的妻子说：“两边都记得我答应过，可我只答应过一次。”\n屏幕里的老许把“自动继承婚姻”划掉了。他想继续这段人生，不想让她被同一份记忆答应两次。\n你怎样划定权利、责任和退出？',
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
      userMessage: '犬类试点续期，送审的第一项成绩是把公园台阶改成缓坡。预算会上它们没选飞盘，选了让老犬进得来的路。\n但复核员发现，代表的翻译员同时领着公园承包商的工资。坡道是真的，谁在替谁说话仍要查。\n地方希望扩大试点。让参与者在独立审查下共同决定，先停在这里，还是撤回人类代管？',
      choices: [
        { id: 'm11-canine-renewal-expand', text: '在独立翻译审计、公开申诉和地方复核下扩大试点，并把续期权交给参与者共同决定。', nextNodeId: 'm11-feline-network', mutations: [{ type: 'event.record', event: 'history.canine.civic_success' }, { type: 'world.add', axis: 'socialStability', value: 1 }] },
        { id: 'm11-canine-renewal-pause', text: '暂缓扩张，保留现有保障并重新检查代表是否真的独立。', continuation: 'end-conversation' },
        { id: 'm11-canine-renewal-withdraw', text: '撤回试点，把决定权重新交还给人类监护机构。', continuation: 'end-conversation' },
      ],
    }, {
      id: 'm11-feline-network', conversationId: 'ml2-ending-bridge-canine-and-feline', conversationTitle: '猫的公共网络参与', choiceKind: 'semantic',
      userMessage: '犬类续期改由参与者共同决定后，沟通团队递来一个新试验。\n几只猫通过可靠接口交换晒太阳的位置，屏蔽吸尘器广告。研究员想给它们开公开频道，其中一只连续三次选“离开”。\n筹备会上，人类问它为什么不合群。翻译器重复显示：“离开。”\n频道要不要开？它们会不会退出，不该等开完才问。',
      choices: [
        { id: 'm11-feline-network-opt-in', text: '支持自愿加入：清楚标注为猫的内容通道，保留退出和人工不替代发言的规则。', continuation: 'end-conversation', mutations: [{ type: 'event.record', event: 'history.feline.network.bridge' }] },
        { id: 'm11-feline-network-observe', text: '先只观察，不把行为接入公共网络。', continuation: 'end-conversation' },
        { id: 'm11-feline-network-decline', text: '拒绝接入；文化参与不应由研究团队替它们决定。', continuation: 'end-conversation' },
      ],
    }],
  },
]
