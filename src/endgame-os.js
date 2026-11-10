export const osCases={
 queue:[{order:['A','B']},{order:['B','A']}],
 storage:[{value:'花の荷札'},{value:'灯りの荷札'}],
 access:[{value:'Ａの荷札'}]
};
export function replayOs(kind,history){
 const cases=osCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,queue=[],arrivals=[],printed=[],volatile=null,durable=null,rebooted=false,read=null,denied=false,last='',done=false;
 function reset(){queue=[];arrivals=[];printed=[];volatile=null;durable=null;rebooted=false;read=null;denied=false;last='';}
 for(const action of history){
  if(typeof action!=='string'||done)return null;const task=cases[scene];
  if(action==='reset'){reset();continue;}
  if(action==='check'){
   const ok=kind==='queue'?arrivals.join(',')===task.order.join(',')&&printed.join(',')===task.order.join(','):kind==='storage'?rebooted&&durable===task.value&&read===task.value:rebooted&&durable===task.value&&denied&&read===task.value;
   if(!ok)return null;scene++;done=scene===cases.length;if(!done)reset();continue;
  }
  if(kind==='queue'){
   const m=/^arrive:(A|B)$/.exec(action);if(m&&!arrivals.includes(m[1])){arrivals.push(m[1]);queue.push(m[1]);last=`仕事${m[1]}の依頼を窓口で受け付けました。`;continue;}
   if(action==='print'&&queue.length){const who=queue.shift();printed.push(who);last=`仕事${who}の依頼を先に印刷しました。`;continue;}return null;
  }
  if(action==='draft'){volatile=task.value;last='作業中の記録をメモリに置きました。';continue;}
  if(action==='save'&&volatile!==null){durable=volatile;rebooted=false;read=null;denied=false;last='永続棚への保存が完了しました。';continue;}
  if(action==='restart'){volatile=null;rebooted=true;read=null;denied=false;last='再起動し、作業中メモリは空になりました。';continue;}
  if(kind==='storage'&&action==='read'&&rebooted){read=durable;last=durable===null?'棚に記録はありません。':`棚から「${durable}」を読みました。`;continue;}
  if(kind==='access'&&action==='read:B'&&rebooted){denied=true;last='Ｂは許可がないため、読み取りを拒否されました。';continue;}
  if(kind==='access'&&action==='read:A'&&rebooted){read=durable;last=durable===null?'棚に記録はありません。':`Ａは「${durable}」を読みました。`;continue;}
  return null;
 }
 return {scene,queue,arrivals,printed,volatile,durable,rebooted,read,denied,last,done};
}
