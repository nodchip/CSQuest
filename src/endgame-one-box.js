import {createSemaphore,stepSemaphore,semaphoreComplete} from './semaphore-buffer.js';
export function replayOneBox(kind,history){
 if(!['empty','full','deliver'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 let state=createSemaphore(),seenConsumer=false,seenProducer=false,resumedConsumer=false,resumedProducer=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){state=createSemaphore();seenConsumer=false;seenProducer=false;resumedConsumer=false;resumedProducer=false;continue;}
  if(action==='check'){const ok=kind==='empty'?resumedConsumer:kind==='full'?resumedProducer:semaphoreComplete(state);if(!ok)return null;done=true;continue;}
  if(!['producer','consumer'].includes(action))return null;
  let next;try{next=stepSemaphore(state,action);}catch{return null;}if(next.history.length!==state.history.length+1)return null;
  state=next;seenConsumer||=state.consumer.blocked;seenProducer||=state.producer.blocked;resumedConsumer||=seenConsumer&&!state.consumer.blocked&&state.consumer.phase==='work';resumedProducer||=seenProducer&&!state.producer.blocked&&state.producer.phase==='work';
 }
 return {state,seenConsumer,seenProducer,resumedConsumer,resumedProducer,done};
}
