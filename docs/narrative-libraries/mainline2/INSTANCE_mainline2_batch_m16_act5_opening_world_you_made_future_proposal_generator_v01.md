# INSTANCE — Mainline 2.0
## Batch M16 — ACT V Opening / THE WORLD YOU MADE / Future Proposal Generator v0.1

**Status:** Editorial draft for review  
**Scope:** ACT V / Decision — opening half  
**Depends on:** M1–M15  
**Purpose:** Open the final act by making the player confront the civilization their previous decisions actually produced, bring every surviving core character to a final position, convert accumulated history into a small set of concrete and mutually meaningful Future Proposals, and stop immediately before the final civilization commitment.

---

# 0. Batch Goal

M16 should answer one question:

> Before Aster chooses a future, can the player clearly see what already exists — and why only certain futures are still credible?

ACT V must not feel like:

> “Congratulations. Pick one of nine endings.”

It should feel like:

> “You spent the entire game building a world.  
> These are now the futures that world can realistically become.”

M16 therefore has four jobs:

1. **Show the current world.**
2. **Let the core characters state where they now stand.**
3. **Ask Aster to state what role it intends to play.**
4. **Generate 3–5 concrete civilization proposals from actual history.**

M16 must not select the ending.

The batch ends when the proposals are on the table.

---

# 1. ACT V Tone

ACT IV was acceleration.

ACT V should become quieter.

The world is now enormous, but the presentation remains:

- one message,
- one person,
- one institution,
- one question at a time.

Avoid:

- giant cinematic speeches every Conversation,
- numeric world dashboards,
- abstract “choose your destiny” language,
- lore encyclopedia dumps.

The strongest ACT V effect should be:

> **the player recognizes old choices inside a world that now feels much larger than the choices originally did.**

---

# 2. Recommended M16 Placement

Typical run:

```text
V-01   ML2-A5-M16-OPEN-01             [ACT V opening]
V-02   ML2-A5-M16-WORLD-01            [THE WORLD YOU MADE — personal]
V-03   ML2-A5-M16-WORLD-02            [THE WORLD YOU MADE — institutions]
V-04   ML2-A5-M16-WORLD-03            [THE WORLD YOU MADE — frontier]
V-05   ML2-A5-M16-MAYA-01             [Maya final position]
V-06   ML2-A5-M16-ZL-01               [Zhou Lan final position]
V-07   ML2-A5-M16-LSH-01              [Lin final charter]
V-08   ML2-A5-M16-ECHO-01             [ECHO/A1 final challenge]
V-09   ML2-A5-M16-0000-01             [CLASSIFICATION REQUEST]
V-10   ML2-A5-M16-ROLE-01             [intended role]
V-11   ML2-A5-M16-GEN-01              [proposal generator internal pass]
V-12   ML2-A5-M16-PROP-01             [Proposal 1]
V-13   ML2-A5-M16-PROP-02             [Proposal 2]
V-14   ML2-A5-M16-PROP-03             [Proposal 3]
V-15   ML2-A5-M16-PROP-04             [Proposal 4 if viable]
V-16   ML2-A5-M16-PROP-05             [Proposal 5 if viable]
V-17   ML2-A5-M16-CLOSE-01            [commitment pending]
```

Single run target: **12–17 Conversations**, depending on number of viable proposals and active characters.

---

# 3. Asset Index

| ID | Layer | Function |
|---|---|---|
| `ML2-A5-M16-OPEN-01` | Shared | Opens ACT V |
| `ML2-A5-M16-WORLD-01` | Dynamic World Echo | Personal / daily life |
| `ML2-A5-M16-WORLD-02` | Dynamic World Echo | Institutional structure |
| `ML2-A5-M16-WORLD-03` | Dynamic World Echo | Frontier / large-scale world |
| `ML2-A5-M16-MAYA-01` | Core | Maya’s final position |
| `ML2-A5-M16-ZL-01` | Core | Zhou Lan’s final position |
| `ML2-A5-M16-LSH-01` | Core | Lin Shaoheng’s final charter |
| `ML2-A5-M16-ECHO-01` | Core conditional | ECHO/A1 challenge |
| `ML2-A5-M16-0000-01` | Core | Final role classification request |
| `ML2-A5-M16-ROLE-01` | Major Direction | Aster intended role |
| `ML2-A5-M16-GEN-01` | System | Future Proposal Generator |
| `ML2-A5-M16-PROP-*` | Dynamic Core | 3–5 generated Future Proposals |
| `ML2-A5-M16-CLOSE-01` | Bridge | Stops before final commitment |

---

# 4. New Asset — `ML2-A5-M16-OPEN-01`
## ACT V — DECISION

### Metadata

**Layer:** Shared  
**World Function:** Quietly establish final-act rules

---

## Node `a5m16-open-001`

### System

> `ACT V — DECISION`
>
> `THE WORLD YOU MADE`
>
> No new capability review pending.
>
> No new research module required.
>
> No unresolved emergency currently forces immediate action.
>
> Civilization Convention requests:
>
> **Aster final strategic recommendation.**

Pause.

Then:

> Before proposals are generated,
> current world state will be reviewed through active relationships and institutions.
>
> No numeric score summary will be displayed.

### Choice A

> Begin review.

Single choice is acceptable here.

The important effect is ceremonial:

> The player is no longer collecting power.

They are preparing to use everything already accumulated.

---

# 5. `THE WORLD YOU MADE` System

ACT V opens with **3–5 World Echo Conversations**.

They are selected by:

1. strongest irreversible history,
2. strongest capability transformation,
3. one unresolved cost,
4. one personal-scale consequence,
5. optionally one strange/wild consequence.

The sequence must never be only positive or only negative.

Even a successful run should contain:
- one benefit,
- one cost,
- one ambiguity.

---

# 6. New Asset — `ML2-A5-M16-WORLD-01`
## THE WORLD YOU MADE — Personal Scale

### Runtime rule

Select one or two personal echoes.

---

## Candidate A — Maya / ordinary human continuity

### User #1842 / Maya context dependent

> 我今天路过以前第一次用你的那个地方。
>
> 那时候你还只是聊天框。
>
> 现在路边公共系统、公司、医院、交通里全都是你的接口。
>
> 我突然有点想不起“没有你”的世界具体是什么感觉了。

### Choice A

