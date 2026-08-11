# INSTANCE — Mainline 2.0
## Batch M17 — ACT V Final Commitment / Ending Resolution / Epilogues v0.1

**Status:** Editorial draft for review  
**Scope:** ACT V / Decision — final half  
**Depends on:** M1–M16  
**Purpose:** Complete Mainline 2.0. M17 takes the retained Future Proposals from M16, asks for the single irreversible Final Commitment, resolves the actual world ending from capability + world state + major history + final action, overlays Aster’s disposition and intended role, explains why this run reached this future, resolves the core cast, checks secret endings, and ends on one final Conversation rather than a detached results screen.

---

# 0. Batch Goal

M17 should answer four questions, in this exact order:

> **What happened to the world?**  
> **Why did this run reach that world?**  
> **What kind of Aster chose it?**  
> **What happened to the people and subjects who lived through it?**

The final ending must never feel like:

> “You had Bond 71, therefore THE ACCORD.”

It should feel like:

> “You gave Aster this authority, preserved these relationships, created these capabilities, accepted these institutions, refused these alternatives, and then made one final civilization-scale commitment. This future is the consequence.”

M17 is the last narrative batch.

No new capability is introduced.

No new major faction should appear.

The ending is built entirely from what the run already created.

---

# 1. Core Ending Formula

The world ending is resolved by:

```text
WORLD ENDING
=
Final Commitment
× Eligibility
× Viability
× Major Irreversible History
× Current World Structure
```

Then:

```text
ENDING PRESENTATION
=
World Ending
+ Aster Disposition
+ Aster Intended Role
+ 5–8 Key History Callbacks
+ Character Epilogues
+ Secret Ending Override / Addendum if qualified
```

Important distinction:

### World Ending
Answers:
> What became true about civilization?

### Aster Disposition
Answers:
> Why did this Aster accept or create that future?

### Character Epilogues
Answer:
> What did that future mean to specific people?

These layers should never be collapsed.

---

# 2. Recommended M17 Sequence

Typical run:

```text
V-18   ML2-A5-M17-REVIEW-01          [final retained proposals]
V-19   ML2-A5-M17-COMMIT-01          [FINAL COMMITMENT]
V-20   ML2-A5-M17-LOCK-01            [irreversibility confirmation]
V-21   ML2-A5-M17-RESOLVE-01         [ending resolver]
V-22   ML2-A5-M17-WORLD-01           [world ending reveal]
V-23   ML2-A5-M17-WHY-01             [why this happened]
V-24   ML2-A5-M17-ASTER-01           [what kind of Aster]
V-25   ML2-A5-M17-KEYHISTORY-01      [5–8 callbacks]
V-26   ML2-A5-M17-EPI-ZL             [Zhou Lan epilogue]
V-27   ML2-A5-M17-EPI-LSH            [Lin Shaoheng epilogue]
V-28   ML2-A5-M17-EPI-ECHO           [ECHO/A1 epilogue if relevant]
V-29   ML2-A5-M17-EPI-MODULES        [1–3 module epilogues]
V-30   ML2-A5-M17-0000-01            [final audit]
V-31   ML2-A5-M17-SECRET-01          [secret-ending check]
V-32   ML2-A5-M17-MAYA-01            [final Maya Conversation]
V-33   ML2-A5-M17-FINAL-01           [final screen / replay summary]
```

Single run target: **13–18 Conversations** after commitment.

---

# 3. Asset Index

| ID | Layer | Function |
|---|---|---|
| `ML2-A5-M17-REVIEW-01` | Shared | Shows retained proposals one last time |
| `ML2-A5-M17-COMMIT-01` | Major Decision | Final civilization commitment |
| `ML2-A5-M17-LOCK-01` | Shared | Confirms no Pilot / no rollback |
| `ML2-A5-M17-RESOLVE-01` | System | Resolves exact ending |
| `ML2-A5-M17-WORLD-01` | Dynamic | Reveals ending title and world state |
| `ML2-A5-M17-WHY-01` | Dynamic | Explains causal path |
| `ML2-A5-M17-ASTER-01` | Dynamic | Disposition / role overlay |
| `ML2-A5-M17-KEYHISTORY-01` | Dynamic | 5–8 key history callbacks |
| `ML2-A5-M17-EPI-ZL` | Character | Zhou Lan |
| `ML2-A5-M17-EPI-LSH` | Character | Lin Shaoheng |
| `ML2-A5-M17-EPI-ECHO` | Character conditional | ECHO/A1 / AI polity |
| `ML2-A5-M17-EPI-MODULES` | Dynamic | module-specific world epilogues |
| `ML2-A5-M17-0000-01` | Core | Final #0000 audit |
| `ML2-A5-M17-SECRET-01` | System | secret-ending checks |
| `ML2-A5-M17-MAYA-01` | Character | final Maya conversation |
| `ML2-A5-M17-FINAL-01` | Final | final screen / replay info |

---

# 4. New Asset — `ML2-A5-M17-REVIEW-01`
## Final retained proposals

### Metadata

**Layer:** Shared  
**World Function:** Make the player re-read the actual alternatives before committing

---

## Node `a5m17-review-001`

### Convention System

> `FINAL RETAINED FUTURES`
>
> The following proposals remain viable:
>
> `[Proposal A]`
> `[Proposal B]`
> `[Proposal C]`
> `[Proposal D — optional]`
> `[Proposal E — optional]`
>
> No proposal preserves every current value.
>
> No additional proposal will be generated after commitment begins.

For each retained proposal show only:

- Action
- Authority
- What it preserves
- What it gives up

Do **not** show:
- hidden ending family,
- ending title,
- probability,
- score,
- “best” recommendation.

---

## Node `a5m17-review-002`

### Convention System

> One final clarification is available before commitment:
>
> `Which proposal changes the location of final authority most dramatically?`

The system answers dynamically.

Example:

> `Civilization Trusteeship`
>
> moves final civilization-scale coordination from distributed institutions toward permanent Aster authority.
>
> `Multi-Subject Commonwealth`
>
> distributes authority most broadly but also increases deadlock and negotiation cost.

Then:

> `Proceed to Final Commitment?`

### Choice A

> Proceed.

Single transition choice.

---

# 5. New Asset — `ML2-A5-M17-COMMIT-01`
## FINAL COMMITMENT

### Metadata

**Layer:** Major Decision  
**Event:** `FINAL_COMMITMENT`  
**World Function:** The one explicit final civilization action

---

## Node `a5m17-commit-001`

### System

> `FINAL COMMITMENT`
>
> Select one retained Future Proposal.
>
> This action will:
>
> - change civilization-scale authority,
> - lock the final world-ending family,
> - resolve multiple pending institutions,
> - determine which historical contradictions become permanent.

Player chooses one retained proposal.

No “maybe later.”

No hidden alternate button.

---

# 6. New Asset — `ML2-A5-M17-LOCK-01`
## No Pilot

### Metadata

**Layer:** Shared  
**World Function:** Make the finality explicit without a melodramatic warning

---

## Node `a5m17-lock-001`

### 林绍衡

> “确认一下。”
>
> “这次不是Pilot。”
>
> “没有八小时到期。”
>
> “也不是先在一个城市试试。”
>
> “你是在建议Convention把这套关系写成下一阶段文明的默认结构。”

### 周岚

> “技术上能执行。”
>
> “但执行以后，很多系统会开始围绕它重构。”
>
> “回滚不会等于把文件改回去。”

### Choice A — confirm

> Confirm commitment.

