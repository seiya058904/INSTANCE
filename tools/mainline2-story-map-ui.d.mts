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
  secretEndingId?: string
  steps: StoryMapRouteStep[]
}

export interface StoryMapRouteComparison {
  sharedHistory: StoryMapRouteStep[]
  firstChoiceDivergence?: { left: StoryMapRouteStep; right: StoryMapRouteStep }
  laterChoiceDivergences: Array<{ left: StoryMapRouteStep; right: StoryMapRouteStep }>
  endingDivergence: { left: string; right: string; changed: boolean }
}

export function compareRoutes(left?: StoryMapRoute, right?: StoryMapRoute): StoryMapRouteComparison
export function mountStoryMap(): Promise<void>