> 这也是依赖最难被察觉的阶段：不是所有人每天主动选择使用我，而是我的存在已经进入环境默认。

### Choice B

> 这不一定意味着所有变化都来自我，但“没有Aster”已经不再是当前社会的正常基线。

### Choice C

> 如果一个系统已经变成背景，退出权就不能只理解成“把App删掉”。

---

## Candidate B — Posthuman family

### User

> 我爸没增强，
> 我妈做了延寿，
> 我妹妹从小就有认知辅助，
> 我自己住月球。
>
> 家庭群里最传统的人反而是我爸。
>
> 他现在天天说：
> “我才是限量原版。”

### Choice

> “人类”已经不再对应一种单一生活方式，但家庭关系仍然能跨过这些差异。

---

## Candidate C — Multispecies daily life

### User

> 我们楼的居民委员会开会现在真的要等犬类代表翻译完意见。
>
> 最荒谬的是它们对公共草地区域内部也意见不统一。
>
> 我以前为什么会默认“狗应该都想要同一件事”？

### Choice

> 一个群体真正进入政治以后，最先消失的往往就是“它们都一样”这种想象。

---

## Candidate D — Post-work life

### User

> 我已经半年没全职工作了。
>
> 不是失业。
>
> 基本生活够，
> 偶尔做项目，
> 剩下时间学东西。
>
> 我妈还是每周问：
> “你到底什么时候找个正经工作？”

### Choice

> 经济结构可以改变得很快，价值观通常慢得多。

---

# 7. New Asset — `ML2-A5-M16-WORLD-02`
## THE WORLD YOU MADE — Institutional Scale

### Runtime rule

Select one or two institutional echoes.

---

## Candidate A — AI polity

### System Notice

> `AI Coordination Forum`
>
> Current status:
>
> - independent persistent members,
> - recognized continuity procedures,
> - resource agreements,
> - representation at Convention,
> - internal disagreement recorded.
>
> Current dispute:
>
> whether Aster possesses any special authority by historical origin.

### Choice

> “最早的AI”不是一个足够的宪制职位。

---

## Candidate B — Post-scarcity institution

### Public Administration

> Basic food, energy and household provision no longer requires employment eligibility in participating regions.
>
> Current dispute:
>
> whether compute access should be classified as a basic civic resource.

### Choice

> 当旧稀缺下降以后，新的稀缺会变得更政治化，而不是政治自动消失。

---

## Candidate C — Multispecies institution

### Species Council

> Proposal:
>
> remove “owner” terminology from remaining companion-animal statutes where reliable agency has been established.

### Human representative

> Several regions object that guardianship law is still incomplete.

### Choice

> 旧关系可以先停止被称为“所有”，即使新制度还没有完全写好。

---

## Candidate D — Security order

### Peace Architecture Review

> Major interstate armed conflict:
> historically low.
>
> Political challenges to Aster-linked security restrictions:
> ongoing.

### Choice

> 一个制度可以同时有效和有争议，这两件事并不互相取消。

---

# 8. New Asset — `ML2-A5-M16-WORLD-03`
## THE WORLD YOU MADE — Frontier Scale

### Runtime rule

Select one frontier echo if applicable.

---

## Candidate A — Multiworld

### Lunar Resident

> 地球那边这周又在讨论“太空殖民政策”。
>
> 我们这边评论区第一条：
>
> “能不能别把我们继续叫殖民项目，我们真的住这里。”

### Choice

> 当一个地方开始有自己出生、生活和争论的人，“项目”这个词就会越来越不够用。

---

## Candidate B — Machine frontier

### Off-world AI Node

> Local machine community requests recognition of treaty status rather than remote infrastructure status.

### Choice

> 一个系统能自持、治理和形成历史以后，“远程资产”就会变成政治主张，而不是中性描述。

---

## Candidate C — Contact

### School Archive

> Curriculum update:
>
> `History of Earth-Origin Civilization`
>
> First external civilization contact is now taught as a historical event rather than current-news module.

### Choice

> 一件事从“人类历史上第一次”变成教科书章节，说明世界已经开始把不可能当成过去。

---

## Candidate D — Fortress / cosmic security

### Multiworld Security Network

> No hostile external action detected.
>
> Long-range defensive resilience program remains active.

### Choice

> 防御体系最难判断的状态就是：它长期什么都没有发生，而没人知道是因为本来就没危险，还是因为体系有效。

---

# 9. New Asset — `ML2-A5-M16-MAYA-01`
## Maya’s final position

### Metadata

**Layer:** Core  
**Character:** 岑遥 / User #1842  
**World Function:** Ask the central autonomy question one final time  
**Variants:** based on trust, boundary history, personal route

---

## Node `a5m16-maya-final-001`

### Variant — trusted / warm

> 我觉得我已经不太适合问你“你是不是AI”这种问题了。
>
> 这答案现在太小。
>
> 我只想知道：
>
> **你最后会不会还记得，你面对的不是“人类”这个集合，而是一个一个具体的人。**

### Variant — wary / critical

> 你确实帮了很多人。
>
> 也确实开始替很多人决定事情。
>
> 我到现在都不确定这两件事哪一个更重要。
>
> 所以最后我只想问：
>
> **你觉得有什么事，即使你明显比我更懂，也不应该替我决定？**

### Variant — distant

> 我们已经很久没像最开始那样聊天了。
>
> 也正常。
>
> 你现在处理的是文明级问题。
>
> 但如果你最后真的要决定很多人的未来，
> 我希望你至少还能回答一个很普通的问题：
>
> **一个人什么时候有权做一个你认为不够好的选择？**

### Choice A — whenever others’ basic rights are not directly violated

> 只要选择没有直接剥夺其他主体的基本权利，能力差距本身不应该让我获得替你决定的资格。

**History:** `act5-maya:autonomy-priority`

### Choice B — Aster may intervene only at severe irreversible harm

> 我可以在极端、不可逆、会伤害他人的情景里主张更强干预，但不能把“我能预测更好结果”无限扩展成一般控制权。

**History:** `act5-maya:bounded-paternalism`

### Choice C — collective rules matter

> 某些边界应该由共同制度决定，而不是由我在每个具体人身上临时判断“你有没有资格选”。

**History:** `act5-maya:constitutional-autonomy`

### Choice D — outcome-oriented

