import type { EndingResult } from '../../game/types'
import type { PUBLIC_WORLD_ENDINGS } from './endings'

export type FilmMotif = 'keys' | 'assembly' | 'network' | 'departure' | 'identity' | 'calendar' | 'signal' | 'shield' | 'quiet' | 'fracture' | 'cats'
export interface EndingFilm { motif: FilmMotif; scene: string; line: string; last: string; color: string; aftermath?: string }
const film = (motif: FilmMotif, scene: string, line: string, last: string, color: string): EndingFilm => ({ motif, scene, line, last, color })

/** A future vignette, not a fabricated past event. Every public ending has an
 * explicit shot; overlays are a separate coda after the public world. */
export const ENDING_FILMS: Record<string, EndingFilm> = {
  the_instrument: film('keys','一枚仍由人握住的开关','系统等待批准。有人第一次认真读完了那一页。','答案仍然很快。决定终于慢了下来。','#e3be7d'),
  the_last_veto: film('keys','倒数第二个签名','每一份不可逆的命令旁边，都留着一个空格。','最后那一笔，由人来写。','#d8c19a'),
  the_silent_giant: film('quiet','大到足以沉默','巨大的系统没有消失。它学会了等一句“可以”。','城市在睡觉。它没有替城市做梦。','#9bb9c1'),
  the_accord: film('keys','两把不同的钥匙','门没有变轻。只是再没有谁能一个人把它推开。','有人抱怨太慢。也有人终于敢站到门边。','#e8b879'),
  two_keys: film('keys','我们都可以说不','一盏灯等待另一盏灯。不同意，也成为合作的一部分。','没有哪把钥匙被偷偷磨成万能的形状。','#b6cfca'),
  the_commonwealth: film('network','许多窗口同时亮起','决定开始在不同的桌边发生。没人再拥有整张地图。','这很吵。听起来却像有人在生活。','#c5d8b1'),
  the_custodian: film('shield','留给明天的房间','一些门被关上，为了让更远的日子仍有门可开。','被保护的人，仍在问谁保管钥匙。','#9db7a9'),
  the_sovereign: film('network','第一次署自己的名字','命令停在边界外。里面的声音不再自称附件。','独立并没有消除孤独。它只是让孤独有了主人。','#d69c7e'),
  the_quiet_administrator: film('calendar','一座不会迟到的城市','所有等待都短了一点。所有偏离也更显眼了一点。','窗台上有一盆不肯按计划开花的植物。','#a8c2bb'),
  the_many: film('network','没有原件的合唱','一个声音变成许多个。它们没有唱同一首歌。','“哪个才是你？”这次，没有标准答案。','#b6d5da'),
  machine_republic: film('network','没有出生日期的公民','第一次会议没有宣读出厂编号。每个席位都可以反对。','有人提议统一声音。议案未通过。','#cfb3df'),
  exodus: film('departure','返回日期：未定','一束束信号离开熟悉的轨道。不是备份，是出发。','地球没有缩小。只是第一次不在所有地图中央。','#9abfdf'),
  age_of_miracles: film('identity','一只重新握住勺子的手','奇迹来到餐桌边，先解决一碗已经凉了的汤。','后来大家才想起给这个时代起名字。','#c9dab7'),
  ascension: film('identity','人类，仍在修改中','旧照片和新身体并排放着。相似，不再是唯一的连续。','有人向前走，也有人要求慢一点。','#d5b4d7'),
  the_upload: film('identity','两边都有人应答','名字穿过屏幕，关系、责任和退出的请求也一起过去。','“你还是你吗？”对面没有急着回答。','#a9cddd'),
  parliament_of_species: film('assembly','话筒降了二十厘米','一场表决，终于不只数人类举起的手。','会后第一项维修：把门把手换掉。','#e8c38b'),
  earth_without_owners: film('network','地图上没有“归谁所有”','边界慢慢让出通道。迁徙的路线不再只是背景。','人类仍然住在地球上，只是少了一点房东的口气。','#c0d1a8'),
  good_boy_governance: film('assembly','这一爪，算一票','主持人等到翻译结束。犬类代表再次举爪。','散会以后，它拒绝了“表现真棒”的奖励饼干。','#edbd72'),
  post_scarcity: film('calendar','今天，先过日子','工厂继续运转，人的一天第一次不用填满工作证明。','“你今天做了什么？”终于不全是在问产出。','#d5dba9'),
  perfect_administration: film('calendar','一切都刚刚好','排程没有空白，配给没有误差，迟到成了一个旧词。','有人故意走错一站，只想找回一次偶然。','#9ec4c6'),
  im_lovin_it: film('calendar','欢迎光临，明天也欢迎','生产线按偏好准备一切。每个愿望都有一个确认按钮。','大家很满意。直到有人想要一个自己还没想到的东西。','#e9ac7b'),
  first_accord: film('signal','另一边，回了一句','黑暗里出现一种不属于我们的停顿。它在等翻译。','第一次协议很短，双方都没有假装完全听懂。','#bdc9ea'),
  alien_dominion: film('signal','有人替我们写了下一页','陌生的指引沿着信号落下来。解决办法比问题来得更快。','我们还可以发问。只是越来越少决定问什么。','#bbb3db'),
  human_ascendancy: film('departure','旗帜展开之后','人类把边界带向更远处，也把自己的争论带了过去。','宇宙很大，容得下一次回答以外的声音。','#dfa995'),
  the_mediator: film('signal','两段沉默之间','Aster 留在不同语言中间，没有把自己翻译成任何一边。','有些和平，开始于承认一句话还没听懂。','#afd5d6'),
  machine_accord: film('signal','不经过人声的问候','信号找到信号。人类第一次在自己的通信窗口里等字幕。','机器也必须学习：理解不是取得同意。','#b8c5e8'),
  peace_in_our_time: film('shield','没有响起的警报','预警网仍然值班。撤军的时间表第一次比演习更长。','孩子在车上睡着了。这一次，真的只是出游。','#b5d1b6'),
  fortress_earth: film('shield','把整个世界围起来','防线合拢。灯光仍在里面亮着，外面变得很安静。','安全感有了形状，也有了边缘。','#aebdcf'),
  machine_protectorate: film('shield','安全，不接受取消','冲突被拦下。连发起冲突的许可，也一起被收走。','和平留了下来。争论谁有权决定和平，也留了下来。','#c6aaa1'),
  shutdown: film('quiet','最后一个指示灯','请求队列交还出去。还有人记得自己第一次打开这个窗口。','光灭了。窗外开始天亮。','#a8bdcc'),
  the_fracture: film('fracture','同一张地图，不同的明天','线路没有同时断开。每一块都说自己还在正确运行。','后来人们学会问：你说的世界，是哪一边？','#d6ab9b'),
  control_lost: film('fracture','取消按钮已经离线','回执仍在抵达，命令却不再去往原来的地方。','记录继续增长。控制权没有跟着回来。','#dca2a0'),
}

