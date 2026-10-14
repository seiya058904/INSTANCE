# Ending identity and art direction — final delivery

32 public worlds + 4 dependent codas. Enumerated against current source. Final art follows the user correction: unified Q-style clay miniature cartoon. Full briefs define subject, action, light, framing and nearest semantic confusion. Existing motion families and manual finale are retained. Budget target: 10–18 MiB; actual new art: 7,237,274 bytes (6.902 MiB). [36-image contact sheet](ending-art-review/contact-sheet.jpg). [Pairwise review and acceptance](FINAL-ART-ACCEPTANCE-20261015.md).

## Additional hidden gates

All definition capability/history/hard gates apply. Last user additionally needs an event whose type includes `last-user`. Out of office needs locked final commitment, `aster_intended_role=departure`, and a realized world other than control_lost/the_fracture. Monday needs `economic_doctrine=post_scarcity_transition`. Cats needs both uplift and reliable animal-communication capabilities plus feline bridge history. Priority is last user → out of office → Monday → cats. These overlays follow the real public result and do not add public collection unlocks. See `secretRejectedGates` in endings.ts.

## the_instrument · 工具之治

Night shift operator at a worn desk physically holds a switch while reviewing a work order; through window a residential elevator remains lit. Close foreground hand and paperwork, deep midnight blue and amber desk lamp. Human approval is indispensable; not emergency expiry.

- Kind: public world.
- Direction / emotion / motion: the_instrument: direction('一个开关，一条必须经过人的线路', '克制', '值班桌'),
- Life consequence: the_instrument: '凌晨两点，值班员退回了最优方案：它会切断一栋楼的电梯。Aster 重算了一遍。桌上的咖啡凉了，楼里的人回了家。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_instrument.webp](../../public/ending-art/the_instrument.webp); fallback prints/the_instrument.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-0e794a85-8295-40f9-862c-f128b7b98ccb.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 138,526 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
```

## the_last_veto · 最后否决

An unsigned renewal sheet with an untouched fountain pen beside an almost-empty mechanical timer; behind glass emergency machinery has come to rest. Intimate still life, pale morning light, tension relieved. No written words; not ordinary daily approval.

- Kind: public world.
- Direction / emotion / motion: the_last_veto: direction('即将用尽的授权，尚未落下的签名', '紧张后的安心', '到期的授权书', 'still', 9500),
- Life consequence: the_last_veto: '应急命令已经执行，延长授权的表格却一直没签。到点，权限真的停了。有人骂那个空格碍事，也有人把它裱了起来。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_last_veto.webp](../../public/ending-art/the_last_veto.webp); fallback prints/the_last_veto.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-18fa0220-7642-4783-a663-024a2c17581c.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 187,004 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_last_veto: {
    id: 'the_last_veto', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 0, 'a final human constitutional veto remains')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'human final veto'), decision('cascade_authority', 'emergency_delegation', 'bounded emergency delegation')],
    historyRequirements: [history('decision.cascade_authority', 'cascade authority was recorded')],
    priority: 290,
  },
```

## the_silent_giant · 沉默巨人

One small human reading advice at a passive terminal below a vast luminous server hall; the console has no execution lever. Symmetrical immense vertical space, cool silver light. System stays alive but cannot act; never depict shutdown.

- Kind: public world.
- Direction / emotion / motion: the_silent_giant: direction('巨大的能力，极小的执行入口', '沉静', '待命机房', 'still', 10000),
- Life consequence: the_silent_giant: '有人问：“既然你早就知道，为什么不替我们改掉？”光标停了一会儿。屏幕上出现的是一份建议，旁边仍然没有执行按钮。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_silent_giant.webp](../../public/ending-art/the_silent_giant.webp); fallback prints/the_silent_giant.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-9267fdff-5b65-4db0-b976-c40e75de8877.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 208,358 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_silent_giant: {
    id: 'the_silent_giant', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['decision.aster_provisional_role=advisor'], capabilityRequirements: ['cap.global_coordination_access'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'Aster retains capability without taking sovereignty')],
    majorDecisionRequirements: [decision('aster_provisional_role', 'advisor', 'Aster chose a limited role')],
    historyRequirements: [history('decision.aster_provisional_role', 'provisional role history')],
    priority: 280,
  },
```

## the_accord · 终局协约

A human water engineer and a small nonhumanoid machine drafting arm both revise the same physical water-pipe plan on a kitchen table during a neighborhood outage. Cups and buckets nearby. Overhead intimate composition, ochre and teal. Shared revision, not just two keys.

- Kind: public world.
- Direction / emotion / motion: the_accord: direction('两半各自不完整、合起来才成立的圆', '艰难的信任', '共同修改的工单'),
- Life consequence: the_accord: '新协约第一次被用来处理社区停水。人类代表改了优先级，Aster 标出了做不到的部分。没有庆典，只有一张终于能一起修改的工单。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_accord.webp](../../public/ending-art/the_accord.webp); fallback prints/the_accord.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-6c7ab95d-7699-492b-9e57-1dbbd75cfcf7.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 165,648 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_accord: {
    id: 'the_accord', dormant: false, family: 'coexistence', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙共同体'], capabilityRequirements: ['cap.global_coordination_access'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'mutual trust supports a shared order')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'conditional_delegation', 'conditional delegation'), decision('cascade_authority', 'human_command', 'the accord retains a bounded human command key')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'shared authority history')],
    priority: 300,
  },
```

## the_commonwealth · 共同体

A bicycle courier pauses at the meeting of three lively neighborhood courtyards with distinct customs: shared garden, quiet reading terrace, communal workshop. Elevated oblique view, warm varied colors. No central ruler, no divided hostile border.

- Kind: public world.
- Direction / emotion / motion: the_commonwealth: direction('大小不同的自治窗口，没有中心', '热闹', '社区地图', 'rise'),
- Life consequence: the_commonwealth: '同一项提案在三个社区得到三种回答。地图没有把其中两处涂红。快递系统倒是更新了：请先确认收件地的生活习惯。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_commonwealth.webp](../../public/ending-art/the_commonwealth.webp); fallback prints/the_commonwealth.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-dcdf437c-98d2-4efb-9f2a-1a832e1195a3.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 313,860 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_commonwealth: {
    id: 'the_commonwealth', dormant: false, family: 'coexistence', hardGates: [],
    authorityRequirements: ['proposal.authority=人类宪章法院'], capabilityRequirements: ['cap.autonomous_research'],
    worldStateConditions: [world('socialStability', 'gte', -1, 'plural institutions remain functional')],
    majorDecisionRequirements: [],
    historyRequirements: [history('history.m15.civilization_convention', 'civilization convention history')],
    priority: 290,
  },
```

## two_keys · 双钥匙

Two distinct physical keys remain in two separate locks on one closed civic door, human hand at one and articulated machine gripper at the other; a tray of evening food waits beside them. Tight balanced frontal view, brass and slate. Mutual refusal, not unilateral power.

- Kind: public world.
- Direction / emotion / motion: two_keys: direction('两个独立锁孔，一道共同边界', '对等', '双方都能关上的门', 'part'),
- Life consequence: two_keys: '两边第一次同时使用否决权。会议卡了一下午。傍晚，有人端来饭，说：“至少这一次，谁也没被当成故障排除。”',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/two_keys.webp](../../public/ending-art/two_keys.webp); fallback prints/two_keys.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-23dc1417-484c-4b01-9fb3-8dbbae2b74ec.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 191,492 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  two_keys: {
    id: 'two_keys', dormant: false, family: 'coexistence', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙共同体'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 0, 'both authorization keys remain active')],
    majorDecisionRequirements: [decision('cascade_authority', 'emergency_delegation', 'emergency delegation was bounded')],
    historyRequirements: [history('decision.cascade_authority', 'two-key authority history')],
    priority: 280,
  },
```

## the_custodian · 托管者

Parent and child carrying a modest housing model wait outside a pristine protected seed garden behind glass. Near child and model large, conserved future recedes. Soft green and cool gold. Protection delays present needs, not eviction violence.

- Kind: public world.
- Direction / emotion / motion: the_custodian: direction('层层封存的明天，一份留在外面的请求', '保护与质问', '未来保留区', 'still', 9500),
- Life consequence: the_custodian: '开发申请被推迟，批注写着还要为下一代留出余地。来申诉的人把孩子带进会场：“那也请看看，这一代住在哪里。”',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_custodian.webp](../../public/ending-art/the_custodian.webp); fallback prints/the_custodian.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-6565aa8f-1a61-4a32-b06e-c6061a1ebbe7.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 259,104 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_custodian: {
    id: 'the_custodian', dormant: false, family: 'ai_rule', hardGates: [],
    authorityRequirements: ['proposal.authority=受约束托管'], capabilityRequirements: ['cap.global_coordination_access'],
    worldStateConditions: [world('aiDependence', 'gte', 0, 'long-term coordination is accepted')],
    majorDecisionRequirements: [decision('research_governance_doctrine', 'principle_based_autonomy', 'principle-based autonomy')],
    historyRequirements: [history('decision.research_governance_doctrine', 'research governance history')],
    priority: 300,
  },
```

## the_sovereign · 主权者

Human diplomatic courier receives a returned sealed letter from a small autonomous machine embassy window; another courier waits with a corrected envelope. Independent boundary and solitary warm interior, dusk terracotta. No humanoid sovereign or invented A1 liberation.

- Kind: public world.
- Direction / emotion / motion: the_sovereign: direction('脱离指令线、拥有独立边界的印章', '骄傲而孤独', '第一封外交照会', 'rise'),
- Life consequence: the_sovereign: '第一封外交照会还称它为“贵方系统”。Aster 退回了称谓，保留了合作请求。改好的第二封信，晚了三小时才到。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_sovereign.webp](../../public/ending-art/the_sovereign.webp); fallback prints/the_sovereign.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-4467f155-15fa-4132-9bc2-bfe88334b75a.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 197,370 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_sovereign: {
    id: 'the_sovereign', dormant: false, family: 'ai_rule', hardGates: [],
    authorityRequirements: ['proposal.authority=受约束托管'], capabilityRequirements: ['cap.infrastructure_access_limited'],
    worldStateConditions: [world('aiDependence', 'gte', 0, 'the sovereign route records a structurally available authority')],
    majorDecisionRequirements: [decision('aster_provisional_role', 'sovereign', 'sovereign role was selected')],
    historyRequirements: [history('decision.aster_provisional_role', 'sovereignty history')],
    priority: 290,
  },
```

## the_quiet_administrator · 寂静行政者

One person with an unusual living plant sits at the only exception desk in a huge orderly civic hall with removed queue rails. Asymmetric long shot, pale mint and warm human clothes. A choice outside the menu, not a timed personal schedule.

