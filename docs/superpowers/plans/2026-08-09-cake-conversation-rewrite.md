# Cake Conversation Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite only Batch02 Scene 09 so its two-turn cake failure conversation sounds like an immediate human request rather than a staged AI prompt.

**Architecture:** Keep the existing Markdown-source-to-runtime parser unchanged. Protect the consumer-visible parsed conversation shape with one focused test, then replace the two user messages and eight replies in the Markdown source.

**Tech Stack:** Markdown narrative source, TypeScript, Vitest, Vite.

## Global Constraints

- Preserve two StoryNodes with four choices each.
- Preserve the four semantic directions: rescue, equipment/container diagnosis, doneness check, and food safety.
- Do not modify another Scene, parser, Manifest, UI, dependency, or timing system.
- The project is not a Git repository; omit commit operations and inspect the exact edited files instead.

---

### Task 1: Protect the Naturalized Runtime Conversation

**Files:**
- Modify: `src/content/narrativeLibrary.test.ts`
- Modify: `INSTANCE_narrative_library_batch02.md`

**Interfaces:**
- Consumes: `narrativeSources: NarrativeSceneSource[]` from `src/content/narrativeLibrary.ts`.
- Produces: parsed `batch02:09` with two nodes and four sendable choices per node.

- [ ] **Step 1: Write the failing test**

Add a test that loads `batch02:09` through the real parser and asserts two nodes, four choices per node, the natural rescue wording `盖锡纸继续烤还有救吗`, and the absence of the staged metaphors `像毕业了` and `烤箱是不是在说谎`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --run src/content/narrativeLibrary.test.ts`

Expected: FAIL because the existing parsed message contains the old graduation/kindergarten metaphor and does not contain the approved rescue wording.

- [ ] **Step 3: Rewrite only Batch02 Scene 09**

Use these two user messages:

```text
救命，我蛋糕边上都快焦了，中间还是稀的
现在盖锡纸继续烤还有救吗

配方写的180度35分钟，我已经烤45分钟了……
是我这个小烤箱温度不准，还是模具用错了
```

Rewrite the eight replies as concise, directly sendable responses while preserving the approved semantic directions.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- --run src/content/narrativeLibrary.test.ts`

Expected: all tests in the file pass.

- [ ] **Step 5: Run regression verification**

Run: `npm test -- --run` and `npm run build`.

Expected: all tests and TypeScript/Vite production build pass.

- [ ] **Step 6: Inspect exact scope**

Read Scene 09 and verify Scene 08 and Scene 10 remain byte-for-byte outside the edited boundary. Report the two modified source/test files plus the previously approved design and plan documents.
