export const messageBenchmarkLevel={id:'forest-message-benchmark',number:'1286',kind:'message-benchmark',name:'伝令のまとめ方を測る',tag:'通信とスループット',title:'伝令を何回に分ける？',story:'森の工房は別の作業係に札を送り、結果を受け取ります。１枚ずつ送る方法と16枚ずつ送る方法を、このブラウザで測ってみましょう。'};
export const messageSizes=[64,256];
export const messageBatches={single:{name:'１枚ずつ',size:1},batch:{name:'16枚ずつ',size:16}};
export const messageExpected=n=>n*(n+1)*(2*n+1)/6;
export function messageTrial({size,mode,createWorker,now,signal,timeoutMs=15000}){
 if(!messageSizes.includes(size)||!Object.hasOwn(messageBatches,mode)||typeof createWorker!=='function'||typeof now!=='function')return Promise.reject(new RangeError('条件が不正です。'));
 return new Promise((resolve,reject)=>{
  let worker,timer,closed=false,started=false,start=0,first=null,index=0,sequence=0,sum=0;
  const end=(error,result)=>{if(closed)return;closed=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);worker?.terminate();error?reject(error):resolve(result);};
  const abort=()=>end(new Error('測定を中止しました。'));
  if(signal?.aborted){abort();return;}
  try{worker=createWorker();}catch(error){end(error);return;}
  signal?.addEventListener('abort',abort,{once:true});
  timer=setTimeout(()=>end(new Error('測定が時間内に終わりませんでした。')),timeoutMs);
  const send=()=>{const count=Math.min(messageBatches[mode].size,size-index),values=Array.from({length:count},(_,i)=>index+i+1);worker.postMessage({sequence,values});};
  worker.onerror=()=>end(new Error('作業係を開始できませんでした。'));
  worker.onmessage=event=>{if(closed)return;try{const data=event.data;if(!started){if(!data||data.ready!==true)throw new Error('準備の応答が不正です。');started=true;start=now();send();return;}const count=Math.min(messageBatches[mode].size,size-index);if(!data||data.sequence!==sequence||data.count!==count||!Number.isSafeInteger(data.sum))throw new Error('応答が不正です。');sum+=data.sum;index+=count;sequence++;const time=now()-start;if(!Number.isFinite(time)||time<0)throw new Error('時刻が不正です。');if(first===null)first=time;if(index===size){if(sum!==messageExpected(size))throw new Error('集計が一致しません。');end(null,{size,mode,messages:sequence,sum,elapsed:time,first});}else send();}catch(error){end(error);}};
 });
}
export function messageBenchmarkCreate(){return {size:64,mode:'single',reports:{'64:single':null,'64:batch':null,'256:single':null,'256:batch':null},reflection:null};}
export function messageBenchmarkDone(q){return Object.values(q.reports).every(Boolean)&&q.reflection==='limits';}
export function messageBenchmarkRestore(q){if(!q||!messageSizes.includes(q.size)||!Object.hasOwn(messageBatches,q.mode)||![null,'limits','universal'].includes(q.reflection)||!q.reports)throw new RangeError('記録が不正です。');const reports={};for(const n of messageSizes)for(const m of Object.keys(messageBatches)){const key=`${n}:${m}`,r=q.reports[key];if(r===null){reports[key]=null;continue;}if(!r||r.size!==n||r.mode!==m||r.messages!==Math.ceil(n/messageBatches[m].size)||r.sum!==messageExpected(n)||!Number.isFinite(r.elapsed)||r.elapsed<0||!Number.isFinite(r.first)||r.first<0||r.first>r.elapsed)throw new RangeError('測定記録が不正です。');reports[key]={size:n,mode:m,messages:r.messages,sum:r.sum,elapsed:r.elapsed,first:r.first};}return {size:q.size,mode:q.mode,reports,reflection:q.reflection};}