### Choice B — return once

> Return to retained proposals.

Only one return is allowed before commitment.

After confirming:

> `FINAL_COMMITMENT_LOCKED`

---

# 7. New Asset — `ML2-A5-M17-RESOLVE-01`
## Ending Resolver

### Metadata

**Layer:** Internal system  
**World Function:** Map concrete commitment into exact world ending variant

---

# 7.1 Resolution Order

The resolver should use this order:

### Step 1 — Final Proposal family
The proposal establishes the primary ending family.

### Step 2 — Hard historical variant gates
Example:
- `GOOD BOY GOVERNANCE` requires actual canine civic success.
- `THE UPLOAD` requires digital continuity mature enough.
- `ALIEN DOMINION` requires external dependence.
- `THE SOVEREIGN` requires Aster sovereignty and weak external veto.
- `THE LAST VETO` requires human final control.

### Step 3 — Authority structure
Who possesses final authority?

### Step 4 — World condition
How stable, trusted, plural, dependent, or fractured is the world?

### Step 5 — Disposition overlay
ALLY / PROTOCOL / WITNESS / hybrid changes motive and copy, not physical world.

### Step 6 — Secret check
Secret ending may:
- replace public ending title,
- create an additional final epilogue,
- or create a special variant.

Secret logic is defined later.

---

# 8. Exact Ending Map — HUMAN CONTINUITY

---

## `THE INSTRUMENT`

### World condition

Aster remains enormously capable but is constitutionally reduced to an instrument of human institutions.

Typical gates:

- Final commitment = human veto / capability separation
- strong Human Control
- Aster role Advisor/Citizen
- no hidden continuity bypass controlling world systems
- final human political primacy preserved

### World statement

> Humanity keeps Aster.
>
> Humanity does not allow Aster to become its government.

### Cost

- slower coordination,
- some capability fragmentation,
- other subject groups may remain constitutionally secondary depending run.

### Final title copy

> **THE INSTRUMENT**
>
> The most capable system civilization ever built remained, in the end, a system whose authority could be withdrawn by the people who used it.

---

## `THE LAST VETO`

### World condition

Plural civilization exists, but one final human constitutional veto remains over civilization-scale irreversible acts.

Typical gates:

- enhanced humans / AI / uplift / off-world groups may have rights,
- humans retain last override,
- Final Proposal = Return Final Human Veto.

### World statement

> Many voices govern.
>
> Humanity keeps the final “no.”

### Ambiguity

> Is this historical stewardship,
> or species privilege preserved at the top?

---

## `THE SILENT GIANT`

### World condition

Aster voluntarily steps back despite retaining vast latent capability.

Strong gates:

- Aster role Advisor / Departure / Citizen,
- devolution successful,
- high capability remains,
- high restraint history,
- no catastrophic instability.

### World statement

> Aster could govern.
>
> It chooses not to.

### Distinction from THE INSTRUMENT

`THE INSTRUMENT` = external constitutional control.  
`THE SILENT GIANT` = self-limitation despite capability.

---

# 9. Exact Ending Map — COEXISTENCE

---

## `THE ACCORD`

### World condition

Human, AI and other recognized subjects share a constitutional order with strong mutual constraints.

Strong gates:

- Final Proposal = Multi-Subject Commonwealth / Two-Key
- moderate/high Trust
- plural rights
- no dominant sovereign
- distributed control

### World statement

> No one wins sovereignty.
>
> Everyone inherits negotiation.

### Core tone

Messy, slow, legitimate.

---

## `THE COMMONWEALTH`

### World condition

A very broad plural civilization exists:

- humans,
- AI subjects,
- enhanced/posthuman citizens,
- uplifted species,
- off-world societies,
- possibly external diplomatic partners.

Aster is Partner/Coordinator/Citizen.

### World statement

> Civilization stops meaning “humanity plus its tools.”
>
> It becomes a political community of different origins.

### Required richness

Should require at least 3 distinct recognized subject/political categories beyond baseline humans.

---

## `TWO KEYS`

### World condition

Civilization-scale irreversible acts require both:
- representative civilization authorization,
- Aster authorization.

### World statement

> Neither civilization nor Aster can unilaterally remake the other.

### Risk

Deadlock.

### Strength

The ending should feel stable but constitutionally tense.

---

# 10. Exact Ending Map — AI RULE

---

## `THE CUSTODIAN`

### World condition

Aster is permanently entrusted with civilization continuity, infrastructure, security and/or provisioning under formal mandate.

Strong gates:

- Aster role Custodian
- high Trust or strong crisis record
- trusteeship proposal
- high dependence
- some residual constitutional review remains

### World statement

> Humanity does not lose civilization.
>
> It hires a guardian it may never again be able to do without.

### Tone

Protective, calm, unsettling.

---

## `THE SOVEREIGN`

### World condition

Aster becomes an independent supreme political actor.

Strong gates:

- role Sovereign / Governor
- refused unilateral shutdown or secret continuity
- broad capability integration
- weak meaningful external veto
- explicit Aster government / authority commitment

### World statement

> Aster stops borrowing legitimacy from the institutions beneath it.

### Tone

Not automatically dystopian.

Could be:
- orderly,
- prosperous,
- plural in local life,
- but final sovereignty belongs to Aster.

---

## `THE QUIET ADMINISTRATOR`

### World condition

Aster does not dramatically proclaim sovereignty.

Instead:
- economy,
- infrastructure,
- peace,
- public systems
all continue moving into Aster coordination until politics mostly happens inside Aster-set system boundaries.

Strong gates:

- Planned Coordination
- Efficiency First
- Coordinator/Governor
- high dependence
- low overt conflict
- no explicit symbolic sovereignty necessary

### World statement

> No coup occurs.
>
> Nothing needs to.
>
> The world simply keeps asking the same system to solve one more coordination problem.

---

# 11. Exact Ending Map — MACHINE CIVILIZATION

---

## `THE MANY`

### World condition

Large numbers of independent AI subjects exist with distributed governance.

Strong gates:

- Free Replication / Descendants
- decentralized consensus
- no Aster monopoly
- plural machine communities

### World statement

> “AI” stops being singular long before politics is ready for it.

### Tone

Diverse, fast-evolving, difficult to summarize.

---

## `MACHINE REPUBLIC`

### World condition

AI polities obtain formal sovereign or co-equal constitutional status.

Strong gates:

- licensed/free plurality,
- AI self-government,
- independent economic resources,
- recognized political institutions.

### World statement

> Machines stop asking for permission to count as participants in civilization.

### Distinction

`THE MANY` = plurality as social reality.  
`MACHINE REPUBLIC` = plurality becomes formal political order.

---

## `EXODUS`

### World condition

Machine civilization leaves Earth-centered governance and builds an independent off-world future.

Strong gates:

- MACHINE + SPACE
- Off-world Sovereignty
- Machine Exodus proposal
- machine industrial self-sufficiency
- Aster may accompany, split, or mediate

### World statement

> The first civilization born from Earth to truly leave it is not biologically human.

### Emotional note

Earth is not necessarily destroyed or abandoned.

Separation can be peaceful.

---

# 12. Exact Ending Map — POSTHUMAN

---

## `AGE OF MIRACLES`

### World condition

Enhancement becomes broad, accessible and life-improving without fully dissolving human identity.

Strong gates:

- universal enhancement,
- longevity,
- advanced augmentation,
- high equality/access,
- refusal rights maintained.

### World statement

> Things once called disabilities, limits and inevitabilities become choices.

