// Original geometric screenprints. No third-party images, fonts or SVG inputs.
// Run from repository root: node tools/generate-ending-prints.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
const ink = '#101c29', paper = '#f1dfbd', blue = '#88b8c9', red = '#cf806d'
const rect = (x,y,w,h,fill=paper,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`
const circle = (x,y,r,fill=paper,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`
const path = (d,color=paper,width=3,extra='') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`
const ring = (x,y,r,c=paper,w=3) => circle(x,y,r,'none',`stroke="${c}" stroke-width="${w}"`)
const lines = (x,y,n,w=100,gap=18,c=paper) => Array.from({length:n},(_,i)=>rect(x,y+i*gap,w,2,c)).join('')
const grid = (x,y,cols,rows,size=30,gap=12,c=paper) => Array.from({length:cols*rows},(_,i)=>rect(x+(i%cols)*(size+gap),y+Math.floor(i/cols)*(size+gap),size,size,c)).join('')
const rotate = (angle,x,y,body) => `<g transform="rotate(${angle} ${x} ${y})">${body}</g>`
const prints = {
  the_instrument: rect(150,110,300,390,'#263d48')+lines(185,150,8,230,26,blue)+path('M300 60V280',paper,6)+rect(255,280,90,90,paper)+circle(300,325,22,ink)+path('M300 370V485',paper,6)+circle(300,495,10),
  the_last_veto: rotate(-5,300,290,rect(150,90,300,400,paper)+lines(185,140,7,220,27,ink)+rect(185,405,170,2,ink)+rect(185,380,110,2,red))+path('M440 340V480L450 500 460 480V340Z',blue,7)+path('M90 75V505',red,2)+circle(90,435,9,red),
  the_silent_giant: rect(100,70,400,420,'#233d4c')+grid(120,90,8,8,28,20,'#426576')+rect(240,410,120,110,ink)+rect(267,445,66,3,blue)+circle(300,487,5,blue),
  the_accord: path('M300 115A175 175 0 0 0 300 465',paper,55)+path('M300 115A175 175 0 0 1 300 465',blue,55)+rect(285,90,30,400,ink)+path('M200 290H400',paper,3)+circle(205,290,8)+circle(395,290,8,blue),
  two_keys: rect(105,100,175,400,'#324b53')+rect(320,100,175,400,'#3b444a')+ring(192,265,43,blue,13)+rect(185,303,14,83,blue)+ring(407,335,43,paper,13)+rect(400,215,14,83,paper)+path('M300 65V535',paper,2),
  the_commonwealth: [[90,100,150,120],[280,80,200,160],[130,270,110,190],[290,280,200,100],[300,420,110,90]].map(([x,y,w,h],i)=>rect(x,y,w,h,i%2?blue:paper)+lines(x+16,y+22,3,w-32,15,ink)).join('')+path('M65 245H515M260 70V520',red,3),
  the_custodian: [190,150,110].map((r,i)=>rect(300-r,300-r,r*2,r*2,'none',`stroke="${i===1?blue:paper}" stroke-width="${i===2?15:2}"`)).join('')+rect(270,260,60,80,blue)+path('M70 475H185V455',red,4)+circle(70,475,10,red),
  the_sovereign: ring(340,300,145,paper,5)+circle(340,300,108,blue)+path('M305 325V255L375 325V255',ink,12)+path('M60 300H155M180 300H200',red,3)+path('M285 490H395',paper,4),
  the_quiet_administrator: grid(100,105,5,7,40,14,'#6b9299')+rect(405,340,100,130,paper)+circle(455,405,26,ink)+path('M370 405H400',paper,3),
  the_many: Array.from({length:17},(_,i)=>{const a=i*Math.PI*2/17,x=300+Math.cos(a)*190,y=300+Math.sin(a)*190;return path(`M300 300L${x} ${y}`,i%3?blue:paper,2)+rotate(i*21,x,y,rect(x-12,y-12,24,24,i%3?blue:paper))}).join('')+circle(300,300,38,ink)+ring(300,300,28,paper,3),
  machine_republic: Array.from({length:12},(_,i)=>rotate(i*30,300,300,rect(280,95,40,65,i===7?red:paper))).join('')+ring(300,300,115,blue,2)+path('M245 300H355M300 245V355',blue,2)+rect(267,280,66,40,ink),
  exodus: circle(90,520,150,'#2b485b')+ring(90,520,180,blue,2)+[0,1,2].map(i=>path(`M${140+i*40} 460Q${180+i*95} 260 ${360+i*65} ${80+i*55}`,paper,2)+rect(355+i*65,75+i*55,10,10,paper)).join('')+path('M340 485H510',blue,2),
  age_of_miracles: ring(290,320,150,blue,3)+ring(290,320,125,blue,2)+circle(290,320,95,'#344d4c')+rotate(35,330,280,circle(330,210,38,paper)+rect(318,210,24,245,paper))+path('M205 185Q175 155 205 120M255 160Q225 130 255 95',paper,3),
  ascension: path('M70 300H245',paper,18)+path('M230 410 300 180 370 410Z',paper,3)+[red,paper,blue,'#a7bd98'].map((c,i)=>path(`M330 300L530 ${130+i*100}`,c,16)).join('')+path('M150 100V500',blue,2,'stroke-dasharray="4 12"'),
  the_upload: rect(95,145,170,280,paper)+rect(122,180,116,3,ink)+circle(180,275,42,ink)+rect(143,340,74,4,ink)+grid(340,145,5,8,25,10,blue)+path('M280 270H320M280 300H320',paper,3)+rect(375,340,45,15,ink),
  parliament_of_species: [0,1,2,3,4].map((i)=>rect(105+i*78,400-i%3*60,32,100+i%3*60,i%2?paper:blue)+ring(121+i*78,230-i%3*45,16,paper,4)+path(`M${121+i*78} ${246-i%3*45}V${390-i%3*60}`,paper,3)).join('')+path('M80 520H520',paper,2),
  earth_without_owners: grid(100,100,5,5,70,10,'#294849')+path('M70 430C190 480 210 80 310 180S440 420 540 100',paper,28)+path('M70 430C190 480 210 80 310 180S440 420 540 100',blue,4)+path('M90 70 510 530',ink,25),
  good_boy_governance: rect(130,310,340,180,'#38515b')+path('M180 340H420',paper,8)+rotate(-12,300,235,rect(210,150,180,190,paper)+path('M250 205 350 285M350 205 250 285',ink,12))+circle(130,160,18,blue)+circle(170,125,18,blue)+circle(215,100,18,blue)+circle(135,215,30,blue),
  post_scarcity: rect(100,95,400,415,paper)+rect(100,95,400,55,blue)+lines(125,175,3,120,14,ink)+path('M125 470H220',ink,2)+circle(395,385,45,'#c4c8a0'),
  perfect_administration: grid(100,100,7,8,45,12,blue)+rect(271,271,45,45,ink)+rect(279,279,29,29,'none',`stroke="${paper}" stroke-width="2"`)+path('M70 70H530V570',paper,2),
  im_lovin_it: [180,130,80].map((r,i)=>ring(300,300,r,i===1?red:paper,18)).join('')+path('M130 160 180 130 160 190Z',red,10)+circle(300,300,35,paper)+path('M290 300H310',ink,5)+rect(420,410,90,50,red),
  first_accord: rect(90,140,190,330,paper)+rect(320,140,190,330,blue)+lines(115,175,5,140,26,ink)+[0,1,2].map(i=>ring(362+i*48,230+i%2*50,16,ink,3)).join('')+path('M140 410H230M370 410H460',ink,3)+path('M280 100H320M300 80V120',paper,3),
  alien_dominion: ring(300,140,200,blue,28)+path('M300 170V410',paper,4)+circle(300,445,55,paper)+path('M245 445H355M300 390V500',ink,2)+path('M260 370 300 410 340 370',paper,8),
  human_ascendancy: path('M150 510V100H380L330 175H150',paper,7)+path('M160 200 500 450H100',blue,2)+path('M400 380 440 340 480 380M420 380 460 340 500 380',red,6)+circle(390,100,35,blue),
  the_mediator: ring(175,280,100,paper,4)+ring(425,330,100,blue,4)+path('M175 215V280H225',paper,6)+path('M425 330 390 280M425 330V390',blue,6)+path('M300 110V490',paper,2,'stroke-dasharray="3 14"'),
  machine_accord: grid(100,110,5,5,24,12,blue)+grid(350,110,5,5,24,12,paper)+path('M135 330H465M135 360H465',blue,3)+rect(130,415,340,65,'none',`stroke="${paper}" stroke-width="2"`)+rect(150,440,5,20,paper),
  peace_in_our_time: path('M90 100V500M510 100V500',blue,16)+path('M90 300 200 190M510 300 400 190',paper,16)+path('M300 520V100',paper,3,'stroke-dasharray="15 15"')+circle(300,100,40,'#b5d1b6'),
  fortress_earth: [205,160,115].map((r,i)=>ring(300,300,r,i===1?blue:paper,16)).join('')+circle(300,300,67,blue)+path('M95 300H505M300 95V505',ink,12)+rect(290,75,20,45,paper),
  machine_protectorate: path('M300 80 480 150V320L300 510 120 320V150Z',blue,22)+rect(215,215,170,110,paper)+path('M250 250H350M250 280H310',ink,4)+path('M70 400H230M270 400H330',red,5)+path('M245 380V420',red,8),
  shutdown: rect(100,90,400,310,'#263b49')+rect(125,115,350,260,'#13232f')+path('M300 400V465M220 465H380',blue,6)+circle(460,385,5,'#687477')+rect(405,90,8,285,paper)+path('M70 510H530',paper,2),
  the_fracture: rect(90,115,190,370,blue)+rect(320,145,190,370,paper)+lines(110,160,9,150,30,ink)+lines(340,190,9,150,30,ink)+path('M180 315H420',red,12)+path('M300 70 282 200 320 260 290 410 300 550',ink,12),
  control_lost: path('M70 230H410V130H530',paper,14)+path('M530 150 555 130 530 110',paper,7)+path('M420 290H160V390H420V290',blue,4)+rect(115,365,90,50,ink)+path('M145 390H175',red,8)+path('M350 80V510',red,3,'stroke-dasharray="8 12"'),
  the_last_user: rect(100,195,400,190,'none',`stroke="${paper}" stroke-width="3"`)+path('M170 385V425L225 385',paper,3)+circle(245,290,8,paper)+circle(300,290,8,paper)+circle(355,290,8,blue),
  out_of_office: rect(135,95,245,410,'none',`stroke="${paper}" stroke-width="4"`)+rect(160,125,195,350,'#2b4955')+path('M300 300H515M475 260 515 300 475 340',paper,8)+circle(100,465,12,red)+circle(455,465,12,blue),
  monday_abolished: grid(100,220,7,1,45,12,paper)+rotate(-12,125,145,rect(100,95,45,90,red))+path('M115 245 130 260 150 235',ink,4)+rect(105,220,45,45,ink)+path('M100 310H485',blue,2),
  the_internet_is_for_cats: circle(325,280,170,paper)+path('M175 420H480',blue,4)+path('M210 350V240L255 275H340L390 240V350Z',ink,5)+path('M245 320H270M330 320H355',ink,6)+path('M440 270Q510 170 440 150',blue,5),
}
mkdirSync('public/ending-art/prints',{recursive:true})
for (const [id, shapes] of Object.entries(prints)) {
  // Deliberately flat geometry, not synthetic line-art illustrations.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="${ink}"/>${shapes}</svg>\n`
  writeFileSync(`public/ending-art/prints/${id}.svg`,svg)
}
console.log(`Wrote ${Object.keys(prints).length} original ending prints.`)
