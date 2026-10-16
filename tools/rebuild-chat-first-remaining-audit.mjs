/** Rejoin frozen explicit editorial annotations to runtime evidence; no inference.
 * node tools/rebuild-chat-first-remaining-audit.mjs --baseline DIR --annotations FILE --output FILE
 */
import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
const option = name => { const i=process.argv.indexOf(name); if(i<0 || !process.argv[i+1])throw new Error(`Required ${name}`);return process.argv[i+1] }
const baseline=option('--baseline'), annotationPath=option('--annotations'), output=option('--output')
const hash=x=>createHash('sha256').update(x).digest('hex')
const annotationBytes=await readFile(annotationPath), annotationHash=hash(annotationBytes)
const annotations=JSON.parse(annotationBytes.toString('utf8').replace(/^\uFEFF/,''))
// Accept the original partition file's historical method label as well. These
// records were written by model/agent review, not a real human playthrough.
if(!['human-reviewed-frozen-annotations','explicit-model-editorial-review'].includes(annotations.method))throw new Error('Explicit editorial annotation provenance required')
const lines=async name=>(await readFile(path.join(baseline,`before-${name}.jsonl`),'utf8')).trim().split('\n').map(JSON.parse)
const scenes=await lines('scenes'), forks=new Map((await lines('branches')).map(x=>[x.branchId,x])), rows=[],seen=new Set()
for(const scene of scenes)for(const [i,choice]of scene.choices.entries()){
  const id=`${scene.variantId}:${choice.id}`, coverage=annotations.coverage[id]
  if(!coverage)continue
  if(hash(choice.text)!==coverage.textSha256)throw new Error(`Unreviewed candidate text ${id}`)
  const incoming=JSON.stringify({userMessage:scene.userMessage,userMessages:scene.userMessages,userContent:scene.userContent,userLongInput:scene.userLongInput})
  if(hash(incoming)!==coverage.incomingSha256)throw new Error(`Unreviewed incoming text ${id}`)
  const editorial=annotations.annotations[coverage.annotation]
  if(!editorial)throw new Error(`Missing editorial annotation ${id}`)
  const fork=forks.get(scene.branchEvidence[choice.id])
  if(!fork || fork.savedChoice?.choiceId!==choice.id || fork.savedChoice?.assistantText!==choice.text)throw new Error(`Invalid legal-fork record ${id}`)
  rows.push({reviewId:id,variantId:scene.variantId,nodeId:scene.nodeId,choiceId:choice.id,choiceIndex:i+1,actualChoiceCount:scene.choices.length,choiceText:choice.text,sourceRefs:scene.sourceRefs,visibleSender:scene.uiIdentity,incomingText:scene.userMessage,incomingMessages:scene.userMessages,knowledgeEvidenceIds:[`CURRENT:${scene.variantId}`,...scene.savedVisibleHistoryRefs],provenanceContexts:scene.contexts,branchMeaning:{decisionBinding:choice.decisionBinding,mutations:choice.mutations??[],continuation:choice.continuation},nextTurnImpact:{branchId:fork.branchId,savedChoice:fork.savedChoice,directNext:fork.directNext,later:fork.later,terminalPhase:fork.terminalPhase,continuation:fork.continuation},catalogSelectedCount:scene.selectedCounts[choice.id]??0,annotationId:coverage.annotation,annotationSha256:annotationHash,...editorial})
  seen.add(id)
}
for(const id of Object.keys(annotations.coverage))if(!seen.has(id))throw new Error(`Frozen annotation absent from baseline ${id}`)
await writeFile(output,rows.map(x=>JSON.stringify(x)).join('\n')+'\n',{encoding:'utf8',flag:'wx'})
console.log(JSON.stringify({rows:rows.length,annotationSha256:annotationHash,output}))