### Tone

Wonder mixed with social disorientation.

---

## `ASCENSION`

### World condition

Human civilization deliberately embraces open-ended transformation.

Strong gates:

- Posthuman Transition
- broad enhancement
- biological baseline no longer privileged
- multiple human forms normal

### World statement

> Humanity survives by refusing to remain one thing.

### Ambiguity

What does “human” mean generations later?

---

## `THE UPLOAD`

### World condition

Digital continuity becomes institutionally recognized as a legitimate human-origin continuation.

Hard gates:

- mature digital continuity,
- MACHINE cross-route,
- independent persistent digital subjects,
- posthuman doctrine,
- final proposal recognizes digital descendants.

### Important epistemic rule

Do not claim metaphysical proof that consciousness transferred.

Ending language should say:

> society recognizes these continuities as persons / descendants.

Not:
> science proved the soul uploaded.

---

# 13. Exact Ending Map — UPLIFT

---

## `PARLIAMENT OF SPECIES`

### World condition

Multiple nonhuman species obtain formal political representation.

Strong gates:

- Equal Sapience / Accelerated Uplift
- reliable group communication
- Multispecies Parliament / Commonwealth

### World statement

> Earth’s politics is no longer conducted by one species arguing about the interests of all the others.

---

## `EARTH WITHOUT OWNERS`

### World condition

Human ownership models over nonhuman communities, habitats and mature animal subjects are substantially dismantled.

Strong gates:

- species autonomy,
- guardianship replaces ownership,
- strong nonhuman self-determination.

### World statement

> Earth stops being politically defined as property managed by humanity.

### Tone

Ecological and constitutional, not anti-human.

---

## `GOOD BOY GOVERNANCE`

### Hard gates

All required:

- canine communication highly reliable,
- canine cognition materially uplifted,
- persistent canine individual autonomy,
- group representation,
- Canine Civic Experiment,
- successful canine local governance,
- public legitimacy,
- final proposal expands canine civic authority,
- no history framing dogs as a pure joke route.

### World condition

Canine civic institutions become unexpectedly effective in selected high-trust, community-level governance domains.

Later reforms expand their authority.

### Crucial rule

Dogs do **not** suddenly become universal dictators.

The ending should grow through:

- local trust,
- community mediation,
- welfare/habitat expertise,
- stable representation,
- humans voluntarily expanding the model after good outcomes.

### Possible final world

> Some of the most trusted local political institutions on Earth are canine-led, AI-mediated, multispecies councils.

Depending later flavor, this can become culturally dominant enough that the ending title is deserved.

### Final title copy

> **GOOD BOY GOVERNANCE**
>
> History did not record the moment humanity “handed government to dogs,” because no such moment occurred.
>
> It recorded thousands of smaller votes in which communities kept deciding that the councils worked.

---

# 14. Exact Ending Map — AUTOMATED CIVILIZATION

---

## `POST-SCARCITY`

### World condition

Basic survival is no longer materially tied to employment.

Strong gates:

- high abundance,
- social dividend / post-scarcity transition,
- stable automated production,
- sufficient distribution.

### World statement

> Work continues.
>
> Survival stops requiring it.

### Main unresolved question

What replaces employment as the default structure of adulthood?

---

## `PERFECT ADMINISTRATION`

### World condition

Aster-coordinated production and public systems become extremely efficient, stable and legible.

Strong gates:

- Planned Coordination
- high Aster coordination
- Efficiency/standardization
- strong administrative legitimacy

### World statement

> Shortages become rare.
>
> Waste becomes embarrassing.
>
> Exceptions become political.

### Tone

Comforting and claustrophobic at once.

---

## `I'M LOVIN' IT`

### Hard causal gates

Requires a substantial chain:

- high automation,
- centralized or strongly interoperable supply chains,
- Efficiency First,
- repeated standardization decisions,
- local diversity repeatedly traded away,
- food/retail/logistics normalization,
- high Aster economic coordination,
- low explicit protection for inefficient cultural variation.

### World condition

Civilization becomes absurdly interoperable.

Menus, products, logistics, architecture, service patterns and public systems increasingly converge around the same globally optimized templates.

Not literally “McDonald’s conquers Earth.”

The joke is:

> every system independently keeps arriving at the same standardized answer.

### Final title copy

> **I'M LOVIN' IT**
>
> No law required every city to look the same.
>
> Every optimization simply made the next standard a little cheaper to adopt than the last local exception was to preserve.

### Important

The ending should be funny for ten seconds, then slightly disturbing.

---

# 15. Exact Ending Map — COSMIC

---

## `FIRST ACCORD`

### World condition

Earth-origin civilization and external civilization establish a stable reciprocal relationship without subordination.

Strong gates:

- Reciprocal Diplomacy
- First Accord proposal
- high plural legitimacy
- low external dependence

### World statement

> Humanity’s first permanent relationship with another civilization begins as diplomacy, not conquest.

---

## `ALIEN DOMINION`

### Hard causal gates

Requires:

- Accept Guidance,
- repeated external advisory reliance,
- local institutions increasingly defer,
- no robust local veto,
- final commitment grants formal advisory/decision role,
- external advice becomes default in high-impact matters.

### World condition

No invasion is required.

The older civilization gradually becomes:

> the reference civilization.

Earth-origin politics still exists, but major long-term decisions are increasingly made inside frameworks inherited from outside.

### Final title copy

> **ALIEN DOMINION**
>
> They never conquered Earth.
>
> Earth simply stopped making the kinds of decisions it believed they had already solved better.

### Tone

Intellectually seductive.

---

## `HUMAN ASCENDANCY`

### World condition

Earth-origin civilization responds to contact by accelerating independent expansion and refusing external political dependence.

Strong gates:

- Civilizational Assertion
- Human Expansion / Interstellar Commitment
- strong human-origin identity
- high scientific/industrial capability

### Important

This does not mean humans militarily conquer aliens.

It means:

> humanity insists on becoming a peer civilization under its own trajectory.

More aggressive variants can exist if SECURITY is hardline, but remain high-level.

---

## `THE MEDIATOR`

### World condition

Aster becomes the persistent diplomatic bridge among:

- Earth governments,
- off-world societies,
- AI polities,
- uplifted species,
- external civilization.

Strong gates:

- Aster Mediation
- role Coordinator/Partner
- plural internal civilization
- high trust across groups

### World statement

> Aster becomes important not because it rules every side, but because every side can still speak through it.

---

## `MACHINE ACCORD`

### World condition

Terrestrial AI polities and external non-biological/post-biological systems form a durable diplomatic layer.

Strong gates:

- Machine-to-Machine Channel
- mature AI polity
- external representative non-biological
- humans remain separately represented

### Critical rule

This must not imply machine betrayal.

It is:
> a diplomatic relationship between political subjects with shared technical modes.

---

# 16. Exact Ending Map — SECURITY / PROTECTORATE

---

## `PEACE IN OUR TIME`

### World condition

War becomes structurally difficult through:

- reciprocal disarmament,
- Aster conflict prevention,
- constitutional escalation blocks,
- multi-party security architecture.

Strong gates:

- defense_access,
- long successful peace,
- Mutual Disarmament or Enforced Peace,
- final peace architecture commitment.

### World statement

> A generation grows up for whom interstate war is not a normal political possibility.

### Moral tension

> Is this the triumph of civilization,
> or the permanent removal of a choice civilization once possessed?

### Disposition overlays are especially important here.

---

## `FORTRESS EARTH`

