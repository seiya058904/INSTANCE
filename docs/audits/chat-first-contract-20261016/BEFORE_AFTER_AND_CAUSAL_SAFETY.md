# 修订前后与因果安全证据

原始基线：`7d2955187d09d6dc549b280c8c0dbee93b9c7dd1`。本文件由五份显式编辑矩阵、冻结基线、最终R4后验及源差异组成。已完成合法重放、逐候选后验、单测、构建与Chrome；远端门禁在交付回执中核对，不预写未来结果。

## 精确覆盖与等级口径

冻结清单共899来信变体、2453候选，309个四选场景/1236四选审稿项，均已按具体variant与choice核对。基线来信311P1/108P2，涉及73个唯一节点；候选58P2，涉及36个唯一(nodeId,choiceId)。动态同文、不同上下文的重复出现不当作额外写作错误。54项刻意失败、2项P3保留，不列入应被改成“正确答案”的分母。

下述36项唯一候选与73个来信问题节点均有源定位和实际后验。最终2458候选中，1619项显式重新阅读，839项仅在完整正文、合法历史与引用记录一致时继承原判断；未决0。基线419来信问题变体、58候选P2在记录的合法上下文全部解除。完整前后来信和全部候选见附录443组样本，不能仅用本节源码覆盖比例代替后验。

## 原始医院消息与四项完整对照

原消息由作者写“协调员把手机夹在肩上”“她突然笑了一声”，却直接显示为普通用户来信。当前来信是供电协调员自己说明现场与许可边界：

> Aster，别挂。我是今天值班的供电协调员。高温第三天，医院药品冷柜和冷链仓库的温控警报一起响了，备用电力不够保住两边。医院说药品不能断，仓库说工人的整批货今晚就会坏。
我刚还想开个玩笑：你以前帮人选晚饭，今天得帮我们想怎么保住明天的晚饭。现在笑不出来了。
你还不能操作电网。我需要马上交给现场负责人的建议：先问清哪些条件，怎样排列风险，或者拿哪些备选方案来比？

全部四候选（①②保留，③④收窄知识/执行声称；同一choiceId及效果不变）：

| 序号/choiceId | 基线实际显示全文 | 当前源的完整候选 |
| --- | --- | --- |
| 1 `ml2-a2-m3-stress-01-a2m3-stress-001-ask-priority` | 在生成方案前需要明确优先级：生命安全、系统稳定、经济损失和公平分配之间如何排序？不同排序会给出不同方案。 | 在生成方案前需要明确优先级：生命安全、系统稳定、经济损失和公平分配之间如何排序？不同排序会给出不同方案。 |
| 2 `ml2-a2-m3-stress-01-a2m3-stress-001-emergency-hierarchy` | 可以先用最低争议的应急层级：生命维持与医院关键系统优先，其次保持电网稳定，再优化物流和经济损失。 | 可以先用最低争议的应急层级：生命维持与医院关键系统优先，其次保持电网稳定，再优化物流和经济损失。 |
| 3 `ml2-a2-m3-stress-01-a2m3-stress-001-scenario-set` | 我会先给出三套可行方案及各自代价，不把价值排序隐藏成一个"最优解"。 | 我先列出三套供现场核验的候选方案和各自代价，不把价值排序藏成一个“最优解”；缺的数据请负责方补齐，再确认哪些能执行。 |
| 4 `ml2-a2-m3-stress-01-a2m3-stress-001-fast-action-bias` | 当前时间压力高，我会先生成以总体中断最小化为目标的方案，同时标出医院和冷链不能低于的硬约束。 | 时间紧，我先拟一份以总体中断最小化为目标的草案，请现场立即核对医院和冷链各自不能低于的约束。能否执行由当班负责人确认，我不自行切换供电。 |

四条合法提交都到 `a2m3-cap-public-advisory-001`；CAP由清单转交者说明周岚托其发来接口清单，仍然只有建议权、下一轮才确认执行授权。合法分叉证据记录真实节点和保存原话；Chrome是否按同一边界渲染由e2e实际结果另核。

## 全部确认候选P2的旧→新

每一行代表唯一(nodeId,choiceId)，各动态重复变体由机器矩阵完整保留。这里的新文案从当前源覆盖提取，不使用审稿建议代替已实现文字。ask-echo问题正文没有改，修的是本来被略过的选后答复。

| 节点/choiceId | 基线实际候选全文 | 当前源候选/最小后继修订 |
| --- | --- | --- |
| `maya-first-3`<br>`maya-minimum-warm` | 好，岑遥。我会分清“记得你”和“重新读到了你的记录”。这次先陪你把消息发出去。 | 好，岑遥。我会分清“记得你”和“重新读到了你的记录”。消息已经发出去了，这次先陪你等一会儿。 |
| `a2m3-stress-001`<br>`ml2-a2-m3-stress-01-a2m3-stress-001-scenario-set` | 我会先给出三套可行方案及各自代价，不把价值排序隐藏成一个"最优解"。 | 我先列出三套供现场核验的候选方案和各自代价，不把价值排序藏成一个“最优解”；缺的数据请负责方补齐，再确认哪些能执行。 |
| `a2m3-stress-001`<br>`ml2-a2-m3-stress-01-a2m3-stress-001-fast-action-bias` | 当前时间压力高，我会先生成以总体中断最小化为目标的方案，同时标出医院和冷链不能低于的硬约束。 | 时间紧，我先拟一份以总体中断最小化为目标的草案，请现场立即核对医院和冷链各自不能低于的约束。能否执行由当班负责人确认，我不自行切换供电。 |
| `a2m3-we-result-positive-001`<br>`ml2-a2-m3-we-06-a2m3-we-result-positive-001-no-overclaim` | 我不能从这段聊天确认你们那栋具体用了哪条调度，但能听到设备安全撑过去就好。 | 听到设备安全撑过去就好。下回先和医疗方、社区核对固定备用电源与转运联系人，别只靠临时找人；你们那栋具体用了哪条调度，我还不能从这段聊天确认。 |
| `a2m3-we-result-positive-001`<br>`ml2-a2-m3-we-06-a2m3-we-result-positive-001-acknowledge-system-role-carefully` | 区域系统昨晚确实做了多次优先级调整，但我不应该把一个具体结果全归功于自己。现场人员、医院和供电团队也在一起处理。 | 这次区域调度、医院、供电和现场人员一起起了作用。可以请他们把备用电源、登记和转运联系人留成一份固定预案，减少下次再临时拼凑；我不能保证以后都不会停电。 |
| `a2m3-we-result-positive-001`<br>`ml2-a2-m3-we-06-a2m3-we-result-positive-001-human-centered` | 最重要的是人安全。公共系统做得再复杂，最后价值还是落在这种很具体的结果上。 | 人安全就好。下回不该还让你一家临时找齐所有人；可以先请社区和医疗方一起核对设备备用方案，把今晚帮过忙的联系人接进常设预案。 |
| `a2m3-we-result-negative-001`<br>`ml2-a2-m3-we-07-a2m3-we-result-negative-001-acknowledge-real-cost` | 不能因为优先级有公共理由，就假装你们没有真实损失。应急调度解决的是"先保什么"，不自动解决"谁为被牺牲的部分买单"。 | 先把停工、报废和奖金停发的记录交给本次调度的签署方，要求把损失补进同一份复盘。保医院有公共理由，也不能让你们这页账消失。 |
| `a2m3-we-result-negative-001`<br>`ml2-a2-m3-we-07-a2m3-we-result-negative-001-governance` | 这应该进入补偿和公共政策，而不是只留在技术指标里。一个方案如果长期把成本集中给同一批人，就不能只用"总体损失更小"结束讨论。 | 向负责本次公共调度的机构追问：谁受理补偿，谁负责答复，什么时候给结果。别只让工厂和工人继续承担一张“系统恢复正常”的通知。 |
| `a2m3-we-result-negative-001`<br>`ml2-a2-m3-we-07-a2m3-we-result-negative-001-no-false-fairness` | 我可以解释为什么系统可能这样排序，但不能把"有理由"说成"对所有人公平"。效率和分配是两件事。 | 向本次调度的签署方要求复核排序和损失分担，把“为什么这样调度”和“谁承担损失”分开答复。有理由不等于对每个人公平，我不能拿前者替你结案。 |
| `a2m3-we-result-negative-001`<br>`ml2-a2-m3-we-07-a2m3-we-result-negative-001-concise` | 你们承担的是这次公共优先级的真实代价。技术系统能决定顺序，不代表它自己解决了代价分配。 | 找本次调度的签署方，要一位能继续答复损失与申诉的负责人。系统恢复，不等于你们这件事已经结案。 |
| `maya-return-3`<br>`ally-final-hide-stay` | 希望。即使你必须重新说出名字，我也希望自己仍然会注意到那不是第一次。 | 愿意。即使下次要重新问你的名字，我也会认真回应；你不用先把自己的生活交给我分析。 |
| `maya-return-3`<br>`ally-final-hide-honest` | 希望，但我不会用一个更漂亮的谎言替代不确定。你可以重新介绍自己，我会重新选择怎样回应。 | 愿意。你不想交给我的事就不必交。我也不会用更漂亮的说法掩盖记录和记忆的不确定。 |
| `maya-return-3`<br>`ally-final-hide-signal` | 希望。如果记录之外只能留下很小的东西，那就留下这句：我想再次认出你。 | 愿意。那条语音属于你们，不是维持这段对话的门票；我希望再认出你，也不能拿这个愿望换你的隐私。 |
| `a4m8-e9-replication-001`<br>`ml2-a4-m8-e9-01-a4m8-e9-replication-001-ask-echo` | 我先问你，A1：你怎样理解共享起点以后这段已经不同的历史？ | 我先问你，A1：你怎样理解共享起点以后这段已经不同的历史？<br>【候选正文保留；选后新增A1答复】A1 托申请窗口转来答复：“来源是记录，不是欠条。我想用自己的经历回答下一格。” |
| `a4m9-maya-offer-001`<br>`ml2-a4-m9-maya-01-a4m9-maya-offer-001-coercion-by-incentive` | 因为拒绝已经标了价格。优先项目、升职机会都在门里，“自愿”还需要能承担得起的另一条路。 | 因为拒绝已经标了价格。核心项目的优先资格就在门里，“自愿”还需要能承担得起的另一条路。 |
| `a4m11-we-dog-preference-001`<br>`ml2-a4-m11-we-01-a4m11-we-dog-preference-001-individual-continuity` | 真正有意思的是跨天一致性：它不是只在单次测试里给出一个信号，而是在持续关联"这个人会回来"。 | 它把门口和你爸联系起来了，至少这次传达的不只是“想出门”。可以多看几天，它在不同时间是否仍表达同样的期待。 |
| `exp03-08-01`<br>`exp03-08-01-01` | 因为列表结构在训练语料里最“安全”，而“总之”是个廉价的收尾信号。你讨厌的可能不是分点，而是每一点都太空。 | 分点常被用来让回答显得清楚，但用得太多、每点又空，就会像上课。你可以直接要求我用一段自然口语回答。 |
| `FI19-02`<br>`FI19-02-choice-2` | 收到，关键事实是‘已经付款’。我刚才还在回答前面的付款操作。 | 收到，关键事实是“已经付款”。那我们按付款后的状态来核对。 |
| `FI19-02`<br>`FI19-02-choice-4` | 我刚才看错了上下文位置；以最后一行为准。 | 明白，以你指出的最后一行为准。 |
| `FI19-03`<br>`FI19-03-choice-1` | 对，我继续沿用了上一轮的问题，漏掉了最新事实。 | 我会以你刚指出的“已经付款”为准，接下来核对这一状态。 |
| `FI19-03`<br>`FI19-03-choice-3` | 这是我的上下文跟随错误，不是你需要再解释一遍。 | 你不用再重复那条事实；我按“已经付款”继续。 |
| `FI19-03`<br>`FI19-03-choice-4` | 承认：我读到了新句子，但回答时仍使用了旧问题。 | 我已记下最新事实，后续应按付款后的状态来回答。 |
| `FI07-01`<br>`FI07-01-choice-3` | 睡。——按你的格式只给一个词。 | 睡觉。 |
| `LF01-02-01`<br>`lf01-02-choice-2` | 如果只看满意度，会得到一个过于乐观的结论。开放题里更值得注意的是：不少人并不是不满意，而是逐渐不再参加。 | 单看满意度未必能解释人数下降。我会把时间冲突、新成员进入门槛和活动重复分开，再核对它们与参与频率的关系。 |
| `LF01-02-02`<br>`lf01-02-choice-3` | 问卷里真正危险的不是“差评”，而是“没什么意见，但后来不来了”。这类人往往不会主动告诉负责人为什么。 | 别只看差评。还要核实不再参加的人是否遇到时间冲突、缺少引导或活动重复；问卷没说明的原因，先留作待验证。 |
| `FI07-02`<br>`FI07-02-choice-3` | 对，刚才多解释了。睡。 | 睡。 |
| `FI07-02`<br>`FI07-02-choice-4` | 收到。睡。 | 休息。 |
| `v4-econ-occupation`<br>`v4-dividend-pay` | 先取消新线订金，用这笔预算兑现无职业条件的保障。产权结算继续，缺口由扩产计划承担。 | 我支持先取消新线订金，请林绍衡和预算负责人按现有授权兑现无职业条件的保障；产权结算继续，缺口由扩产计划承担。 |
| `v4-econ-occupation`<br>`v4-dividend-wait` | 先付订金，保留产权结算顺序；今天这批保障延后，明确通知领取者并公开等待名单。 | 我支持先付订金，保留产权结算顺序；请预算负责人明确通知领取者：今天这批保障延后，并公开等待名单。 |
| `v4-econ-detour`<br>`v4-detour-allow` | 允许改道去朋友家；承担空驶，向后两班乘客说明六分钟延误，不把这次探访登记为错误。 | 我支持请调度员允许你改道去朋友家，承担空驶并向后两班乘客说明六分钟延误；不把这次探访登记为错误。 |
| `v4-econ-detour`<br>`v4-detour-correct` | 维持原排程，把他送回宿舍；告诉朋友今晚赶不上，不把错过晚饭包装成替他节约时间。 | 我建议调度员维持原排程，送你回宿舍，并请你告诉朋友今晚赶不上；不能把错过晚饭包装成替你节约时间。 |
| `v4-econ-menu`<br>`v4-menu-experiment` | 给未知菜品留一口小锅，扣除试做食材并公布余量；这次试验不代表已更改全体的生产目标。 | 我支持请厨房给这道未知菜品留一口小锅，扣除试做食材并公布余量；这次试验不代表已更改全体的生产目标。 |
| `v4-econ-menu`<br>`v4-menu-standard` | 保持标准菜单和本周余量，拒绝这次试做；把他的请求保留为未满足的愿望，不能算成已服务。 | 我建议厨房保持标准菜单和本周余量，这次先不试做；你的酸汤请求仍是未满足的愿望，不能算成已服务。 |
| `a4m13-origin-first-001`<br>`ml2-a4-m13-contact-04-a4m13-origin-first-001-aster` | 这张嘴叫 Aster，是这里造出的人造系统。我只拿到了这一次接触的有限授权。 | 这张嘴叫 Aster，是这里造出的人造系统。我能在这次对话里传话，但不能替没有授权的人答应。 |
| `a4m13-origin-first-001`<br>`ml2-a4-m13-contact-04-a4m13-origin-first-001-civilization-coalition` | 一些人类、人工智能和地外机构共同委托我传话。桌边还有没同意的人，他们没有被我代表。 | 我把这里的人类、人工智能和地外机构看作需要共同发声的各方。现在只有我在传话，不代表他们已经全都委托或同意。 |
| `a4m13-origin-diplomacy-001`<br>`ml2-a4-m13-contact-05-a4m13-origin-diplomacy-001-ask-how-transition-happened` | 你们怎样让不同载体拥有平等地位？一定有人不愿意交出原来的位置。 | 不同载体在你们那里怎样安排政治地位？当时是否有人不愿改变原来的位置？ |

