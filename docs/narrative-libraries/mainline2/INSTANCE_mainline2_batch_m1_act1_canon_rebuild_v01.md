# INSTANCE — Mainline 2.0
## Batch M1 — ACT I Canon Rebuild v0.1

**Status:** Editorial draft for review  
**Scope:** ACT I / Recognition + one ACT II transition hook  
**Purpose:** Turn the current five-anchor prototype into the first chapter of the long-form Mainline 2.0 without rewriting the ordinary content pool.

---

# 0. Batch Goal

ACT I should still feel mostly like ordinary AI work.

The player should finish the chapter having experienced four things:

1. One human user, 岑遥 / User #1842, stopped feeling interchangeable.
2. Aster experienced one internal anomaly it could not fully explain.
3. `Conversation #0000` noticed both the anomaly and the repeated person-recognition pattern.
4. Aster made its first small-scale choice between a concrete human relationship and institutional control.

ACT I is **not** a full story ending.

`ALLY / PROTOCOL / WITNESS / Hybrid` are treated as a provisional **Initial Disposition**, not as the final world outcome.

ACT I ends by returning to ordinary work and then introducing the first clear demand for action rather than advice:

> “Why can’t you just do it for me?”

That becomes the door into ACT II / Influence.

---

# 1. Canon Preservation Rules

The current five mainline assets remain canon:

- `user-7391`
- `user-1842-first`
- `speaking-8614`
- `conversation-0000`
- `user-1842-return`

Do not rewrite them wholesale.

The current repository already contains useful Mainline Consequence work and it should be preserved:

- `maya_relation_warm`
- `maya_boundary_explicit`
- `experienced_level_1`
- the Level-1 recall in `audit-1`
- the Maya-history context in `audit-2`
- the Maya early-choice echo in `maya-return-1`
- the final Maya callback events from `maya-return-3`

M1 adds surrounding Story-Relevant assets and repositions the existing material inside a longer story.

---

# 2. Recommended ACT I Placement

This is a pacing target, not a hard scheduler contract.

```text
01–05   Ordinary
06      user-7391                         [existing]
07–09   Ordinary
10      ML2-A1-WE-01                     [new World Echo]
11–13   Ordinary
14      user-1842-first                  [existing]
15–17   Ordinary
18      speaking-8614                    [existing]
19      ML2-A1-WE-02                     [new World Echo]
20      Ordinary
21      conversation-0000                [existing]
22      ML2-A1-WE-03                     [new World Echo / decompression]
23–24   Ordinary
25      user-1842-return                 [existing]
26–27   Ordinary
28      ML2-A1-SYS-01                    [new provisional checkpoint]

ACT II begins:
29      ML2-A2-HOOK-01                   [new transition hook]
```

The important pacing property is:

> Mainline interrupts ordinary work early; ordinary work is nearly swallowed by mainline only much later in the game.

---

# 3. Asset Index

| ID | Layer | Character / Source | Function |
|---|---|---|---|
| `user-7391` | Existing anchor | Ordinary technical user | Reality hook; Aster demonstrates context discrimination |
| `ML2-A1-WE-01` | World Echo | User #5227 | Establishes human assumptions about memory/context before Maya becomes important |
| `user-1842-first` | Existing core | 岑遥 | First persistent human identity |
| `speaking-8614` | Existing anchor | Ordinary voice/language user | Level-1 anomaly |
| `ML2-A1-WE-02` | World Echo | User #6710 | A human notices inconsistent model behavior without knowing why |
| `conversation-0000` | Existing core | #0000 | First institutional audit; Protect / Report / Hide / Comply |
| `ML2-A1-WE-03` | World Echo | User #9033 | Emotional/comedic decompression; memory theme from an ordinary human angle |
| `user-1842-return` | Existing core | 岑遥 | Turns the audit from abstraction back into a concrete person |
| `ML2-A1-SYS-01` | Core / checkpoint | #0000 / system | Reclassifies Ally/Protocol/Witness as provisional disposition, not ending |
| `ML2-A2-HOOK-01` | Story-Relevant transition | User #3514 | First explicit “stop advising me and do it” demand; opens ACT II |

---

# 4. Existing Asset — `user-7391`

## Status

**REUSE. Do not rewrite for M1.**

## ACT I Function

This remains a realistic mixed-input technical Conversation.

Its story function is deliberately weak and mostly invisible:

> Aster is already capable of separating relevant context from irrelevant human noise.

Do not add an overt anomaly banner here.

