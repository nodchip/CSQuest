export const objectsLevel={id:'lantern-spirits',number:'65',kind:'objects',name:'灯りの精霊と共通の合図',tag:'オブジェクトと動的ディスパッチ',title:'三人の精霊に合図しよう',story:'工房には同じ合図を受け取る灯りの精霊がいます。種類による光の違いと、一人ずつの力を確かめましょう。'};
export const spiritTypes={ember:{name:'火の精霊',color:'red'},moon:{name:'月の精霊',color:'blue'}};
export const spiritNames={a:'火の精霊Ａ',b:'火の精霊Ｂ',c:'月の精霊Ｃ'};
export const spiritAnswers={red:'赤く光る',blue:'青く光る',empty:'力がなく光らない',one:'力が１になる'};
export const objectCases={dispatch:{name:'同じ合図と異なる種類',initial:{a:{type:'ember',charge:1},b:{type:'ember',charge:0},c:{type:'moon',charge:1}},steps:[{target:'a',method:'shine'},{target:'c',method:'shine'}]},state:{name:'同じ種類と別々の力',initial:{a:{type:'ember',charge:0},b:{type:'ember',charge:0},c:{type:'moon',charge:0}},steps:[{target:'a',method:'recharge'},{target:'b',method:'shine'},{target:'a',method:'shine'}]}};
export function spiritMethod(objects,target,method){
  if(!Object.hasOwn(objects,target)||!['shine','recharge'].includes(method))throw new RangeError('操作できません。');const spirit=objects[target];
  if(!Object.hasOwn(spiritTypes,spirit.type)||!Number.isInteger(spirit.charge)||spirit.charge<0||spirit.charge>2)throw new RangeError('精霊の状態が不正です。');
  const copy={...objects,[target]:{...spirit}};let result;
  if(method==='recharge'){copy[target].charge=Math.min(2,spirit.charge+1);result=copy[target].charge===1?'one':'full';}
  else if(spirit.charge===0)result='empty';else {copy[target].charge--;result=spiritTypes[spirit.type].color;}
  return {objects:copy,result};
}
export function createObjects(id){if(!Object.hasOwn(objectCases,id))throw new RangeError('未知の試練です。');return {id,index:0,objects:Object.fromEntries(Object.entries(objectCases[id].initial).map(([key,value])=>[key,{...value}])),history:[],message:'次の合図の結果を予測しましょう。'};}
export function objectsStep(state,answer){
  if(!Object.hasOwn(spiritAnswers,answer)||state.index>=objectCases[state.id].steps.length)throw new RangeError('操作できません。');
  const step=objectCases[state.id].steps[state.index],next=spiritMethod(state.objects,step.target,step.method);
  if(answer!==next.result)return {...state,message:step.method==='recharge'?'力を一つ増やす共通の合図です。対象の現在の力を確かめましょう。':state.objects[step.target].charge===0?'対象の精霊には、今は光るための力がありません。':'対象の精霊の種類を確かめましょう。'};
  return {...state,index:state.index+1,objects:next.objects,history:[...state.history,answer],message:`${spiritNames[step.target]}：${spiritAnswers[answer]}。`};
}
export function createObjectsSet(){return {selected:'dispatch',states:{dispatch:createObjects('dispatch'),state:createObjects('state')}};}
export function restoreObjects(saved){
  if(!saved||!Object.hasOwn(objectCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createObjectsSet();result.selected=saved.selected;
  for(const id of Object.keys(objectCases)){const history=saved.history[id];if(!Array.isArray(history)||history.length>objectCases[id].steps.length)throw new RangeError('途中記録が不正です。');let state=createObjects(id);for(const answer of history){const next=objectsStep(state,answer);if(next.history.length!==state.history.length+1)throw new RangeError('途中記録が不正です。');state=next;}result.states[id]=state;}return result;
}
export function objectsComplete(value){return Object.keys(objectCases).every(id=>value.states[id].index===objectCases[id].steps.length);}
