export const electionLevel={id:'forge-election-overlap',number:'983',kind:'election-overlap',name:'三人の投票と二人の候補',tag:'多数派・選挙の安全性',title:'同じ選挙で代表は何人？',story:'三人の見張りが二人の代表候補を選びます。多数の票が重なるとき、同じ見張りの投票がどう影響するか調べましょう。'};
export const electionModes={once:'一人一候補',multiple:'両候補に投票可能',durable:'再起動・票を保持',volatile:'再起動・票を忘れる'};
export const electionVoters=['A','B','C'];
const restartMode=mode=>mode==='durable'||mode==='volatile';
const expectedPrediction=mode=>mode==='multiple'||mode==='volatile'?'many':'one';
export function electionReplay(mode,history){
 if(!Object.hasOwn(electionModes,mode)||!Array.isArray(history)||history.length>(restartMode(mode)?7:6))throw new RangeError('選挙の記録が不正です');
 const s={first:[],secondRequests:[],secondVotes:[],prediction:null,restarted:null};
 for(const a of history){
  if(typeof a!=='string')throw new RangeError('操作が不正です');
  if(/^first:[ABC]$/.test(a)&&s.first.length<2&&!s.prediction){const node=a.slice(6);if(s.first.includes(node))throw new RangeError('重複した依頼です');s.first.push(node);}
  else if(/^restart:[ABC]$/.test(a)&&restartMode(mode)&&s.first.length===2&&!s.prediction&&!s.restarted&&s.first.includes(a.slice(8)))s.restarted=a.slice(8);
  else if(['predict:one','predict:many'].includes(a)&&s.first.length===2&&(!restartMode(mode)||s.restarted)&&!s.prediction&&a===`predict:${expectedPrediction(mode)}`)s.prediction=a.slice(8);
  else if(/^second:[ABC]$/.test(a)&&s.prediction&&s.secondRequests.length<3){const node=a.slice(7);if(s.secondRequests.includes(node))throw new RangeError('重複した依頼です');s.secondRequests.push(node);if(mode==='multiple'||!s.first.includes(node)||(mode==='volatile'&&s.restarted===node))s.secondVotes.push(node);}
  else throw new RangeError('選挙の順序が不正です');
 }
 return {...s,done:s.secondRequests.length===3};
}
export function electionStep(mode,history,action){
 const s=electionReplay(mode,history);if(typeof action!=='string')return {ok:false,message:'操作を確認しましょう。'};
 if(action.startsWith('predict:')&&s.first.length===2&&!s.prediction&&!['predict:one','predict:many'].includes(action))return {ok:false,message:'予測を選びましょう。'};
 if(action.startsWith('predict:')&&s.first.length===2&&!s.prediction&&action!==`predict:${expectedPrediction(mode)}`)return {ok:false,message:'最初の票と、再起動後も投票先を覚えているかを考えましょう。'};
 try{const next=electionReplay(mode,[...history,action]);const last=action.startsWith('second:')?action.slice(7):null;return {ok:true,history:[...history,action],message:last?`${last} は${next.secondVotes.includes(last)?'票を出しました':'既に票を出したため断りました'}。`:action.startsWith('restart:')?`${next.restarted} が再起動しました。${mode==='volatile'?'投票先を忘れました。':'保存した投票先を読み戻しました。'}`:action.startsWith('predict:')?'予測しました。全員に依頼して確かめましょう。':'最初の候補に票が入りました。'};}catch{return {ok:false,message:'選挙の順番と、既に依頼した見張りを確認しましょう。'};}
}
export function electionCreate(){return {selected:'once',trials:Object.fromEntries(Object.keys(electionModes).map(id=>[id,[]])),reflection:null};}
export function electionComplete(q){return q.reflection==='scope'&&Object.keys(electionModes).every(id=>electionReplay(id,q.trials[id]).done);}
export function electionRestore(saved){if(!saved||!Object.hasOwn(electionModes,saved.selected)||![null,'scope','guarantee','disjoint'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const q=electionCreate();q.selected=saved.selected;q.reflection=saved.reflection;for(const id of Object.keys(electionModes)){if(restartMode(id)&&saved.trials&&!Object.hasOwn(saved.trials,id))continue;electionReplay(id,saved.trials?.[id]);q.trials[id]=[...saved.trials[id]];}return q;}
