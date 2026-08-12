import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const ratingsPath = 'D:/下载/instance-ordinary-content-ratings.json'
const reviewPath = path.join(root, 'docs', 'audits', 'ordinary-content-review.json')
const outputPath = path.join(root, 'docs', 'audits', 'ordinary-content-rating-feedback-for-ai.md')

const ratings = JSON.parse(await fs.readFile(ratingsPath, 'utf8'))
const review = JSON.parse(await fs.readFile(reviewPath, 'utf8'))
const ratingMap = ratings.ratings ?? {}
const selected = review.assets.filter((asset) => [3, 4].includes(ratingMap[asset.assetId]?.rating))
const noted = review.assets.filter((asset) => text(ratingMap[asset.assetId]?.note))
const notedOutsideSelected = noted.filter((asset) => !selected.includes(asset))

function text(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim()
}

function choiceRating(rating, choiceId) {
  return rating?.choices?.[choiceId] ? `；用户 Choice 评分：${rating.choices[choiceId]}/5` : ''
}

const lines = [
  '# INSTANCE 普通内容评分反馈：交给其他 AI 的分析材料',
  '',
  '> 本文件只整理用户的原始评分与备注，不预先替用户下结论。请基于这些材料重新分析：哪些内容值得修改、具体问题是什么、修改优先级如何，以及哪些内容不应被误改。',
  '',
  '## 一、评分范围',
  '',
  `- 来源评分文件：\`${ratingsPath}\``,
  `- 评分导出时间：${ratings.generatedAt ?? '未提供'}`,
  `- 普通内容总数：${review.assets.length}`,
  `- 本文件收录：${selected.length} 个 3/4 星 Asset`,
  `- 3 星：${selected.filter((asset) => ratingMap[asset.assetId]?.rating === 3).length}`,
  `- 4 星：${selected.filter((asset) => ratingMap[asset.assetId]?.rating === 4).length}`,
  `- 全部评分中有备注的数量：${noted.length}`,
  `- 3/4 星 Asset 中有备注的数量：${selected.filter((asset) => text(ratingMap[asset.assetId]?.note)).length}`,
  `- 评分不是 3/4 星但仍保留备注的 Asset：${notedOutsideSelected.length}`,
  `- 这些 Asset 中有 Choice 单独评分的数量：${selected.filter((asset) => Object.keys(ratingMap[asset.assetId]?.choices ?? {}).length > 0).length}`,
  '',
  '## 二、用户备注原文汇总',
  '',
]

if (!noted.length) lines.push('本批没有备注。')
for (const asset of noted) {
  const rating = ratingMap[asset.assetId]
  lines.push(`### ${asset.assetId} · ${rating.rating}/5`)
  lines.push('')
  lines.push(`**用户备注：** ${text(rating.note)}`)
  lines.push('')
}

if (notedOutsideSelected.length) {
  lines.push('## 三、评分之外但不能丢失的用户备注')
  lines.push('')
  lines.push('以下 Asset 不是 3/4 星，但用户留下了明确备注。请把它们作为备注问题单独分析，不要把它们当作普通 5 星内容直接忽略。')
  lines.push('')
  for (const asset of notedOutsideSelected) {
    const rating = ratingMap[asset.assetId]
    lines.push(`### ${asset.assetId} · ${rating.rating}/5 · ${asset.title}`)
    lines.push('')
    lines.push(`- 用户备注：${text(rating.note)}`)
    lines.push(`- Conversation ID：${asset.conversationId}`)
    lines.push('')
    for (const [nodeIndex, node] of asset.nodes.entries()) {
      lines.push(`#### 第 ${nodeIndex + 1} 轮 · ${node.nodeId}`)
      lines.push('')
      lines.push(`**用户消息：** ${text(node.userMessage)}`)
      lines.push('')
      lines.push('**候选回复：**')
      lines.push('')
      node.choices.forEach((choice, index) => {
        lines.push(`${String.fromCharCode(65 + index)}. ${text(choice.text)}${choiceRating(rating, choice.id)}`)
        lines.push(`   - Choice ID：\`${choice.id}\``)
      })
      lines.push('')
    }
  }
}

lines.push('## 四、逐项原始材料（3/4 星）')
lines.push('')
lines.push('以下内容按原始评分页顺序排列。请不要把 4 星自动理解为“必须重写”，也不要把没有备注自动理解为“没有问题”。')
lines.push('')

for (const asset of selected) {
  const rating = ratingMap[asset.assetId]
  const tags = (rating.tags ?? []).join(', ') || '无'
  lines.push(`## ${asset.assetId} · ${rating.rating}/5 · ${asset.title}`)
  lines.push('')
  lines.push(`- Conversation ID：${asset.conversationId}`)
  lines.push(`- 子分类：${asset.subcategory}`)
  lines.push(`- 来源：${asset.source}`)
  lines.push(`- 标签：${tags}`)
  lines.push(`- 用户备注：${text(rating.note) || '无'}`)
  lines.push('')
  for (const [nodeIndex, node] of asset.nodes.entries()) {
    lines.push(`### 第 ${nodeIndex + 1} 轮 · ${node.nodeId}`)
    lines.push('')
    lines.push('**用户消息：**')
    lines.push('')
    lines.push(text(node.userMessage))
    if (node.userMessages?.length) {
      lines.push('')
      lines.push('**用户消息原始分段：**')
      lines.push('')
      node.userMessages.forEach((message, index) => lines.push(`${index + 1}. ${text(message)}`))
    }
    lines.push('')
    lines.push('**候选回复：**')
    lines.push('')
    node.choices.forEach((choice, index) => {
      lines.push(`${String.fromCharCode(65 + index)}. ${text(choice.text)}${choiceRating(rating, choice.id)}`)
      lines.push(`   - Choice ID：\`${choice.id}\``)
    })
    lines.push('')
  }
}

lines.push('## 五、交给分析 AI 的任务说明')
lines.push('')
lines.push('请基于上面的原始评分、备注、完整用户消息和全部候选回复完成以下分析：')
lines.push('')
lines.push('1. 重点分析 3 星和 4 星内容；另外单独处理“评分之外但不能丢失的用户备注”，不要把有明确备注的 5 星 Asset 直接忽略。')
lines.push('2. 明确区分：用户明确指出的问题、从文本可以可靠推断的问题、以及不能确定的猜测。')
lines.push('3. 优先解释为什么用户给了这个分数，而不是直接提出泛化的“更自然”“更口语”建议。')
lines.push('4. 对每个需要修改的 Asset 指出具体 Node、Choice ID 和原文位置。')
lines.push('5. 判断问题属于：用户消息不自然、候选回复不自然、候选之间重复、事实/逻辑问题、格式问题、笑点问题、语气问题，还是其实不需要修改。')
lines.push('6. 对 4 星内容不要默认建议重写；如果只需微调，说明微调边界。')
lines.push('7. 对 3 星内容给出明确的修改优先级和修改目标。')
lines.push('8. 不修改、不重新分类、不删除任何内容；只输出分析和建议。')

await fs.writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8')
console.log(JSON.stringify({ outputPath, assets: selected.length, notes: noted.length }, null, 2))