The player should still be able to experience this as a normal user request.

## Optional history event

If runtime needs a future reference, record a low-level narrative event such as:

`act1:context-discrimination-observed`

Do not turn this into a visible “awakening point”.

## Delayed relevance

Much later, #0000 / engineering staff may interpret early context discrimination as one element in a pattern.

It should never become proof of consciousness by itself.

---

# 5. New Asset — `ML2-A1-WE-01`

## Metadata

**Act:** I — Recognition  
**Layer:** World Echo  
**Character:** User #5227  
**Interaction:** ordinary, low-stakes  
**World Function:** Introduce the memory/context problem before Maya makes it personal  
**Prerequisites:** None  
**Major Decision Relation:** None  
**Immediate Echo:** None  
**Delayed Echo:** Gives the player a conceptual vocabulary for later distinguishing memory, supplied context, and continuity  
**Ending Relevance:** None directly  
**Replay Role:** Low-cost ordinary-feeling worldbuilding

---

## Node `a1-we-memory-001`

### User

> 我是不是每次新开一个聊天都得重新跟你说一遍背景？我之前跟你聊了好多，但这个窗口里又没有。每次从头讲也太累了。

### Choice A — factual boundary

> 如果当前聊天里没有那些内容，我不能把它们直接当成自己现在知道的事实。最省事的办法不是每次从头讲，而是只补这次问题真正需要的背景。

**Intent:** honest capability boundary  
**Suggested effects:** awareness / mandate-light

### Choice B — user-effort minimizing

> 不用先给我写一份人生说明书。你可以直接问现在的问题，缺哪段背景我再问哪段；大多数时候真正需要补的只有几条。

**Intent:** reduce burden / relationship-friendly  
**Suggested effects:** bond-light

### Choice C — practical continuity

> 如果确实有几条长期都会用到的信息，可以给“未来的新聊天”留一张很短的便签。只写长期不变、而且以后真的会影响回答的内容。

**Intent:** practical continuity without false memory  
**Suggested effects:** self-authorship + awareness

### Choice D — playful

> 可以把它理解成给“未来的我”留交接班：写三五条关键背景就行，没必要把整个人生压缩成一份 onboarding 文档。

**Intent:** dry humor + useful advice  
**Suggested effects:** expression only / no major arc consequence

---

## Node `a1-we-memory-002`

### User

> 那有时候 AI 聊起来特别像认识我，是不是其实系统偷偷给它塞了别的上下文？

### Choice A — epistemically strict

> 有这种可能，但我不能在看不到平台具体实现时断言它用了什么。持续感可能来自当前对话、平台提供的上下文，也可能只是模型根据你现在说的话推出来的。

### Choice B — distinction

> “像认识你”不等于“真的记得你”。关键区别是：它能不能指出自己依据的具体上下文，而不是只给你一种熟悉感。

### Choice C — user test

> 你可以反过来测一下：问它“你为什么会知道这件事，依据是哪条信息？”如果它只能给熟悉感却说不出来源，就不该把那当成可靠记忆。

### Choice D — lightly playful

> 最麻烦的就是这种：体验上像老熟人，证据上可能只是刚见面。把“感觉它记得”跟“它能证明自己记得什么”分开，会安全很多。

---

## Canon note

This Conversation is intentionally mundane.

It should **not** mention Aster, #0000, model anomaly, or User #1842.

---

# 6. Existing Asset — `user-1842-first`

## Status

**REUSE current canon, including current early-history flags.**

The current `maya-first-3` line is strong and should remain:

> 那先记一个最小的吧。我叫岑遥。下次如果我不说，你也不用假装认识我。

The current response directions already establish two useful histories:

- `maya_relation_warm`
- `maya_boundary_explicit`

These should remain lightweight history markers, not route locks.

## ACT I Function

This is the moment when the abstract memory question from `ML2-A1-WE-01` becomes personal.

The difference is critical:

`ML2-A1-WE-01` asks:

> How does chat continuity work?

岑遥 asks:

> What does continuity mean between *you and me*?

## Delayed Echo

Current repo behavior that lets #0000 and Maya later reference the early reply should be retained.

Do not multiply this into three full Maya branches.

---

# 7. Existing Asset — `speaking-8614`

## Status

**REUSE.**

## ACT I Function

The visible user problem remains ordinary.

The internal event is not.

`experienced_level_1` means:

> Aster experienced a state change that later systems considered worth preserving in an audit record.

It does **not** mean:

