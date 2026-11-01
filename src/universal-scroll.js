export const universalScrollLevel={id:'archive-universal-scroll',number:'645',kind:'universal-scroll',name:'手順を読む万能の巻物',tag:'万能機械とシミュレーション',title:'巻物に書かれた機械を動かそう',story:'書庫の精霊は、手順の巻物と入力を受け取り、書かれた機械の動きをまねします。巻物と入力を替えて、同じ精霊に試してもらいましょう。'};
export const scrollPrograms={
 single:{label:'左だけ反転',rules:[['q0',0,1,'S','halt'],['q0',1,0,'S','halt']]},
 both:{label:'両方を反転',rules:[['q0',0,1,'R','q1'],['q0',1,0,'R','q1'],['q1',0,1,'S','halt'],['q1',1,0,'S','halt']]},
 loop:{label:'同じ状態を繰り返す',rules:[['q0',0,0,'S','q0'],['q0',1,1,'S','q0']]}
};
export const scrollRequired=['single,00','single,11','both,00','both,01','loop,00'];
export function simulateScroll(program,bits,steps){
 if(!Object.hasOwn(scrollPrograms,program)||!['00','01','10','11'].includes(bits)||!Number.isInteger(steps)||steps<0||steps>10)throw new RangeError('巻物の設定が不正です。');
 const tape=[...bits].map(Number),seen=new Set();let state='q0',head=0,status='running',last=null;const key=()=>`${state},${head},${tape.join('')}`;seen.add(key());
 for(let i=0;i<steps;i++){
  if(status!=='running')throw new RangeError('停止後や反復検出後には進めません。');
  const read=tape[head],rule=scrollPrograms[program].rules.find(r=>r[0]===state&&r[1]===read);if(!rule)throw new RangeError('対応する規則がありません。');
  const [from,,write,move,next]=rule;last={from,read,write,move,next};tape[head]=write;if(move==='R')head++;else if(move==='L')head--;state=next;
  if(state==='halt')status='halt';else if(head<0||head>=tape.length)status='boundary';else if(seen.has(key()))status='cycle';else seen.add(key());
 }
 return {tape,head,state,status,last};
}
export function createUniversalScroll(){return {program:'single',bits:'00',steps:0,observed:[],answer:null,halting:null,checked:false};}
export function universalScrollComplete(s){return scrollRequired.every(k=>s.observed.includes(k))&&s.answer==='description'&&s.halting==='limited'&&s.checked;}
export function restoreUniversalScroll(s){
 const valid=new Set(Object.keys(scrollPrograms).flatMap(p=>['00','01','10','11'].map(b=>`${p},${b}`)));
 if(!s||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'description','fixed','predict'].includes(s.answer)||![null,'limited','all','finite'].includes(s.halting)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');simulateScroll(s.program,s.bits,s.steps);return {...s,observed:[...s.observed]};
}