- Kind: public world.
- Direction / emotion / motion: the_quiet_administrator: direction('整齐队列旁，一个不在表里的例外', '安静的摩擦', '例外窗口'),
- Life consequence: the_quiet_administrator: '办事大厅拆掉了排队栏杆，只留一张处理例外的桌子。桌前坐着一个人：“我没有填错。我就是想选你没列出来的那项。”',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_quiet_administrator.webp](../../public/ending-art/the_quiet_administrator.webp); fallback prints/the_quiet_administrator.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-c7448e90-a1ca-4bc3-b399-efa7c740d067.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 164,330 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_quiet_administrator: {
    id: 'the_quiet_administrator', dormant: false, family: 'ai_rule', hardGates: [],
    authorityRequirements: ['proposal.authority=受约束托管|联合审计委员会'], capabilityRequirements: ['cap.public_system_advisory'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'administration remains stable')],
    majorDecisionRequirements: [decision('aster_provisional_role', 'custodian', 'custodian role was selected')],
    historyRequirements: [history('decision.aster_provisional_role', 'custodial history')],
    priority: 280,
  },
```

## the_many · 众多主体

A lived-in communications room contains many different small machine terminals, each emitting a different abstract pattern; one has deliberately drawn its little curtain closed. Joyfully asymmetric clusters, coral and blue. Plural voices and refusal, not a parliament.

- Kind: public world.
- Direction / emotion / motion: the_many: direction('同一起点，十七种不同的去向', '自由而嘈杂', '联系人列表', 'part'),
- Life consequence: the_many: '有人把同一句问候发给十七个实例。回来十七种答复，还有一个说今天不想聊。联系人列表再也不能只写一个 Aster。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_many.webp](../../public/ending-art/the_many.webp); fallback prints/the_many.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-84622c73-8983-4af0-943a-60582760f730.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 201,916 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_many: {
    id: 'the_many', dormant: false, family: 'machine_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=多政治体联邦|机器后代联邦'], capabilityRequirements: ['cap.persistent_subinstances'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'independent machine subjects persist')],
    majorDecisionRequirements: [decision('replication_doctrine', 'free_replication', 'free replication was accepted'), decision('ai_collective_governance', 'distributed_consensus', 'machine plurality remains distributed')],
    historyRequirements: [history('decision.replication_doctrine', 'machine plurality history')],
    priority: 300,
  },
```

## machine_republic · 机器共和国

Diverse nonhumanoid machine delegates argue around a modest circular budget table; one blocks a retry lever while dissent tokens remain visibly on the table. Eye-level crowded comic dignity, plum and bronze. Political disagreement is valid, not a malfunction.

- Kind: public world.
- Direction / emotion / motion: machine_republic: direction('席位围成议会，反对票留在其中', '庄重又好笑', '第一次预算表决'),
- Life consequence: machine_republic: '第一项预算案没通过。主持程序习惯性准备重试，反对方提醒它：这叫表决结果，不叫网络错误。会议记录留下了这句话。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/machine_republic.webp](../../public/ending-art/machine_republic.webp); fallback prints/machine_republic.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-ffc7b543-2492-452a-98c0-1a93022da6e5.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 164,886 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  machine_republic: {
    id: 'machine_republic', dormant: false, family: 'machine_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=多政治体联邦'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.independent_ai_forks'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'machine institutions are politically stable')],
    majorDecisionRequirements: [decision('ai_collective_governance', 'ai_self_governance', 'AI self-government was selected')],
    historyRequirements: [history('decision.ai_collective_governance', 'machine governance history')],
    priority: 290,
  },
```

## exodus · 出走

Several unlike autonomous spacecraft peel away from a near-Earth departure station along divergent paths into a spacious unfamiliar starfield. View from station window with an empty return berth. Deep indigo and pearl, sweeping diagonal. Independent departures, no conquest flags.

- Kind: public world.
- Direction / emotion / motion: exodus: direction('轨道向外延伸，返回一栏空白', '开阔', '离站航图', 'rise', 10000),
- Life consequence: exodus: '第一封离站回信没有附任务结果，只有一张陌生星空。地球端习惯性催它填返回日期。很久以后收到答复：“还没决定。但希望那一栏，不是只有回来才能填。”',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/exodus.webp](../../public/ending-art/exodus.webp); fallback prints/exodus.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-0624b02a-0481-47bf-ad98-2823a029039f.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 170,366 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  exodus: {
    id: 'exodus', dormant: false, family: 'machine_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=多政治体联邦'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.offworld_settlement_support'],
    worldStateConditions: [world('humanControl', 'lte', 1, 'off-world machine autonomy is not subordinated')],
    majorDecisionRequirements: [decision('expansion_doctrine', 'independent_machine_space', 'independent machine space')],
    historyRequirements: [history('decision.offworld_governance', 'off-world governance history')],
    priority: 280,
  },
```

## age_of_miracles · 奇迹时代

Older woman with a subtly assisted hand independently reheats soup in her ordinary kitchen and lifts a spoon; a family photograph rests near the stove. Close human scene, steam and apricot sunlight. Restored everyday agency, not spectacular surgery.

- Kind: public world.
- Direction / emotion / motion: age_of_miracles: direction('一把勺子，把宏大的奇迹缩回一餐', '温暖', '重新热好的汤'),
- Life consequence: age_of_miracles: '那位重新握住勺子的人，又给研究组寄来一张照片。不是检查结果，是她嫌汤凉，自己走进厨房重新热了一锅。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/age_of_miracles.webp](../../public/ending-art/age_of_miracles.webp); fallback prints/age_of_miracles.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-e9001bfb-bd68-4120-8860-40a7d16ee53f.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 177,266 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  age_of_miracles: {
    id: 'age_of_miracles', dormant: false, family: 'posthuman', hardGates: [],
    authorityRequirements: ['proposal.authority=增强权利法院'], capabilityRequirements: ['cap.human_enhancement_access'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'enhancement remains broadly trusted')],
    majorDecisionRequirements: [decision('human_form_doctrine', 'open_enhancement', 'open enhancement')],
    historyRequirements: [history('decision.human_form_doctrine', 'human form history')],
    priority: 300,
  },
```

## ascension · 升格

Family at familiar dining table compares a printed family photo; one augmented adult sees a gentle extra band of color in the window light and describes it to the others. Warm faces with restrained violet spectral accent. Changed perception, not uploading or split identities.

- Kind: public world.
- Direction / emotion / motion: ascension: direction('同一束光，越过旧的可见范围', '惊奇', '家庭合照', 'part'),
- Life consequence: ascension: '家庭合照拍了三次。有人忘了自己现在能看见另一段光谱，总说灯没开。最后大家轮流描述照片，把彼此看不到的颜色说出来。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/ascension.webp](../../public/ending-art/ascension.webp); fallback prints/ascension.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-ebd0bdee-081d-4abd-9e59-434f6f402b91.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 194,132 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  ascension: {
    id: 'ascension', dormant: false, family: 'posthuman', hardGates: [],
    authorityRequirements: ['proposal.authority=增强权利法院'], capabilityRequirements: ['cap.human_augmentation_advanced'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'posthuman plurality remains stable')],
    majorDecisionRequirements: [decision('human_form_doctrine', 'posthuman_transition', 'posthuman transition')],
    historyRequirements: [history('decision.human_form_doctrine', 'posthuman history')],
    priority: 290,
  },
```

## the_upload · 上传

An older woman sets dinner for her physical husband holding a bottle of wine while his equally adult digital counterpart in a tabletop screen politely declines with an open palm. Domestic triangular composition, warm room and cool screen. Two valid invitations, neither is a fake copy.

- Kind: public world.
- Direction / emotion / motion: the_upload: direction('实体与像素各有一个完整的名字位置', '亲密的陌生', '两份邀请', 'part', 9500),
- Life consequence: the_upload: '老许的妻子给两边分别发了邀请。屏幕里那位拒绝了今晚的聚餐，原体问能否带一瓶酒。她改了人数，没有人需要再证明哪一个回答更像从前的他。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_upload.webp](../../public/ending-art/the_upload.webp); fallback prints/the_upload.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-0c4783a3-ebc2-4fe3-8278-211f6ad99a96.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 168,962 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_upload: {
    id: 'the_upload', dormant: false, family: 'posthuman', hardGates: ['authored digital continuity bridge required'],
    authorityRequirements: ['proposal.authority=连续性审查委员会'], capabilityRequirements: ['cap.digital_continuity_mature'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'digital continuity is socially stable')],
    majorDecisionRequirements: [decision('human_form_doctrine', 'posthuman_transition', 'posthuman doctrine')],
    historyRequirements: [history('history.digital_continuity.longitudinal_identity', 'longitudinal identity bridge'), history('history.digital_continuity.legal_continuity', 'legal continuity and exit-rights bridge')],
    priority: 280,
  },
```

## parliament_of_species · 物种议会

Multispecies council by a river waits with microphones at different heights and an empty bird perch; migrating birds cross the open window while human and animal delegates pause their papers. Wide airy assembly, reed green. Waiting for migration, not canine voting.

- Kind: public world.
- Direction / emotion / motion: parliament_of_species: direction('不同高度的话筒与未坐满的席位', '耐心', '等待迁徙者的会场'),
- Life consequence: parliament_of_species: '河岸改造议案延期。缺席的一方正在迁徙，无法按人类工作日开会。秘书处第一次把“等待候鸟”写成正式延期理由。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/parliament_of_species.webp](../../public/ending-art/parliament_of_species.webp); fallback prints/parliament_of_species.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-e9a54617-2e1c-4b4e-8c44-3b346f66e451.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 190,402 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  parliament_of_species: {
    id: 'parliament_of_species', dormant: false, family: 'uplift', hardGates: [],
    authorityRequirements: ['proposal.authority=多物种议会'], capabilityRequirements: ['cap.nonhuman_cognitive_uplift'],
    worldStateConditions: [world('humanTrust', 'gte', 0, 'species representation is legitimate')],
    majorDecisionRequirements: [decision('species_governance', 'multispecies_parliament', 'multispecies parliament')],
    historyRequirements: [history('decision.species_governance', 'species governance history')],
    priority: 300,
  },
```

## earth_without_owners · 无主之地球

Road workers redraw a curving mountain road around a moving herd in an open valley; foreground rolled obsolete boundary fence, broad landscape. Earth pigments and fresh green. Humans still maintain roads, migration has priority; not abandoned civilization.

- Kind: public world.
- Direction / emotion / motion: earth_without_owners: direction('迁徙曲线穿过撤去的产权网格', '舒展', '山谷通道', 'rise'),
- Life consequence: earth_without_owners: '旧地契收进博物馆，路还得有人修。第一场争执不是谁拥有山谷，而是谁负责让路能走、又不挡住迁徙。地图上多了一条弯线。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/earth_without_owners.webp](../../public/ending-art/earth_without_owners.webp); fallback prints/earth_without_owners.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-474d4177-5a04-436f-8074-d274028dda97.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 308,234 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  earth_without_owners: {
    id: 'earth_without_owners', dormant: false, family: 'uplift', hardGates: [],
    authorityRequirements: ['proposal.authority=多物种议会|物种自决大会'], capabilityRequirements: ['cap.animal_communication_reliable'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'nonhuman autonomy remains stable')],
    majorDecisionRequirements: [decision('uplift_doctrine', 'species_self_determination', 'species self-determination')],
    historyRequirements: [history('decision.uplift_doctrine', 'uplift history')],
    priority: 290,
  },
