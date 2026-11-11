import {signedFormatsCases,encodeSignedFormat} from './signed-formats.js';
export function replaySignedLamps(kind,history){
 if(!['minus','zero','limit'].includes(kind)||!Array.isArray(history)||history.length>60)return null;
 const choices={sign:{mask:0,none:false},twos:{mask:0,none:false}};let done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){for(const c of Object.values(choices)){c.mask=0;c.none=false;}continue;}
  if(action==='check'){
   const valid=['sign','twos'].every(fmt=>{const g=signedFormatsCases[kind].targets[fmt],expected=encodeSignedFormat(g.value,fmt,g.negativeZero??false),c=choices[fmt];return expected===null?c.none:!c.none&&c.mask===expected;});
   if(!valid)return null;done=true;continue;
  }
  const bit=/^toggle:(sign|twos):([0-3])$/.exec(action),none=/^none:(sign|twos)$/.exec(action);
  if(bit){const c=choices[bit[1]];if(c.none)return null;c.mask^=8>>Number(bit[2]);}
  else if(none){const c=choices[none[1]];c.none=!c.none;}
  else return null;
 }
 return {choices,done};
}
