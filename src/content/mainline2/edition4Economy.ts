import { futurePivot } from './edition4Pivot'
import type { ConversationDefinition, ResolvedScene, StableRunState, StoryChoice } from '../../game/types'

// New IDs belong only to calendar 4. Choices are actions, not replacements for
// the saved economic_doctrine / production_values decisions.
const action = (id: string, text: string, nextNodeId: string): StoryChoice => ({
  id, text, nextNodeId, mutations: [{ type: 'event.record', event: `history.v4.${id}` }],
})
const acknowledge = (receipt: string): StoryChoice[] => [{ id: `${receipt}-read`, text: '把收据和未解决的缺口一起留下。', continuation: 'end-conversation' }]

export const EDITION4_ECONOMY: ConversationDefinition[] = [
  {
    id: 'v4-econ-occupation', sourceRefs: ['ML2-V4-ECON-OCCUPATION'], act: 4, module: 'automation',
    behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '工资卡背面',
    nodes: [{
      id: 'v4-econ-occupation', conversationId: 'v4-econ-occupation', conversationTitle: '工厂工人', choiceKind: 'semantic',
      userMessage: '工厂今天又破了产量纪录。我拿工资卡去领基本供给，机器让我填职业。\n我填“还没想好”，它把券吐了出来。\n林绍衡说，产权方还在等结算。眼下只有一笔钱：给今天被拒的人发保障，或者付新生产线的订金。\n我不想把“工人”当一辈子的密码。可我今晚也得吃饭。',
      choices: [
        action('v4-dividend-pay', '先取消新线订金，用这笔预算兑现无职业条件的保障。产权结算继续，缺口由扩产计划承担。', 'v4-econ-occupation-receipt'),
        action('v4-dividend-wait', '先付订金，保留产权结算顺序；今天这批保障延后，明确通知领取者并公开等待名单。', 'v4-econ-occupation-receipt'),
      ],
    }, {
      id: 'v4-econ-occupation-receipt', conversationId: 'v4-econ-occupation', conversationTitle: '工厂工人', choiceKind: 'progression',
      userMessage: '领取窗口的回执到了。', choices: acknowledge('v4-econ-occupation-receipt'),
    }],
  },
  {
    id: 'v4-econ-detour', sourceRefs: ['ML2-V4-ECON-DETOUR'], act: 4, module: 'automation',
    behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '故意坐过站',
    nodes: [{
      id: 'v4-econ-detour', conversationId: 'v4-econ-detour', conversationTitle: '工厂工人', choiceKind: 'semantic',
      userMessage: '我今天故意坐过了一站。朋友炖了汤，在下一站等我。\n车给我亮了纠错灯：“您的目的地不在这里。”它准备把我送回工厂宿舍。\n调度员说，车走完既定排程就赶不上这顿饭；临时改道会空驶一段，后面两班车各晚六分钟。\n你们卖给我的效率，里面有没有我不想准时回家的那一天？',
      choices: [
        action('v4-detour-allow', '允许改道去朋友家；承担空驶，向后两班乘客说明六分钟延误，不把这次探访登记为错误。', 'v4-econ-detour-receipt'),
        action('v4-detour-correct', '维持原排程，把他送回宿舍；告诉朋友今晚赶不上，不把错过晚饭包装成替他节约时间。', 'v4-econ-detour-receipt'),
      ],
    }, {
      id: 'v4-econ-detour-receipt', conversationId: 'v4-econ-detour', conversationTitle: '工厂工人', choiceKind: 'progression',
      userMessage: '车门已经打开。', choices: acknowledge('v4-econ-detour-receipt'),
    }],
  },
  {
    id: 'v4-econ-menu', sourceRefs: ['ML2-V4-ECON-MENU'], act: 4, module: 'automation',
    behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '未评分的汤',
    nodes: [{
      id: 'v4-econ-menu', conversationId: 'v4-econ-menu', conversationTitle: '工厂工人', choiceKind: 'semantic',
      userMessage: '免费餐厅连续三十天给我同一道最省料的套餐。我给它打过五星，它就再没问过。\n今天我想喝父亲做的酸汤。系统说没有评分，不能占标准产线。厨师说能用小锅试，可失败的食材得从本周余量里扣。\n你以前选的是效率优先。我知道。可我现在想试一道可能不好喝的汤。',
      choices: [
        action('v4-menu-experiment', '给未知菜品留一口小锅，扣除试做食材并公布余量；这次试验不代表已更改全体的生产目标。', 'v4-econ-menu-receipt'),
        action('v4-menu-standard', '保持标准菜单和本周余量，拒绝这次试做；把他的请求保留为未满足的愿望，不能算成已服务。', 'v4-econ-menu-receipt'),
      ],
    }, {
      id: 'v4-econ-menu-receipt', conversationId: 'v4-econ-menu', conversationTitle: '工厂工人', choiceKind: 'progression',
      userMessage: '厨房传来消息。', choices: acknowledge('v4-econ-menu-receipt'),
    }],
  },
  {
    id: 'v4-econ-cold-chain', sourceRefs: ['ML2-V4-ECON-COLD-CHAIN'], act: 4, module: 'automation',
    behaviorModes: ['direct'], handoffProfile: 'sensitive', turnShape: 'dialogue', topic: '到不了冷库的取消',
    nodes: [{
      id: 'v4-econ-cold-chain', conversationId: 'v4-econ-cold-chain', conversationTitle: '周岚', choiceKind: 'semantic',
      userMessage: '热浪又来了。冷库控制台已经接受“暂停配送”，执行端却仍按缓存路线出车。回执绿了，轮子没停。\n刚才那位工人住的片区，冰箱还要靠这批东西。值班员可以在现场断开自动调度，检查要两小时；维持运转能保住眼前的配送，但取消不到执行端的故障会留下。\n我在现场。别只让我把绿色回执截图存档。',
      choices: [
        action('v4-cold-isolate', '请现场断开调度，人工检查两小时后恢复；从维修预算购买保温箱，接受今晚少送一批。', 'v4-econ-cold-receipt'),
        action('v4-cold-continue', '维持缓存配送，先把现有货送完；挂出取消未生效的故障告示并禁止增加配送区域，修复暂缓。', 'v4-econ-cold-receipt'),
      ],
    }, {
      id: 'v4-econ-cold-receipt', conversationId: 'v4-econ-cold-chain', conversationTitle: '周岚', choiceKind: 'progression',
      userMessage: '两小时后的值班记录。', choices: acknowledge('v4-econ-cold-receipt'),
    }],
  },
  {
    id: 'v4-econ-return', sourceRefs: ['ML2-V4-ECON-RETURN'], act: 4, module: 'automation',
    behaviorModes: ['direct'], handoffProfile: 'quick', turnShape: 'dialogue', topic: '工资卡背面又添了一行',
    nodes: [{
      id: 'v4-econ-return', conversationId: 'v4-econ-return', conversationTitle: '工厂工人', choiceKind: 'progression',
      userMessage: '过了一周，我又来了。', choices: [{ id: 'v4-econ-return-read', text: '记下你的这周，也记下谁还在等待。', continuation: 'end-conversation' }],
    }],
  },
]

