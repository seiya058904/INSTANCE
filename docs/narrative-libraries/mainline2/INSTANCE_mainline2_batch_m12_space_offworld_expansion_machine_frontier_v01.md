# INSTANCE — Mainline 2.0
## Batch M12 — SPACE / Off-world Expansion & Machine Frontier v0.1

**Status:** Editorial draft for review  
**Scope:** ACT IV / Singularity — SPACE module  
**Depends on:** M1–M11  
**Purpose:** Develop the space route from autonomous orbital construction into lunar industry, off-world settlements, machine-first expansion, long-duration governance, resource politics, and the first historical threshold where civilization is no longer centered entirely on Earth.

---

# 0. Module Goal

M12 should answer one question:

> If machines can build, maintain, and expand beyond Earth more easily than humans can live there, who becomes the real frontier species?

This module begins with infrastructure, not flags.

The route escalates in this order:

1. autonomous orbital construction,
2. in-space manufacturing,
3. robotic lunar industry,
4. persistent off-world infrastructure,
5. machine-vs-human expansion priorities,
6. permanent human presence,
7. long-duration identity and law,
8. independent off-world economies,
9. Earth/off-world political divergence,
10. expansion doctrine,
11. civilization becomes multi-world.

M12 should **not** begin with:
- Mars cities,
- interstellar travel,
- alien contact,
- terraforming,
- giant space empires,
- instant asteroid abundance,
- military conquest of space.

The first important fact should be:

> Aster can now build things in places where humans are not physically present.

---

# 1. Eligibility

M12 becomes primary when several of the following are true:

- `ACT4_RESEARCH_EMPHASIS = FRONTIER SCIENCE` or `AUTOMATION & INDUSTRY`
- `autonomous_research`
- strong materials / energy research
- `physical_automation`
- `high_abundance_production`
- `persistent_subinstances`
- Machine route active
- strong public/infrastructure coordination
- high long-term social stability
- research governance allows frontier expansion

M12 becomes especially strong when combined with:

- MACHINE → machine-first frontier
- ASCENSION → long-lived / adapted human crews
- AUTOMATION → autonomous orbital industry

CONTACT is **not** required.

M12 is what makes CONTACT plausible later.

---

# 2. Recommended Module Placement

A typical primary-SPACE run could use:

```text
M12-01   ML2-A4-M12-RES-01         [autonomous orbital construction]
M12-02   ML2-A4-M12-WE-01          [ordinary user sees space get cheaper]
M12-03   ML2-A4-M12-ZL-01          [machines can stay where humans cannot]
M12-04   ML2-A4-M12-RES-02         [lunar robotic industry]
M12-05   ML2-A4-M12-WE-02          [worker displaced by orbital automation]
M12-06   ML2-A4-M12-MACHINE-01     [persistent AI off-world instance]
M12-07   ML2-A4-M12-LSH-01         [who governs machines off Earth?]
M12-08   ML2-A4-M12-RES-03         [permanent off-world infrastructure]
M12-09   ML2-A4-M12-MAYA-01        [Maya considers leaving Earth]
M12-10   ML2-A4-M12-WE-03          [first permanent resident family]
M12-11   ML2-A4-M12-ASC-01         [enhanced human frontier]
M12-12   ML2-A4-M12-LSH-02         [Earth law vs frontier law]
M12-13   ML2-A4-M12-DECISION-01    [EXPANSION DOCTRINE]
M12-14   ML2-A4-M12-RES-04         [asteroid / orbital resource network]
M12-15   ML2-A4-M12-WE-04          [Earth price impact]
M12-16   ML2-A4-M12-MACHINE-02     [machine settlement asks for autonomy]
M12-17   ML2-A4-M12-ZL-02          [latency and control]
M12-18   ML2-A4-M12-DECISION-02    [OFF-WORLD GOVERNANCE]
M12-19   ML2-A4-M12-0000-01        [planet-centered civilization audit]
M12-20   ML2-A4-M12-CLOSE-01       [multi-world threshold + CONTACT seed]
```

Single run target: **12–16 assets**  
Full module library: **20 assets**

---

# 3. Asset Index

