export const inclusiveLevel={id:'guild-sign',number:'22',kind:'inclusive',name:'誰もが使える案内板',tag:'アクセシビリティ',title:'ギルドの案内板を直そう',story:'新しい案内板が届きましたが、使いにくいという声が届いています。案内を改善し、異なる使い方で確かめましょう。'};
export const improvements={
  text:{name:'色に加えて状態を文字で示す',description:'開いている門と閉じている門を、色だけでなく文字でも区別します。'},
  keyboard:{name:'キーボードでも選んで操作できるようにする',description:'順に移動し、選択中の項目を確認して決定できるようにします。'},
  label:{name:'案内の操作に読み上げ用の名前を付ける',description:'読み上げで操作の目的が伝わる名前を用意します。'},
};
export const visitors={
  color:{name:'色を区別しにくい旅人',need:'色に頼らず、開いている門を知りたい。',key:'text',fail:'色だけでは門の状態を区別できません。文字など別の手がかりが必要です。',pass:'「開いている」「閉じている」の文字から状態を区別できました。'},
  keys:{name:'キーボードを使う旅人',need:'指さし操作を使わずに、案内を選びたい。',key:'keyboard',fail:'キーボードで選んで決定する操作がありません。移動、選択位置の表示、決定が必要です。',pass:'キーボードで項目に移動し、選択位置を確認して決定できました。'},
  reader:{name:'読み上げを使う旅人',need:'操作の名前を聞いて、行き先を選びたい。',key:'label',fail:'操作の目的が読み上げに伝わっていません。操作ごとの名前が必要です。',pass:'操作の名前が読み上げられ、行き先を区別できました。'},
};
export function createInclusive(){return {config:{text:false,keyboard:false,label:false},tested:[],last:null};}
export function toggleImprovement(state,key){
  if(!Object.hasOwn(improvements,key))throw new RangeError('未知の改善です。');
  return {config:{...state.config,[key]:!state.config[key]},tested:[],last:null};
}
export function testVisitor(state,id){
  if(!Object.hasOwn(visitors,id))throw new RangeError('未知の確認です。');
  return {...state,tested:state.tested.includes(id)?state.tested:[...state.tested,id],last:id};
}
export function visitorPass(state,id){
  if(!Object.hasOwn(visitors,id))throw new RangeError('未知の確認です。');
  return state.config[visitors[id].key];
}
export function inclusiveComplete(state){return Object.keys(visitors).every(id=>state.tested.includes(id)&&visitorPass(state,id));}
export function restoreInclusive(saved){
  if(!saved||typeof saved!=='object'||!saved.config||!Array.isArray(saved.tested)||saved.tested.length>Object.keys(visitors).length)throw new RangeError('途中記録が不正です。');
  const config={};
  for(const key of Object.keys(improvements)){if(typeof saved.config[key]!=='boolean')throw new RangeError('途中記録が不正です。');config[key]=saved.config[key];}
  if(saved.tested.some(id=>typeof id!=='string'||!Object.hasOwn(visitors,id))||new Set(saved.tested).size!==saved.tested.length)throw new RangeError('途中記録が不正です。');
  if(saved.last!==null && (typeof saved.last!=='string'||!saved.tested.includes(saved.last)))throw new RangeError('途中記録が不正です。');
  if(saved.last===null && saved.tested.length)throw new RangeError('途中記録が不正です。');
  return {config,tested:saved.tested.slice(),last:saved.last};
}
