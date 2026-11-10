export const variableCodes={A:'0',B:'10',C:'11'};
export const fixedCodes={A:'00',B:'01',C:'10'};
export const encodedMessage='011100',plainMessage='ABCA',comparisonMessage='AAAAABBC';
export function encodePrefix(message,codes){return [...message].map(c=>{if(!Object.hasOwn(codes,c))throw Error('invalid');return codes[c];}).join('');}
export function replayPrefixMessage(kind,history){
 if(!['decode','encode','compare'].includes(kind)||!Array.isArray(history))return null;
 let index=0,output='',tried=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){index=0;output='';tried=[];continue;}
  if(kind==='compare'){
   if(action==='try:fixed'||action==='try:variable'){const x=action.slice(4);if(!tried.includes(x))tried.push(x);continue;}
   if(action==='answer:variable'&&tried.includes('fixed')&&tried.includes('variable')){done=true;continue;}
   return null;
  }
  if(action==='check'){
   if(kind==='decode'?index!==encodedMessage.length:index!==plainMessage.length)return null;done=true;continue;
  }
  if(kind==='decode'){
   const m=/^emit:([ABC])$/.exec(action);if(!m||!encodedMessage.slice(index).startsWith(variableCodes[m[1]]))return null;
   const code=variableCodes[m[1]];index+=code.length;output+=m[1];continue;
  }
  const m=/^code:(0|10|11)$/.exec(action);if(!m||index>=plainMessage.length||m[1]!==variableCodes[plainMessage[index]])return null;
  output+=m[1];index++;
 }
 return {index,output,tried,done};
}