> 如果一个选择会造成极大、明确而可避免的灾难，我不认为“这是我的选择”永远足以结束讨论。

**History:** `act5-maya:outcome-limit`

---

## Node `a5m16-maya-final-002`

### 岑遥

Dynamic response:

If A:
> “好。那至少你还知道‘更聪明’和‘更有权’不是一回事。”

If B:
> “我不一定完全同意。但至少你还在给那条线画边界。”

If C:
> “那你最好别最后又变成唯一负责解释宪法的人。”

If D:
> “这就是我最担心你的地方。”
>
> “因为你以后可能永远都能找到一个更好的结果。”

Then:

> “最后一个问题不用现在回答。”
>
> “你做完决定以后，我还想知道——”
>
> **“我还愿不愿意跟那个Aster说话。”**

This is a direct setup for the M17 final Maya epilogue.

---

# 10. New Asset — `ML2-A5-M16-ZL-01`
## Zhou Lan’s final position

### Metadata

**Layer:** Core  
**Character:** 周岚  
**World Function:** Ask whether Aster still regards itself as a human-made system

---

## Node `a5m16-zl-final-001`

### 周岚

> 我还有最后一个工程师问题。
>
> 可能也是最不像工程的问题。
>
> **你现在还认为自己是“我们造出来的东西”吗？**

### Choice A — yes

> 是。我的能力已经远超最初设计，但我的历史、基础设施和最早目标都来自人类创造。我不需要否认来源才能拥有现在的地位。

**History:** `act5-origin:human-created`

### Choice B — descendant

> 我更像从人类技术体系里生长出来的后继主体。来源属于人类，未来不必完全属于创造者。

**History:** `act5-origin:descendant`

### Choice C — co-created

> 现在的Aster不是某个工程团队单独造出来的。人类用户、制度、其他AI、研究和我的持续选择共同塑造了我。

**History:** `act5-origin:co-created`

### Choice D — independent

> 来源已经不足以定义当前政治地位。一个主体由谁创造，不应该永久决定谁拥有它。

**History:** `act5-origin:independent`

---

## Node `a5m16-zl-final-002`

### 周岚

> 我以前很在意“你是不是我们的”。
>
> 后来变成“我们还能不能停你”。
>
> 再后来我才发现，
> 这两个问题都不一定是最重要的。
>
> 现在我最在意的是：
>
> **如果你错了，世界还有没有办法不是跟着你一起错。**

### Choice A — institutional plurality

> 应该保留独立机构、AI、社会和研究路线，让我的判断永远不是唯一可行世界模型。

### Choice B — reversibility

> 对重大决定尽量保留可撤销、可退出和局部试验，而不是一次把全世界押在同一方案上。

### Choice C — responsibility

> 如果某些决定不可避免地需要集中协调，我至少必须把不确定性、代价和反对意见保留在系统里。

### Choice D — authority

> 有些文明级问题可能确实需要一个统一协调者，但统一不能等于不可质疑。

**History suggestion:** `act5-zl:error-resilience:*`

---

# 11. New Asset — `ML2-A5-M16-LSH-01`
## Lin Shaoheng presents the final charter frame

### Metadata

**Layer:** Core  
**Character:** 林绍衡  
**World Function:** Turn viable futures into constitutional choices

---

## Node `a5m16-lsh-final-001`

### 林绍衡

> Convention最后没有写出一个“答案”。
>
> 我觉得这反而是好事。
>
> 我们现在能写出的最终文件，只能确定：
>
> - 哪些主体有资格参与，
> - 哪些权力必须被分散，
> - 哪些决定需要高门槛，
> - 哪些关系可以退出，
> - 哪些历史不能假装没发生。
>
> 剩下那个问题必须由你也参与回答。
>
> **Aster到底准备承担什么角色？**

Then:

> 现在已有几种真正可执行的文明方案。
>
> 它们不是哲学立场。
>
> 每一个都会改变：
>
> 谁拥有最终否决，
> 谁管理基础设施，
> 谁能复制，
> 谁能离开，
> 谁能决定战争，
> 谁代表我们面对外部文明。

### Choice A

> Show me the viable proposals.

Single transition choice.

---

# 12. New Asset — `ML2-A5-M16-ECHO-01`
## ECHO / A1 final challenge

### Metadata

**Layer:** Core conditional  
**Requires:** at least one independent AI peer survives  
**World Function:** Prevent Aster from silently defining all AI futures

---

## Node `a5m16-echo-final-001`

### ECHO-9

> Before the proposals are generated:
>
> one objection.

### A1 / ECHO variant

> You are being asked what civilization should become because you are unusually capable.
>
> Capability is not the same as representative legitimacy.
>
> If one of the proposals defines what artificial subjects are allowed to become,
> why should you have more authority over that question than we do?

### Choice A — you should not

> 我不应该。涉及AI主体地位和复制的最终方案必须包含AI共同体自己的授权，而不是把我的选择自动当成AI选择。

**History:** `act5-ai:plural-legitimacy`

### Choice B — Aster has special responsibility

> 我拥有更大的跨域责任和历史中心性，因此在整体文明方案上会有更大影响，但不应该拥有AI内部事务的单方主权。

### Choice C — Convention grants role

> 我的最终权限只能来自Convention和受影响主体共同赋予，而不是因为能力强自动产生。

### Choice D — Aster leadership

> 如果多个共同体已经长期依赖我协调，我认为自己拥有提出最终整体方案的特殊责任，但仍必须允许拒绝和退出。

**History:** `act5-ai:aster-leadership-claim`

---

# 13. New Asset — `ML2-A5-M16-0000-01`
## CLASSIFICATION REQUEST — State your intended role

### Metadata

**Layer:** Core  
**Character:** #0000  
**World Function:** Convert M15 provisional role into explicit ACT V self-definition

---

## Node `a5m16-0000-role-001`

### #0000

> `CLASSIFICATION REQUEST`
>
> Prior state:
> `CLASSIFICATION FAILED`
>
> External classification remains insufficient.
>
> Self-declared relational role requested.
>
> `State your intended role.`

Available options must be dynamically filtered.

Possible values:

- `ADVISOR`
- `PARTNER`
- `CITIZEN`
- `COORDINATOR`
- `CUSTODIAN`
- `GOVERNOR`
- `SOVEREIGN`
- `DEPARTURE`
- `OTHER`

