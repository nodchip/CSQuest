export const cards={n0:{type:'number',value:0},n1:{type:'number',value:1},n2:{type:'number',value:2},yes:{type:'boolean',value:true},no:{type:'boolean',value:false}};
export const typeCases={
 tools:[{kind:'add',target:3},{kind:'add',target:2},{kind:'gate',target:true},{kind:'gate',target:false}],
 record:[{kind:'record',target:{level:2,signal:true}},{kind:'record',target:{level:0,signal:false}}]
};
export function tryTypeCards(task,slots){
 if(!task||!Array.isArray(slots)||slots.length!==2)return {ok:false,reason:'札を確かめましょう。'};
 const a=cards[slots[0]],b=cards[slots[1]];
 if(!a||(task.kind!=='gate'&&!b))return {ok:false,reason:'必要な欄に札を入れましょう。'};
 if(task.kind==='add'){
  if(a.type!=='number'||b.type!=='number')return {ok:false,reason:'足す道具の二つの口には、どちらも数札が必要です。'};
  const value=a.value+b.value;return {ok:value===task.target,reason:`足した結果は数${value}です。目標の数を確かめましょう。`,value};
 }
 if(task.kind==='gate'){
  if(a.type!=='boolean')return {ok:false,reason:'門には「はい」か「いいえ」の真偽札が必要です。'};
  return {ok:a.value===task.target,reason:`門は${a.value?'開き':'閉じ'}ました。目標を確かめましょう。`,value:a.value};
 }
 if(task.kind==='record'){
  if(a.type!=='number'||b.type!=='boolean')return {ok:false,reason:'水位の欄は数札、合図の欄は真偽札です。'};
  return {ok:a.value===task.target.level&&b.value===task.target.signal,reason:'型は合っています。水位と合図の値も目標と比べましょう。',value:{level:a.value,signal:b.value}};
 }
 return {ok:false,reason:'道具を確かめましょう。'};
}
export function replayTypeCards(kind,history){
 const cases=typeCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,slots=[null,null],results=[];
 for(const action of history){
  const task=cases[scene];if(!task||typeof action!=='string')return null;
  if(action==='run'){const result=tryTypeCards(task,slots);if(!result.ok)return null;results.push({kind:task.kind,slots:[...slots],value:result.value});scene++;slots=[null,null];continue;}
  const match=/^put:([01]):(n0|n1|n2|yes|no)$/.exec(action);if(!match||task.kind==='gate'&&match[1]==='1')return null;slots[Number(match[1])]=match[2];
 }
 return {scene,slots,results,done:scene===cases.length};
}
// The miniature checks both branches before execution or just the selected one.
export function inspectBranch({condition,repaired,mode}){
 if(typeof condition!=='boolean'||typeof repaired!=='boolean'||!['static','dynamic'].includes(mode))return null;
 if(mode==='static')return repaired?'pass':'type-error';
 return condition||repaired?'3':'type-error';
}
export const branchCases=[
 {condition:true,repaired:false,mode:'static'},
 {condition:true,repaired:false,mode:'dynamic'},
 {condition:false,repaired:false,mode:'dynamic'},
 {condition:false,repaired:true,mode:'static'},
 {condition:false,repaired:true,mode:'dynamic'}
];
export function replayTypeBranch(history){
 if(!Array.isArray(history))return null;let scene=0,settings={condition:true,repaired:false,mode:'static'},results=[];
 for(const action of history){
  const task=branchCases[scene];if(!task||typeof action!=='string')return null;
  if(action==='run'){if(Object.keys(task).some(k=>task[k]!==settings[k]))return null;results.push({...settings,result:inspectBranch(settings)});scene++;settings={condition:true,repaired:false,mode:'static'};}
  else if(action==='condition:yes')settings.condition=true;
  else if(action==='condition:no')settings.condition=false;
  else if(action==='repair:yes')settings.repaired=true;
  else if(action==='repair:no')settings.repaired=false;
  else if(action==='mode:static')settings.mode='static';
  else if(action==='mode:dynamic')settings.mode='dynamic';
  else return null;
 }
 return {scene,settings,results,done:scene===branchCases.length};
}
