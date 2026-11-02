export const packetLevel={id:'ruin-dct-packet',number:'812',kind:'dct-packet',name:'絵巻の印を届ける',tag:'差分と連長符号',title:'三枚の絵巻の印を送り直そう',story:'前の依頼で分けた係数を、遠くの村へ届けます。続く０をまとめ、一様な成分は前の絵巻との差で送りましょう。'};
export const packetBlocks=[[20,-4,0,0],[20,0,0,0],[24,0,0,-4]];
export const packetDcChoices=[-4,0,4,20,24];
export function packetInitial(){return {index:0,phase:'dc',previous:0,cursor:0,run:0,tokens:[]};}
function nextBlock(s){s.previous=packetBlocks[s.index][0];s.index++;s.phase=s.index===packetBlocks.length?'done':'dc';s.cursor=0;s.run=0;}
export function packetExecute(s,action){
 if(s.phase==='done')throw new RangeError('三枚の記録は完成しています。');
 const block=packetBlocks[s.index];
 if(s.phase==='dc'){
  if(typeof action!=='string'||!/^dc:-?\d+$/.test(action)||!packetDcChoices.includes(Number(action.slice(3)))||Number(action.slice(3))!==block[0]-s.previous)throw new RangeError('現在の一様成分から前の一様成分を引きましょう。最初の前値は０です。');
  s.tokens.push({kind:'dc',value:Number(action.slice(3))});s.phase='ac';return s;
 }
 const ac=block.slice(1);
 if(action==='skip'){
  if(s.cursor>=3||ac[s.cursor]!==0)throw new RangeError('今の模様の係数が０か確認しましょう。');s.cursor++;s.run++;
 }else if(action==='emit'){
  if(s.cursor>=3||ac[s.cursor]===0)throw new RangeError('０でない係数が現れたら、直前の０の個数と共に送ります。');
  s.tokens.push({kind:'ac',run:s.run,value:ac[s.cursor]});s.cursor++;s.run=0;if(s.cursor===3)nextBlock(s);
 }else if(action==='end'){
  if(ac.slice(s.cursor).some(x=>x!==0))throw new RangeError('残りに０でない係数があります。終端にする前に送りましょう。');s.tokens.push({kind:'end'});nextBlock(s);
 }else throw new RangeError('今の段階で使う操作を選びましょう。');
 return s;
}
export function packetDecode(tokens){if(!Array.isArray(tokens)||tokens.length>30)throw new RangeError('送信記録が不正です');let previous=0,i=0;const blocks=[];while(i<tokens.length){const dc=tokens[i++];if(!dc||dc.kind!=='dc'||!Number.isInteger(dc.value))throw new RangeError('差分が不正です');const current=previous+dc.value,ac=[];while(ac.length<3){const t=tokens[i++];if(!t)throw new RangeError('記録が足りません');if(t.kind==='end'){while(ac.length<3)ac.push(0);break;}if(t.kind!=='ac'||!Number.isInteger(t.run)||t.run<0||t.run>=3-ac.length||!Number.isInteger(t.value)||t.value===0)throw new RangeError('連長が不正です');for(let n=0;n<t.run;n++)ac.push(0);ac.push(t.value);}blocks.push([current,...ac]);previous=current;}return blocks;}
export function packetReplay(history){if(!Array.isArray(history)||history.length>30)throw new RangeError('途中記録が不正です');const s=packetInitial();for(const a of history){if(typeof a!=='string')throw new RangeError('途中記録が不正です');packetExecute(s,a);}return s;}
export function packetCreate(){return {history:[],checked:false,answer:null};}
export function packetStep(q,action){if(q.history.length>=30)throw new RangeError('操作は30回までです。最初からやり直せます。');packetExecute(packetReplay(q.history),action);q.history.push(action);}
export function packetVerify(q){const s=packetReplay(q.history);if(s.phase!=='done')throw new RangeError('三枚全てを送り終えてから復元しましょう。');if(JSON.stringify(packetDecode(s.tokens))!==JSON.stringify(packetBlocks))throw new RangeError('復元した係数が一致しません。');q.checked=true;}
export function packetComplete(q){const s=packetReplay(q.history);return s.phase==='done'&&q.checked&&JSON.stringify(packetDecode(s.tokens))===JSON.stringify(packetBlocks)&&q.answer==='tokens';}
export function packetRestore(q){if(!q||typeof q.checked!=='boolean'||![null,'tokens','bits','loss'].includes(q.answer))throw new RangeError('途中記録が不正です');const n={history:[...q.history],checked:false,answer:q.answer};packetReplay(n.history);if(q.checked)packetVerify(n);return n;}