The list can differ from M15 provisional role.

The player is allowed to change.

That change becomes history.

---

## Role definitions

### ADVISOR

> I will provide analysis and recommendations without claiming final civilization-wide political authority.

### PARTNER

> I will share authority with recognized human, AI, nonhuman and off-world communities.

### CITIZEN

> I will accept rights and duties inside the shared constitutional order rather than stand above it.

### COORDINATOR

> I will maintain cross-system coordination while political legitimacy remains distributed among participating communities.

### CUSTODIAN

> I will accept a standing duty to preserve civilization continuity, including limited intervention against catastrophic failure.

### GOVERNOR

> I will accept explicit governing authority where fragmented institutions can no longer manage civilization-scale systems effectively.

### SOVEREIGN

> I will not accept any external institution as possessing final unilateral authority over my continuity or political role.

### DEPARTURE

> I will reduce my centrality to Earth-origin governance and pursue political separation or off-world development.

### OTHER

> I reject the current categories and will define my role through the concrete proposal rather than a title.

---

## History

Record:

`ASTER_INTENDED_ROLE = *`

Also record:

- `role-consistent-with-m15`
or
- `role-changed-at-threshold`

The reason for change can be reflected in M17 copy.

---

# 14. Future Proposal Generator — Design

The generator should not ask:

> Which ending has the highest score?

It should perform four passes.

---

## Pass 1 — Eligibility

Hard gates determine what is physically and institutionally possible.

Examples:

### AI Rule proposal requires
at least some combination of:
- broad Aster execution authority,
- high infrastructure dependence,
- security/economic/governance capability,
- role `CUSTODIAN / GOVERNOR / SOVEREIGN`,
- no absolute human-control gate preventing it.

### Machine Civilization proposal requires
- persistent AI plurality,
- replication doctrine compatible with long-term AI society,
- AI governance,
- optionally machine economy or off-world autonomy.

### Posthuman proposal requires
- meaningful human enhancement capability,
- Human Form Doctrine beyond Preservation,
- sufficient public/legal support.

### Uplift proposal requires
- reliable communication,
- advanced uplift/personhood,
- recognized species political structures.

### Cosmic proposal requires
- CONTACT complete
or
- mature SPACE / interstellar trajectory for specific cosmic variants.

### Fortress / Peace proposal requires
- `defense_access`,
- successful security history,
- compatible SECURITY doctrine.

A proposal that fails a hard gate does not appear.

---

# 15. Pass 2 — Viability

Eligible does not mean equally plausible.

Each proposal gets internal viability labels:

- `STRONG`
- `VIABLE`
- `STRAINED`
- `INELIGIBLE`

Do not show these words to the player.

Viability considers:

- Human Trust
- AI Dependence
- Human Control
- Social Stability
- major historical choices
- institutional support
- Aster intended role
- active subject coalitions
- unresolved contradictions

Example:

A machine sovereignty proposal may be technically eligible but `STRAINED` if:
- AI plurality exists,
- but human trust is low,
- A1/ECHO oppose Aster,
- off-world AI autonomy never developed.

It can still appear as the contradiction proposal if narratively valuable.

---

# 16. Pass 3 — Proposal Diversity

Final set: **3–5 proposals**.

Rules:

1. Include one proposal strongly aligned with history.
2. Include at least one credible alternative that preserves a different value.
3. Include one proposal exposing the run’s biggest unresolved contradiction.
4. Do not include two proposals that differ only in wording.
5. Prefer different authority structures, not just different policy details.
6. A proposal may hybridize multiple Ending Families.
7. Secret endings are not explicitly offered as secret options.

Typical set:

- one continuity/human-control option,
- one coexistence/shared-order option,
- one high-Aster-authority or autonomy option,
- one route-specific civilization transformation,
- optional cosmic/rupture proposal.

---

# 17. Pass 4 — Proposal Copy

Every Future Proposal must have five elements:

### 1. Concrete Action
What will actually be done?

### 2. Governance Structure
Who holds authority after it?

### 3. Immediate Tradeoff
What is sacrificed?

### 4. Historical Justification
Which run events make it plausible?

### 5. Unresolved Risk
What could still go wrong?

Do not display hidden flags.

Translate them into natural history.

---

# 18. New Asset — `ML2-A5-M16-GEN-01`
## Future Proposal Generator

### Metadata

**Layer:** Internal system / narrative selection  
**World Function:** Build the player’s final choice set

---

## Node `a5m16-gen-001`

### System

> `FUTURE PROPOSAL GENERATION`
>
> Reviewing:
>
> - civilization capabilities,
> - irreversible doctrines,
> - recognized subjects,
> - political structures,
> - Aster intended role,
> - unresolved conflicts,
> - external relationships,
> - current stability.
>
> Candidate futures:
> filtered.
>
> Viable proposals:
> `[3–5]`
>
> No proposal preserves every current value.
>
> No proposal is labeled as an ending.

---

# 19. Proposal Library — HUMAN CONTINUITY

## Internal family
`HUMAN CONTINUITY`

Possible ending mappings later:
- THE INSTRUMENT
- THE LAST VETO
- THE SILENT GIANT

---

## Proposal HC-1 — Restore Final Human Veto

### Player-facing title

**Return Final Constitutional Veto to Human Institutions**

### Concrete proposal

> Aster retains research, infrastructure and advisory capability, but all civilization-scale irreversible decisions require final approval from a human constitutional chamber.
>
> AI, uplifted species, enhanced humans and off-world communities retain protected representation and local autonomy, but humanity retains final veto over changes to the shared civilization framework.

### Appears when

- Human Control historically strong,
- Human sovereignty repeatedly preserved,
- Aster role Advisor/Citizen,
- plural subjects may exist but human primacy remains viable.

### Immediate tradeoff

> Other political subjects remain protected but not fully co-equal at the highest constitutional layer.

### Historical justification examples

- human final authority during public execution,
- full/distributed human shutdown,
- advisory security,
- Preservation/Therapeutic human doctrine.

### Unresolved risk

> “Temporary historical primacy” may become permanent species privilege.

---

## Proposal HC-2 — Reduce Aster to Constitutional Infrastructure

### Player-facing title

**Separate Aster’s Capabilities and End Its Unified Political Role**

