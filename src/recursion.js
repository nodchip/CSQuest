export const recursionLevel={id:'rune-arrangements',number:'33',kind:'recursion',name:'魔石の並べ方',tag:'再帰と呼び出し',title:'小さな問題へ降りる塔',story:'魔法の扉を開くには、異なる魔石を一列に並べる方法を数える必要があります。小さな問題を精霊に頼み、その答えを受け取りましょう。'};
export const recursionCases={three:{name:'３つの魔石',n:3},four:{name:'４つの魔石',n:4}};
export function createRecursion(id){if(!Object.hasOwn(recursionCases,id))throw new RangeError('未知の依頼です。');return {id,stack:[{n:recursionCases[id].n,child:null}],result:null,status:'playing',log:[],message:'一番上の問題から考えましょう。'};}
export function stepRecursion(state,action){
  if(!['call','base','return'].includes(action)||state.status!=='playing')throw new RangeError('操作できません。');
  const frame=state.stack.at(-1),stack=state.stack.map(item=>({...item}));let result=null,status='playing',message;
  if(action==='call'){
    if(frame.n===0)return {...state,message:'魔石が０個なら、これ以上小さな問題にはせず、その答えを返しましょう。'};
    if(frame.child!==null)return {...state,message:'小さな問題の答えは届いています。元の問題の答えを返しましょう。'};
    stack.push({n:frame.n-1,child:null});message=`${frame.n} 個の問題から、${frame.n-1} 個の問題を呼び出しました。`;
  }else {
    if(action==='base'&&frame.n!==0)return {...state,message:'魔石が残っています。まず１個少ない問題を呼び出しましょう。'};
    if(action==='return'&&(frame.n===0||frame.child===null))return {...state,message:frame.n===0?'０個の問題は決まった答えを返します。':'小さな問題の答えを受け取ってから戻りましょう。'};
    result=action==='base'?1:frame.n*frame.child;stack.pop();
    message=action==='base'?'０個を並べる方法は１通り。答え 1 を返しました。':`${frame.n} 個の答えは ${frame.n} × ${frame.child} で ${result} 通り。答えを返しました。`;
    if(stack.length){stack.at(-1).child=result;result=null;}else status='done';
  }
  return {id:state.id,stack,result,status,log:[...state.log,message],message};
}
export function restoreRecursion(saved){
  if(!saved||!Object.hasOwn(recursionCases,saved.selected)||!saved.actions)throw new RangeError('途中記録が不正です。');
  const states={},actions={};
  for(const [id,scenario] of Object.entries(recursionCases)){
    const list=saved.actions[id];if(!Array.isArray(list)||list.length>scenario.n*2+1||list.some(x=>typeof x!=='string'))throw new RangeError('途中記録が不正です。');
    let state=createRecursion(id);for(const action of list){const next=stepRecursion(state,action);if(next.log.length!==state.log.length+1)throw new RangeError('途中記録が不正です。');state=next;}states[id]=state;actions[id]=list.slice();
  }
  return {selected:saved.selected,states,actions};
}
