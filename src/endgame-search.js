// A shelf of distinct, sorted record numbers; each comparison is one action.
export const shelf=[10,20,30,40,50,60,70];
export const searchCases=[
 {target:60,method:'linear'}, {target:60,method:'binary'},
 {target:25,method:'linear'}, {target:25,method:'binary'},
 {target:10,method:'linear'}, {target:10,method:'binary'}
];

// Replay, rather than trusting a saved range or a saved completion flag.
// When the range is empty, the explicit "missing" action finishes the case.
export function replaySearch(actions){
 if(!Array.isArray(actions))return null;
 let stage=0,low=0,high=shelf.length-1,comparisons=0;
 const counts=[];
 for(const action of actions){
  const current=searchCases[stage];
  if(!current)return null;
  if(low>high){
   if(action!=='missing')return null;
   counts.push(comparisons);stage++;low=0;high=shelf.length-1;comparisons=0;
   continue;
  }
  const expected=current.method==='linear'?low:Math.floor((low+high)/2);
  if(action!==expected)return null;
  comparisons++;
  if(shelf[action]===current.target){counts.push(comparisons);stage++;low=0;high=shelf.length-1;comparisons=0;}
  else if(current.method==='linear'||shelf[action]<current.target)low=action+1;
  else high=action-1;
 }
 return {stage,low,high,comparisons,counts,done:stage===searchCases.length};
}
