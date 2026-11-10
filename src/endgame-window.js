// Three fixed letters; acknowledgements are generated at receipt, then delivered explicitly.
export const windowScripts={
 clean:['send:1','send:2','send:3','ack:3'],
 gap:['send:1','send:2','send:3','ack:1'],
 retry:['send:1','send:2','send:3','ack:1','timeout','resend:2','resend:3','ack:3']
};
export function replayWindow(kind,history){
 const script=windowScripts[kind];if(!script||!Array.isArray(history)||history.length>script.length)return null;
 const s={base:1,sent:[],received:[],discarded:[],pendingAcks:[],deliveredAcks:[],timedOut:false,last:''};
 for(let i=0;i<history.length;i++){
  const action=history[i];if(action!==script[i])return null;const [op,num]=action.split(':'),n=Number(num);
  if(op==='send'||op==='resend'){
   if(op==='send'&&(n<s.base||n>=s.base+3||s.sent.includes(n)))return null;
   if(op==='resend'&&(!s.timedOut||!s.sent.includes(n)||n<s.base))return null;
   s.sent.push(n);
   if(kind!=='clean'&&op==='send'&&n===2){s.last='２番が途中で消失';continue;}
   if(n===s.received.length+1){s.received.push(n);s.pendingAcks.push(n);s.last=`${n}番を順番どおり受信`;}
   else{s.discarded.push(n);s.pendingAcks.push(s.received.length);s.last=`${n}番は順序外なので保存せず、${s.received.length}番までの返事を作成`;}
  }else if(op==='ack'){
   if(!s.pendingAcks.includes(n)||n<s.base-1)return null;s.pendingAcks.splice(s.pendingAcks.indexOf(n),1);s.deliveredAcks.push(n);s.base=n+1;s.last=`${n}番までの返事が送信側に到着`;
  }else if(op==='timeout'){
   if(s.base>3)return null;s.timedOut=true;s.last=`最も古い未確認の${s.base}番の時間切れ`;
  }else return null;
 }
 return {state:s,step:history.length,total:script.length,done:history.length===script.length};
}
