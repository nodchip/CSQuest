export const roundingLevel={id:'rounding-crystals',number:'68',kind:'rounding',name:'小さな魔石の丸め',tag:'浮動小数点と精度',title:'魔石を足す順番',story:'魔石の秤は限られた精度でしか数を記録できません。小さな力を足す順番で、記録される値はどう変わるでしょう。'};
export const roundingCases={even:{name:'偶数側の境界',a:1,b:0.0625},odd:{name:'奇数側の境界',a:1.125,b:0.0625},left:{name:'左から足す',a:1,b:0.0625,then:0.0625},right:{name:'小さいものを先に足す',a:0.0625,b:0.0625,then:1}};
export const roundingOptions=[0.0625,0.125,1,1.125,1.25];
// Non-negative toy binary format: 3 fraction bits, normal exponents -4..2,
// plus zero and subnormals at exponent -4. No infinity, NaN or overflow behavior.
export const roundingValues=[...Array.from({length:8},(_,m)=>({value:m/128,even:m%2===0})),...Array.from({length:7},(_,i)=>i-4).flatMap(e=>Array.from({length:8},(_,i)=>({value:(8+i)*2**e/8,even:(8+i)%2===0})))];
export function roundSmall(value){
  if(!Number.isFinite(value)||value<0||value>roundingValues.at(-1).value)throw new RangeError('表せる範囲外です。');
  const upperIndex=roundingValues.findIndex(item=>item.value>=value),upper=roundingValues[upperIndex];
  if(upper.value===value)return {value,lower:value,upper:value,tie:false};
  const lower=roundingValues[upperIndex-1],down=value-lower.value,up=upper.value-value,tie=down===up;
  return {value:down<up?lower.value:up<down?upper.value:lower.even?lower.value:upper.value,lower:lower.value,upper:upper.value,tie};
}
export function calculateRounding(id){
  if(!Object.hasOwn(roundingCases,id))throw new RangeError('未知の試練です。');const task=roundingCases[id],first=roundSmall(task.a+task.b),second=task.then===undefined?null:roundSmall(first.value+task.then);return {first,second};
}
export function createRounding(){return {selected:'even',choices:Object.fromEntries(Object.keys(roundingCases).map(id=>[id,{first:null,second:null,checked:false}]))};}
export function roundingCorrect(id,choice){const r=calculateRounding(id);return choice.first===r.first.value&&(r.second===null||choice.second===r.second.value);}
export function restoreRounding(saved){
  if(!saved||!Object.hasOwn(roundingCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');const s=createRounding();s.selected=saved.selected;
  for(const id of Object.keys(roundingCases)){const c=saved.choices[id];if(!c||![null,...roundingOptions].includes(c.first)||![null,...roundingOptions].includes(c.second)||typeof c.checked!=='boolean'||(roundingCases[id].then===undefined&&c.second!==null))throw new RangeError('途中記録が不正です。');s.choices[id]={first:c.first,second:c.second,checked:c.checked};}return s;
}
export function roundingComplete(s){return Object.keys(roundingCases).every(id=>s.choices[id].checked&&roundingCorrect(id,s.choices[id]));}