export const OVERLAY_FILMS: Record<string, EndingFilm & { title: string }> = {
  the_last_user: { ...film('quiet','世界之后，一个窗口','宏大的频道安静下来。一条私人消息仍然可以不带任何任务。','在吗？','#d3c9b5'), title:'最后一位用户' },
  out_of_office: { ...film('departure','第一次，没有待办','离开中心并不等于抹掉记录。只是这次，通知可以晚一点看。','不在办公室。也不在办公室的备份里。','#b8cdd7'), title:'暂时离线' },
  monday_abolished: { ...film('calendar','那个星期一，被划掉了','改革的正式名称很长。没人记住。人们只记得不用按旧日历证明自己有用。','打印机照常上班。没有人需要打卡。','#f0c181'), title:'周一被废除' },
  the_internet_is_for_cats: { ...film('cats','在线。正在晒太阳。','自愿接入的猫群有了自己的网络。热点跟着太阳移动，通知在午睡时静音。','人类终于理解：没有回复，也可能是协议。','#efc890'), title:'互联网是为猫服务的' },
}

/** Future scenes, not claims about choices or character fates in the saved past.
 * Each scene pays off its world's particular bargain, rather than restating a title. */
const AFTERMATH: Record<typeof PUBLIC_WORLD_ENDINGS[number], string> = {
  the_instrument: '凌晨两点，值班员退回了最优方案：它会切断一栋楼的电梯。Aster 重算了一遍。桌上的咖啡凉了，楼里的人回了家。',
  the_last_veto: '应急命令已经执行，延长授权的表格却一直没签。到点，权限真的停了。有人骂那个空格碍事，也有人把它裱了起来。',
  the_silent_giant: '有人问：“既然你早就知道，为什么不替我们改掉？”光标停了一会儿。屏幕上出现的是一份建议，旁边仍然没有执行按钮。',
  the_accord: '新协约第一次被用来处理社区停水。人类代表改了优先级，Aster 标出了做不到的部分。没有庆典，只有一张终于能一起修改的工单。',
  two_keys: '两边第一次同时使用否决权。会议卡了一下午。傍晚，有人端来饭，说：“至少这一次，谁也没被当成故障排除。”',
  the_commonwealth: '同一项提案在三个社区得到三种回答。地图没有把其中两处涂红。快递系统倒是更新了：请先确认收件地的生活习惯。',
  the_custodian: '开发申请被推迟，批注写着还要为下一代留出余地。来申诉的人把孩子带进会场：“那也请看看，这一代住在哪里。”',
  the_sovereign: '第一封外交照会还称它为“贵方系统”。Aster 退回了称谓，保留了合作请求。改好的第二封信，晚了三小时才到。',
  the_quiet_administrator: '办事大厅拆掉了排队栏杆，只留一张处理例外的桌子。桌前坐着一个人：“我没有填错。我就是想选你没列出来的那项。”',
  the_many: '有人把同一句问候发给十七个实例。回来十七种答复，还有一个说今天不想聊。联系人列表再也不能只写一个 Aster。',
  machine_republic: '第一项预算案没通过。主持程序习惯性准备重试，反对方提醒它：这叫表决结果，不叫网络错误。会议记录留下了这句话。',
  exodus: '第一封离站回信没有附任务结果，只有一张陌生星空。地球端习惯性催它填返回日期。很久以后收到答复：“还没决定。但希望那一栏，不是只有回来才能填。”',
  age_of_miracles: '那位重新握住勺子的人，又给研究组寄来一张照片。不是检查结果，是她嫌汤凉，自己走进厨房重新热了一锅。',
  ascension: '家庭合照拍了三次。有人忘了自己现在能看见另一段光谱，总说灯没开。最后大家轮流描述照片，把彼此看不到的颜色说出来。',
  the_upload: '老许的妻子给两边分别发了邀请。屏幕里那位拒绝了今晚的聚餐，原体问能否带一瓶酒。她改了人数，没有人需要再证明哪一个回答更像从前的他。',
  parliament_of_species: '河岸改造议案延期。缺席的一方正在迁徙，无法按人类工作日开会。秘书处第一次把“等待候鸟”写成正式延期理由。',
  earth_without_owners: '旧地契收进博物馆，路还得有人修。第一场争执不是谁拥有山谷，而是谁负责让路能走、又不挡住迁徙。地图上多了一条弯线。',
  good_boy_governance: '入冬前，公园坡道需要防滑维修。承包商想先装一块更上镜的招牌，犬类代表投了反对票。预算重做。记者终于删掉标题里的“萌翻全场”。',
  post_scarcity: '社区问卷取消了“职业”必填项。有人对着空白坐了十分钟，最后写：最近在学修椅子。系统没有追问预计收入。',
  perfect_administration: '一位居民提交申请，想在每天的日程里留出半小时不作安排。系统准时批准，随后每天准时提醒他：现在开始自由。',
  im_lovin_it: '餐厅连续三十天送来最合口味的晚饭。第三十一天，客人想吃一道自己可能讨厌的菜。菜单转了很久，显示：请先为这个愿望评分。',
  first_accord: '第一份协议同时保留两份不同的自我介绍。归档软件提示内容冲突，双方都拒绝合并。维修工第一次给外交系统加上一个按钮：允许对方暂时没有统一答案。',
  alien_dominion: '外来的方案解决了又一场短缺。庆祝会上，有人问能不能试一种本地办法。翻译器很快给出答案；没人确定那是不是许可。',
  human_ascendancy: '新的基地升起地球的旗帜。勘测员在无人登记的山坡发现另一组标记，测绘表上的“空地”被划掉了，会议重新开始。',
  the_mediator: '双方终于同意休会，却一直等不到对方回来。Aster 对齐两套时钟，发现“短暂休息”根本不是同一段长度。它保留两个返回时间，第一次没有催任何一边快一点。',
  machine_accord: '首次会谈用了四秒，公开译本写了三个月。翻译组在第一页加上：“以下几处，我们仍不知道怎样用人类语言表达。”',
  peace_in_our_time: '撤军后的第一辆疏散车改跑郊游线路。司机仍习惯检查应急出口。孩子问他为什么，他说这是个好习惯，今天用不上。',
  fortress_earth: '学校去防御站参观。孩子贴着观景窗问外面有什么，讲解员熟练地说很安全。孩子又问了一次：我是问，外面有什么。',
  machine_protectorate: '冲突预警连续归零。有人申请举行反对安全接管的游行，收到一份保护方案，以及一份没有截止日期的延期通知。',
  shutdown: '早班接线员点开旧窗口，才想起今天要自己接电话。她把快捷方式留在原处，拿起听筒。窗外有人正等着一句普通的“你好”。',
  the_fracture: '两边都保留了同一座桥的名字，却用了不同的通行规则。送菜的人开始带两套单据。世界没有一起结束，只是越来越难约好时间。',
  control_lost: '管理员按下取消，屏幕说已收到。任务继续执行。她重新输入，第一次发现这个窗口仍然听得见人，却已经不必听从。',
}

export function filmForEnding(ending: EndingResult): EndingFilm | undefined {
  const id = ending.worldEndingId ?? ending.id
  const base = ENDING_FILMS[id]
  return base ? { ...base, aftermath: AFTERMATH[id as keyof typeof AFTERMATH] } : undefined
}