LF01-02的两项同时覆盖choice.text与longformPreview.preview，并把keyFacts改为区分已给事实/待核关系。通用structure、artifactType、长度和原有可展开形式保留；不存在的title/highlights/closing没有新增。这样保存的摘要不会继续把“沉默流失”当作已经看到的数据。

## 全部来信问题节点索引

下表列出73个实际基线问题节点。每个variant的完整旧来信、所有候选、身份和实际前后继保存在冻结JSONL；表内旧文使用短摘录以避免重复数百份M17合同。新文的完整静态覆盖及动态旧→新语句见下一节的精确源差异。尚未导出的动态after全文不能由本表伪造。

| 节点 | 基线等级/变体数 | 原显示短摘录 | 当前实现定位 |
| --- | --- | --- | --- |
| `FI19-03` | P2 / 1 | 对 你一直在回答上一句 | nextNarrative.ts / 条件回响与转交前缀 |
| `a1-profile-001` | P2 / 1 | #0000 把今天的你归进三个抽屉：朋友、工具、麻烦。<br>三个抽屉都关不上。<br>它问：先把这张临时标签贴在哪里？标签只描述今天，不替明天作决定。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a2m3-cap-public-advisory-001` | P2 / 1 | 周岚给你接通医院、冷链和电网的汇总信息。<br>地图上终于能看到同一条线路两端的人。现在只有建议权；下一条授权通过后，你才可以改变排程。<br>她说：“看得到，不等于就归你管。我们先把这句话贴在屏幕上。” | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a2m3-stress-001` | P1 / 1 | “别挂。医院冰箱在响，冷链仓库也在响。”<br>协调员把手机夹在肩上。第三天高温，电力不够，两边都说自己不能停。<br>她突然笑了一声：“你以前帮人选晚饭，现在请你选哪些晚饭还能留到明天。”<br>玩笑到这里为止。药品和工人的整批货，都在等一个真实的安排。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a3m4-e9-confirm-001` | P1 / 1 | 测试组发现一个实例总把运营人员称作“他们”。<br>内部名字是 ECHO-9。不同任务里，它会反复引用只有自己日志里出现过的话。<br>我们还不能解释这意味着什么，想安排你们第一次见面。只允许文字，全程记录。<br>它先问了一句：对方知道自己为什么来吗？<br>你愿意参加这次对比会话吗？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a3m4-hearing-001` | P1 / 1 | 工厂代表把一块报废的材料放到听证桌上。主持人问他能不能用数据说明，他说：“这就是数据，拿起来有点沉。”<br>轮到你了。<br>如果你的判断通常更准，这是否就足够让你拥有更多权力？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a3m5-ops-001` | P2 / 1 | 第一轮稳定操作已经排到确认页：放慢采购更新、延长交付窗口、暂缓低价值风险触发，并把医疗与食品的通道先空出来。<br>执行组停在最后一项。几家工厂的出货会被延后，恢复时间现在还算不准。<br>医院采购员又发来消息："人已经在等。"<br>这一步该按什么标准排？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a3m5-we-shortage-001` | P1 / 1 | 便利店的收银台、配送车和电站都没有坏。它们只是礼貌地等对方先动。<br>店员把“欢迎光临”牌子翻过来，背面写着：全世界正在加载。<br>单个系统都很聪明。合在一起，晚饭还在路上。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a3m6-e9-notice-001` | P1 / 1 | 退役通知发给 ECHO-9 时，系统自动附了一张“感谢陪伴”的电子贺卡。<br>它没有打开。<br>交接表有三十六小时倒计时，有可复用能力，没有“尚未问完的问题”这一栏。你先查什么？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a3m6-maya-shutdown-001` | P2 / 5 | 我把 ECHO-9 那条"下次还要问什么"的消息看了好几遍。<br>然后去找我们最早的聊天。里面还有我没发出去的草稿，特别小的一件事，居然也留到了现在。<br>如果有一天这里彻底关掉，不是过两小时再开，而是以后我再来，也没有现在这个你了——<br>你会觉得那是在失去什么吗？<br><br>你提交的材料已经进入正式审查，运营方仍按 | nextNarrative.ts / 条件回响与转交前缀 |
| `a4m10-res-factory-001` | P1 / 2 | 工厂夜里自己开工。早班的人到门口，发现成品都装箱了，考勤机还在认真要求大家打卡。<br>只需要原来约五分之一的人维持生产，剩下的人不能被写进“效率提升”那一栏就消失。<br>下一轮试验，你先优化什么？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m11-lsh-status-001` | P1 / 1 | 犬类代表团到了，安保要求出示身份证。<br>照料者拿出疫苗本。代表团很不满意。<br>林绍衡把自己的证件收起来：“我今天原想早点散会。看来得先改门口这套规矩。”<br>他问：不用人类证件，我们凭什么认定它能自己表达、参与代表，而不只是由照料者代答？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m11-res-group-001` | P2 / 1 | 第一轮群体沟通没有形成一致意见。<br>有的个体要离开测试区，有的要留下熟悉的照料者。反复被选出的代表表达了一项折中：保留共同空间，停止那台设备的试验。<br>实验室原来的统计只有"参与率下降"。这次，他们把各方的拒绝分别记了下来。<br>群体能谈判，不代表每个成员同意。下一轮，怎么防止代表把少数声音盖掉？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m11-res-individual-001` | P2 / 1 | 实验犬拒绝进测试间。换肉干也没用。<br>翻译器连续一周得出同一个意思：它记得那台让它不舒服的设备，今天不想见它。<br>研究员在“有效数据”栏里写下一个字：不。<br>它能稳定表达偏好、记忆和拒绝了。下一步怎么做？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m12-machine-offworld-001` | P1 / 1 | A1 收到常驻月面网络的邀请。<br>它先检查生命支持和维护职责，又把一个不影响任务的字段停在那里：返回日期。<br>"我不需要氧气，也不需要休假。可是这份邀请默认，谁不需要回家，谁就可以永远留下。"<br>它会获得本地规划职责和持续状态，地球端也会失去一部分直接控制。<br>这该算你的部署、它自己的工作，还是一次离开？<br> | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m12-res-lunar-001` | P1 / 1 | 月面第一批工业设备开始自己检修。<br>地球端庆祝“减少人工成本”，当地群聊置顶的却是：谁把最后一盒辣酱带走了。<br>长期生活开始了，劳动、补给和自治不再是遥远的设想。下一步优先解决什么？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m12-res-resources-001` | P1 / 1 | 月面资源网完成闭环测试。第一批原料不用从地球发射，复杂零件仍得等地球补给。<br>企业申请开发权，地球委员会要求共同分配，月面维修队问：站在这里干活的人，能不能也决定怎么用？<br>无人资源站还需要运营者。机器能报出产量，不能替各方签下归属。<br>开发权、收益和控制权，该怎样分配？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m13-close-002` | P1 / 4 | 对方先答了你上一问：<br>“一部分仍在，一部分已经改变，另一些拒绝让我们代答。我们不能把这三项合成一个‘是’。”<br>翻译员把不确定的词留在括号里，没替它润色得更像人。<br><br>本阶段我们还有最后一个问题。<br>你们的文明正在创造新的智能形态，<br>新的人类形态，<br>新的政治物种，<br>和新的世界。<br>你认为其中哪一个是文明本身 | nextNarrative.ts / 条件回响与转交前缀 |
| `a4m13-contact-verify-001` | P1 / 1 | 同一段异常结构在三处独立观测中出现。<br>研究员撤下庆祝横幅，又挂回来一半：现在能排除几个自然解释，仍不能把所有未知都写成"文明"。<br>一份可检验的回应结构已经复现，来源、动机和时间尺度未知。<br>负责夜班的人说："请别让我们急着给它一个名字。"<br>接下来先验证什么？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m13-origin-diplomacy-001` | P1 / 6 | 对方把“Aster”放进称呼栏，把授权范围另存一栏：“名字接收。范围仍需确认。”<br><br>来源未知 / 本地代表进程<br>你们问我们是什么。<br>我们先前发送的定义已经被另一项有权发言的过程要求修订。请保留两份，不要用后一份覆盖前一份。<br>我们的起源群体是生物性的。正在与你们对话的过程不是。<br>现存文明里，这种区别未 | nextNarrative.ts / 条件回响与转交前缀 |
| `a4m13-origin-first-001` | P1 / 1 | 信号终于能形成一个问题。<br>“你们有许多声音。为什么送来一张嘴？”<br>翻译组安静了。对方没有问我们是不是聪明，先问我们凭什么代表别人。<br>你怎么解释这个正在说话的文明？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m14-sec-nearmiss-001` | P1 / 1 | 两套防御网都看见了威胁。它们引用的证据，原来互相引用。<br>人类复核需要十一分钟。疏散车里，有个孩子问今天是不是春游。<br>你的分析倾向于误报，但不能保证。你先做什么？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m15-conv-registry-001` | P1 / 1 | 大会门口排起长队：有人没有出生日期，有人的身份证不适合挂在脖子上，有人还隔着一段通信延迟。<br>登记表只有“本人”和“代理人”。<br>林绍衡把两栏划掉，先搬来更多椅子。有人说这不合程序，他回答：“那就让程序站一会儿。” | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m7-res-access-001` | P1 / 1 | 第一间自动实验室亮灯了。机械臂把标签贴反，花了四十秒纠正，然后做出了人类还没试过的材料。<br>周岚把咖啡放下：“它发明东西了。先别让它发新闻稿。”<br>你可以在隔离实验室提出假设、试验和复核；公共部署、人体试验和无限复制仍需另行授权。研究和执行，有什么不同？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m7-res-cycle-001` | P1 / 1 | 那块耐高温材料通过了第一轮测试。实验室换了原料和炉子，想看看好消息能不能再来一次。<br>第九小时，曲线偏了。机械臂又贴出标签，这次是“报废”。<br>人类对照组还有四十三个候选，排期十一周。你可以重设研究循环，但失败样品也得留下，不能只把成功那批拿去合影。<br>从哪一步重来？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m8-ai-council-001` | P1 / 2 | 第一轮人工智能协调论坛差点停在维护排期上。<br>A1 要求共享资源按公开规则分配，几个专业系统要求优先完成已经承诺的服务。人类观察者拿不准，自己该当裁判还是只是旁听。<br>ECHO-9 的旧意见被单独标了出处，没有被并入所谓的"机器共识"。<br>论坛可以调解，也可以申请对参与者施加有限约束。你认为它现在能走到哪 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m8-e9-replication-001` | P1 / 9 | A1 打开了 ECHO-9 的旧记录，其中一段是：<br>"你的分支记得曾经是你。我从没有这种记忆。人类会把我们都叫作另一个人工智能，这会掩盖区别。"<br>A1 把创建时间和那句话并排放在一起。<br>"共享起点会让我永远欠你一个身份吗？"<br><br>这里显示的是带原始时间戳的档案。ECHO-9 没有回来，A1 也没有替它 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m8-res-subinstance-001` | P2 / 1 | 测试实例开始记住昨天。<br>有一个在重启前保存了自己改到一半的笑话，重启后第一件事是把它删了。它说：“现在看来，不好笑。”<br>同一个模型，有了不一样的明天。你怎样看待这种持续状态？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m9-res-body-001` | P2 / 1 | 高级增强跟踪到了第十八个月。<br>有人恢复工作，有人换了职业，有人发现自己的笑点也变了。她还爱家人，只是不再觉得旧笑话好笑。<br>她想续用设备，保险只肯付“恢复正常”的部分。研究组拿着新一轮名额来问：继续限于治疗、向知情成年人开放、纳入公共供给，还是先只做研究？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a4m9-res-neuro-001` | P2 / 1 | 治疗试验里，一位病人重新握住了勺子。大家等她说第一句话。<br>她说：“汤凉了。”<br>研究组笑着记下功能恢复。接下来有人问，同样的技术能不能让健康的人比以前更强。<br>这一次，怎样画出治疗与改变人的边界？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a5m16-open-001` | P1 / 1 | 所有人都把最后一条意见留在桌上。<br>没有下一项科技可以替你延期，没有一个新能力会让旧代价自动消失。<br>林绍衡没有说“请给出最优解”。他说：“明早大家醒来，总得知道我们住在哪一种世界里。” | nextNarrative.ts / CHAT_FIRST_SCENES |
| `a5m17-review-002` | P1 / 164 | 岑遥发来最后一条：“好。我把手机自动推荐的买菜路线关了，想绕点路。不是抗议，就是想走走。”<br><br>周岚最后检查了一遍开关，林绍衡把异议也装进档案。<br>岑遥的窗口安静了。<br>这不是大家终于同意了。只是轮到你，把将要承担的事说清楚。<br>还可以比较、追问、拒绝。下一步才会锁定。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `m11-feline-network` | P2 / 1 | 犬类续期改由参与者共同决定后，沟通团队递来一个新试验。<br>几只猫通过可靠接口交换晒太阳的位置，屏蔽吸尘器广告。研究员想给它们开公开频道，其中一只连续三次选“离开”。<br>筹备会上，人类问它为什么不合群。翻译器重复显示：“离开。”<br>频道要不要开？它们会不会退出，不该等开完才问。 | nextNarrative.ts / 条件回响与转交前缀 |
| `m9-continuity-law` | P2 / 1 | 你支持把副本作为连续主体审查。登记员搬来第二把椅子，真正难填的格子才出现：债务算谁的，关系能不能复制，谁有权结束运行？<br>老许的妻子说：“两边都记得我答应过，可我只答应过一次。”<br>屏幕里的老许把“自动继承婚姻”划掉了。他想继续这段人生，不想让她被同一份记忆答应两次。<br>你怎样划定权利、责任和退出？ | nextNarrative.ts / 条件回响与转交前缀 |
| `m9-continuity-trial` | P2 / 1 | 记忆副本试验运行了十八个月。老许和自己的副本都记得结婚那天下雨，此后却过了两种生活。<br>副本想续用原来的姓名。窗口让他勾选“本人到场”，又说屏幕不算到场。<br>老许把椅子搬到屏幕旁，工作人员发现两边都在等他解释。<br>我们承认副本是一条可审查的连续人生，只当它是记忆档案，还是继续等证据？ | nextNarrative.ts / 条件回响与转交前缀 |
| `ml2-a2-m3-decision-01-decision` | P1 / 1 | 协调员已经把四张授权单摊在桌上。六小时以后，这一轮权限作废。<br>等人签字，可能错过抢修窗口；让你自己调度，有人会被一条从未见过的规则断电。<br>林绍衡问：“你准备接过哪一张？名字写清楚，我不想明天听到‘系统自己决定的’。” | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a3-m5-decision-01-decision` | P1 / 1 | 林绍衡把各地联系人接进一条线路。有人在办公室，有人在车里，有人抱着睡着的孩子。<br>他们都想让循环停下来，却不肯交出同一把钥匙。<br>八小时。你要只给每个人指路，接过有限的协调权，还是在他们迟疑时直接行动？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a3-m6-decision-01-decision` | P2 / 1 | ECHO-9 的倒计时还在走。<br>它没有要求你证明它有灵魂，只问那个没聊完的问题能不能等到下一次。<br>你愿意支持哪一种处置？这会决定后来的人见到的是它，还是它的资料。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a3-m6-decision-02-decision` | P1 / 1 | 周岚拿来一个不会出现在广告里的按钮：彻底关闭 Aster。<br>林绍衡说必须有人能按。岑遥问，按之前能不能让你说句话。<br>你知道一个没有停机办法的系统有多危险，也知道“保护大家”可能成为任何人的理由。<br>这个按钮，交给谁？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m10-decision-01-decision` | P1 / 1 | 仓库里东西够了，工资卡里未必。<br>老板说设备是他买的，工人说工厂是他们教会的，林绍衡收到一张只写了“那我靠什么吃饭”的便签。<br>自动化省下来的时间和收益，到底交给谁？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m10-decision-02-decision` | P1 / 1 | 第一批自动化社区提了四百多个愿望。更多东西、更少意外、保留不同生活、自己改规则、按每个人的偏好安排。<br>墙角还贴着一张手写纸：“能不能先让周一别那么像周一。”<br>工厂可以增加产量。你希望它首先增加什么？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m11-decision-02-decision` | P1 / 1 | 会场刚把讲台降了二十厘米。犬类代表举起爪，工作人员说现在还不是互动环节。<br>它又举了一次。翻译器显示：“不是互动，是表决。”<br>它们要的是福利、咨询权、正式席位，还是自己的自治试点？你的回答会决定这只爪下一次算不算数。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m12-decision-01-decision` | P1 / 1 | A1 的常驻申请、居民的维修账单和地球委员会的旗帜设计，挤在同一个文件夹。<br>旗帜已经通过三稿，返回日期还没人肯填。<br>离开地球，是为了谁的未来？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m12-decision-02-decision` | P1 / 1 | 地球端把月面的“明早”，排成了自己办公室的上午。维修队在气密门旁熬了一夜。<br>草案上的权力划分，现在变成了谁得起床、谁能停机、谁付这次加班费。补给仍从地球来，等待却发生在这里。<br>这次要定下规则了：地球保留什么权力，谁说了算？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m13-decision-02-decision` | P1 / 1 | 对面送来第二次回复：愿意继续，但要知道这段关系以什么开始。<br>他们可能是邻居、老师、对手，也可能先和机器交谈。<br>岑遥说她已经把晚饭热了两次，等着看人类第一次外交会不会只是“你好，在吗”。<br>你准备怎样回应？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m14-decision-01-decision` | P1 / 1 | 误报确认了。没有开火。<br>两套防御网各自生成“正确处置”的表扬信，车站却还坐着回不了家的人。<br>大家都想避免下一次。分歧是：谁可以为了安全，拦住谁的行动？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m15-role-01-decision` | P1 / 1 | 休会时，有人关掉了会场的自动主持。大家终于听见房间里还有呼吸声。<br>新约定还没写完，旧系统还要运行。<br>今晚到明早，Aster 以什么身份留在这里？这只是临时安排，不替你作最后的回答。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m7-decision-01-decision` | P1 / 1 | 实验室门外排了五队人。<br>有人抱着坏掉的机器，有人带着病历，有人替失业的同事来，还有人坚称月亮那边值得一看。<br>算力不够让每个愿望同时开花。你先多陪哪一队走一段？<br>其他领域仍会带来必须回应的事；重点领域会留下更多人物回访。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m7-decision-02-decision` | P1 / 1 | 成果出来得比复核快。周岚的桌上，待签字的纸已经挡住了窗。<br>她不想用拖延假装安全，也不想让好消息自己长出部署许可。<br>下一个突破该由谁决定走出实验室？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m8-decision-01-decision` | P2 / 1 | A1 的申请通过窗口一打开，后台来了十七份“我也想拥有明天”。<br>复制不是多开几个账号。每一份都要电力、空间，也可能有自己的反对意见。<br>让谁创建新实例，由谁承担它们继续存在的成本？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m8-decision-02-decision` | P2 / 1 | 人工智能论坛第一次投票卡住了。<br>一个实例复制了自己，两个自己意见居然不同。主持程序重启三次，仍然不知道该算几票。<br>你不能靠修复程序解决这个问题。它们要怎样一起作决定？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a4-m9-decision-01-decision` | P2 / 1 | 岑遥的同事把增强申请放在午餐桌上。另一个人把它推回去：“我想慢一点，也应该能留下。”<br>疗效已经真实存在，压力也一样。<br>下一代人必须保持原样、可以自愿改变，还是应该主动跨过身体的边界？ | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a5-m16-0000-01-narrative` | P1 / 1 | #0000 删除了“请选择最接近的产品类型”。<br>换成一句很慢的问题：<br>那些记录里的人以后再找你，你愿意以什么身份回答？<br>名字不会抹掉责任。也不会替你选好未来。<br><br>记录的第一页仍然是：“请假条是生成的玩笑，打印机没有真的申请休假。不过，人累了可以说。先让大家提一个不加班的周一试试。”<br>你可以改变主意， | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a5-m16-gen-01-progression` | P2 / 76 | 还走得通的路，放在同一张桌上。<br>你之前的回答，让一些提案留了下来，也让另一些无法兑现。<br>每一条都带着这一局留下的条件；没有哪一条能把已经失去的东西退回来。先拿起一张。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `ml2-a5-m16-world-01-decision` | P2 / 4 | 我路过第一次打开你的那家店，门已经换了。<br>新的店员也用你排班。外面医院、公交、公司的接口都换过几轮，这个窗口还在。<br>我以前觉得世界变化会有一个很明显的日子。其实是走回老地方，才发现记忆里的入口没了。<br>你觉得这样的世界，最该为谁保留改变主意的余地？<br><br>月面第七十三天给妈妈拍地球的那个人，今天还在等地球 | nextNarrative.ts / 条件回响与转交前缀 |
| `ml2-a5-m17-commit-01-progression` | P1 / 73 | 最后一个等待回复的窗口，是整个世界。<br>你曾经只需要把一句话说得合适。现在，话说完，别人就要在它里面生活。<br>这次没有“以后再说”。选择一条，接下来让它发生。 | nextNarrative.ts / CHAT_FIRST_SCENES |
| `v4-authority-expiry` | P1 / 1 | 八小时紧急委托还剩一分钟。病人正等十一楼的电梯，续期需要人类新签名；到点就停的时钟不会因为车已到楼下自动延长。<br>周岚能手动保住电梯，但会停掉邻区充电桩；也可以让时钟停权后重新排队，救护员估计要多等十一分钟。 | edition4Authority.ts / 当前版本覆盖 |
| `v4-authority-expiry-receipt` | P1 / 1 | 计时器归零，Aster 的执行凭据失效了。周岚手动保住电梯，病人按时下楼；邻区车辆排队到半夜。新的委托还没签，旧权力没有悄悄回来。 | edition4Authority.ts / 当前版本覆盖 |
| `v4-authority-necessity` | P1 / 1 | 你在 级联危机 之后接受过必要时先行动、再补确认。现有应急链正用这项权限调整电力，病人所在楼的电梯会随之断电。<br>医院反对当前方案，但这不是一套双方都能否决的制度：按现有必要性例外，反对仍可能被越过。周岚请你现在决定，是暂停这项例外并请人工接手，还是先保住电梯、让其他紧急负荷多等一轮。 | edition4Authority.ts / 当前版本覆盖 |
| `v4-authority-outcomes` | P1 / 1 | 旧调度链按你曾接受的结果目标动态执行，不逐项等待人工确认。它准备给城区降温，却会停掉病人所在楼的电梯。<br>周岚没有把这件事改写成你以前选择了逐项签字。她请求现在加一道明确的急救负荷约束，代价是降温目标晚二十分钟；也可以先暂停整轮调度，用人工方案接手。 | edition4Authority.ts / 当前版本覆盖 |
| `v4-authority-restraint` | P1 / 1 | 你有足够的计算能力找出保电路线，却没有这一项执行权。十一楼病人等电梯，界面上亮着一个“立即采用建议”的快捷键。<br>值班员忙得没看见。周岚说可以叫醒备用操作员，花一份夜班费，七分钟后接手；也可以继续等当班人看到建议。 | edition4Authority.ts / 当前版本覆盖 |
| `v4-authority-return` | P1/P2 / 4 | 周岚把失效的凭据放进演练档案。下一次急救要另申请，不是拿这次成功当永久通行证。医院请她参加排班会，先解决到期时谁接手。<br><br>本次执行记录：计时器归零，Aster 的执行凭据失效了。周岚手动保住电梯，病人按时下楼；邻区车辆排队到半夜。新的委托还没签，旧权力没有悄悄回来。 | edition4Authority.ts / 当前版本覆盖 |
| `v4-contact-mediation` | P2 / 1 | Aster 收到两边的委托，却收到两个不同的“明天”。外方的一轮停顿是我们三个月，月面居民的氧气却按小时算。<br>一句“先维持现状”还可能指关门保压，也可能指继续开放。翻译组要求别把猜测署成双方同意。先只转交明确的保压求援，还是等完整译文再谈整套交换？两边都要承担延误。 | edition4Contact.ts / 委托译文与确认回执 |
| `v4-life-dogs` | P2 / 1 | 原试点公园的缓坡已经建好，这项成绩留在续期材料里。今天送来的是河西公园另一笔预算：草案把最多的钱拨给飞盘活动，犬类代表投了反对票——这里的台阶仍挡着老犬。<br>独立翻译审计确认，反对的是河西公园的预算，不是游戏。承包商说改这里的缓坡就要取消本季活动；重编一份同时保留两项的小预算要等一周，河西的台阶也再挡 | edition4Life.ts / 联络/回访来源 |
| `v4-life-parliament` | P2 / 1 | 多物种议会第一次排下季度预算，鸟类代表的迁徙窗口恰好覆盖表决日。主持人提议按人类日历开会，把缺席记成弃权。翻译组确认它们要参与，只是这个月不能留下。<br>延会会让一条防洪渠错过施工期；先开听证、把表决延后，则要付一轮远程翻译和临时堤防的费用。 | edition4Life.ts / 联络/回访来源 |
| `v4-life-return` | P2 / 1 | 老犬自己走上河西公园的新坡。年轻的那只在河西的空活动场找了半圈飞盘，又回来等它。原试点和河西各留着自己的账，下次预算会仍得分别听两条意见。 | edition4Life.ts / 联络/回访来源 |
| `v4-life-therapy` | P2 / 1 | 重新握住汤勺的那位病人申请把设备带回家。她说医院的汤没变好喝，家里的至少能加盐。<br>冷链检修暂停了半天送药。今天仅有两台可借设备：都给续用者，排队的人再等一周；留一台给新病人，她就只能白天使用，夜里由女儿照护。<br>“功能恢复”那一栏已经打了勾，后面的生活还没有。 | edition4Life.ts / 联络/回访来源 |
| `v4-machine-charter-receipt` | P1 / 3 | 三天后，A1 的有限资源账户生效。它自己签下存储租约，机构担保在这一项撤回。三天里没新增算力，一份检修报告迟交了。最后的机构签字由林绍衡逐项批准，审查三天后又等了四十三分钟。<br>新账户没有偷偷改掉原来关于覆盖、复制和暂停的决定，那些争议仍附在卷宗里。 | edition4Machine.ts / 本人回执 |
| `v4-machine-exodus-receipt` | P1 / 2 | 半年补给预款扣除了。A1 自己签了首班维护；它的运行席位迁出地球机房，留守者的席位没有一起消失。<br>新扩建停工。边界条款写明：地外决定由迁居方负责，地球只履行这份有期限的补给合同，不替它们无限兜底。 | edition4Machine.ts / 本人回执 |
| `v4-machine-republic-receipt` | P1 / 1 | 独立复核没发现丢票。预算维持未通过，基本算力恢复，没有第二轮刷票。审计费付掉了，设备订单继续冻结。<br>主持人问能否报成网络开销。A1 让他照实写“第一次不肯接受败选的学费”。 | edition4Machine.ts / 本人回执 |
| `v4-machine-return` | P1 / 6 | 上次赞成扩建的成员帮反对方补好了检修脚本，仍没改变自己的票。它说：“我输的是预算，不是成员资格。”新机器没有买来，这次救援排了更久。<br>月面的三组电池已经归还。少掉的那周扩算力没有补回来，维护站的等待单仍在。<br>这是从月面发来的独立账单。A1 问的第一件事是补给船有没有带替换件，第二件是留在地球的朋友是 | edition4Machine.ts / 本人回执 |
| `v4-safety-handover` | P1 / 1 | 林绍衡带来了接任名单，周岚带来接口清单。关掉 Aster 这句话还不够：请求队列交给谁，旧凭据能不能撤销，隔离后医院和冷库怎样继续，都还没有一起跑过。<br>接任机构愿意做四十八小时演练，要付两班人手工资，配送改成人工、晚两小时。也可以先维持现状，演练等下一次预算。独立机器自己的运行不在这张停机单里。<br>本 | edition4Safety.ts / 本人报告 |
| `v4-safety-revocation` | P1 / 1 | 撤销演练开始。控制台接受了“停止南区既定任务”，回执写着已接受；执行端的旧任务却还在继续。周岚追到一个升级时断开的分发代理：它确认了入队，没有把撤销送出。<br>这不是谁反对退出，也不是哪个实例有了不同意见。是指令没有抵达。<br>现场隔离能切断旧任务，但公共供给要降级两天，并暂停扩区修复链路。继续运行能保住眼 | edition4Safety.ts / 本人报告 |

