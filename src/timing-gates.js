export const timingGatesLevel={id:'castle-timing-gates',number:'617',kind:'timing-gates',name:'二つの門と漏れる足音',tag:'時間差の側信道',title:'門の足音から秘密を守ろう',story:'王城の二つの門には、４つの灯りからなる秘密の印があります。門を試し、比較の足音が何を伝えるか調べましょう。'};
export const timingDoors={sun:'太陽の門',moon:'月の門'};
const secrets={sun:0b1011,moon:0b0110};
export function inspectTimingGate(door,mode,guess){
 if(!Object.hasOwn(timingDoors,door)||!['early','full'].includes(mode)||!Number.isInteger(guess)||guess<0||guess>15)throw new RangeError('門の条件が不正です');
 let compared=0,difference=0;
 for(let bit=3;bit>=0;bit--){const mismatch=((guess>>bit)&1)^((secrets[door]>>bit)&1);compared++;difference|=mismatch;if(mode==='early'&&mismatch)break;}
 return {compared,accepted:difference===0};
}
export function timingEvidence(records,door){
 const early=records.filter(r=>r.door===door&&r.mode==='early'),full=records.filter(r=>r.door===door&&r.mode==='full');
 const opened=early.some(r=>inspectTimingGate(door,'early',r.guess).accepted);
 const shared=early.filter(r=>full.some(t=>t.guess===r.guess)&&!inspectTimingGate(door,'early',r.guess).accepted);
 const paired=shared.some((r,i)=>shared.slice(i+1).some(t=>inspectTimingGate(door,'early',r.guess).compared!==inspectTimingGate(door,'early',t.guess).compared));
 return {opened,paired};
}
export function createTimingGates(){return {door:'sun',mode:'early',guess:0,records:[],answer:null,checked:false};}
export function recordTimingAttempt(s){
 const records=[...s.records];if(!records.some(r=>r.door===s.door&&r.mode===s.mode&&r.guess===s.guess))records.push({door:s.door,mode:s.mode,guess:s.guess});
 return {...s,records,checked:false};
}
export function timingGatesComplete(s){return Object.keys(timingDoors).every(door=>{const e=timingEvidence(s.records,door);return e.opened&&e.paired;})&&s.answer==='limited'&&s.checked;}
export function restoreTimingGates(s){
 if(!s||!Object.hasOwn(timingDoors,s.door)||!['early','full'].includes(s.mode)||!Number.isInteger(s.guess)||s.guess<0||s.guess>15||!Array.isArray(s.records)||s.records.length>64||s.records.some(r=>!r||!Object.hasOwn(timingDoors,r.door)||!['early','full'].includes(r.mode)||!Number.isInteger(r.guess)||r.guess<0||r.guess>15)||new Set(s.records.map(r=>`${r.door}:${r.mode}:${r.guess}`)).size!==s.records.length||![null,'limited','proof','secret'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,records:s.records.map(r=>({...r}))};
}
