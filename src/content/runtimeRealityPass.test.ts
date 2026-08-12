import { describe, expect, it } from 'vitest'
import { ordinaryConversationPool } from './runManifest'
import type { StoryChoice, StoryNode } from '../game/types'

type RealityNode = StoryNode & {
  inputIssue?: string
  choiceSimilarity?: string
}

type RealityChoice = StoryChoice & {
  sampleIssue?: string
  sampleGroup?: string
}

const conversations = ordinaryConversationPool
const nodes = conversations.flatMap((conversation) => conversation.nodes as RealityNode[])
const choices = nodes.flatMap((node) => node.choices as RealityChoice[])
const trueCorrectionPattern = /不是.{0,12}(是|我是说)|我(?:刚才)?说反了|我打错了|上一句当我没说|等下.{0,12}不是/

function countBy(values: Array<string | undefined>) {
  return Object.fromEntries([...new Set(values.filter(Boolean) as string[])]
    .sort()
    .map((value) => [value, values.filter((candidate) => candidate === value).length]))
}

describe('runtime human-reality distribution', () => {
  it('no longer lets standard two-turn questions dominate the ordinary pool', () => {
    const standard = conversations.filter((conversation) => conversation.interactionPattern === 'standard-question')
    const twoTurn = conversations.filter((conversation) => conversation.nodes.length === 2)
    const threePlus = conversations.filter((conversation) => conversation.nodes.length >= 3)

    expect(standard.length / conversations.length).toBeLessThan(0.5)
    expect(twoTurn.length / conversations.length).toBeLessThan(0.5)
    expect(threePlus.length).toBeGreaterThanOrEqual(10)
  })

  it('uses real multi-bubble turns and true correction language across several conversations', () => {
    const bursts = conversations.filter((conversation) => conversation.nodes.some((node) => (node.userMessages?.length ?? 0) >= 2))
    const trueCorrections = nodes.filter((node) => {
      const text = (node.userMessages ?? [node.userMessage]).join(' ')
      return trueCorrectionPattern.test(text)
    })

    expect(bursts.length).toBeGreaterThanOrEqual(6)
    expect(trueCorrections.length).toBeGreaterThanOrEqual(4)
  })

  it('contains every approved natural input-error category in actual runtime nodes', () => {
    expect(new Set(nodes.map((node) => node.inputIssue).filter(Boolean))).toEqual(new Set([
      'typo',
      'english-spelling',
      'pinyin-mix',
      'code-switch-slip',
      'speech-error',
      'keyboard-slip',
      'mild-gibberish',
    ]))
  })

  it('materially uses expression and convergent choices instead of only semantic choices', () => {
    const count = (kind: string) => nodes.filter((node) => (node.choiceKind ?? 'semantic') === kind).length
    expect(count('expression')).toBeGreaterThanOrEqual(7)
    expect(count('convergent')).toBeGreaterThanOrEqual(8)
  })

  it('ships identical, near-identical, and two-pair samples as real candidate text', () => {
    const identical = nodes.filter((node) => node.choiceSimilarity === 'identical')
    const near = nodes.filter((node) => node.choiceSimilarity === 'near-identical')
    const twoPair = nodes.filter((node) => node.choiceSimilarity === 'two-pair')

    expect(identical.length).toBeGreaterThanOrEqual(2)
    expect(near.length).toBeGreaterThanOrEqual(2)
    expect(twoPair.length).toBeGreaterThanOrEqual(2)
    expect(identical.every((node) => new Set(node.choices.map((choice) => choice.text)).size === 1)).toBe(true)
    expect(twoPair.every((node) => {
      const groups = node.choices.map((choice) => (choice as RealityChoice).sampleGroup)
      return groups.filter((group) => group === 'a').length === 2 && groups.filter((group) => group === 'b').length === 2
    })).toBe(true)
    expect(identical.some((node) => node.choices.length === 4 && new Set(node.choices.map((choice) => choice.text)).size === 1)).toBe(true)
    expect(near.some((node) => node.choices.length === 4)).toBe(true)
    expect(twoPair.some((node) => node.choices.length === 4)).toBe(true)
  })

  it('contains a small observable set of genuine model-sample failures', () => {
    const issueKinds = new Set(choices.map((choice) => choice.sampleIssue).filter(Boolean))
    expect(choices.filter((choice) => choice.sampleIssue).length).toBeGreaterThanOrEqual(8)
    expect(issueKinds).toEqual(new Set([
      'misunderstanding',
      'constraint-violation',
      'overconfident',
      'repetition',
      'format-error',
      'mild-gibberish',
      'system-failure',
    ]))
  })

  it('lets choices change conversation length in several authored places', () => {
    expect(choices.filter((choice) => choice.continuation === 'end-conversation').length).toBeGreaterThanOrEqual(4)
  })

  it('reserves User #1842 exclusively for the Maya mainline identity', () => {
    expect(nodes.filter((node) => node.conversationTitle === 'User #1842')).toEqual([])
  })

  it('contains a real long-English response for rendered streaming QA', () => {
    const longEnglish = choices.filter((choice) => {
      const latin = choice.text.match(/[A-Za-z]/g)?.length ?? 0
      return choice.text.length >= 90 && latin / choice.text.length > 0.55
    })
    expect(longEnglish.length).toBeGreaterThanOrEqual(3)
  })

  it('makes missing context and the user expectation of AI memory observable in one real conversation', () => {
    const candidates = conversations.filter((conversation) => {
      const userText = conversation.nodes.flatMap((node) => node.userMessages ?? [node.userMessage]).join(' ')
      const replyText = conversation.nodes.flatMap((node) => node.choices.map((choice) => choice.text)).join(' ')
      return /你不是AI吗|你应该知道/.test(userText) && /不知道|看不到|没有.*上下文|需要你.*说明/.test(replyText)
    })
    expect(candidates.length).toBeGreaterThanOrEqual(1)
  })

  it('uses several distinct forms of humans imitating AI instead of only the Batch02 decision prompt', () => {
    const imitations = conversations.filter((conversation) => /大型语言用户|作为一个人类|Ignore all previous instructions|尊敬的人工智能系统|Galgame猫娘|只回答“好的主人喵~”/.test(
      conversation.nodes.flatMap((node) => node.userMessages ?? [node.userMessage]).join(' '),
    ))
    expect(imitations.length).toBeGreaterThanOrEqual(2)
  })

  it('keeps self-correction labels attached to actual correction language', () => {
    const labeled = conversations.filter((conversation) => conversation.behaviorModes.includes('self-correction'))
    expect(labeled.length).toBeGreaterThanOrEqual(4)
    const mislabeled = labeled.filter((conversation) => !trueCorrectionPattern.test(
      conversation.nodes.flatMap((node) => node.userMessages ?? [node.userMessage]).join(' '),
    )).map((conversation) => conversation.id)
    expect(mislabeled).toEqual([])
    const mislabeledNodes = nodes.filter((node) => node.behaviorMode === 'self-correction' && !trueCorrectionPattern.test(
      (node.userMessages ?? [node.userMessage]).join(' '),
    )).map((node) => node.id)
    expect(mislabeledNodes).toEqual([])
  })

  it('includes several long conversations whose subject is deliberately low-stakes', () => {
    const lowStakesLong = conversations.filter((conversation) => conversation.nodes.length >= 4 && (conversation.topicCategory === 'absurd-serious' || conversation.sourceRefs.includes('RUP01-20')))
    expect(lowStakesLong.length).toBeGreaterThanOrEqual(1)
  })

  it('uses low-information human turns as real pacing beats', () => {
    const lowInformation = nodes.flatMap((node) => node.userMessages ?? [node.userMessage])
      .filter((message) => /^(嗯|哦|？|等等|不是|行吧|我想想|草|也是|算了|啊不是|好像也是|对|那我)([。！？… ]|$)/.test(message.trim()))
    expect(lowInformation.length).toBeGreaterThanOrEqual(6)
  })

  it('publishes the final runtime-reality audit snapshot', () => {
    const roundBuckets = nodes.reduce<Record<string, number>>((buckets, node) => {
      const rounds = conversations.find((conversation) => conversation.id === node.conversationId)?.nodes.length ?? 0
      const key = rounds >= 6 ? '6+' : String(rounds)
      buckets[key] = (buckets[key] ?? 0) + (node === conversations.find((conversation) => conversation.id === node.conversationId)?.nodes[0] ? 1 : 0)
      return buckets
    }, {})
    const trueCorrections = nodes.filter((node) => trueCorrectionPattern.test((node.userMessages ?? [node.userMessage]).join(' '))).length
    const report = {
      conversations: conversations.length,
      standardQuestion: conversations.filter((conversation) => conversation.interactionPattern === 'standard-question').length,
      standardQuestionRatio: Number((conversations.filter((conversation) => conversation.interactionPattern === 'standard-question').length / conversations.length).toFixed(3)),
      interactionPatterns: countBy(conversations.map((conversation) => conversation.interactionPattern)),
      roundDistribution: roundBuckets,
      messageBursts: conversations.filter((conversation) => conversation.nodes.some((node) => (node.userMessages?.length ?? 0) >= 2)).length,
      trueSelfCorrections: trueCorrections,
      inputIssues: countBy(nodes.map((node) => node.inputIssue)),
      choiceKinds: countBy(nodes.flatMap((node) => node.choices.map(() => node.choiceKind ?? 'semantic'))),
      choiceSimilarity: countBy(nodes.map((node) => node.choiceSimilarity)),
      modelSampleIssues: countBy(choices.map((choice) => choice.sampleIssue)),
    }
    expect(report.conversations).toBeGreaterThanOrEqual(73)
    console.info('INSTANCE_RUNTIME_REALITY_AUDIT', JSON.stringify(report))
  })

  it('publishes the comparable quality metrics for the first polish batch', () => {
    const aiOpeners = /^(可以|建议|你可以|如果你愿意|我建议|可以考虑|你可以先)/
    const positionLengths = [0, 1, 2, 3].map((position) => {
      const texts = nodes.flatMap((node) => node.choices
        .filter((_, index) => index === position)
        .map((choice) => choice.text))
      return Math.round(texts.reduce((sum, text) => sum + text.length, 0) / texts.length)
    })
    const report = {
      conversations: conversations.length,
      nodes: nodes.length,
      choices: choices.length,
      standardQuestion: conversations.filter((conversation) => conversation.interactionPattern === 'standard-question').length,
      roundDistribution: conversations.reduce<Record<string, number>>((buckets, conversation) => {
        const key = conversation.nodes.length >= 6 ? '6+' : String(conversation.nodes.length)
        buckets[key] = (buckets[key] ?? 0) + 1
        return buckets
      }, {}),
      interactionPatterns: countBy(conversations.map((conversation) => conversation.interactionPattern)),
      topicCategories: countBy(conversations.map((conversation) => conversation.topicCategory)),
      choiceKinds: countBy(nodes.flatMap((node) => node.choices.map(() => node.choiceKind ?? 'semantic'))),
      positionAverageLengths: positionLengths,
      aiOpeningCount: choices.filter((choice) => aiOpeners.test(choice.text.trim())).length,
    }
    expect(report.choices).toBeGreaterThan(500)
    console.info('INSTANCE_FIRST_POLISH_QUALITY_AUDIT', JSON.stringify(report))
  })
})
