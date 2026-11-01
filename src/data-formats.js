// These examples describe the same two deliveries using three different representations.
export const dataFormatCases={
  table:{name:'配達表',lines:['村｜品｜束数','北村｜薬草｜2','南村｜薬草｜3'],kind:'structured',method:'columns',explanation:'決まった列の束数を読み、数を足せます。'},
  documents:{name:'配達札',lines:['札１：村＝北村、品＝薬草、束数＝2、手段＝徒歩','札２：村＝南村、品＝薬草、束数＝3'],kind:'semi',method:'fields',explanation:'名前付きの項目を読みます。手段のように片方にない項目にも注意します。'},
  story:{name:'配達日誌',lines:['北村には薬草を二束届けた。','南村へは三束の薬草を運んだ。'],kind:'unstructured',method:'interpret',explanation:'文章の意味を読み取り、村・品・数を対応づけてから集計します。'}
};
export const dataFormatKinds={structured:'構造化',semi:'半構造化',unstructured:'非構造化'};
export const dataFormatMethods={columns:'決まった束数の列を読む',fields:'名前付き項目を読み、欠けた項目に注意する',interpret:'文章から品と数の関係を読み取る'};
export function createDataFormats(){return {selected:'table',answers:Object.fromEntries(Object.keys(dataFormatCases).map(id=>[id,{kind:null,method:null,checked:false}]))};}
export function dataFormatCorrect(id,answer){const c=dataFormatCases[id];return !!c&&answer.kind===c.kind&&answer.method===c.method;}
export function dataFormatsComplete(s){return Object.keys(dataFormatCases).every(id=>s.answers[id].checked&&dataFormatCorrect(id,s.answers[id]));}
export function restoreDataFormats(saved){
  if(!saved||!Object.hasOwn(dataFormatCases,saved.selected)||!saved.answers)throw new RangeError('記録の種類が不正です。');
  const result=createDataFormats();result.selected=saved.selected;
  for(const id of Object.keys(dataFormatCases)){
    const a=saved.answers[id];
    if(!a||!(a.kind===null||Object.hasOwn(dataFormatKinds,a.kind))||!(a.method===null||Object.hasOwn(dataFormatMethods,a.method))||typeof a.checked!=='boolean'||(a.checked&&(!a.kind||!a.method)))throw new RangeError('回答が不正です。');
    result.answers[id]={kind:a.kind,method:a.method,checked:a.checked};
  }
  return result;
}
