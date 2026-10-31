export const pruningLevel={id:'guardian-pruning',number:'97',kind:'pruning',name:'守護者の隠された扉',tag:'アルファ・ベータ枝刈り',title:'調べずに道を選ぶ',story:'前の読み合いと同じく、あなたは宝石を多く、守護者は少なくしようとします。すべての扉を開けずに最善の道を選べるでしょうか。'};
export const pruningCases={early:{name:'小さい数を先に調べる',left:[3,5],right:[2,9]},late:{name:'大きい数を先に調べる',left:[3,5],right:[9,2]}};
export function createPruningTrial(id){if(!Object.hasOwn(pruningCases,id))throw new RangeError('未知の試練です。');return {id,revealed:0,pruned:false,done:false,history:[],message:'東の道から順番に調べます。'};}
export function canPrune(state){const c=pruningCases[state.id];return state.revealed===3&&c.right[0]<=Math.min(...c.left);}
export function pruningStep(state,action){
  if(state.done||!['reveal','prune'].includes(action))throw new RangeError('選択できません。');
  if(action==='prune'&&!canPrune(state))return {...state,message:'まだ比べる材料が足りないか、残りの扉によって選ぶ道が変わる可能性があります。'};
  if(action==='prune')return {...state,pruned:true,done:true,history:[...state.history,action],message:'残りの扉を開かなくても東が選べます。'};
  const revealed=state.revealed+1,done=revealed===4;
  return {...state,revealed,done,history:[...state.history,action],message:done?'すべての扉を調べました。':'次に進むか、残りを省けるか考えましょう。'};
}
export function createPruning(){return {selected:'early',states:Object.fromEntries(Object.keys(pruningCases).map(id=>[id,createPruningTrial(id)]))};}
export function restorePruning(saved){if(!saved||!Object.hasOwn(pruningCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createPruning();result.selected=saved.selected;for(const id of Object.keys(pruningCases)){const actions=saved.history[id];if(!Array.isArray(actions)||actions.length>4)throw new RangeError('途中記録が不正です。');for(const action of actions){const before=result.states[id],next=pruningStep(before,action);if(next.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');result.states[id]=next;}}return result;}
export function pruningComplete(state){return state.states.early.done&&state.states.early.pruned&&state.states.late.done&&!state.states.late.pruned;}