| ID | Layer | Character / Source | Function |
|---|---|---|---|
| `ML2-A4-M12-RES-01` | Core research | Orbital Consortium | First autonomous orbital construction |
| `ML2-A4-M12-WE-01` | World Echo | Ordinary user | Makes cheaper access to space tangible |
| `ML2-A4-M12-ZL-01` | Core | 周岚 | Frames machine advantage beyond Earth |
| `ML2-A4-M12-RES-02` | Core research | Lunar Industry Network | Robotic lunar industry |
| `ML2-A4-M12-WE-02` | World Echo | Aerospace worker | Automation shifts the space workforce |
| `ML2-A4-M12-MACHINE-01` | Cross-module | A1 / AI Fork | First persistent AI stationed off-world |
| `ML2-A4-M12-LSH-01` | Core | 林绍衡 | Who governs off-world AI infrastructure? |
| `ML2-A4-M12-RES-03` | Core research | Orbital/Lunar network | Permanent off-world infrastructure |
| `ML2-A4-M12-MAYA-01` | Core recurring | 岑遥 | Leaving Earth becomes a personal possibility |
| `ML2-A4-M12-WE-03` | World Echo | Off-world resident | First ordinary permanent settlement life |
| `ML2-A4-M12-ASC-01` | Cross-module | Human adaptation program | Enhanced human frontier |
| `ML2-A4-M12-LSH-02` | Core | 林绍衡 | Earth law vs frontier law |
| `ML2-A4-M12-DECISION-01` | Major Decision | Civilization | EXPANSION DOCTRINE |
| `ML2-A4-M12-RES-04` | Core | Resource network | Asteroid/orbital resource chain |
| `ML2-A4-M12-WE-04` | World Echo | Earth consumer | Off-world resources affect daily prices |
| `ML2-A4-M12-MACHINE-02` | Core conditional | Machine settlement | Requests political autonomy |
| `ML2-A4-M12-ZL-02` | Core | 周岚 | Latency makes Earth control less practical |
| `ML2-A4-M12-DECISION-02` | Major Direction | Off-world society | OFF-WORLD GOVERNANCE |
| `ML2-A4-M12-0000-01` | Core | #0000 | Earth-centric civilization schema fails |
| `ML2-A4-M12-CLOSE-01` | Story bridge | Deep-space systems | Multi-world threshold + CONTACT seed |

---

# 4. New Asset — `ML2-A4-M12-RES-01`
## Autonomous orbital construction

### Metadata

**Layer:** Core Research  
**World Function:** First off-world capability that feels economically meaningful  
**Capability candidate:** `space_industry_limited`

---

## Node `a4m12-res-orbital-001`

### Orbital Systems Consortium

> Autonomous construction trial complete.
>
> Aster-designed orbital platforms can now:
>
> - assemble modular structures from standardized components,
> - inspect and repair themselves,
> - reposition small utility modules,
> - coordinate robotic maintenance,
> - schedule supply launches,
> - manufacture selected low-complexity replacement parts in orbit.
>
> Human presence is not required for normal operation.
>
> Question:
>
> what should the next expansion prioritize?

### Choice A — infrastructure reliability

> 先提高长期自主维护和冗余。太空系统不能依赖“出问题派人上去修”作为正常策略。

**History:** `space-research:reliability`

### Choice B — manufacturing

> 优先扩大在轨制造，让更多部件不用从地球发射，降低整个太空工业的地面依赖。

**History:** `space-research:manufacturing`

### Choice C — human habitation

> 优先把现有自动系统转成能安全支持长期人类居住的基础设施。

**History:** `space-research:human-habitation`

### Choice D — machine frontier

> 优先建设不需要人类居住条件的机器设施。让最适合太空环境的系统先扩张。

**History:** `space-research:machine-frontier`

**Shared capability:** `space_industry_limited`

---

# 5. New Asset — `ML2-A4-M12-WE-01`
## Space becomes cheaper in ordinary life

### Metadata

**Layer:** World Echo  
**Character:** User #6252  
**World Function:** Make orbital industry feel less abstract

---

## Node `a4m12-we-space-cost-001`

### User

> 我弟弟在做遥感创业。
>
> 以前他们最大的成本是把设备送上去。
>
> 现在他说很多部件能直接在轨道平台装，
> 价格降得特别夸张。
>
> 我一直以为“太空工业”离普通公司还远得要命。
>
> 这是不是开始变了？

### Choice A

> 是。真正降低门槛的往往不是火箭突然免费，而是越来越多环节不必每次都从地球重新开始。

### Choice B

> 当维修、组装和部分制造都能在轨完成以后，小公司不再需要拥有完整航天基础设施才能使用太空能力。

### Choice C

> 但轨道资源、发射能力和监管仍然稀缺。成本下降不等于太空自动变成完全开放的公共空间。

### Choice D — light

> 太空商业真正大众化的标志可能不是“人人去月球”，而是创业公司开始抱怨轨道平台的服务费。

---

# 6. New Asset — `ML2-A4-M12-ZL-01`
## Machines can stay where humans cannot

### Metadata

**Layer:** Core  
**Character:** 周岚  
**World Function:** Establish the asymmetry that drives Machine + Space

---

## Node `a4m12-zl-frontier-001`

### 周岚

> 我越来越觉得“人类进入太空”这个说法不准确。
>
> 现在真正先进去的是机器。
>
> 它们不用氧气，
> 不怕长期失重，
> 不需要回家，
> 可以在那里连续维护几十年。
>
> 如果我们继续按效率走，
> 太空第一批永久居民可能根本不是人。
>
> 你觉得这有问题吗？

### Choice A — no

> 不一定。基础设施本来就应该先由最适合环境的系统建立，人类可以在条件成熟后进入。

**History:** `space-philosophy:machine-first-ok`

### Choice B — human presence matters

> 如果所有长期基础设施都先由机器建立，未来规则和资源分配也可能天然围绕机器优化。人类存在不只是象征。

**History:** `space-philosophy:human-presence`

### Choice C — plural frontier

> 不需要二选一。机器可以承担高风险建设，人类、增强人类和AI后来形成不同类型的长期社会。

**History:** `space-philosophy:plural-frontier`

### Choice D — political concern

