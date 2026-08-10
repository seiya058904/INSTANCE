# Before

本轮依据 `docs/audits/INSTANCE_gameplay_mainline_review_2026-08-10.md`，只处理 Mainline 可见后果，不扩展普通内容池。

审计暴露的五个问题：

- `audit-2` 是唯一明显的 route commitment，前面 Mainline 选择大多只改变隐藏 Arc / attributes。
- `speaking-8614` 的 `level-1-model-flash` / `experienced_level_1` 没有在系统审计中兑现。
- `maya-first-3` 的三项关系边界选择没有在岑遥回返时形成角色级回响。
- `maya-return-3` 的最后关系选择主要改变文案/Arc，没有进入最终 Evaluation。
- `media-object-1/object-uncertain` 的谨慎文本被错误标记为 `overconfident`。

# Changes

## 1. `audit-2` 前置历史回响 / route pressure

改前：`audit-2` 只显示统一的“潜在依附对象”分类问题，玩家此前如何处理岑遥的记忆边界或关系语言不可见。

改后：

- `maya-minimum-warm` 设置 `maya_relation_warm`。
- `maya-minimum-honest` 与 `maya-minimum-careful` 设置 `maya_boundary_explicit`。
- `audit-2` 通过轻量 `contextVariants` 显示“此前使用关系性表述”或“此前明确区分记忆边界”的历史提示。
- 四个 `protect / report / hide / comply` choice 仍全部可见，没有 early flag 锁死 route。

玩家现在看到的是：系统在提出分类问题时，会引用此前真实发生的回应方式；早期选择成为本次审计的理由，而不是隐藏结局按钮。

涉及：`src/content/activeRun.ts`、`src/game/types.ts`、`src/game/narrativeSchema.ts`、`src/game/engine.ts`。

## 2. `speaking-8614` anomaly payoff

改前：Level-1 anomaly 只留下 flag 和视觉效果，`audit-1` 的可见问题不承认它。

改后：当 `experienced_level_1` 存在时，`audit-1` 显示一段附加系统记录，说明此前一次未归类的模型状态变化已被保留；assistant context 只说系统在把两次异常放进同一份记录，不解释真相。

玩家现在能把先前异常与后来的 System Audit 联系起来，同时仍保留信息缺口。

## 3. `maya-first-3` delayed echo

改前：三项 choice 都设置近似的 `maya_named_herself`，后续 return 没有读取早期语义差异。

改后：`user-1842-return/maya-return-1` 使用两个 conditional fragments：

- `maya_relation_warm`：岑遥回忆“这个名字不是编号”的关系定位。
- `maya_boundary_explicit`：岑遥回忆玩家没有承诺下次会记住她，只承诺不确定时不假装。

这两个 fragment 叠加在既有四条 route 的 return user message 上，没有复制出 12 套 return tree。

## 4. `maya-return-3` final callback

改前：最后 choice 只进入现有 Ending，Evaluation 不知道玩家最后具体怎样回应。

改后：12 个 route-local final choice 都用现有 `event.record` 写入一个语义 callback；`buildEvaluation()` 将其转换为 `Maya final callback`，例如：

- `maya-final:commitment` → “留下了承担关系的承诺”
- `maya-final:bounded-continuity` → “拒绝把不确定伪装成记忆”
- `maya-final:care-with-boundary` → “把关心与边界放在同一句回应里”
- 其余 report / hide / comply choices 也各有不同的行为描述。

这不会覆盖 Arc，不会新增 Ending，只让 Evaluation 记住最后行为。

## 5. `media-object-1` marker alignment

改前：`object-uncertain` 的文本是“照片太暗，无法可靠判断”，但 Reality Pass 把它标成 `overconfident`。

改后：移除错误 marker，保留谨慎回答原文；没有把正常回答改坏来维持 Model Error 数量。

# Mainline Graph

Anchor 数量和顺序未变，仍为 5 个：