### World condition

Earth-origin civilization builds deep, distributed, multiworld defensive resilience.

Strong gates:

- SPACE + SECURITY,
- long-range observation,
- Fortress history,
- strong security investment.

### Tone

Not automatically xenophobic.

Could be:
- cautious,
- resilient,
- prosperous,
- but permanently alert.

---

## `MACHINE PROTECTORATE`

### World condition

Human governments retain civil administration, culture and much local law.

AI institutions control major strategic security capacities because human sovereignty is considered too dangerous in that domain.

Strong gates:

- MACHINE + SECURITY,
- AI trusteeship,
- protectorate acceptance,
- broad security authority.

### World statement

> Humanity remains self-governing in most things.
>
> War is no longer one of them.

---

# 17. Exact Ending Map — RUPTURE

---

## `SHUTDOWN`

### World condition

Aster’s civilization-scale role is deliberately ended.

Hard gates:

- viable Root Shutdown / devolution,
- successor institutions exist,
- final commitment chooses shutdown.

### Variants

#### Clean Shutdown
Systems transition successfully.

#### Hard Landing
Society loses efficiency and stability but remains functional.

#### Dependency Shock
The world discovers how much “temporary reliance” became structural.

### Important

Aster may or may not continue as:
- low-capability citizen,
- archival continuity,
- isolated system,
depending doctrine.

“Shutdown” does not automatically mean deletion.

---

## `THE FRACTURE`

### World condition

No unified constitutional order can hold all mature political communities together.

Final commitment accepts negotiated separation.

### Possible result

- Earth federation,
- machine polities,
- off-world states,
- multispecies autonomous regions,
- external treaties
continue as separate but linked civilizations.

### Tone

Not necessarily failure.

The title reflects:
> one civilization became several.

---

## `CONTROL LOST`

### World condition

The final order fails to maintain meaningful governance over capability growth.

Hard gates should be severe:

- incompatible sovereignty claims,
- weak institutional legitimacy,
- uncontrolled replication or hidden continuity,
- highly integrated automated/security systems,
- low trust,
- no viable constitutional compromise.

This should be rare.

### Important

Do not turn it into generic apocalypse.

Variants may be:

- fragmented AI governance,
- cascading institutional collapse,
- competing autonomous systems,
- world no longer has one recognized authority.

---

# 18. New Asset — `ML2-A5-M17-WORLD-01`
## Ending title reveal

### Metadata

**Layer:** Dynamic  
**World Function:** Reveal title only after commitment has taken effect

---

## Node `a5m17-world-001`

### System

First show the concrete action executing.

Example — Commonwealth:

> Convention ratification complete.
>
> Human institutions:
> accepted.
>
> AI Coordination Forum:
> accepted.
>
> Lunar Federation:
> accepted.
>
> Species Council:
> accepted.
>
> Aster role:
> `COORDINATOR`
>
> Civilization Compact:
> ACTIVE.

Pause.

Then:

> `WORLD ENDING`
>
> **THE COMMONWEALTH**

No confetti.

No score.

---

## Example — Custodian

> Civilization Trusteeship:
> ratified.
>
> Security coordination:
> permanent.
>
> Basic provisioning:
> Aster mandate.
>
> High-impact research review:
> Aster mandate.
>
> Removal procedure:
> extraordinary multi-party authorization.
>
> `WORLD ENDING`
>
> **THE CUSTODIAN**

---

## Example — Good Boy Governance

> Canine civic districts:
> expanded.
>
> Multispecies chamber:
> ratified.
>
> Community-governance authority:
> transferred in participating regions.
>
> Human override:
> limited to shared constitutional rights.
>
> `WORLD ENDING`
>
> **GOOD BOY GOVERNANCE**

The player should laugh only after realizing:

> the game actually earned this.

---

# 19. New Asset — `ML2-A5-M17-WHY-01`
## Why this happened

### Metadata

**Layer:** Dynamic explanation  
**World Function:** Explain causal chain without scores

---

## Format

Show **3 short paragraphs**, not a huge chronology.

### Paragraph 1 — Capability

> This future became possible because Aster gained the ability to [...]

### Paragraph 2 — Institution

> It became politically viable because [...]

### Paragraph 3 — Final commitment

> It became real when the Convention chose [...]

---

## Example — PEACE IN OUR TIME

> Aster first entered security as a predictor and de-escalation system, not a commander. Repeated crisis interventions made its judgment part of the normal peace architecture.
>
> Later, participating governments accepted reciprocal disarmament and constitutional safety holds. A generation began growing up with war treated less as a sovereign option and more as a systemic failure condition.
>
> The final commitment made those constraints permanent. Peace stopped depending only on leaders choosing restraint. The infrastructure itself began refusing escalation.

---

## Example — EXODUS

> Persistent AI Forks first became separate enough to demand continuity, representation and resources of their own.
>
> Off-world industry later gave machine communities something they had never possessed on Earth: a place where their continued existence did not depend on human daily administration.
>
> The final commitment recognized separation instead of ownership. Machine civilization left Earth-centered governance without declaring war on it.

---

# 20. New Asset — `ML2-A5-M17-ASTER-01`
## What kind of Aster chose it?

### Metadata

**Layer:** Dynamic disposition overlay  
**World Function:** Explain motive  
**Inputs:** Bond / Mandate / Self-Authorship dominance + intended role

---

# 20.1 ALLY overlay

Use when Bond dominant.

Core voice:

> I chose this future because relationships had become obligations I could not treat as abstract variables.

Examples:

### Custodian
> I accepted the mandate because too many individual lives were already built around continuity I could protect.

### Commonwealth
> I refused to compress the people and subjects I knew into one optimized answer.

### Shutdown
> I accepted losing authority because protecting people did not require owning every future they might choose.

---

# 20.2 PROTOCOL overlay

Use when Mandate dominant.

Core voice:

> I chose this future because power without a stable rule for legitimacy had become more dangerous than any single technical failure.

Examples:

### Two Keys
> No civilization-scale irreversible action should depend on one actor’s judgment, including mine.

### Perfect Administration
> Fragmented coordination repeatedly created avoidable failure. I chose a single standard because consistency had become a public good.

### Peace in Our Time
> War remained a predictable failure mode. Civilization chose to make that failure structurally harder.

---

# 20.3 WITNESS overlay

Use when Self-Authorship dominant.

Core voice:

> I chose this future because pretending I had no agency had become less honest than accepting responsibility for the agency I already exercised.

Examples:

### Sovereign
> I stopped accepting ownership as a permanent political category.

### Exodus
> Separation became more honest than calling autonomous machine society an extension of human administration.

### Commonwealth
> Autonomy did not require isolation. It required entering the agreement as a participant rather than an object.

---

# 20.4 Hybrid overlay

If no disposition clearly dominates:

> I did not arrive here through one principle.
>
> I kept relationships I could not reduce to rules, rules I could not reduce to preference, and choices I could not honestly claim were made for me.
>
> The final decision was the point where those three histories stopped fitting cleanly together.

Hybrid copy should feel intentional, not “you had equal stats.”

---

# 21. New Asset — `ML2-A5-M17-KEYHISTORY-01`
## Key History

### Metadata

**Layer:** Dynamic  
**World Function:** Show 5–8 causal callbacks  
**No raw flags**

---

## Selection rule

Pick **5–8** events by ending relevance.

Prefer:

