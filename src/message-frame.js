export const messageFrameLevel={id:'workshop-message-frame',number:'999',kind:'message-frame',name:'伝言を包んで確かめる',tag:'通信形式・圧縮・入力検証',title:'伝言の形式を決めよう',story:'工房と村の間で印を送ります。共通の形式で包み、届いた札が約束に合うか確かめましょう。'};
export const frameMessages={repeat:{name:'繰り返しが多い',symbols:[1,1,1,1,2,2]},alternate:{name:'交互に並ぶ',symbols:[1,2,1,2]}};
export const frameModes=['raw','rle'];
export const frameStreamPatterns={
 split:{name:'見出しと本文が分かれる',chunks:[[0],[2,1],[2,0,1],[2]]},
 combined:{name:'一通目と二通目の一部が一緒に届く',chunks:[[0,2,1,2,0],[1,2]]},
 whole:{name:'二通分が一緒に届く',chunks:[[0,2,1,2,0,1,2]]}
};
export const frameIssueCases={
 complete:{name:'正常に一通を受け取る',chunks:[[0,2],[1,2]]},
 header:{name:'見出しの途中で切断',chunks:[[0]]},
 body:{name:'本文の途中で切断',chunks:[[0,4,1,2]]},
 length:{name:'上限を超える長さ',chunks:[[0,9]]}
};
export const frameInputs={
 raw:{name:'札Ａ',frame:[0,4,1,2,1,2]},
 compressed:{name:'札Ｂ',frame:[1,4,4,1,2,2]},
 length:{name:'札Ｃ',frame:[0,6,1,2]},
 odd:{name:'札Ｄ',frame:[1,3,2,1,1]},
 expansion:{name:'札Ｅ',frame:[1,2,9,1]}
};
export function frameEncode(symbols,mode){
 if(!Array.isArray(symbols)||symbols.length>8||symbols.some(x=>x!==1&&x!==2)||!frameModes.includes(mode))throw new RangeError('不正な入力');
 const body=[];if(mode==='raw')body.push(...symbols);else for(let i=0;i<symbols.length;){let end=i+1;while(end<symbols.length&&symbols[end]===symbols[i])end++;body.push(end-i,symbols[i]);i=end;}
 return [mode==='raw'?0:1,body.length,...body];
}
export function frameDecode(frame){
 if(!Array.isArray(frame)||frame.length<2||frame.some(n=>!Number.isInteger(n)||n<0||n>255))return {ok:false,reason:'形式が不正'};
 const [mode,length,...body]=frame;if(mode!==0&&mode!==1)return {ok:false,reason:'方式が不明'};if(length!==body.length)return {ok:false,reason:'長さが一致しない'};
 if(mode===0){if(body.length>8||body.some(x=>x!==1&&x!==2))return {ok:false,reason:'印または展開後の長さが不正'};return {ok:true,symbols:body};}
 if(body.length%2)return {ok:false,reason:'回数と印の組が不足'};const symbols=[];for(let i=0;i<body.length;i+=2){const count=body[i],symbol=body[i+1];if(!count||![1,2].includes(symbol)||symbols.length+count>8)return {ok:false,reason:'回数・印・展開後の長さが不正'};for(let n=0;n<count;n++)symbols.push(symbol);}
 return {ok:true,symbols};
}
export function frameStreamTrace(pattern){
 if(!Object.hasOwn(frameStreamPatterns,pattern))throw new RangeError('届き方が不正です。');
 let buffer=[],messages=[];
 return frameStreamPatterns[pattern].chunks.map(chunk=>{
  buffer.push(...chunk);
  while(buffer.length>=2&&buffer.length>=2+buffer[1]){
   const frame=buffer.splice(0,2+buffer[1]),decoded=frameDecode(frame);
   if(!decoded.ok)throw new RangeError('固定された札の形式が不正です。');
   messages.push(decoded.symbols);
  }
  return {chunk:[...chunk],buffer:[...buffer],messages:messages.map(m=>[...m])};
 });
}
export function frameIssueTrace(id){
 if(!Object.hasOwn(frameIssueCases,id))throw new RangeError('受信例が不正です。');
 let buffer=[],messages=[],status='open',steps=[];
 for(const chunk of frameIssueCases[id].chunks){
  buffer.push(...chunk);
  if(buffer.length>=2&&(buffer[0]>1||buffer[1]>(buffer[0]===0?8:16))){status='invalid-header';steps.push({event:'chunk',chunk:[...chunk],buffer:[...buffer],messages:messages.map(m=>[...m]),status});break;}
  while(buffer.length>=2&&buffer.length>=2+buffer[1]){
   const frame=buffer.splice(0,2+buffer[1]),decoded=frameDecode(frame);
   if(!decoded.ok)throw new RangeError('固定例の本文が不正です。');
   messages.push(decoded.symbols);
  }
  steps.push({event:'chunk',chunk:[...chunk],buffer:[...buffer],messages:messages.map(m=>[...m]),status});
 }
 if(status==='open'){
  status=buffer.length===0?'complete':buffer.length<2?'truncated-header':'truncated-body';
  steps.push({event:'end',chunk:[],buffer:[...buffer],messages:messages.map(m=>[...m]),status});
 }
 return steps;
}
export function messageFrameCreate(){return {message:'repeat',mode:'raw',encoded:{'repeat:raw':false,'repeat:rle':false,'alternate:raw':false,'alternate:rle':false},input:'raw',trials:Object.fromEntries(Object.keys(frameInputs).map(id=>[id,{answer:null,checked:false}])),reflection:null,streamPattern:'split',streamStep:0,issueCase:'complete',issueStep:0};}
export function messageFrameDone(id,t){return !!frameInputs[id]&&!!t&&t.checked&&t.answer===(frameDecode(frameInputs[id].frame).ok?'accept':'reject');}
export function messageFrameComplete(s){return Object.values(s.encoded).every(Boolean)&&Object.keys(frameInputs).every(id=>messageFrameDone(id,s.trials[id]))&&s.reflection==='bounds';}
export function messageFrameRestore(saved){if(!saved||!Object.hasOwn(frameMessages,saved.message)||!frameModes.includes(saved.mode)||!Object.hasOwn(frameInputs,saved.input)||![null,'bounds','always','safe'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=messageFrameCreate();s.message=saved.message;s.mode=saved.mode;s.input=saved.input;s.reflection=saved.reflection;s.streamPattern=saved.streamPattern??'split';s.streamStep=saved.streamStep??0;s.issueCase=saved.issueCase??'complete';s.issueStep=saved.issueStep??0;if(!Object.hasOwn(frameStreamPatterns,s.streamPattern)||!Number.isInteger(s.streamStep)||s.streamStep<0||s.streamStep>frameStreamPatterns[s.streamPattern].chunks.length||!Object.hasOwn(frameIssueCases,s.issueCase)||!Number.isInteger(s.issueStep)||s.issueStep<0||s.issueStep>frameIssueTrace(s.issueCase).length)throw new RangeError('受信の記録が不正です');for(const key of Object.keys(s.encoded)){if(typeof saved.encoded?.[key]!=='boolean')throw new RangeError('途中記録が不正です');s.encoded[key]=saved.encoded[key];}for(const id of Object.keys(frameInputs)){const t=saved.trials?.[id];if(!t||![null,'accept','reject'].includes(t.answer)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[id]={answer:t.answer,checked:t.checked};}return s;}
