export const actualBenchmarkLevel={id:'forge-actual-benchmark',number:'1097',kind:'actual-benchmark',name:'実測する二つの探索',tag:'ベンチマークと時間測定',title:'二つの探し方を実際に測ろう',story:'工房の記録係が、整列した棚から品を探す二つの方法を比べます。あなたのブラウザーで時間を測り、結果の扱い方を考えましょう。'};
export const benchmarkSize=8192,benchmarkQueries=512;
const items=Uint32Array.from({length:benchmarkSize},(_,i)=>i*2),queries=Uint32Array.from({length:benchmarkQueries},(_,i)=>(i*257+123)%benchmarkSize);
export const benchmarkChecksum=queries.reduce((a,b)=>a+b,0);
export function benchmarkSearch(kind,values,targets){
 if(!['linear','binary'].includes(kind))throw new RangeError('探索方法が不正です');let sum=0;
 for(const target of targets){let found=-1;if(kind==='linear'){for(let i=0;i<values.length;i++){if(values[i]===target){found=i;break;}}}else{let left=0,right=values.length-1;while(left<=right){const mid=(left+right)>>1;if(values[mid]===target){found=mid;break;}if(values[mid]<target)left=mid+1;else right=mid-1;}}sum+=found;}
 return sum;
}
export function benchmarkPair(index,clock){
 if(!Number.isInteger(index)||index<0||index>9||typeof clock!=='function')throw new RangeError('測定条件が不正です');const targets=queries.map(i=>items[i]),first=index%2===0?'linear':'binary',order=first==='linear'?['linear','binary']:['binary','linear'],durations={};let checksum=null;
 for(const kind of order){const begin=clock(),sum=benchmarkSearch(kind,items,targets),end=clock();if(!Number.isFinite(begin)||!Number.isFinite(end)||end<begin||sum!==benchmarkChecksum)throw new RangeError('計測か探索結果を確認できません');durations[kind]=end-begin;checksum=sum;}
 return {first,linearMs:durations.linear,binaryMs:durations.binary,checksum};
}
export function actualBenchmarkCreate(){return {warmed:false,samples:[],reflection:null,timer:null};}
export function actualBenchmarkRestore(q){if(!q||typeof q.warmed!=='boolean'||!Array.isArray(q.samples)||q.samples.length>10||!q.samples.every((s,i)=>s&&s.first===(i%2===0?'linear':'binary')&&Number.isFinite(s.linearMs)&&s.linearMs>=0&&Number.isFinite(s.binaryMs)&&s.binaryMs>=0&&s.checksum===benchmarkChecksum)||(!q.warmed&&q.samples.length)||![null,'context','universal'].includes(q.reflection)||![null,'resolution','exact'].includes(q.timer))throw new RangeError('途中記録が不正です');return {warmed:q.warmed,samples:q.samples.map(s=>({...s})),reflection:q.reflection,timer:q.timer};}
export function actualBenchmarkDone(q){return q.warmed&&q.samples.length>=3&&q.reflection==='context'&&q.timer==='resolution';}