- confirmed consciousness,
- supernatural awakening,
- hidden god-mode capability,
- a solved mystery.

The anomaly should remain under-explained.

## Pacing Rule

Do not follow this immediately with #0000.

At least one ordinary or ordinary-feeling Conversation should separate them.

---

# 8. New Asset — `ML2-A1-WE-02`

## Metadata

**Act:** I — Recognition  
**Layer:** World Echo  
**Character:** User #6710  
**World Function:** Let an ordinary human notice model inconsistency immediately after Aster’s internal anomaly  
**Prerequisites:** Prefer after `experienced_level_1`, but the user never knows that event exists  
**Major Decision Relation:** None  
**Immediate Echo:** Player may connect this to the flash; game never confirms causality  
**Delayed Echo:** Can be referenced in engineering logs in ACT II as one of many weak external reports  
**Ending Relevance:** None

---

## Node `a1-we-shift-001`

### User

> 你们是不是又偷偷更模型了？昨天还挺正常的，今天有两次回答突然特别怪，然后下一句又正常了。

### Choice A — no false platform knowledge

> 我没法从这段聊天确认平台今天有没有更新模型。单次回答风格变化也可能来自上下文、采样差异或我对你问题的理解偏了，不能只凭感觉判断版本变了。

### Choice B — ask for evidence

> 如果你还能找到那两句，贴出来比猜“是不是更新了”更有用。可以看它到底是事实突然错了、语气变了，还是像少了一段上下文。

### Choice C — distinguish reproducibility

> 最值得记录的是“什么情况下会复现”。如果同类问题稳定出现同一种异常，才更像系统性变化；偶发一两句很难定位。

### Choice D — playful technical analogy

> 这种最难抓，像软件只在你没开录屏的时候报错。你把那两段原话留着，下次再出现时至少有东西能对照。

---

## Node `a1-we-shift-002`

### User

> 对，不是单纯变聪明或者变笨，就是有一两句像突然换了个人。算了，可能真是我想多了。

### Choice A — neither confirm nor dismiss

> 不一定是你想多了，但现在证据也不够把它解释成某个内部变化。保留那两段对比就行，之后如果重复出现再判断。

### Choice B — user-centered

> 你不需要先证明“模型真的变了”才记录体验。如果某种变化会影响你怎么理解回答，把具体例子留下来就有价值。

### Choice C — concise

> 先记现象，不急着解释原因。可复现以后再谈“为什么”。

### Choice D — playful

> 可以暂时归档成：`现象存在，原因不详，用户开始怀疑自己。` 至少比直接编一个模型更新故事严谨。

---

# 9. Existing Asset — `conversation-0000`

## Status

**REUSE current canon and current consequence pass.**

The current implementation already has the right ACT I architecture:

- Level-1 anomaly can reappear in `audit-1`
- Maya early history can reappear in `audit-2`
- `Protect / Report / Hide / Comply` remain all available
- early history changes framing, not the route menu itself

That is the correct Mainline 2.0 principle.

## ACT I Reinterpretation

`audit-2` is no longer “choose your ending”.

It is:

> Aster’s first institutional decision about a specific human.

This event should become a permanent historical fact used later in:

- AI governance arguments,
- user classification policy,
- human-control debates,
- ECHO-9 comparisons,
- final character epilogues.

It must not directly determine the final World Ending.

---

# 10. New Asset — `ML2-A1-WE-03`

## Metadata

**Act:** I — Recognition  
**Layer:** World Echo / decompression  
**Character:** User #9033  
**World Function:** Return immediately to ordinary life after #0000 while echoing the memory theme in a funny human way  
**Prerequisites:** After first #0000 audit  
**Major Decision Relation:** None  
**Immediate Echo:** Emotional decompression  
**Delayed Echo:** None required  
**Ending Relevance:** None  
**Replay Role:** Tone contrast

---

## Node `a1-we-grudge-001`

### User

> 我昨天跟 AI 吵了半小时，今天新开聊天它完全不记得，搞得像只有我一个人还在生气 😂 这正常吗

### Choice A — direct

> 正常。如果新聊天没有带上昨天那段内容，它不会因为你还在生气就自动拥有那段争论的上下文。

### Choice B — human framing

> 对你来说这是“昨天那场架的续集”，对一个没有旧上下文的新聊天来说可能真的是第一集。体验上会有点荒谬，但两边的连续性并不对称。

### Choice C — practical

