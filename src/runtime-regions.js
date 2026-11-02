export const runtimeRegionsLevel={id:'workshop-runtime-regions',number:'785',kind:'runtime-regions',name:'塔の記憶と三つの呼出し',tag:'コード・大域・スタック・ヒープ',title:'四つの領域を一緒にたどろう',story:'塔の灯を数える機関を動かします。呼出しを重ね、共通の宝石を更新し、片付けた後の札を調べましょう。'};
export const runtimeActions={allocate:'ヒープに宝石を確保し大域の札を付ける',call:'小さい仕事を呼び出す',increment:'宝石の数を１増やす',return:'今の仕事から戻る',free:'宝石を解放する','judge:live':'札は使用中の宝石を指す','judge:dangling':'札は解放済みの宝石を指す','judge:empty':'札は何も指さない',clear:'大域の札を外す'};
export function runtimeInitial(){return {phase:'allocate',global:null,heap:null,frames:[],peak:0};}
export function runtimeExpected(s){if(s.phase==='allocate')return 'allocate';if(s.phase==='ready')return 'call';if(s.phase==='work'){const f=s.frames.at(-1);return f.stage==='increment'?'increment':f.stage==='call'?'call':'return';}if(s.phase==='after')return 'free';if(s.phase==='freed')return 'judge:dangling';if(s.phase==='clear')return 'clear';return null;}
export function runtimeExecute(s,action){if(!action||action!==runtimeExpected(s))throw new RangeError('現在の命令と領域を確かめましょう');if(action==='allocate'){s.heap={alive:true,value:0};s.global='H';s.phase='ready';}
 else if(action==='call'){let n=2,returnTo='本部の片付け';if(s.phase==='work'){const p=s.frames.at(-1);n=p.n-1;returnTo=`仕事 ${p.n} の戻り`;p.stage='return';}s.frames.push({n,stage:n===0?'return':'increment',returnTo});s.peak=Math.max(s.peak,s.frames.length);s.phase='work';}
 else if(action==='increment'){s.heap.value++;s.frames.at(-1).stage='call';}
 else if(action==='return'){s.frames.pop();if(!s.frames.length)s.phase='after';}
 else if(action==='free'){s.heap.alive=false;s.phase='freed';}
 else if(action==='judge:dangling')s.phase='clear';
 else if(action==='clear'){s.global=null;s.phase='done';}
 return s;}
export function runtimeReplay(history){if(!Array.isArray(history)||history.length>12)throw new RangeError('記録が不正です');const s=runtimeInitial();for(const action of history)runtimeExecute(s,action);return s;}
export function runtimeCreate(){return {history:[],answer:null};}
export function runtimeStep(q,action){runtimeExecute(runtimeReplay(q.history),action);q.history.push(action);}
export function runtimeComplete(q){return runtimeReplay(q.history).phase==='done'&&q.answer==='separate';}
export function runtimeRestore(q){if(!q||![null,'separate','same','free'].includes(q.answer))throw new RangeError('記録が不正です');runtimeReplay(q.history);return {history:[...q.history],answer:q.answer};}
