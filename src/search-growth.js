export const growthLevel={id:'archive-search-growth',number:'88',kind:'growth',name:'増え続ける書庫の本',tag:'探索の計算量',title:'本が増えると探し方は？',story:'鑑定士の書庫が広がっています。並んだ本を順に探す方法と半分に絞る方法で、調べる回数を比べましょう。'};
export const growthCases={small:{name:'８冊・存在しない番号',size:8,target:17},large:{name:'64冊・存在しない番号',size:64,target:129},first:{name:'64冊・最初の番号',size:64,target:2}};
export const growthOptions=[1,4,6,7,8,16,32,64];
export function searchTrace(size,target,method){
  if(!Number.isInteger(size)||size<1||size>64||!Number.isInteger(target)||target<0||target>2*size+1||!['linear','binary'].includes(method))throw new RangeError('探索の条件が不正です。');
  const visited=[];let found=false;
  if(method==='linear'){for(let i=0;i<size;i++){const value=2*(i+1);visited.push(value);if(value===target){found=true;break;}}}
  else {let lo=0,hi=size-1;while(lo<=hi){const middle=Math.floor((lo+hi)/2),value=2*(middle+1);visited.push(value);if(value===target){found=true;break;}if(value<target)lo=middle+1;else hi=middle-1;}}
  return {visited,found};
}
export function worstComparisons(size,method){return Math.max(...Array.from({length:2*size+2},(_,target)=>searchTrace(size,target,method).visited.length));}
export function growthCorrect(id,choice){if(!Object.hasOwn(growthCases,id))throw new RangeError('未知の試練です。');const c=growthCases[id];return ['linear','binary'].every(method=>choice[method]===searchTrace(c.size,c.target,method).visited.length);}
export function createGrowth(){return {selected:'small',choices:Object.fromEntries(Object.keys(growthCases).map(id=>[id,{linear:null,binary:null,checked:false}]))};}
export function restoreGrowth(saved){
  if(!saved||!Object.hasOwn(growthCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');const result=createGrowth();result.selected=saved.selected;
  for(const id of Object.keys(growthCases)){const c=saved.choices[id];if(!c||![null,...growthOptions].includes(c.linear)||![null,...growthOptions].includes(c.binary)||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.choices[id]={linear:c.linear,binary:c.binary,checked:c.checked};}return result;
}
export function growthComplete(state){return Object.keys(growthCases).every(id=>state.choices[id].checked&&growthCorrect(id,state.choices[id]));}
