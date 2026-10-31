export const bidirectionalLevel={id:'forest-bidirectional-search',number:'371',kind:'bidirectional-search',name:'両端からつなぐ道',tag:'双方向幅優先探索',title:'使者と灯火の道をつなごう',story:'霧の森の道は一方通行です。使者と灯火の両側から道を調べ、出会った場所で経路をつなぎましょう。'};
export const roads={S:['A','B'],A:['C','K'],B:['D','J'],C:['M','L'],D:['E','N'],M:['F'],E:['H'],F:['T'],H:['I'],I:['T'],K:[],J:[],L:[],N:[],T:[]};
export const nodes=Object.keys(roads);
export const predecessors=Object.fromEntries(nodes.map(n=>[n,nodes.filter(p=>roads[p].includes(n))]));
export function searchLayers(mode){
 if(!['one','both'].includes(mode))throw new RangeError('探索方法が不正です');
 let forward=['S'],backward=['T'],seenF=new Set(forward),seenB=new Set(backward),expanded=0,turn='forward',trace=[];
 const snapshot=(done=false,meeting=null)=>({forward:[...forward],backward:[...backward],seenF:[...seenF],seenB:[...seenB],expanded,turn,done,meeting});
 trace.push(snapshot());
 while(forward.length&&(mode==='one'||backward.length)){
  const from=turn==='forward'?forward:backward,seen=turn==='forward'?seenF:seenB,links=turn==='forward'?roads:predecessors,next=[];
  for(const node of from){expanded++;for(const n of links[node])if(!seen.has(n)){seen.add(n);next.push(n);}}
  if(turn==='forward')forward=next;else backward=next;
  const meeting=mode==='one'?(seenF.has('T')?'T':null):[...seenF].find(n=>seenB.has(n))||null;
  if(meeting){trace.push(snapshot(true,meeting));break;}
  if(mode==='both')turn=turn==='forward'?'backward':'forward';
  trace.push(snapshot());
 }
 return trace;
}
export const searchTraces={one:searchLayers('one'),both:searchLayers('both')};
export function createBidirectional(){return {mode:'one',positions:{one:0,both:0},path:['S'],answer:null,checked:false};}
export function validRoute(path){return path.length===6&&path[0]==='S'&&path.at(-1)==='T'&&path.slice(1).every((n,i)=>roads[path[i]].includes(n));}
export function bidirectionalComplete(s){return Object.keys(searchTraces).every(k=>searchTraces[k][s.positions[k]].done)&&validRoute(s.path)&&s.answer==='incoming'&&s.checked;}
export function restoreBidirectional(s){if(!s||!Object.hasOwn(searchTraces,s.mode)||!s.positions||!Array.isArray(s.path)||s.path.length<1||s.path.length>8||s.path[0]!=='S'||s.path.some(x=>!nodes.includes(x))||![null,'incoming','outgoing'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');const n=createBidirectional();n.mode=s.mode;n.path=[...s.path];n.answer=s.answer;n.checked=s.checked;for(const k of Object.keys(searchTraces)){const v=s.positions[k];if(!Number.isInteger(v)||v<0||v>=searchTraces[k].length)throw new RangeError('途中記録が不正です');n.positions[k]=v;}return n;}
