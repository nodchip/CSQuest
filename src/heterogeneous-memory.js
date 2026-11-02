export const heteroLevel={id:'workshop-heterogeneous-memory',number:'873',kind:'heterogeneous-memory',name:'二つの工房と魔石の記録',tag:'異種メモリとデータ移動',title:'魔石の記録を届けよう',story:'人の工房と精霊の工房が一枚の記録を順に使います。記録の届け方と仕事の順を変え、運搬を比べましょう。'};
export const heteroCases={grouped:{name:'精霊の仕事を続ける',steps:['cpu-write','gpu-add','gpu-add','cpu-read']},alternating:{name:'工房を交互に使う',steps:['cpu-write','gpu-add','cpu-read','gpu-add']}};
export const heteroModes={explicit:'別々の記録・手動コピー',shared:'共有する記録・自動移動'};
export const heteroLabels={'cpu-write':'人が１を書き込む','gpu-add':'精霊が１を足す','cpu-read':'人が値を読む'};
export function heteroReplay(scenario,mode,actions){
 if(!Object.hasOwn(heteroCases,scenario)||!Object.hasOwn(heteroModes,mode)||!Array.isArray(actions))throw new RangeError('条件が不正です。');
 const steps=heteroCases[scenario].steps;let next=0,cpu=0,gpu=0,latest='cpu',resident='cpu',moves=0,read=null,cpuValid=true,gpuValid=false;
 for(const action of actions){
  if(next>=steps.length)throw new RangeError('仕事は終了しています。');
  const op=steps[next],device=op.startsWith('cpu')?'cpu':'gpu';
  if(action==='copy'){
   if(mode!=='explicit'||(device==='cpu'?cpuValid:gpuValid))throw new RangeError('今はコピーが不要です。');
   if(device==='cpu'){cpu=gpu;cpuValid=true;}else{gpu=cpu;gpuValid=true;}moves++;
  }else if(action==='step'){
   if(mode==='explicit'&&!(device==='cpu'?cpuValid:gpuValid))throw new RangeError('先に最新の記録をコピーしましょう。');
   if(mode==='shared'&&device!==resident){resident=device;moves++;}
   if(op==='cpu-write'){cpu=1;latest='cpu';cpuValid=true;gpuValid=false;}
   else if(op==='gpu-add'){if(mode==='shared')gpu=cpu;gpu++;if(mode==='shared')cpu=gpu;latest='gpu';gpuValid=true;cpuValid=false;}
   else read=cpu;
   next++;
  }else throw new RangeError('操作が不正です。');
 }
 return {next,cpu,gpu,latest,resident,moves,read,done:next===steps.length,needsCopy:mode==='explicit'&&next<steps.length&&!(steps[next].startsWith('cpu')?cpuValid:gpuValid),cpuValid,gpuValid};
}
export function heteroCreate(){return {scenario:'grouped',mode:'explicit',trials:{grouped:{explicit:[],shared:[]},alternating:{explicit:[],shared:[]}},answer:null};}
export function heteroComplete(q){return Object.keys(heteroCases).every(s=>Object.keys(heteroModes).every(m=>heteroReplay(s,m,q.trials[s][m]).done))&&q.answer==='depends';}
export function heteroRestore(q){if(!q||!Object.hasOwn(heteroCases,q.scenario)||!Object.hasOwn(heteroModes,q.mode)||![null,'depends','free','physical'].includes(q.answer))throw new RangeError('記録が不正です。');const out=heteroCreate();out.scenario=q.scenario;out.mode=q.mode;out.answer=q.answer;for(const s of Object.keys(heteroCases))for(const m of Object.keys(heteroModes)){const actions=q.trials?.[s]?.[m];heteroReplay(s,m,actions);out.trials[s][m]=[...actions];}return out;}
