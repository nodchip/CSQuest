export const stackScripts={
 stack:['peek','pop','push:A','push:B','peek','pop','push:A','pop','pop','pop','check'],
 compare:['take:stack','take:queue','take:stack','take:queue','take:stack','take:queue','check'],
 undo:['add:月','add:星','undo','add:風','undo','undo','undo','check']
};
export function stackPop(values){if(!Array.isArray(values))return null;return values.length?{value:values.at(-1),rest:values.slice(0,-1)}:{value:null,rest:[]};}
export function replayStack(kind,history){
 const script=stackScripts[kind];if(!script||!Array.isArray(history))return null;
 const fresh=()=>({step:0,stack:kind==='compare'?['A','B','C']:[],queue:kind==='compare'?['A','B','C']:[],doc:'',undoStack:[],removed:[],last:'',done:false});let s=fresh();
 for(const action of history){if(typeof action!=='string'||s.done)return null;if(action==='reset'){s=fresh();continue;}if(action!==script[s.step])return null;
  if(action.startsWith('push:')){const v=action.slice(5);s.stack.push(v);s.last=`${v}を一番上に積みました`;}
  else if(action==='peek'){s.last=s.stack.length?`一番上は${s.stack.at(-1)}です。札は残ります`:'山札は空です';}
  else if(action==='pop'||action==='take:stack'){const out=stackPop(s.stack);s.stack=out.rest;s.removed.push(out.value);s.last=out.value===null?'山札は空なので取り出せません':`山札から${out.value}を取り出しました`;}
  else if(action==='take:queue'){const value=s.queue.length?s.queue.shift():null;s.removed.push(value);s.last=value===null?'待ち列は空なので取り出せません':`待ち列から${value}を取り出しました`;}
  else if(action.startsWith('add:')){const token=action.slice(4);s.undoStack.push(s.doc);s.doc+=token;s.last=`${token}を書き加えました`;}
  else if(action==='undo'){const out=stackPop(s.undoStack);s.undoStack=out.rest;if(out.value===null)s.last='戻せる編集がありません';else{s.doc=out.value;s.last='直前の編集を戻しました';}}
  else if(action==='check'){s.done=true;s.last='場面を確かめました';}
  else return null;
  s.step++;
 }
 return s;
}
