// A fixed teaching example inspired by the Arrow list layout; it is not an Arrow encoder.
export const nestedValues=['赤','青','緑'];
export const nestedOffsets={correct:[0,2,2,2,3],shifted:[0,1,2,2,3],early:[0,2,3,3,3]};
export const nestedValidity={correct:[true,true,false,true],all:[true,true,true,true],swapped:[true,false,true,true]};
export function nestedDecode(offsetId,validId){
 if(!Object.hasOwn(nestedOffsets,offsetId)||!Object.hasOwn(nestedValidity,validId))throw new RangeError('符号化の選択が不正です。');
 const offsets=nestedOffsets[offsetId],valid=nestedValidity[validId];
 return valid.map((present,i)=>present?nestedValues.slice(offsets[i],offsets[i+1]):null);
}
export function createNestedOffsets(){return {offset:null,valid:null,checked:false};}
export function restoreNestedOffsets(saved){
 if(saved===undefined)return createNestedOffsets();
 if(!saved||!(saved.offset===null||Object.hasOwn(nestedOffsets,saved.offset))||!(saved.valid===null||Object.hasOwn(nestedValidity,saved.valid))||typeof saved.checked!=='boolean'||(saved.checked&&(!saved.offset||!saved.valid)))throw new RangeError('配列の記録が不正です。');
 return {offset:saved.offset,valid:saved.valid,checked:saved.checked};
}