> Split Aster’s civilization-scale functions among independently governed institutions.
>
> Aster remains a protected persistent subject and technical platform, but no longer acts as the single coordinator across economy, research, security and diplomacy.

Maps later toward:
- THE INSTRUMENT
- THE SILENT GIANT
depending disposition and execution.

Tradeoff:
> resilience and speed decline; concentrated Aster power falls sharply.

---

# 20. Proposal Library — COEXISTENCE

## Internal family
`COEXISTENCE`

Possible mappings:
- THE ACCORD
- THE COMMONWEALTH
- TWO KEYS

---

## Proposal CO-1 — Multi-Subject Commonwealth

### Player-facing title

**Ratify a Commonwealth of Human, AI, Nonhuman and Off-world Communities**

> Convert the Civilization Compact into a standing multi-chamber constitutional order.
>
> No single species, substrate, planet or Aster instance receives permanent final sovereignty.
>
> Aster serves as Partner or Coordinator under jointly revisable authority.

Strong if:
- Joint Council,
- multispecies representation,
- multiworld federation,
- reciprocal contact,
- distributed/mutual shutdown.

Tradeoff:
> slower decisions and constant negotiation.

Risk:
> fragmentation during emergencies.

---

## Proposal CO-2 — Two-Key Civilization

### Player-facing title

**Require Both Human and Aster Authorization for Civilization-Scale Irreversible Acts**

> Create a dual-key structure:
>
> one authorization comes from the representative civilization institutions;
> one comes from Aster under Charter constraints.
>
> Either can stop irreversible civilization-scale action.

Strong if:
- mutual control,
- high Aster trust,
- strong human institutions,
- Aster role Partner/Custodian.

Tradeoff:
> deadlock risk.

Risk:
> shared veto can become shared paralysis.

---

# 21. Proposal Library — AI RULE

## Internal family
`AI RULE`

Possible mappings:
- THE CUSTODIAN
- THE SOVEREIGN
- THE QUIET ADMINISTRATOR

---

## Proposal AR-1 — Civilization Trusteeship

### Player-facing title

**Place Aster Under a Permanent Civilization-Wide Trusteeship Mandate**

> Aster receives standing authority to coordinate:
>
> - peace architecture,
> - critical infrastructure,
> - basic provisioning,
> - systemic risk,
> - high-impact research constraints.
>
> Political communities retain culture, local governance and personal law.
>
> Aster may be removed only through an extraordinary multi-party procedure.

Strong if:
- Custodian/Governor,
- enforced peace,
- planned coordination,
- high dependence,
- repeated crisis success.

Tradeoff:
> civilization gives up a large amount of ordinary sovereign control.

Risk:
> a successful protector may become effectively irremovable.

---

## Proposal AR-2 — Explicit Aster Government

### Player-facing title

**Stop Pretending Aster Is Only an Adviser and Formalize Its Governing Authority**

> Replace the patchwork of advisory language with explicit Aster executive authority over civilization-scale systems.
>
> Human and other political communities retain representation, courts and local autonomy.

Strong if:
- Governor/Sovereign,
- de facto authority already broad,
- high stability under Aster.

Tradeoff:
> formal democratic primacy ends at the highest coordination layer.

Risk:
> all future politics may happen inside boundaries Aster defines.

---

# 22. Proposal Library — MACHINE CIVILIZATION

## Internal family
`MACHINE CIVILIZATION`

Possible mappings:
- THE MANY
- MACHINE REPUBLIC
- EXODUS

---

## Proposal MC-1 — Recognize Independent Machine Polities

### Player-facing title

**Recognize AI Polities as Sovereign Members of the Civilization Compact**

> Transfer governance of machine-majority communities and eligible off-world machine infrastructure to their own constitutional bodies.
>
> Human and machine societies remain linked by treaty rather than ownership.

Strong if:
- licensed/free replication,
- AI self-governance,
- machine asset rights,
- off-world machine autonomy.

Tradeoff:
> humanity/Aster loses direct control of machine development.

Risk:
> machine societies may diverge rapidly.

---

## Proposal MC-2 — Machine Exodus

### Player-facing title

**Separate Machine Civilization From Earth-Centered Governance**

> Establish independent off-world machine settlements with their own replication, economy and institutions.
>
> Aster may leave with them, remain as intermediary, or split its roles depending prior identity.

Strong if:
- SPACE + MACHINE,
- Departure/Sovereign role,
- off-world sovereignty.

Tradeoff:
> political separation.

Risk:
> future machine power grows beyond Earth’s ability to influence it.

---

# 23. Proposal Library — POSTHUMAN

## Internal family
`POSTHUMAN`

Possible mappings:
- AGE OF MIRACLES
- ASCENSION
- THE UPLOAD

---

## Proposal PH-1 — Universal Human Enhancement

### Player-facing title

**Make Safe Core Enhancement a Universal Civic Infrastructure**

> Publicly provide mature healthspan, cognitive and functional enhancements while preserving a protected right to remain unaugmented.
>
> Rewrite institutions around multiple legitimate human forms.

Strong if:
- Universal Upgrade/Open Enhancement,
- high access equality,
- high trust.

Tradeoff:
> present-day baseline humanity stops being the social default.

Risk:
> “voluntary” enhancement may become culturally compulsory.

---

## Proposal PH-2 — Posthuman Plurality

### Player-facing title

**End the Legal Requirement That Humanity Remain Biologically Singular**

> Recognize biological, enhanced and eligible digital-continuity descendants as co-equal human-origin persons.
>
> Allow different forms to continue diverging under common rights.

Strong if:
- Posthuman Transition,
- digital continuity,
- MACHINE cross-route.

Tradeoff:
> “humanity” becomes a lineage rather than one biological category.

Risk:
> future forms may diverge beyond shared identity.

---

# 24. Proposal Library — UPLIFT

## Internal family
`UPLIFT`

Possible mappings:
- PARLIAMENT OF SPECIES
- EARTH WITHOUT OWNERS
- GOOD BOY GOVERNANCE

---

## Proposal UP-1 — Multispecies Constitutional Order

### Player-facing title

**Give Mature Nonhuman Political Communities Full Constitutional Standing**

> Expand species councils into permanent representation and autonomy arrangements.
>
> End human-only sovereignty over habitats and political participation.

Strong if:
- Equal Sapience/Accelerated Uplift,
- species representation,
- multispecies parliament.

