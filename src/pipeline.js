export const pipelineLevel={id:'stone-pipeline',number:'51',kind:'pipeline',name:'魔石を運ぶ三つの道具',tag:'関数とデータ処理',title:'魔石を変えて集めよう',story:'工房に届いた魔石の列を、二倍にしてから大きいものだけ集め、力の合計を調べます。三つの道具を順番につなぎましょう。'};
export const pipelineTools={
  double:{name:'それぞれを２倍',input:'list',output:'list',apply:values=>values.map(value=>value*2)},
  increment:{name:'それぞれに１を足す',input:'list',output:'list',apply:values=>values.map(value=>value+1)},
  filter:{name:'６以上だけ残す',input:'list',output:'list',apply:values=>values.filter(value=>value>=6)},
  sum:{name:'すべて足す',input:'list',output:'number',apply:values=>values.reduce((total,value)=>total+value,0)}
};
export const pipelineExamples=[{input:[1,2,3,4],expected:14},{input:[2,3,5],expected:16}];
export function runPipeline(sequence,input){
  if(!Array.isArray(sequence)||sequence.length!==3||sequence.some(id=>!Object.hasOwn(pipelineTools,id))||!Array.isArray(input)||input.some(n=>!Number.isFinite(n)))throw new RangeError('道具か魔石の列が不正です。');
  let value=input.slice(),type='list';const trace=[value.slice()];
  for(let i=0;i<sequence.length;i++){
    const tool=pipelineTools[sequence[i]];if(type!==tool.input)return {ok:false,index:i,trace,reason:'道具が列を必要とするのに、一つの数を受け取りました。'};
    value=tool.apply(value);type=tool.output;trace.push(Array.isArray(value)?value.slice():value);
  }
  return {ok:type==='number',index:3,trace,reason:type==='number'?'':'最後の結果は列です。合計を一つの数にしましょう。'};
}
export function checkPipeline(sequence){return pipelineExamples.map(example=>{const result=runPipeline(sequence,example.input);return {...example,...result,correct:result.ok&&result.trace.at(-1)===example.expected};});}
export function restorePipeline(saved){
  if(!saved||!Array.isArray(saved.sequence)||saved.sequence.length!==3||saved.sequence.some(id=>typeof id!=='string'||!Object.hasOwn(pipelineTools,id))||typeof saved.tested!=='boolean')throw new RangeError('途中記録が不正です。');
  const sequence=saved.sequence.slice();return {sequence,results:saved.tested?checkPipeline(sequence):null};
}
