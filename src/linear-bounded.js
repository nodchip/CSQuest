export const linearBoundedLevel={id:'archive-linear-bounded',number:'697',kind:'linear-bounded',name:'三色の巻物と限られた帯',tag:'線形拘束オートマトン',title:'帯の中で三色を照合しよう',story:'門番の機械は巻物の外に新しい書き場所を作れません。三色を一つずつ印付けして、同じ数か調べましょう。'};

// The position at length denotes the right boundary, not a writable tape cell.
export function boundedTrace(a,b,c,steps=128){
 if(![a,b,c].every(n=>Number.isInteger(n)&&n>=0&&n<=3)||!Number.isInteger(steps)||steps<0||steps>128)throw new RangeError('入力または手数が不正です。');
 const tape=[...'a'.repeat(a)+'b'.repeat(b)+'c'.repeat(c)]; let head=0,phase='a',count=0;
 while(count<steps&&!['accept','reject'].includes(phase)){
  const ch=tape[head];
  if(phase==='a'){
   if(head===tape.length)phase='accept';
   else if(ch==='X')head++;
   else if(ch==='a'){tape[head]='X';head++;phase='b';}
   else phase='verify';
  }else if(phase==='b'){
   if(head===tape.length)phase='reject';
   else if(ch==='a'||ch==='Y')head++;
   else if(ch==='b'){tape[head]='Y';head++;phase='c';}
   else phase='reject';
  }else if(phase==='c'){
   if(head===tape.length)phase='reject';
   else if(ch==='b'||ch==='Z')head++;
   else if(ch==='c'){tape[head]='Z';phase='return';}
   else phase='reject';
  }else if(phase==='return'){
   if(head===0)phase='a';else head--;
  }else if(phase==='verify'){
   if(head===tape.length)phase='accept';
   else if(['X','Y','Z'].includes(ch))head++;
   else phase='reject';
  }
  count++;
 }
 return {tape,head,phase,steps:count};
}
export function createLinearBounded(){return {a:2,b:2,c:2,steps:0,observed:[],answer:null,checked:false};}
export function linearBoundedComplete(s){return s.checked&&['2,2,2','2,2,1','0,0,0'].every(k=>s.observed.includes(k))&&s.answer==='bounded';}
export function restoreLinearBounded(s){
 if(!s||![s.a,s.b,s.c].every(n=>Number.isInteger(n)&&n>=0&&n<=3)||!Number.isInteger(s.steps)||s.steps<0||s.steps>128||s.steps>boundedTrace(s.a,s.b,s.c).steps||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!/^([0-3]),([0-3]),([0-3])$/.test(k))||![null,'bounded','constant','unbounded'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
