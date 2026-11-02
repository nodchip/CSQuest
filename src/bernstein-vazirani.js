export const bvLevel={id:'ruin-hidden-seal',number:'821',kind:'bernstein-vazirani',name:'隠れた二つの紋章',tag:'Bernstein–Vazirani 法',title:'二つの紋章を問い合わせで見つけよう',story:'遺跡の精霊は二つの隠れた紋章を持っています。古典の問い合わせと量子の干渉を比べて、どの紋章が光るか調べましょう。'};
export const bvCases={A:'00',B:'01',C:'10',D:'11'};
export const bvInputs=['00','01','10','11'];
export function bvFunction(secret,input){if(!bvInputs.includes(secret)||!bvInputs.includes(input))throw new RangeError('紋章が不正です。');return (Number(secret[0])*Number(input[0])+Number(secret[1])*Number(input[1]))%2;}
export function bvReplay(id,history){
 if(!Object.hasOwn(bvCases,id)||!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です。');
 const secret=bvCases[id],steps=['left','right','prepare','oracle',`guess:${secret}`,'hadamard'];let amplitudes=[1,0,0,0];
 for(let i=0;i<history.length;i++){
  if(history[i]!==steps[i])throw new RangeError('次の操作、または２回の答えと符号の並びを確かめましょう。');
  if(history[i]==='prepare')amplitudes=[.5,.5,.5,.5];
  if(history[i]==='oracle')amplitudes=amplitudes.map((x,j)=>bvFunction(secret,bvInputs[j])?-x:x);
  if(history[i]==='hadamard')amplitudes=bvInputs.map(y=>amplitudes.reduce((sum,a,j)=>sum+(bvFunction(y,bvInputs[j])?-a:a),0)/2);
 }
 return {amplitudes,left:history.length>=1?bvFunction(secret,'10'):null,right:history.length>=2?bvFunction(secret,'01'):null,queries:history.includes('oracle')?1:0,next:steps[history.length]??null};
}
export function bvCreate(){return {caseId:'A',histories:Object.fromEntries(Object.keys(bvCases).map(x=>[x,[]])),answer:null};}
export function bvStep(q,action){const h=q.histories[q.caseId];bvReplay(q.caseId,[...h,action]);h.push(action);}
export function bvComplete(q){return Object.keys(bvCases).every(id=>q.histories[id].length===6&&bvReplay(id,q.histories[id]).next===null)&&q.answer==='promise';}
export function bvRestore(q){if(!q||!Object.hasOwn(bvCases,q.caseId)||!q.histories||![null,'promise','all','measure'].includes(q.answer))throw new RangeError('記録が不正です。');const n=bvCreate();n.caseId=q.caseId;n.answer=q.answer;for(const id of Object.keys(bvCases)){bvReplay(id,q.histories[id]);n.histories[id]=[...q.histories[id]];}return n;}