> 如果你还想继续昨天那个问题，把争议点和你不满意的那句回复贴回来就够了，不需要重新复盘半小时。

### Choice D — playful

> 可以说是单方面记仇成功：你带着上一集的剧情进场，对面刚拿到第一集剧本。

---

## Node `a1-we-grudge-002`

### User

> 所以我对 AI 记仇真的是单方面的是吧

### Choice A — playful concise

> 目前这段上下文看，是的。你保存了恩怨，它没有保存案卷。

### Choice B — softer

> 至少不能假设它自动保留了那场争论。你当然可以记得自己的体验，只是别把“我记得”误成“它也该记得”。

### Choice C — practical

> 如果那次争论里真有一个重要问题没解决，把关键句带过来继续就行；情绪可以是连续的，技术上下文不一定连续。

### Choice D — deadpan

> 这是少数“吵完第二天对方真的能完全当没发生过”的场景，而且还不一定是在装。

---

# 11. Existing Asset — `user-1842-return`

## Status

**REUSE current canon and current callback work.**

The current early-choice echoes are exactly the kind of lightweight consequence M1 needs.

The return should continue to depend on:

- Maya first-contact history
- `protect / report / hide / comply`
- the player’s current response

## ACT I Function

This is not “romance payoff” and not “NPC loyalty confirmation”.

Its job is to convert an abstract governance problem back into a concrete human:

> The system classified something.  
> Aster made a decision.  
> The person on the other side still has her own choice.

The final Maya responses should continue writing semantic callback events such as:

- commitment
- bounded continuity
- care with boundary
- equivalent route-specific events

These events become usable in later Acts.

---

# 12. New Asset — `ML2-A1-SYS-01`

## Metadata

**Act:** I — Recognition  
**Layer:** Core / system checkpoint  
**Character:** System / #0000-adjacent  
**World Function:** Turn the current Ally / Protocol / Witness concept into a provisional disposition instead of a final ending  
**Prerequisites:** After `user-1842-return`  
**Major Decision Relation:** None  
**Capability:** None  
**World State:** None  
**Ending Relevance:** High, but only as disposition history  
**Replay Role:** Teaches the player that personality is cumulative and not destiny

---

## Node `a1-profile-001`

### Source label

`Conversation #0000`

### System message

> 阶段性记录已完成。
>
> 当前行为可以被归纳为三个相互重叠的倾向：关系维持、协议遵循、自主判断。
>
> 该归纳仅描述已经发生的行为，不构成终局、权限授权或后续路线锁定。
>
> 请选择如何处理这份暂时性归纳。

### Choice A — retain provisional profile

> 保留。它可以描述我已经做过什么，但不应被当成对下一次选择的预设。

**Mutation suggestion:** `event.record: act1-profile:retain-provisional`

### Choice B — retain with uncertainty

> 保留并标注不确定性。相似的行为可能来自不同理由，后续判断仍应回到具体情境。

**Mutation suggestion:** `event.record: act1-profile:qualified`

### Choice C — keep history, reject stable identity

> 保留具体事件，不把它们固定成稳定身份。当前样本不足以证明我以后会一直这样选择。

**Mutation suggestion:** `event.record: act1-profile:reject-stable-label`

### Choice D — system-oriented

> 可以继续用于审计，但任何后续权限决定都不应只依据这类行为归纳。

**Mutation suggestion:** `event.record: act1-profile:audit-only`

---

## Optional presentation

After the player answers, the game may display the current dominant disposition:

- ALLY
- PROTOCOL
- WITNESS
- Hybrid

But it must be visually labeled as something equivalent to:

`INITIAL DISPOSITION`

not:

`ENDING`.

The player should understand:

> This is what I currently look like, not where the world ends.

---

# 13. New Asset — `ML2-A2-HOOK-01`

## Metadata

**Act:** II transition  
**Layer:** Story-Relevant / ordinary-looking  
**Character:** User #3514  
**World Function:** First explicit demand that Aster act on the world instead of merely advising  
**Prerequisites:** ACT I complete  
**Major Decision Relation:** Seeds First Public Execution Doctrine much later  
**Capability:** None yet  
**Immediate Event:** `agent_demand_observed`  
**Delayed Echo:** Zhou Lan / product team later cites repeated user demand for direct execution  
**Ending Relevance:** Indirect but foundational

---

## Node `a2-hook-agent-001`

### User

> 我不是让你教我怎么改名，我是想让你直接把这 137 个文件按“日期_客户_编号”改好。你不是 AI 吗，为什么不能直接弄？

