// Fixed nonnegative keys, three buckets, modulo-three hash.
export const chainSteps=['put:1:1','put:4:1','put:7:1','seek:4','seek:7','seek:10'];
export const linearSteps=[{op:'put',key:1},{op:'put',key:4},{op:'put',key:7},{op:'seek',key:7},{op:'seek',key:10}];
export function replayHash(kind,history){
 if(!['chain','linear','deletion'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,buckets=[[],[],[]],slots=kind==='deletion'?[7,1,4]:[null,null,null],phase=kind==='deletion'?'delete':'start',probes=0,last='',results=[];
 for(const action of history){
  if(typeof action!=='string')return null;
  if(kind==='chain'){
   if(scene>=chainSteps.length||action!==chainSteps[scene])return null;
   const [op,n,bucket]=action.split(':'),key=Number(n);
   if(op==='put'){if(Number(bucket)!==key%3)return null;buckets[Number(bucket)].push(key);last=`番号${key}を棚${bucket}に入れました。`;}
   else{const found=buckets[key%3].includes(key);last=found?`棚${key%3}の札を照合し、番号${key}を見つけました。`:`棚${key%3}の札を照合しましたが、番号${key}はありません。`;}
   results.push(last);scene++;continue;
  }
  if(kind==='linear'){
   const task=linearSteps[scene];if(!task)return null;
   if(phase==='start'&&action==='start'){phase='probe';probes=0;last=`番号${task.key}の余りから調べます。`;continue;}
   if(phase!=='probe')return null;
   const expected=(task.key%3+probes)%3;if(action!==`probe:${expected}`)return null;
   const slot=slots[expected];probes++;
   if(task.op==='put'&&slot===null){slots[expected]=task.key;last=`棚${expected}が空なので番号${task.key}を入れました。`;results.push({key:task.key,op:task.op,found:true,probes});scene++;phase='start';}
   else if(task.op==='seek'&&slot===task.key){last=`棚${expected}で番号${task.key}を見つけました。`;results.push({key:task.key,op:task.op,found:true,probes});scene++;phase='start';}
   else if(task.op==='seek'&&slot===null||probes===3){last=`番号${task.key}は見つかりません。`;results.push({key:task.key,op:task.op,found:false,probes});scene++;phase='start';}
   else last=`棚${expected}には番号${slot}があります。次の棚を調べましょう。`;
   continue;
  }
  if(scene>=2)return null;
  if(phase==='delete'){
   if(action!==(scene===0?'delete:empty':'delete:mark'))return null;
   slots[2]=scene===0?null:'deleted';phase='probe';probes=0;last=scene===0?'番号４の棚を空にしました。':'番号４の棚に削除済みの印を残しました。';continue;
  }
  if(phase==='probe'){
   const expected=(1+probes)%3;if(action!==`probe:${expected}`)return null;
   const slot=slots[expected];probes++;
   if(slot===7){last=`棚${expected}で番号７を見つけました。`;results.push({found:true,probes});phase='ack';}
   else if(slot===null||probes===3){last=slot===null?'空の棚で探索を止め、番号７は見つかりませんでした。':'一周して番号７は見つかりませんでした。';results.push({found:false,probes});phase='ack';}
   else last=slot==='deleted'?'削除済みの印なので次の棚へ進みます。':`棚${expected}には番号${slot}があるので次へ進みます。`;
   continue;
  }
  if(phase==='ack'&&action==='next'){scene++;if(scene<2){slots=[7,1,4];phase='delete';probes=0;last='';}continue;}
  return null;
 }
 return {scene,buckets,slots,phase,probes,last,results,done:kind==='chain'?scene===chainSteps.length:kind==='linear'?scene===linearSteps.length:scene===2};
}
