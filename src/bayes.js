export const bayesLevel={id:'rain-observations',number:'81',kind:'bayes',name:'雨の兆しと二つの観測',tag:'確率と観測による推論',title:'雨の手がかりを比べよう',story:'山道の番人は、雨と石の濡れ具合、鐘の音の記録を持っています。観測と一致する記録から、雨の可能性を調べましょう。'};
// A Bayesian network R -> W and R -> B, represented as an exact 100-case joint distribution.
export const records=[
  {rain:true,wet:true,bell:true,count:12},{rain:true,wet:true,bell:false,count:4},
  {rain:true,wet:false,bell:true,count:3},{rain:true,wet:false,bell:false,count:1},
  {rain:false,wet:true,bell:true,count:2},{rain:false,wet:true,bell:false,count:6},
  {rain:false,wet:false,bell:true,count:18},{rain:false,wet:false,bell:false,count:54}
];
export const bayesCases={wet:{name:'濡れた石',prompt:'石が濡れている記録のうち、雨だった割合',evidence:{wet:true},target:{rain:true}},both:{name:'石と鐘',prompt:'石が濡れ、鐘も鳴った記録のうち、雨だった割合',evidence:{wet:true,bell:true},target:{rain:true}},rainWet:{name:'雨の中の鐘',prompt:'雨で石が濡れている記録のうち、鐘が鳴った割合',evidence:{rain:true,wet:true},target:{bell:true}}};
function matches(row,conditions){return Object.entries(conditions).every(([key,value])=>row[key]===value);}
export function bayesExpected(id){
  if(!Object.hasOwn(bayesCases,id))throw new RangeError('未知の観測です。');
  const {evidence,target}=bayesCases[id],denominator=records.flatMap((r,i)=>matches(r,evidence)?[i]:[]),numerator=denominator.filter(i=>matches(records[i],target));
  return {denominator,numerator};
}
export function bayesCounts(selection){return {denominator:selection.denominator.reduce((sum,i)=>sum+records[i].count,0),numerator:selection.numerator.reduce((sum,i)=>sum+records[i].count,0)};}
export function bayesCorrect(id,selection){const expected=bayesExpected(id);return ['denominator','numerator'].every(key=>expected[key].length===selection[key].length&&expected[key].every(i=>selection[key].includes(i)));}
export function createBayes(){return {selected:'wet',choices:Object.fromEntries(Object.keys(bayesCases).map(id=>[id,{denominator:[],numerator:[],checked:false}]))};}
export function restoreBayes(saved){
  if(!saved||!Object.hasOwn(bayesCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const result=createBayes();result.selected=saved.selected;
  for(const id of Object.keys(bayesCases)){const c=saved.choices[id];if(!c||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');for(const key of ['denominator','numerator'])if(!Array.isArray(c[key])||c[key].some(i=>!Number.isInteger(i)||i<0||i>=records.length)||new Set(c[key]).size!==c[key].length)throw new RangeError('途中記録が不正です。');result.choices[id]={denominator:c.denominator.slice(),numerator:c.numerator.slice(),checked:c.checked};}return result;
}
export function bayesComplete(set){return Object.keys(bayesCases).every(id=>set.choices[id].checked&&bayesCorrect(id,set.choices[id]));}
