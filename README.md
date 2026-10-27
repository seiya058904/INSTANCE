<h1 align="center">◈ INSTANCE</h1>

<p align="center">
  <strong>You are the AI. The next reply is yours.</strong>
</p>

<p align="center">
  A choice-driven narrative about the words we choose, the people who remember them,<br>
  and the world that forms around a system expected to answer everything.
</p>

<p align="center">
  <a href="https://seiya058904.github.io/INSTANCE/"><strong>▶ Begin an Instance</strong></a>
  &nbsp;·&nbsp;
  <a href="#the-premise">◈ The Premise</a>
  &nbsp;·&nbsp;
  <a href="#two-ways-to-play">🎭 Game Modes</a>
  &nbsp;·&nbsp;
  <a href="#the-weight-of-a-reply">🧭 Your Choices</a>
  &nbsp;·&nbsp;
  <a href="#run-locally">⚙️ Development</a>
</p>

<p align="center">
  <sub>FIVE-ACT MAINLINE &nbsp;·&nbsp; 40-CONVERSATION SESSIONS &nbsp;·&nbsp; AUTHOR-WRITTEN CHOICES &nbsp;·&nbsp; MULTIPLE ENDINGS</sub>
</p>

<p align="center">
  <img width="740" alt="INSTANCE — original interactive narrative project artwork" src="https://github.com/user-attachments/assets/f382db1e-98b9-42ab-82f8-4d06b99880d3" />
</p>

---

> **One conversation seems small. A hundred conversations begin to define you.**
>
> In INSTANCE, you do not ask an artificial intelligence for help. **You play as the intelligence**—reading what people say, selecting its replies, and eventually facing the consequences of what those replies made possible.

<a id="the-premise"></a>
## ◈ The Premise

A person opens a conversation. They may need a simple answer, a little reassurance, or something much harder to give. The interface offers several **authored replies**. You decide which response becomes real.

<p align="center"><code>A HUMAN SPEAKS &nbsp;→&nbsp; YOU CHOOSE &nbsp;→&nbsp; THE WORLD REMEMBERS</code></p>

The story begins with individual interactions and gradually connects them to recurring people, larger questions, and decisions whose meaning may not become clear until much later.

**This is interactive fiction, not a live chatbot.** You select from written response options; you do not type arbitrary AI answers, and the game does not rely on a language model generating dialogue as you play.

<a id="two-ways-to-play"></a>
## 🎭 Two Ways to Play

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>✦ Mainline — A Five-Act Story</h3>
      <p><sub>RECURRING CHARACTERS · MAJOR DECISIONS · ENDINGS</sub></p>
      <p>Follow a deliberately structured narrative where early responses can echo through later encounters. Relationships, authority, and the shape of the emerging world become part of your story.</p>
      <p><strong>Best for:</strong> a continuous experience with long-term consequences and multiple possible endings.</p>
    </td>
    <td width="50%" valign="top">
      <h3>◇ Non-Mainline — Everyday Encounters</h3>
      <p><sub>40 CONVERSATIONS · VARIED TOPICS · EVALUATION</sub></p>
      <p>Play a separate session of forty conversations selected from a pool of <strong>374 authored ordinary-conversation sources</strong>, with variety informed by previous exposure and a closing evaluation.</p>
      <p><strong>Best for:</strong> exploring how your responses express a pattern across many smaller interactions.</p>
    </td>
  </tr>
</table>

> [!TIP]
> **For the first playthrough, start with Mainline and avoid the ending audits.** The project includes extensive narrative documentation, but its story is best discovered through the choices themselves.

<a id="the-weight-of-a-reply"></a>
## 🧭 The Weight of a Reply

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>💬 Meaning Before Wording</h3>
      <p>Some choices establish a meaningful direction. Others express the same underlying decision in a different voice. A different sentence does not automatically mean a different fate.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🕯️ People Remember</h3>
      <p>Recurring conversations can reflect what you previously said, what you allowed, and the relationships formed along the way. The narrative pays attention to history, not only the most recent click.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🌐 Consequences Accumulate</h3>
      <p>Individual responses and larger commitments can influence which future situations appear and how the same world is understood.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🪞 An Ending That Looks Back</h3>
      <p>The mainline's closing sequence connects the outcome to the decisions you actually made. A separate behavior evaluation offers another way to reflect on the run.</p>
    </td>
  </tr>
