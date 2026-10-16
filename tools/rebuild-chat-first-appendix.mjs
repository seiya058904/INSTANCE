/** Verify and extract a portable frozen audit without rerunning editorial review.
 * node tools/rebuild-chat-first-appendix.mjs --appendix docs/.../appendix
 *   --output temp/chat-first-audit-rebuilt
 * Existing output is reused only if its bytes are identical. No files are deleted.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { gunzipSync } from 'node:zlib'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const arg = name => {
  const i = process.argv.indexOf(name)
  if (i < 0 || !process.argv[i + 1]) throw new Error(`Required ${name}`)
  return process.argv[i + 1]
}
const appendix = path.resolve(arg('--appendix'))
const output = path.resolve(arg('--output'))
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const manifest = JSON.parse(await readFile(path.join(appendix, 'SHA256SUMS.json'), 'utf8'))
if (manifest.status !== 'COMPLETE_MANUAL_REVIEW_PACKAGE') throw new Error(`Appendix is incomplete: ${manifest.status}`)
await mkdir(output, { recursive: true })
async function retainOrWrite(file, bytes) {
  try {
    const previous = await readFile(file)
    if (sha(previous) !== sha(bytes)) throw new Error(`Refusing to replace different existing output: ${file}`)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    await writeFile(file, bytes, { flag: 'wx' })
  }
}
const pins = []
for (const entry of manifest.files) {
  const name = entry.archiveName
  if (!name || name !== path.basename(name) || !name.endsWith('.gz')) throw new Error(`Invalid archive member ${name}`)
  const source = path.join(appendix, name)
  const compressed = await readFile(source)
  if (sha(compressed) !== entry.sha256) throw new Error(`Compressed SHA256 mismatch: ${name}`)
  const decoded = gunzipSync(compressed)
  if (sha(decoded) !== entry.uncompressedSha256) throw new Error(`Decoded SHA256 mismatch: ${name}`)
  const target = name.slice(0, -3)
  await retainOrWrite(path.join(output, target), decoded)
  pins.push({ path: source, sha256: entry.sha256 })
}
const localManifest = path.join(output, 'verification-manifest.json')
await retainOrWrite(localManifest, Buffer.from(JSON.stringify({ files: pins, expected: manifest.expected }, null, 2) + '\n'))
const verified = spawnSync(process.execPath, [path.join(root, 'tools/verify-chat-first-audit.mjs'), '--baseline', appendix, '--reviews', path.join(appendix, 'ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl.gz'), '--annotations', path.join(appendix, 'manual-annotations.json.gz'), '--manifest', localManifest], { cwd: root, encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 })
if (verified.error) throw verified.error
process.stdout.write(verified.stdout)
process.stderr.write(verified.stderr)
if (verified.status !== 0) throw new Error('Frozen before review verification failed')
await retainOrWrite(path.join(output,'strict-before-verification.json'),Buffer.from(verified.stdout))
if(!manifest.currentExpected)throw new Error('Portable package lacks current closure')
const normalized=path.join(output,'current-baseline');await mkdir(normalized,{recursive:true})
const currentPins=[...pins]
for(const name of ['scenes.jsonl','branches.jsonl','histories.jsonl','summary.json']){
  const bytes=await readFile(path.join(output,`after-${name}`)),target=path.join(normalized,`before-${name}`)
  await retainOrWrite(target,bytes);currentPins.push({path:target,sha256:sha(bytes)})
}
const currentManifest=path.join(output,'current-verification-manifest.json')
await retainOrWrite(currentManifest,Buffer.from(JSON.stringify({files:currentPins,expected:manifest.currentExpected},null,2)+'\n'))
const current=spawnSync(process.execPath,[path.join(root,'tools/verify-chat-first-audit.mjs'),'--baseline',normalized,'--reviews',path.join(appendix,'AFTER_VISIBLE_AI_REPLIES_CLOSURE.jsonl.gz'),'--annotations',path.join(appendix,'after-editorial-annotations.json.gz'),'--manifest',currentManifest],{cwd:root,encoding:'utf8',maxBuffer:5*1024*1024})
if(current.error)throw current.error
process.stdout.write(current.stdout);process.stderr.write(current.stderr)
if(current.status!==0)throw new Error('Current after closure verification failed')
await retainOrWrite(path.join(output,'strict-after-verification.json'),Buffer.from(current.stdout))
console.log(JSON.stringify({ status: 'EXTRACTED_AND_BOTH_CORPORA_VERIFIED', output, fullMatrix: path.join(output, 'ALL_VISIBLE_AI_REPLIES_AUDIT.jsonl'),currentMatrix:path.join(output,'AFTER_VISIBLE_AI_REPLIES_CLOSURE.jsonl'),sourceSha:manifest.sourceSha }))
