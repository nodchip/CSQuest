export const robotSensesLevel={id:'workshop-robot-senses',number:'931',kind:'robot-senses',name:'見えない宝物と人形の手',tag:'触覚と固有感覚',title:'位置と接触を確かめる',story:'箱の中を進む自動人形の手で、見えない宝物を探します。軸の位置と接触の観測を比べましょう。'};
export const robotSensesCases={a:{name:'箱 A',target:2,object:2},b:{name:'箱 B',target:2,object:4},c:{name:'箱 C',target:4,object:4},d:{name:'箱 D',target:4,object:null}};
export function robotSensesState(id,history){
 if(!Object.hasOwn(robotSensesCases,id)||!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です。');
 const c=robotSensesCases[id];let position=0,encoder=null,touch=null;const trace=[];
 for(const a of history){
  if(a==='move'&&position<c.target&&position!==c.object)position++;
  else if(a==='encoder'&&position===c.target&&encoder===null)encoder=position;
  else if(a==='touch'&&position===c.target&&touch===null)touch=position===c.object;
  else throw new RangeError('その操作はできません。');
  trace.push({action:a,position,encoder,touch});
 }
 return {position,encoder,touch,trace,done:encoder!==null&&touch!==null};
}
export function robotSensesCreate(){return {selected:'a',histories:{a:[],b:[],c:[],d:[]},reflection:null};}
export function robotSensesStep(q,a){if(!['move','encoder','touch'].includes(a))throw new RangeError('操作が不正です。');const h=q.histories[q.selected];try{robotSensesState(q.selected,[...h,a]);h.push(a);return true;}catch{return false;}}
export function robotSensesComplete(q){return Object.keys(robotSensesCases).every(id=>robotSensesState(id,q.histories[id]).done)&&q.reflection==='different';}
export function robotSensesRestore(q){if(!q||!Object.hasOwn(robotSensesCases,q.selected)||!q.histories||![null,'different','position','identity'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const id of Object.keys(robotSensesCases)){robotSensesState(id,q.histories[id]);histories[id]=[...q.histories[id]];}return {selected:q.selected,histories,reflection:q.reflection};}