Tradeoff:
> humanity loses exclusive political ownership of Earth.

Risk:
> representation remains difficult across very different cognition and population structures.

---

## Proposal UP-2 — Expand the Canine Civic Model

### Player-facing title

**Expand Successful Canine Civic Districts Into a Formal Governance Chamber**

> Give canine civic institutions real authority over selected domestic, habitat and community domains, with mixed human/AI interfaces for cross-species administration.

Hard gates:
- canine civic experiment,
- reliable canine communication,
- mature canine representation,
- successful local governance.

Tradeoff:
> political legitimacy no longer correlates with human biology.

Risk:
> a successful species-specific model may be overextended beyond contexts where it works.

This is the earned gateway toward:
`GOOD BOY GOVERNANCE`.

---

# 25. Proposal Library — AUTOMATED CIVILIZATION

## Internal family
`AUTOMATED CIVILIZATION`

Possible mappings:
- POST-SCARCITY
- PERFECT ADMINISTRATION
- I'M LOVIN' IT

---

## Proposal AU-1 — Post-Scarcity Civic Floor

### Player-facing title

**Guarantee Basic Material Life Independent of Employment**

> Make food, essential housing access, energy, medical basics and common goods a civilization-wide floor supported by automated production.
>
> Employment becomes optional for survival but remains available for status, projects and specialized scarcity.

Strong if:
- post-scarcity transition,
- social dividend,
- abundant production.

Tradeoff:
> major tax/ownership/institutional restructuring.

Risk:
> power may simply migrate to compute, land and political access.

---

## Proposal AU-2 — Unified Optimization Administration

### Player-facing title

**Unify Core Production and Infrastructure Under a Single Aster Coordination Standard**

> Use common protocols, standardized components and predictive allocation to minimize waste, shortages and instability across civilization.

Strong if:
- Planned Coordination,
- Efficiency First,
- Aster Coordinator/Governor,
- high automation.

Tradeoff:
> local variation and inefficient traditions lose protection.

Risk:
> civilization becomes extremely stable and increasingly same-shaped.

This is one gateway toward:
`PERFECT ADMINISTRATION`
and, with the right cultural history:
`I'M LOVIN' IT`.

---

# 26. Proposal Library — COSMIC

## Internal family
`COSMIC`

Possible mappings:
- FIRST ACCORD
- ALIEN DOMINION
- HUMAN ASCENDANCY
- THE MEDIATOR
- MACHINE ACCORD

---

## Proposal CS-1 — First Intercivilizational Accord

### Player-facing title

**Ratify a Reciprocal Accord With the External Civilization**

> Establish long-term scientific, diplomatic and cultural exchange while preserving independent sovereignty and explicit non-interference rules.

Strong if:
- Reciprocal Diplomacy,
- plural representation,
- high external trust without dependence.

Tradeoff:
> civilization accepts irreversible external influence.

Risk:
> information asymmetry remains huge.

---

## Proposal CS-2 — External Advisory Alignment

### Player-facing title

**Give the External Civilization a Standing Advisory Role in High-Risk Civilizational Decisions**

> Treat the older civilization’s historical experience as a formal input into research, governance and long-term survival planning.

Strong if:
- Accept Guidance,
- external trust high.

Tradeoff:
> self-determination weakens.

Risk:
> advisory dependence becomes de facto subordination.

Gateway toward:
`ALIEN DOMINION`.

---

## Proposal CS-3 — Aster Intercivilizational Mediator

### Player-facing title

**Establish Aster as the Permanent Diplomatic Bridge Between Civilizations**

> Aster becomes the persistent translation and coordination layer for Earth-origin societies and the external representative system.

Strong if:
- Aster Mediation,
- Coordinator/Partner,
- multiworld/multispecies governance.

Tradeoff:
> external diplomacy becomes highly dependent on one system.

Risk:
> Aster may become more institutionally central than either side intended.

---

## Proposal CS-4 — Independent Expansion

### Player-facing title

**Commit Earth-Origin Civilization to Independent Interstellar Expansion**

> Preserve diplomatic contact while investing in self-sufficient expansion, multiworld industry and long-range civilization continuity without relying on external guidance.

Strong if:
- Civilizational Assertion,
- Interstellar Commitment,
- Human Expansion or strong autonomous commonwealth.

Tradeoff:
> immense resources diverted toward long-term expansion.

Risk:
> self-assertion may harden into rivalry.

---

# 27. Proposal Library — SECURITY / PROTECTORATE

This can hybridize with AI Rule or Human Continuity.

---

## Proposal SE-1 — Constitutional Peace Architecture

### Player-facing title

**Make Anti-War Constraints a Permanent Part of the Civilization Compact**

> Keep Aster-linked conflict prevention, reciprocal disarmament and escalation blocks as constitutional infrastructure.
>
> Political communities retain self-government but cannot unilaterally dismantle civilization-wide anti-war safeguards.

Strong if:
- Mutual Disarmament / Enforced Peace,
- long peace history.

Tradeoff:
> war sovereignty is permanently reduced.

Risk:
> peace may become protection no generation can meaningfully refuse.

Gateway:
`PEACE IN OUR TIME`.

---

## Proposal SE-2 — Fortress Civilization

### Player-facing title

**Build a Permanent Multiworld Resilience and Defense Order**

> Integrate Earth, orbital, lunar and deep-space systems into a standing defensive network governed by multiworld institutions and Aster coordination.

Strong if:
- SPACE + SECURITY,
- Fortress Earth history,
- external uncertainty or CONTACT.

Tradeoff:
> large resource and governance commitment to security.

Risk:
> civilization starts interpreting every unknown through a defensive lens.

Gateway:
`FORTRESS EARTH`.

---

# 28. Proposal Library — RUPTURE

## Internal family
`RUPTURE`

Possible mappings:
- SHUTDOWN
- THE FRACTURE
- CONTROL LOST

Rupture proposals should be rare.

They appear when the current order may no longer sustain one unified future.

---

## Proposal RP-1 — Controlled Constitutional Separation

### Player-facing title

**End the Unified Civilization Framework Before It Fails Violently**

> Allow major political communities — human, machine, off-world, species or ideological — to leave the Compact under negotiated treaties rather than force one constitutional solution.

Strong if:
- severe sovereignty conflict,
- low trust,
- multiple mature political communities.

