import type { ContentPartType, LongformArtifactType, LongInputKind } from './types'

const contentTypes = new Set<ContentPartType>(['text', 'image-description', 'generated-image'])
const artifactTypes = new Set<LongformArtifactType>(['essay', 'report', 'solution', 'story', 'code', 'speech', 'translation', 'memo'])
const inputKinds = new Set<LongInputKind>(['pasted-text', 'transcript', 'article', 'email', 'spec', 'dataset-summary'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string')
}

function optionalString(value: unknown) {
  return value === undefined || typeof value === 'string'
}

function optionalStringArray(value: unknown) {
  return value === undefined || isStringArray(value)
}

function hasValidContentParts(value: unknown) {
  return value === undefined || Array.isArray(value) && value.every(part => (
    isRecord(part)
    && contentTypes.has(part.type as ContentPartType)
    && typeof part.text === 'string'
    && optionalString(part.alt)
  ))
}

function hasValidPreviewText(value: Record<string, unknown>) {
  return typeof value.estimatedLength === 'string'
    && typeof value.preview === 'string'
    && optionalString(value.title)
    && optionalStringArray(value.structure)
}

function hasValidLongInput(value: unknown) {
  return value === undefined || isRecord(value)
    && inputKinds.has(value.kind as LongInputKind)
    && hasValidPreviewText(value)
    && isStringArray(value.keyFacts)
}

function hasValidLongform(value: unknown) {
  return value === undefined || isRecord(value)
    && artifactTypes.has(value.artifactType as LongformArtifactType)
    && hasValidPreviewText(value)
    && optionalStringArray(value.highlights)
    && optionalString(value.closingPreview)
    && optionalStringArray(value.keyFacts)
}

// These optional fields are consumed directly by the conversation renderer and
// continuity resolvers. Reject malformed saved values before either sees them;
// do not replace authored text, discard history, or require newer metadata.
export function hasValidHistoryPresentation(value: Record<string, unknown>): boolean {
  return optionalStringArray(value.userMessages)
    && hasValidContentParts(value.userContent)
    && hasValidContentParts(value.assistantContent)
    && hasValidLongInput(value.userLongInput)
    && hasValidLongform(value.assistantLongform)
}