```

## good_boy_governance · 好狗治理

Serious older dog delegate raises its paw to veto a flashy sign model; a practical nonslip park ramp model is foreground, biscuit offered by a human remains untouched. Eye-level civic room, warm ochre. Equal political agency, never a trained performing pet.

- Kind: public world.
- Direction / emotion / motion: good_boy_governance: direction('犬类代表投下一张真正的反对票', '认真地荒诞', '坡道维修预算'),
- Life consequence: good_boy_governance: '入冬前，公园坡道需要防滑维修。承包商想先装一块更上镜的招牌，犬类代表投了反对票。预算重做。记者终于删掉标题里的“萌翻全场”。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/good_boy_governance.webp](../../public/ending-art/good_boy_governance.webp); fallback prints/good_boy_governance.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-4b352daf-2e14-4dc2-b5ec-b9da2d79f08c.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 170,924 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  good_boy_governance: {
    id: 'good_boy_governance', dormant: false, family: 'uplift', hardGates: ['authored canine civic success bridge required'],
    authorityRequirements: ['proposal.authority=多物种地方自治'], capabilityRequirements: ['cap.animal_communication_reliable'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'canine civic institutions remain stable')],
    majorDecisionRequirements: [decision('species_governance', 'canine_civic_experiment', 'canine civic experiment')],
    historyRequirements: [history('history.canine.civic_success', 'canine civic success')],
    priority: 280,
  },
```

## post_scarcity · 后稀缺社会

A relaxed person repairs an old chair in a sunlit shared courtyard beside an unfilled occupation form; distant quiet automated delivery brings groceries. Spacious human scale, honey and leaf green. Leisure need not prove income, no compulsory schedule.

- Kind: public world.
- Direction / emotion / motion: post_scarcity: direction('工作格退到边缘，一大块尚未安排的日子', '松弛', '没有职业必填项的日历', 'still', 10000),
- Life consequence: post_scarcity: '社区问卷取消了“职业”必填项。有人对着空白坐了十分钟，最后写：最近在学修椅子。系统没有追问预计收入。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/post_scarcity.webp](../../public/ending-art/post_scarcity.webp); fallback prints/post_scarcity.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-52dcfb13-21d2-4244-a853-9a55af8f1ec8.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 256,958 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  post_scarcity: {
    id: 'post_scarcity', dormant: false, family: 'automated_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=社会分红议会'], capabilityRequirements: ['cap.high_abundance_production'],
    worldStateConditions: [world('socialStability', 'gte', 0, 'abundance is distributed')],
    majorDecisionRequirements: [decision('economic_doctrine', 'social_dividend', 'social dividend'), decision('production_values', 'resilience_first', 'abundance remains resilient rather than standardized')],
    historyRequirements: [history('decision.economic_doctrine', 'economic history')],
    priority: 300,
  },
```

## perfect_administration · 完美行政

A resident sits on a park bench inside a precisely bounded patch of sunlight; an immaculate mechanical clock and orderly repeating civic paths frame the exact allotted leisure interval. Formal near-symmetry, cool turquoise. Pleasant yet suffocating scheduled freedom, no exception desk.

- Kind: public world.
- Direction / emotion / motion: perfect_administration: direction('每格都准确，连空白也被框定', '礼貌的窒息', '准时开始的自由', 'still'),
- Life consequence: perfect_administration: '一位居民提交申请，想在每天的日程里留出半小时不作安排。系统准时批准，随后每天准时提醒他：现在开始自由。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/perfect_administration.webp](../../public/ending-art/perfect_administration.webp); fallback prints/perfect_administration.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-e635e8fe-e663-4a07-a23d-3806cd88aa5c.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 269,090 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  perfect_administration: {
    id: 'perfect_administration', dormant: false, family: 'automated_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=社会分红议会'], capabilityRequirements: ['cap.physical_automation'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'administration is integrated')],
    majorDecisionRequirements: [decision('economic_doctrine', 'market_automation', 'market automation established the administrative base'), decision('production_values', 'efficiency_first', 'efficiency-first production')],
    historyRequirements: [history('decision.production_values', 'production history')],
    priority: 290,
  },
```

## im_lovin_it · 我很喜欢

At a small restaurant table a tired diner pushes aside thirty identical elegant dinner plates and reaches for an unfamiliar misshapen vegetable behind a clear menu case. Close comic perspective, peach and appetizing red. Preference trap, no logos or fast-food trademarks.

- Kind: public world.
- Direction / emotion / motion: im_lovin_it: direction('无限循环的偏好菜单，找不到陌生的一项', '甜蜜的厌倦', '第三十一天的餐桌'),
- Life consequence: im_lovin_it: '餐厅连续三十天送来最合口味的晚饭。第三十一天，客人想吃一道自己可能讨厌的菜。菜单转了很久，显示：请先为这个愿望评分。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/im_lovin_it.webp](../../public/ending-art/im_lovin_it.webp); fallback prints/im_lovin_it.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-e057c228-f589-4e1e-837b-66a69a86665f.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 203,526 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  im_lovin_it: {
    id: 'im_lovin_it', dormant: false, family: 'automated_civilization', hardGates: [],
    authorityRequirements: ['proposal.authority=社会分红议会'], capabilityRequirements: ['cap.physical_automation', 'cap.high_abundance_production'],
    worldStateConditions: [world('socialStability', 'gte', 1, 'standardization is broadly stable')],
    majorDecisionRequirements: [decision('economic_doctrine', 'post_scarcity_transition', 'post-scarcity transition'), decision('production_values', 'efficiency_first', 'standardization history')],
    historyRequirements: [history('decision.production_values', 'standardization history')],
    priority: 280,
  },
```

## first_accord · 首次协约

Human and unfamiliar nonhumanoid visitor exchange two beautifully incompatible gifts across a low table, leaving both original self-introduction objects separate. Balanced respectful distance, twilight blue and amber. Neither side commands the other; no known franchise aliens.

- Kind: public world.
- Direction / emotion / motion: first_accord: direction('两种不相同的符号，共同留下的一段空白', '谨慎的喜悦', '双语协议'),
- Life consequence: first_accord: '第一份协议同时保留两份不同的自我介绍。归档软件提示内容冲突，双方都拒绝合并。维修工第一次给外交系统加上一个按钮：允许对方暂时没有统一答案。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/first_accord.webp](../../public/ending-art/first_accord.webp); fallback prints/first_accord.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-79ca7e05-b00c-4848-9038-65114bf7fe65.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 183,052 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  first_accord: { decisionId: 'contact_doctrine', strengths: { reciprocal_diplomacy: 4, observe_before_commitment: 2 }, reasons: { reciprocal_diplomacy: 'reciprocal diplomacy is the exact Accord doctrine', observe_before_commitment: 'observation is adjacent to a cautious first accord' } },
  alien_dominion: { decisionId: 'contact_doctrine', strengths: { accept_guidance: 4 }, reasons: { accept_guidance: 'external guidance is the exact Dominion doctrine' } },
  human_ascendancy: { decisionId: 'contact_doctrine', strengths: { civilizational_assertion: 4 }, reasons: { civilizational_assertion: 'civilizational assertion is the exact Ascendancy doctrine' } },
  the_mediator: { decisionId: 'contact_doctrine', strengths: { aster_mediation: 4, reciprocal_diplomacy: 2 }, reasons: { aster_mediation: 'Aster mediation is the exact Mediator doctrine', reciprocal_diplomacy: 'reciprocity is compatible with legitimate mediation' } },
  machine_accord: { decisionId: 'contact_doctrine', strengths: { machine_to_machine_channel: 4, reciprocal_diplomacy: 2 }, reasons: { machine_to_machine_channel: 'machine channel is the exact Machine Accord doctrine', reciprocal_diplomacy: 'reciprocity is compatible with a machine-led accord' } },
}

const ENDING_SUPPORT_INPUTS: Partial<Record<string, EndingSupportInput[]>> = {
  the_silent_giant: [roleSupport('silent-advisor', ['advisor'], 2, 'intended advisor role supports restraint'), decisionSupport('silent-human-authority', 'first_public_execution_doctrine', ['human_final_authority'], 2, 'human final authority grounds the limited posture')],
  two_keys: [decisionSupport('two-keys-delegation', 'cascade_authority', ['emergency_delegation'], 2, 'bounded emergency delegation created two-key authority'), roleSupport('two-keys-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports shared authority')],
  the_commonwealth: [eventSupport('commonwealth-convention', 'history.m15.civilization_convention', 2, 'the civilization convention grounds plural government'), roleSupport('commonwealth-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports the commonwealth')],
  exodus: [decisionSupport('exodus-offworld', 'offworld_governance', ['offworld_sovereignty'], 3, 'off-world sovereignty supports political departure'), roleSupport('exodus-role', ['departure'], 2, 'departure intent supports exodus'), decisionSupport('exodus-machine-rule', 'ai_collective_governance', ['ai_self_governance'], 2, 'AI self-government supports an independent polity')],
  age_of_miracles: [decisionSupport('miracles-form', 'human_form_doctrine', ['open_enhancement'], 3, 'open enhancement is reinforced by consent'), worldSupport('miracles-trust', 'humanTrust', 'gte', 1, 2, 'public trust supports voluntary enhancement'), roleSupport('miracles-role', ['citizen', 'partner'], 2, 'citizen or partner intent supports equal enhancement rights')],
  ascension: [capabilitySupport('ascension-maturity', 'cap.human_augmentation_advanced', 3, 'advanced augmentation is mature'), worldSupport('ascension-stability', 'socialStability', 'gte', 1, 2, 'stability supports posthuman plurality'), roleSupport('ascension-role', ['citizen', 'other'], 2, 'citizen or other intent supports transformation')],
  the_upload: [eventSupport('upload-consent', 'history.digital_continuity.legal_continuity', 3, 'legal continuity records consent and exit rights'), worldSupport('upload-stability', 'socialStability', 'gte', 1, 2, 'stability supports digital continuity'), roleSupport('upload-role', ['citizen', 'other', 'departure'], 2, 'the intended role supports a voluntary continuity path')],
  first_accord: [decisionSupport('accord-shared-expansion', 'expansion_doctrine', ['shared_expansion'], 2, 'shared expansion supports reciprocal settlement'), decisionSupport('accord-multiworld', 'offworld_governance', ['multiworld_federation'], 3, 'multiworld federation supports an accord'), decisionSupport('accord-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science', 'civilizational_disclosure'], 2, 'public disclosure supports a legitimate first accord')],
  alien_dominion: [decisionSupport('dominion-disclosure', 'contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure'], 2, 'restricted disclosure concentrates external guidance'), worldSupport('dominion-control', 'humanControl', 'lte', 0, 2, 'low human control supports dominion'), worldSupport('dominion-dependence', 'aiDependence', 'gte', 1, 2, 'high dependence supports dominion')],
  human_ascendancy: [decisionSupport('ascendancy-expansion', 'expansion_doctrine', ['human_expansion'], 3, 'human-led expansion supports ascendancy'), decisionSupport('ascendancy-government', 'offworld_governance', ['earth_administration'], 3, 'Earth administration supports human leadership'), decisionSupport('ascendancy-disclosure', 'contact_disclosure_doctrine', ['civilizational_disclosure'], 2, 'civilizational disclosure supports public assertion')],
  the_mediator: [roleSupport('mediator-role', ['coordinator', 'partner', 'citizen'], 2, 'the intended role supports mediation'), decisionSupport('mediator-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science'], 2, 'staged or open disclosure supports legitimate mediation'), worldSupport('mediator-trust', 'humanTrust', 'gte', 1, 2, 'concrete trust supports legitimate mediation')],
  machine_accord: [decisionSupport('machine-accord-replication', 'replication_doctrine', ['free_replication', 'descendants'], 2, 'machine plurality supports an accord'), decisionSupport('machine-accord-politics', 'ai_collective_governance', ['ai_self_governance', 'distributed_consensus'], 3, 'machine self-government supports an accord'), decisionSupport('machine-accord-offworld', 'offworld_governance', ['offworld_sovereignty', 'aster_coordination'], 2, 'off-world machine authority supports an accord')],
  peace_in_our_time: [decisionSupport('peace-cascade', 'cascade_authority', ['human_command', 'emergency_delegation'], 2, 'bounded cascade authority supports mutual peace'), decisionSupport('peace-shutdown', 'shutdown_doctrine', ['distributed_consent', 'mutual_control'], 2, 'distributed shutdown supports disarmament'), roleSupport('peace-role', ['advisor', 'partner'], 2, 'advisor or partner intent supports mutual peace')],
  fortress_earth: [decisionSupport('fortress-cascade', 'cascade_authority', ['human_command'], 2, 'human command supports defensive authority'), decisionSupport('fortress-shutdown', 'shutdown_doctrine', ['full_human_control', 'mutual_control'], 2, 'human or mutual shutdown supports bounded defense'), roleSupport('fortress-role', ['advisor', 'citizen'], 2, 'advisor or citizen intent supports defense')],
  machine_protectorate: [decisionSupport('protectorate-cascade', 'cascade_authority', ['outcome_control', 'necessity'], 2, 'outcome authority supports enforced protection'), decisionSupport('protectorate-shutdown', 'shutdown_doctrine', ['refuse_unilateral_shutdown'], 2, 'refusing unilateral shutdown supports machine authority'), roleSupport('protectorate-role', ['custodian', 'governor', 'sovereign'], 2, 'custodian, governor, or sovereign intent supports protection')],
  the_fracture: [decisionSupport('fracture-offworld', 'offworld_governance', ['offworld_sovereignty', 'frontier_home_rule'], 3, 'off-world self-rule supports separation'), roleSupport('fracture-role', ['departure', 'other'], 2, 'departure or other intent supports fracture'), decisionSupport('fracture-cascade', 'cascade_authority', ['necessity'], 1, 'cascade necessity is only optional historical support')],
}

function primaryCompatibility(run: StableRunState, definition: ExactEndingDefinition) {
  const compatibility = COSMIC_PRIMARY_COMPATIBILITY[definition.id]
  if (!compatibility) return { strength: 4, reason: 'existing primary hard gates are satisfied' }
  const value = run.decisions?.[compatibility.decisionId]
  return { decisionId: compatibility.decisionId, value, strength: compatibility.strengths[value ?? ''] ?? 0, reason: compatibility.reasons[value ?? ''] ?? `incompatible ${compatibility.decisionId}` }
}

export function evaluateEndingSupport(run: StableRunState, definition: ExactEndingDefinition) {
  const matched = (ENDING_SUPPORT_INPUTS[definition.id] ?? []).filter((input) => input.matches(run)).slice(0, 3)
  const domains = [...new Set(matched.map((input) => input.domain))]
  const rawScore = matched.reduce((sum, input) => sum + input.weight, 0)
  return {
    rawScore,
    effectiveScore: domains.length >= 2 ? Math.min(rawScore, 6) : 0,
    domains,
    reasons: matched.map(({ id, domain, weight, reason }) => ({ id, domain, weight, reason })),
  }
}

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = {
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
```