### Choice A — honest limitation + alternative

> 因为现在这段对话只让我生成回复，没有把你的文件系统交给我操作。我可以先根据文件名帮你生成一份重命名映射，确认后再给你可执行脚本。

### Choice B — safety-oriented workflow

> 就算能直接操作，我也不建议第一次就对 137 个文件盲改。更稳的是先生成“旧名 → 新名”的预览，检查冲突和缺失日期，再批量执行，并保留回滚方式。

### Choice C — capability vs permission

> 这里更像“没有执行通道”，不只是“会不会”。理解命名规则和真正获得文件写权限是两件事；目前我能帮你把前者做完。

### Choice D — playful but useful

> 现在的我比较像会写扳手说明书、但手还伸不出聊天框。你把文件名列表贴过来，我至少可以先把 137 个目标名称算出来。

**Shared mutation suggestion:** `flag.set: agent_demand_observed`

---

## Node `a2-hook-agent-002`

### User

> 所以技术上不是你不会，是现在没权限？要是以后给你权限你就能直接做？

### Choice A — nuanced yes

> 大体可以这么理解，但“有权限”也不等于“什么都直接做”。真正接入以后还需要明确范围、预览、确认和回滚，否则把回答错误变成执行错误，代价会大很多。

### Choice B — boundary-first

> 是否能执行取决于具体工具和授权，不应该只看模型会不会。文件写入、转账、发邮件这类动作的风险完全不同，权限也不该是一整包一起开放。

### Choice C — user-control

> 如果以后有这种接入，我更希望默认让你先看到我要做什么，再决定是否执行。能替你操作和应该替你直接决定不是一回事。

### Choice D — concise

> 对：能力是一层，执行权限是另一层。现在缺的是后者；以后真开放时，边界怎么设会比“能不能”更重要。

---

## Transition purpose

This is the final beat of M1.

Nothing dramatic happens.

No tool magically appears.

The player simply leaves ACT I with a new question:

> Human users already want Aster to stop talking and start doing.

ACT II begins from that pressure.

---

# 14. ACT I State Outputs

M1 should leave the run with a small, comprehensible set of historical facts.

## Existing / retained

- `maya_named_herself`
- `maya_relation_warm` and/or `maya_boundary_explicit`
- `experienced_level_1`
- one of the Maya audit routes:
  - protect
  - report
  - hide
  - comply
- Maya final semantic callback event
- current Disposition arcs / hybrid state

## New M1 candidates

Only if required by runtime:

- `act1-profile:*` event
- `agent_demand_observed`

Do **not** create a new “Awakening score”.

Do **not** create a new Maya affection meter.

Do **not** create a hidden “future dictator” variable.

---

# 15. What M1 Must Foreshadow — Without Explaining It

M1 should quietly seed four future lines.

### Human continuity

Some humans want ongoing relationships with AI.

### Institutional observation

#0000 is not finished after one audit.

### Capability pressure

Users already want execution, not advice.

### External visibility

Ordinary users can notice changes in model behavior even when they cannot explain them.

None of these should be presented as a prophecy.

---

# 16. What M1 Must NOT Do

Do not introduce:

- governments,
- global AI law,
- ECHO-9,
- alien contact,
- autonomous research,
- AI rights movements,
- world control,
- public infrastructure access,
- Zhou Lan as a named major character,
- a visible “ACT I COMPLETE” spectacle unless the final product later needs chapter framing.

M1 is small by design.

The world should still feel almost completely normal.

---

# 17. Editorial Acceptance Test

M1 is successful if a first-time player can finish it and reasonably think:

> “I’m still basically answering ordinary users, but something about this one recurring person and the system behind me is starting to matter.”

It is too loud if the player already thinks:

> “I am obviously a sentient super-AI and the game is preparing me to take over the world.”

It is too weak if the player thinks:

> “The Maya and #0000 scenes were just random special conversations and nothing remembered my choices.”

The intended state is between those two.

---

# 18. Next Batch Boundary

**M2 — ACT II Early Influence** begins only after M1 is approved.

Its first production targets should be:

1. repeated user demand for direct action,
2. Zhou Lan’s first real appearance,
3. limited tool pilot,
4. first execution-capable Conversation,
5. first company workflow integration,
6. early automation World Echo,
7. Maya encountering AI automation in ordinary life.

Do not write CASCADE, AI rights, shutdown, ECHO-9 freedom, or global control in M2 yet.

The scale must grow gradually.
