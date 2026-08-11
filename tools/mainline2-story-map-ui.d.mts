export interface StoryMapRouteStep {
  nodeKey: string
  slot: number
  act: number
  sourceRef: string
  conversationId: string
  nodeId: string
  choiceId: string
  choiceTextZh: string
}

export interface StoryMapRoute {
  routeId: string
  endingId: string
  resolvedEnding: string
  secretEndingId?: string
  resolvedOverlay?: { endingId: string; overlayMode: 'title-override' | 'epilogue-override' | 'postscript' }
  steps: StoryMapRouteStep[]
}

export interface StoryMapResolvedEnding {
  worldEndingId?: string
  secretEndingId?: string
  overlayMode?: 'title-override' | 'epilogue-override' | 'postscript'
}

export interface StoryMapRouteComparison {
  sharedHistory: StoryMapRouteStep[]
  firstChoiceDivergence?: { left?: StoryMapRouteStep; right?: StoryMapRouteStep }
  laterChoiceDivergences: Array<{ left?: StoryMapRouteStep; right?: StoryMapRouteStep }>
  endingDivergence: { left: StoryMapResolvedEnding; right: StoryMapResolvedEnding; changed: boolean }
}

export function compareRoutes(left?: StoryMapRoute, right?: StoryMapRoute): StoryMapRouteComparison
export function formatNext(next?: { kind: 'node'; slot: number; conversationId: string; nodeId: string } | { kind: 'ending-resolution' }): string
export function mountStoryMap(): Promise<void>