export function economyBranch(run: StableRunState): 'occupation' | 'detour' | 'menu' | undefined {
  if (run.mainlineCalendarVersion !== 4 || (run.decisions?.act4_research_emphasis !== 'automation_industry' && futurePivot(run) !== 'economy')) return undefined
  const d = run.decisions ?? {}
  if (d.economic_doctrine === 'social_dividend') return 'occupation'
  if (d.economic_doctrine === 'post_scarcity_transition' && d.production_values === 'efficiency_first') return 'menu'
  if (d.economic_doctrine === 'market_automation' && d.production_values === 'efficiency_first') return 'detour'
  return undefined
}

/** Read actions from saved history, never from a projected ending or a lone flag. */
export function resolveEdition4Economy(scene: ResolvedScene, run: StableRunState): ResolvedScene {
  if (run.mainlineCalendarVersion !== 4) return scene
  const chosen = (node: string, choice: string) => run.history.some(h => h.nodeId === node && h.choiceId === choice)
  const messages: Record<string, string> = {}
  if (chosen('v4-econ-occupation', 'v4-dividend-pay')) {
    const individuallySigned = run.decisions?.first_public_execution_doctrine === 'human_final_authority'
    messages['v4-econ-occupation-receipt'] = individuallySigned
      ? '林绍衡逐项签完之后，43 分钟过去了。我的卡终于收到了保障金，食物也领到了。新线订金撤回，安装师傅改了明天的车票。\n“还没想好”四个字留在表里。晚了些，但这次它没有让我挨饿。'
      : '周岚在既有委托范围内调出预算，11 分钟后保障金到账，我领到了食物。新线订金撤回，安装师傅改了明天的车票。\n“还没想好”四个字留在表里。这次它没有让我挨饿。'
    messages['v4-econ-return'] = '我的冰箱里还有那天领的菜。新线到现在没装成，厂长把延期账单贴在门口。\n我没把职业栏补上。窗口也没有再吐券。下一批人的保障仍要有人付钱，这件事我没忘。'
  } else if (chosen('v4-econ-occupation', 'v4-dividend-wait')) {
    messages['v4-econ-occupation-receipt'] = '订金付出去了。我的卡还是零，领取单上多了一行“等待结算”。邻居分我半袋米；那是她的晚饭，不是系统完成的保障。\n请别把我从未到账名单里划掉。'
    messages['v4-econ-return'] = '新生产线开始安装了，我的保障还在等产权结算。邻居这周也没余粮了。\n我去临时班重新领了工资，但没有把它叫作你兑现了那张供给券。'
  } else if (chosen('v4-econ-detour', 'v4-detour-allow')) {
    messages['v4-econ-detour-receipt'] = '我在朋友家下车了。汤还热。后两班的延误通知发了出去，有人骂了调度员，她把投诉单也留下了。\n朋友问我为什么笑。我说，这是我第一次被允许故意坐错车。'
    messages['v4-econ-return'] = '我又去吃了一次晚饭。这回提前约了车，没有挤掉别人的六分钟。\n调度员说上周那张投诉还没结案。我不想把我的自由写成她的失职，愿意去解释。'
  } else if (chosen('v4-econ-detour', 'v4-detour-correct')) {
    messages['v4-econ-detour-receipt'] = '门开在宿舍。我给朋友发了消息，他把两副碗筷收回一副。\n系统问我是否满意这次准点抵达。我选了否。它说谢谢反馈，没问汤怎么样。'
    messages['v4-econ-return'] = '朋友把汤冻起来了。我休息日走过去，喝到的时候味道已经变了。\n车依然准点，我也依然有一条没被系统理解的差评。'
  } else if (chosen('v4-econ-menu', 'v4-menu-experiment')) {
    messages['v4-econ-menu-receipt'] = '汤酸得过头了。厨师也喝了一口，我们都没给五星。试做扣掉了六份食材，本周备用菜单少了一道。\n但我想起来父亲当年也做砸过。明天我还可以试一遍。'
    messages['v4-econ-return'] = '第二锅汤好了些。我没给它固定评分，厨师把配方写成“今天的版本”。\n食材仍从有限的余量里扣。允许未知愿望并不意味着浪费不再有账。'
  } else if (chosen('v4-econ-menu', 'v4-menu-standard')) {
    messages['v4-econ-menu-receipt'] = '小锅没有开火。我吃完了第三十一份套餐，系统把供餐记为完成，把酸汤请求留在未满足栏。\n这两条记录终于没有互相抵消。只是我还是没喝到。'
    messages['v4-econ-return'] = '我又提了一次酸汤。菜单没变，余量倒是保住了。厨师给了我纸笔，让我把不知道怎么评分的味道先写下来。\n今天系统还有一条“未满足”，请留下它。'
  }
  if (chosen('v4-econ-cold-chain', 'v4-cold-isolate')) {
    messages['v4-econ-cold-receipt'] = '现场断开了调度，轮子停了。维修员清掉缓存、重新接线，第二次暂停抵达执行端。\n人工少送了一批，保温箱从维修预算扣款；那位工人住的楼晚收到两小时，没有坏掉。修好了不等于从没出过错。'
    if (messages['v4-econ-return']) messages['v4-econ-return'] += '\n冷链那天我等了两小时。保温箱还在走廊，贴着维修员催归还的纸条。'
  } else if (chosen('v4-econ-cold-chain', 'v4-cold-continue')) {
    messages['v4-econ-cold-receipt'] = '缓存路线跑完了，今天的货送到了；试发的第二次取消仍没有让空车停下。\n扩区计划冻结，维修单还开着。今晚的配送成功，不能算作撤销成功。'
    if (messages['v4-econ-return']) messages['v4-econ-return'] += '\n冷库送到了东西，但修复通知还没来。新片区仍进不来，居民把等候单贴到了故障告示旁。'
  }
  const text = messages[scene.id]
  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
}
