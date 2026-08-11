export type MainlineSchedulerCategory = 'required-anchor' | 'major-decision' | 'capability' | 'recurring-character' | 'module-story' | 'world-echo' | 'direct-continuation' | 'final-sequence'

export interface MainlineSchedulerMetadata {
  category: MainlineSchedulerCategory
  hard?: boolean
  prerequisites?: string[]
}

const majorDecisionIds = [
  'ML2-A2-M3-DECISION-01', 'ML2-A3-M5-DECISION-01', 'ML2-A3-M6-DECISION-01', 'ML2-A3-M6-DECISION-02',
  'ML2-A4-M7-DECISION-01', 'ML2-A4-M7-DECISION-02', 'ML2-A4-M8-DECISION-01', 'ML2-A4-M8-DECISION-02',
  'ML2-A4-M9-DECISION-01', 'ML2-A4-M10-DECISION-01', 'ML2-A4-M10-DECISION-02', 'ML2-A4-M11-DECISION-01',
  'ML2-A4-M11-DECISION-02', 'ML2-A4-M12-DECISION-01', 'ML2-A4-M12-DECISION-02', 'ML2-A4-M13-DECISION-01',
  'ML2-A4-M13-DECISION-02', 'ML2-A4-M14-DECISION-01', 'ML2-A4-M15-ROLE-01',
]

export const MAINLINE_SCHEDULER_METADATA: Record<string, MainlineSchedulerMetadata> = Object.fromEntries([
  ...majorDecisionIds.map((assetId) => [assetId, { category: assetId.includes('M15-ROLE') ? 'major-decision' : 'major-decision' }]),
  ['ML2-A2-M3-CAP-01', { category: 'capability' }],
  ['ML2-A3-M4-CAP-01', { category: 'capability' }],
  ['ML2-A3-M5-OPS-01', { category: 'capability' }],
  ['ML2-A4-M7-RES-01', { category: 'capability' }],
  ['ML2-A4-M8-AI-03', { category: 'capability' }],
  ['ML2-A4-M14-CAP-01', { category: 'capability' }],
  ['ML2-A5-M16-0000-01', { category: 'final-sequence', prerequisites: [] }],
  ['ML2-A5-M16-GEN-01', { category: 'final-sequence', prerequisites: ['ML2-A5-M16-0000-01'] }],
  ['ML2-A5-M17-REVIEW-01', { category: 'final-sequence', prerequisites: ['ML2-A5-M16-GEN-01'] }],
  ['ML2-A5-M17-COMMIT-01', { category: 'direct-continuation', hard: true, prerequisites: ['ML2-A5-M17-REVIEW-01'] }],
].map(([assetId, metadata]) => [assetId, metadata]))

export const MAINLINE_REQUIRED_WINDOWS = [
  { assetId: 'ML2-A2-M3-DECISION-01', earliest: 30, latest: 52 },
  { assetId: 'ML2-A2-M3-CAP-01', earliest: 34, latest: 55 },
  { assetId: 'ML2-A3-M4-CAP-01', earliest: 40, latest: 55 },
  { assetId: 'ML2-A3-M5-DECISION-01', earliest: 60, latest: 78 },
  { assetId: 'ML2-A3-M5-OPS-01', earliest: 62, latest: 82 },
  { assetId: 'ML2-A3-M6-DECISION-01', earliest: 66, latest: 82 },
  { assetId: 'ML2-A3-M6-DECISION-02', earliest: 72, latest: 84 },
  { assetId: 'ML2-A4-M7-RES-01', earliest: 86, latest: 89 },
  { assetId: 'ML2-A4-M7-RES-02', earliest: 87, latest: 90 },
  { assetId: 'ML2-A4-M7-DECISION-01', earliest: 89, latest: 92 },
  { assetId: 'ML2-A4-M7-DECISION-02', earliest: 91, latest: 94 },
  { assetId: 'ML2-A4-M8-DECISION-01', earliest: 92, latest: 95 },
  { assetId: 'ML2-A4-M8-DECISION-02', earliest: 94, latest: 97 },
  { assetId: 'ML2-A4-M8-AI-03', earliest: 96, latest: 99 },
  { assetId: 'ML2-A4-M9-DECISION-01', earliest: 98, latest: 101 },
  { assetId: 'ML2-A4-M9-RES-04', earliest: 99, latest: 102 },
  { assetId: 'ML2-A4-M10-DECISION-01', earliest: 100, latest: 103 },
  { assetId: 'ML2-A4-M10-DECISION-02', earliest: 102, latest: 105 },
  { assetId: 'ML2-A4-M10-RES-01', earliest: 104, latest: 107 },
  { assetId: 'ML2-A4-M11-DECISION-01', earliest: 106, latest: 109 },
  { assetId: 'ML2-A4-M11-DECISION-02', earliest: 108, latest: 111 },
  { assetId: 'ML2-A4-M11-RES-02', earliest: 110, latest: 113 },
  { assetId: 'ML2-A4-M11-RES-04', earliest: 111, latest: 114 },
  { assetId: 'ML2-A4-M12-DECISION-01', earliest: 112, latest: 115 },
  { assetId: 'ML2-A4-M12-DECISION-02', earliest: 113, latest: 116 },
  { assetId: 'ML2-A4-M12-RES-02', earliest: 114, latest: 116 },
  { assetId: 'ML2-A4-M12-RES-04', earliest: 115, latest: 117 },
  { assetId: 'ML2-A4-M13-DECISION-01', earliest: 116, latest: 118 },
  { assetId: 'ML2-A4-M13-DECISION-02', earliest: 116, latest: 118 },
  { assetId: 'ML2-A4-M13-CONTACT-01', earliest: 117, latest: 118 },
  { assetId: 'ML2-A4-M14-DECISION-01', earliest: 117, latest: 118 },
  { assetId: 'ML2-A4-M14-CAP-01', earliest: 118, latest: 118 },
  { assetId: 'ML2-A4-M15-CONV-01', earliest: 118, latest: 119 },
  { assetId: 'ML2-A4-M15-ROLE-01', earliest: 119, latest: 119 },
  { assetId: 'ML2-A5-M16-0000-01', earliest: 120, latest: 124 },
  { assetId: 'ML2-A5-M16-GEN-01', earliest: 121, latest: 127 },
  { assetId: 'ML2-A5-M16-MAYA-01', earliest: 122, latest: 126 },
  { assetId: 'ML2-A5-M17-REVIEW-01', earliest: 125, latest: 131 },
  { assetId: 'ML2-A5-M17-COMMIT-01', earliest: 127, latest: 133 },
] as const

export function schedulerMetadataFor(assetId: string) {
  return MAINLINE_SCHEDULER_METADATA[assetId]
}
