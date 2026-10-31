export const bstLevel={id:'tree-archive',number:'57',kind:'bst',name:'枝分かれする書庫',tag:'二分探索木',title:'魔導書の木を育てよう',story:'書庫の精霊は魔導書を枝分かれする棚に収めています。同じ本でも並べる順番を変えると、探しやすさはどう変わるでしょう。'};
export const bstCases={branch:{name:'枝分かれした木',keys:[3,1,4,2,5]},chain:{name:'一方向に伸びる木',keys:[1,2,3,4,5]}};
export const bstTarget=5;
export function createBst(id){if(!Object.hasOwn(bstCases,id))throw new RangeError('未知の木です。');const root=bstCases[id].keys[0];return {id,root,nodes:{[root]:{left:null,right:null}},index:1,current:root,phase:'insert',visits:[],history:[],message:`最初の本 ${root} を根に置きました。次の本を収めましょう。`};}
export function bstStep(state,side){
  if(state.phase==='done'||!['left','right'].includes(side))throw new RangeError('操作できません。');
  const keys=bstCases[state.id].keys,target=state.phase==='insert'?keys[state.index]:bstTarget,expected=target<state.current?'left':'right';
  if(side!==expected)return {...state,message:`${target} は ${state.current} より${target<state.current?'小さい':'大きい'}ので、${expected==='left'?'左':'右'}へ進みます。`};
  const child=state.nodes[state.current][side],history=[...state.history,side];
  if(state.phase==='search'){
    if(child===null)throw new RangeError('探索する本がありません。');
    const visits=[...state.visits,child],done=child===target;return {...state,current:child,visits,history,phase:done?'done':'search',message:done?`${target} の本が見つかりました。`:`${child} の本と比べましょう。`};
  }
  if(child!==null)return {...state,current:child,history,message:`${child} の本と比べましょう。`};
  const nodes={...state.nodes,[state.current]:{...state.nodes[state.current],[side]:target},[target]:{left:null,right:null}},index=state.index+1,finished=index===keys.length;
  return {...state,nodes,index,current:state.root,phase:finished?'search':'insert',visits:finished?[state.root]:[],history,message:finished?`すべて収めました。根 ${state.root} から ${bstTarget} の本を探しましょう。`:`${target} の本を収めました。次の本は ${keys[index]} です。`};
}
export function createBstSet(){return {selected:'branch',states:{branch:createBst('branch'),chain:createBst('chain')}};}
export function restoreBst(saved){
  if(!saved||!Object.hasOwn(bstCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');
  const result=createBstSet();result.selected=saved.selected;
  for(const id of Object.keys(bstCases)){const history=saved.history[id];if(!Array.isArray(history)||history.length>20)throw new RangeError('途中記録が不正です。');let state=createBst(id);for(const side of history){const next=bstStep(state,side);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function bstComplete(value){return Object.values(value.states).every(state=>state.phase==='done');}