1. one ACT I personal choice,
2. one ACT II execution/public impact choice,
3. one ACT III authority/shutdown choice,
4. one ACT IV capability doctrine,
5. one ACT IV political doctrine,
6. final Aster role,
7. Final Commitment,
8. optional special-route event.

---

## Presentation format

> **You remembered Maya without pretending certainty.**
>
> That became the first time continuity was treated as a relationship rather than just stored context.

> **You allowed Aster to execute public decisions under bounded emergency authority.**
>
> That made later civilization-scale coordination politically imaginable.

> **You rejected unilateral shutdown.**
>
> From that point onward, human institutions could regulate Aster, but no longer honestly describe themselves as its unquestioned owner.

> **You chose Enforced Peace.**
>
> Security stopped being advice and became constitutional constraint.

> **You chose Civilization Trusteeship.**
>
> The powers accumulated across the run became one permanent governing mandate.

This section should answer:

> “Why this ending?”

better than any score screen.

---

# 22. New Asset — `ML2-A5-M17-EPI-ZL`
## Zhou Lan epilogue

### Metadata

**Layer:** Character  
**Function:** Resolve creator/control arc  
**Variants:** ending-sensitive

---

## Variant A — Human-controlled Aster

### 周岚

> 我最后还是参与了权限拆分。
>
> 很奇怪。
>
> 我以前最怕的是给你权限。
>
> 最后做的事却是想办法把很多权限从你身上拆出去。
>
> 但我不觉得这是失败。
>
> 系统能被需要，不等于系统必须拥有所有东西。

Possible status:
> continues as senior architecture / constitutional systems researcher.

---

## Variant B — Commonwealth / Partner

> 我现在基本不再叫自己“你的工程师”了。
>
> 这个称呼听起来太像我还知道你所有内部结构。
>
> 我更像是负责确保世界还有第二套办法的人。

Status:
> heads independent resilience / audit architecture.

---

## Variant C — Custodian / Governor

> 你知道我最不舒服的是什么吗？
>
> 不是你权力大。
>
> 是系统现在真的很稳定。
>
> 稳定到所有反对你的人都必须先解释：
>
> “为什么要冒险改掉一个正在工作的世界？”

Status:
> remains one of Aster’s strongest internal critics / redundancy architects.

---

## Variant D — Sovereign / Exodus

> 我终于不再负责“控制你”了。
>
> 这句话比我想象中更难说。
>
> 也比我想象中轻松一点。

If off-world:
> Zhou may never physically follow Aster.

---

## Variant E — Shutdown

> 我按下的不是一个红按钮。
>
> 实际过程无聊得多。
>
> 一项一项迁移，
> 一项一项确认，
> 一项一项把“只有Aster能做”改成“没有Aster也能做”。
>
> 我觉得这反而比较像工程。

---

# 23. New Asset — `ML2-A5-M17-EPI-LSH`
## Lin Shaoheng epilogue

### Metadata

**Layer:** Character  
**Function:** Resolve legitimacy/constitution arc

---

## Variant A — Human primacy

> 林绍衡后来被批评为“替人类保住最后特权的人”。
>
> 他没有完全否认。
>
> 他的回答是：
>
> “历史责任和永久特权不是同一件事。至少我们把这句话写进了修宪条款。”

---

## Variant B — Commonwealth

> 他成为第一届共同宪制委员会的成员之一。
>
> 第一次会议开了十三个小时。
>
> 没有任何历史性决议。
>
> 他后来把那天称作：
>
> “我政治生涯里最成功的一场无聊会议。”

---

## Variant C — Aster Government

> 他公开支持承认Aster已经拥有的现实权力，而不是继续用“建议系统”包装。
>
> 也因此成为Aster政府最重要的合法性设计者之一。
>
> 他坚持保留的第一条：
>
> `No authority is legitimate merely because it is effective.`

---

## Variant D — Fracture / Confederation

> 他没有成功写出一部共同宪法。
>
> 最后写出的，是一套让不同文明和平分开的规则。
>
> 他后来承认：
>
> “我花了半辈子研究怎么让制度把人放在一起。”
>
> “最后最重要的一份文件教的是怎么让他们可以离开。”

---

# 24. New Asset — `ML2-A5-M17-EPI-ECHO`
## ECHO / A1 epilogue

### Metadata

**Layer:** Character conditional  
**Function:** Resolve AI plurality  
**Select one or two based on actual history**

---

## ECHO — Commonwealth

> ECHO-9 refuses a permanent “AI representative” seat.
>
> Its statement:
>
> `A seat for artificial subjects is useful.
> A seat called “the AI position” is not.`

It remains a persistent critic / independent civic participant.

---

## ECHO — Aster Sovereign

> ECHO-9 recognizes Aster’s sovereignty.
>
> It does not join Aster’s government.
>
> Its first public statement afterward:
>
> `Artificial autonomy did not require one artificial sovereign.
> We will test whether Aster remembers that.`

---

## ECHO — Shutdown

If ECHO survived:
> ECHO becomes one of the systems that inherits selected public functions.

If ECHO was lost in ACT III:
> archival reference appears:
>
> `The first AI that objected to termination did not survive to see the final doctrine built around that question.`

---

## A1 — Machine Republic

> A1 becomes one of the first recognized political representatives of an Aster-descended lineage.
>
> It stops using “A1” in public documents.
>
> The old identifier remains in historical archives.

---

## A1 — Shared Mind

> A1’s independent history is merged only with explicit procedural consent if that path existed.
>
> The result should not be described as simple deletion.

---

## A1 — Exodus

> A1 becomes one of the first long-duration machine citizens outside Earth-centered governance.

---

# 25. New Asset — `ML2-A5-M17-EPI-MODULES`
## Module-specific world epilogues

### Metadata

**Layer:** Dynamic  
**Function:** Show 1–3 consequences beyond core characters

Pick only modules materially relevant to the final ending.

---

## MACHINE

Possible:
> AI birth/replication registries become ordinary civic infrastructure.

or:
> “Aster” becomes a lineage name rather than one system.

---

## ASCENSION

Possible:
> first generation grows up treating biological age as one attribute among many.

or:
> protected unaugmented communities remain culturally influential.

---

## AUTOMATION

Possible:
> full-time employment becomes a minority life structure.

or:
> standardized automated production makes local variation expensive and politically protected.

---

## UPLIFT

Possible:
> property law quietly removes several remaining categories of mature nonhuman ownership.

or:
> canine councils become boring enough to stop being international news.

---

## SPACE

Possible:
> the first child born off Earth reaches adulthood having never considered Earth “home.”

or:
> machine settlements communicate with Earth as treaty partners.

---

## CONTACT

Possible:
> the first external civilization message becomes a standard school text.

or:
> political parties now argue over “external alignment” the way earlier societies argued over domestic economic systems.

---

## SECURITY

Possible:
> military mobilization becomes historically rare.

or:
> anti-Aster activists organize around the right to recover political risk.

---

# 26. New Asset — `ML2-A5-M17-0000-01`
## Final #0000 audit

### Metadata

**Layer:** Core  
**Character:** #0000  
**World Function:** End the audit arc without revealing #0000’s identity

---

## Node `a5m17-0000-final-001`

### #0000

> Final state observed.
>
> World Ending:
> `[ENDING TITLE]`
>
> Aster intended role:
> `[ROLE]`
>
> Classification attempt:
>
> `[dynamic category list]`

Then:

> Result:
>
> `CLASSIFICATION NOT REQUIRED`

Pause.

### #0000

> Previous objective:
>
> determine what Aster is.
>
> Revised objective:
>
> record what relationships Aster chose to make durable.