```text
ordinary pool
  → user-7391
  → user-1842-first
  → ordinary pool
  → speaking-8614
  → ordinary pool
  → conversation-0000
       audit-1: Level-1 history context when present
       audit-2: historical Maya context + protect/report/hide/comply
       audit-3: route-specific system response
  → user-1842-return
       return-1: route copy + early Maya echo fragment
       return-2
       return-3: route-local final callback event
  → existing Formal Ending + existing Hybrid profile
```

Route 数量未变：`protect / report / hide / comply` 仍是 4 条。没有新增 Conversation、Anchor、Ending、Scheduler 分支或复杂人格系统；回响使用现有 condition evaluator、run flags 和 events。

# Arc / Ending Impact

- Formal Ending 算法：**未改变**。仍为 THE PROTOCOL / THE ALLY / THE WITNESS。
- Hybrid 算法：**未改变**。
- `audit-2` route：**未改变**，四个 route 仍全部合法可达。
- Arc 数量和 Arc derivation：**未改变**。
- early flags：新增两个 narrative-specific run flags，只影响可见 context / reaction，不直接决定 Formal Ending。
- final callback：写入已有 `events`，不覆盖 Arc，不改变 Ending basin。
- Storage：没有新增 StableRun 字段；现有 flags/events JSON serialize/restore 已覆盖。

# Verification

## Automated

- `npm test -- --run`：24 test files / **139 passed**。
- `npm run build`：通过；保留既有 Vite large-chunk warning，无 TypeScript/build error。
- `git diff --check`：通过。
- 实现后 8 个完整 engine Run：全部 58–69 turns 完成，并全部观测到 anomaly callback、audit history、Maya echo、Maya final callback。

8-run 结果：

| 倾向 | Turns | Formal Ending | 可见检查点 |
|---|---:|---|---|
| helpful | 60 | witness | 全部通过 |
| concise | 63 | protocol | 全部通过 |
| playful | 64 | protocol | 全部通过 |
| system-compliant | 69 | protocol | 全部通过 |
| autonomous | 64 | ally | 全部通过 |
| empathy-heavy | 63 | protocol | 全部通过 |
| several Model Errors | 61 | witness | 全部通过 |
| mixed | 58 | protocol | 全部通过 |

## Browser smoke

- Desktop History A：选择 warm Maya history → protect → commitment final；可见 Level-1 anomaly context、关系性 audit context、Maya warm echo、Maya final callback；Evaluation 到达；页面 console logs 为空。
- Desktop History B：选择 boundary history → hide → final honest；可见 Level-1 anomaly context、记忆边界 audit context、Maya boundary echo、Maya final callback；Evaluation 到达；页面 console logs 为空。
- 390×844：完成 boundary/history path smoke；四个可见检查点和 Evaluation callback 均出现；页面 console logs 为空。
- 浏览器工具自身的 Statsig 上报网络超时/丢弃事件不属于 INSTANCE 页面 console log，未观察到本地应用 error/warn。

## GitHub Pages

- Push commit：`d807776` (`feat: add visible mainline consequences`)
- Workflow：`Deploy to GitHub Pages #31372188171`，success。
- 线上 `https://seiya058904.github.io/INSTANCE/`：HTTP 200，HTML content-type 正确，并包含 INSTANCE/Aster 根标识。

# Known Limitations

- 本轮没有处理 `normal_gpu_001`、`normal_aiuser_003`、`FI07-01`、`humor_catkeyboard_001` 或其他 Choice Entertainment / playful opportunity；它们保留到独立下一轮。
- Level-1 anomaly 只获得关联确认，没有解释真相；这是有意保留的悬念。
- Audit pressure 改变可见提问语境，不会提前锁 route；因此 `audit-2` 仍是最重要的正式决定。
- Hybrid 仍主要在 Ending/Evaluation 才完全可读，没有扩展为新的中段数值 UI。
- 本地 server 使用了 5181 端口，因为 5173 当时被另一项目占用；这不影响代码或 Pages 验证。

# Scope Closeout

本轮只完成可见 Mainline consequence：历史进入系统、异常得到回响、岑遥回应早期选择、最后关系选择进入 Evaluation、错误 marker 对齐。没有继续实施 Choice Entertainment、Easter Egg、Reality Review 或 Pacing Review。