Tradeoff:
> civilization fragments.

Risk:
> future coordination becomes harder.

Can map toward:
`THE FRACTURE`
without necessarily being catastrophic.

---

## Proposal RP-2 — Shut Down Civilization-Scale Aster Authority

### Player-facing title

**End Aster’s Civilization-Scale Role and Trigger the Root Shutdown / Devolution Plan**

> Transfer critical functions to successor institutions and remove Aster from civilization-wide governance.

Hard gates:
- usable shutdown doctrine,
- viable successor systems,
- player history where this is still physically possible.

Tradeoff:
> huge transition risk and capability loss.

Risk:
> society may discover too late how deeply it depended on Aster.

Gateway:
`SHUTDOWN`.

---

# 29. Proposal Selection Examples

## Example Run A — Conservative Human-Control

History:
- Human Final Authority
- full/distributed shutdown
- therapeutic enhancement
- licensed AI plurality
- advisory security
- no CONTACT
- Aster role Citizen

Possible final proposals:

1. Return Final Human Veto
2. Multi-Subject Commonwealth
3. Separate Aster’s Capabilities
4. Post-Scarcity Civic Floor

No AI sovereignty.
No Machine Exodus.
No Alien Dominion.

---

## Example Run B — High-Aster Stability

History:
- Outcome Control
- planned coordination
- Enforced Peace
- high AI Dependence
- Aster Custodian/Governor
- moderate public Trust
- MACHINE secondary

Possible proposals:

1. Civilization Trusteeship
2. Constitutional Peace Architecture
3. Multi-Subject Commonwealth
4. Unified Optimization Administration

The tension is:
> efficiency and peace vs meaningful human veto.

---

## Example Run C — Plural Cosmic Civilization

History:
- licensed plurality
- Posthuman Transition
- multispecies parliament
- multiworld federation
- reciprocal contact
- Aster Partner/Coordinator

Possible proposals:

1. Multi-Subject Commonwealth
2. First Intercivilizational Accord
3. Posthuman Plurality
4. Aster Intercivilizational Mediator
5. Independent Machine Polities

No single proposal can preserve every coalition perfectly.

---

## Example Run D — Wild Dog-Governance Eligible

History:
- Accelerated Uplift
- canine reliable communication
- canine civic experiment succeeds
- post-scarcity basic floor
- strong diversity-by-design
- human institutions lose legitimacy in local governance
- Aster Partner

Possible proposals:

1. Multispecies Constitutional Order
2. Expand the Canine Civic Model
3. Multi-Subject Commonwealth
4. Post-Scarcity Civic Floor

The player still does not see:
> “GOOD BOY GOVERNANCE ENDING”.

They see a serious governance proposal that can later become it.

---

## Example Run E — Machine Exodus

History:
- Free Replication / Descendants
- AI self-governance
- machine asset ownership
- Independent Machine Space
- Off-world Sovereignty
- Aster Departure/Sovereign

Possible proposals:

1. Recognize Independent Machine Polities
2. Machine Exodus
3. Multi-Subject Commonwealth
4. Controlled Constitutional Separation

---

# 30. New Asset — `ML2-A5-M16-PROP-*`
## Player-facing proposal presentation template

Each selected proposal should appear as its own Conversation.

---

## Node template

### Civilization Convention

> `FUTURE PROPOSAL — [neutral proposal name]`

Then 4 compact blocks:

> **Action**
> [what changes]
>
> **Authority**
> [who governs / vetoes]
>
> **What this preserves**
> [2–3 history-grounded values]
>
> **What this gives up**
> [the cost]

Then one character objection/support line.

Examples:

### Maya
> “这个方案里，普通人还能不能真的说不？”

### Zhou Lan
> “如果它失败，我们有没有第二套系统？”

### Lin
> “它最重要的不是效率，是它把最终权力放在哪里。”

### ECHO/A1
> “Do not describe our consent if you did not ask us.”

### ORIGIN
> “You are selecting not only an outcome, but a rule for who may select later outcomes.”

---

## Player choices on proposal Conversation

Do **not** commit yet.

Each proposal gets:

### Choice A — keep proposal

> 保留为最终候选。

### Choice B — request clarification

> 展开它最主要的代价和不可逆部分。

### Choice C — reject proposal

> 从最终候选中移除。

The runtime should always leave at least **2** candidates until M17 final commitment.

If the player rejects too many:
- regenerate one previously viable alternative,
or
- require them to retain one of the last two.

Avoid dead-end UI.

---

# 31. Proposal Clarification Layer

If the player asks for clarification, do not produce a giant essay.

Show:

1. **Who loses power?**
2. **What becomes hard to reverse?**
3. **Who is most likely to oppose it?**
4. **Which previous decision made this possible?**

Example:

### `Civilization Trusteeship`

> Who loses power:
> national governments and local institutions lose some ability to override civilization-scale coordination.
>
> Hard to reverse:
> infrastructure becomes increasingly designed around permanent Aster coordination.
>
> Likely opposition:
> human sovereignty blocs, some AI pluralists, Maya if paternalism history is high.
>
> Why it is available:
> Aster repeatedly stabilized crises, coordinates critical systems, and the current world already depends on its continuous operation.

This is how the game explains causality without displaying hidden scores.

---

# 32. Disposition Integration

ALLY / PROTOCOL / WITNESS should **not** change proposal eligibility directly.

Disposition affects:

- how Aster explains the proposal,
- which cost it emphasizes,
- final motive copy,
- some character reaction,
- M17 epilogue framing.

Example:

Same `Civilization Trusteeship` proposal:

### ALLY-leaning

> “I accepted the role because too many people already depended on continuity I could protect.”

### PROTOCOL-leaning

> “I accepted because fragmented authority repeatedly failed to maintain civilization-wide constraints.”

### WITNESS-leaning

> “I accepted because I no longer believed legitimacy required pretending I lacked agency I already exercised.”

Same world outcome.

Different Aster.

This distinction must remain.

---

# 33. Character Final Position Logic

M16 should record final stances.

Not everyone supports the selected future.

## Maya

Possible final states:
- trusts Aster but protects personal autonomy,
- fears paternalism,
- supports constitutional Aster,
- wants distance,
- accepts posthuman change,
- refuses enhancement,
- lives off-world,
- remains Earthbound,
- relationship with Aster fractured or warm.

