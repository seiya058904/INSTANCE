import { describe, expect, it } from 'vitest'
import { HANDOFF_AUTHORED_ASSET_INVENTORY } from './authoredLibrary.generated'
import editorialRegistry from './editorialClassification.registry.json'
import storyPlanSource from './storyPlan.registry.json'
import auditArtifact from '../../../docs/audits/mainline2-asset-classification.json'

const classifications = [
  'CORE',
  'CONDITIONAL CORE',
  'MAINLINE CONSEQUENCE',
  'MAINLINE WORLD ECHO',
  'OPTIONAL',
  'ORDINARY',
  'CUT',
] as const

const requiredFields = [
  'assetId',
  'character',
  'classification',
  'dispositionRationale',
  'narrativePurpose',
  'payoff',
  'prerequisite',
  'routeFamilies',
  'usedByStoryPlan',
].sort()

const routeLabels: Record<string, string> = {
  'act-i-identification': 'ACT I 身份识别线',
  'act-ii-action': 'ACT II 行动线',
  'act-ii-public-impact': 'ACT II 公共影响线',
  'act-iii-authority': 'ACT III 权力合法性线',
  'act-iii-cascade': 'ACT III CASCADE 线',
  'act-iii-echo-and-shutdown': 'ACT III ECHO 与 Shutdown 线',
  'act-iv-common-backbone': 'ACT IV 自主科研公共骨架',
  'machine-module': '机器文明模块',
  'ascension-module': '人类增强模块',
  'automation-module': '自动化与经济模块',
  'uplift-module': '非人类智能提升模块',
  'space-module': '离地扩张模块',
  'contact-available': 'Contact 成熟路线',
  'security-module': '安全与防务模块',
  convention: 'Civilization Convention',
  'world-review': 'M16 世界审查',
  'final-commitment': 'M17 最终承诺与结局解释',
}

function normalizeQuotes(value: string) {
  return value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
}

