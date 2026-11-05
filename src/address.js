export const addressLevel={id:'page-address',number:'40',kind:'address',name:'記憶の住所を探して',tag:'仮想メモリ',title:'頁の住所をたどる',story:'記憶の書庫では、使う人の住所と実際に頁を置いた台の住所が違います。頁の一覧を使って読み書きの行き先を調べましょう。'};
export const pageTable=[{page:0,frame:2,writable:true},{page:1,frame:null,writable:false},{page:2,frame:0,writable:true},{page:3,frame:1,writable:false}];
export const addressCases={read0:{name:'最初の頁を読む',address:2,write:false},missing:{name:'台にない頁を読む',address:5,write:false},protected:{name:'読み取り専用の頁へ書く',address:13,write:true},read2:{name:'別の頁を読む',address:11,write:false},readProtected:{name:'読み取り専用の頁を読む',address:13,write:false},write0:{name:'最初の頁へ書く',address:2,write:true},missingWrite:{name:'台にない頁へ書く',address:5,write:true}};
export function translateAddress(address,write){
  if(!Number.isInteger(address)||address<0||address>=16||typeof write!=='boolean')throw new RangeError('住所または操作が不正です。');
  const page=Math.floor(address/4),offset=address%4,entry=pageTable[page];
  const outcome=entry.frame===null?'fault':write&&!entry.writable?'denied':`physical:${entry.frame*4+offset}`;
  return {page,offset,outcome};
}
export function checkAddress(id,selection){
  if(!Object.hasOwn(addressCases,id))throw new RangeError('未知の依頼です。');
  const task=addressCases[id],expected=translateAddress(task.address,task.write);
  return {expected,page:selection.page===expected.page,offset:selection.offset===expected.offset,outcome:selection.outcome===expected.outcome};
}
export function createAddress(){return {selected:'read0',choices:Object.fromEntries(Object.keys(addressCases).map(id=>[id,{page:null,offset:null,outcome:'',tested:false}]))};}
export function restoreAddress(saved){
  if(!saved||!Object.hasOwn(addressCases,saved.selected)||!saved.choices)throw new RangeError('途中記録が不正です。');
  const state=createAddress();state.selected=saved.selected;
  for(const id of Object.keys(addressCases)){
    const choice=saved.choices[id]??(['readProtected','write0','missingWrite'].includes(id)?{page:null,offset:null,outcome:'',tested:false}:null),validNumber=n=>n===null||(Number.isInteger(n)&&n>=0&&n<4);
    if(!choice||!validNumber(choice.page)||!validNumber(choice.offset)||typeof choice.tested!=='boolean'||typeof choice.outcome!=='string'||!['','fault','denied',...Array.from({length:12},(_,n)=>`physical:${n}`)].includes(choice.outcome))throw new RangeError('途中記録が不正です。');
    state.choices[id]={page:choice.page,offset:choice.offset,outcome:choice.outcome,tested:choice.tested};
  }
  return state;
}
export function addressComplete(state){return Object.keys(addressCases).every(id=>{const c=state.choices[id],r=checkAddress(id,c);return c.tested&&r.page&&r.offset&&r.outcome;});}
