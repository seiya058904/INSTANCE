import { describe, expect, it } from 'vitest'
import { EDITION4_PUBLIC_ROUTES } from './mainline2Edition4RouteCatalog'
import { runMainline2Route } from './mainline2.closeoutFixtures'
import { commitChoice, resolveScene } from './engine'
import { getFutureProposalById } from '../content/mainline2/proposals'
import { proposalContract } from '../content/mainline2/proposalPresentation'

const cases = [
  ['limited', ['两边分别确认了保压这一项', '长期条款没有签', '本地储备逐周减少']],
  ['wait', ['实验舱关闭', '三个月后到达', '丢了一季实验']],
] as const

describe('chat-first attributed mediation receipts retain their contract evidence', () => {
  it.each(cases)('%s keeps actual execution facts on the quoted first line', (response, facts) => {
    const base = EDITION4_PUBLIC_ROUTES.find(route => route.endingId === 'the_mediator')!
    const fixture = runMainline2Route({
      ...base,
      routeId: 'chat-first-mediation-receipt',
      choicesByNodeId: { ...base.choicesByNodeId, 'v4-contact-mediation': `v4-contact-mediation-${response}` },
    })
    const action = fixture.links.find(link => link.nodeId === 'v4-contact-mediation')!
    const receipt = fixture.links.find(link => link.nodeId === 'v4-contact-mediation-receipt')!
    expect(action.choiceId).toBe(`v4-contact-mediation-${response}`)
    expect(receipt.runBefore.history.at(-1)?.choiceId).toBe(action.choiceId)
    const firstLine = receipt.resolvedScene.userMessage.split('\n')[0]
    expect(firstLine).toContain('双方把确认记录回给我了：')
    for (const fact of facts) expect(firstLine).toContain(fact)

    const commitment = fixture.links.find(link => link.proposalKind === 'commitment')!
    const contract = proposalContract(commitment.runBefore, getFutureProposalById(commitment.proposalId!)!)
    const evidence = contract.limitations.find(line => line.startsWith('本局协议执行：'))!
    expect(evidence).toBe(`本局协议执行：${firstLine}`)
    for (const fact of facts) expect(evidence).toContain(fact)

    // A legal checkpoint without the new-run causal marker retains interim
    // display interpretation. Already saved messages are not rewritten.
    const interim = { ...action.runBefore, mainlineCausalityVersion: undefined }
    const originalHistory = structuredClone(interim.history)
    const interimNext = commitChoice(interim, action.choiceId)
    expect(interimNext.history.slice(0, -1)).toEqual(originalHistory)
    const interimReceipt = resolveScene(interimNext).userMessage
    expect(interimReceipt).not.toContain('双方把确认记录回给我了：')
    for (const fact of facts) expect(interimReceipt.split('\n')[0]).toContain(fact)
  })
})