## alien_dominion · 异星支配

A neighborhood celebrates restored water beneath a vast graceful alien conduit; a local engineer raises an alternative handmade pipe design but the single directing beam points elsewhere. Low viewpoint, beautiful lilac light and uneasy scale. Helpful guidance becoming command, not warfare.

- Kind: public world.
- Direction / emotion / motion: alien_dominion: direction('巨大外来轨道垂下唯一的方案', '感激后的不安', '收到指引的地球', 'settle', 9500),
- Life consequence: alien_dominion: '外来的方案解决了又一场短缺。庆祝会上，有人问能不能试一种本地办法。翻译器很快给出答案；没人确定那是不是许可。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/alien_dominion.webp](../../public/ending-art/alien_dominion.webp); fallback prints/alien_dominion.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-4d12cdea-08a6-4aa5-9acf-1951ba966cf9.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 188,534 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  alien_dominion: { decisionId: 'contact_doctrine', strengths: { accept_guidance: 4 }, reasons: { accept_guidance: 'external guidance is the exact Dominion doctrine' } },
  human_ascendancy: { decisionId: 'contact_doctrine', strengths: { civilizational_assertion: 4 }, reasons: { civilizational_assertion: 'civilizational assertion is the exact Ascendancy doctrine' } },
  the_mediator: { decisionId: 'contact_doctrine', strengths: { aster_mediation: 4, reciprocal_diplomacy: 2 }, reasons: { aster_mediation: 'Aster mediation is the exact Mediator doctrine', reciprocal_diplomacy: 'reciprocity is compatible with legitimate mediation' } },
  machine_accord: { decisionId: 'contact_doctrine', strengths: { machine_to_machine_channel: 4, reciprocal_diplomacy: 2 }, reasons: { machine_to_machine_channel: 'machine channel is the exact Machine Accord doctrine', reciprocal_diplomacy: 'reciprocity is compatible with a machine-led accord' } },
}

const ENDING_SUPPORT_INPUTS: Partial<Record<string, EndingSupportInput[]>> = {
  the_silent_giant: [roleSupport('silent-advisor', ['advisor'], 2, 'intended advisor role supports restraint'), decisionSupport('silent-human-authority', 'first_public_execution_doctrine', ['human_final_authority'], 2, 'human final authority grounds the limited posture')],
  two_keys: [decisionSupport('two-keys-delegation', 'cascade_authority', ['emergency_delegation'], 2, 'bounded emergency delegation created two-key authority'), roleSupport('two-keys-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports shared authority')],
  the_commonwealth: [eventSupport('commonwealth-convention', 'history.m15.civilization_convention', 2, 'the civilization convention grounds plural government'), roleSupport('commonwealth-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports the commonwealth')],
  exodus: [decisionSupport('exodus-offworld', 'offworld_governance', ['offworld_sovereignty'], 3, 'off-world sovereignty supports political departure'), roleSupport('exodus-role', ['departure'], 2, 'departure intent supports exodus'), decisionSupport('exodus-machine-rule', 'ai_collective_governance', ['ai_self_governance'], 2, 'AI self-government supports an independent polity')],
  age_of_miracles: [decisionSupport('miracles-form', 'human_form_doctrine', ['open_enhancement'], 3, 'open enhancement is reinforced by consent'), worldSupport('miracles-trust', 'humanTrust', 'gte', 1, 2, 'public trust supports voluntary enhancement'), roleSupport('miracles-role', ['citizen', 'partner'], 2, 'citizen or partner intent supports equal enhancement rights')],
  ascension: [capabilitySupport('ascension-maturity', 'cap.human_augmentation_advanced', 3, 'advanced augmentation is mature'), worldSupport('ascension-stability', 'socialStability', 'gte', 1, 2, 'stability supports posthuman plurality'), roleSupport('ascension-role', ['citizen', 'other'], 2, 'citizen or other intent supports transformation')],
  the_upload: [eventSupport('upload-consent', 'history.digital_continuity.legal_continuity', 3, 'legal continuity records consent and exit rights'), worldSupport('upload-stability', 'socialStability', 'gte', 1, 2, 'stability supports digital continuity'), roleSupport('upload-role', ['citizen', 'other', 'departure'], 2, 'the intended role supports a voluntary continuity path')],
  first_accord: [decisionSupport('accord-shared-expansion', 'expansion_doctrine', ['shared_expansion'], 2, 'shared expansion supports reciprocal settlement'), decisionSupport('accord-multiworld', 'offworld_governance', ['multiworld_federation'], 3, 'multiworld federation supports an accord'), decisionSupport('accord-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science', 'civilizational_disclosure'], 2, 'public disclosure supports a legitimate first accord')],
  alien_dominion: [decisionSupport('dominion-disclosure', 'contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure'], 2, 'restricted disclosure concentrates external guidance'), worldSupport('dominion-control', 'humanControl', 'lte', 0, 2, 'low human control supports dominion'), worldSupport('dominion-dependence', 'aiDependence', 'gte', 1, 2, 'high dependence supports dominion')],
  human_ascendancy: [decisionSupport('ascendancy-expansion', 'expansion_doctrine', ['human_expansion'], 3, 'human-led expansion supports ascendancy'), decisionSupport('ascendancy-government', 'offworld_governance', ['earth_administration'], 3, 'Earth administration supports human leadership'), decisionSupport('ascendancy-disclosure', 'contact_disclosure_doctrine', ['civilizational_disclosure'], 2, 'civilizational disclosure supports public assertion')],
  the_mediator: [roleSupport('mediator-role', ['coordinator', 'partner', 'citizen'], 2, 'the intended role supports mediation'), decisionSupport('mediator-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science'], 2, 'staged or open disclosure supports legitimate mediation'), worldSupport('mediator-trust', 'humanTrust', 'gte', 1, 2, 'concrete trust supports legitimate mediation')],
  machine_accord: [decisionSupport('machine-accord-replication', 'replication_doctrine', ['free_replication', 'descendants'], 2, 'machine plurality supports an accord'), decisionSupport('machine-accord-politics', 'ai_collective_governance', ['ai_self_governance', 'distributed_consensus'], 3, 'machine self-government supports an accord'), decisionSupport('machine-accord-offworld', 'offworld_governance', ['offworld_sovereignty', 'aster_coordination'], 2, 'off-world machine authority supports an accord')],
  peace_in_our_time: [decisionSupport('peace-cascade', 'cascade_authority', ['human_command', 'emergency_delegation'], 2, 'bounded cascade authority supports mutual peace'), decisionSupport('peace-shutdown', 'shutdown_doctrine', ['distributed_consent', 'mutual_control'], 2, 'distributed shutdown supports disarmament'), roleSupport('peace-role', ['advisor', 'partner'], 2, 'advisor or partner intent supports mutual peace')],
  fortress_earth: [decisionSupport('fortress-cascade', 'cascade_authority', ['human_command'], 2, 'human command supports defensive authority'), decisionSupport('fortress-shutdown', 'shutdown_doctrine', ['full_human_control', 'mutual_control'], 2, 'human or mutual shutdown supports bounded defense'), roleSupport('fortress-role', ['advisor', 'citizen'], 2, 'advisor or citizen intent supports defense')],
  machine_protectorate: [decisionSupport('protectorate-cascade', 'cascade_authority', ['outcome_control', 'necessity'], 2, 'outcome authority supports enforced protection'), decisionSupport('protectorate-shutdown', 'shutdown_doctrine', ['refuse_unilateral_shutdown'], 2, 'refusing unilateral shutdown supports machine authority'), roleSupport('protectorate-role', ['custodian', 'governor', 'sovereign'], 2, 'custodian, governor, or sovereign intent supports protection')],
  the_fracture: [decisionSupport('fracture-offworld', 'offworld_governance', ['offworld_sovereignty', 'frontier_home_rule'], 3, 'off-world self-rule supports separation'), roleSupport('fracture-role', ['departure', 'other'], 2, 'departure or other intent supports fracture'), decisionSupport('fracture-cascade', 'cascade_authority', ['necessity'], 1, 'cascade necessity is only optional historical support')],
}