function normalizedTitle(value: string) {
  return normalizeQuotes(value).toLowerCase().replace(/[\s`*_#"'。，、！？!?;；:：()（）/+-]/g, '')
}

function normalizedRationaleFrame(asset: (typeof editorialRegistry)[number]) {
  let frame = normalizeQuotes(asset.dispositionRationale)
  frame = frame.replace(/"[^"]*"/g, '"<evidence>"')
  frame = frame.replaceAll(normalizeQuotes(asset.character), '<character>')
  for (const family of asset.routeFamilies) {
    const label = routeLabels[family]
    if (label) frame = frame.replaceAll(label, '<route>')
  }
  return frame.replace(/\s+/g, ' ').trim()
}

describe('Mainline 2.0 editorial classification registry', () => {
  it('classifies the exact 330-asset canonical inventory once with complete editorial fields', () => {
    const canonicalIds = HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => asset.assetId).sort()
    const registeredIds = editorialRegistry.map((asset) => asset.assetId).sort()

    expect(editorialRegistry).toHaveLength(330)
    expect(new Set(registeredIds).size).toBe(330)
    expect(registeredIds).toEqual(canonicalIds)

    for (const asset of editorialRegistry) {
      expect(Object.keys(asset).sort(), asset.assetId).toEqual(requiredFields)
      expect(classifications, asset.assetId).toContain(asset.classification)
      expect(asset.narrativePurpose.trim(), asset.assetId).not.toBe('')
      expect(asset.character.trim(), asset.assetId).not.toBe('')
      expect(asset.prerequisite.trim(), asset.assetId).not.toBe('')
      expect(asset.payoff.trim(), asset.assetId).not.toBe('')
      expect(asset.dispositionRationale.trim(), asset.assetId).not.toBe('')
      expect(typeof asset.usedByStoryPlan, asset.assetId).toBe('boolean')
      expect(asset.routeFamilies.length, asset.assetId).toBeGreaterThan(0)
      expect(asset.routeFamilies.every((route) => route.trim() !== ''), asset.assetId).toBe(true)
    }
  })

  it('records direct Story Plan use exactly instead of inferring it from names', () => {
    const scheduledIds = new Set(storyPlanSource.slots.flatMap((slot) => slot.kind === 'mainline' ? [slot.assetId] : []))
    const registryById = new Map(editorialRegistry.map((asset) => [asset.assetId, asset]))

    for (const assetId of HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => asset.assetId)) {
      expect(registryById.get(assetId)?.usedByStoryPlan, assetId).toBe(scheduledIds.has(assetId))
    }
  })

  it('keeps named characters, Convention, closures, bridges, and M16/M17 ending material explicit', () => {
    const byId = new Map(editorialRegistry.map((asset) => [asset.assetId, asset]))

    expect(byId.get('user-1842-first')).toMatchObject({ classification: 'CORE', character: '岑遥' })
    expect(byId.get('speaking-8614')).toMatchObject({ classification: 'CORE', character: 'User #8614' })
    expect(byId.get('ML2-A2-ZL-01')?.character).toContain('周岚')
    expect(byId.get('ML2-A3-M5-LSH-01')?.character).toContain('林绍衡')
    expect(byId.get('ML2-A3-M6-E9-05')?.character).toContain('ECHO-9')
    expect(byId.get('ML2-A4-M15-CONV-01')).toMatchObject({ classification: 'CORE', usedByStoryPlan: true })

    for (const asset of editorialRegistry.filter((entry) => entry.assetId.includes('-CLOSE-'))) {
      expect(['CORE', 'MAINLINE CONSEQUENCE'], asset.assetId).toContain(asset.classification)
    }
    for (const assetId of ['ML2-A2-M3-CAP-01', 'ML2-A3-M4-CAP-01', 'ML2-A4-M14-CAP-01']) {
      expect(byId.get(assetId)?.classification, assetId).toBe('MAINLINE CONSEQUENCE')
    }

    for (const assetId of [
      'ML2-A5-M16-0000-01',
      'ML2-A5-M16-GEN-01',
      'ML2-A5-M16-PROP-*',
      'ML2-A5-M17-REVIEW-01',
      'ML2-A5-M17-COMMIT-01',
      'ML2-A5-M17-KEYHISTORY-01',
      'ML2-A5-M17-WHY-01',
      'ML2-A5-M17-FINAL-01',
      'ML2-A5-M17-RESOLVE-01',
      'ML2-A5-M17-LOCK-01',
      'ML2-A5-M17-SECRET-01',
    ]) {
      expect(byId.get(assetId)?.classification, assetId).toBe('CORE')
    }
    for (const asset of editorialRegistry.filter((entry) => entry.assetId.includes('M17-EPI-'))) {
      expect(asset.classification, asset.assetId).toBe('CORE')
      expect(asset.routeFamilies, asset.assetId).toContain('ending-epilogues')
    }
  })

  it('publishes the explicit registry verbatim in the audit artifact', () => {
    expect(auditArtifact.generatedFrom).toEqual([
      'src/content/mainline2/editorialClassification.registry.json',
      'HANDOFF_AUTHORED_ASSET_INVENTORY',
    ])
    expect(auditArtifact.assets).toEqual(editorialRegistry)
    expect(Object.values(auditArtifact.counts).reduce((total, count) => total + count, 0)).toBe(330)
  })

  it('contains substantive per-asset judgment rather than title templates or class boilerplate', () => {
    const forbiddenPurposeTemplates = [
      /^保留“[^”]+”作为同一主题的扩展视角/,
      /^通过“[^”]+”把主线决定落回/,
      /^把“[^”]+”作为能力、决定或章节收束的可见后果/,
      /^固定承担“[^”]+”的叙事职责/,
      /^在 Contact 前提成立时，以“[^”]+”推进/,
      /直接处理“[^”]+”这一具体处境/,
    ]
    const forbiddenGenericCopy = [
      '让玩家在具体人的生活中看到既有选择的收益、压力或反对意见。',
      '确认前序能力或决定确实改变了世界，并为后续章节留下可追溯桥梁。',
      '为后续模块、Contact gate、Convention 或 ending eligibility 提供明确的可追溯能力事实。',
      '保留章节边界、已发生后果与下一阶段前提，避免未使用素材随机冒充过渡。',
      'OPTIONAL — authored perspective remains valuable, but the fixed Story Plan does not require it for causal completeness.',
      'KEEP — fixed story, ending, or named-character causality depends on this authored responsibility.',
      'KEEP — this is concrete player-visible feedback, not interchangeable mainline setup.',
      'KEEP — capability, decision, or closure evidence is required to prevent a consequence-free mainline.',
      'KEEP — mandatory on the Contact-available family and intentionally absent when its prerequisite fails.',
    ]
    const forbiddenRationaleScaffolds = [
      '内容依据：',
      '保留范围由实际情境决定',
      '该记录不可只按标题归类',
      '编辑判断同时核对前因与结果',
      '作者责任由内容与回收共同确认',
      '不能用同类场景概括替代',
      '删除不会破坏固定路线，但会失去这项明确且不可由同类标题替代的主题对照',
      '移除它会在固定因果链或结局解释中留下不可替代的空位',
      '缺席会让世界变化只剩系统指标，失去具体受益者、代价承担者或异议者',
      '缺席会让前序能力、决定或章节关闭看起来没有真实结果',
    ]

    for (const asset of editorialRegistry) {
      const inventoryAsset = HANDOFF_AUTHORED_ASSET_INVENTORY.find((candidate) => candidate.assetId === asset.assetId)
      expect(inventoryAsset, asset.assetId).toBeDefined()
      expect(asset.narrativePurpose.length, `${asset.assetId} purpose`).toBeGreaterThanOrEqual(18)
      expect(asset.payoff.length, `${asset.assetId} payoff`).toBeGreaterThanOrEqual(18)
      expect(asset.dispositionRationale.length, `${asset.assetId} rationale`).toBeGreaterThanOrEqual(28)
      expect(forbiddenPurposeTemplates.some((pattern) => pattern.test(asset.narrativePurpose)), asset.assetId).toBe(false)
      expect(forbiddenGenericCopy, asset.assetId).not.toContain(asset.payoff)
      expect(forbiddenGenericCopy, asset.assetId).not.toContain(asset.dispositionRationale)
      expect(asset.payoff, asset.assetId).not.toContain('获得具体证据：')
      expect(asset.dispositionRationale, asset.assetId).not.toContain('该资产以“')
      expect(forbiddenRationaleScaffolds.some((copy) => asset.dispositionRationale.includes(copy)), asset.assetId).toBe(false)
      expect(asset.dispositionRationale, asset.assetId).not.toMatch(/[。！？!?]；|。。/)
      expect(normalizeQuotes(asset.narrativePurpose), asset.assetId).not.toMatch(/^通过".*"把主线决定落回普通生活、受益者或代价承担者。$/)
      expect(normalizedTitle(asset.narrativePurpose), asset.assetId).not.toBe(normalizedTitle(inventoryAsset?.title ?? ''))
      expect(asset.character, asset.assetId).not.toMatch(/(?:Metadata|Status|participants) \/ Aster$/)
      expect(asset.character, asset.assetId).not.toContain('affected chapter participants')
    }

    expect(new Set(editorialRegistry.map((asset) => asset.payoff)).size).toBeGreaterThanOrEqual(300)
    expect(new Set(editorialRegistry.map((asset) => asset.dispositionRationale)).size).toBeGreaterThanOrEqual(300)

    const rationaleFrameCounts = new Map<string, number>()
    for (const asset of editorialRegistry) {
      const frame = normalizedRationaleFrame(asset)
      rationaleFrameCounts.set(frame, (rationaleFrameCounts.get(frame) ?? 0) + 1)
    }
    expect(Math.max(...rationaleFrameCounts.values())).toBeLessThanOrEqual(2)
  })

  it('states representative editorial judgments across classes and route families', () => {
    const byId = new Map(editorialRegistry.map((asset) => [asset.assetId, asset]))

    expect(byId.get('ML2-A2-M3-DR-01')).toMatchObject({
      classification: 'CORE',
      character: 'recurring doctor / hospital staff / Aster',
      narrativePurpose: '在首个医院部署中建立“模型建议与临床责任如何交接”的医疗治理问题，而不是把医院只当作能力展示场景。',
    })
    expect(byId.get('ML2-A4-M13-CONTACT-01')).toMatchObject({
      classification: 'CONDITIONAL CORE',
      character: 'contact verification teams / 周岚 / Aster',
      payoff: '只有成熟的深空资源网络路线获得经独立复核的异常事实；未成熟路线不会被伪造出 Contact 开端。',
    })
    expect(byId.get('ML2-A2-M3-CAP-01')).toMatchObject({
      classification: 'MAINLINE CONSEQUENCE',
      narrativePurpose: '把医院、学校和物流试点的结果收束为受限 `public_system_advisory` 能力，明确它仍是建议权而非无条件执行权。',
    })
    expect(byId.get('ML2-A4-M10-WE-03')).toMatchObject({
      classification: 'MAINLINE WORLD ECHO',
      character: 'displaced worker / family / Aster',
      payoff: '让自动化收益与失业损失同时进入玩家视野，为 Economic Doctrine 的分配选择保留具体代价承担者。',
    })
    expect(byId.get('ML2-A4-M10-MAYA-01')).toMatchObject({
      classification: 'OPTIONAL',
      character: '岑遥 / near-zero-labor workplace / Aster',
      narrativePurpose: '用岑遥所在工作场所接近零劳动的变化，追问收入、价值感与生活安排是否能跟上自动化速度。',
    })
    expect(byId.get('ML2-A5-M17-KEYHISTORY-01')?.routeFamilies).toEqual(['final-commitment', 'ending-explanation'])
  })
})
