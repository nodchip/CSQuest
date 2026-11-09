// Each example is a finite set of ordered pairs.
const flowers=['赤い花','青い花','白い花'];
export const relationCases={
 relation:[
  {left:flowers,right:['水辺の村','灯花の街'],expected:['0:0','0:1','1:1'],request:'赤い花は水辺の村と灯花の街、青い花は灯花の街に届けます。白い花の届け先はありません。'},
  {left:flowers,right:['水辺の村','灯花の街'],expected:['0:1','2:0'],request:'今度は赤い花を灯花の街、白い花を水辺の村に届けます。青い花の届け先はありません。'}],
 function:[
  {left:flowers,right:['ナギ','ノノ'],expected:['0:0','1:0','2:1'],request:'赤い花と青い花はナギ、白い花はノノが世話をします。'},
  {left:flowers,right:['ナギ','ノノ'],expected:['0:1','1:0','2:0'],request:'今度は赤い花をノノ、青い花と白い花をナギが世話します。'}],
 composition:[
  {left:flowers,right:['棚Ａ','棚Ｂ'],expected:['0:0','1:0','2:1'],request:'花と世話役は、赤→ナギ、青→ナギ、白→ノノ。世話役と棚は、ナギ→棚Ａ、ノノ→棚Ｂです。'},
  {left:flowers,right:['棚Ａ','棚Ｂ'],expected:['0:1','1:0','2:0'],request:'今度の花と世話役は、赤→ナギ、青→ノノ、白→ノノ。世話役と棚は、ナギ→棚Ｂ、ノノ→棚Ａです。'}]
};
export function replayRelation(kind,history){
 const cases=relationCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0;const chosen=new Set();let done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='check'){
   const expected=cases[scene].expected;if(chosen.size!==expected.length||!expected.every(pair=>chosen.has(pair)))return null;
   scene++;done=scene===cases.length;if(!done)chosen.clear();continue;
  }
  const m=/^pair:([0-2]):([0-1])$/.exec(action);if(!m)return null;
  const pair=`${m[1]}:${m[2]}`;if(chosen.has(pair))chosen.delete(pair);else chosen.add(pair);
 }
 return {scene,chosen:[...chosen],done};
}