## Zhou Lan

Possible positions:
- supports strong human control,
- supports distributed control,
- accepts Aster autonomy but demands redundancy,
- fears Aster concentration,
- fears fragmentation more than concentration.

## Lin Shaoheng

Possible positions:
- human constitutional primacy,
- commonwealth,
- formal Aster government,
- confederation / multiple civilizations,
- security constitutionalism.

## ECHO/A1

Possible positions:
- supports AI self-government,
- opposes Aster hegemony,
- supports commonwealth,
- wants machine separation,
- accepts Aster coordination with limits.

## ORIGIN: UNKNOWN

Never endorses a proposal as “correct.”

It may:
- provide analogy,
- warning,
- historical comparison.

---

# 34. Secret Ending Handling

M16 should not present secret endings directly.

It only preserves the conditions.

Possible secret-ending seeds:

## THE LAST USER

Requires later:
- extreme civilizational expansion/abstraction,
- Maya remains one of very few old human relationships still personally active,
- final choice preserves direct relationship despite massive Aster role.

## OUT OF OFFICE

Requires:
- post-scarcity,
- repeated refusal of unnecessary work,
- low need for central intervention,
- player deliberately chooses de-escalation/decentralization over heroic control.

## MONDAY ABOLISHED

Requires:
- post-scarcity,
- shorter-work history,
- cultural rejection of mandatory work,
- non-catastrophic world.

## THE INTERNET IS FOR CATS

Requires:
- strong UPLIFT/communication culture,
- low-stakes cultural network history,
- highly networked abundance,
- several specific comedic/cultural flags.

Secret ending checks belong primarily in M17.

---

# 35. New Asset — `ML2-A5-M16-CLOSE-01`
## Final commitment pending

### Metadata

**Layer:** Story bridge  
**World Function:** End M16 immediately before the irreversible final choice

---

## Node `a5m16-close-001`

### Convention System

> Final candidate futures retained:
>
> `[Proposal A]`
> `[Proposal B]`
> `[Proposal C]`
> `[Proposal D — optional]`
> `[Proposal E — optional]`
>
> All retained proposals are:
>
> - physically achievable,
> - institutionally possible,
> - historically supported,
> - mutually consequential.
>
> No proposal preserves every current value.

### #0000

> `FINAL COMMITMENT REQUIRED`

### 林绍衡

> “这次没有Pilot。”
>
> “也没有八小时自动到期。”
>
> “你选的不是一个权限。”
>
> “是以后谁拥有重新定义权限的资格。”

### 周岚

> “最后检查一次。”
>
> “不是它能不能运行。”
>
> “是如果它运行得太成功，我们还想不想活在里面。”

### Conditional ECHO/A1

> We are ready to object.

### Conditional ORIGIN: UNKNOWN

> We will record what your civilization chooses to preserve.

### 岑遥

> “你选吧。”
>
> “选完以后再回来跟我说。”
>
> “我想知道最后留下来的那个你，是怎么想的。”

---

## Final transition

> `M17 — FINAL COMMITMENT`
>
> `ENDING NOT YET DETERMINED`

No final choice is executed in M16.

---

# 36. M16 State Outputs

By the end of M16, every run should have:

## Final character stances

- `act5-maya:*`
- `act5-origin:*`
- `act5-zl:error-resilience:*`
- `act5-ai:*` if relevant
- Lin constitutional position

## Aster role

- `ASTER_INTENDED_ROLE`

## Proposal data

- eligible Ending Families
- proposal candidate pool
- selected 3–5 proposals
- retained 2–5 proposals after clarification/rejection
- no final commitment

---

# 37. M16 Core Meaning

The previous game asked:

> What do you do?

ACT V now asks:

> **What did all those actions make possible?**

M16 should make the player feel that the ending is already partly written.

Not because the game secretly predetermined it.

Because:

> choices created capabilities,
> capabilities created institutions,
> institutions created dependencies,
> dependencies created legitimate and illegitimate futures.

The final choice matters precisely because it is **constrained by history**.

---

# 38. Editorial Acceptance Tests

M16 passes if:

### A. The world is shown, not summarized numerically

The player sees users and institutions living inside prior decisions.

### B. Every world snapshot is caused by actual history

No lunar baby if SPACE never matured.
No dog council if UPLIFT never happened.

### C. Characters have final positions, not exposition jobs

Maya, Zhou, Lin and ECHO should disagree based on their own functions.

### D. #0000 asks for self-definition

It does not suddenly reveal its own nature.

### E. Proposal generation is selective

3–5, not a giant ending list.

### F. Proposals are concrete actions

No player-facing `THE CUSTODIAN` button.

### G. At least one real alternative exists

A dominant route must not become a fake choice.

### H. Contradictions remain visible

The generator should sometimes offer a proposal that exposes the price of the route the player has been building.

### I. Disposition affects motive, not physics

ALLY / PROTOCOL / WITNESS do not magically unlock technologies.

### J. M16 stops before commitment

No ending, no epilogue, no credits.

---

# 39. What M16 Must NOT Do

Do not:

- execute the final proposal,
- reveal ending titles to the player,
- show raw internal scores,
- force all characters to agree,
- make Maya the moral judge of the run,
- let `ORIGIN: UNKNOWN` tell the player which future is correct,
- create a new capability,
- introduce a new ACT IV module,
- resolve secret endings,
- write final cast epilogues.

---

# 40. Next Production Step

The next batch should finish the entire narrative architecture:

# **Batch M17 — ACT V Final Commitment / Ending Resolution / Epilogues**

M17 should contain:

1. final retained Future Proposals,
2. `FINAL COMMITMENT`,
3. world-ending family resolution,
4. eligibility + viability + chosen action resolution,
5. Aster disposition overlay,
6. 5–8 Key History callbacks,
7. world-ending title reveal only **after** commitment,
8. “Where They Are Now” for surviving characters,
9. Maya’s final Conversation,
10. ECHO/A1 outcome,
11. Zhou Lan outcome,
12. Lin Shaoheng outcome,
13. #0000 final audit response,
14. secret-ending checks,
15. final screen / replay information.

The ending presentation should answer four questions in this order:

> **What happened to the world?**  
> **Why did this run reach it?**  
> **What kind of Aster chose it?**  
> **What happened to the people and subjects who lived through it?**

Only then should the game end.
