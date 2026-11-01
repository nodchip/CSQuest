export const recommendationLevel={id:'village-recommendation',number:'619',kind:'recommendation',name:'似た旅人の道具選び',tag:'協調フィルタリング',title:'似た旅人から道具を薦めよう',story:'薬師の村に、まだ試していない道具について助言してほしい旅人が訪れました。'};
export const recommendationCases={sun:{name:'陽の旅人',ratings:[5,1]},moon:{name:'月の旅人',ratings:[1,5]},newcomer:{name:'初めての旅人',ratings:[null,null]}};
export const recommendationPeople={aki:{name:'アキ',ratings:[5,1,5]},bela:{name:'ベラ',ratings:[1,5,1]},chika:{name:'チカ',ratings:[4,2,4]},dora:{name:'ドラ',ratings:[5,null,5]}};
export function recommendationDistances(id){
 const target=recommendationCases[id];if(!target)throw new RangeError('旅人が不正です。');
 return Object.entries(recommendationPeople).map(([key,person])=>{const diffs=target.ratings.flatMap((rating,i)=>rating!==null&&person.ratings[i]!==null?[Math.abs(rating-person.ratings[i])]:[]);return {key,overlap:diffs.length,distance:diffs.length===2?diffs.reduce((a,b)=>a+b,0)/diffs.length:null};});
}
export function recommend(id){const sorted=recommendationDistances(id).filter(x=>x.distance!==null).sort((a,b)=>a.distance-b.distance||a.key.localeCompare(b.key));if(sorted.length<2)return null;const neighbors=sorted.slice(0,2).map(x=>x.key);return {neighbors,prediction:neighbors.reduce((sum,k)=>sum+recommendationPeople[k].ratings[2],0)/2};}
export function createRecommendation(){return {selected:'sun',choices:{sun:[],moon:[],newcomer:[]},done:[],answer:null,checked:false};}
export function recommendationComplete(s){return Object.keys(recommendationCases).every(k=>s.done.includes(k))&&s.answer==='limits'&&s.checked;}
export function restoreRecommendation(s){
 if(!s||!Object.hasOwn(recommendationCases,s.selected)||!s.choices||!Array.isArray(s.done)||new Set(s.done).size!==s.done.length||s.done.some(k=>!Object.hasOwn(recommendationCases,k))||![null,'limits','missing','certain'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const r=createRecommendation();r.selected=s.selected;r.done=[...s.done];r.answer=s.answer;r.checked=s.checked;
 for(const id of Object.keys(recommendationCases)){const c=s.choices[id];if(!Array.isArray(c)||c.length>2||new Set(c).size!==c.length||c.some(k=>!Object.hasOwn(recommendationPeople,k)))throw new RangeError('途中記録が不正です。');r.choices[id]=[...c];const result=recommend(id);if(r.done.includes(id)&&(result?result.neighbors.some(k=>!c.includes(k))||c.length!==2:c.length!==0))throw new RangeError('途中記録が不正です。');}
 return r;
}
