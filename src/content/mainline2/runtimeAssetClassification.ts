import type { ConversationDefinition } from '../../game/types'
import registry from './runtimeAssetClassification.registry.json'
import { HANDOFF_AUTHORED_ASSET_INVENTORY } from './authoredLibrary.generated'

export type MainlineRuntimeAssetKind =
  | 'playable-conversation'
  | 'progression'
  | 'ending-copy'
  | 'key-history'
  | 'epilogue'
  | 'secret-ending-copy'
  | 'resolver-data'
  | 'system-presentation'
  | 'world-echo'

type RegistryEntry = {
  runtimeKind: MainlineRuntimeAssetKind
  fallback?: { nodeId?: string; userMessage: string; choiceText: string; choiceKind: 'progression' }
}

const explicitRegistry = registry as Record<string, RegistryEntry>

export function runtimeAssetKind(assetId: string): MainlineRuntimeAssetKind {
  return explicitRegistry[assetId]?.runtimeKind ?? 'playable-conversation'
}

export function isPlayableRuntimeAsset(assetId: string) {
  const kind = runtimeAssetKind(assetId)
  return kind === 'playable-conversation' || kind === 'progression'
}

export function fallbackNodeForAsset(assetId: string, conversationId: string): ConversationDefinition['nodes'][number] | undefined {
  const fallback = explicitRegistry[assetId]?.fallback
  if (!fallback) return undefined
  return {
    id: fallback.nodeId ?? `${assetId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-progression`,
    conversationId,
    conversationTitle: assetId,
    userMessage: fallback.userMessage,
    choices: [{
      id: `${assetId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-progression-action`,
      text: fallback.choiceText,
      continuation: 'end-conversation',
    }],
    choiceKind: fallback.choiceKind,
  }
}

export const MAINLINE2_ASSET_CLASSIFICATION = Object.fromEntries(
  HANDOFF_AUTHORED_ASSET_INVENTORY.map((asset) => [asset.assetId, runtimeAssetKind(asset.assetId)]),
) as Record<string, MainlineRuntimeAssetKind>

export const MAINLINE2_SUPPORT_ASSET_IDS = Object.entries(MAINLINE2_ASSET_CLASSIFICATION)
  .filter(([, kind]) => !['playable-conversation', 'progression'].includes(kind))
  .map(([assetId]) => assetId)
