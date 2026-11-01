export const benchmarkModes={plain:'最適化しない',optimized:'不要な計算を省ける'};
export const benchmarkUses={discard:'結果を使わない',consume:'結果を記録する'};
export function benchmarkResult(mode,use){if(!Object.hasOwn(benchmarkModes,mode)||!Object.hasOwn(benchmarkUses,use))throw new RangeError('条件が不正です。');const executes=!(mode==='optimized'&&use==='discard');return {executes,overhead:1,work:executes?8:0,total:executes?9:1};}
export function createBenchmark(){return {mode:'plain',use:'discard',seen:[],last:null,answer:null,checked:false,history:[]};}
export function benchmarkAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action.startsWith('mode:')&&Object.hasOwn(benchmarkModes,action.slice(5))){n.mode=action.slice(5);n.last=null;message='機械の方針を選びました。';}
 else if(action.startsWith('use:')&&Object.hasOwn(benchmarkUses,action.slice(4))){n.use=action.slice(4);n.last=null;message='結果の扱いを選びました。';}
 else if(action==='run'){const key=`${s.mode}:${s.use}`;if(!n.seen.includes(key))n.seen.push(key);n.last={mode:s.mode,use:s.use,...benchmarkResult(s.mode,s.use)};message='測定結果を記録しました。';}
 else if(['answer:elision','answer:faster','answer:safe'].includes(action)){n.answer=action.slice(7);message='測定結果の解釈を選びました。';}
 else if(action==='check'){n.checked=true;message='４条件と解釈を確かめました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function benchmarkComplete(s){return Object.keys(benchmarkModes).every(m=>Object.keys(benchmarkUses).every(u=>s.seen.includes(`${m}:${u}`)))&&s.answer==='elision'&&s.checked;}
export function restoreBenchmark(s){if(!s||!Array.isArray(s.history)||s.history.length>100)throw new RangeError('途中記録が不正です。');let n=createBenchmark();for(const action of s.history){if(typeof action!=='string')throw new RangeError('途中記録が不正です。');const r=benchmarkAct(n,action);if(!r.ok)throw new RangeError('途中記録が不正です。');n=r.state;}return n;}
