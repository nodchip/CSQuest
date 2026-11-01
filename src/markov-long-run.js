export const markovLongRunLevel={id:'mist-long-run',number:'684',kind:'markov-long-run',name:'晴れと霧の長い旅',tag:'マルコフ連鎖・定常分布・周期性',title:'天気灯の遠い未来を調べよう',story:'谷の天気灯は、晴れと霧の間で移り変わります。移る割合と最初の光を変え、長い旅の後の分布を比べましょう。'};
export const markovStarts={sun:{name:'晴れから始める',n:1,d:1},fog:{name:'霧から始める',n:0,d:1},half:{name:'晴れと霧が半々',n:1,d:2}};
const gcd=(a,b)=>b?gcd(b,a%b):a;
function fraction(n,d){const g=gcd(n,d);return {n:n/g,d:d/g};}
export function markovLongStep(p,q,r){
 if(!p||!Number.isInteger(p.n)||!Number.isInteger(p.d)||p.d<1||p.n<0||p.n>p.d||![q,r].every(x=>Number.isInteger(x)&&x>=0&&x<=4))throw new RangeError('分布か移る割合が不正です。');
 return fraction(p.n*(4-q)+(p.d-p.n)*r,p.d*4);
}
export function markovLongForecast(q,r){
 if(![q,r].every(x=>Number.isInteger(x)&&x>=0&&x<=4))throw new RangeError('移る割合が不正です。');
 if(q+r===0)return {kind:'all-stationary',stationary:null};
 return {kind:q+r===8?'periodic':'convergent',stationary:fraction(r,q+r)};
}
export function createMarkovLongRun(){return {q:1,r:2,start:'sun',trace:[{n:1,d:1}],seen:[],answer:null,checked:false,history:[]};}
export function markovLongRunAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=160)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,trace:[...s.trace],seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(/^q:[0-4]$/.test(action)||/^r:[0-4]$/.test(action)){const [key,value]=action.split(':');n[key]=Number(value);n.trace=[{n:markovStarts[s.start].n,d:markovStarts[s.start].d}];message='移る割合を変え、最初の日に戻しました。';}
 else if(action.startsWith('start:')&&Object.hasOwn(markovStarts,action.slice(6))){n.start=action.slice(6);const p=markovStarts[n.start];n.trace=[{n:p.n,d:p.d}];message='最初の光を選びました。';}
 else if(action==='step'){
  if(s.trace.length>=9)return {ok:false,message:'この試行は８日までです。最初の光を選び直して試せます。'};
  n.trace.push(markovLongStep(s.trace.at(-1),s.q,s.r));message='１日進めました。';
 }
 else if(action==='observe'){
  if(s.trace.length<3)return {ok:false,message:'２日以上進めて変化を観察しましょう。'};
  const key=`${s.q}:${s.r}:${s.start}`;if(!n.seen.includes(key))n.seen.push(key);message='この条件の変化を記録しました。';
 }
 else if(['answer:limits','answer:always','answer:unique'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='観察した条件と答えを確認しました。';}
 else return {ok:false,message:'天気灯の操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreMarkovLongRun(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>160)throw new RangeError('途中記録が不正です。');let s=createMarkovLongRun();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=markovLongRunAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function markovLongRunComplete(s){return ['1:2:sun','1:2:fog','4:4:sun','4:4:half','0:0:sun','0:0:fog'].every(k=>s.seen.includes(k))&&s.answer==='limits'&&s.checked;}