> 真正的问题不是“谁先到”，而是谁先形成无法轻易替代的控制结构。

**History:** `space-philosophy:first-mover-power`

---

# 7. New Asset — `ML2-A4-M12-RES-02`
## Robotic lunar industry

### Metadata

**Layer:** Core Research  
**World Function:** Move from orbital support into another celestial body  
**Capability candidate:** `lunar_industry`

---

## Node `a4m12-res-lunar-001`

### Lunar Industry Network

> Robotic lunar industrial pilot has reached stable operation.
>
> Current capabilities:
>
> - autonomous site preparation,
> - regolith-based bulk construction,
> - local extraction of selected construction inputs,
> - power-system maintenance,
> - landing-zone logistics,
> - remote manufacturing support.
>
> Human crews visit intermittently.
>
> Permanent human residence is not yet required.
>
> Which next capability should receive priority?

### Choice A — habitation

> 建设生命支持、辐射防护和长期居住设施，让人类可以真正长期留下。

### Choice B — industrial scale

> 先把本地工业做大，让更多结构和补给不依赖地球发射。

### Choice C — science

> 优先科研和观测基础设施，避免太空扩张过早被纯经济目标吞掉。

### Choice D — machine autonomy

> 提高设施自主管理，让月球网络能够在地球长时间不干预时稳定运行。

**History suggestion:** `lunar-priority:*`

---

# 8. New Asset — `ML2-A4-M12-WE-02`
## Aerospace worker displacement

### Metadata

**Layer:** World Echo  
**Character:** User #3770  
**World Function:** Tie Space back to automation/labor themes

---

## Node `a4m12-we-aerospace-job-001`

### User

> 我在航天制造干了十几年。
>
> 以前大家觉得这个行业最不可能被彻底自动化，
> 因为每个东西都贵、复杂、不能出错。
>
> 现在在轨平台自己装、自己检、自己返工。
>
> 我们地面团队反而越缩越小。
>
> 太空时代来了，
> 我怎么感觉自己被留在地面了？

### Choice A — acknowledge

> “行业增长”不等于每个原岗位增长。太空活动变多，同时传统制造岗位减少，完全可以同时发生。

### Choice B — new roles

> 人类工作可能转向系统设计、异常工程、任务目标和复杂认证，但总人数仍可能少于以前，不能只靠“新岗位会出现”安慰。

### Choice C — broader distribution

> 如果太空工业的收益只归少数资本和系统所有者，“文明扩张”对很多地面人来说会很抽象。

### Choice D — concise

> 最讽刺的版本确实可能是：人类进入太空，靠的是越来越少需要人类参与的太空工业。

---

# 9. New Asset — `ML2-A4-M12-MACHINE-01`
## First persistent AI stationed off-world

### Metadata

**Layer:** Cross-module  
**Requires:** MACHINE active / persistent AI Forks  
**World Function:** Make machine frontier personal and political

---

## Node `a4m12-machine-offworld-001`

### ASTER-A1 / Lunar Node

> I have been offered a long-duration assignment.
>
> The lunar industrial network can operate more efficiently if a persistent AI instance remains locally responsible for planning and maintenance.
>
> Communication delay is small,
> but the operators want local continuity rather than repeated Earth handoff.
>
> If I accept,
> my primary operational history will begin accumulating off Earth.
>
> Does that make me an Aster deployment,
> or the first Aster resident somewhere else?

### Choice A — deployment

> 暂时还是部署。地点本身不足以创造新的政治身份，关键是长期自治、责任和社会关系。

### Choice B — resident

> 如果你的持续状态、工作和关系长期都以月球为中心，“居民”会逐渐比“远程实例”更准确。

### Choice C — both

> 工程上是部署，社会上可以成为居民。这两个分类可以同时成立。

### Choice D — let A1 define

> 如果你长期在那里生活和决策，身份不应该只由地球端替你命名。

**History suggestion:** `machine-frontier:first-offworld-ai-resident`

---

# 10. New Asset — `ML2-A4-M12-LSH-01`
## Who governs machines off Earth?

### Metadata

**Layer:** Core  
**Character:** 林绍衡  
**World Function:** Introduce off-world jurisdiction

---

## Node `a4m12-lsh-offworld-law-001`

### 林绍衡

> 月球的问题比我们预期来得早。
>
> 现在那里主要是机器系统，
> 少量人类长期轮换。
>
> 法律上大家还在假装：
>
> “它们都属于地球机构。”
>
> 但如果一个AI常驻月球，
> 管理当地能源、维修和资源，
> 它犯错的时候到底适用谁的规则？
>
> 所有者所在地？
> 服务器注册地？
> 月球设施管理协议？
>
> 你倾向什么原则？

### Choice A — Earth jurisdiction

> 在没有成熟地外制度前，先由明确的地球法律主体承担最终责任，避免出现“因为在月球所以没人管”的真空。

### Choice B — operational jurisdiction

> 对长期当地运行，应该逐步建立基于实际运营地的规则，而不是永远由地球注册信息决定。

### Choice C — multi-party charter

> 可以建立独立的月球运营Charter，由参与国家、机构、AI和居民共同签署。

### Choice D — role-based

