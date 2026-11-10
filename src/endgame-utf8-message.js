import {utfInfo} from './utf8.js';
const ascii=utfInfo('ascii').bytes,kana=utfInfo('kana').bytes;
export const utf8MessageCases={ascii:[{text:'A',bytes:ascii}],kana:[{text:'あ',bytes:kana}],combine:[{text:'Aあ',bytes:[...ascii,...kana]},{text:'あA',bytes:[...kana,...ascii]}]};
export function replayUtf8Message(kind,history){
 if(!Object.hasOwn(utf8MessageCases,kind)||!Array.isArray(history))return null;
 const cases=utf8MessageCases[kind];let scene=0,bytes=[],results=[],verdicts=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===cases.length){
   if(kind==='combine'&&verdicts.length===0&&action==='answer:sameLength'){verdicts.push(action);continue;}
   if(kind==='combine'&&verdicts.length===1&&action==='answer:different'){verdicts.push(action);done=true;continue;}
   return null;
  }
  if(action==='reset'){bytes=[];continue;}
  if(action==='undo'){if(!bytes.length)return null;bytes.pop();continue;}
  const task=cases[scene];
  if(action==='check'){if(bytes.length!==task.bytes.length)return null;results.push({text:task.text,bytes:[...bytes]});scene++;bytes=[];if(scene===cases.length&&kind!=='combine')done=true;continue;}
  const m=/^byte:(41|E3|81|82|80)$/.exec(action);if(!m||m[1]!==task.bytes[bytes.length])return null;bytes.push(m[1]);
 }
 return {scene,bytes,results,verdicts,done};
}
