export const instructionPipelineLevel={id:'workshop-instruction-pipeline',number:'158',kind:'instruction-pipeline',name:'続けて動く魔導機械',tag:'命令パイプラインと依存',title:'前の結果を待とう',story:'魔導機械が二つの命令を重ねて実行します。後の命令が前の結果を使うとき、正しい値を届けましょう。'};
export const instructionModes={unsafe:{name:'対策なし'},stall:{name:'待ちを入れる'},forward:{name:'結果を転送する'}};
export const instructionNames=['命令１：赤に２を入れる','命令２：赤に１を足して青に入れる'];
export function createInstructionTrial(mode){if(!Object.hasOwn(instructionModes,mode))throw new RangeError('方式が不正です。');return {mode,cycle:0,fetch:0,decode:null,execute:null,next:1,red:0,blue:0,stalls:0,forwarded:false,done:false,message:'最初の命令を取り出し中です。'};}
export function tickInstruction(s){if(s.done)return {...s,message:'実行は終わっています。'};const n={...s,cycle:s.cycle+1};let result=null;if(s.execute){result=s.execute.id===0?2:s.execute.operand+1;if(s.execute.id===0)n.red=result;else n.blue=result;}
  const hazard=s.decode===1&&s.execute?.id===0;
  if(hazard&&s.mode==='stall'){n.execute=null;n.stalls++;n.message='命令２は命令１の結果を待ちます。';}
  else{let operand=s.red;if(hazard&&s.mode==='forward'){operand=result;n.forwarded=true;}n.execute=s.decode===null?null:{id:s.decode,operand:s.decode===1?operand:null};n.decode=s.fetch;n.fetch=s.next<2?s.next:null;n.next=Math.min(2,s.next+1);n.message=hazard?(s.mode==='forward'?'命令１の結果を命令２へ転送しました。':'まだ更新されていない赤の値を読みました。'):'各段階を一つ進めました。';}
  n.done=n.fetch===null&&n.decode===null&&n.execute===null&&n.next===2;if(n.done)n.message+=' 二つの命令が終わりました。';return n;
}
export function createInstructionPipeline(){return {selected:'unsafe',trials:Object.fromEntries(Object.keys(instructionModes).map(id=>[id,createInstructionTrial(id)]))};}
export function instructionPipelineComplete(s){return Object.keys(instructionModes).every(id=>s.trials[id].done);}
export function restoreInstructionPipeline(saved){if(!saved||!Object.hasOwn(instructionModes,saved.selected)||!saved.cycles)throw new RangeError('途中記録が不正です。');const r=createInstructionPipeline();r.selected=saved.selected;for(const id of Object.keys(instructionModes)){const count=saved.cycles[id];if(!Number.isInteger(count)||count<0||count>8)throw new RangeError('途中記録が不正です。');for(let i=0;i<count;i++){const before=r.trials[id];if(before.done)throw new RangeError('途中記録が不正です。');r.trials[id]=tickInstruction(before);}}return r;}
