import { describe, expect, it } from 'vitest'
import { MAINLINE2_LIBRARY } from '../content/mainline2/registry'
import { buildStoryContentForManifest, createEmptyExposureHistory, LEGACY_RUN_MANIFEST, ordinaryConversationPool } from '../content/runManifest'
import { CHECKPOINT_KEY, loadCheckpoint, readRecoveryRecord } from './checkpoint'
import type { CheckpointData } from './checkpoint'
import { commitChoice, createMainline2Run, createRun, resolveScene } from './engine'
import { hasValidHistoryPresentation } from './historyValidation'
import { commitNonMainlineChoice, createNonMainlineSession, resolveNonMainlineScene } from './nonMainlineSession'
import { ACTIVE_SURFACE_KEY, NON_MAINLINE_SESSION_KEY, restoreNonMainlineSession } from './nonMainlineStorage'
import { restoreRun } from './storage'

function progressedCheckpoint(surface: CheckpointData['surface']): CheckpointData {
  const exposure = createEmptyExposureHistory()
  const run = createMainline2Run('history-presentation-mainline')
  const session = createNonMainlineSession('corrupt-frontend-0', exposure)
  return {
    run: commitChoice(run, resolveScene(run).choices[0].id),
    session: commitNonMainlineChoice(session, resolveNonMainlineScene(session).choices[0].id),
    exposure,
    meta: { version: 1, runCount: 1, completedEndings: [] },
    surface,
    nonMainlineView: 'ending',
  }
}

function readOnlyStorage(values: Map<string, string>) {
  return { getItem: (key: string) => values.get(key) ?? null, setItem: () => { throw Error('Validation must not write storage') } }
}

const longInput = { kind: 'transcript', estimatedLength: '约 20 字', preview: '预算还没有正式批准。', keyFacts: ['预算未批准'] }
const longform = { artifactType: 'report', estimatedLength: '约 800 字', preview: '这是已保存的原文。' }
const malformedPresentation: Array<[string, Record<string, unknown>]> = [
  ['message list is not an array', { userMessages: 'broken' }],
  ['message contains a React object', { userMessages: ['ok', { unexpected: 'object' }] }],
  ['user attachment is not an array', { userContent: 'invalid-content-string' }],
  ['assistant attachment is null', { assistantContent: [null] }],
  ['attachment has an unknown kind', { userContent: [{ type: 'unknown', text: 'image' }] }],
  ['attachment text is an object', { userContent: [{ type: 'text', text: {} }] }],
  ['attachment alternative text is an object', { assistantContent: [{ type: 'generated-image', text: 'image', alt: {} }] }],
  ['long input is an array', { userLongInput: [] }],
  ['long input has an unknown kind', { userLongInput: { ...longInput, kind: 'unknown' } }],
  ['long input preview is an object', { userLongInput: { ...longInput, preview: {} } }],
  ['long input structure contains an object', { userLongInput: { ...longInput, structure: ['ok', {}] } }],
  ['long input key facts are not strings', { userLongInput: { ...longInput, keyFacts: [{}] } }],
  ['long input required key facts are missing', { userLongInput: { ...longInput, keyFacts: undefined } }],
  ['longform is null', { assistantLongform: null }],
  ['longform has an unknown artifact type', { assistantLongform: { ...longform, artifactType: 'unknown' } }],
  ['longform title is an object', { assistantLongform: { ...longform, title: {} } }],
  ['longform length label is numeric', { assistantLongform: { ...longform, estimatedLength: 800 } }],
  ['longform highlights contain an object', { assistantLongform: { ...longform, highlights: ['ok', {}] } }],
  ['longform closing preview is an object', { assistantLongform: { ...longform, closingPreview: {} } }],
  ['longform key facts contain an object', { assistantLongform: { ...longform, keyFacts: [{}] } }],
]

