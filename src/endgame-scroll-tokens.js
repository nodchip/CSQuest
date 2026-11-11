import {createLexerTrial,lexerNext,lexerStep,lexerTypes} from './lexer-scroll.js';
export function replayScrollTokens(kind,history){
 if(!['joined','separate','compare'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 let trials={joined:createLexerTrial(),separate:createLexerTrial()},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){trials={joined:createLexerTrial(),separate:createLexerTrial()};continue;}
  if(kind==='compare'&&lexerNext('joined',trials.joined.position)===null&&lexerNext('separate',trials.separate.position)===null&&action==='answer:whole'){done=true;continue;}
  const m=/^(joined|separate):(length:[1-3]|type:(?:keyword|identifier|equal|number)|commit)$/.exec(action);if(!m||kind!=='compare'&&kind!==m[1])return null;
  const id=m[1],t=trials[id];if(lexerNext(id,t.position)===null)return null;
  if(m[2].startsWith('length:')){trials[id]={...t,length:Number(m[2].slice(7))};continue;}
  if(m[2].startsWith('type:')){const type=m[2].slice(5);if(!Object.hasOwn(lexerTypes,type))return null;trials[id]={...t,type};continue;}
  if(t.type===null)return null;const next=lexerStep(id,t,t.length,t.type);if(next.history.length!==t.history.length+1)return null;
  trials[id]={...next,length:1,type:null};if(kind!=='compare'&&lexerNext(id,next.position)===null)done=true;
 }
 return {trials,done};
}
export function advanceScrollTokens(kind,history,action){
 const p=replayScrollTokens(kind,history);if(!p||p.done)return null;
 if(action==='reset')return [];
 const m=/^(joined|separate):(length|type):/.exec(action);let next=[...history];
 if(m){const commit=`${m[1]}:commit`,prefix=`${m[1]}:${m[2]}:`,last=next.lastIndexOf(commit);next=next.filter((x,i)=>i<=last||!x.startsWith(prefix));}
 next.push(action);return replayScrollTokens(kind,next)?next:null;
}