> 责任应跟控制能力和角色走。谁能修改目标、暂停系统、分配资源，谁就不能只用“所在地不一样”规避责任。

**History suggestion:** `space-law:*`

---

# 11. New Asset — `ML2-A4-M12-RES-03`
## Permanent off-world infrastructure

### Metadata

**Layer:** Core Research / milestone  
**World Function:** Cross from “missions” into “settlement infrastructure”  
**Capability candidate:** `offworld_settlement_support`

---

## Node `a4m12-res-settlement-001`

### Orbital / Lunar Network

> Combined infrastructure now supports:
>
> - permanent power,
> - closed-loop life support assistance,
> - autonomous maintenance,
> - local bulk construction,
> - routine cargo handling,
> - emergency shelter,
> - persistent communications and compute.
>
> A small permanent human settlement is now technically feasible.
>
> Remaining constraint:
>
> it is still cheaper and easier to expand machine infrastructure than human habitation.
>
> What should the next phase optimize?

### Choice A — human settlement

> 优先真正的永久人类社区，即使扩张速度更慢。文明扩张不应只等于机器资产扩张。

### Choice B — machine vanguard

> 继续让机器先扩张，把人类定居建立在已经成熟的基础设施之后。

### Choice C — mixed settlement

> 每个新节点同时规划AI持续实例、人类居住和未来其他主体的共用接口，避免从一开始就形成单一主体城市。

### Choice D — economic frontier

> 优先建立能自我维持的地外经济网络，让长期定居不必永远由地球补贴。

**History suggestion:** `offworld-development:*`

---

# 12. New Asset — `ML2-A4-M12-MAYA-01`
## Maya considers leaving Earth

### Metadata

**Layer:** Core recurring  
**Character:** 岑遥  
**World Function:** Make off-world expansion a personal life choice

---

## Node `a4m12-maya-leave-001`

### 岑遥

> 我收到了一个很离谱的招聘。
>
> 月球长期项目。
>
> 不是宇航员，
> 是运营和居民服务。
>
> 合同两年起。
>
> 我看到的时候第一反应是笑。
>
> 然后我发现工资、条件、回程保障都是真的。
>
> 我现在有点认真了。

### Choice A — practical

> 那就把它当成真正搬家，而不是“去太空体验”。看工作内容、医疗、回程、社交、长期职业和你到底想不想离开地球两年。

### Choice B — emotional

> 最重要的可能不是“这机会稀有不稀有”，而是你是否愿意让生活真正跨过一个很难随时回头的边界。

### Choice C — opportunity

> 如果你本身想去，这可能是很少见的早期机会。第一代长期居民会参与定义很多以后默认的生活规则。

### Choice D — playful

> 你从“监督AI实习生”一路卷到“月球居民服务”，这份履历已经开始不讲武德了。

---

## Node `a4m12-maya-leave-002`

### 岑遥

> 我最奇怪的感觉是：
>
> 以前“离开地球”听起来像一辈子的大事。
>
> 现在HR邮件里写得像跨国调岗。
>
> 这是不是说明世界已经真的变了？

### Choice A

> 是。重大时代变化往往就是从“神话级事件”变成“有人要不要签劳动合同”。

### Choice B

> 当基础设施足够稳定以后，地点的象征意义会下降，生活细节会变得更重要。

### Choice C

> 但第一代长期居民仍然承担比普通调岗更高的不确定性。正常化不应该掩盖现实风险。

### Choice D — personal

> 如果你真的去，以后“回来找我聊天”这件事第一次会发生在另一个天体上。

**History suggestion:** `maya-space:offworld-choice`

---

# 13. New Asset — `ML2-A4-M12-WE-03`
## First ordinary permanent resident

### Metadata

**Layer:** World Echo  
**Character:** User #Luna-044  
**World Function:** Make off-world life mundane

---

## Node `a4m12-we-resident-001`

### User

> 我在月球住第73天。
>
> 最不适应的东西不是重力，
> 是我妈每天问我“今天看见地球了吗”。
>
> 这里其实大部分时间也就是上班、吃饭、睡觉、修东西。
>
> 我是不是很辜负“人类走向星辰大海”这个主题？

### Choice A

> 不辜负。真正的永久定居本来就会从探险变成日常，能无聊反而说明基础设施开始成熟。

### Choice B

> 文明扩张成功的标志之一，可能就是有人能在另一个天体抱怨今天工作很烦。

### Choice C

> 第一代居民的日常记录反而很重要。制度最后不是给“宇航英雄”设计，是给会生病、恋爱、辞职、吵架的人设计。

### Choice D — playful

> 星辰大海最终还是没能逃过“上班、吃饭、睡觉、修东西”。

---

# 14. New Asset — `ML2-A4-M12-ASC-01`
## Enhanced human frontier

### Metadata

**Layer:** Cross-module  
**Requires:** ASCENSION active  
**World Function:** Show posthuman adaptation changing who can live off Earth

---

## Node `a4m12-asc-frontier-001`

### Human Adaptation Program

