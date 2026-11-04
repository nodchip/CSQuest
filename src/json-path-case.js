export const jsonPathCases={
 village:{label:'village',path:['village']},
 count:{label:'delivery → count',path:['delivery','count']},
 missing:{label:'delivery → note',path:['delivery','note']}
};
export const jsonPathDocument={village:'北',delivery:{count:2}};
export const jsonPathAnswers={north:'北（文字）',two:'2（文字）',missing:'SQL NULL'};
export function jsonPathText(id){
 if(!Object.hasOwn(jsonPathCases,id))throw new RangeError('経路が不正です。');
 let value=jsonPathDocument;
 for(const key of jsonPathCases[id].path){if(value===null||typeof value!=='object'||!Object.hasOwn(value,key))return null;value=value[key];}
 return String(value);
}
export function jsonPathExpected(id){const value=jsonPathText(id);return value===null?'missing':value==='北'?'north':'two';}
export function createJsonPathCase(){return {selected:'village',answers:Object.fromEntries(Object.keys(jsonPathCases).map(id=>[id,{guess:null,checked:false}]))};}
export function restoreJsonPathCase(saved){
 if(saved===undefined)return createJsonPathCase();
 if(!saved||!Object.hasOwn(jsonPathCases,saved.selected)||!saved.answers)throw new RangeError('経路の記録が不正です。');
 const s=createJsonPathCase();s.selected=saved.selected;
 for(const id of Object.keys(jsonPathCases)){const a=saved.answers[id];if(!a||!(a.guess===null||Object.hasOwn(jsonPathAnswers,a.guess))||typeof a.checked!=='boolean'||(a.checked&&!a.guess))throw new RangeError('経路の記録が不正です。');s.answers[id]={guess:a.guess,checked:a.checked};}
 return s;
}