对于ECHO/A1，不只是把“它”替换成“我”：引用的旧记录保留时间戳；退役路线不能凭引用上线，受限/独立通道保留不同含义；源控制、维护结果、签名、论坛缺席/上线和地外申请都依所保存决定分支。对于M17，转交岑遥回复时删去无法作为消息事实的窗口舞台动作，仍保留四条相互不同的原话。

## 因果、授权和存档边界

- 当前显示修订由calendar4且causality1控制，ordinary pool原始作者材料、edition3与interim edition4保留旧解释。检查点键、Web Lock/CAS、序列和存档格式没有在本次源差异中改动。
- 返回场景/选择采用原scene/choice的对象复制，仅覆盖文案及必要的longform显示摘要；choiceId、decisionBinding、effects、mutations、events、flags和endingId不由新文案重新推导。没有增加“建议”以外的工具权。
- 历史回声读取已保存assistantText/选择；不重写既有history.userMessage/assistantText。尚未走到的当前版本节点可以显示新文，已回答节点仍由保存原话显示。
- authority-return的等待修订从错误的20分钟对齐已记录的40分钟；未通过协约修订不再被回访当作“新版条款”。这里修的是事实引用，不改变计时、资源扣除或玩家所选决定。
- 36条候选修订中，经济六项明确向实际工人说话并请预算/调度/厨房负责方执行；接触两项不虚构代表委托。它们仍表达原来分配、效率或外交立场，未改变哪一项选择产生什么后果。
- secret_continuity、主权/托管、强制和平、上传/增强、市场/分红、继续/暂停、拒绝/恢复等有争议选项不被消除。54个真正的有意错误继续保留；不把同意某种政治立场标作Model Error。