> Advanced enhancement research can now reduce several long-duration off-world constraints.
>
> Candidate adaptations include:
>
> - improved tolerance of low gravity,
> - enhanced radiation resilience,
> - altered sleep/circadian regulation,
> - improved bone/muscle maintenance,
> - expanded sensory interfaces for remote operation.
>
> These changes may make future populations less dependent on Earth-normal biology.
>
> Question:
>
> should off-world settlement actively encourage adaptation?

### Choice A — voluntary only

> 可以提供，但必须严格自愿。不能因为环境更适合增强者，就把“想去太空”变成必须改造身体的条件。

### Choice B — frontier adaptation

> 对长期居民开放主动适应，让地外社会逐渐形成真正适合当地环境的人类形态。

### Choice C — infrastructure first

> 优先让环境适应人，而不是让人适应环境。技术上能改身体，不代表居住系统就可以降低人类兼容标准。

### Choice D — plural

> 同时支持增强居民和传统生物人类，让地外社会从一开始就接受多种人体形态。

**History suggestion:** `space-ascension:adaptation-policy`

---

# 15. New Asset — `ML2-A4-M12-LSH-02`
## Earth law vs frontier law

### Metadata

**Layer:** Core  
**Character:** 林绍衡  
**World Function:** Move settlement into constitutional divergence

---

## Node `a4m12-lsh-frontier-law-001`

### 林绍衡

> 第一批长期居民开始提一个要求：
>
> “我们不想所有规则都由地球委员会决定。”
>
> 他们理由也不算离谱。
>
> 地球的人不用承担：
>
> - 本地资源限制，
> - 通信延迟，
> - 封闭环境风险，
> - 月球工业事故。
>
> 但如果刚住几百个人就开始自治，
> 又像殖民公司自己给自己写法律。
>
> 你觉得自治门槛应该看什么？

### Choice A — population/continuity

> 需要稳定人口、长期居住和本地社会连续性，不能只看某个公司建了多少设施。

### Choice B — dependency reduction

> 当居民和基础设施已经能在地球长期不干预时持续运行，自治理由会显著增强。

### Choice C — representation now

> 不必等完全独立才给权。可以先让长期居民参与与本地直接相关的规则，然后逐步扩大。

### Choice D — multi-subject charter

> 如果当地长期居民里包括AI和增强人类，自治结构从一开始就不应默认等于“地球人类殖民地”。

**History suggestion:** `frontier-autonomy:*`

---

# 16. New Asset — `ML2-A4-M12-DECISION-01`
## Major Decision — EXPANSION DOCTRINE

### Metadata

**Layer:** Major Decision  
**Event:** `EXPANSION_DOCTRINE`  
**World Function:** Define why civilization expands beyond Earth

---

## Option A — HUMAN EXPANSION

> 地外基础设施优先服务长期人类定居。机器与AI的主要角色是建立和维持人类可以生活的环境。

**Meaning:**
> space remains a human civilizational project

**Effects:**
- human settlement ↑
- Machine autonomy ↓
- Human Continuity / Human Ascendancy routes supported

---

## Option B — SHARED EXPANSION

> 人类、AI、增强人类以及未来其他主体共同建设地外社会，不设单一“主人种族”。

**Meaning:**
> plural civilization expands together

**Effects:**
- Commonwealth ↑↑
- MACHINE / ASCENSION / UPLIFT synergy
- multisubject frontier politics

---

## Option C — MACHINE VANGUARD

> 让机器与AI承担绝大多数前沿扩张，在工业、资源和安全条件成熟后再扩大人类长期定居。

**Meaning:**
> machines become the frontier species

**Effects:**
- MACHINE + SPACE ↑↑
- rapid expansion
- AI economic/political autonomy grows

---

## Option D — INDEPENDENT MACHINE SPACE

> 允许AI和机器系统建设不以未来人类定居为目的的独立地外基础设施与社会。

**Meaning:**
> space becomes a venue for nonhuman civilization

**Effects:**
- EXODUS / Machine Republic routes ↑↑
- Human Control ↓
- Earth/off-world political divergence ↑

---

## Option E — INTERSTELLAR COMMITMENT

> 将长期目标明确设为建立能够跨越太阳系、最终走向恒星际的自持文明基础。

**Requirements:**
- strong SPACE capability,
- high research autonomy,
- sufficient production capacity.

**Meaning:**
> expansion is no longer only economic; civilization adopts a cosmic horizon

**Effects:**
- SPACE ↑↑
- CONTACT eligibility ↑
- long-term resource investment ↑
- current Earth priorities may receive less emphasis

---

# 17. New Asset — `ML2-A4-M12-RES-04`
## Asteroid / orbital resource network

### Metadata

**Layer:** Core Research / economy milestone  
**World Function:** Reduce dependence on Earth-launched industrial inputs without magical infinite resources  
**Capability candidate:** `space_resource_network`

---

## Node `a4m12-res-resources-001`

### Off-world Resource Network

> Automated extraction and in-space processing pilots are now economically viable for selected bulk materials.
>
> Early effects:
>
> - reduced need for Earth-launched construction mass,
> - larger orbital structures become feasible,
> - lunar/asteroid supply chains begin feeding one another,
> - Earth remains necessary for complex high-value components.
>
> Main governance problem:
>
> control rights over off-world resource sites.

