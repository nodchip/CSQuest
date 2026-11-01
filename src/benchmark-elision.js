export const benchmarkModes={plain:'最適化しない',optimized:'不要な計算を省ける'};
export const benchmarkUses={discard:'結果を使わない',consume:'結果を記録する'};
export function benchmarkResult(mode,use){if(!Object.hasOwn(benchmarkModes,mode)||!Object.hasOwn(benchmarkUses,use))throw new RangeError('条件が不正です。');const executes=!(mode==='optimized'&&use==='discard');return {executes,overhead:1,work:executes?8:0,total:executes?9:1};}
export function batchMeasurement(count){if(![1,10].includes(count))throw new RangeError('回数が不正です。');return {count,overhead:2,work:count,total:2+count,average:(2+count)/count};}
export function createBenchmark(){return {mode:'plain',use:'discard',seen:[],last:null,answer:null,checked:false,batch:1,batchSeen:[],batchLast:null,batchAnswer:null,batchChecked:false,history:[]};}
export function benchmarkAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],batchSeen:[...s.batchSeen],history:[...s.history]};let message='';
 if(action.startsWith('mode:')&&Object.hasOwn(benchmarkModes,action.slice(5))){n.mode=action.slice(5);n.last=null;n.checked=false;message='機械の方針を選びました。';}
 else if(action.startsWith('use:')&&Object.hasOwn(benchmarkUses,action.slice(4))){n.use=action.slice(4);n.last=null;n.checked=false;message='結果の扱いを選びました。';}
 else if(action==='run'){const key=`${s.mode}:${s.use}`;if(!n.seen.includes(key))n.seen.push(key);n.last={mode:s.mode,use:s.use,...benchmarkResult(s.mode,s.use)};n.checked=false;message='測定結果を記録しました。';}
 else if(['answer:elision','answer:faster','answer:safe'].includes(action)){n.answer=action.slice(7);n.checked=false;message='測定結果の解釈を選びました。';}
 else if(action==='check'){n.checked=true;message='４条件と解釈を確かめました。';}
 else if(['batch:1','batch:10'].includes(action)){n.batch=Number(action.slice(6));n.batchLast=null;n.batchChecked=false;message='繰り返し回数を選びました。';}
 else if(action==='batch:run'){n.batchLast=batchMeasurement(s.batch);if(!n.batchSeen.includes(s.batch))n.batchSeen.push(s.batch);n.batchChecked=false;message='測定の合計と１回あたりを記録しました。';}
 else if(['batch:answer:overhead','batch:answer:faster','batch:answer:perfect'].includes(action)){n.batchAnswer=action.slice(13);n.batchChecked=false;message='平均の違いを選びました。';}
 else if(action==='batch:check'){n.batchChecked=true;message='繰り返しの比較を確かめました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function benchmarkComplete(s){return Object.keys(benchmarkModes).every(m=>Object.keys(benchmarkUses).every(u=>s.seen.includes(`${m}:${u}`)))&&s.answer==='elision'&&s.checked&&[1,10].every(n=>s.batchSeen.includes(n))&&s.batchAnswer==='overhead'&&s.batchChecked;}
export function restoreBenchmark(s){if(!s||!Array.isArray(s.history)||s.history.length>100)throw new RangeError('途中記録が不正です。');let n=createBenchmark();for(const action of s.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=benchmarkAct(n,action);if(!r.ok)throw new RangeError('途中記録が不正です。');n=r.state;}return n;}
