export const computationModelsLevel={id:'archive-computation-models',number:'646',kind:'computation-models',name:'二つの計算の道',tag:'計算モデルと Church–Turing のテーゼ',title:'同じ数を別の道で届けよう',story:'書庫には、印の帯と二つの数え箱を使う別々の機械があります。どちらも受け取った数に１を足して届けられるか試しましょう。'};
export const modelModes=['tape','counter'];
export const modelInputs=[0,1,2,3,4];
export const modelRequired=modelModes.flatMap(m=>[0,2,4].map(n=>`${m},${n}`));
export const modelActions={right:'帯の印を読み右へ進む',write:'空欄に印を書いて止まる',test:'箱 A を調べる',transfer:'箱 B に印を移す',finish:'箱 B に１を加えて止まる'};
export function modelTrace(mode,n,steps){
 if(!modelModes.includes(mode)||!modelInputs.includes(n)||!Number.isInteger(steps)||steps<0||steps>(mode==='tape'?n+1:2*n+2))throw new RangeError('機械の設定が不正です。');
 let head=0,marks=n,a=n,b=0,phase='test',halt=false,last=null;
 for(let i=0;i<steps;i++){
  if(mode==='tape'){if(head<marks){head++;last='right';}else{marks++;halt=true;last='write';}}
  else if(phase==='test'){if(a>0){a--;phase='transfer';}else phase='finish';last='test';}
  else if(phase==='transfer'){b++;phase='test';last='transfer';}
  else {b++;phase='halt';halt=true;last='finish';}
 }
 const next=halt?null:mode==='tape'?(head<marks?'right':'write'):phase;
 return {mode,n,steps,head,marks,a,b,phase,halt,last,next,result:halt?(mode==='tape'?marks:b):null};
}
export function createComputationModels(){return {mode:'tape',n:0,steps:0,observed:[],thesis:null,evidence:null,checked:false};}
export function computationModelsComplete(s){return modelRequired.every(k=>s.observed.includes(k))&&s.thesis==='effective'&&s.evidence==='illustration'&&s.checked;}
export function restoreComputationModels(s){
 const valid=new Set(modelModes.flatMap(m=>modelInputs.map(n=>`${m},${n}`)));
 if(!s||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'effective','speed','physical'].includes(s.thesis)||![null,'illustration','proof','different'].includes(s.evidence)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');modelTrace(s.mode,s.n,s.steps);return {...s,observed:[...s.observed]};
}
