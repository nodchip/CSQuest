export const typeLevel={id:'typed-spells',number:'24',kind:'types',name:'魔法の道具と型',tag:'型と操作',title:'灯りの道具をつなぐ',story:'数の刻まれた魔石から、灯りの点灯・消灯を決める装置を作ります。道具の受け取るものと渡すものを確かめましょう。'};
export const tools={
  double:{name:'数を２倍にする',input:'number',output:'number',apply:n=>n*2},
  positive:{name:'数が正なら点灯',input:'number',output:'boolean',apply:n=>n>0},
  invert:{name:'灯りを反転する',input:'boolean',output:'boolean',apply:b=>!b},
  convert:{name:'点灯を１、消灯を０にする',input:'boolean',output:'number',apply:b=>b?1:0},
};
export const typeNames={number:'数',boolean:'灯り'};
export const examples=[{input:3,expected:true},{input:-2,expected:false}];
export function checkTypes(sequence){
  if(!Array.isArray(sequence)||sequence.length!==2||sequence.some(id=>!Object.hasOwn(tools,id)))throw new RangeError('道具の選択が不正です。');
  let current='number';
  for(let i=0;i<sequence.length;i++){const tool=tools[sequence[i]];if(tool.input!==current)return {ok:false,index:i,received:current,required:tool.input};current=tool.output;}
  if(current!=='boolean')return {ok:false,index:2,received:current,required:'boolean'};
  return {ok:true};
}
export function trySpells(sequence){
  const type=checkTypes(sequence);if(!type.ok)return {type,results:null};
  const results=examples.map(example=>{let value=example.input;const trace=[value];for(const id of sequence){value=tools[id].apply(value);trace.push(value);}return {...example,actual:value,trace,correct:value===example.expected};});
  return {type,results};
}
export function restoreSpells(saved){
  if(!saved||!Array.isArray(saved.sequence)||typeof saved.ran!=='boolean')throw new RangeError('途中記録が不正です。');
  checkTypes(saved.sequence);
  return {sequence:saved.sequence.slice(),result:saved.ran?trySpells(saved.sequence):null};
}
