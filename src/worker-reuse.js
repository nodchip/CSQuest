import {messageExpected} from './message-benchmark.js';
export const workerReuseLevel={id:'forest-worker-reuse',number:'1287',kind:'worker-reuse',name:'作業係を雇い直す？',tag:'資源管理とオーバーヘッド',title:'係を作り直すか、続けて頼むか',story:'森の工房は小さな仕事を順番に頼みます。仕事ごとに係を作る方法と、同じ係を再利用する方法を測りましょう。'};
export const workerJobCounts=[8,32];
export const workerReuseModes={fresh:'毎回作り直す',reuse:'１人を再利用する'};
export function workerReuseTrial({jobs,mode,createWorker,now,signal,timeoutMs=30000}){
 if(!workerJobCounts.includes(jobs)||!Object.hasOwn(workerReuseModes,mode)||typeof createWorker!=='function'||typeof now!=='function')return Promise.reject(new RangeError('条件が不正です。'));
 return new Promise((resolve,reject)=>{
  let worker,timer,closed=false,index=0,workers=0,sum=0,start=0,first=null;
  const end=(error,result)=>{if(closed)return;closed=true;clearTimeout(timer);signal?.removeEventListener('abort',abort);worker?.terminate();error?reject(error):resolve(result);};
  const abort=()=>end(new Error('測定を中止しました。'));
  if(signal?.aborted){abort();return;}
  signal?.addEventListener('abort',abort,{once:true});timer=setTimeout(()=>end(new Error('測定が時間内に終わりませんでした。')),timeoutMs);
  const send=()=>{const values=Array.from({length:16},(_,i)=>index*16+i+1);worker.postMessage({sequence:index,values});};
  const spawn=()=>{worker=createWorker();workers++;let ready=false;worker.onerror=()=>end(new Error('作業係を開始できませんでした。'));worker.onmessage=event=>{if(closed)return;try{const data=event.data;if(!ready){if(!data||data.ready!==true)throw new Error('準備の応答が不正です。');ready=true;send();return;}const expected=messageExpected((index+1)*16)-messageExpected(index*16);if(!data||data.sequence!==index||data.count!==16||data.sum!==expected)throw new Error('集計が一致しません。');sum+=data.sum;index++;const time=now()-start;if(!Number.isFinite(time)||time<0)throw new Error('時刻が不正です。');if(first===null)first=time;if(index===jobs){end(null,{jobs,mode,workers,sum,elapsed:time,first});}else if(mode==='fresh'){worker.terminate();worker=null;spawn();}else send();}catch(error){end(error);}};};
  try{start=now();spawn();}catch(error){end(error);}
 });
}
export function workerReuseCreate(){return {jobs:8,mode:'fresh',reports:{'8:fresh':null,'8:reuse':null,'32:fresh':null,'32:reuse':null},reflection:null};}
export function workerReuseDone(q){return Object.values(q.reports).every(Boolean)&&q.reflection==='limits';}
export function workerReuseRestore(q){if(!q||!workerJobCounts.includes(q.jobs)||!Object.hasOwn(workerReuseModes,q.mode)||![null,'limits','universal'].includes(q.reflection)||!q.reports)throw new RangeError('記録が不正です。');const reports={};for(const n of workerJobCounts)for(const m of Object.keys(workerReuseModes)){const key=`${n}:${m}`,r=q.reports[key];if(r===null){reports[key]=null;continue;}if(!r||r.jobs!==n||r.mode!==m||r.workers!==(m==='fresh'?n:1)||r.sum!==messageExpected(n*16)||!Number.isFinite(r.elapsed)||r.elapsed<0||!Number.isFinite(r.first)||r.first<0||r.first>r.elapsed)throw new RangeError('測定記録が不正です。');reports[key]={jobs:n,mode:m,workers:r.workers,sum:r.sum,elapsed:r.elapsed,first:r.first};}return {jobs:q.jobs,mode:q.mode,reports,reflection:q.reflection};}
