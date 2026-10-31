export const webRequestLevel={id:'guild-web-requests',number:'62',kind:'webrequest',name:'届いた依頼と消えた返事',tag:'Web API と再送',title:'依頼が二つになった？',story:'冒険者が遠くからギルドへ依頼を送りました。ギルドでは受け付けましたが、返事が嵐で届きません。'};
export const requestModes={plain:{name:'識別番号なし',expected:2},keyed:{name:'同じ識別番号を使う',expected:1}};
export function createWebRequest(id){if(!Object.hasOwn(requestModes,id))throw new RangeError('未知の試練です。');return {id,phase:'ready',count:0,prediction:null,history:[],message:'依頼を送ると、ギルドは受け付けますが返事が失われます。'};}
export function webRequestStep(state,action){
  if(!['send','one','two','retry'].includes(action)||state.phase==='done')throw new RangeError('操作できません。');
  if(state.phase==='ready'&&action==='send')return {...state,phase:'lost',count:1,history:[...state.history,action],message:'ギルドは依頼を１件登録しましたが、返事は冒険者に届きません。'};
  if(state.phase==='lost'&&['one','two'].includes(action)){
    const guess=action==='one'?1:2;if(guess!==requestModes[state.id].expected)return {...state,message:state.id==='plain'?'同じ依頼かを識別しない受付では、再送を新しい依頼として扱います。':'この受付では、同じ識別番号の再送には前の受付結果を返します。'};
    return {...state,phase:'predicted',prediction:guess,history:[...state.history,action],message:'予測しました。同じ依頼を再送して結果を確かめましょう。'};
  }
  if(state.phase==='predicted'&&action==='retry'){const count=requestModes[state.id].expected;return {...state,phase:'done',count,history:[...state.history,action],message:count===1?'前の受付結果が返り、依頼は１件のままです。':'再送が別の受付になり、依頼は２件になりました。'};}
  return {...state,message:state.phase==='ready'?'最初に依頼を送りましょう。':state.phase==='lost'?'再送後に何件になるか予測しましょう。':'同じ依頼を再送しましょう。'};
}
export function createWebRequestSet(){return {selected:'plain',states:{plain:createWebRequest('plain'),keyed:createWebRequest('keyed')}};}
export function restoreWebRequest(saved){
  if(!saved||!Object.hasOwn(requestModes,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createWebRequestSet();result.selected=saved.selected;
  for(const id of Object.keys(requestModes)){const history=saved.history[id];if(!Array.isArray(history)||history.length>3)throw new RangeError('途中記録が不正です。');let state=createWebRequest(id);for(const action of history){const next=webRequestStep(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function webRequestComplete(state){return Object.values(state.states).every(s=>s.phase==='done');}
