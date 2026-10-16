/** Legal before/current replay, distinct from editorial review and test suites.
 * node tools/compare-chat-first-audit.mjs --baseline DIR --after DIR --output NEWDIR
 * Frozen source defaults to the baseline summary SHA. No runtime writes.
 */
import{createServer}from'vite'
import{readFile,writeFile,mkdir}from'node:fs/promises'
import{createHash}from'node:crypto'
import{execFileSync}from'node:child_process'
import path from'node:path'
const option=name=>{const i=process.argv.indexOf(name);if(i<0||!process.argv[i+1])throw new Error(`Required ${name}`);return process.argv[i+1]}
const baseline=option('--baseline'),after=option('--after'),output=option('--output')
await mkdir(output,{recursive:true})
const sha=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex')
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().filter(k=>x[k]!==undefined).map(k=>[k,canonical(x[k])])):x
const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b))
const readJson=async file=>JSON.parse(await readFile(file,'utf8'))
const readLines=async file=>(await readFile(file,'utf8')).trim().split('\n').map(JSON.parse)
const write=(file,value)=>writeFile(path.join(output,file),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n',{encoding:'utf8',flag:'wx'})
const beforeSummary=await readJson(path.join(baseline,'before-summary.json')),afterSummary=await readJson(path.join(after,'after-summary.json'))
const sourceSha=beforeSummary.sourceSha
const sourceStart=sha(execFileSync('git',['diff','--','src'],{encoding:'utf8',maxBuffer:20*1024*1024}))
const beforeRows=await readLines(path.join(baseline,'before-scenes.jsonl')),histories=new Map((await readLines(path.join(baseline,'before-histories.jsonl'))).map(x=>[x.historyId,x]))
const routeRecords=await readJson(path.join(baseline,'before-routes.json'))
const beforeServer=await createServer({plugins:[{name:'frozen-semantic-baseline',enforce:'pre',load(id){const relative=path.relative(process.cwd(),id.split('?')[0]).replaceAll('\\','/');if(!relative.startsWith('src/')||!/\.(?:tsx?|json)$/.test(relative))return null;return execFileSync('git',['show',`${sourceSha}:${relative}`],{encoding:'utf8',maxBuffer:20*1024*1024})}}],server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'})
const afterServer=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'})
const differences=[],routeComparisons=[],sceneComparisons=[],candidateComparisons=[],contractCopyDifferences=[]
const failures=[]
let stateChecks=0,choiceChecks=0,contractChecks=0
// Exact display exclusions only. All other keys, including new unknown keys,
// remain in the mechanical comparison and can cause a failure.
const omit=(value,keys)=>{if(!value)return value;const copy={...value};for(const key of keys)delete copy[key];return copy}
const displayChoiceKeys=new Set(['text','authoredTextHash'])
const contentMechanics=parts=>parts?.map(part=>omit(part,['text','alt']))
const longformMechanics=value=>omit(value,['preview','keyFacts'])
const choiceMechanics=choice=>({...omit(choice,[...displayChoiceKeys]),...(choice.content?{content:contentMechanics(choice.content)}:{}),...(choice.longformPreview?{longformPreview:longformMechanics(choice.longformPreview)}:{})})
const sceneDisplayKeys=['conversationTitle','conversationTitleAfterMessage','userMessage','userMessages','statusText']
const sceneMechanics=scene=>({...omit(scene,sceneDisplayKeys),...(scene.userContent?{userContent:contentMechanics(scene.userContent)}:{}),...(scene.userLongInput?{userLongInput:longformMechanics(scene.userLongInput)}:{}),...(scene.contextVariants?{contextVariants:scene.contextVariants.map(c=>omit(c,['userMessageSuffix']))}:{}),choices:scene.choices.map(choiceMechanics)})
const historyDisplayKeys=['conversationTitle','userMessage','userMessages','assistantText']
const historyMechanics=history=>history.map(entry=>({...omit(entry,historyDisplayKeys),...(entry.userContent?{userContent:contentMechanics(entry.userContent)}:{}),...(entry.assistantContent?{assistantContent:contentMechanics(entry.assistantContent)}:{}),...(entry.userLongInput?{userLongInput:longformMechanics(entry.userLongInput)}:{}),...(entry.assistantLongform?{assistantLongform:longformMechanics(entry.assistantLongform)}:{})}))
const stateMechanics=run=>{const result={...run,history:historyMechanics(run.history)};delete result.personalEpilogueReply;return result}
const endingDisplayKeys=['index','title','status','humanLine','assistantLine','closingExchange','summary','hybridLabel','epilogues']
const endingMechanics=ending=>({...omit(ending,endingDisplayKeys),...(ending.keyHistory?{keyHistory:ending.keyHistory.map(h=>omit(h,['label','detail','causalReason']))}:{})})
const contractDisplayKeys=['title','action','authority','preserves','givesUp','limitations']
const historyPath=run=>run.history.map(h=>[h.nodeId,h.choiceId])
const pathKey=history=>sha(history)
const stateKey=run=>`${run.currentNodeId}:${pathKey(historyPath(run))}`
const compare=(kind,id,a,b)=>{if(!equal(a,b))differences.push({kind,id,before:a,after:b})}
try{
 const load=async server=>{const[engine,fixtures,identity,proposals,presentation]=await Promise.all([server.ssrLoadModule('/src/game/engine.ts'),server.ssrLoadModule('/src/game/mainline2.closeoutFixtures.ts'),server.ssrLoadModule('/src/game/playerIdentity.ts'),server.ssrLoadModule('/src/content/mainline2/proposals.ts'),server.ssrLoadModule('/src/content/mainline2/proposalPresentation.ts')]);return{...engine,...fixtures,...identity,...proposals,...presentation}}
 const old=await load(beforeServer),current=await load(afterServer)
 const snapshot=(api,scene,run)=>({nodeId:scene.id,conversationId:scene.conversationId,conversationTitle:scene.conversationTitle,uiIdentity:api.resolvePlayerVisibleIdentity(scene.conversationId,run.history),userMessage:scene.userMessage,userMessages:scene.userMessages,userContent:scene.userContent,userLongInput:scene.userLongInput,choiceKind:scene.choiceKind,choices:scene.choices})
 const compareContracts=(id,left,right)=>{
  const leftScene=left.phase==='playing'?old.resolveScene(left):undefined,rightScene=right.phase==='playing'?current.resolveScene(right):undefined
  const ids=[...new Set([...(leftScene?.choices??[]).map(c=>c.proposalId),...(left.retainedProposalIds??[]),left.selectedProposalId].filter(Boolean))]
  for(const proposalId of ids){
   const a=old.getFutureProposalById(proposalId),b=current.getFutureProposalById(proposalId)
   if(!a||!b){compare('proposal-definition-existence',`${id}:${proposalId}`,Boolean(a),Boolean(b));continue}
   const ca=old.proposalContract(left,a),cb=current.proposalContract(right,b)
   contractChecks++
   compare('contract-control-fields',`${id}:${proposalId}`,omit(ca,contractDisplayKeys),omit(cb,contractDisplayKeys))
   if(!equal(ca,cb))contractCopyDifferences.push({id,proposalId,before:ca,after:cb})
  }
 }
 const checkPair=(id,left,right)=>{stateChecks++;compare('run-state',id,stateMechanics(left),stateMechanics(right))}
 const pairs=new Map(),queue=[]
 const addPair=(left,right)=>{const key=stateKey(left);if(!pairs.has(key)){const pair={left,right,key};pairs.set(key,pair);queue.push(pair)}}
 for(const[index,record]of routeRecords.entries()){
  const id=`route-${index}:${record.kind}:${record.branchId??record.target.routeId}`
  try{
   const a=old.runMainline2Route(record.target),b=current.runMainline2Route(record.target)
   compare('route-choice-trace',id,a.links.map(l=>[l.nodeId,l.choiceId]),b.links.map(l=>[l.nodeId,l.choiceId]))
   if(a.links.length!==b.links.length){failures.push({id,reason:'Route lengths differ; no unsafe positional alignment'});continue}
   for(let i=0;i<a.links.length;i++){
    const al=a.links[i],bl=b.links[i]
    if(al.nodeId!==bl.nodeId||al.choiceId!==bl.choiceId){failures.push({id,step:i,reason:'Trace diverged; no unsafe witness alignment'});break}
    checkPair(`${id}:${i}`,al.runBefore,bl.runBefore)
    choiceChecks+=al.resolvedScene.choices.length
    compare('scene-choice-mechanics',`${id}:${i}`,sceneMechanics(al.resolvedScene),sceneMechanics(bl.resolvedScene))
    addPair(al.runBefore,bl.runBefore)
    if(al.resolvedScene.choices.some(c=>c.proposalId))compareContracts(`${id}:${i}`,al.runBefore,bl.runBefore)
   }
   checkPair(`${id}:final`,a.run,b.run);compare('ending-resolution',id,endingMechanics(a.ending),endingMechanics(b.ending))
   routeComparisons.push({id,target:record.target,kind:record.kind,stepsBefore:a.links.length,stepsAfter:b.links.length,endingBefore:endingMechanics(a.ending),endingAfter:endingMechanics(b.ending),finalBefore:stateMechanics(a.run),finalAfter:stateMechanics(b.run)})
  }catch(error){failures.push({id,error:String(error)})}
  if(index%25===0)console.log(`semantic routes ${index+1}/${routeRecords.length}`)
 }
 // Each requested saved history is a legal-path target. The prefix whitelist
 // reconstructs only those exact witnesses, avoiding uncontrolled branch growth.
 const goals=new Map(),prefixes=new Set()
 for(const row of beforeRows){
  const history=row.savedVisibleHistoryRefs.map(ref=>{const h=histories.get(ref);if(!h)throw new Error(`Missing history ${ref}`);return[h.nodeId,h.choiceId]})
  goals.set(`${row.nodeId}:${pathKey(history)}`,row)
  for(let n=0;n<=history.length;n++)prefixes.add(pathKey(history.slice(0,n)))
 }
 const reviewed=new Set()
 for(let qi=0;qi<queue.length;qi++){
  const{left,right,key}=queue[qi]
  if(left.phase!=='playing'||right.phase!=='playing')continue
  const row=goals.get(key),ls=old.resolveScene(left),rs=current.resolveScene(right),history=historyPath(left)
  const needAudit=row&&!reviewed.has(row.variantId)
  if(needAudit){
   reviewed.add(row.variantId)
   const visible=snapshot(old,ls,left)
   compare('baseline-witness-displayed-content',row.variantId,{nodeId:row.nodeId,conversationId:row.conversationId,conversationTitle:row.conversationTitle,uiIdentity:row.uiIdentity,userMessage:row.userMessage,userMessages:row.userMessages,userContent:row.userContent,userLongInput:row.userLongInput,choiceKind:row.choiceKind,choices:row.choices},visible)
   compare('fork-origin-mechanics',row.variantId,sceneMechanics(ls),sceneMechanics(rs))
   sceneComparisons.push({beforeVariantId:row.variantId,nodeId:row.nodeId,sourceRefs:row.sourceRefs,context:row.contexts[0],historyPath:history,beforeScene:visible,afterScene:snapshot(current,rs,right)})
  }
  for(const choice of ls.choices){
   const nextPath=[...history,[ls.id,choice.id]],needed=prefixes.has(pathKey(nextPath))
   if(!needAudit&&!needed)continue
   try{
    if(!rs.choices.some(c=>c.id===choice.id)){failures.push({id:key,choiceId:choice.id,error:'Choice absent after'});continue}
    const lnext=old.commitChoice(left,choice.id),rnext=current.commitChoice(right,choice.id)
    if(needed)addPair(lnext,rnext)
    if(!needAudit)continue
    const id=`${row.variantId}:${choice.id}`
    checkPair(id,lnext,rnext);compareContracts(id,lnext,rnext)
    const ldirect=lnext.phase==='playing'?old.resolveScene(lnext):undefined,rdirect=rnext.phase==='playing'?current.resolveScene(rnext):undefined
    compare('fork-direct-next-mechanics',id,ldirect?sceneMechanics(ldirect):lnext.phase,rdirect?sceneMechanics(rdirect):rnext.phase)
    candidateComparisons.push({beforeReviewId:id,beforeVariantId:row.variantId,nodeId:row.nodeId,choiceId:choice.id,afterScene:snapshot(current,rs,right),beforeSavedChoice:lnext.history.at(-1),afterSavedChoice:rnext.history.at(-1),directAfterScene:rdirect?snapshot(current,rdirect,rnext):null,beforeState:stateMechanics(lnext),afterState:stateMechanics(rnext),terminalPhase:rnext.phase})
   }catch(error){failures.push({id:row?.variantId??key,choiceId:choice.id,error:String(error)})}
  }
 }
 for(const row of beforeRows)if(!reviewed.has(row.variantId))failures.push({id:row.variantId,nodeId:row.nodeId,error:'Exact legal saved-history witness not reconstructed'})
 const sourceEnd=sha(execFileSync('git',['diff','--','src'],{encoding:'utf8',maxBuffer:20*1024*1024}))
 if(sourceStart!==sourceEnd)failures.push({error:'Runtime source changed during replay',sourceStart,sourceEnd})
 const result={status:differences.length||failures.length?'FAIL':'PASS',sourceSha,workingTreeSourceDiffSha256:sourceStart,beforeSummary,afterSummary,requestedRoutes:routeRecords.length,comparedRoutes:routeComparisons.length,requestedBeforeVariants:beforeRows.length,comparedBeforeVariants:sceneComparisons.length,requestedBeforeCandidates:beforeRows.reduce((n,r)=>n+r.choices.length,0),comparedBeforeCandidates:candidateComparisons.length,stateChecks,choiceChecks,contractChecks,mechanicalDifferences:differences.length,failures:failures.length,contractDisplayDifferences:contractCopyDifferences.length,exclusions:{choice:[...displayChoiceKeys],contentPart:['text','alt'],longform:['preview','keyFacts'],scene:sceneDisplayKeys,run:['personalEpilogueReply'],history:historyDisplayKeys,ending:endingDisplayKeys,keyHistory:['label','detail','causalReason'],contract:contractDisplayKeys},limitations:['Only enumerated display keys are removed; unknown fields, content types/tool parameters, longform artifactType/structure, and all other state keys remain compared.','Narrative preview/keyFacts differences are retained in candidate snapshots but are not control-state differences.','Contracts are display-only per proposalPresentation.ts; all non-enumerated fields are compared and display changes retained separately.','Recorded branch coverage is verified through exact before saved-history witnesses, not by matching changed variant hashes.']}
 await write('summary.json',result);await write('differences.json',differences);await write('failures.json',failures)
 for(const[name,rows]of[['route-comparisons',routeComparisons],['scene-comparisons',sceneComparisons],['candidate-comparisons',candidateComparisons],['contract-display-differences',contractCopyDifferences]])await write(`${name}.jsonl`,rows.map(x=>JSON.stringify(x)).join('\n')+'\n')
 console.log(JSON.stringify({...result,beforeSummary:undefined,afterSummary:undefined}))
 if(result.status!=='PASS')process.exitCode=1
}finally{await beforeServer.close();await afterServer.close()}
