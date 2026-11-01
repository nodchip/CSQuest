export const schemaRules={village:'村を必須にする',count:'束数を必須にする',number:'束数を０以上の整数にする',note:'備考を必須にする'};
export const schemaSamples={
  full:{label:'村＝北村、束数＝２、備考＝急ぎ',value:{village:'北村',count:2,note:'急ぎ'}},
  noNote:{label:'村＝南村、束数＝３（備考なし）',value:{village:'南村',count:3}},
  noVillage:{label:'束数＝２（村なし）',value:{count:2}},
  noCount:{label:'村＝北村（束数なし）',value:{village:'北村'}},
  negative:{label:'村＝北村、束数＝−１',value:{village:'北村',count:-1}},
  fraction:{label:'村＝北村、束数＝1.5',value:{village:'北村',count:1.5}},
  badNote:{label:'村＝北村、束数＝２、備考＝数の７',value:{village:'北村',count:2,note:7}}
};
export function validateDocument(rules,doc){
  const errors=[];
  if(rules.village&&!Object.hasOwn(doc,'village'))errors.push('村がありません');
  if(rules.count&&!Object.hasOwn(doc,'count'))errors.push('束数がありません');
  if(rules.note&&!Object.hasOwn(doc,'note'))errors.push('備考がありません');
  if(Object.hasOwn(doc,'village')&&typeof doc.village!=='string')errors.push('村は文字です');
  if(Object.hasOwn(doc,'note')&&typeof doc.note!=='string')errors.push('備考は文字です');
  if(rules.number&&Object.hasOwn(doc,'count')&&(!Number.isInteger(doc.count)||doc.count<0))errors.push('束数は０以上の整数です');
  return errors;
}
export function createDocumentSchema(){return {rules:{village:false,count:false,number:false,note:false},selected:'full',answers:Object.fromEntries(Object.keys(schemaSamples).map(k=>[k,{prediction:null,checked:false}]))};}
export function schemaComplete(s){return s.rules.village&&s.rules.count&&s.rules.number&&!s.rules.note&&Object.entries(schemaSamples).every(([id,sample])=>{const a=s.answers[id];return a.checked&&a.prediction===(validateDocument(s.rules,sample.value).length===0?'accept':'reject');});}
export function restoreDocumentSchema(saved){
  if(!saved||!saved.rules||!Object.hasOwn(schemaSamples,saved.selected)||!saved.answers)throw new RangeError('規則の記録が不正です。');
  const s=createDocumentSchema();s.selected=saved.selected;
  for(const k of Object.keys(schemaRules)){if(typeof saved.rules[k]!=='boolean')throw new RangeError('規則が不正です。');s.rules[k]=saved.rules[k];}
  for(const k of Object.keys(schemaSamples)){const a=saved.answers[k];if(!a||![null,'accept','reject'].includes(a.prediction)||typeof a.checked!=='boolean'||(a.checked&&a.prediction===null))throw new RangeError('予測が不正です。');s.answers[k]={prediction:a.prediction,checked:a.checked};}
  return s;
}