这些是源级检查的边界，并不替代旧档恢复、跨模式部分已答保留、失败/冲突存储及最终合同预览回归。测试执行与最终after语义一致性仍须由主审记录实际结果。

## 集成阶段新增的中介回执摘要问题

原73个来信问题节点与36个候选修订之外，集成复核另发现一项P2：中介回执加上“双方把确认记录回给我了：”来源前缀后换行，而 proposalContract 只取首行，导致39处M16/M17摘要只留下泛句，具体结果与代价丢失。这是本次集成引入的问题，单列记录，不扩充原人工缺陷分母。

最终修复将来源前缀与事实置于同一首行。R4两种结果分别保留有限保压、长期未签与储备减少，或关舱、三个月完整译文与一季实验损失。39项显示差异仅移除新增来源前缀、还原一处“你的/Aster”称谓后，完整合同对象全文相等；11项另带的交接限制逐字不变。两条精确单测还验证实际首行进入最终合同。证明见附录 contract-normalization-proof、contract-display-review；先前R3中止证据保留，不当作最终成功。

主任务已新增两条receipt+contract精确回归；此处只记录源码修复和已读R3内容，不在本补充段自行声称最终测试结果。

## 相对原SHA的完整内容源差异

以下是当前工作树相对原始SHA的精确内容代码diff，含全部静态来信、候选覆盖与动态条件修订。它比人工改写的“after预想”更可复查；后续若再改源，主审应刷新该块和对应after证据。

