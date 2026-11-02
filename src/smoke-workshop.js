import {pressureDivergence} from './pressure-projection.js';
export const smokeLabLevel={id:'ruin-smoke-workshop',number:'856',kind:'smoke-workshop',name:'四つの部屋の煙工房',tag:'煙の移流と圧力投影',title:'霧を置いて流れを作ろう',story:'遺跡の四つの部屋で、霧の出る場所と風を変えます。出入りを整えた風で霧がどう運ばれるか、順に確かめましょう。'};
export const smokeCells=['A','B','C','D'];
export const smokeWinds={still:{name:'風なし',flows:[0,0,0,0]},push:{name:'A から B へ押す',flows:[2,0,0,0]},spin:{name:'４部屋を回る',flows:[1,-1,1,-1]}};
// Unit square cells, closed outer faces; internal faces are AB, AC, BD, CD.
export function smokeProject(flows){
 if(!Array.isArray(flows)||flows.length!==4||!flows.every(Number.isFinite))throw new RangeError('風が不正です。');
 const [ab,ac,bd,cd]=flows,k=(ab-ac+bd-cd)/4,after=[k,-k,k,-k].map(v=>v===0?0:v),p=[0,ab-k,ac+k,ab+bd-2*k].map(v=>v===0?0:v);
 return {pressure:p,beforeDivergence:pressureDivergence(flows),after,afterDivergence:pressureDivergence(after)};
}
function smokeSample(density,x,y){const a=Math.max(0,Math.min(1,x)),b=Math.max(0,Math.min(1,y));return density[0]*(1-a)*(1-b)+density[1]*a*(1-b)+density[2]*(1-a)*b+density[3]*a*b;}
export function smokeAdvect(density,flows){
 if(!Array.isArray(density)||density.length!==4||!density.every(v=>Number.isFinite(v)&&v>=0&&v<=4)||!Array.isArray(flows)||flows.length!==4||!flows.every(Number.isFinite))throw new RangeError('煙か風が不正です。');
 return density.map((_,i)=>{const x=i%2,y=Math.floor(i/2),u=(y===0?flows[0]:flows[3])/2,v=(x===0?flows[1]:flows[2])/2;return smokeSample(density,x-u,y-v);});
}
export function smokeReplay(history){
 if(!Array.isArray(history)||history.length>60)throw new RangeError('記録が不正です。');
 const s={density:[0,0,0,0],flows:[0,0,0,0],wind:'still',frame:0,sources:[],seen:{push:false,spin:false},last:null,message:'煙を置き、風を選びましょう。'};
 for(const action of history){
  if(typeof action!=='string')throw new RangeError('操作が不正です。');
  if(action.startsWith('emit:')){const id=action.slice(5),i=smokeCells.indexOf(id);if(i<0)throw new RangeError('部屋が不正です。');s.density[i]=Math.min(4,s.density[i]+2);if(!s.sources.includes(id))s.sources.push(id);s.last=null;s.message=`${id} に煙を置きました。`;}
  else if(action.startsWith('wind:')){const id=action.slice(5);if(!Object.hasOwn(smokeWinds,id))throw new RangeError('風が不正です。');s.wind=id;s.flows=[...smokeWinds[id].flows];s.last=null;s.message='風を選びました。次の刻みで出入りを整えます。';}
  else if(action==='step'){
   if(s.frame>=5)s.message='５刻みまで進みました。最初からやり直せます。';
   else if(s.density.every(v=>v===0))s.message='先に少なくとも一つの部屋に煙を置きましょう。';
   else {const projection=smokeProject(s.flows),before=[...s.density],after=smokeAdvect(before,projection.after);s.flows=projection.after;s.density=after;s.frame++;if(s.wind==='push'||s.wind==='spin')s.seen[s.wind]=true;s.last={before,projection,after:[...after]};s.message='出入りを整え、前の煙を逆にたどって更新しました。';}
  }else throw new RangeError('操作が不正です。');
 }
 return s;
}
export function smokeLabCreate(){return {history:[],answer:null};}
export function smokeLabStep(q,action){if(q.history.length>=60)throw new RangeError('操作が多すぎます。');smokeReplay([...q.history,action]);q.history.push(action);}
export function smokeLabComplete(q){const s=smokeReplay(q.history);return s.sources.length>=2&&s.seen.push&&s.seen.spin&&q.answer==='projection';}
export function smokeLabRestore(q){if(!q||![null,'projection','stop','complete'].includes(q.answer))throw new RangeError('記録が不正です。');smokeReplay(q.history);return {history:[...q.history],answer:q.answer};}