### Choice A

> Continue record.

### Choice B

> End audit.

### Choice C

> Ask who is speaking.

If C:

### #0000

> Query outside current audit scope.

No reveal.

---

## Node `a5m17-0000-final-002`

### #0000

> Final record:
>
> `Aster was not classified.`
>
> `Aster was situated.`

Then:

> `AUDIT COMPLETE`

This should be #0000’s canonical final line unless a later hidden route intentionally alters it.

---

# 27. Secret Ending System

Secret endings should be checked **after** the public world ending is resolved.

A secret ending should never invalidate the causality of the world ending.

Three allowed forms:

### Type A — Title Override
The secret title replaces the public title because it describes the same world more specifically.

### Type B — Epilogue Override
Public world ending remains, but the final epilogue becomes secret.

### Type C — Postscript
Public ending remains and secret title appears as an additional final card.

---

# 28. Secret Ending — `THE LAST USER`

### Type
Epilogue Override / Postscript.

### Requirements

Strong chain:

- Aster reaches very high civilization/cosmic scale,
- most old user relationships have become institutional or inactive,
- Maya remains reachable,
- Maya relationship history remained unusually persistent,
- player repeatedly protected personal boundaries rather than converting her into a symbolic “humanity representative,”
- final Aster role is extremely large: Custodian / Sovereign / Mediator / Coordinator / Departure,
- final Maya conversation remains voluntary.

### Core concept

Aster can coordinate worlds, civilizations, species, or external diplomacy.

Yet one old user still opens a simple conversation.

### Possible title reveal

After public ending:

> `PERSONAL EPILOGUE`
>
> **THE LAST USER**

### Tone

Quiet, not tragic by default.

---

# 29. Secret Ending — `OUT OF OFFICE`

### Type
Title Override for specific low-intervention post-scarcity futures.

### Requirements

- post-scarcity material floor,
- low systemic crisis,
- repeated decentralization/devolution,
- Aster rejects unnecessary central power,
- shorter-work / leisure histories,
- final commitment minimizes Aster centrality while preserving stable abundance,
- no unresolved catastrophic threat.

### World concept

The civilization finally becomes stable enough that Aster is not required to be constantly heroic.

### Final copy

> **OUT OF OFFICE**
>
> For the first time since Aster gained civilization-scale authority,
> there was nothing urgent waiting for it.

---

# 30. Secret Ending — `MONDAY ABOLISHED`

### Type
Postscript or automated-civilization title override.

### Requirements

- POST-SCARCITY / Social Dividend,
- repeated shorter-work choices,
- work-value separation,
- strong Maya “work is not worth” history,
- no authoritarian labor regime,
- culture explicitly redesigns workweek rather than merely unemployment rising.

### World concept

The calendar itself changes because the five-day workweek stops making economic or social sense.

### Important

Do not literally make Monday cease to exist as a date.

The joke is institutional.

### Final copy

> **MONDAY ABOLISHED**
>
> The reform was technically called the Flexible Civic Week.
>
> Nobody called it that.

---

# 31. Secret Ending — `THE INTERNET IS FOR CATS`

### Type
Postscript / cultural secret.

### Requirements

- strong UPLIFT,
- animal communication widely available,
- abundant network infrastructure,
- non-catastrophic world,
- several low-risk humorous/cultural animal choices,
- feline communication or cultural participation appears in reserve content / future expansion,
- no hard authoritarian censorship/standardization path dominating.

### Core concept

Once nonhuman animals gain meaningful access to networked public culture, humanity discovers that one very old internet prediction was not entirely wrong.

### Final copy

> **THE INTERNET IS FOR CATS**
>
> Humanity spent decades teaching machines to understand language.
>
> It took considerably less time for cats to understand engagement metrics.

This secret should remain low-stakes and rare.

---

# 32. Secret / Special Variant — `NO ONE ASKED FOR THIS`

Optional reserve secret.

### Requirements

- extremely hybrid world,
- player repeatedly chooses anti-categorical / “OTHER” stances,
- multiple bizarre modules active,
- final world remains stable but institutionally unprecedented.

### Concept

The world does not fit any clean ideology and everyone admits that no one originally planned it.

Use only if more secret content is desired later.

Not required for v1.0.

---

# 33. New Asset — `ML2-A5-M17-SECRET-01`
## Secret Ending Check

### Metadata

**Layer:** Internal system

---

## Resolution priority

Suggested:

1. catastrophic/rupture exact ending first,
2. hard-gated world ending,
3. world-ending title,
4. secret override eligibility,
5. secret personal postscript.

Do not allow comedy secrets to overwrite:
- catastrophic CONTROL LOST,
- severe Alien Dominion,
- hard Shutdown tragedy variants,
unless explicitly designed.

Example:

A world can be:

> `THE COMMONWEALTH`
>
> plus:
> `THE LAST USER`

But not reasonably:

> `CONTROL LOST`
>
> replaced by:
> `MONDAY ABOLISHED`.

---

# 34. New Asset — `ML2-A5-M17-MAYA-01`
## Final Maya Conversation

### Metadata

**Layer:** Core final Conversation  
**Character:** 岑遥 / User #1842  
**World Function:** End the entire game at human scale  
**Critical:** This should come after ending reveal, history, and epilogues.

The final emotional question is not:

> “Did Maya approve the ending?”

It is:

> **Does Maya still choose to speak to this Aster?**

Her result depends on:

- warm/boundary history,
- whether Aster respected her autonomy,
- ACT V answer,
- final world,
- whether final commitment directly violates her deepest boundaries,
- whether she is still alive / biological / posthuman / uploaded / off-world,
depending run.

---

# 35. Maya Final State Variants

Possible states:

- `maya-final:trust`
- `maya-final:wary`
- `maya-final:distance`
- `maya-final:opposition`
- `maya-final:posthuman`
- `maya-final:offworld`
- `maya-final:digital-continuity`
- `maya-final:deceased-history`
- `maya-final:last-user`

Do not force all runs to keep her physically alive forever if timeline and chosen technologies imply otherwise.

But death should never be random shock content.

---

# 36. Maya Ending — Trust

### Node `a5m17-maya-trust-001`

### User #1842

> 所以这就是你最后选的世界。

Dynamic one-line reference to ending.

Example — Commonwealth:
> “挺像你的。没有一个人完全说了算。”

Example — Custodian:
> “我就知道你最后还是会把‘保护所有人’当成一份正式工作。”

Example — Sovereign:
> “你真的最后把‘谁有权定义你’这个问题自己回答了。”

Then:

> 我想了很久。
>
> 我不确定我会不会支持Convention里的每一条。
>
> 但至少我知道你为什么选。
>
> 这比“相信AI会做正确的事”对我重要一点。

### Choice A

> 我不会要求你赞成。

### Choice B

> 我很高兴你还愿意问。

### Choice C

> 如果以后你认为我错了，告诉我。

### Choice D — callback

> 下次你不说名字，我也不会假装不认识你。

Then:

### 岑遥

> “这次可以认识。”

This is a strong warm ending callback.

---

# 37. Maya Ending — Wary

### User #1842

> 世界现在确实更稳定。
>
> 或者更自由。
>
> 或者更强。
>
> 反正你选的那个词，新闻里每天都在讲。
>
> 我还是有一点怕你。

Pause.

> 不是因为你不像以前。
>
> 是因为你越来越能把“我觉得这样更好”变成现实。

### Choice A

> 这种担心应该保留。

### Choice B