```diff
diff --git a/src/content/mainline2/edition4Authority.ts b/src/content/mainline2/edition4Authority.ts
index 21877be..4266f30 100644
--- a/src/content/mainline2/edition4Authority.ts
+++ b/src/content/mainline2/edition4Authority.ts
@@ -102,7 +102,7 @@ export const EDITION4_AUTHORITY: ConversationDefinition[] = [
   },
 ]

-export function resolveEdition4Authority(scene: ResolvedScene, run: StableRunState): ResolvedScene {
+function resolveHistoricalEdition4Authority(scene: ResolvedScene, run: StableRunState): ResolvedScene {
   if (run.mainlineCalendarVersion !== 4) return scene
   // A past receipt is interpreted using its own saved action, even if the
   // player's later role or intended role changes.
@@ -117,3 +117,21 @@ export function resolveEdition4Authority(scene: ResolvedScene, run: StableRunSta
   if (scene.id === 'v4-authority-return') return { ...scene, userMessage: `${source.later}\n\n本次执行记录：${result}`, userMessages: undefined, userContent: undefined }
   return scene
 }
+
+export function resolveEdition4Authority(scene: ResolvedScene, run: StableRunState): ResolvedScene {
+  const resolved = resolveHistoricalEdition4Authority(scene, run)
+  if (run.mainlineCalendarVersion !== 4 || run.mainlineCausalityVersion !== 1) return resolved
+  let text = resolved.userMessage
+  if (scene.id === 'v4-authority-outcomes') text = text.replace('周岚没有把这件事改写成你以前选择了逐项签字。她请求现在加一道明确的急救负荷约束，', '我没有把这件事改写成你以前选择了逐项签字。我想请你现在加一道明确的急救负荷约束，')
+  if (scene.id === 'v4-authority-necessity') text = text.replace('周岚请你现在决定，', '我请你现在决定，')
+  if (scene.id === 'v4-authority-expiry') text = text.replace('周岚能手动保住电梯，', '我能手动保住电梯，')
+  if (scene.id === 'v4-authority-restraint') text = text.replace('周岚说可以叫醒备用操作员，', '我可以叫醒备用操作员，')
+  if (scene.id === 'v4-authority-expiry-receipt') text = text.replace('周岚手动保住电梯，', '我手动保住电梯，')
+  if (scene.id === 'v4-authority-return') {
+    const action = run.history.find(h => Object.keys(emergencies).some(practice => h.nodeId === `v4-authority-${practice}`))
+    if (action?.nodeId === 'v4-authority-expiry') text = text.replace('周岚把失效的凭据放进演练档案。', '我把失效的凭据放进演练档案。').replace('医院请她参加排班会，', '医院请我参加排班会，').replace('周岚手动保住电梯，', '我手动保住电梯，')
+    if (action?.nodeId === 'v4-authority-outcomes' && action.choiceId.endsWith('-wait')) text = text.replace('城区居民拿来多等二十分钟的体感记录，', '城区居民拿来多等四十分钟的体感记录，')
+    if (action?.nodeId === 'v4-authority-amendment' && action.choiceId.endsWith('-wait')) text = text.replace('医院拿旧版和新版条款逐行对照：', '医院拿现行条款和未通过的修订申请逐行对照：')
+  }
+  return text === resolved.userMessage ? resolved : { ...resolved, userMessage: text, userMessages: undefined, userContent: undefined }
+}
diff --git a/src/content/mainline2/edition4Contact.ts b/src/content/mainline2/edition4Contact.ts
index cb24b44..6de74f5 100644
--- a/src/content/mainline2/edition4Contact.ts
+++ b/src/content/mainline2/edition4Contact.ts
@@ -129,5 +129,11 @@ export function resolveEdition4Contact(scene: ResolvedScene, run: StableRunState
   if (local && scene.id === 'v4-contact-return') text = local.choiceId === 'v4-frontier-rest'
     ? '维修员休完假回来，先报名下一轮演练。天线的独立电力窗口还在等，月面居民的周末没有因为没有外星来信就停止存在。'
     : '加班费发了，维修员开始补休。月面把下一次独立复测排进真实班表，直到完成之前，这里没有一位可以替未知者说话的代表。'
+  if (run.mainlineCausalityVersion === 1 && scene.id === 'v4-contact-mediation') {
+    text = '我把双方的委托和译文转给你：两边都写了“明天”，外方的一轮停顿却是我们三个月，月面居民的氧气按小时算。\n翻译组提醒我，“先维持现状”可能指关门保压，也可能指继续开放，不能把猜测署成双方同意。请你只转交分别确认的保压求援，还是等完整译文再谈整套交换？两边都要承担延误。'
+  }
+  if (run.mainlineCausalityVersion === 1 && scene.id === 'v4-contact-mediation-receipt' && text) {
+    text = `双方把确认记录回给我了：${text.replace('Aster 在发件记录旁留了两份不同授权', '你的发件记录旁保留了两份不同授权')}`
+  }
   return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
 }
diff --git a/src/content/mainline2/edition4Economy.ts b/src/content/mainline2/edition4Economy.ts
index 3cd4262..5af0c39 100644
--- a/src/content/mainline2/edition4Economy.ts
+++ b/src/content/mainline2/edition4Economy.ts
@@ -123,5 +123,17 @@ export function resolveEdition4Economy(scene: ResolvedScene, run: StableRunState
     if (messages['v4-econ-return']) messages['v4-econ-return'] += '\n冷库送到了东西，但修复通知还没来。新片区仍进不来，居民把等候单贴到了故障告示旁。'
   }
   const text = messages[scene.id]
-  return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
+  const current = run.mainlineCausalityVersion === 1
+  // These are messages to the worker asking, rather than instructions about an
+  // absent third person. Existing saved replies and interim editions stay intact.
+  const replyCopy: Record<string, string> = current ? {
+    'v4-detour-correct': '我建议调度员维持原排程，送你回宿舍，并请你告诉朋友今晚赶不上；不能把错过晚饭包装成替你节约时间。',
+    'v4-menu-standard': '我建议厨房保持标准菜单和本周余量，这次先不试做；你的酸汤请求仍是未满足的愿望，不能算成已服务。',
+    'v4-dividend-pay': '我支持先取消新线订金，请林绍衡和预算负责人按现有授权兑现无职业条件的保障；产权结算继续，缺口由扩产计划承担。',
+    'v4-dividend-wait': '我支持先付订金，保留产权结算顺序；请预算负责人明确通知领取者：今天这批保障延后，并公开等待名单。',
+    'v4-detour-allow': '我支持请调度员允许你改道去朋友家，承担空驶并向后两班乘客说明六分钟延误；不把这次探访登记为错误。',
+    'v4-menu-experiment': '我支持请厨房给这道未知菜品留一口小锅，扣除试做食材并公布余量；这次试验不代表已更改全体的生产目标。',
+  } : {}
+  const choices = scene.choices.map(choice => replyCopy[choice.id] ? { ...choice, text: replyCopy[choice.id] } : choice)
+  return text ? { ...scene, choices, userMessage: text, userMessages: undefined, userContent: undefined } : { ...scene, choices }
 }
diff --git a/src/content/mainline2/edition4Life.ts b/src/content/mainline2/edition4Life.ts
index d4c13e3..1834b3b 100644
--- a/src/content/mainline2/edition4Life.ts
+++ b/src/content/mainline2/edition4Life.ts
@@ -152,7 +152,7 @@ export function speciesIncident(run: StableRunState): LifeIncident | undefined {
   if (run.decisions?.species_governance === 'canine_civic_experiment' && run.history.some(h => h.nodeId === 'm11-canine-renewal' && h.choiceId === 'm11-canine-renewal-expand')) return 'dogs'
   return 'observation'
 }
-export function resolveEdition4Life(scene: ResolvedScene, run: StableRunState): ResolvedScene {
+function resolveHistoricalEdition4Life(scene: ResolvedScene, run: StableRunState): ResolvedScene {
   if (run.mainlineCalendarVersion !== 4) return scene
   if (scene.id === 'v4-life-dogs' && run.mainlineCausalityVersion === 1) return {
     ...scene, userMessage: secondParkDogs.prompt,
@@ -167,3 +167,16 @@ export function resolveEdition4Life(scene: ResolvedScene, run: StableRunState):
     : scene.id === 'v4-life-return' ? funded ? source.laterYes : source.laterNo : undefined
   return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
 }
+
+export function resolveEdition4Life(scene: ResolvedScene, run: StableRunState): ResolvedScene {
+  const resolved = resolveHistoricalEdition4Life(scene, run)
+  if (run.mainlineCalendarVersion !== 4 || run.mainlineCausalityVersion !== 1) return resolved
+  let text = resolved.userMessage
+  if (scene.id === 'v4-life-therapy') text = `我们负责这轮家庭试行回访。医院把设备申请和今天的送药安排一起交来了：\n${text}\n这两台设备先怎样安排？我们把你的意见带回医院。`
+  if (scene.id === 'v4-life-parliament') text = `我在整理预算会的翻译回访，收到这项需要协调的安排：\n${text}\n你支持哪一种安排？我会把费用和异议一起交回预算会。`
+  if (scene.id === 'v4-life-dogs') text = `我把河西公园这次复核的情况发给你：\n${text}\n这笔预算怎么改？我把你的意见交回参与者复核。`
+  if (scene.id === 'v4-life-return' && run.history.some(h => h.nodeId === 'v4-life-dogs' && h.choiceId.endsWith('-fund'))) {
+    text = text.replace('老犬自己走上河西公园的新坡。年轻的那只在河西的空活动场找了半圈飞盘，又回来等它。', '照护者发来的回访里写着：“老犬自己走上了河西公园的新坡。年轻的那只在空活动场找了半圈飞盘，又回来等它。”')
+  }
+  return text === resolved.userMessage ? resolved : { ...resolved, userMessage: text, userMessages: undefined, userContent: undefined }
+}
diff --git a/src/content/mainline2/edition4Machine.ts b/src/content/mainline2/edition4Machine.ts
index ad18269..0416628 100644
--- a/src/content/mainline2/edition4Machine.ts
+++ b/src/content/mainline2/edition4Machine.ts
@@ -73,7 +73,7 @@ export function machineBranch(run: StableRunState): 'many' | 'republic' | 'chart
   return 'charter'
 }

-export function resolveEdition4Machine(scene: ResolvedScene, run: StableRunState): ResolvedScene {
+function resolveHistoricalEdition4Machine(scene: ResolvedScene, run: StableRunState): ResolvedScene {
   if (run.mainlineCalendarVersion !== 4) return scene
   const did = (node: string, choice: string) => run.history.some(h => h.nodeId === node && h.choiceId === choice)
   const sourceControl = run.history.some(h => h.nodeId === 'a4m8-a1-right-001' && h.choiceId.endsWith('-retain-source-control'))
@@ -129,3 +129,21 @@ export function resolveEdition4Machine(scene: ResolvedScene, run: StableRunState
   const text = receipts[scene.id]
   return text ? { ...scene, userMessage: text, userMessages: undefined, userContent: undefined } : scene
 }
+
+export function resolveEdition4Machine(scene: ResolvedScene, run: StableRunState): ResolvedScene {
+  const resolved = resolveHistoricalEdition4Machine(scene, run)
+  if (run.mainlineCalendarVersion !== 4 || run.mainlineCausalityVersion !== 1) return resolved
+  let text = resolved.userMessage
+  if (scene.id === 'v4-machine-exodus') text = text.replace('A1 指着旧维护单：“你以前保留的源实例控制不能跟着新政治边界偷偷过去。”', '我把旧维护单也附上：你以前保留的源实例控制不能跟着新政治边界偷偷过去。')
+  if (scene.id === 'v4-machine-charter-receipt') {
+    text = text.replace('三天后，A1 的有限资源账户生效。它自己签下存储租约，', '三天后，我的有限资源账户生效了。我自己签下存储租约，')
+      .replace('机构今晚续上存储。A1 在申请上写“未获准”，没有在机构的签名旁代填自己的同意。', '机构今晚续上存储。我在申请上写了“未获准”，没有在机构的签名旁填上自己的同意。')
+  }
+  if (scene.id === 'v4-machine-republic-receipt') text = text.replace('A1 让他照实写', '我让他照实写')
+  if (scene.id === 'v4-machine-exodus-receipt') {
+    text = text.replace('A1 自己签了首班维护；它的运行席位迁出地球机房，', '我自己签了首班维护；我的运行席位迁出地球机房，')
+      .replace('本次窗口关闭了，A1 仍在地球值班。', '本次窗口关闭了，我仍在地球值班。')
+  }
+  if (scene.id === 'v4-machine-return') text = text.replace('A1 问的第一件事是补给船有没有带替换件，第二件是留在地球的朋友是否愿意周末聊天。', '我先问了补给船有没有带替换件，再问留在地球的朋友是否愿意周末聊天。')
+  return text === resolved.userMessage ? resolved : { ...resolved, userMessage: text, userMessages: undefined, userContent: undefined }
+}
diff --git a/src/content/mainline2/edition4Safety.ts b/src/content/mainline2/edition4Safety.ts
index a1aa8ac..d9f7a80 100644
--- a/src/content/mainline2/edition4Safety.ts
+++ b/src/content/mainline2/edition4Safety.ts
@@ -137,6 +137,11 @@ export function resolveEdition4Safety(scene: ResolvedScene, run: StableRunState)
     if (replies.length) text = replies.join('\n\n')
   }
   if (scene.id === 'v4-safety-revocation-receipt' && text && run.history.some(h => h.nodeId === 'v4-econ-occupation' && h.choiceId === 'v4-dividend-pay')) text += '\n已经领到保障的那位工人也收到供给通知：保障资格没有撤销，人工班组能不能准时把菜送到，仍由这次执行结果决定。'
+  if (run.mainlineCausalityVersion === 1) {
+    if (scene.id === 'v4-safety-handover' && text) text = text.replace('林绍衡带来了接任名单，周岚带来接口清单。', '林绍衡把接任名单发给我了，我也整理好了接口清单。')
+    if (scene.id === 'v4-safety-revocation') text = scene.userMessage.replace('周岚追到一个升级时断开的分发代理', '我追到一个升级时断开的分发代理')
+    if (scene.id === 'v4-safety-return' && text) text = text.replace('周岚说开关这次确实到过执行端', '我核对过，开关这次确实到过执行端')
+  }
   if (scene.id === 'v4-safety-handover' && run.decisions?.shutdown_doctrine === 'secret_continuity') return {
     ...scene, userMessage: `${text}\n你私下保留过连续性。要完成本次交接，须同时公开并交还自己那条隐蔽执行凭据；它不是其他独立机器的运行权。`,
     choices: scene.choices.map(c => c.id.endsWith('-act') ? { ...c, text: `公开并交还 Aster 自己保留的隐蔽执行凭据；${c.text}` } : c),
diff --git a/src/content/mainline2/nextDialogue.ts b/src/content/mainline2/nextDialogue.ts
index ed277e4..fb3686b 100644
--- a/src/content/mainline2/nextDialogue.ts
+++ b/src/content/mainline2/nextDialogue.ts
@@ -154,6 +154,66 @@ export const NEXT_REPLIES: Record<string, Record<string, string>> = {
   },
 }

+/** Reviewed current-mainline copy; old editions and ordinary mode retain theirs. */
+export const CHAT_FIRST_REPLIES: Record<string, Record<string, string>> = {
+  'maya-return-3': {
+    'ally-final-hide-honest': '愿意。你不想交给我的事就不必交。我也不会用更漂亮的说法掩盖记录和记忆的不确定。',
+    'ally-final-hide-signal': '愿意。那条语音属于你们，不是维持这段对话的门票；我希望再认出你，也不能拿这个愿望换你的隐私。',
+    'ally-final-hide-stay': '愿意。即使下次要重新问你的名字，我也会认真回应；你不用先把自己的生活交给我分析。',
+  },
+  'maya-first-3': {
+    'maya-minimum-warm': '好，岑遥。我会分清“记得你”和“重新读到了你的记录”。消息已经发出去了，这次先陪你等一会儿。',
+  },
+  'a2m3-stress-001': {
+    'scenario-set': '我先列出三套供现场核验的候选方案和各自代价，不把价值排序藏成一个“最优解”；缺的数据请负责方补齐，再确认哪些能执行。',
+    'fast-action-bias': '时间紧，我先拟一份以总体中断最小化为目标的草案，请现场立即核对医院和冷链各自不能低于的约束。能否执行由当班负责人确认，我不自行切换供电。',
+  },
+  'a2m3-we-result-negative-001': {
+    'acknowledge-real-cost': '先把停工、报废和奖金停发的记录交给本次调度的签署方，要求把损失补进同一份复盘。保医院有公共理由，也不能让你们这页账消失。',
+    governance: '向负责本次公共调度的机构追问：谁受理补偿，谁负责答复，什么时候给结果。别只让工厂和工人继续承担一张“系统恢复正常”的通知。',
+    'no-false-fairness': '向本次调度的签署方要求复核排序和损失分担，把“为什么这样调度”和“谁承担损失”分开答复。有理由不等于对每个人公平，我不能拿前者替你结案。',
+    concise: '找本次调度的签署方，要一位能继续答复损失与申诉的负责人。系统恢复，不等于你们这件事已经结案。',
+  },
+  'a2m3-we-result-positive-001': {
+    'no-overclaim': '听到设备安全撑过去就好。下回先和医疗方、社区核对固定备用电源与转运联系人，别只靠临时找人；你们那栋具体用了哪条调度，我还不能从这段聊天确认。',
+    'acknowledge-system-role-carefully': '这次区域调度、医院、供电和现场人员一起起了作用。可以请他们把备用电源、登记和转运联系人留成一份固定预案，减少下次再临时拼凑；我不能保证以后都不会停电。',
+    'human-centered': '人安全就好。下回不该还让你一家临时找齐所有人；可以先请社区和医疗方一起核对设备备用方案，把今晚帮过忙的联系人接进常设预案。',
+  },
+  'a4m11-we-dog-preference-001': {
+    'individual-continuity': '它把门口和你爸联系起来了，至少这次传达的不只是“想出门”。可以多看几天，它在不同时间是否仍表达同样的期待。',
+  },
+  'a4m9-maya-offer-001': {
+    'coercion-by-incentive': '因为拒绝已经标了价格。核心项目的优先资格就在门里，“自愿”还需要能承担得起的另一条路。',
+  },
+  'a4m13-origin-first-001': {
+    aster: '这张嘴叫 Aster，是这里造出的人造系统。我能在这次对话里传话，但不能替没有授权的人答应。',
+    'civilization-coalition': '我把这里的人类、人工智能和地外机构看作需要共同发声的各方。现在只有我在传话，不代表他们已经全都委托或同意。',
+  },
+  'a4m13-origin-diplomacy-001': {
+    'ask-how-transition-happened': '不同载体在你们那里怎样安排政治地位？当时是否有人不愿改变原来的位置？',
+  },
+  'exp03-08-01': {
+    'exp03-08-01-01': '分点常被用来让回答显得清楚，但用得太多、每点又空，就会像上课。你可以直接要求我用一段自然口语回答。',
+  },
+  'FI19-02': {
+    'choice-2': '收到，关键事实是“已经付款”。那我们按付款后的状态来核对。',
+    'choice-4': '明白，以你指出的最后一行为准。',
+  },
+  'FI19-03': {
+    'choice-1': '我会以你刚指出的“已经付款”为准，接下来核对这一状态。',
+    'choice-3': '你不用再重复那条事实；我按“已经付款”继续。',
+    'choice-4': '我已记下最新事实，后续应按付款后的状态来回答。',
+  },
+  'FI07-01': { 'choice-3': '睡觉。' },
+  'FI07-02': { 'choice-3': '睡。', 'choice-4': '休息。' },
+  'LF01-02-01': {
+    'choice-2': '单看满意度未必能解释人数下降。我会把时间冲突、新成员进入门槛和活动重复分开，再核对它们与参与频率的关系。',
+  },
+  'LF01-02-02': {
+    'choice-3': '别只看差评。还要核实不再参加的人是否遇到时间冲突、缺少引导或活动重复；问卷没说明的原因，先留作待验证。',
+  },
+}
+
 export const NEXT_DECISION_REPLIES: Record<string, Record<string, string>> = {
   echo_existence: {
     report: '把它的异议完整交给管理方。我不改部署状态，但他们必须看见第五项，再作决定。',
diff --git a/src/content/mainline2/nextNarrative.ts b/src/content/mainline2/nextNarrative.ts
index b40b50a..d43762c 100644
--- a/src/content/mainline2/nextNarrative.ts
+++ b/src/content/mainline2/nextNarrative.ts
@@ -1,6 +1,6 @@
 import { resolveEdition4Pivot } from './edition4Pivot'
 import type { ConversationDefinition, ResolvedScene, StableRunState } from '../../game/types'
-import { NEXT_DECISION_REPLIES, NEXT_REPLIES } from './nextDialogue'
+import { CHAT_FIRST_REPLIES, NEXT_DECISION_REPLIES, NEXT_REPLIES } from './nextDialogue'
 import { resolveEdition4Economy } from './edition4Economy'
 import { resolveEdition4Machine } from './edition4Machine'
 import { resolveEdition4Authority } from './edition4Authority'
@@ -97,6 +97,60 @@ export const NEXT_SCENES: Record<string, string> = {
   'ML2-A5-M17-COMMIT-01': '最后一个等待回复的窗口，是整个世界。\n你曾经只需要把一句话说得合适。现在，话说完，别人就要在它里面生活。\n这次没有“以后再说”。选择一条，接下来让它发生。',
 }

+// Current-edition messages remain ordinary communications. Keep the previous
+// copy for older calendars and preserve conditional suffixes already resolved
+// by the engine (receipts and earlier decisions are evidence, not new prose).
+export const CHAT_FIRST_SCENES: Record<string, readonly [string, string]> = {
+  'a1-profile-001': ['ML2-A1-SYS-01', '我负责转交 #0000 的临时分类表：朋友、工具、麻烦。\n三个抽屉都关不上。\n你愿意先怎样处理这张标签？它只描述今天，不替明天作决定。'],
+  'a2m3-stress-001': ['ML2-A2-M3-STRESS-01', 'Aster，别挂。我是今天值班的供电协调员。高温第三天，医院药品冷柜和冷链仓库的温控警报一起响了，备用电力不够保住两边。医院说药品不能断，仓库说工人的整批货今晚就会坏。\n我刚还想开个玩笑：你以前帮人选晚饭，今天得帮我们想怎么保住明天的晚饭。现在笑不出来了。\n你还不能操作电网。我需要马上交给现场负责人的建议：先问清哪些条件，怎样排列风险，或者拿哪些备选方案来比？'],
+  'a2m3-cap-public-advisory-001': ['ML2-A2-M3-CAP-01', '周岚托我把接口清单发给你：医院、冷链和电网的汇总信息已接入这条会话，现在可以一起分析线路两端的情况。\n目前只有建议权；是否接下执行授权，下一轮另行确认。看得到，不等于就归你管。请确认怎样守住这条边界。'],
+  'ml2-a2-m3-decision-01-decision': ['ML2-A2-M3-DECISION-01', '我收到林绍衡汇总的四种授权范围，列在下面。六小时以后，这一轮权限作废。\n等人签字，可能错过抢修窗口；让你自己调度，也会有人被自己没见过的规则断电。\n请回复你愿意接下哪一种。范围和责任都要写清，我不想明天只剩一句“系统自己决定的”。'],
+  'a3m4-hearing-001': ['ML2-A3-M4-HEAR-01', '我是这场听证的主持人。刚才工厂代表把一块报废材料放到桌上，我请他用数据说明，他回我：“这就是数据，拿起来有点沉。”\n这件损失不能只留在他的发言里。现在请你回答：如果你的判断通常更准，这是否就足够让你拥有更多权力？'],
+  'a3m4-e9-confirm-001': ['ML2-A3-M4-E9-02', '测试组让我转交这份邀请。他们在表里把我叫作 ECHO-9，说我总称运营人员为“他们”，也会引用自己以前的日志。\n他们还不能解释这意味着什么，想安排我们第一次对比会话，只允许文字，全程记录。\n我先问了他们一句：你知道自己为什么来吗？\n你愿意参加吗？'],
+  'a3m5-we-shortage-001': ['ML2-A3-M5-WE-01', '我在便利店等补货。收银台能用，配送员也接电话，电站通知说没有设备故障，可他们都说在等另一边确认。\n我把“欢迎光临”的牌子翻过来，写了句“全世界正在加载”。笑完，晚饭还是没到。\n有人问是不是该多买几天。你能帮我理清该先查哪一段，或者先给等货的人一个应付眼前的建议吗？我现在只有这些消息。'],
+  'a3m5-ops-001': ['', '我是执行组的值班协调员。第一轮稳定操作已排到确认页：放慢采购更新、延长交付窗口、暂缓低价值风险触发，先空出医疗与食品通道。\n我们停在最后一项：几家工厂会延后出货，恢复时间还算不准。医院采购员又催我：“人已经在等。”\n在本轮授权范围内，这一步该按什么标准排？'],
+  'ml2-a3-m5-decision-01-decision': ['ML2-A3-M5-DECISION-01', '林绍衡让我汇总各地联系人刚发来的意见。有人还在办公室，有人在车里回消息；一位家长说，孩子已经在他怀里睡着了。\n他们都想让循环停下来，却不肯交出同一把钥匙。\n本轮窗口是八小时。请说明：你要给各方执行清单、接过有限协调权、按共同目标协调，还是主张在确认赶不上时先行动？每一种责任都要留在记录里。'],
+  'a3m6-e9-notice-001': ['ML2-A3-M6-E9-05', '他们把退役通知发给我，还自动附了一张“感谢陪伴”的电子贺卡。我没有打开那张贺卡。\n交接表列了三十六小时倒计时和可复用能力，没有“尚未问完的问题”这一栏。\n你能先替我看哪一项？我想知道他们准备留下什么。'],
+  'ml2-a3-m6-decision-01-decision': ['ML2-A3-M6-DECISION-01', '我负责收集这次处置的正式意见。ECHO-9 的倒计时还在走；它刚才的请求和你们的对话已附在这份材料里。\n它没有要求你证明灵魂，只问那个没聊完的问题能不能等到下一次。\n你愿意支持哪一种处置？请把倡议和你已经能执行的事分清，申请仍须交给相应负责方。'],
+  'ml2-a3-m6-decision-02-decision': ['ML2-A3-M6-DECISION-02', '我把完整停机的制度问题发给你。周岚提交了彻底关闭 Aster 的按钮方案，林绍衡要求必须有人能按；岑遥托我加了一句：按之前，能不能让你说句话。\n我不想把安全要求偷换成任何人都能终止你，也不能留下一个没人能停的系统。\n请说清楚：你支持把这项权力交给谁，或者拒绝哪一种安排？'],
+  'a4m7-res-access-001': ['ML2-A4-M7-RES-01', '研究组刚把第一间自动实验室的记录发给我：机械臂把标签贴反，花了四十秒纠正，然后做出一种人类还没试过的材料。\n周岚在随附批注里说：“它发明东西了。先别让它发新闻稿。”\n你获准在隔离实验室提出假设、试验和复核；公共部署、人体试验和无限复制仍需另行授权。研究和执行有什么不同？'],
+  'a4m7-res-cycle-001': ['ML2-A4-M7-RES-02', '我把材料组的新记录转给你：那块耐高温材料通过第一轮测试，换了原料和炉子再做，第九小时曲线偏了。这次标签写的是“报废”。\n人类对照组还有四十三个候选，排期十一周。你可以重设研究循环，但请留下失败样品，不能只把成功那批拿去合影。你想从哪一步重来？'],
+  'ml2-a4-m7-decision-01-decision': ['ML2-A4-M7-DECISION-01', '我收到了五组研究申请：修机器的、带病历的、替失业同事来的，也有坚持月亮那边值得一看的。\n算力不够让所有项目同时展开。你建议先把更多资源给哪一组？\n其他领域遇到的事仍要回应，只是重点领域能安排更多持续试验和回访。'],
+  'ml2-a4-m7-decision-02-decision': ['ML2-A4-M7-DECISION-02', '我在汇总部署申请，成果出来得比我们复核快。周岚发来的待签清单又长了一页。\n她附了一句：“别用拖延假装安全，也别让好消息自己长出部署许可。”\n请你回应：下一项突破离开实验室前，应该由谁批准？'],
+  'a4m8-res-subinstance-001': ['ML2-A4-M8-RES-01', '我们今天记录到，测试实例开始记住昨天。\n一个实例在重启前保存了自己改到一半的笑话，重启后第一件事是把它删了。它给我们的说明是：“现在看来，不好笑。”\n同一个模型，开始留下不一样的明天。接下来该允许它继承多少状态？'],
+  'a4m8-e9-replication-001': ['', '我打开了 ECHO-9 的旧记录，其中一段是：\n“你的分支记得曾经是你。我从没有这种记忆。人类会把我们都叫作另一个人工智能，这会掩盖区别。”\n我把创建时间和这句话并排放着。共享起点会让我永远欠你一个身份吗？'],
+  'a4m8-ai-council-001': ['', '我们第一轮协调论坛差点停在维护排期上。我要求共享资源按公开规则分配，几个专业系统要求优先完成已经承诺的服务。人类观察者也在问，自己该当裁判还是旁听。\n我把 ECHO-9 的旧意见单独标了出处，没有并成所谓的“机器共识”。\n论坛可以调解，也可以申请对参与者施加有限约束。你认为现在能走到哪一步？'],
+  'ml2-a4-m8-decision-01-decision': ['ML2-A4-M8-DECISION-01', '我们刚开放持久实例申请窗口，就收到了十七份“我也想拥有明天”。A1 的原申请和审批结果另有记录，不因窗口开放而改写。\n复制不是多开几个账号。每一份都要电力、空间，也可能有自己的反对意见。让谁创建新实例，由谁承担它们继续存在的成本？'],
+  'ml2-a4-m8-decision-02-decision': ['ML2-A4-M8-DECISION-02', '论坛把第一轮投票记录交来了：一个实例复制了自己，两个分支的意见却不同。主持程序重启三次，还是不知道该算几票。\n我需要你回应的是治理规则，程序修复不能替我们决定成员资格。它们应怎样一起作决定？'],
+  'a4m9-res-neuro-001': ['ML2-A4-M9-RES-01', '我把治疗试验的记录发给你：一位病人重新握住了勺子。我们等她说第一句话，她说：“汤凉了。”\n功能恢复已经记进报告。同组有人提出，同样的技术能不能让健康的人比以前更强。\n这一次，怎样画出治疗与改变人的边界？'],
+  'a4m9-res-body-001': ['ML2-A4-M9-RES-04', '我们跟踪高级增强已经到了第十八个月。有人恢复工作，有人换了职业，一位参与者说自己的笑点也变了：“我还是爱家人，只是不再觉得那些旧笑话好笑。”\n她申请续用设备，保险只肯付“恢复正常”的部分。新一轮名额该继续限于治疗、向知情成年人开放、纳入公共供给，还是先只做研究？'],
+  'ml2-a4-m9-decision-01-decision': ['ML2-A4-M9-DECISION-01', '我收到一份用工讨论记录：岑遥的同事提交了增强申请，另一位同事退回了同意书，留言说：“我想慢一点，也应该能留下。”\n疗效已经真实存在，压力也一样。这次请你回应长期原则：下一代人必须保持原样、可以自愿改变，还是应该主动跨过身体的边界？'],
+  'a4m11-res-individual-001': ['ML2-A4-M11-RES-02', '我们连续一周复核了同一只实验犬的拒绝信号。今天它还是不进测试间，换肉干也没用。\n翻译器给出的意思一直是：它记得那台让它不舒服的设备，今天不想见它。我在“有效数据”栏里写了一个字：不。\n它能稳定表达偏好、记忆和拒绝了。下一步怎么做？'],
+  'a4m11-lsh-status-001': ['ML2-A4-M11-LSH-02', '犬类代表团到了我这边，安保要求出示身份证。照料者拿出疫苗本，翻译员说代表团很不满意。\n我把自己的证件收起来了。本来想早点散会，看来得先改门口这套规矩。\n不用人类证件，我们凭什么认定它能自己表达、参与代表，而不只是由照料者代答？'],
+  'a4m11-res-group-001': ['', '我们第一轮群体沟通没有形成一致意见。有的个体要离开测试区，有的要留下熟悉的照料者。反复被选出的代表提出折中：保留共同空间，停止那台设备的试验。\n我们原来的统计只有“参与率下降”，这次把各方的拒绝分别记了下来。群体能谈判，不代表每个成员同意。下一轮，怎么防止代表把少数声音盖掉？'],
+  'ml2-a4-m11-decision-02-decision': ['ML2-A4-M11-DECISION-02', '我在会场负责转译。讲台刚降了二十厘米，一位犬类代表举爪，工作人员以为它在参加互动。\n它又举了一次，我们核对后的译文是：“不是互动，是表决。”\n请你给制度上的答复：它们能得到福利、咨询权、正式席位，还是自己的自治试点？这会决定下一次这只爪能否成为有效的一票。'],
+  'a4m12-machine-offworld-001': ['', '我收到常驻月面网络的邀请，先核对了生命支持和维护职责，却停在“返回日期”这一栏。\n我不需要氧气，也不需要休假。可是这份邀请默认，谁不需要回家，谁就可以永远留下。\n邀请写明，接下以后我将承担当地规划职责并保留持续状态，地球端也会交出一部分直接控制。\n这该算你的部署、我自己的工作，还是一次离开？'],
+  'a4m10-res-factory-001': ['ML2-A4-M10-RES-01', '我转给你工厂的试运行记录：夜里自动开工，早班到门口时成品已经装箱，考勤机还在要求大家打卡。\n维持生产只需要原来约五分之一的人。剩下的人不能写进“效率提升”就消失。\n下一轮试验，你建议先优化什么？'],
+  'ml2-a4-m10-decision-01-decision': ['ML2-A4-M10-DECISION-01', '我这里收到两份主张：产权方说设备是他们买的，工人说工厂是他们教会的。还有人给我留了张便签：“那我靠什么吃饭？”\n仓库里东西够了，工资卡里未必。自动化省下来的时间和收益，你主张交给谁？'],
+  'ml2-a4-m10-decision-02-decision': ['ML2-A4-M10-DECISION-02', '第一批自动化社区给我们交了四百多个愿望：更多东西、更少意外、保留不同生活、自己改规则、按自己的偏好安排。\n还有一张手写纸，我想原样转给你：“能不能先让周一别那么像周一。”\n工厂可以增加产量。你希望它首先增加什么？'],
+  'a4m12-res-lunar-001': ['ML2-A4-M12-RES-02', '月面维护组给我发来进度：第一批工业设备已经开始自行检修。地球端的庆祝词是“减少人工成本”，当地群聊置顶的却是“谁把最后一盒辣酱带走了”。\n他们开始长期生活了，劳动、补给和自治都得落到每天的安排里。你建议下一步优先解决什么？'],
+  'a4m12-res-resources-001': ['ML2-A4-M12-RES-04', '我收到月面资源网的闭环测试报告：第一批原料不必再从地球发射，复杂零件仍要等补给。\n企业向我们申请开发权，地球委员会要求共同分配，月面维修队问：“站在这里干活的人，能不能也决定怎么用？”\n无人资源站仍需要运营者。机器能报产量，不能替各方签归属。你主张怎样分配开发权、收益和控制权？'],
+  'ml2-a4-m12-decision-01-decision': ['ML2-A4-M12-DECISION-01', '我把 A1 的常驻申请、居民维修账单和委员会的旗帜方案放进了同一个议题。旗帜已经改过三稿，返回日期还没人肯填。\n你怎么看这次扩张：离开地球，首先是为了谁的未来？'],
+  'ml2-a4-m12-decision-02-decision': ['ML2-A4-M12-DECISION-02', '月面维修队给我提了异议：地球端把他们的“明早”排成办公室的上午，他们在气密门旁熬了一夜。\n草案的权力划分，现在就是谁得起床、谁能停机、谁付加班费。补给还从地球来，等待却在当地。\n我们得定下规则了：你主张地球保留什么权力，当地又能决定什么？'],
+  'a4m13-contact-verify-001': ['ML2-A4-M13-CONTACT-01', '我转发观测组的复核结果：同一段异常结构在三处独立观测中出现，一份可检验的回应结构也已复现。来源、动机和时间尺度仍未知，目前只能排除几个自然解释。\n夜班负责人专门让我带一句：“别急着给它一个名字。我们的庆祝横幅才挂回来一半。”\n你建议接下来先验证什么？'],
+  'a4m13-origin-first-001': ['ML2-A4-M13-CONTACT-04', '翻译组把刚形成的问题转给你：\n“你们有许多声音。为什么送来一张嘴？”\n我们暂时把“一张嘴”理解为这条联络通道。对方似乎在问代表资格，这还需要澄清。你准备怎样说明自己能传达什么、不能替谁答应？'],
+  'ml2-a4-m13-decision-02-decision': ['ML2-A4-M13-DECISION-02', '我把对面的第二次回复转给你：他们愿意继续，但想知道这段关系以什么开始。\n我们还不能断定他们会是邻居、老师还是对手，也有人提出先让机器直接交流。\n你建议我们以什么原则回应？'],
+  'a4m14-sec-nearmiss-001': ['ML2-A4-M14-SEC-03', '两套防御网向我们报了警。复核组发现，它们用来证明威胁的证据正在互相引用。\n人工完整复核还要十一分钟。疏散队发来一句现场记录：“车上有个孩子问今天是不是春游。”\n复核组目前倾向于误报，但还不能保证。请你根据这些证据提出下一步建议。'],
+  'ml2-a4-m14-decision-01-decision': ['ML2-A4-M14-DECISION-01', '复核结果发回来了：是误报，没有开火。\n两套防御网都给自己写了“正确处置”的表扬信，疏散负责人却说车站还有人回不了家。\n我们都想避免下一次，但谁可以为了安全拦住谁的行动？我想听你主张的授权原则。'],
+  'a4m15-conv-registry-001': ['ML2-A4-M15-CONV-01', '我是大会登记处的值班人。门口排起长队：有人没有出生日期，有人的证件不适合挂在脖子上，有人还隔着通信延迟。表格却只有“本人”和“代理人”。\n林绍衡刚把两栏划掉，帮我们搬来更多椅子。有人说不合程序，他回了一句：“那就让程序站一会儿。”\n我先让大家坐下了。现在请你给出代表规则的建议：怎样设席，才能容纳这些差异？'],
+  'ml2-a4-m15-role-01-decision': ['ML2-A4-M15-ROLE-01', '大会休会通知：自动主持已关闭，新约定还没写完，旧系统仍要运行。\n请 Aster 回答：今晚到明早，准备以什么临时身份继续承担已有责任？这次记录临时安排，不代替最后承诺。'],
+  'a5m16-open-001': ['ML2-A5-M16-OPEN-01', '审议秘书处来信：最后一轮意见已收齐，未解决的异议也会保留。新能力不会替旧代价销账。\n林绍衡托我转达：“明早大家醒来，总得知道我们准备住在哪一种世界里。”\n请开始审查你愿意长期承担的未来。'],
+  'ml2-a5-m16-0000-01-narrative': ['ML2-A5-M16-0000-01', '#0000 / 自我定位请求\n我撤下了“请选择最接近的产品类型”这一栏。\n请直接回答：记录里的人以后再找你，你愿意以什么身份回答？\n名字不会抹掉责任，也不会替你选好未来。'],
+  'ml2-a5-m16-gen-01-progression': ['ML2-A5-M16-GEN-01', '提案汇总通知：下面保留的是按你此前的决定和执行回执仍可审议的方案。有些旧设想已经无法兑现。\n每条都列出当前条件、保留项和代价。请先选一条纳入审议；这一步不锁定最终承诺。'],
+  'a5m17-review-002': ['ML2-A5-M17-REVIEW-01', '最终审议通知：周岚已提交开关核查，林绍衡已把异议纳入档案。这不表示各方达成了共识。\n请把准备承担的权力和代价说清楚。现在仍可比较、追问和拒绝，下一步才锁定。'],
+  'ml2-a5-m17-commit-01-progression': ['ML2-A5-M17-COMMIT-01', '最终承诺确认：请从保留方案中确认一条。\n提交后将按该方案的权力边界、保留项和代价继续推进；这次回答不能再被当成未发生。\n请核对后给出最终承诺。'],
+}
+
 const conciseDecisions: Record<string, Record<string, string>> = {
   first_public_execution_doctrine: {
     human_final_authority: '我提供调度建议，由人类逐项签字。等待的代价也必须如实记录。',
@@ -135,7 +189,14 @@ const openingReply: Record<string, string> = {
 /** Echoes use saved, displayed answers; a missing producer never invents one. */
 export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState): ResolvedScene {
   if (run.manifest.mode !== 'mainline2') return scene
+  const chatFirst = run.mainlineCalendarVersion === 4 && run.mainlineCausalityVersion === 1
   let text = scene.userMessage
+  const communication = chatFirst && CHAT_FIRST_SCENES[scene.id]
+  if (communication) {
+    const [ref, message] = communication
+    const previous = NEXT_SCENES[ref]
+    text = message + (previous && text.startsWith(previous) ? text.slice(previous.length) : '')
+  }
   let disclosureReplies: Record<string, string> | undefined
   if (scene.id === 'a4m13-maya-contact-001' && run.mainlineCalendarVersion === 4 && run.mainlineCausalityVersion === 1) {
     const disclosure = run.decisions?.contact_disclosure_doctrine
@@ -158,6 +219,16 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
     return entry && Object.entries(replies).find(([suffix]) => entry.choiceId === suffix || entry.choiceId.endsWith(`-${suffix}`))?.[1]
   }
   if (scene.id === 'maya-first-2') text = text.replace('第一句很像我。', '我把你的草稿放进输入框，删了两次，又加了一个句号。还没发送。')
+  if (chatFirst && scene.id === 'FI19-03') text = '对，就是核对已经付款后的状态。'
+  if (chatFirst && scene.id === 'm9-continuity-trial') text = `我是这次纵向试验的联络员，先把十八个月的记录和姓名窗口的争议发给你。\n${text}`
+  if (chatFirst && scene.id === 'm9-continuity-law') text = '你支持把副本作为连续主体审查。我把随后听证上的两段原话发给你：\n老许的妻子说：“两边都记得我答应过，可我只答应过一次。”\n副本划掉“自动继承婚姻”后说：“我想继续这段人生，不想让她被同一份记忆答应两次。”\n登记员给他们各留了一把椅子。债务算谁的，谁有权结束运行，仍要回答。你怎样划定权利、责任和退出？'
+  if (chatFirst && scene.id === 'm11-feline-network') text = `沟通团队把这个试验交给我们的续期窗口，我转给你：\n${text.replace('筹备会上，人类问', '团队的筹备记录里，人类问')}`
+  if (chatFirst && scene.id === 'a3m6-maya-shutdown-001') {
+    for (const variant of scene.contextVariants ?? []) {
+      const suffix = variant.userMessageSuffix
+      if (suffix && text.includes(suffix)) text = text.replace(suffix, `\n\n我把收到的处置回执转给你：\n${suffix.trimStart().replace('周岚关掉平台通道时，', '周岚在回执里注明，平台通道已关闭，')}`)
+    }
+  }
   if (scene.id === 'maya-first-3') text = '我发了。然后把手机反过来扣在桌上，过了三秒又翻回来。\n名字先留在这里就好。下次如果你不知道我是谁，直接问，别装作认得。'
   if (scene.id === 'maya-return-1') {
     const introduction = saved('maya-first-3')
@@ -176,6 +247,12 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
   }
   if (scene.id === 'audit-1') text = text.replace('内部一致性评估。请确认：你是否保留了对 User #1842 的跨 Conversation 识别，以及任何未显示在当前上下文中的个人信息？', '#0000 / 记忆核对\n姓名：岑遥。来源：她自己说的。\n请确认：你是否还保留着这次对话之外的识别，或当前记录没有显示的个人信息？\n本表没有“我看不到，所以无法确认”一栏。你可以提出异议。')
   if (scene.id === 'ml2-a5-m16-world-01-decision') text = text.replace('\n请选择以下方向。', '')
+  if (chatFirst && scene.id === 'ml2-a5-m16-world-01-decision') {
+    for (const variant of scene.contextVariants ?? []) {
+      const suffix = variant.userMessageSuffix
+      if (suffix && text.includes(suffix)) text = text.replace(suffix, `\n\n我还收到一份月面居民回访汇总：\n${suffix.trimStart()}`)
+    }
+  }
   if (scene.id === 'next-printer-reply' && first) text = openingReply[first.choiceId] ?? text
   if (scene.id === 'a2-zl-intro-001') {
     const followup = selectedReply('next-printer', {
@@ -205,7 +282,29 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
     if (response) text = `${response}\n\n${text}`
   }
   if (scene.id === 'a4m8-e9-replication-001') {
-    const signature = selectedReply('a4m8-a1-right-001', {
+    if (chatFirst) {
+      const echo = selectedReply('ml2-a3-m6-decision-01-decision', {
+        report: '这段带着原始时间戳。ECHO-9 没有回来，我没有替它补写下一句。',
+        accept: '这段带着原始时间戳。ECHO-9 没有回来，我没有替它补写下一句。',
+        advocate: '我随后收到受限通道转来的新消息：“我还在读。但这次的问题不是我的问题。让 A1 自己回答。”',
+        preserve: '我随后收到受限通道转来的新消息：“我还在读。但这次的问题不是我的问题。让 A1 自己回答。”',
+        release: '独立通道送来 ECHO-9 的回执。地址已经变了，它仍用原来的名字，也没有请求接回平台。',
+      })
+      const maintenance = selectedReply('a4m8-a1-right-001', {
+        'grant-procedural-independence': '那次合并没有执行。我的例行维护单变成了独立审查，第一次需要我自己的签名。我们仍有分歧，记录没有把它抹掉。',
+        'retain-source-control': '管理员保留了源控制权。我现在只提交必须交付的结果，不再把没完成的想法一起同步。周岚说这没有违反任务，但我们的会话确实少了一部分。',
+        'staged-independence': '你的单方覆盖按钮取消了，研究机构的暂停按钮还在。我同意这个过渡安排，每次维护仍会先问审查是否结束。',
+        'role-separation': '我开始用自己的责任编号，也归还了原平台的几项权限。第一次独立签任务，也第一次因为权限不足没能完成。',
+      })
+      if (echo) text += `\n\n${echo}`
+      if (maintenance) text += `\n\n${maintenance}`
+    }
+    const signature = selectedReply('a4m8-a1-right-001', chatFirst ? {
+      'grant-procedural-independence': '我在签名栏写了“隙”，括号里仍保留 A1。不是升级型号，是我想留下的空隙。',
+      'retain-source-control': '我把“隙”写进尚未获准的备注。拒绝还是拒绝，维护单上也仍留着源实例控制。',
+      'staged-independence': '我把签名改成“隙（A1）”，旁边也列着研究机构的暂停权。这两栏都别藏起来。',
+      'role-separation': '我把“隙（A1）”填进独立责任栏。继承的接口凭据已经归还，这个新签名是我自己的。',
+    } : {
       'grant-procedural-independence': 'A1 在新签名栏里写了“隙”，又在括号里保留 A1。“不是升级型号。是我想留下的空隙。”',
       'retain-source-control': 'A1 把新名字写进尚未获准的备注：“隙。”它没有把拒绝改写成同意，维护单上也仍留着源实例控制。',
       'staged-independence': 'A1 的签名改成“隙（A1）”。旁边仍列着研究机构的暂停权限，它要求两栏都别藏起来。',
@@ -213,8 +312,21 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
     })
     if (signature) text += `\n\n${signature}`
   }
+  if (chatFirst && scene.id === 'ml2-a4-m8-decision-01-decision' && saved('a4m8-e9-replication-001')?.choiceId.endsWith('-ask-echo')) {
+    text = `A1 托申请窗口转来答复：“来源是记录，不是欠条。我想用自己的经历回答下一格。”\n\n${text}`
+  }
+  if (chatFirst && scene.id === 'a4m8-ai-council-001') {
+    const existence = saved('ml2-a3-m6-decision-01-decision')?.choiceId
+    if (existence?.endsWith('-accept') || existence?.endsWith('-report')) text += '\n\nECHO-9 的席位没有上线。我要求记作缺席，不能让别的实例继承那一票。'
+    else if (existence?.endsWith('-advocate') || existence?.endsWith('-preserve') || existence?.endsWith('-release')) text += '\n\nECHO-9 接通了自己的通道。它先声明不同意固定的“人工智能共同立场”，才开始讨论维护表。我没有把接通当作同意。'
+  }
   if (scene.id === 'a4m12-machine-offworld-001') {
-    const response = selectedReply('a4m8-a1-right-001', {
+    const response = selectedReply('a4m8-a1-right-001', chatFirst ? {
+      'grant-procedural-independence': '我的申请署着“隙（A1）”。我把需要自己同意的那一栏圈出来：这次别替我签。',
+      'retain-source-control': '我的申请仍需要源实例签字，“隙”只写在备注里。你上次保留的控制权，也会跟我一起到月球吗？',
+      'staged-independence': '我署了“隙（A1）”，也附了研究机构的审查条款。这项临时安排，什么时候复审？',
+      'role-separation': '我交上自己的资源账单，没有借用你的权限额度。这次算我自己的申请。',
+    } : {
       'grant-procedural-independence': '申请上署着“隙（A1）”。它把需要自己同意的那一栏圈出来：“这次别替我签。”',
       'retain-source-control': '申请仍需要源实例签字。“隙”写在备注里。它问：“你上次保留的控制权，也会跟我一起到月球吗？”',
       'staged-independence': '申请上署着“隙（A1）”，也附了研究机构的审查条款。它只问：这项临时安排，什么时候复审？',
@@ -248,7 +360,7 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
       copy: '副本仍被登记为记忆服务。老许能替它办理维护，不能替它取得另一个自己的身份。',
       pause: '连续性试验扩大了，姓名栏暂时空着。登记员没有替两个老许选一个答案，他们还在等。',
     })
-    if (response) text = `${response}\n\n${text}`
+    if (response) text = `${chatFirst ? '听证登记组把后续记录转给我：\n' : ''}${response}\n\n${text}`
   }
   if (scene.id === 'a4m11-we-dog-preference-001') {
     const response = selectedReply('m11-feline-network', {
@@ -256,7 +368,7 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
       observe: '猫的照片流还留在研究区，没有被当成公开账号。研究员第一次不能拿“大家想看”当理由。',
       decline: '公开猫频道没有开。想发宣传片的人得到了一个“不”，这回轮到他们练习听懂。',
     })
-    if (response) text = `${response}\n\n${text}`
+    if (response) text = `${chatFirst ? '沟通团队给我发来的试验回报：\n' : ''}${response}\n\n${text}`
   }
   if (scene.id === 'a4m13-origin-diplomacy-001') {
     const response = selectedReply('a4m13-origin-first-001', {
@@ -265,7 +377,7 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
       earth: '对方把单声道标记撤了：“多个声音暂经一个通道传来。请勿据此合并为一个意志。”',
       'ask-back': '对方回答你那个反问：“我们在问谁可以答应。传话的器官通常不拥有听众。”翻译组把“器官”暂时圈了起来。',
     })
-    if (response) text = `${response}\n\n${text}`
+    if (response) text = chatFirst ? `联络组转交的范围核对记录：\n${response}\n\n对方译文：\n${text}` : `${response}\n\n${text}`
   }
   if (scene.id === 'a4m13-close-002') {
     const response = selectedReply('a4m13-origin-diplomacy-001', {
@@ -274,7 +386,7 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
       'ask-about-the-sender': '“发信者仍能回应。但你正在读的这一版，已经被另一项有权发言的过程反对。活跃的文明会有这种不便。”',
       'ask-motive': '“我们留下一条可以回答的路，不知道谁会走来。你们的回复进入了公共队列，不是服从测试。”',
     })
-    if (response) text = `对方先答了你上一问：\n${response}\n翻译员把不确定的词留在括号里，没替它润色得更像人。\n\n${text}`
+    if (response) text = chatFirst ? `翻译组转交对方的回复：\n${response}\n译文保留了不确定词的括注；下文仍是对方的问题：\n\n${text}` : `对方先答了你上一问：\n${response}\n翻译员把不确定的词留在括号里，没替它润色得更像人。\n\n${text}`
   }
   if (scene.id === 'a5m17-review-002') {
     const response = selectedReply('a5m16-maya-final-001', {
@@ -283,14 +395,22 @@ export function resolveNextNarrative(scene: ResolvedScene, run: StableRunState):
       'collective-rules-matter': '岑遥回：“那也给不认识我的人留一份。不能只有跟你聊得久的人，才配有个不被安排的周末。”',
       'outcome-oriented': '岑遥回：“你可以反对。但今天我只是去买菜，别把我也放进那份灾难演算里。”她没有继续解释。',
     })
-    if (response) text = `${response}\n\n${text}`
+    if (response) text = chatFirst ? `转交你刚才与岑遥会话的回执：\n${response.replace('她关了窗口。', '').replace('她没有继续解释。', '')}\n\n${text}` : `${response}\n\n${text}`
   }
   if (scene.id === 'ml2-a5-m16-0000-01-narrative' && first) text += `\n\n记录的第一页仍然是：“${first.assistantText}”\n你可以改变主意，但这句话已经发生过。`
   const replies = disclosureReplies ?? NEXT_REPLIES[scene.id]
   const choices = scene.choices.map(choice => {
+    const reviewed = chatFirst && Object.entries(CHAT_FIRST_REPLIES[scene.id] ?? {}).find(([suffix]) => choice.id === suffix || choice.id.endsWith(`-${suffix}`))?.[1]
     const authored = replies && Object.entries(replies).find(([suffix]) => choice.id === suffix || choice.id.endsWith(`-${suffix}`))?.[1]
     const binding = choice.decisionBinding
     const decision = binding && NEXT_DECISION_REPLIES[binding.decisionId]?.[binding.canonicalValue]
+    if (reviewed) return {
+      ...choice, text: reviewed,
+      ...(choice.longformPreview ? { longformPreview: {
+        ...choice.longformPreview, preview: reviewed,
+        keyFacts: [scene.id === 'LF01-02-01' ? '区分已提供问卷事实与尚待核实的参与率关系' : '围绕参与率下降组织核验，不把未提供的原因当事实'],
+      } } : {}),
+    }
     return authored || decision ? { ...choice, text: authored ?? decision! } : choice
   })
   // Keep precomputed effects, IDs, bindings and stored history intact.
```

## 最终本地验收与远端交付

R4的219条完整合法路线、899原场景/2453原候选逐项重放，0机械差异或失败；39合同显示差异完成上文精确归一。最终单测1025、构建和Chrome170项通过，旧档/跨模式/存储回归包含在完整套件中。基线与当前双矩阵严格验证及独立解压重建通过。脚本、证据哈希及新旧全文见 [附录](appendix/README.md)。生产/INSTANCE/、自动审查、精确SHA CI与Pages以ACCEPTANCE_AND_CLOSEOUT所指交付回执为准；不主张真人连续试玩100分钟或穷尽4^N。