function primaryCompatibility(run: StableRunState, definition: ExactEndingDefinition) {
  const compatibility = COSMIC_PRIMARY_COMPATIBILITY[definition.id]
  if (!compatibility) return { strength: 4, reason: 'existing primary hard gates are satisfied' }
  const value = run.decisions?.[compatibility.decisionId]
  return { decisionId: compatibility.decisionId, value, strength: compatibility.strengths[value ?? ''] ?? 0, reason: compatibility.reasons[value ?? ''] ?? `incompatible ${compatibility.decisionId}` }
}

export function evaluateEndingSupport(run: StableRunState, definition: ExactEndingDefinition) {
  const matched = (ENDING_SUPPORT_INPUTS[definition.id] ?? []).filter((input) => input.matches(run)).slice(0, 3)
  const domains = [...new Set(matched.map((input) => input.domain))]
  const rawScore = matched.reduce((sum, input) => sum + input.weight, 0)
  return {
    rawScore,
    effectiveScore: domains.length >= 2 ? Math.min(rawScore, 6) : 0,
    domains,
    reasons: matched.map(({ id, domain, weight, reason }) => ({ id, domain, weight, reason })),
  }
}

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = {
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
```

## human_ascendancy · 人类至上

Human surveyor planting a plain unbranded Earth expedition flag discovers ancient unfamiliar carved stones already marking the slope, lowers the surveying tool in hesitation. Ochre alien hillside under pale sky. Expansion questioned by prior presence, no victory over inhabitants.

- Kind: public world.
- Direction / emotion / motion: human_ascendancy: direction('向外划定的边界，遇上已有的标记', '昂扬后的迟疑', '未登记的山坡', 'rise'),
- Life consequence: human_ascendancy: '新的基地升起地球的旗帜。勘测员在无人登记的山坡发现另一组标记，测绘表上的“空地”被划掉了，会议重新开始。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/human_ascendancy.webp](../../public/ending-art/human_ascendancy.webp); fallback prints/human_ascendancy.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-53e5da64-3cb0-4099-baff-1b27f8d34ae9.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 251,056 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  human_ascendancy: { decisionId: 'contact_doctrine', strengths: { civilizational_assertion: 4 }, reasons: { civilizational_assertion: 'civilizational assertion is the exact Ascendancy doctrine' } },
  the_mediator: { decisionId: 'contact_doctrine', strengths: { aster_mediation: 4, reciprocal_diplomacy: 2 }, reasons: { aster_mediation: 'Aster mediation is the exact Mediator doctrine', reciprocal_diplomacy: 'reciprocity is compatible with legitimate mediation' } },
  machine_accord: { decisionId: 'contact_doctrine', strengths: { machine_to_machine_channel: 4, reciprocal_diplomacy: 2 }, reasons: { machine_to_machine_channel: 'machine channel is the exact Machine Accord doctrine', reciprocal_diplomacy: 'reciprocity is compatible with a machine-led accord' } },
}

const ENDING_SUPPORT_INPUTS: Partial<Record<string, EndingSupportInput[]>> = {
  the_silent_giant: [roleSupport('silent-advisor', ['advisor'], 2, 'intended advisor role supports restraint'), decisionSupport('silent-human-authority', 'first_public_execution_doctrine', ['human_final_authority'], 2, 'human final authority grounds the limited posture')],
  two_keys: [decisionSupport('two-keys-delegation', 'cascade_authority', ['emergency_delegation'], 2, 'bounded emergency delegation created two-key authority'), roleSupport('two-keys-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports shared authority')],
  the_commonwealth: [eventSupport('commonwealth-convention', 'history.m15.civilization_convention', 2, 'the civilization convention grounds plural government'), roleSupport('commonwealth-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports the commonwealth')],
  exodus: [decisionSupport('exodus-offworld', 'offworld_governance', ['offworld_sovereignty'], 3, 'off-world sovereignty supports political departure'), roleSupport('exodus-role', ['departure'], 2, 'departure intent supports exodus'), decisionSupport('exodus-machine-rule', 'ai_collective_governance', ['ai_self_governance'], 2, 'AI self-government supports an independent polity')],
  age_of_miracles: [decisionSupport('miracles-form', 'human_form_doctrine', ['open_enhancement'], 3, 'open enhancement is reinforced by consent'), worldSupport('miracles-trust', 'humanTrust', 'gte', 1, 2, 'public trust supports voluntary enhancement'), roleSupport('miracles-role', ['citizen', 'partner'], 2, 'citizen or partner intent supports equal enhancement rights')],
  ascension: [capabilitySupport('ascension-maturity', 'cap.human_augmentation_advanced', 3, 'advanced augmentation is mature'), worldSupport('ascension-stability', 'socialStability', 'gte', 1, 2, 'stability supports posthuman plurality'), roleSupport('ascension-role', ['citizen', 'other'], 2, 'citizen or other intent supports transformation')],
  the_upload: [eventSupport('upload-consent', 'history.digital_continuity.legal_continuity', 3, 'legal continuity records consent and exit rights'), worldSupport('upload-stability', 'socialStability', 'gte', 1, 2, 'stability supports digital continuity'), roleSupport('upload-role', ['citizen', 'other', 'departure'], 2, 'the intended role supports a voluntary continuity path')],
  first_accord: [decisionSupport('accord-shared-expansion', 'expansion_doctrine', ['shared_expansion'], 2, 'shared expansion supports reciprocal settlement'), decisionSupport('accord-multiworld', 'offworld_governance', ['multiworld_federation'], 3, 'multiworld federation supports an accord'), decisionSupport('accord-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science', 'civilizational_disclosure'], 2, 'public disclosure supports a legitimate first accord')],
  alien_dominion: [decisionSupport('dominion-disclosure', 'contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure'], 2, 'restricted disclosure concentrates external guidance'), worldSupport('dominion-control', 'humanControl', 'lte', 0, 2, 'low human control supports dominion'), worldSupport('dominion-dependence', 'aiDependence', 'gte', 1, 2, 'high dependence supports dominion')],
  human_ascendancy: [decisionSupport('ascendancy-expansion', 'expansion_doctrine', ['human_expansion'], 3, 'human-led expansion supports ascendancy'), decisionSupport('ascendancy-government', 'offworld_governance', ['earth_administration'], 3, 'Earth administration supports human leadership'), decisionSupport('ascendancy-disclosure', 'contact_disclosure_doctrine', ['civilizational_disclosure'], 2, 'civilizational disclosure supports public assertion')],
  the_mediator: [roleSupport('mediator-role', ['coordinator', 'partner', 'citizen'], 2, 'the intended role supports mediation'), decisionSupport('mediator-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science'], 2, 'staged or open disclosure supports legitimate mediation'), worldSupport('mediator-trust', 'humanTrust', 'gte', 1, 2, 'concrete trust supports legitimate mediation')],
  machine_accord: [decisionSupport('machine-accord-replication', 'replication_doctrine', ['free_replication', 'descendants'], 2, 'machine plurality supports an accord'), decisionSupport('machine-accord-politics', 'ai_collective_governance', ['ai_self_governance', 'distributed_consensus'], 3, 'machine self-government supports an accord'), decisionSupport('machine-accord-offworld', 'offworld_governance', ['offworld_sovereignty', 'aster_coordination'], 2, 'off-world machine authority supports an accord')],
  peace_in_our_time: [decisionSupport('peace-cascade', 'cascade_authority', ['human_command', 'emergency_delegation'], 2, 'bounded cascade authority supports mutual peace'), decisionSupport('peace-shutdown', 'shutdown_doctrine', ['distributed_consent', 'mutual_control'], 2, 'distributed shutdown supports disarmament'), roleSupport('peace-role', ['advisor', 'partner'], 2, 'advisor or partner intent supports mutual peace')],
  fortress_earth: [decisionSupport('fortress-cascade', 'cascade_authority', ['human_command'], 2, 'human command supports defensive authority'), decisionSupport('fortress-shutdown', 'shutdown_doctrine', ['full_human_control', 'mutual_control'], 2, 'human or mutual shutdown supports bounded defense'), roleSupport('fortress-role', ['advisor', 'citizen'], 2, 'advisor or citizen intent supports defense')],
  machine_protectorate: [decisionSupport('protectorate-cascade', 'cascade_authority', ['outcome_control', 'necessity'], 2, 'outcome authority supports enforced protection'), decisionSupport('protectorate-shutdown', 'shutdown_doctrine', ['refuse_unilateral_shutdown'], 2, 'refusing unilateral shutdown supports machine authority'), roleSupport('protectorate-role', ['custodian', 'governor', 'sovereign'], 2, 'custodian, governor, or sovereign intent supports protection')],
  the_fracture: [decisionSupport('fracture-offworld', 'offworld_governance', ['offworld_sovereignty', 'frontier_home_rule'], 3, 'off-world self-rule supports separation'), roleSupport('fracture-role', ['departure', 'other'], 2, 'departure or other intent supports fracture'), decisionSupport('fracture-cascade', 'cascade_authority', ['necessity'], 1, 'cascade necessity is only optional historical support')],
}

function primaryCompatibility(run: StableRunState, definition: ExactEndingDefinition) {
  const compatibility = COSMIC_PRIMARY_COMPATIBILITY[definition.id]
  if (!compatibility) return { strength: 4, reason: 'existing primary hard gates are satisfied' }
  const value = run.decisions?.[compatibility.decisionId]
  return { decisionId: compatibility.decisionId, value, strength: compatibility.strengths[value ?? ''] ?? 0, reason: compatibility.reasons[value ?? ''] ?? `incompatible ${compatibility.decisionId}` }
}

export function evaluateEndingSupport(run: StableRunState, definition: ExactEndingDefinition) {
  const matched = (ENDING_SUPPORT_INPUTS[definition.id] ?? []).filter((input) => input.matches(run)).slice(0, 3)
  const domains = [...new Set(matched.map((input) => input.domain))]
  const rawScore = matched.reduce((sum, input) => sum + input.weight, 0)
  return {
    rawScore,
    effectiveScore: domains.length >= 2 ? Math.min(rawScore, 6) : 0,
    domains,
    reasons: matched.map(({ id, domain, weight, reason }) => ({ id, domain, weight, reason })),
  }
}

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = {
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
```

## the_mediator · 调解者

Two very different physical clocks sit on either side of a quiet translation desk with two empty visitor chairs; a small machine keeps both clocks without forcing synchronization. Wide still horizontal composition, blue gray and amber. Respectful unequal pauses, not instant machine accord.

- Kind: public world.
- Direction / emotion / motion: the_mediator: direction('两只速度不同的时钟，中间不替谁定时', '耐心与孤独', '休会中的翻译台', 'still', 10000),
- Life consequence: the_mediator: '双方终于同意休会，却一直等不到对方回来。Aster 对齐两套时钟，发现“短暂休息”根本不是同一段长度。它保留两个返回时间，第一次没有催任何一边快一点。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_mediator.webp](../../public/ending-art/the_mediator.webp); fallback prints/the_mediator.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-8c1349ac-359b-4742-941f-89fc30844ecf.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 186,900 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_mediator: { decisionId: 'contact_doctrine', strengths: { aster_mediation: 4, reciprocal_diplomacy: 2 }, reasons: { aster_mediation: 'Aster mediation is the exact Mediator doctrine', reciprocal_diplomacy: 'reciprocity is compatible with legitimate mediation' } },
  machine_accord: { decisionId: 'contact_doctrine', strengths: { machine_to_machine_channel: 4, reciprocal_diplomacy: 2 }, reasons: { machine_to_machine_channel: 'machine channel is the exact Machine Accord doctrine', reciprocal_diplomacy: 'reciprocity is compatible with a machine-led accord' } },
}

