export const binaryLevel={id:'number-lanterns',number:'36',kind:'binary',name:'数字を記す四つの灯り',tag:'数の表現',title:'古代の数字を読み解こう',story:'遺跡の台座には、点灯と消灯で数を記す四つの灯りがあります。三つの封印に合う灯りを選びましょう。'};
export const binaryCases={
  unsigned:{name:'正の数の封印',prompt:'符号なしの４ビットで 6 を表しましょう。',target:6,format:'unsigned'},
  negative:{name:'負の数の封印',prompt:'２の補数の４ビットで −3 を表しましょう。',target:-3,format:'signed'},
  overflow:{name:'加算の封印',prompt:'４ビットで 7 と 1 を足したとき、残る４つの灯りを選びましょう。',target:8,format:'unsigned'}
};
export function readBits(bits){
  if(!Array.isArray(bits)||bits.length!==4||bits.some(bit=>bit!==0&&bit!==1))throw new RangeError('灯りは０か１を４つ選んでください。');
  const unsigned=bits.reduce((value,bit)=>value*2+bit,0);
  return {unsigned,signed:bits[0]===1?unsigned-16:unsigned};
}
export function binaryCorrect(id,bits){
  if(!Object.hasOwn(binaryCases,id))throw new RangeError('未知の封印です。');
  return readBits(bits)[binaryCases[id].format]===binaryCases[id].target;
}
export function createBinary(){return {selected:'unsigned',bits:{unsigned:[0,0,0,0],negative:[0,0,0,0],overflow:[0,0,0,0]},checked:{unsigned:false,negative:false,overflow:false}};}
export function restoreBinary(saved){
  if(!saved||!Object.hasOwn(binaryCases,saved.selected)||!saved.bits||!saved.checked)throw new RangeError('途中記録が不正です。');
  const state=createBinary();state.selected=saved.selected;
  for(const id of Object.keys(binaryCases)){
    readBits(saved.bits[id]);if(typeof saved.checked[id]!=='boolean')throw new RangeError('途中記録が不正です。');
    state.bits[id]=saved.bits[id].slice();state.checked[id]=saved.checked[id];
  }
  return state;
}
export function binaryComplete(state){return Object.keys(binaryCases).every(id=>state.checked[id]&&binaryCorrect(id,state.bits[id]));}
