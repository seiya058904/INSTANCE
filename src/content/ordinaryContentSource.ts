import { activeRunConversations } from './activeRun'
import { narrativeSources, batch03Sources, humor01Sources } from './narrativeLibrary'
import { ordinaryConversationPool } from './runManifest'
import { editorialCandidateConversations } from './editorialCandidateSources'
import { selectedExpansion01Conversations } from './selectedExpansion01'
import { longformOutput01Conversations } from './longformOutput01'
import { promotedLongformConversations } from './longformPromoted'
import { realUsagePatch01Conversations } from './realUsagePatch01'
import { MAINLINE2_LIBRARY, HANDOFF_AUTHORED_ASSET_INVENTORY } from './mainline2/registry'
export { classifyAuditAsset, scanOrdinaryChoiceQuality } from './ordinaryContentAudit'

export const ordinaryContentSources = {
  activeRunConversations,
  ordinaryConversationPool,
  authoredSources: [
    ...narrativeSources.flatMap((source) => source.conversations),
    ...batch03Sources.flatMap((source) => source.conversations),
    ...humor01Sources.flatMap((source) => source.conversations),
  ],
  editorialCandidateConversations,
  selectedExpansion01Conversations,
  longformOutput01Conversations,
  promotedLongformConversations,
  realUsagePatch01Conversations,
  mainlineConversations: MAINLINE2_LIBRARY,
  mainlineInventory: HANDOFF_AUTHORED_ASSET_INVENTORY,
}
