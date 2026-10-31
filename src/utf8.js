export const utfLevel={id:'archive-utf8',number:'93',kind:'utf8',name:'文字を運ぶ八つの灯り',tag:'文字と UTF-8',title:'文字をバイトに分けよう',story:'書庫は文字を８個の灯りの組で運びます。文字の符号位置とバイトの並びを比べ、伝言を正しく組み立てましょう。'};
export const utfCases={ascii:{name:'英字',text:'A'},kana:{name:'ひらがな',text:'あ'},composed:{name:'合成済みの é',text:'é'},decomposed:{name:'e と結合アクセント',text:'e\u0301'},emoji:{name:'顔の記号',text:'😀'}};
export const bytePalette=['41','65','80','81','82','98','9F','A9','C3','CC','E3','F0'];
export const pointOptions=[1,2,3,4];
export function utfInfo(id){
  if(!Object.hasOwn(utfCases,id))throw new RangeError('未知の文字です。');
  const text=utfCases[id].text,bytes=Array.from(new TextEncoder().encode(text),value=>value.toString(16).toUpperCase().padStart(2,'0'));
  return {points:Array.from(text,c=>`U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`),bytes,bits:bytes.map(value=>parseInt(value,16).toString(2).padStart(8,'0'))};
}
export function utfCorrect(id,choice){const info=utfInfo(id);return choice.points===info.points.length&&choice.bytes.length===info.bytes.length&&choice.bytes.every((byte,i)=>byte===info.bytes[i]);}
export function createUtf(){return {selected:'ascii',choices:Object.fromEntries(Object.keys(utfCases).map(id=>[id,{bytes:[],points:null,checked:false}]))};}
export function restoreUtf(saved){
  if(!saved||!Object.hasOwn(utfCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');const result=createUtf();result.selected=saved.selected;
  for(const id of Object.keys(utfCases)){const c=saved.choices[id];if(!c||!Array.isArray(c.bytes)||c.bytes.length>utfInfo(id).bytes.length||c.bytes.some(byte=>!bytePalette.includes(byte))||![null,...pointOptions].includes(c.points)||typeof c.checked!=='boolean')throw new RangeError('途中記録が不正です。');result.choices[id]={bytes:c.bytes.slice(),points:c.points,checked:c.checked};}return result;
}
export function utfComplete(value){return Object.keys(utfCases).every(id=>value.choices[id].checked&&utfCorrect(id,value.choices[id]));}
