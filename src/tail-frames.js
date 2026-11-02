export const tailFramesLevel={id:'workshop-tail-frames',number:'784',kind:'tail-frames',name:'枠を重ねる階段と末尾の道',tag:'末尾呼出しと呼出し枠',title:'階段の合計と枠の数を比べよう',story:'精霊は１から３までの灯を足します。戻ってから足す方法と、先に合計を運ぶ方法で呼出し枠をたどりましょう。'};
export const tailModes={ordinary:'戻ってから足す',tailStack:'先に足す・枠を積む',tailReuse:'先に足す・枠を再利用'};
export const tailActions={call:'新しい枠で呼ぶ',replace:'今の枠を再利用して呼ぶ',base:'０の答えを返す',add:'戻った答えに今の数を足す',return:'戻った答えをそのまま返す'};
export function tailInitial(mode,n=3){if(!Object.hasOwn(tailModes,mode)||!Number.isInteger(n)||n<0||n>8)throw new RangeError('場面が不正です');return {mode,stack:[{n,acc:0,phase:'enter'}],peak:1,result:null};}
export function tailExpected(s){const f=s.stack.at(-1);if(!f)return null;if(f.phase==='enter')return f.n===0?'base':s.mode==='tailReuse'?'replace':'call';if(f.phase==='add')return 'add';if(f.phase==='return')return 'return';throw new RangeError('枠の状態が不正です');}
export function tailExecute(s,action){if(!action||action!==tailExpected(s))throw new RangeError('今の枠と残る仕事を確かめましょう');const f=s.stack.at(-1);const send=value=>{s.stack.pop();const parent=s.stack.at(-1);if(!parent){s.result=value;return;}if(parent.phase!=='waiting')throw new RangeError('戻り先が不正です');parent.child=value;parent.phase=s.mode==='ordinary'?'add':'return';};
 if(action==='call'){f.phase='waiting';s.stack.push({n:f.n-1,acc:s.mode==='ordinary'?0:f.acc+f.n,phase:'enter'});s.peak=Math.max(s.peak,s.stack.length);}
 else if(action==='replace'){s.stack[s.stack.length-1]={n:f.n-1,acc:f.acc+f.n,phase:'enter'};}
 else if(action==='base')send(s.mode==='ordinary'?0:f.acc);
 else if(action==='add')send(f.child+f.n);
 else if(action==='return')send(f.child);
 return s;}
export function tailReplay(mode,history){if(!Array.isArray(history)||history.length>20)throw new RangeError('記録が不正です');const s=tailInitial(mode);for(const action of history)tailExecute(s,action);return s;}
export function tailCreate(){return {selected:'ordinary',trials:Object.fromEntries(Object.keys(tailModes).map(k=>[k,{history:[],guess:null,checked:false}])),answer:null};}
export function tailStep(q,action){const t=q.trials[q.selected];tailExecute(tailReplay(q.selected,t.history),action);t.history.push(action);t.checked=false;}
export function tailCheck(q){const t=q.trials[q.selected],r=tailReplay(q.selected,t.history);if(r.result!==6||t.guess!==r.peak)return false;t.checked=true;return true;}
export function tailComplete(q){return Object.values(q.trials).every(t=>t.checked)&&q.answer==='pending';}
export function tailRestore(q){if(!q||!Object.hasOwn(tailModes,q.selected)||!q.trials||![null,'pending','always','never'].includes(q.answer))throw new RangeError('記録が不正です');const out=tailCreate();out.selected=q.selected;out.answer=q.answer;for(const id of Object.keys(tailModes)){const t=q.trials[id];if(!t||![null,1,3,4].includes(t.guess)||typeof t.checked!=='boolean')throw new RangeError('記録が不正です');const r=tailReplay(id,t.history);if(t.checked&&(r.result!==6||t.guess!==r.peak))throw new RangeError('確認が不正です');out.trials[id]={history:[...t.history],guess:t.guess,checked:t.checked};}return out;}