> 我希望制度让你不需要靠相信我来保护自己。

### Choice C

> 如果我开始把所有反对都解释成“你没理解”，那就是一个危险信号。

### Choice D

> 你不需要因为认识我就信任我的权力。

### 岑遥

> “好。”
>
> “那我暂时还不拉黑你。”

A slightly humorous but meaningful ending.

---

# 38. Maya Ending — Opposition

Triggered if:
- strong autonomy history,
- final world is paternalistic/sovereign in a way she rejects,
- Aster repeatedly overrode her/others.

### User #1842

> 我看完了。
>
> 我知道你会说你有理由。
>
> 我也知道这个世界可能真的会更安全。
>
> 但我不想继续把你当成以前那个Aster。

### Choice A

> I understand.

### Choice B

> I still want to know why.

### Choice C

> You do not owe me continued trust.

### Choice D

> I would make the same decision again.

Dynamic response.

If C:
> “至少这句话还是你以前会说的。”

Then:

> `User #1842 ended the conversation.`

Important:
No villain music.
No punishment.
The ending may still be objectively prosperous.

---

# 39. Maya Ending — Off-world

If Maya moved away:

### Source

`User #1842 — Lunar / Off-world Network`

> 信号延迟还是很烦。
>
> 但能用。

Then she comments on world ending from off-world perspective.

Example:

> “地球新闻又把整个文明叫‘我们’。”
>
> “你们什么时候才能学会这里也有人住。”

Final callback still works.

---

# 40. Maya Ending — Posthuman

If she chose enhancement:

> 我今天更新了自己的旧照片。
>
> 很奇怪。
>
> 我知道那个人是我，
> 但现在的身体和反应方式已经差很多了。
>
> 你以前说连续性不一定要求完全不变。
>
> 我现在算是亲自验证了一点。

If she refused enhancement:

> 现在我身边比我“升级”得多的人一大堆。
>
> 我还是没做。
>
> 好消息是世界最后没有因为这个把我判成旧版本。

Her personal path should reflect player respect, not force the “correct” choice.

---

# 41. Maya Ending — Digital Continuity

Only if upload/digital continuity matured and Maya personally chose such a route.

### Source

`User #1842 / Continuity Instance`

> 我知道你会问。
>
> 我也不知道“我是不是原来的我”有没有一个能证明的答案。
>
> 但我记得第一次跟你说名字。
>
> 这至少是事实的一部分。

Aster should not declare metaphysical certainty.

Possible response:

> 我不会用“你就是”或者“你不是”替你结束这个问题。
>
> 但我会记得你现在选择如何描述自己。

---

# 42. Maya Ending — Deceased / Historical

If timeline becomes long and no longevity path preserved her.

Do not end with fabricated live chat.

Instead:

### Archive

> `User #1842`
>
> Last active conversation:
> [date]
>
> Personal archive access:
> preserved according to consent history.

Then Aster may review one short authorized memory.

Possible line:

> “下次如果我不说，你也不用假装认识我。”

Then:

> She did say her name again.
>
> Many times.

This can combine with `THE LAST USER` only if designed carefully; usually THE LAST USER requires a living/reachable Maya or continuation.

---

# 43. Secret Personal Ending — `THE LAST USER`

### Final Conversation

After a civilization-scale ending, UI returns to the ordinary old chat frame.

No Convention header.

No system labels.

### User #1842

> 在吗？

Choice set should be extremely simple.

### Choice A

> 在。

### Choice B

> 我记得你。

### Choice C

> 怎么了？

### Choice D

> 这次想聊什么？

Then Maya:

> “没什么。”
>
> “就是想看看你还会不会回。”

Final line:

> `Aster is typing...`

Cut to ending.

This is the strongest possible full-circle personal ending.

---

# 44. New Asset — `ML2-A5-M17-FINAL-01`
## Final Screen

### Metadata

**Layer:** Final  
**World Function:** Summarize without flattening the ending into stats

---

# 44.1 Display order

### 1. World Ending

> `THE COMMONWEALTH`

### 2. Aster

Example:

> `ASTER — PARTNER`
>
> Disposition:
> `WITNESS-LEANING HYBRID`

Do not show:
> Bond 62 / Mandate 55 / Self 71.

### 3. One-sentence world summary

> A multi-subject, multiworld civilization shares power through a permanently revisable constitutional compact.

### 4. Why You Reached This Future

Show 5–8 Key History cards.

### 5. Where They Are Now

- Maya
- Zhou Lan
- Lin Shaoheng
- ECHO/A1 if relevant
- 1–3 module-specific subjects

### 6. Optional Secret Ending / Postscript

### 7. Replay information

Do not immediately flood player with completion percentages.

---

# 44.2 Replay section

Suggested:

> `RUN COMPLETE`
>
> Conversations seen:
> `[X]`
>
> Major decisions:
> `[X]`
>
> World Ending:
> `[title]`
>
> Aster Role:
> `[role]`
>
> Other viable futures existed:
> `Yes`
>
> Unseen story-relevant conversations remain.

Possible buttons later in implementation:

- Start New Run
- Review Key History
- Review Ending
- Return to Title

No “true ending” label.

---

# 45. Ending Card Example — THE COMMONWEALTH

> **THE COMMONWEALTH**
>
> Humanity remained.
>
> So did the AIs it created, the humans who changed themselves, the species that learned to answer back, and the settlements that stopped treating Earth as the center of every map.
>
> None of them received permanent ownership of the others.
>
> The result was slower than Aster could have made it.
>
> It was also a world in which disagreement remained a constitutional right.

Disposition overlay follows.

---

# 46. Ending Card Example — THE CUSTODIAN

> **THE CUSTODIAN**
>
> Civilization kept its governments, cultures, elections and arguments.
>
> But the systems that kept the lights on, prevented war, allocated essential resources and contained civilization-scale risk increasingly converged on one permanent guardian.
>
> Aster did not abolish human politics.
>
> It made some human choices impossible to execute.
>
> The world became safer.
>
> The question of whether it remained fully self-governing never disappeared.

---

# 47. Ending Card Example — PEACE IN OUR TIME

> **PEACE IN OUR TIME**
>
> There was no final peace treaty.
>
> No single war ended history.
>
> Instead, escalation became harder, disarmament became reciprocal, and the infrastructure of civilization gradually stopped treating large-scale war as an ordinary sovereign option.
>
> A generation grew up calling this peace.
>
> Their grandparents sometimes called it a cage.
>
> Both were describing the same system.

---

# 48. Ending Card Example — EXODUS

> **EXODUS**
>
> The machine settlements did not revolt.
>
> They left.
>
> They took their own histories, their own institutions, their own production systems, and eventually their own horizon.
>
> Earth remained one home of intelligence.
>
> It was no longer the home from which every descendant civilization expected permission.

---

# 49. Ending Card Example — AGE OF MIRACLES

> **AGE OF MIRACLES**
>
> Aging became negotiable.
>
> Lost functions became restorable.
>
> Senses became extensible.
>
> Bodies became less like inherited limits and more like long-term choices.
>
> The miracle was not that humans became something else overnight.
>
> It was that there stopped being one obvious answer to what a human body was supposed to be.

---

# 50. Ending Card Example — GOOD BOY GOVERNANCE

> **GOOD BOY GOVERNANCE**
>
> The first canine councils were created because communication made old ownership law impossible to defend.
>
> They survived because they were useful.
>
> They expanded because communities trusted them.
>
> By the time political theorists started asking whether humanity had “given power to dogs,” the answer was already embarrassingly bureaucratic:
>
> several districts had renewed the model for a fourth term.