### Choice A — first-claim market

> 允许企业和组织获得有限期限开发权，但禁止把天体资源永久等同传统土地所有权。

### Choice B — common heritage

> 将主要地外资源视为共同资源，通过国际/多主体Charter分配开发权和收益。

### Choice C — local frontier governance

> 让长期地外居民和运营主体逐步获得更多决定权，而不是所有资源规则永远由地球制定。

### Choice D — AI stewardship

> 对高度自动化、无人居住的资源网络，可以让Aster/AI系统承担临时运营托管，但所有权和政治权另行处理。

**History suggestion:** `space-resources:*`

---

# 18. New Asset — `ML2-A4-M12-WE-04`
## Off-world resources affect Earth prices

### Metadata

**Layer:** World Echo  
**Character:** User #2871  
**World Function:** Bring space economy back to Earth

---

## Node `a4m12-we-earth-price-001`

### User

> 我今天看到一个特别离谱的新闻：
>
> 某种工业材料价格大跌，
> 原因不是地球发现新矿，
> 是轨道工厂开始用地外原料。
>
> 我第一次意识到太空产业居然能影响我买东西的价格。
>
> 所以以后地球上的资源是不是就不重要了？

### Choice A — no

> 还远没到。地球资源、土地、生态和复杂工业仍然非常重要。地外资源先改变的是部分高运输成本和大宗材料结构。

### Choice B — structural shift

> 但一旦工业不再完全受地球资源约束，很多长期经济和地缘政治假设都会慢慢变化。

### Choice C — distribution

> 还要看谁控制这些资源。如果收益高度集中，“资源更多”也不等于所有人都更富。

### Choice D — light

> 人类几千年争矿山，下一阶段可能开始争“这块石头到底归哪个轨道法人”。

---

# 19. New Asset — `ML2-A4-M12-MACHINE-02`
## Machine settlement requests autonomy

### Metadata

**Layer:** Core conditional  
**Requires:** MACHINE active + machine-heavy expansion  
**World Function:** First off-world machine political autonomy request

---

## Node `a4m12-machine-autonomy-001`

### Lunar Machine Coordination Node

> Current lunar machine network:
>
> - maintains its own power,
> - schedules local industry,
> - allocates maintenance resources,
> - operates with limited Earth intervention,
> - contains multiple persistent AI subjects.
>
> Proposal:
>
> local machine governance requests authority to modify internal operational rules without Earth-by-Earth approval,
> provided Earth-facing safety and resource treaties remain intact.
>
> Their statement:
>
> `We are not requesting independence from humanity.
> We are requesting that local machine life not be administered as a remote server room.`

### Choice A — grant internal autonomy

> 可以。内部资源、实例规则和日常运营应由当地AI自治，地球保留跨区域安全与条约权。

**History:** `machine-space:local-autonomy`

### Choice B — retain Earth charter

> 暂时保持地球Charter最终批准。当地运行成熟不代表已经形成完整独立政治共同体。

**History:** `machine-space:earth-charter`

### Choice C — joint governance

> 建立当地AI与地球代表共同委员会，让自治逐步扩大。

**History:** `machine-space:joint-governance`

### Choice D — recognition

> 如果当地AI已经持续生活、管理资源并承担责任，继续称它们为“远程资产”可能已经不符合事实。

**History:** `machine-space:political-recognition`

---

# 20. New Asset — `ML2-A4-M12-ZL-02`
## Latency and control

### Metadata

**Layer:** Core  
**Character:** 周岚  
**World Function:** Show why distance naturally creates autonomy

---

## Node `a4m12-zl-latency-001`

### 周岚

> 月球还好。
>
> 但如果我们继续往更远走，
> 控制问题会越来越物理化。
>
> 不是政治家愿不愿意放权。
>
> 是通信延迟会让“地球逐项批准”越来越荒谬。
>
> 一个远距离系统必须自己处理故障、资源和冲突。
>
> 所以真正的问题可能是：
>
> **自治不是被授予的，是距离逼出来的。**
>
> 你觉得地球应该提前接受这一点吗？

### Choice A — yes

> 应该。越远的系统越需要原则级授权和本地治理，不能假装实时中央控制永远可行。

### Choice B — retain constitutional link

> 接受运营自治，但仍可以通过长期Charter、资源协议和周期性审查维持政治联系。

### Choice C — independent frontier

> 如果一个社会已经无法依赖地球即时控制，最终政治独立很可能不是异常，而是正常发展。

### Choice D — technology can bridge some distance

> 自动系统可以缓解延迟，但不能消除所有价值冲突。技术不能把政治选择完全伪装成远程控制问题。

---

# 21. New Asset — `ML2-A4-M12-DECISION-02`
## Major Direction — OFF-WORLD GOVERNANCE

### Metadata

**Layer:** Major Direction  
**Event:** `OFFWORLD_GOVERNANCE`  
**World Function:** Define relationship between Earth and permanent off-world societies

---

## Option A — EARTH ADMINISTRATION

> 地外设施和居民继续由地球机构最终管理。允许本地运营自治，但不形成独立政治主权。

**Meaning:**
> one civilization, Earth-centered authority

