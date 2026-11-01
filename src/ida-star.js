import {guidedRoads} from './astar.js';

// The graph is acyclic and finite; each frontier item is a path, not a globally closed node.
export const idaEstimate={S:3,A:2,B:4,C:1,G:0};
const root=()=>({place:'S',path:['S'],cost:0});
const clone=stack=>stack.map(x=>({...x,path:[...x.path]}));
export function makeIdaTrace(){
 let threshold=idaEstimate.S,excess=Infinity,stack=[root()],checks=0,message='入口から始めます。',done=false;const trace=[];
 while(true){
  trace.push({threshold,nextThreshold:Number.isFinite(excess)?excess:null,stack:clone(stack),checks,message,done});
  if(done)return trace;
  if(checks>=1000||stack.length===0)throw new Error('探索を続けられません。');
  const current=stack.pop(),f=current.cost+idaEstimate[current.place];checks++;
  if(f>threshold){excess=Math.min(excess,f);message=`${current.path.join('→')} の優先値 ${f} は上限 ${threshold} を超えるため切ります。`;}
  else if(current.place==='G'){done=true;message=`${current.path.join('→')} で遺跡に到着。費用 ${current.cost}。`;}
  else {const children=Object.entries(guidedRoads[current.place]);for(const [place,cost] of children.reverse())stack.push({place,path:[...current.path,place],cost:current.cost+cost});message=`${current.path.join('→')} を調べ、先の道を候補に加えました。`;}
  if(!done&&stack.length===0){if(!Number.isFinite(excess))throw new Error('目標がありません。');threshold=excess;excess=Infinity;stack=[root()];message+=` 候補がなくなったため、超過値の最小 ${threshold} を新しい上限にして入口から再開します。`;}
 }
}
export const idaTrace=makeIdaTrace();
export function advanceIda(position,index){if(!Number.isInteger(position)||position<0||position>=idaTrace.length||idaTrace[position].done||!Number.isInteger(index)||index<0||index>=idaTrace[position].stack.length)throw new RangeError('探索できません。');return index===idaTrace[position].stack.length-1?position+1:position;}
