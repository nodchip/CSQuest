export const fibTablingLevel={id:'ruin-fib-tabling',number:'777',kind:'fib-tabling',name:'記憶の灯と再帰',tag:'再計算と結果の記録',title:'灯の数を記録して仕事を減らそう',story:'遺跡の灯は二つ前までの灯から生まれます。同じ問いを何度も計算する負担を調べましょう。'};
export const fibModes={plain:'毎回計算',memo:'結果を記録'};
export const fibActions={expand:'二つ前までの問いに分ける',right:'二つ目の問いへ進む',sum:'二つの答えを足して返す',base:'決まった答えを返す',reuse:'記録した答えを返す'};
export function fibInitial(mode){
 if(!Object.hasOwn(fibModes,mode))throw new RangeError('未知の方法です');
 return {mode,stack:[{n:5,phase:'enter'}],cache:{},calls:1,computations:0,hits:0,result:null};
}
export function fibExpected(s){
 const f=s.stack.at(-1); if(!f)return null;
 if(f.phase==='enter')return s.mode==='memo'&&Object.hasOwn(s.cache,f.n)?'reuse':f.n<2?'base':'expand';
 if(f.phase==='right')return 'right'; if(f.phase==='sum')return 'sum';
 throw new RangeError('不正な計算状態です');
}
export function fibExecute(s,action){
 if(action!==fibExpected(s)||!action)throw new RangeError('その操作はできません');
 const f=s.stack.at(-1);
 const send=value=>{s.stack.pop();if(s.stack.length===0){s.result=value;return;}const p=s.stack.at(-1);if(p.phase==='left-wait'){p.left=value;p.phase='right';}else if(p.phase==='right-wait'){p.right=value;p.phase='sum';}else throw new RangeError('不正な戻り先です');};
 const store=value=>{if(s.mode==='memo')s.cache[f.n]=value;send(value);};
 if(action==='expand'){s.computations++;f.phase='left-wait';s.stack.push({n:f.n-1,phase:'enter'});s.calls++;}
 if(action==='right'){f.phase='right-wait';s.stack.push({n:f.n-2,phase:'enter'});s.calls++;}
 if(action==='base'){s.computations++;store(f.n);}
 if(action==='sum')store(f.left+f.right);
 if(action==='reuse'){s.hits++;send(s.cache[f.n]);}
 return s;
}
export function fibReplay(mode,history){if(!Array.isArray(history)||history.length>40)throw new RangeError('操作記録が不正です');const s=fibInitial(mode);for(const a of history)fibExecute(s,a);return s;}
export function fibCreate(){return {selected:'plain',trials:{plain:{history:[],guess:null,checked:false},memo:{history:[],guess:null,checked:false}},answer:null};}
export function fibStep(q,action){const t=q.trials[q.selected];fibExecute(fibReplay(q.selected,t.history),action);t.history.push(action);t.checked=false;}
export function fibCheck(q){const t=q.trials[q.selected],r=fibReplay(q.selected,t.history);if(r.result===null||t.guess!==r.computations)return false;t.checked=true;return true;}
export function fibComplete(q){return Object.values(q.trials).every(t=>t.checked)&&q.answer==='reuse';}
export function fibRestore(q){
 if(!q||!Object.hasOwn(fibModes,q.selected)||!q.trials||![null,'reuse','different','more'].includes(q.answer))throw new RangeError('途中記録が不正です');
 const out=fibCreate();out.selected=q.selected;out.answer=q.answer;
 for(const mode of Object.keys(fibModes)){const t=q.trials[mode];if(!t||![null,6,9,15].includes(t.guess)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');const r=fibReplay(mode,t.history);if(t.checked&&(r.result===null||t.guess!==r.computations))throw new RangeError('不正な確認です');out.trials[mode]={history:[...t.history],guess:t.guess,checked:t.checked};}return out;
}