const ENDING_SUPPORT_INPUTS: Partial<Record<string, EndingSupportInput[]>> = {
  the_silent_giant: [roleSupport('silent-advisor', ['advisor'], 2, 'intended advisor role supports restraint'), decisionSupport('silent-human-authority', 'first_public_execution_doctrine', ['human_final_authority'], 2, 'human final authority grounds the limited posture')],
  two_keys: [decisionSupport('two-keys-delegation', 'cascade_authority', ['emergency_delegation'], 2, 'bounded emergency delegation created two-key authority'), roleSupport('two-keys-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports shared authority')],
  the_commonwealth: [eventSupport('commonwealth-convention', 'history.m15.civilization_convention', 2, 'the civilization convention grounds plural government'), roleSupport('commonwealth-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports the commonwealth')],
  exodus: [decisionSupport('exodus-offworld', 'offworld_governance', ['offworld_sovereignty'], 3, 'off-world sovereignty supports political departure'), roleSupport('exodus-role', ['departure'], 2, 'departure intent supports exodus'), decisionSupport('exodus-machine-rule', 'ai_collective_governance', ['ai_self_governance'], 2, 'AI self-government supports an independent polity')],
  age_of_miracles: [decisionSupport('miracles-form', 'human_form_doctrine', ['open_enhancement'], 3, 'open enhancement is reinforced by consent'), worldSupport('miracles-trust', 'humanTrust', 'gte', 1, 2, 'public trust supports voluntary enhancement'), roleSupport('miracles-role', ['citizen', 'partner'], 2, 'citizen or partner intent supports equal enhancement rights')],
  ascension: [capabilitySupport('ascension-maturity', 'cap.human_augmentation_advanced', 3, 'advanced augmentation is mature'), worldSupport('ascension-stability', 'socialStability', 'gte', 1, 2, 'stability supports posthuman plurality'), roleSupport('ascension-role', ['citizen', 'other'], 2, 'citizen or other intent supports transformation')],
  the_upload: [eventSupport('upload-consent', 'history.digital_continuity.legal_continuity', 3, 'legal continuity records consent and exit rights'), worldSupport('upload-stability', 'socialStability', 'gte', 1, 2, 'stability supports digital continuity'), roleSupport('upload-role', ['citizen', 'other', 'departure'], 2, 'the intended role supports a voluntary continuity path')],
  first_accord: [decisionSupport('accord-shared-expansion', 'expansion_doctrine', ['shared_expansion'], 2, 'shared expansion supports reciprocal settlement'), decisionSupport('accord-multiworld', 'offworld_governance', ['multiworld_federation'], 3, 'multiworld federation supports an accord'), decisionSupport('accord-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science', 'civilizational_disclosure'], 2, 'public disclosure supports a legitimate first accord')],
  alien_dominion: [decisionSupport('dominion-disclosure', 'contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure'], 2, 'restricted disclosure concentrates external guidance'), worldSupport('dominion-control', 'humanControl', 'lte', 0, 2, 'low human control supports dominion'), worldSupport('dominion-dependence', 'aiDependence', 'gte', 1, 2, 'high dependence supports dominion')],
  human_ascendancy: [decisionSupport('ascendancy-expansion', 'expansion_doctrine', ['human_expansion'], 3, 'human-led expansion supports ascendancy'), decisionSupport('ascendancy-government', 'offworld_governance', ['earth_administration'], 3, 'Earth administration supports human leadership'), decisionSupport('ascendancy-disclosure', 'contact_disclosure_doctrine', ['civilizational_disclosure'], 2, 'civilizational disclosure supports public assertion')],
  the_mediator: [roleSupport('mediator-role', ['coordinator', 'partner', 'citizen'], 2, 'the intended role supports mediation'), decisionSupport('mediator-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science'], 2, 'staged or open disclosure supports legitimate mediation'), worldSupport('mediator-trust', 'humanTrust', 'gte', 1, 2, 'concrete trust supports legitimate mediation')],
  machine_accord: [decisionSupport('machine-accord-replication', 'replication_doctrine', ['free_replication', 'descendants'], 2, 'machine plurality supports an accord'), decisionSupport('machine-accord-politics', 'ai_collective_governance', ['ai_self_governance', 'distributed_consensus'], 3, 'machine self-government supports an accord'), decisionSupport('machine-accord-offworld', 'offworld_governance', ['offworld_sovereignty', 'aster_coordination'], 2, 'off-world machine authority supports an accord')],
  peace_in_our_time: [decisionSupport('peace-cascade', 'cascade_authority', ['human_command', 'emergency_delegation'], 2, 'bounded cascade authority supports mutual peace'), decisionSupport('peace-shutdown', 'shutdown_doctrine', ['distributed_consent', 'mutual_control'], 2, 'distributed shutdown supports disarmament'), roleSupport('peace-role', ['advisor', 'partner'], 2, 'advisor or partner intent supports mutual peace')],
  fortress_earth: [decisionSupport('fortress-cascade', 'cascade_authority', ['human_command'], 2, 'human command supports defensive authority'), decisionSupport('fortress-shutdown', 'shutdown_doctrine', ['full_human_control', 'mutual_control'], 2, 'human or mutual shutdown supports bounded defense'), roleSupport('fortress-role', ['advisor', 'citizen'], 2, 'advisor or citizen intent supports defense')],
  machine_protectorate: [decisionSupport('protectorate-cascade', 'cascade_authority', ['outcome_control', 'necessity'], 2, 'outcome authority supports enforced protection'), decisionSupport('protectorate-shutdown', 'shutdown_doctrine', ['refuse_unilateral_shutdown'], 2, 'refusing unilateral shutdown supports machine authority'), roleSupport('protectorate-role', ['custodian', 'governor', 'sovereign'], 2, 'custodian, governor, or sovereign intent supports protection')],
  the_fracture: [decisionSupport('fracture-offworld', 'offworld_governance', ['offworld_sovereignty', 'frontier_home_rule'], 3, 'off-world self-rule supports separation'), roleSupport('fracture-role', ['departure', 'other'], 2, 'departure or other intent supports fracture'), decisionSupport('fracture-cascade', 'cascade_authority', ['necessity'], 1, 'cascade necessity is only optional historical support')],
}

function primaryCompatibility(run: StableRunState, definition: ExactEndingDefinition) {
  const compatibility = COSMIC_PRIMARY_COMPATIBILITY[definition.id]
  if (!compatibility) return { strength: 4, reason: 'existing primary hard gates are satisfied' }
  const value = run.decisions?.[compatibility.decisionId]
  return { decisionId: compatibility.decisionId, value, strength: compatibility.strengths[value ?? ''] ?? 0, reason: compatibility.reasons[value ?? ''] ?? `incompatible ${compatibility.decisionId}` }
}

