export const fabricationLevel={id:'workshop-fabrication',number:'807',kind:'fabrication-workshop',name:'三つの製作台',tag:'積層・切削・成形',title:'薬瓶の道具を工房で作ろう',story:'薬師から、段差のある土台と薄い覆いの注文が届きました。素材を積む、削る、型に沿わせる三つの製作台を試しましょう。'};
export const fabricationCases={add:'材料を積む台',cut:'材料を削る台',form:'薄い板を成形する台'};
export const fabricationTarget=[2,3,1];
export function fabricationInitial(id){if(!Object.hasOwn(fabricationCases,id))throw new RangeError('製作台が不正です');return {id,heights:id==='add'?[0,0,0]:id==='cut'?[3,3,3]:null,stage:id==='form'?'cold':'working',done:false};}
export function fabricationExecute(s,action){
 if(s.done)throw new RangeError('この製作台は完成しています。');
 if(s.id==='form'){
  if(action==='heat'&&s.stage==='cold')s.stage='warm';
  else if(action==='shape'&&s.stage==='warm')s.stage='shaped';
  else if(action==='cool'&&s.stage==='shaped')s.stage='cooled';
  else if(action==='check'&&s.stage==='cooled')s.done=true;
  else throw new RangeError('板を温め、型に沿わせ、冷ましてから確かめましょう。');
 }else if(action==='check'){
  if(!s.heights.every((n,i)=>n===fabricationTarget[i]))throw new RangeError('三列の高さを設計図と比べましょう。作り直すこともできます。');s.done=true;
 }else{
  if(!/^column:[0-2]$/.test(action))throw new RangeError('この台で使う操作を選びましょう。');
  const i=Number(action.slice(-1)),next=s.heights[i]+(s.id==='add'?1:-1);
  if(next<0||next>3)throw new RangeError('この模型の高さは０から３までです。');s.heights[i]=next;
 }
 return s;
}
export function fabricationReplay(id,history){if(!Array.isArray(history)||history.length>30)throw new RangeError('記録が不正です');const s=fabricationInitial(id);for(const a of history){if(typeof a!=='string')throw new RangeError('記録が不正です');fabricationExecute(s,a);}return s;}
export function fabricationCreate(){return {selected:'add',trials:{add:[],cut:[],form:[]},answer:null};}
export function fabricationStep(q,action){const h=q.trials[q.selected];if(h.length>=30)throw new RangeError('操作は30回までです。最初からやり直せます。');fabricationExecute(fabricationReplay(q.selected,h),action);h.push(action);}
export function fabricationComplete(q){return Object.keys(fabricationCases).every(id=>fabricationReplay(id,q.trials[id]).done)&&q.answer==='mechanism';}
export function fabricationRestore(q){if(!q||!Object.hasOwn(fabricationCases,q.selected)||!q.trials||![null,'mechanism','same','always'].includes(q.answer))throw new RangeError('記録が不正です');const n=fabricationCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(fabricationCases)){fabricationReplay(id,q.trials[id]);n.trials[id]=[...q.trials[id]];}return n;}