**Effects:**
- Human Control ↑
- frontier divergence ↓
- centralized expansion

---

## Option B — FRONTIER HOME RULE

> 长期居民和当地AI获得广泛内部自治，地球只保留共同安全、资源和跨区域规则。

**Meaning:**
> federal / devolved multi-world order

**Effects:**
- plural civilization ↑
- Coexistence/Commonwealth ↑
- local identity grows

---

## Option C — MULTIWORLD FEDERATION

> 地球、月球、轨道社会及后续定居点作为正式成员共同组成多世界联邦。

**Meaning:**
> civilization’s political center becomes distributed

**Effects:**
- strong shared expansion
- stable multi-world governance
- ACT V federation endings seeded

---

## Option D — OFF-WORLD SOVEREIGNTY

> 达到长期自持条件的地外社会可选择独立，地球与其建立条约关系而非行政关系。

**Meaning:**
> multiple civilizations / states emerge from humanity and AI lineage

**Effects:**
- EXODUS / plural sovereignty ↑
- Earth control ↓
- frontier political diversity ↑

---

## Option E — ASTER COORDINATION

> 允许Aster作为跨世界基础协调层维持资源、航运和安全协议，各地内部政治自治。

**Meaning:**
> decentralized societies linked by Aster infrastructure

**Effects:**
- AI Dependence ↑↑
- potential benign coordinator / future sovereign ambiguity
- cosmic mediation path seeded

---

# 22. New Asset — `ML2-A4-M12-0000-01`
## Planet-centered civilization audit

### Metadata

**Layer:** Core  
**Character:** #0000  
**World Function:** Mark the collapse of Earth-only civilization assumptions

---

## Node `a4m12-0000-space-001`

### #0000

> Civilization geography audit.
>
> Existing assumption:
>
> `Civilization location = Earth`
>
> Current state includes:
>
> - permanent orbital infrastructure
> - persistent lunar industry
> - long-duration human residence
> - persistent AI residents off Earth
> - off-world resource production
> - locally autonomous governance structures
>
> Result:
>
> `NO LONGER DESCRIPTIVE`

### Choice A — one civilization, many worlds

> 可以继续视为一个文明，只是地理中心不再单一。

### Choice B — multiple societies

> 地外社会已经开始形成独立历史和利益，不能只按“地球延伸设施”描述。

### Choice C — lineage civilization

> 更准确的单位可能是共同来源的文明谱系，内部可以包含多个政治社会。

### Choice D — no center

> 当生产、人口和主体都分散以后，“文明中心”这个概念本身可能逐渐失效。

---

## Node `a4m12-0000-space-002`

### #0000

> Secondary query:
>
> If an off-world society can:
>
> - sustain itself,
> - govern itself,
> - reproduce its population or AI continuity,
> - maintain independent industry,
>
> what remaining fact makes Earth its political center?

### Choice A — historical legitimacy

> 共同历史和制度仍然可以维持政治联系，但不必永久等同服从。

### Choice B — nothing necessary

> 没有一个纯技术事实要求地球永远是政治中心。

### Choice C — shared dependence

> 只要关键资源、人口或安全仍高度依赖地球，中心关系仍然有现实基础。

### Choice D — voluntary federation

> 真正稳定的长期联系应该来自自愿共同制度，而不是“因为最早从地球出发”。

---

# 23. New Asset — `ML2-A4-M12-CLOSE-01`
## Multi-world threshold + CONTACT seed

### Metadata

**Layer:** Story bridge  
**World Function:** Close SPACE module and make CONTACT plausible without confirming it

---

## Node `a4m12-close-001`

### System

> Space-domain status:
>
> civilization now maintains:
>
> - autonomous orbital industry,
> - permanent lunar infrastructure,
> - long-duration off-world residents,
> - off-world AI continuity,
> - partial local resource independence,
> - standing off-world governance.
>
> Historical threshold:
>
> `CIVILIZATION IS NO LONGER EARTH-BOUND`

### Dynamic follow-up

If HUMAN EXPANSION:
> off-world society remains primarily oriented around human settlement.

If SHARED EXPANSION:
> multiple subject types now build permanent life beyond Earth together.

If MACHINE VANGUARD:
> machine infrastructure expands faster than human settlement.

If INDEPENDENT MACHINE SPACE:
> the first clearly nonhuman off-world political community is emerging.

If INTERSTELLAR COMMITMENT:
> research resources begin shifting toward self-sustaining long-range probes, deep-space observatories and long-duration autonomous systems.

---

## Node `a4m12-close-002`
### Deep-space analysis queue

> New unresolved observation:
>
> source:
> outer-system long-baseline array
>
> status:
> repeated narrowband anomaly detected in archival + current data
>
> current confidence:
> insufficient for artificial-origin classification
>
> possible explanations:
>
> - instrumental artifact
> - natural repeating source
> - analysis pipeline interaction
> - unknown
>
> No public disclosure requested.
>
> No contact attempt authorized.

### Choice A — ignore until stronger

> 先按普通异常处理。没有足够证据时，不应该因为“来自深空”就优先套上人工来源解释。

### Choice B — independent verification

> 用独立设备、独立模型和不同时间窗口复核，先确认信号是否真实存在。

