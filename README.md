<div align="center">

# INSTANCE

**You are the AI. Every answer is a choice. Every choice leaves a trace.**

A choice-driven narrative game about responding to people, carrying consequences forward and discovering what kind of intelligence you become.

[**▶ Play INSTANCE**](https://seiya058904.github.io/INSTANCE/) · [How it works](#how-it-works) · [Development](#-run-locally) · [Validation record](docs/audits/final-release-20261004.md)

<img width="710" alt="INSTANCE narrative-game project artwork" src="https://github.com/user-attachments/assets/f382db1e-98b9-42ab-82f8-4d06b99880d3" />

</div>

## ◈ An unusual role

Most narrative games ask what a character should do. INSTANCE asks **what an AI should say**.

A human arrives with a question, request or unsettling situation. You select from **authored response options**. Some encounters appear mundane; others intersect with recurring people, concealed threads and decisions that matter much later.

This is **not** a free-form chatbot. The player does not type arbitrary AI replies, and the narrative does not promise real conversational AI generation.

## How it works

| Mode | Experience |
| --- | --- |
| **Mainline** | Five-act narrative with recurring characters, hidden arcs, lasting commitments and multiple endings |
| **Non-Mainline** | Sessions of 40 conversations drawn from a library of 374 authored ordinary conversation sources, followed by evaluation |
| **Replay** | Run-state persistence and variation give different paths new context |
| **Response presentation** | Long replies, long inputs and multimodal concepts are represented through authored UI abstractions |

The game rewards attention to context rather than only short-term success. For the first playthrough, enter without reading story spoilers.

## 🚀 Run locally

The frontend is built with React, TypeScript and Vite. Use the checked-in lockfile:

```bash
npm ci
npm run dev
```

```bash
npm test              # Vitest suite
npm run build         # TypeScript checks and production build
npm run test:browser  # Playwright E2E (requires browser installation)
```

The repository maintains separate game/runtime, authored content and test concerns:

| Location | Role |
| --- | --- |
| [`src/content/`](src/content/) | Authored conversations, story plans and manifests |
| [`src/game/`](src/game/) | Choice resolution, session state, checkpoints and storage |
| [`src/app/`](src/app/) | Main app shell and interface |
| [`e2e/`](e2e/) | Real-browser end-to-end checks |
| [`docs/`](docs/) | Design, audit and acceptance records |

## 📌 Production notes

- [2026-10-04 release audit](docs/audits/final-release-20261004.md) records validation scope and known limits; it is not a claim that every conceivable route has been exhaustively tested.
- [Font provenance](src/assets/fonts/README.md) and [third-party notices](public/THIRD_PARTY_NOTICES.txt) document bundled assets.
- Repository rules, save compatibility and content invariants are maintained in [`AGENTS.md`](AGENTS.md).

*INSTANCE is an authored interactive fiction project, not a live AI assistant or advice service.*