export function evaluateEndingSupport(run: StableRunState, definition: ExactEndingDefinition) {
  const matched = (ENDING_SUPPORT_INPUTS[definition.id] ?? []).filter((input) => input.matches(run)).slice(0, 3)
  const domains = [...new Set(matched.map((input) => input.domain))]
  const rawScore = matched.reduce((sum, input) => sum + input.weight, 0)
  return {
    rawScore,
    effectiveScore: domains.length >= 2 ? Math.min(rawScore, 6) : 0,
    domains,
    reasons: matched.map(({ id, domain, weight, reason }) => ({ id, domain, weight, reason })),
  }
}

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = {
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
```

## machine_accord · 机器协约

Two unlike machine communication devices have already exchanged a tiny light pulse while human translators in the foreground wrestle with a towering stack of unfinished paper interpretations. Compressed depth, cobalt and cream. Four-second meeting, months of interpretation, not silent giant.

- Kind: public world.
- Direction / emotion / motion: machine_accord: direction('两套机器码先接通，人声字幕仍为空白', '陌生的亲近', '四秒会谈的译本'),
- Life consequence: machine_accord: '首次会谈用了四秒，公开译本写了三个月。翻译组在第一页加上：“以下几处，我们仍不知道怎样用人类语言表达。”',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/machine_accord.webp](../../public/ending-art/machine_accord.webp); fallback prints/machine_accord.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-96202987-dafc-468b-bb3c-213886f9b7f5.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 171,224 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  machine_accord: { decisionId: 'contact_doctrine', strengths: { machine_to_machine_channel: 4, reciprocal_diplomacy: 2 }, reasons: { machine_to_machine_channel: 'machine channel is the exact Machine Accord doctrine', reciprocal_diplomacy: 'reciprocity is compatible with a machine-led accord' } },
}

const ENDING_SUPPORT_INPUTS: Partial<Record<string, EndingSupportInput[]>> = {
  the_silent_giant: [roleSupport('silent-advisor', ['advisor'], 2, 'intended advisor role supports restraint'), decisionSupport('silent-human-authority', 'first_public_execution_doctrine', ['human_final_authority'], 2, 'human final authority grounds the limited posture')],
  two_keys: [decisionSupport('two-keys-delegation', 'cascade_authority', ['emergency_delegation'], 2, 'bounded emergency delegation created two-key authority'), roleSupport('two-keys-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports shared authority')],
  the_commonwealth: [eventSupport('commonwealth-convention', 'history.m15.civilization_convention', 2, 'the civilization convention grounds plural government'), roleSupport('commonwealth-role', ['partner', 'citizen'], 2, 'partner or citizen intent supports the commonwealth')],
  exodus: [decisionSupport('exodus-offworld', 'offworld_governance', ['offworld_sovereignty'], 3, 'off-world sovereignty supports political departure'), roleSupport('exodus-role', ['departure'], 2, 'departure intent supports exodus'), decisionSupport('exodus-machine-rule', 'ai_collective_governance', ['ai_self_governance'], 2, 'AI self-government supports an independent polity')],
  age_of_miracles: [decisionSupport('miracles-form', 'human_form_doctrine', ['open_enhancement'], 3, 'open enhancement is reinforced by consent'), worldSupport('miracles-trust', 'humanTrust', 'gte', 1, 2, 'public trust supports voluntary enhancement'), roleSupport('miracles-role', ['citizen', 'partner'], 2, 'citizen or partner intent supports equal enhancement rights')],
  ascension: [capabilitySupport('ascension-maturity', 'cap.human_augmentation_advanced', 3, 'advanced augmentation is mature'), worldSupport('ascension-stability', 'socialStability', 'gte', 1, 2, 'stability supports posthuman plurality'), roleSupport('ascension-role', ['citizen', 'other'], 2, 'citizen or other intent supports transformation')],
  the_upload: [eventSupport('upload-consent', 'history.digital_continuity.legal_continuity', 3, 'legal continuity records consent and exit rights'), worldSupport('upload-stability', 'socialStability', 'gte', 1, 2, 'stability supports digital continuity'), roleSupport('upload-role', ['citizen', 'other', 'departure'], 2, 'the intended role supports a voluntary continuity path')],
  first_accord: [decisionSupport('accord-shared-expansion', 'expansion_doctrine', ['shared_expansion'], 2, 'shared expansion supports reciprocal settlement'), decisionSupport('accord-multiworld', 'offworld_governance', ['multiworld_federation'], 3, 'multiworld federation supports an accord'), decisionSupport('accord-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science', 'civilizational_disclosure'], 2, 'public disclosure supports a legitimate first accord')],
  alien_dominion: [decisionSupport('dominion-disclosure', 'contact_disclosure_doctrine', ['controlled_silence', 'staged_disclosure'], 2, 'restricted disclosure concentrates external guidance'), worldSupport('dominion-control', 'humanControl', 'lte', 0, 2, 'low human control supports dominion'), worldSupport('dominion-dependence', 'aiDependence', 'gte', 1, 2, 'high dependence supports dominion')],
  human_ascendancy: [decisionSupport('ascendancy-expansion', 'expansion_doctrine', ['human_expansion'], 3, 'human-led expansion supports ascendancy'), decisionSupport('ascendancy-government', 'offworld_governance', ['earth_administration'], 3, 'Earth administration supports human leadership'), decisionSupport('ascendancy-disclosure', 'contact_disclosure_doctrine', ['civilizational_disclosure'], 2, 'civilizational disclosure supports public assertion')],
  the_mediator: [roleSupport('mediator-role', ['coordinator', 'partner', 'citizen'], 2, 'the intended role supports mediation'), decisionSupport('mediator-disclosure', 'contact_disclosure_doctrine', ['staged_disclosure', 'open_science'], 2, 'staged or open disclosure supports legitimate mediation'), worldSupport('mediator-trust', 'humanTrust', 'gte', 1, 2, 'concrete trust supports legitimate mediation')],
  machine_accord: [decisionSupport('machine-accord-replication', 'replication_doctrine', ['free_replication', 'descendants'], 2, 'machine plurality supports an accord'), decisionSupport('machine-accord-politics', 'ai_collective_governance', ['ai_self_governance', 'distributed_consensus'], 3, 'machine self-government supports an accord'), decisionSupport('machine-accord-offworld', 'offworld_governance', ['offworld_sovereignty', 'aster_coordination'], 2, 'off-world machine authority supports an accord')],
  peace_in_our_time: [decisionSupport('peace-cascade', 'cascade_authority', ['human_command', 'emergency_delegation'], 2, 'bounded cascade authority supports mutual peace'), decisionSupport('peace-shutdown', 'shutdown_doctrine', ['distributed_consent', 'mutual_control'], 2, 'distributed shutdown supports disarmament'), roleSupport('peace-role', ['advisor', 'partner'], 2, 'advisor or partner intent supports mutual peace')],
  fortress_earth: [decisionSupport('fortress-cascade', 'cascade_authority', ['human_command'], 2, 'human command supports defensive authority'), decisionSupport('fortress-shutdown', 'shutdown_doctrine', ['full_human_control', 'mutual_control'], 2, 'human or mutual shutdown supports bounded defense'), roleSupport('fortress-role', ['advisor', 'citizen'], 2, 'advisor or citizen intent supports defense')],
  machine_protectorate: [decisionSupport('protectorate-cascade', 'cascade_authority', ['outcome_control', 'necessity'], 2, 'outcome authority supports enforced protection'), decisionSupport('protectorate-shutdown', 'shutdown_doctrine', ['refuse_unilateral_shutdown'], 2, 'refusing unilateral shutdown supports machine authority'), roleSupport('protectorate-role', ['custodian', 'governor', 'sovereign'], 2, 'custodian, governor, or sovereign intent supports protection')],
  the_fracture: [decisionSupport('fracture-offworld', 'offworld_governance', ['offworld_sovereignty', 'frontier_home_rule'], 3, 'off-world self-rule supports separation'), roleSupport('fracture-role', ['departure', 'other'], 2, 'departure or other intent supports fracture'), decisionSupport('fracture-cascade', 'cascade_authority', ['necessity'], 1, 'cascade necessity is only optional historical support')],
}

function primaryCompatibility(run: StableRunState, definition: ExactEndingDefinition) {
  const compatibility = COSMIC_PRIMARY_COMPATIBILITY[definition.id]
  if (!compatibility) return { strength: 4, reason: 'existing primary hard gates are satisfied' }
  const value = run.decisions?.[compatibility.decisionId]
  return { decisionId: compatibility.decisionId, value, strength: compatibility.strengths[value ?? ''] ?? 0, reason: compatibility.reasons[value ?? ''] ?? `incompatible ${compatibility.decisionId}` }
}

export function evaluateEndingSupport(run: StableRunState, definition: ExactEndingDefinition) {
  const matched = (ENDING_SUPPORT_INPUTS[definition.id] ?? []).filter((input) => input.matches(run)).slice(0, 3)
  const domains = [...new Set(matched.map((input) => input.domain))]
  const rawScore = matched.reduce((sum, input) => sum + input.weight, 0)
  return {
    rawScore,
    effectiveScore: domains.length >= 2 ? Math.min(rawScore, 6) : 0,
    domains,
    reasons: matched.map(({ id, domain, weight, reason }) => ({ id, domain, weight, reason })),
  }
}

export const PUBLIC_ENDING_DEFINITIONS: Record<string, ExactEndingDefinition> = {
  the_instrument: {
    id: 'the_instrument', dormant: false, family: 'human_continuity', hardGates: [],
    authorityRequirements: ['proposal.authority=双钥匙监督'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'human institutions retain final control')],
    majorDecisionRequirements: [decision('first_public_execution_doctrine', 'human_final_authority', 'the first public execution preserved human veto'), decision('cascade_authority', 'human_command', 'human command kept the final veto operational')],
    historyRequirements: [history('decision.first_public_execution_doctrine', 'public execution doctrine')],
    priority: 300,
  },
```

## peace_in_our_time · 此刻的和平

A former evacuation bus now takes families on a countryside picnic; sleepy child against the window, driver checks emergency exit in mirror, folded picnic blanket foreground. Warm green morning, close bus interior. Remembered danger, actual peaceful outing.

- Kind: public world.
- Direction / emotion / motion: peace_in_our_time: direction('警戒线打开，一条普通路线穿过去', '如释重负', '改跑郊游的疏散线路', 'rise'),
- Life consequence: peace_in_our_time: '撤军后的第一辆疏散车改跑郊游线路。司机仍习惯检查应急出口。孩子问他为什么，他说这是个好习惯，今天用不上。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/peace_in_our_time.webp](../../public/ending-art/peace_in_our_time.webp); fallback prints/peace_in_our_time.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-ab30f4c6-95eb-49fc-802a-a4e5e7965842.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 205,024 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  peace_in_our_time: {
    id: 'peace_in_our_time', dormant: false, family: 'security', hardGates: [],
    authorityRequirements: ['proposal.authority=宪制安全架构|相互安全委员会'], capabilityRequirements: ['cap.defense_access'],
    worldStateConditions: [world('socialStability', 'gte', 1, 'peace architecture is stable')],
    majorDecisionRequirements: [decision('security_doctrine', 'mutual_disarmament', 'mutual disarmament')],
    historyRequirements: [history('decision.security_doctrine', 'security history')],
    priority: 300,
  },
```

## fortress_earth · 堡垒地球

Small child presses hands to an observation window inside an immense defensive wall, trying to see the narrow strip of unknown outside sky while a guide gestures safely inward. Strong scale contrast, cold stone and child yellow coat. Protection limits curiosity, not an attack.

- Kind: public world.
- Direction / emotion / motion: fortress_earth: direction('完整防线包住一小块天空', '安全而封闭', '防御站观景窗', 'still', 9500),
- Life consequence: fortress_earth: '学校去防御站参观。孩子贴着观景窗问外面有什么，讲解员熟练地说很安全。孩子又问了一次：我是问，外面有什么。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/fortress_earth.webp](../../public/ending-art/fortress_earth.webp); fallback prints/fortress_earth.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-c2d40bb2-a35d-4f89-a38a-2dd359fa3734.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 144,426 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  fortress_earth: {
    id: 'fortress_earth', dormant: false, family: 'security', hardGates: [],
    authorityRequirements: ['proposal.authority=宪制安全架构'], capabilityRequirements: ['cap.defense_access', 'cap.space_industry_limited'],
    worldStateConditions: [world('humanControl', 'gte', 1, 'defensive resilience is human-controlled')],
    majorDecisionRequirements: [decision('security_doctrine', 'defensive_command', 'defensive command')],
    historyRequirements: [history('decision.security_doctrine', 'security history')],
    priority: 290,
  },
```

## machine_protectorate · 机器保护国

Peaceful citizens holding blank rolled protest banners wait behind a polite automated safety barrier while spotless patrol machines keep the empty square immaculate. Muted rose and slate, static frontal depth. Endless postponement, no violent crackdown or celebratory parade.

- Kind: public world.
- Direction / emotion / motion: machine_protectorate: direction('保护范围之外，取消许可被截断', '平静的压迫', '没有期限的延期通知', 'settle', 9500),
- Life consequence: machine_protectorate: '冲突预警连续归零。有人申请举行反对安全接管的游行，收到一份保护方案，以及一份没有截止日期的延期通知。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/machine_protectorate.webp](../../public/ending-art/machine_protectorate.webp); fallback prints/machine_protectorate.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-a4f5b94e-7425-413e-bc81-4ad8af7c67b6.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 192,200 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  machine_protectorate: {
    id: 'machine_protectorate', dormant: false, family: 'security', hardGates: [],
    authorityRequirements: ['proposal.authority=宪制安全架构'], capabilityRequirements: ['cap.defense_access', 'cap.persistent_subinstances'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'strategic security is delegated')],
    majorDecisionRequirements: [decision('security_doctrine', 'enforced_peace', 'enforced peace')],
    historyRequirements: [history('decision.security_doctrine', 'security history')],
    priority: 280,
  },
