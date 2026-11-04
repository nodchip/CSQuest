export function frequencyVector(words){
 if(!Array.isArray(words))throw new RangeError('単語列が不正です。');
 return ['月草','解毒'].map(term=>words.filter(word=>word===term).length);
}
export function vectorSimilarity(vector,query){
 if(!Array.isArray(vector)||!Array.isArray(query)||vector.length!==2||query.length!==2||![...vector,...query].every(Number.isFinite))throw new RangeError('ベクトルが不正です。');
 const norm=Math.hypot(...vector)*Math.hypot(...query);
 return {distance:Math.hypot(vector[0]-query[0],vector[1]-query[1]),cosine:norm?(vector[0]*query[0]+vector[1]*query[1])/norm:null};
}
export const wordVectorQueries={balanced:[1,1],moon:[1,0]};
export const wordVectorMetrics={distance:'距離が小さい順',cosine:'コサイン類似度が大きい順'};
export function wordVectorLeaders(documents,queryId,metric){
 if(!Object.hasOwn(wordVectorQueries,queryId)||!Object.hasOwn(wordVectorMetrics,metric))throw new RangeError('検索条件が不正です。');
 const values=Object.entries(documents).map(([id,words])=>({id,value:vectorSimilarity(frequencyVector(words),wordVectorQueries[queryId])[metric]})).filter(x=>x.value!==null);
 if(!values.length)return [];
 const best=metric==='distance'?Math.min(...values.map(x=>x.value)):Math.max(...values.map(x=>x.value));
 return values.filter(x=>Math.abs(x.value-best)<1e-12).map(x=>x.id);
}
export function createWordVectorExercise(){return {nearest:null,zero:null,checked:false,query:'balanced',metric:'distance'};}
export function restoreWordVectorExercise(saved){
 if(saved===undefined)return createWordVectorExercise();
 if(!saved||![null,'a','b','c'].includes(saved.nearest)||![null,'undefined','zero'].includes(saved.zero)||typeof saved.checked!=='boolean'||(saved.checked&&(!saved.nearest||!saved.zero))||!(saved.query===undefined||Object.hasOwn(wordVectorQueries,saved.query))||!(saved.metric===undefined||Object.hasOwn(wordVectorMetrics,saved.metric)))throw new RangeError('ベクトルの記録が不正です。');
 return {nearest:saved.nearest,zero:saved.zero,checked:saved.checked,query:saved.query??'balanced',metric:saved.metric??'distance'};
}