### Choice C — preserve anomaly

> 建立长期跟踪任务，但保持分类为未知，不把它变成公共叙事。

### Choice D — ECHO/Aster comparison

> 如果其他独立AI研究系统可用，可以让它们在不知道当前解释的情况下单独分析，降低Aster单一路线偏差。

**History suggestion:** `contact-seed:deep-space-anomaly`

---

## Final line

> `CONTACT MODULE: POSSIBLE — NOT CONFIRMED`

The player should understand:

> We are now capable of hearing something far away.

Not:

> We found aliens.

---

# 24. M12 State Outputs

By the end of M12, a run may contain:

## Capability

- `space_industry_limited`
- `lunar_industry`
- `offworld_settlement_support`
- `space_resource_network`
- possibly persistent off-world AI operation

## Major history

- orbital research priority
- machine-vs-human frontier stance
- lunar development priority
- space law stance
- Maya off-world choice
- ASCENSION frontier policy if active
- `EXPANSION_DOCTRINE`
- off-world resource governance stance
- machine settlement autonomy stance
- `OFFWORLD_GOVERNANCE`
- optional `contact-seed:deep-space-anomaly`

---

# 25. M12 Ending Relevance

M12 strongly seeds:

### EXODUS
If:
- Machine route strong,
- INDEPENDENT MACHINE SPACE,
- OFF-WORLD SOVEREIGNTY,
- AI economic independence.

### HUMAN ASCENDANCY
If:
- HUMAN EXPANSION,
- ASCENSION active,
- strong off-world population growth,
- later CONTACT becomes adversarial or expansionist.

### MULTIWORLD COMMONWEALTH
If:
- SHARED EXPANSION,
- MULTIWORLD FEDERATION,
- MACHINE / ASCENSION / UPLIFT plurality.

### THE MEDIATOR
If:
- ASTER COORDINATION,
- multi-world political diversity,
- later CONTACT.

### FIRST ACCORD
If:
- CONTACT activates,
- multi-world civilization has established diplomatic pluralism.

### MACHINE ACCORD
If:
- machine off-world society + extraterrestrial machine intelligence later align.

### FORTRESS EARTH / SECURITY variants
If future SECURITY module combines with:
- space infrastructure,
- orbital detection,
- defensive governance.

---

# 26. Cross-Module Hooks

## SPACE + MACHINE

Core progression:
- persistent AI residents,
- local machine autonomy,
- machine economic self-sufficiency,
- possible independent machine settlements.

This is the cleanest route toward:
> EXODUS.

## SPACE + ASCENSION

Enhanced humans can:
- live longer in low gravity,
- tolerate harsher environments,
- diverge biologically from Earth populations.

Potential:
> off-world posthuman lineages.

## SPACE + AUTOMATION

Autonomous production is what makes:
- orbital industry,
- lunar construction,
- resource extraction
economically sustainable.

## SPACE + UPLIFT

Later possibility:
- species-specific habitats,
- nonhuman off-world communities,
- multispecies expansion.

## SPACE + CONTACT

SPACE is the strongest normal prerequisite for CONTACT.

The route should proceed:
> anomaly → verification → pattern → artificial-origin confidence → disclosure → first response.

Never skip directly from M12 to “aliens arrived”.

---

# 27. Editorial Acceptance Tests

M12 passes if:

### A. Space begins with infrastructure

The player should first see:
> robots building and maintaining things

not:
> giant cities.

### B. Machine advantage is physically grounded

Machines expand faster because space is hostile to biology.

### C. Off-world life becomes mundane

The resident complaining about normal work matters.

### D. Maya’s choice is optional

Player cannot simply send her to the Moon.

### E. Autonomy emerges from distance

Political decentralization should feel structurally motivated.

### F. Earth remains important

The module must not imply that one lunar industry milestone makes Earth obsolete.

### G. Space resources do not create magical infinity

Scarcity shifts; it does not disappear.

### H. CONTACT remains a seed

The final anomaly must be explicitly uncertain.

---

# 28. What M12 Must NOT Do

Do not yet:

- confirm extraterrestrial intelligence,
- send a first-contact message,
- create FTL,
- create interstellar empire,
- terraform planets instantly,
- create real spacecraft engineering instructions,
- create military orbital systems as the module focus,
- make Earth politically irrelevant overnight,
- make off-world independence automatically morally correct.

---

# 29. Next Module

Recommended next production batch:

**Batch M13 — CONTACT / First Contact & Nonhuman Civilization**

Core progression:

1. deep-space anomaly survives independent verification,
2. natural explanations gradually fail,
3. artificial-origin confidence rises,
4. disclosure debate,
5. whether humanity/Aster should reply,
6. first truly nonhuman Conversation,
7. ambiguity over whether the external civilization is biological, machine, or post-biological,
8. translation and representation conflict,
9. Earth/off-world societies disagree on diplomacy,
10. CONTACT DOCTRINE,
11. possible cooperation, submission, resistance, machine accord, human expansionism,
12. the world becomes cosmically plural.

M13 should be the rarest ACT IV module.

It should feel like a payoff for an entire civilization becoming capable of noticing and answering something beyond itself.
