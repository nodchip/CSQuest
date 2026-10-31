export const cryptoLevel={id:'secret-lanterns',number:'58',kind:'crypto',name:'秘密の灯りと使い回しの鍵',tag:'共通鍵と鍵の再利用',title:'二通の秘密の手紙',story:'王城の伝令は４つの灯りで手紙を隠します。同じ鍵を二通に使うと、盗み見た者に何が分かるでしょう。'};
const plainA=[0,1,1,0],plainB=[1,0,0,1],key=[1,0,1,0],fresh=[0,1,0,1];
export function xorBits(a,b){if(!Array.isArray(a)||!Array.isArray(b)||a.length!==4||b.length!==4||[...a,...b].some(x=>x!==0&&x!==1))throw new RangeError('４つの灯りを選んでください。');return a.map((bit,i)=>bit^b[i]);}
const cipherA=xorBits(plainA,key),cipherB=xorBits(plainB,key);
export const cryptoCases={
  first:{name:'手紙Ａを隠す',prompt:'手紙Ａと共通の鍵を合わせて、送る暗号を作りましょう。',a:plainA,b:key,aLabel:'手紙Ａ',bLabel:'共通の鍵'},
  second:{name:'手紙Ｂを隠す',prompt:'手紙Ｂにも同じ鍵を使って、送る暗号を作りましょう。',a:plainB,b:key,aLabel:'手紙Ｂ',bLabel:'同じ鍵'},
  recover:{name:'鍵が知られる',prompt:'盗み見た者は手紙Ａの元の内容と暗号を知っています。そこから使われた鍵を求めましょう。',a:plainA,b:cipherA,aLabel:'知られた手紙Ａ',bLabel:'見られた暗号Ａ'},
  decrypt:{name:'手紙Ｂを読む',prompt:'盗み見た者は見られた暗号Ｂと分かった鍵から、手紙Ｂを復元します。',a:cipherB,b:key,aLabel:'見られた暗号Ｂ',bLabel:'分かった鍵'},
  fresh:{name:'別の鍵で隠す',prompt:'手紙Ｂを、Ａとは別の鍵で隠しましょう。',a:plainB,b:fresh,aLabel:'手紙Ｂ',bLabel:'別の鍵'}
};
export function createCrypto(){return {selected:'first',bits:Object.fromEntries(Object.keys(cryptoCases).map(id=>[id,[0,0,0,0]])),checked:Object.fromEntries(Object.keys(cryptoCases).map(id=>[id,false]))};}
export function cryptoCorrect(id,bits){if(!Object.hasOwn(cryptoCases,id))throw new RangeError('未知の手紙です。');const expected=xorBits(cryptoCases[id].a,cryptoCases[id].b);xorBits(bits,[0,0,0,0]);return bits.map((bit,i)=>bit===expected[i]);}
export function restoreCrypto(saved){
  if(!saved||!Object.hasOwn(cryptoCases,saved.selected)||!saved.bits||!saved.checked)throw new RangeError('途中記録が不正です。');const result=createCrypto();result.selected=saved.selected;
  for(const id of Object.keys(cryptoCases)){xorBits(saved.bits[id],[0,0,0,0]);if(typeof saved.checked[id]!=='boolean')throw new RangeError('途中記録が不正です。');result.bits[id]=saved.bits[id].slice();result.checked[id]=saved.checked[id];}return result;
}
export function cryptoComplete(state){return Object.keys(cryptoCases).every(id=>state.checked[id]&&cryptoCorrect(id,state.bits[id]).every(Boolean));}