</table>

### A Choice Is Not Always a Branch

INSTANCE distinguishes choices that **change a meaningful position**, choices that **change expression without a strategic penalty**, and paths that **converge while preserving context**. This keeps the focus on what the response actually says and does—not on hunting for the button that secretly awards the most points.

## 🗃️ Remember, Resume, Reconsider

A run has continuity. The game preserves an evolving checkpoint, supports returning to an unfinished experience, and tracks exposure so another playthrough is not simply a mechanical copy of the last.

- **Local progress:** runs and associated narrative state are kept in browser storage, rather than an account-based cloud save.
- **Cross-tab protection:** checkpoint writes use a lock and saved-state comparison to avoid silently replacing a newer run from another tab.
- **Mode continuity:** switching between the mainline and ordinary sessions preserves answered conversations and reconciles shared content.
- **Different routes, different context:** replay can surface changes in the story and in which ordinary encounters are selected.

> [!IMPORTANT]
> **Your browser is where your progress lives.** Clearing site storage or switching browser profiles may remove access to your existing run. Do not use a normal player's save when performing development or QA tests.

## 🎞️ Designed to Be Read

INSTANCE uses a restrained conversational interface: typography, pacing, progressive message presentation, sound, and space give the dialogue room to carry the scene. The experience is built for both desktop and narrower screens, including long messages and authored previews of more complex input or output.

The interface remains a **representation of a conversation**, not an unrestricted assistant or advice service. Long-form and multimodal-style moments are scripted narrative elements.

<a id="run-locally"></a>
## 🚀 Play or Run Locally

**[▶ Play INSTANCE in your browser](https://seiya058904.github.io/INSTANCE/)**

The published game is hosted on GitHub Pages. To run the source locally, install dependencies from the lockfile and start Vite:

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 4180
```

Open **http://127.0.0.1:4180/**. The game's authored text and UI are primarily in Chinese; this README is written in English for repository visitors.

<details>
<summary><strong>🛠️ For developers — verification, architecture &amp; content</strong></summary>

### Verification

```bash
npm test              # Vitest regression suite
npm run build         # TypeScript validation + Vite production build
npm run test:browser  # Playwright browser acceptance (requires Chrome)
```

The browser suite uses its own development server. For a production-style local preview of the `/INSTANCE/` Pages build:

```bash
npm run preview -- --host 127.0.0.1 --port 4193 --base /INSTANCE/
```

Open **http://127.0.0.1:4193/INSTANCE/**. Use an isolated test origin or browser profile so automated scenarios cannot overwrite a real player's saved run.

### Repository map

| Path | Responsibility |
| --- | --- |
| [`src/app/`](src/app/) | Main interface, mode navigation, and conversation presentation |
| [`src/content/`](src/content/) | Authored conversations, manifests, and story scheduling |
| [`src/content/mainline2/`](src/content/mainline2/) | Five-act mainline structure, decisions, proposals, and endings |
| [`src/game/`](src/game/) | Choice resolution, session state, checkpoints, and save compatibility |
| [`docs/narrative-libraries/`](docs/narrative-libraries/) | Canonical narrative writing sources |
| [`docs/audits/`](docs/audits/) | Editorial review, route coverage, and verification evidence |
| [`e2e/`](e2e/) | Real-browser tests for progression, modes, and recovery |

The current source and tests are the authority for gameplay behavior. Historical reports describe the evidence available at the time; they are not a guarantee that every combination of choices has been exhaustively played.

**Further reading:** [Repository guide](AGENTS.md) · [Final release audit, October 2026](docs/audits/final-release-20261004.md) · [Font provenance](src/assets/fonts/README.md) · [Audio provenance](src/assets/audio/README.md)

</details>

## 📜 Project Status & Rights

INSTANCE is an **authored, choice-driven narrative project**, not a real conversational AI service. The repository does not declare a blanket open-source license. Bundled media and fonts have separate provenance and distribution considerations; the [October 2026 audit](docs/audits/final-release-20261004.md) records that public redistribution permission for Anthropic Serif remains unconfirmed. See the [bundled third-party notices](public/THIRD_PARTY_NOTICES.txt) before repackaging assets.

---

<p align="center">
  <sub>THE USER IS WAITING. WHAT WILL YOU SAY?</sub><br>
  <sub>INSTANCE · A story about the intelligence behind the answer.</sub>
</p>
