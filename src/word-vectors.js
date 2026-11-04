export function frequencyVector(words){
 if(!Array.isArray(words))throw new RangeError('単語列が不正です。');
 return ['月草','解毒'].map(term=>words.filter(word=>word===term).length);
}
export function vectorSimilarity(vector,query){
 if(!Array.isArray(vector)||!Array.isArray(query)||vector.length!==2||query.length!==2||![...vector,...query].every(Number.isFinite))throw new RangeError('ベクトルが不正です。');
 const norm=Math.hypot(...vector)*Math.hypot(...query);
 return {distance:Math.hypot(vector[0]-query[0],vector[1]-query[1]),cosine:norm?(vector[0]*query[0]+vector[1]*query[1])/norm:null};
}
export function createWordVectorExercise(){return {nearest:null,zero:null,checked:false};}
export function restoreWordVectorExercise(saved){
 if(saved===undefined)return createWordVectorExercise();
 if(!saved||![null,'a','b','c'].includes(saved.nearest)||![null,'undefined','zero'].includes(saved.zero)||typeof saved.checked!=='boolean'||(saved.checked&&(!saved.nearest||!saved.zero)))throw new RangeError('ベクトルの記録が不正です。');
 return {nearest:saved.nearest,zero:saved.zero,checked:saved.checked};
}
