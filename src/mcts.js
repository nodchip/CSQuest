const MAX_SIMULATIONS=32;
const makeNode=(stones,turn)=>({stones,turn,visits:0,wins:0,children:[]});
const other=turn=>turn==='player'?'guardian':'player';
const moves=stones=>[1,2].filter(n=>n<=stones);
const children=node=>moves(node.stones).map(move=>({move,node:makeNode(node.stones-move,other(node.turn))}));

export function createMcts(){const root=makeNode(7,'player');root.children=children(root);return {root,seed:123456789,history:[],last:null,answer:null,best:null,checked:false};}
function value(parent,child){if(child.visits===0)return Infinity;const mean=child.wins/child.visits,own=parent.turn==='player'?mean:1-mean;return own+Math.sqrt(2*Math.log(parent.visits)/child.visits);}
export function mctsScores(state){return state.root.children.map(({move,node})=>({move,visits:node.visits,wins:node.wins,score:value(state.root,node)}));}
export function mctsAllowed(state){const scores=mctsScores(state),unvisited=scores.filter(x=>x.visits===0);if(unvisited.length)return unvisited.map(x=>x.move);const best=Math.max(...scores.map(x=>x.score));return scores.filter(x=>Math.abs(x.score-best)<1e-12).map(x=>x.move);}
export function mctsBestMoves(state){const scores=mctsScores(state),best=Math.max(...scores.map(x=>x.visits));return scores.filter(x=>x.visits===best).map(x=>x.move);}
export function mctsStep(state,move){
 if(![1,2].includes(move)||state.history.length>=MAX_SIMULATIONS)return {ok:false,message:'試行できません。'};
 if(!mctsAllowed(state).includes(move))return {ok:false,message:'未試行の手があれば優先し、それ以外は選択値が最大の手を選びましょう。'};
 const s=JSON.parse(JSON.stringify(state)),root=s.root,branch=root.children.find(x=>x.move===move),path=[root,branch.node],treeMoves=[move];let node=branch.node;
 while(node.visits>0&&node.stones>0){
  if(!node.children.length)node.children=children(node);
  const unexplored=node.children.find(c=>c.node.visits===0);
  const chosen=unexplored??node.children.reduce((best,c)=>value(node,c.node)>value(node,best.node)?c:best);
  treeMoves.push(chosen.move);node=chosen.node;path.push(node);
 }
 let stones=node.stones,turn=node.turn,seed=s.seed;const rollout=[];
 while(stones>0){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const legal=moves(stones),take=legal[(seed>>>31)%legal.length];rollout.push({turn,take});stones-=take;turn=other(turn);}
 const winner=other(turn),reward=winner==='player'?1:0;for(const n of path){n.visits++;n.wins+=reward;}
 s.seed=seed;s.history.push(move);s.last={treeMoves,rollout,winner};s.checked=false;return {ok:true,state:s,message:'選択・展開・試行・集計を１回行いました。'};
}
export function mctsComplete(s){return s.history.length>=12&&s.answer==='sample'&&mctsBestMoves(s).includes(s.best)&&s.checked;}
export function restoreMcts(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>MAX_SIMULATIONS||![null,'sample','guaranteed'].includes(saved.answer)||![null,1,2].includes(saved.best)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');let s=createMcts();for(const move of saved.history){const r=mctsStep(s,move);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}s.answer=saved.answer;s.best=saved.best;s.checked=saved.checked;return s;}
