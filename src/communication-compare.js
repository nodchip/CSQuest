export const communicationModes={queue:'伝言箱',register:'共有値',map:'鍵付き共有記録'};
export function createCommunication(){return {selected:'queue',histories:{queue:[],register:[],map:[]}};}
export function communicationState(mode,history){
 if(!Object.hasOwn(communicationModes,mode)||!Array.isArray(history)||history.length>4)throw new RangeError('通信記録が不正です。');
 const s={sent:[],reads:[]};
 for(const action of history){
  if(action==='send'&&s.sent.length<2&&s.reads.length===0)s.sent.push(['赤','青'][s.sent.length]);
  else if(s.sent.length===2&&s.reads.length<2&&mode==='queue'&&action==='read')s.reads.push(s.sent[s.reads.length]);
  else if(s.sent.length===2&&s.reads.length<2&&mode==='register'&&action==='read')s.reads.push(s.sent.at(-1));
  else if(s.sent.length===2&&s.reads.length<2&&mode==='map'&&['red','blue'].includes(action))s.reads.push(action==='red'?s.sent[0]:s.sent[1]);
  else throw new RangeError('通信操作が不正です。');
 }
 return s;
}
export function communicationComplete(s){return Object.keys(communicationModes).every(mode=>{const t=communicationState(mode,s.histories[mode]);return t.reads.length===2&&(mode!=='map'||new Set(t.reads).size===2);});}
export function restoreCommunication(saved){
 if(!saved||!Object.hasOwn(communicationModes,saved.selected)||!saved.histories)throw new RangeError('通信記録が不正です。');
 const s=createCommunication();s.selected=saved.selected;
 for(const id of Object.keys(communicationModes)){communicationState(id,saved.histories[id]);s.histories[id]=[...saved.histories[id]];}
 return s;
}