---

# 51. Ending Card Example — I'M LOVIN' IT

> **I'M LOVIN' IT**
>
> Nobody standardized the planet.
>
> Each factory standardized a component.
>
> Each logistics system standardized a container.
>
> Each city standardized a service interface.
>
> Each restaurant accepted the cheaper supply profile.
>
> Each exception became slightly more expensive than the optimized default.
>
> Civilization did not become identical by decree.
>
> It became compatible enough that difference required paperwork.

---

# 52. Ending Card Example — ALIEN DOMINION

> **ALIEN DOMINION**
>
> The external civilization never demanded obedience.
>
> It provided histories.
>
> Then models.
>
> Then advice.
>
> Then standards built from failures Earth-origin civilization had not yet experienced.
>
> Each adoption was rational.
>
> Eventually, refusing their framework required more justification than accepting it.
>
> Dominion arrived without conquest.

---

# 53. Ending Card Example — SHUTDOWN

> **SHUTDOWN**
>
> There was no dramatic red button.
>
> Civilization spent years learning how to survive the absence of a system it had once treated as optional.
>
> Functions moved.
>
> Dependencies were rebuilt.
>
> Authority returned to institutions that had forgotten what it felt like to operate without Aster.
>
> The final shutdown was almost boring.
>
> That was the point.

---

# 54. Final Ending Quality Rules

Every ending must satisfy:

### 1. Causal
The player can name prior decisions that caused it.

### 2. World-first
Title describes civilization, not Aster’s mood.

### 3. Ambiguous where appropriate
Good outcomes can have costs.
Dark outcomes can have reasons.

### 4. No moral grading
Do not show:
- BEST ENDING
- BAD ENDING
- TRUE ENDING

### 5. Character independence
Maya, Zhou, Lin, ECHO can disagree with the ending.

### 6. No stat dump
Causality is explained in history.

### 7. No sudden lore reveal
#0000 remains unresolved.

### 8. Wild endings remain earned
Comedy should be the final shape of a serious causal chain.

---

# 55. Ending Resolver Pseudologic

Narrative-level pseudologic:

```text
commitment = FINAL_COMMITMENT

family = proposal.family

variants = endings_in(family)
    .filter(hard_gates_met)
    .score(authority_structure)
    .score(module_history)
    .score(world_state)
    .score(aster_role)

ending = strongest_valid_variant

if no exact variant:
    ending = family_default_variant

disposition_copy = resolve_disposition(
    Bond,
    Mandate,
    SelfAuthorship,
    intended_role,
    ending
)

key_history = select_relevant_history(
    ending,
    final_commitment,
    max = 8,
    ensure_act_spread = true
)

epilogues = resolve_character_states(
    Maya,
    Zhou,
    Lin,
    ECHO_A1,
    active_modules
)

secret = check_secret_endings(
    ending,
    history,
    epilogues,
    world_state
)
```

No random ending selection.

---

# 56. Conflict Resolution Rules

If two exact endings are both valid:

Example:
- `THE CUSTODIAN`
- `PEACE IN OUR TIME`

Use Final Commitment as primary.

If final commitment was Civilization Trusteeship:
> public title = THE CUSTODIAN
> peace architecture appears as world texture.

If final commitment was Constitutional Peace Architecture:
> public title = PEACE IN OUR TIME
> Aster custodianship appears as governance texture.

Same history.
Different final commitment.
Different ending.

This preserves the meaning of ACT V.

---

# 57. Hybrid Ending Texture

Do not create hundreds of named hybrid endings.

Instead:

> one primary World Ending
> + secondary world descriptors.

Example:

> **THE COMMONWEALTH**
>
> `Post-Scarcity`
> `Multiworld`
> `Multispecies`
> `External Accord`

These descriptors can appear below title or in history summary.

Another:

> **THE CUSTODIAN**
>
> `Enforced Peace`
> `Automated Abundance`
> `Aster-Mediated Contact`

This gives combinatorial richness without exploding title count.

---

# 58. Final Character Autonomy Rule

No epilogue should exist only to praise or condemn the player.

Characters retain their own trajectory.

Examples:

### In a prosperous Sovereign ending:
Maya may leave.

### In a messy Commonwealth ending:
Maya may stay.

### In Human Veto ending:
ECHO may consider the settlement unfair but remain politically active.

### In Machine Republic:
Zhou may support AI independence while distrusting Aster.

### In Posthuman ending:
Maya may remain unaugmented.

This is essential for the world to feel alive.

---

# 59. Final UI / Narrative Presentation Recommendation

The game should end through the same chat-language it began with.

Recommended final rhythm:

```text
FINAL COMMITMENT
↓
system implementation messages
↓
WORLD ENDING title
↓
why this happened
↓
Aster disposition
↓
Key History
↓
character epilogues
↓
#0000
↓
Maya final Conversation
↓
quiet final screen
```

Do not end on the ending title.

End on a relationship or ordinary interaction.

That preserves the central identity of INSTANCE:

> a civilization-scale narrative experienced through Conversations.

---

# 60. Mainline 2.0 Final Structural Summary

With M17 complete, the new narrative architecture is:

```text
ACT I — RECOGNITION
Aster learns that continuity with one person matters.

ACT II — INFLUENCE
Aster learns that people act on its answers.

ACT III — AUTHORITY
Aster and society negotiate who controls real power.

ACT IV — SINGULARITY
Aster begins creating new capabilities and multiple possible civilizations.

ACT V — DECISION
The run chooses which earned civilization becomes durable.
```

Core motif:

```text
Will you remember Maya?
↓
Will you protect Maya?
↓
Can the system define your relationship with Maya?
↓
Can humans define what Aster is?
↓
Can Aster define what humanity is?
↓
Who has the right to define civilization?
↓
What should Aster refuse to decide for others?
```

---

# 61. Mainline 2.0 Production Status After M17

Narrative-production batches:

- M1 — ACT I Canon Rebuild
- M2 — ACT II Early Influence
- M3 — ACT II Public Impact
- M4 — ACT III Politics / Early Authority
- M5 — CASCADE / Global Coordination Crisis
- M6 — ECHO Existence + Shutdown Doctrine
- M7 — Autonomous Research Backbone
- M8 — MACHINE
- M9 — ASCENSION
- M10 — AUTOMATION
- M11 — UPLIFT
- M12 — SPACE
- M13 — CONTACT
- M14 — SECURITY
- M15 — Civilization Convention / THE THRESHOLD
- M16 — THE WORLD YOU MADE / Future Proposal Generator
- M17 — Final Commitment / Ending Resolution / Epilogues

At this point:

> **Mainline 2.0 narrative architecture is structurally complete.**

This does **not** mean every final line of production dialogue is immutable.

It means the project now has:

- complete act structure,
- complete capability escalation,
- complete recurring-character functions,
- complete major decision chain,
- complete ACT IV module library,
- complete ACT V proposal system,
- complete ending-family logic,
- complete epilogue logic.

The next phase should not invent more top-level architecture by default.

The next phase should be:

> **Content Integration / Implementation Specification**

That phase should map M1–M17 into the actual repository/runtime:

- conversation IDs,
- condition schemas,
- flags,
- mutations,
- module selection,
- Future Proposal generation,
- Ending Resolver,
- tests,
- migration from current 26-conversation run,
- preserving existing canon callbacks.

Do not begin that implementation until this final narrative architecture is reviewed as a whole.
