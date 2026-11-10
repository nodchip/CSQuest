export const transactionCases={
 commit:[{initial:[5,2],amount:2},{initial:[4,1],amount:1}],
 rollback:[{initial:[5,2],amount:2,after:'debit'},{initial:[5,2],amount:2,after:'credit'}],
 isolation:[{initial:[5,2],amount:2,finish:'commit'},{initial:[5,2],amount:2,finish:'rollback'}],
};
export function replayTransaction(kind,history){
 const cases=transactionCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,committed=[],draft=null,phase='idle',rolledBackFrom=null,reads=[],done=false;
 const reset=()=>{committed=[...cases[scene].initial];draft=null;phase='idle';rolledBackFrom=null;reads=[];};reset();
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene];
  if(action==='begin'&&phase==='idle'){draft=[...committed];phase='begun';continue;}
  if(action==='debit'&&phase==='begun'){draft[0]-=c.amount;phase='debit';continue;}
  if(action==='credit'&&phase==='debit'){draft[1]+=c.amount;phase='credit';continue;}
  if(action==='read'&&kind==='isolation'&&['debit','credit','committed','rolledback'].includes(phase)){reads.push({phase,values:[...committed]});continue;}
  if(action==='commit'&&['debit','credit'].includes(phase)){committed=[...draft];draft=null;phase='committed';continue;}
  if(action==='rollback'&&['debit','credit'].includes(phase)){rolledBackFrom=phase;draft=null;phase='rolledback';continue;}
  const before=reads.some(r=>['debit','credit'].includes(r.phase)),after=reads.some(r=>['committed','rolledback'].includes(r.phase));
  const target=[c.initial[0]-c.amount,c.initial[1]+c.amount];
  const correct=kind==='commit'?phase==='committed'&&committed.every((x,i)=>x===target[i]):kind==='rollback'?phase==='rolledback'&&rolledBackFrom===c.after:phase===(c.finish==='commit'?'committed':'rolledback')&&before&&after&&(c.finish==='commit'?committed.every((x,i)=>x===target[i]):rolledBackFrom==='debit');
  if(action==='check'&&correct){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,committed,draft,phase,reads,done};
}
