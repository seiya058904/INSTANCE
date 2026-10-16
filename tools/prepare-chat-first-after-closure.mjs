/** Map current candidates to explicit model/agent reviews and emit delta packets.
 * No changed payload is automatically passed. Exact payloads are inherited only
 * with a legal node/choice-history witness and unchanged cited history records.
 * --manual files contain {reviews:{"afterVariantId:choiceId":{manual fields...}}}.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

const arg=(name,required=true)=>{const i=process.argv.indexOf(name);if(i<0){if(required)throw new Error(`Required ${name}`);return undefined}return process.argv[i+1]}
const baseline=arg('--baseline'),afterDir=arg('--after'),comparisonDir=arg('--comparison'),output=arg('--output')
const reviewPaths=arg('--reviews').split(',')
const readLines=async file=>(await readFile(file,'utf8')).trim().split(/\r?\n/).filter(Boolean).map(JSON.parse)
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().filter(k=>x[k]!==undefined).map(k=>[k,canonical(x[k])])):x
const snapshot=s=>({nodeId:s.nodeId,conversationId:s.conversationId,conversationTitle:s.conversationTitle,uiIdentity:s.uiIdentity,userMessage:s.userMessage,userMessages:s.userMessages,userContent:s.userContent,userLongInput:s.userLongInput,choiceKind:s.choiceKind,choices:s.choices})
const payload=s=>sha(canonical(snapshot(s)))
const fields=['questionIntent','responseIntent','epistemicVerdict','replyFit','claimVsCapability','futureLeak','editorialVerdict','recommendedCopy']
const [beforeScenes,afterScenes,beforeHistory,afterHistory,afterBranches,comparisons,summary,sourceReviews]=await Promise.all([
 readLines(path.join(baseline,'before-scenes.jsonl')),readLines(path.join(afterDir,'after-scenes.jsonl')),
 readLines(path.join(baseline,'before-histories.jsonl')),readLines(path.join(afterDir,'after-histories.jsonl')),
 readLines(path.join(afterDir,'after-branches.jsonl')),readLines(path.join(comparisonDir,'scene-comparisons.jsonl')),
 readFile(path.join(comparisonDir,'summary.json'),'utf8').then(JSON.parse),Promise.all(reviewPaths.map(readLines)),
])
if(summary.status!=='PASS')throw new Error('Exact legal comparison did not pass')
const oldHistory=new Map(beforeHistory.map(h=>[h.historyId,h])),newHistory=new Map(afterHistory.map(h=>[h.historyId,h]))
const oldScene=new Map(beforeScenes.map(s=>[s.variantId,s])),forks=new Map(afterBranches.map(b=>[b.branchId,b]))
const partitionFor=file=>file.includes('review-parent-')?'parent':file.includes('review-act4-candidates')?'act4':file.includes('review-act5-')?'act5':'remaining'
const oldReviews=new Map(),partitions=new Map()
sourceReviews.forEach((rows,index)=>rows.forEach(row=>{const id=`${row.variantId}:${row.choiceId}`;if(oldReviews.has(id))throw new Error(`Duplicate old review ${id}`);oldReviews.set(id,row);partitions.set(id,partitionFor(reviewPaths[index]))}))
const paths=(scene,histories)=>{
 const references=[scene.savedVisibleHistoryRefs,...(scene.contexts??[]).map(c=>c.savedVisibleHistoryRefs)].filter(Boolean)
 return [...new Map(references.map(refs=>{const sequence=refs.map(ref=>{const h=histories.get(ref);if(!h)throw new Error(`Missing history ${ref}`);return[h.nodeId,h.choiceId]});return[sha(sequence),sequence]})).entries()]
}
const witnessIndex=new Map(),semanticIndex=new Map()
for(const scene of beforeScenes)for(const[key]of paths(scene,oldHistory)){
 const id=`${scene.nodeId}:${key}`;if(!witnessIndex.has(id))witnessIndex.set(id,new Set());witnessIndex.get(id).add(scene.variantId)
}
for(const comparison of comparisons){
 const key=payload(comparison.afterScene)
 if(!semanticIndex.has(key))semanticIndex.set(key,[])
 semanticIndex.get(key).push(comparison)
}
const manual=new Map(),manualSources=[]
for(const file of (arg('--manual',false)?.split(',')??[])){
 const bytes=await readFile(file,'utf8'),data=JSON.parse(bytes)
 manualSources.push({file,sha256:createHash('sha256').update(bytes).digest('hex')})
 for(const[id,value]of Object.entries(data.reviews??{})){if(manual.has(id))throw new Error(`Duplicate after annotation ${id}`);manual.set(id,value)}
}
const references=value=>{
 const ids=new Set()
 function walk(v){if(typeof v==='string')for(const m of v.matchAll(/h-[0-9a-f]{20}/g))ids.add(m[0]);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk)}
 walk(value);return[...ids]
}
const remapCurrent=(value,from,to)=>typeof value==='string'?value.replaceAll(`CURRENT:${from}`,`CURRENT:${to}`):Array.isArray(value)?value.map(v=>remapCurrent(v,from,to)):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,remapCurrent(v,from,to)])):value
const rows=[],packets={parent:[],act4:[],act5:[],remaining:[]},unmapped=[],usedManual=new Set()
for(const scene of afterScenes){
 const legalPaths=paths(scene,newHistory),keys=new Set(legalPaths.map(([key])=>key)),afterRefs=new Set([...(scene.savedVisibleHistoryRefs??[]),...(scene.contexts??[]).flatMap(c=>c.savedVisibleHistoryRefs??[])])
 const exact=(semanticIndex.get(payload(scene))??[]).filter(c=>keys.has(sha(c.historyPath)))
 const beforeIds=new Set(exact.map(c=>c.beforeVariantId))
 for(const[key]of legalPaths)for(const id of witnessIndex.get(`${scene.nodeId}:${key}`)??[])beforeIds.add(id)
 const sourceScenes=[...beforeIds].map(id=>oldScene.get(id))
 const sceneRows=[],pendingReasons=new Set()
 for(const[i,choice]of scene.choices.entries()){
  const id=`${scene.variantId}:${choice.id}`
  const manualValue=manual.get(id)
  const originals=[...beforeIds].map(vid=>oldReviews.get(`${vid}:${choice.id}`)).filter(Boolean)
  for(const reference of manualValue?.originalReviewIds??[]){
   const original=oldReviews.get(reference)
   if(!original||original.nodeId!==scene.nodeId||original.choiceId!==choice.id)throw new Error(`Invalid explicit old-review basis ${id}: ${reference}`)
   if(!originals.some(r=>`${r.variantId}:${r.choiceId}`===reference))originals.push(original)
  }
  const partitionsHere=[...new Set(originals.map(r=>partitions.get(`${r.variantId}:${r.choiceId}`)))]
  const partition=partitionsHere.length===1?partitionsHere[0]:'parent'
  const fullMatches=originals.filter(r=>payload(oldScene.get(r.variantId))===payload(scene))
  const citedHistoryUnchanged=r=>references(r.knowledgeEvidenceIds).every(ref=>afterRefs.has(ref)&&newHistory.has(ref)&&oldHistory.has(ref)&&sha(canonical(oldHistory.get(ref)))===sha(canonical(newHistory.get(ref))))
  const inherited=fullMatches.filter(citedHistoryUnchanged)
  let selected,status,reason
  if(manualValue){
   for(const field of [...fields.filter(f=>f!=='recommendedCopy'),'knowledgeEvidenceIds','resolutionRationale'])if(!Object.hasOwn(manualValue,field)||manualValue[field]===null||manualValue[field]==='')throw new Error(`Incomplete after manual ${field}: ${id}`)
   if(originals.some(r=>/^(?:NOT-A-BUG|P3)(?:$|[: /-])/.test(r.editorialVerdict))&&/^PASS(?:$|[: /-])/.test(manualValue.editorialVerdict))throw new Error(`Do not force retained P3/NOT-A-BUG to PASS: ${id}`)
   selected=manualValue;status='EXPLICIT_AFTER_MANUAL';reason=manualValue.resolutionRationale
   usedManual.add(id)
  }else if(inherited.length&&new Set(inherited.map(r=>JSON.stringify(Object.fromEntries(fields.map(f=>[f,r[f]]))))).size===1){
   selected=inherited[0];status='INHERITED_IDENTICAL_REVIEWED_PAYLOAD';reason='Full visible payload and legal history witness match; every explicitly cited saved-history record remains present unchanged. Original verdict is retained, not upgraded.'
  }else{
   selected=originals[0];status='NEEDS_MANUAL_REVIEW'
   reason=!originals.length?'No before review mapped to this legal displayed combination':!fullMatches.length?'Visible incoming/source/candidate combination changed':!inherited.length?'One or more specifically cited history records changed or are absent from this context':'Mapped manual judgments differ'
   pendingReasons.add(reason)
  }
  const actualFork=forks.get(scene.branchEvidence[choice.id]);if(!actualFork)throw new Error(`Missing actual after fork ${id}`)
  const base=selected??{}
  const row={reviewId:id,variantId:scene.variantId,nodeId:scene.nodeId,choiceId:choice.id,choiceNumber:i+1,actualChoiceCount:scene.choices.length,edition:scene.edition,causalityVersion:scene.causalityVersion,sender:scene.uiIdentity,sourceRefs:scene.sourceRefs,candidateText:choice.text,incomingText:scene.userMessage,originalReviewIds:originals.map(r=>`${r.variantId}:${r.choiceId}`),originalEditorialVerdicts:originals.map(r=>r.editorialVerdict),closureStatus:status,closureRationale:reason,partition,questionIntent:base.questionIntent??'待逐条确认当前来信目的',responseIntent:base.responseIntent??'待逐条确认当前候选目的',knowledgeEvidenceIds:status==='NEEDS_MANUAL_REVIEW'?[`CURRENT:${scene.variantId}`]:manualValue?manualValue.knowledgeEvidenceIds:remapCurrent(base.knowledgeEvidenceIds,base.variantId,scene.variantId),epistemicVerdict:status==='NEEDS_MANUAL_REVIEW'?'NEEDS-EVIDENCE: changed sources or displayed combination requires explicit after review':base.epistemicVerdict,replyFit:status==='NEEDS_MANUAL_REVIEW'?'NEEDS-EVIDENCE: after response fit is not automatically approved':base.replyFit,claimVsCapability:base.claimVsCapability??'待确认当期授权',futureLeak:base.futureLeak??'待确认时间边界',branchMeaning:{binding:choice.decisionBinding,recordedChanges:choice.mutations,continuation:choice.continuation,nextNodeId:choice.nextNodeId,choiceKind:scene.choiceKind,afterResponsePurpose:base.responseIntent,originalAssessments:originals.map(r=>r.branchMeaning)},nextTurnImpact:{branchEvidence:scene.branchEvidence[choice.id],actualFirstResponse:actualFork.directNext},editorialVerdict:status==='NEEDS_MANUAL_REVIEW'?'NEEDS-EVIDENCE':base.editorialVerdict,recommendedCopy:status==='NEEDS_MANUAL_REVIEW'?choice.text:(base.recommendedCopy??choice.text),catalogSelectedCount:scene.selectedCounts?.[choice.id]??0}
  row.linkMethod=manualValue?.linkMethod??'exact-legal-node-choice-history-witness'
  rows.push(row);sceneRows.push(row)
  if(status!=='NEEDS_MANUAL_REVIEW')for(const ref of references(row.knowledgeEvidenceIds))if(!afterRefs.has(ref)||!newHistory.has(ref))throw new Error(`After review cites history outside actual current context ${id}: ${ref}`)
 }
 if(sceneRows.some(r=>r.closureStatus==='NEEDS_MANUAL_REVIEW')){
  const partition=[...new Set(sceneRows.map(r=>r.partition))].length===1?sceneRows[0].partition:'parent'
  const packet={afterVariantId:scene.variantId,nodeId:scene.nodeId,partition,pendingReasons:[...pendingReasons],exactSemanticWitnesses:exact.map(c=>({beforeVariantId:c.beforeVariantId,historyPath:c.historyPath})),beforeScenes:sourceScenes.map(snapshot),afterScene:snapshot(scene),afterKnownState:scene.knownState,afterHistoryRefs:[...afterRefs],candidates:sceneRows.map(row=>({...row,originalManualReviews:row.originalReviewIds.map(id=>oldReviews.get(id))}))}
  packets[partition].push(packet)
  if(!sourceScenes.length)unmapped.push(scene.variantId)
 }
}
for(const id of manual.keys())if(!usedManual.has(id))throw new Error(`Stale/unmapped after manual annotation ${id}`)
await mkdir(output,{recursive:true})
await writeFile(path.join(output,'after-closure-draft.jsonl'),rows.map(r=>JSON.stringify(r)).join('\n')+'\n')
for(const[partition,list]of Object.entries(packets)){
 await writeFile(path.join(output,`after-delta-${partition}.jsonl`),list.map(r=>JSON.stringify(r)).join('\n')+'\n')
 const readable=list.map(p=>`${p.afterVariantId} ${p.nodeId}\n原因：${p.pendingReasons.join(' / ')}\n当前发信人：${JSON.stringify(p.afterScene.uiIdentity)}\nBEFORE\n${p.beforeScenes.map(s=>s.userMessage).join('\n---\n')}\nAFTER\n${p.afterScene.userMessage}\n${p.candidates.map(c=>`[${c.choiceNumber}] ${c.choiceId}\n当前：${c.candidateText}\n原判断：${c.originalEditorialVerdicts.join(',')}\n${c.originalManualReviews.map(r=>r.epistemicVerdict+'；'+r.replyFit).join('\n')}\n待审ID：${c.reviewId}`).join('\n')}`).join('\n\n================\n\n')
 await writeFile(path.join(output,`after-delta-${partition}.txt`),readable)
}
const result={baselineVariants:beforeScenes.length,afterVariants:afterScenes.length,afterCandidates:rows.length,afterFourChoiceVariants:afterScenes.filter(s=>s.choices.length===4).length,afterFourChoiceCandidates:rows.filter(r=>r.actualChoiceCount===4).length,inherited:rows.filter(r=>r.closureStatus==='INHERITED_IDENTICAL_REVIEWED_PAYLOAD').length,explicitManual:rows.filter(r=>r.closureStatus==='EXPLICIT_AFTER_MANUAL').length,pending:rows.filter(r=>r.closureStatus==='NEEDS_MANUAL_REVIEW').length,packets:Object.fromEntries(Object.entries(packets).map(([k,v])=>[k,{scenes:v.length,candidates:v.reduce((n,p)=>n+p.candidates.length,0)}])),unmapped,manualSources}
await writeFile(path.join(output,'after-closure-summary.json'),JSON.stringify(result,null,2)+'\n')
console.log(JSON.stringify(result))
