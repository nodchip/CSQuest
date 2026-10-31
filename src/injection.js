export const injectionLevel={id:'ledger-seals',number:'82',kind:'injection',name:'台帳を守る名前の封',tag:'SQL インジェクション',title:'名前の札を安全に扱おう',story:'城の台帳係は名前の札で記録を探します。札を命令に混ぜる方法と、値として別に渡す方法を比べましょう。'};
export const injectionModes={concat:'文字列をそのまま連結',bound:'名前を値として別に渡す'};
export const injectionCases={ordinary:{name:'普通の名前',input:'アオ'},quote:{name:'記号を含む名前',input:"オリーブ'"},crafted:{name:'細工された札',input:"見つからない' OR '1'='1"}};
export const injectionOutcomes={blue:'アオの行だけ',olive:"オリーブ' の行だけ",all:'３行すべて',none:'該当なし',error:'構文エラー'};
// This is a fixed teaching model of the shown query, not a SQL interpreter.
export function injectionResult(mode,id){
  if(!Object.hasOwn(injectionModes,mode)||!Object.hasOwn(injectionCases,id))throw new RangeError('未知の試行です。');
  return id==='ordinary'?'blue':mode==='bound'?(id==='quote'?'olive':'none'):(id==='quote'?'error':'all');
}
export function createInjection(){return {selected:'ordinary',mode:'concat',choices:Object.fromEntries(Object.keys(injectionCases).map(id=>[id,Object.fromEntries(Object.keys(injectionModes).map(mode=>[mode,{answer:null,checked:false}]))]))};}
export function restoreInjection(saved){
  if(!saved||!Object.hasOwn(injectionCases,saved.selected)||!Object.hasOwn(injectionModes,saved.mode)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const result=createInjection();result.selected=saved.selected;result.mode=saved.mode;
  for(const id of Object.keys(injectionCases))for(const mode of Object.keys(injectionModes)){const c=saved.choices[id]?.[mode];if(!c||!(c.answer===null||Object.hasOwn(injectionOutcomes,c.answer))||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.choices[id][mode]={answer:c.answer,checked:c.checked};}
  return result;
}
export function injectionComplete(state){return Object.keys(injectionCases).every(id=>Object.keys(injectionModes).every(mode=>{const c=state.choices[id][mode];return c.checked&&c.answer===injectionResult(mode,id);}));}
