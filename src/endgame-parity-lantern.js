export function replayParityLantern(kind,history){
 if(!['make','single','double'].includes(kind)||!Array.isArray(history)||history.length>32)return null;
 let bits=kind==='make'?[1,1,1,0]:[1,0,1,0],flips=[],checked=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){bits=kind==='make'?[1,1,1,0]:[1,0,1,0];flips=[];checked=false;continue;}
  const m=/^flip:([1-4])$/.exec(action);
  if(m&&!checked){const i=Number(m[1])-1;if(kind==='make'&&i!==3)return null;bits[i]^=1;flips=flips.includes(i)?flips.filter(x=>x!==i):[...flips,i];continue;}
  if(action==='check'&&!checked){if(kind==='make'){if(bits.reduce((a,b)=>a+b,0)%2!==0)return null;done=true;}else {if(flips.length!==(kind==='single'?1:2))return null;checked=true;}continue;}
  if(checked&&action===(kind==='single'?'answer:detected':'answer:undetected')){done=true;continue;}
  return null;
 }
 return {bits,flips,checked,done,odd:bits.reduce((a,b)=>a+b,0)%2===1};
}