describe('saved history presentation validation', () => {
  it('accepts every authored presentation in the ordinary, mainline and legacy libraries', () => {
    const nodes = [
      ...ordinaryConversationPool.flatMap(conversation => conversation.nodes),
      ...MAINLINE2_LIBRARY.flatMap(conversation => conversation.nodes),
      ...buildStoryContentForManifest(LEGACY_RUN_MANIFEST).nodes,
    ]
    for (const node of nodes) {
      const userFields = { userMessages: node.userMessages, userContent: node.userContent, userLongInput: node.userLongInput }
      expect(hasValidHistoryPresentation(userFields), node.id).toBe(true)
      for (const choice of [...node.choices, ...(node.variants?.flatMap(variant => variant.choices) ?? [])]) {
        expect(hasValidHistoryPresentation({ ...userFields, assistantContent: choice.content, assistantLongform: choice.longformPreview }), `${node.id}/${choice.id}`).toBe(true)
      }
    }
  })

  it('accepts omitted optional fields, empty arrays and original text without rewriting them', () => {
    const data = progressedCheckpoint('non-mainline')
    const presentation = {
      userMessages: [],
      userContent: [{ type: 'text', text: '  原文\n不裁剪 🙂  ' }],
      assistantContent: [],
      userLongInput: { ...longInput, structure: [], keyFacts: [] },
      assistantLongform: { ...longform, structure: [], highlights: [], keyFacts: [] },
    }
    expect(hasValidHistoryPresentation({})).toBe(true)
    expect(hasValidHistoryPresentation(presentation)).toBe(true)
    const before = JSON.stringify(presentation)
    for (const active of [data.run, data.session!]) Object.assign(active.history[0], presentation)
    expect(restoreRun(JSON.stringify(data.run))?.history).toEqual(data.run.history)
    expect(restoreNonMainlineSession(JSON.stringify(data.session))?.history).toEqual(data.session!.history)
    expect(JSON.stringify(presentation)).toBe(before)
    expect(readRecoveryRecord(JSON.stringify({ current: data }))?.session?.history).toEqual(data.session!.history)
  })

  for (const surface of ['mainline', 'non-mainline'] as const) {
    it(`blocks malformed ${surface} history at canonical load and import, preserving the original bytes`, () => {
      const valid = progressedCheckpoint(surface)
      for (const [description, corruptFields] of malformedPresentation) {
        const data = structuredClone(valid)
        const active = surface === 'mainline' ? data.run : data.session!
        Object.assign(active.history[0], corruptFields)
        const raw = JSON.stringify({ version: 1, revision: 'malformed-presentation', data })
        const values = new Map([[CHECKPOINT_KEY, raw]])
        const loaded = loadCheckpoint(readOnlyStorage(values))
        expect(loaded.problem, description).toBe('damaged')
        expect(loaded.original, description).toBe(raw)
        expect(values.get(CHECKPOINT_KEY), description).toBe(raw)
        expect(readRecoveryRecord(JSON.stringify({ current: data })), description).toBeNull()
        expect(readRecoveryRecord(JSON.stringify({ current: valid, pending: data })), description).toBeNull()
      }
    })
  }

  it('keeps legitimate legacy records without optional presentation metadata playable', () => {
    const data = progressedCheckpoint('non-mainline')
    const legacy = createRun('presentation-legacy')
    data.run = commitChoice(legacy, resolveScene(legacy).choices[0].id)
    const values = new Map([
      ['instance:run:v1', JSON.stringify(data.run)],
      [NON_MAINLINE_SESSION_KEY, JSON.stringify(data.session)],
      [ACTIVE_SURFACE_KEY, data.surface],
    ])
    const before = [...values]
    const loaded = loadCheckpoint(readOnlyStorage(values))
    expect(loaded.problem).toBeUndefined()
    expect(loaded.data?.run.history).toEqual(data.run.history)
    expect(loaded.data?.session?.history).toEqual(data.session!.history)
    expect(loaded.data?.surface).toBe('non-mainline')
    expect([...values]).toEqual(before)
  })

  it('retains a malformed legacy ordinary record for explicit recovery rather than deleting it', () => {
    const data = progressedCheckpoint('non-mainline')
    Object.assign(data.session!.history[0], { userMessages: ['ok', { unexpected: 'object' }] })
    const values = new Map([
      ['instance:run:v1', JSON.stringify(data.run)],
      [NON_MAINLINE_SESSION_KEY, JSON.stringify(data.session)],
      [ACTIVE_SURFACE_KEY, data.surface],
    ])
    const before = [...values]
    const loaded = loadCheckpoint(readOnlyStorage(values))
    expect(loaded.problem).toBe('damaged')
    expect(loaded.data?.run.history).toEqual(data.run.history)
    expect([...values]).toEqual(before)
  })
})
