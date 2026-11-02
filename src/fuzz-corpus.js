export const corpusLevel={id:'workshop-fuzz-corpus',number:'978',kind:'fuzz-corpus',name:'試験の種を育てる',tag:'カバレッジ誘導ファジング',title:'新しい道を種に残そう',story:'精霊の工房で鍵を自動的に変える仕組みを考えます。通った道の違いを使って、次の試験の種を育てましょう。'};
export function corpusPath(value){if(!Number.isInteger(value)||value<0||value>7)throw new RangeError('鍵が不正です');return value<4?'low':value<6?'middle':value===6?'deep':'crash';}
export function corpusReplay(history){
 if(!Array.isArray(history)||history.length>32)throw new RangeError('履歴が不正です');
 const state={seeds:[0],paths:['low'],events:[],repeated:false,crash:false};
 for(const action of history){
  if(!Array.isArray(action)||action.length!==2)throw new RangeError('履歴が不正です');
  const [seed,bit]=action;if(!state.seeds.includes(seed)||![0,1,2].includes(bit))throw new RangeError('履歴が不正です');
  const value=seed^(1<<bit),path=corpusPath(value),novel=!state.paths.includes(path);
  if(novel)state.paths.push(path);
  if(path==='crash')state.crash=true;
  else if(novel)state.seeds.push(value);
  else state.repeated=true;
  state.events.push({seed,bit,value,path,novel});
 }
 return state;
}
export function corpusCreate(){return {seed:0,bit:0,history:[],reflection:null};}
export function corpusRestore(saved){if(!saved||![0,1,2].includes(saved.bit)||![null,'limits','complete','random'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const state=corpusReplay(saved.history);if(!state.seeds.includes(saved.seed))throw new RangeError('途中記録が不正です');return {seed:saved.seed,bit:saved.bit,history:saved.history.map(a=>[...a]),reflection:saved.reflection};}
export function corpusComplete(q){const s=corpusReplay(q.history);return s.repeated&&s.crash&&q.reflection==='limits';}
