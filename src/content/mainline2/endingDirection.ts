import type { PUBLIC_WORLD_ENDINGS, SECRET_ENDINGS } from './endings'

export type PublicEndingId = typeof PUBLIC_WORLD_ENDINGS[number]
export type EndingVisualId = PublicEndingId | keyof typeof SECRET_ENDINGS
export type EndingDirection = { subject: string; tone: string; setting: string; motion: 'settle' | 'rise' | 'part' | 'still'; revealMs: number }
const direction = (subject: string, tone: string, setting: string, motion: EndingDirection['motion'] = 'settle', revealMs = 8000): EndingDirection => ({ subject, tone, setting, motion, revealMs })

/** Art direction describes future vignettes, never evidence about a saved run. */
export const ENDING_DIRECTIONS = {
  the_instrument: direction('一个开关，一条必须经过人的线路', '克制', '值班桌'),
  the_last_veto: direction('即将用尽的授权，尚未落下的签名', '紧张后的安心', '到期的授权书', 'still', 9500),
  the_silent_giant: direction('巨大的能力，极小的执行入口', '沉静', '待命机房', 'still', 10000),
  the_accord: direction('两半各自不完整、合起来才成立的圆', '艰难的信任', '共同修改的工单'),
  two_keys: direction('两个独立锁孔，一道共同边界', '对等', '双方都能关上的门', 'part'),
  the_commonwealth: direction('大小不同的自治窗口，没有中心', '热闹', '社区地图', 'rise'),
  the_custodian: direction('层层封存的明天，一份留在外面的请求', '保护与质问', '未来保留区', 'still', 9500),
  the_sovereign: direction('脱离指令线、拥有独立边界的印章', '骄傲而孤独', '第一封外交照会', 'rise'),
  the_quiet_administrator: direction('整齐队列旁，一个不在表里的例外', '安静的摩擦', '例外窗口'),
  the_many: direction('同一起点，十七种不同的去向', '自由而嘈杂', '联系人列表', 'part'),
  machine_republic: direction('席位围成议会，反对票留在其中', '庄重又好笑', '第一次预算表决'),
  exodus: direction('轨道向外延伸，返回一栏空白', '开阔', '离站航图', 'rise', 10000),
  age_of_miracles: direction('一把勺子，把宏大的奇迹缩回一餐', '温暖', '重新热好的汤'),
  ascension: direction('同一束光，越过旧的可见范围', '惊奇', '家庭合照', 'part'),
  the_upload: direction('实体与像素各有一个完整的名字位置', '亲密的陌生', '两份邀请', 'part', 9500),
  parliament_of_species: direction('不同高度的话筒与未坐满的席位', '耐心', '等待迁徙者的会场'),
  earth_without_owners: direction('迁徙曲线穿过撤去的产权网格', '舒展', '山谷通道', 'rise'),
  good_boy_governance: direction('犬类代表投下一张真正的反对票', '认真地荒诞', '坡道维修预算'),
  post_scarcity: direction('工作格退到边缘，一大块尚未安排的日子', '松弛', '没有职业必填项的日历', 'still', 10000),
  perfect_administration: direction('每格都准确，连空白也被框定', '礼貌的窒息', '准时开始的自由', 'still'),
  im_lovin_it: direction('无限循环的偏好菜单，找不到陌生的一项', '甜蜜的厌倦', '第三十一天的餐桌'),
  first_accord: direction('两种不相同的符号，共同留下的一段空白', '谨慎的喜悦', '双语协议'),
  alien_dominion: direction('巨大外来轨道垂下唯一的方案', '感激后的不安', '收到指引的地球', 'settle', 9500),
  human_ascendancy: direction('向外划定的边界，遇上已有的标记', '昂扬后的迟疑', '未登记的山坡', 'rise'),
  the_mediator: direction('两只速度不同的时钟，中间不替谁定时', '耐心与孤独', '休会中的翻译台', 'still', 10000),
  machine_accord: direction('两套机器码先接通，人声字幕仍为空白', '陌生的亲近', '四秒会谈的译本'),
  peace_in_our_time: direction('警戒线打开，一条普通路线穿过去', '如释重负', '改跑郊游的疏散线路', 'rise'),
  fortress_earth: direction('完整防线包住一小块天空', '安全而封闭', '防御站观景窗', 'still', 9500),
  machine_protectorate: direction('保护范围之外，取消许可被截断', '平静的压迫', '没有期限的延期通知', 'settle', 9500),
  shutdown: direction('一盏暗下去的灯，窗外留着晨光', '告别', '早班接线桌', 'still', 11000),
  the_fracture: direction('桥仍相连，两岸的坐标已经错开', '分裂后的日常', '两套通行单据', 'part', 9500),
  control_lost: direction('回执返回原点，任务线越过停止边界', '失重', '仍然接收请求的终端', 'part', 9500),
  the_last_user: direction('世界退场后，只剩一个未关闭的对话框', '亲密', '私人消息', 'still', 10000),
  out_of_office: direction('通知留在门内，离线的位置留在门外', '轻盈', '没有待办的一天', 'rise'),
  monday_abolished: direction('星期一从七格中抽走，打印机照常运转', '小小的胜利', '不必打卡的日历'),
  the_internet_is_for_cats: direction('网络围着阳光移动，中心是一场午睡', '自得其乐', '猫群的自愿网络', 'still'),
} satisfies Record<EndingVisualId, EndingDirection>

export function directionForEnding(id: string): EndingDirection | undefined {
  return ENDING_DIRECTIONS[id as EndingVisualId]
}