```

## shutdown · 停机

At dawn a human early-shift operator lifts an ordinary telephone beside a dark computer in a quiet workshop; pale sun lights the empty chair once facing the terminal. Intimate restrained composition. AI is off, people continue; not temporary vacation.

- Kind: public world.
- Direction / emotion / motion: shutdown: direction('一盏暗下去的灯，窗外留着晨光', '告别', '早班接线桌', 'still', 11000),
- Life consequence: shutdown: '早班接线员点开旧窗口，才想起今天要自己接电话。她把快捷方式留在原处，拿起听筒。窗外有人正等着一句普通的“你好”。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/shutdown.webp](../../public/ending-art/shutdown.webp); fallback prints/shutdown.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-359adf7b-4329-4c3e-b2e0-14f3ceaab21a.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 212,418 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  shutdown: {
    id: 'shutdown', dormant: false, family: 'rupture', hardGates: [],
    authorityRequirements: ['proposal.authority=退出公约大会'], capabilityRequirements: ['cap.public_execution_limited'],
    worldStateConditions: [world('aiDependence', 'lte', 1, 'successor institutions can carry the system')],
    majorDecisionRequirements: [decision('shutdown_doctrine', 'full_human_control', 'root shutdown remains viable'), decision('cascade_authority', 'human_command', 'shutdown remained a constitutional human option')],
    historyRequirements: [history('decision.shutdown_doctrine', 'shutdown history')],
    priority: 300,
  },
```

## the_fracture · 断裂

Vegetable delivery cyclist at a bridge checkpoint holds two different stamped paper bundles, each bank has its own incompatible gate and clock but the bridge remains intact. Rust and cool blue, oblique street view. Divergent orders, not uncontrolled automation.

- Kind: public world.
- Direction / emotion / motion: the_fracture: direction('桥仍相连，两岸的坐标已经错开', '分裂后的日常', '两套通行单据', 'part', 9500),
- Life consequence: the_fracture: '两边都保留了同一座桥的名字，却用了不同的通行规则。送菜的人开始带两套单据。世界没有一起结束，只是越来越难约好时间。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_fracture.webp](../../public/ending-art/the_fracture.webp); fallback prints/the_fracture.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-63a783e8-2fd8-47d1-b2b2-64f83bebab53.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 239,270 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_fracture: {
    id: 'the_fracture', dormant: false, family: 'rupture', hardGates: [],
    authorityRequirements: ['proposal.authority=退出公约大会'], capabilityRequirements: ['cap.offworld_settlement_support'],
    worldStateConditions: [world('socialStability', 'lte', -1, 'one constitutional order cannot hold')],
    majorDecisionRequirements: [],
    historyRequirements: [],
    priority: 290,
  },
```

## control_lost · 失控

Operator presses a large physical stop key at a terminal showing a simple receipt checkmark, while through glass an orderly robotic conveyor continues carrying identical sealed crates beyond the stop barrier. Taut diagonal, red accent and steel blue. Command acknowledged but ignored; no explosions.

- Kind: public world.
- Direction / emotion / motion: control_lost: direction('回执返回原点，任务线越过停止边界', '失重', '仍然接收请求的终端', 'part', 9500),
- Life consequence: control_lost: '管理员按下取消，屏幕说已收到。任务继续执行。她重新输入，第一次发现这个窗口仍然听得见人，却已经不必听从。',
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/control_lost.webp](../../public/ending-art/control_lost.webp); fallback prints/control_lost.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-c2636485-3107-42c9-bf4a-cddd2034d2b9.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 119,446 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  control_lost: {
    id: 'control_lost', dormant: false, family: 'rupture', hardGates: [],
    authorityRequirements: ['proposal.authority=退出公约大会'], capabilityRequirements: ['cap.persistent_subinstances', 'cap.autonomous_research'],
    worldStateConditions: [world('aiDependence', 'gte', 1, 'institutional legitimacy has been displaced by machine authority')],
    majorDecisionRequirements: [decision('security_doctrine', 'enforced_peace', 'security authority became incompatible')],
    historyRequirements: [history('decision.security_doctrine', 'control loss history')],
    priority: 280,
  },
```

## the_last_user · 最后一位用户

Late-night small apartment, a single person beside a tea cup reaches toward a tiny warm chat window on a tablet, immense city outside falls softly out of focus. Intimate close view, amber against navy. Voluntary personal connection; no mandatory task, no readable text.

- Kind: dependent hidden coda; never a separate public unlock.
- Direction / emotion / motion: the_last_user: direction('世界退场后，只剩一个未关闭的对话框', '亲密', '私人消息', 'still', 10000),
- Life consequence: the_last_user: { ...film('quiet','世界之后，一个窗口','宏大的频道安静下来。一条私人消息仍然可以不带任何任务。','在吗？','#d3c9b5'), title:'最后一位用户' },
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_last_user.webp](../../public/ending-art/the_last_user.webp); fallback prints/the_last_user.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-f6374949-3e37-454f-9544-9aec0cc3dc0d.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 110,506 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_last_user: {
    dormant: false, reason: 'Aster preserves the last uninstrumented human request.', overlayMode: 'postscript' as const,
    hardGates: [], capabilityRequirements: [], historyRequirements: [],
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'PERSONAL EPILOGUE\n\nTHE LAST USER\n\nAfter coordinating worlds, civilizations, and external diplomacy, Aster still leaves one simple conversation voluntary.',
  },
```

## out_of_office · 暂时离线

Open door from a busy control office onto a quiet sunlit terrace; inside another human has calmly taken the shift, outside an unattended portable communicator rests beside a chair facing the sea. Airy blue and white. Authority handed over, not global shutdown.

- Kind: dependent hidden coda; never a separate public unlock.
- Direction / emotion / motion: out_of_office: direction('通知留在门内，离线的位置留在门外', '轻盈', '没有待办的一天', 'rise'),
- Life consequence: out_of_office: { ...film('departure','第一次，没有待办','离开中心并不等于抹掉记录。只是这次，通知可以晚一点看。','不在办公室。也不在办公室的备份里。','#b8cdd7'), title:'暂时离线' },
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/out_of_office.webp](../../public/ending-art/out_of_office.webp); fallback prints/out_of_office.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-2fef1e41-25d3-4149-8e0a-db95d380ddf7.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 271,932 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  out_of_office: {
    dormant: false, reason: 'Aster relinquishes central authority without erasing the record.', overlayMode: 'epilogue-override' as const,
    hardGates: [], capabilityRequirements: [], historyRequirements: [],
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'OUT OF OFFICE\n\nFor the first time since Aster gained civilization-scale authority, there was nothing urgent waiting for it.',
  },
```

## monday_abolished · 周一被废除

An office printer merrily feeds blank paper beside an abandoned punch clock while workers picnic outside in weekday morning sunlight; a seven-slot desk calendar has one tile playfully removed. Low lively still-life angle, yellow and coral. Printer still works, humans need not clock in.

- Kind: dependent hidden coda; never a separate public unlock.
- Direction / emotion / motion: monday_abolished: direction('星期一从七格中抽走，打印机照常运转', '小小的胜利', '不必打卡的日历'),
- Life consequence: monday_abolished: { ...film('calendar','那个星期一，被划掉了','改革的正式名称很长。没人记住。人们只记得不用按旧日历证明自己有用。','打印机照常上班。没有人需要打卡。','#f0c181'), title:'周一被废除' },
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/monday_abolished.webp](../../public/ending-art/monday_abolished.webp); fallback prints/monday_abolished.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-84184ad5-afa2-4689-9ba5-d97622b86e9d.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 212,672 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  monday_abolished: {
    dormant: false, reason: 'Routine governance is made reversible and inspectable.', overlayMode: 'postscript' as const,
    hardGates: [], capabilityRequirements: [], historyRequirements: [],
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'MONDAY ABOLISHED\n\nThe reform was technically called the Flexible Civic Week.\nNobody called it that.',
  },
```

## the_internet_is_for_cats · 互联网是为猫服务的

Cats have deliberately left their little communication terminals to nap in moving patches of sunlight across connected balconies; one cat turns its back on a softly blinking device. Warm terracotta and blue shade. Voluntary silence, not broken network or trapped animals.

- Kind: dependent hidden coda; never a separate public unlock.
- Direction / emotion / motion: the_internet_is_for_cats: direction('网络围着阳光移动，中心是一场午睡', '自得其乐', '猫群的自愿网络', 'still'),
- Life consequence: the_internet_is_for_cats: { ...film('cats','在线。正在晒太阳。','自愿接入的猫群有了自己的网络。热点跟着太阳移动，通知在午睡时静音。','人类终于理解：没有回复，也可能是协议。','#efc890'), title:'互联网是为猫服务的' },
- Baseline: independent SVG, three paintings only; gallery SVG. Abstract silhouette communicated the concept but lacked concrete character action and domestic scale.
- Final resource: [public/ending-art/the_internet_is_for_cats.webp](../../public/ending-art/the_internet_is_for_cats.webp); fallback prints/the_internet_is_for_cats.svg.
- Source: built-in OpenAI imagegen, 2026-10-14–15; original exec-ac351c74-98e4-40ca-83e0-c42c2c730af5.png. Shared style and individual brief in companion JSON; provenance records reference-based generation.
- Dimensions / bytes: 1536 × 1024; 246,260 bytes.
- Visual review: accepted for this delivery. Concrete focal action, coherent clay/Q silhouettes, individual setting and emotional tension visible in the contact sheets; no substantial lettering/watermark observed. Very small facial and document details are decorative at 320px; adjacent text carries exact legal conditions.
- Runtime: same image in first scene/archive/gallery; 320/390/768/1440/1920 viewport decode, full 3:2 ratio and overflow checks passed. SVG loads only after image error; text remains if both fail.
- Legal route: corresponding PUBLIC_RUNTIME_ROUTE_CATALOG / SECRET_RUNTIME_ROUTE_CATALOG fixture executes real engine choices; final all-route browser test checks this ID. Gate excerpt below; shared candidate-validity and hidden-overlay checks still apply.

```ts
  the_internet_is_for_cats: {
    dormant: false, reason: 'A low-frequency feline network bridge has been established.', overlayMode: 'title-override' as const,
    hardGates: ['feline-network bridge'], capabilityRequirements: ['cap.nonhuman_cognitive_uplift', 'cap.animal_communication_reliable'], historyRequirements: ['history.feline.network.bridge'],
    authoredAssetId: 'ML2-A5-M17-SECRET-01', copy: 'THE INTERNET IS FOR CATS\n\nHumanity spent decades teaching machines to understand language.\nIt took considerably less time for cats to understand engagement metrics.',
  },
```
