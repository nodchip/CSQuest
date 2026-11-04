export const bitmapCases={and:'両方の語を含む',or:'どちらかの語を含む'};
export const bitmapGuesses=['1000','1100','1110'];
export function bitmapFromPostings(ids){
 if(!Array.isArray(ids)||ids.some(id=>!['a','b','c','d'].includes(id)))throw new RangeError('巻物が不正です。');
 return ['a','b','c','d'].map(id=>ids.includes(id)?1:0);
}
export function bitmapCombine(a,b,kind){
 if(!Object.hasOwn(bitmapCases,kind)||a.length!==4||b.length!==4||[...a,...b].some(x=>x!==0&&x!==1))throw new RangeError('ビット列が不正です。');
 return a.map((v,i)=>kind==='and'?(v&b[i]):(v|b[i]));
}
export function bitmapRuns(bits){
 if(!Array.isArray(bits)||bits.some(x=>x!==0&&x!==1))throw new RangeError('ビット列が不正です。');
 const runs=[];for(const bit of bits){const last=runs.at(-1);if(last&&last.bit===bit)last.count++;else runs.push({bit,count:1});}return runs;
}
export function createBitmapExercise(){return {selected:'and',answers:{and:{guess:null,checked:false},or:{guess:null,checked:false}}};}
export function restoreBitmapExercise(saved){
 if(saved===undefined)return createBitmapExercise();
 if(!saved||!Object.hasOwn(bitmapCases,saved.selected)||!saved.answers)throw new RangeError('索引の記録が不正です。');
 const s=createBitmapExercise();s.selected=saved.selected;
 for(const id of Object.keys(bitmapCases)){const a=saved.answers[id];if(!a||!(a.guess===null||bitmapGuesses.includes(a.guess))||typeof a.checked!=='boolean'||(a.checked&&!a.guess))throw new RangeError('索引の記録が不正です。');s.answers[id]={guess:a.guess,checked:a.checked};}
 return s;
}
