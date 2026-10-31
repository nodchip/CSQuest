export const packetPipelineLevel={id:'forest-packet-pipeline',number:'272',kind:'packet-pipeline',name:'二つの橋をつなぐ',tag:'蓄積転送とパイプライン',title:'三通を四刻で届けよう',story:'森から中継塔、塔から村へと二つの橋を使い、伝令を届けます。'};
export function packetPipelineRun(history){
 if(!Array.isArray(history)||history.length>4)throw new RangeError('記録が不正です。');
 const source=['Ａ','Ｂ','Ｃ'],tower=[],delivered=[],events=[];
 for(const action of history){if(!action||typeof action.up!=='boolean'||typeof action.down!=='boolean'||action.up&&source.length===0||action.down&&tower.length===0)throw new RangeError('その区間には送れる伝令がありません。');
  const up=action.up?source.shift():null,down=action.down?tower.shift():null;
  if(up)tower.push(up);if(down)delivered.push(down);events.push({up,down,source:[...source],tower:[...tower],delivered:[...delivered]});
 }
 return {source,tower,delivered,events};
}
export function createPacketPipeline(){return {history:[],up:false,down:false};}
export function packetPipelineComplete(s){return s.history.length===4&&packetPipelineRun(s.history).delivered.length===3;}
export function restorePacketPipeline(saved){if(!saved||typeof saved.up!=='boolean'||typeof saved.down!=='boolean')throw new RangeError('途中記録が不正です。');packetPipelineRun(saved.history);return {history:saved.history.map(a=>({up:a.up,down:a.down})),up:saved.up,down:saved.down};}
