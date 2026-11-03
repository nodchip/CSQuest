export const memoryMajorityLevel={id:'workshop-memory-majority',number:'1023',kind:'memory-majority',name:'記憶の中の三枚札',tag:'メモリ内処理と多数決',title:'記録を運ばず論理演算',story:'記憶の塔は二枚の紋章の共通部分と、どちらかが点く部分を探しています。作業用の札で一度に比べましょう。'};
export const majoritySources={A:[1,0,1,0],B:[1,1,0,0]};
export const majorityModes={and:'両方とも点く場所（AND）',or:'どちらかが点く場所（OR）'};
export function majorityColumns(a,b,c){if(![a,b,c].every(row=>Array.isArray(row)&&row.length===4&&row.every(v=>v===0||v===1)))throw new RangeError('作業札が不正です。');return a.map((v,i)=>Number(v+b[i]+c[i]>=2));}
export function majorityReplay(mode,actions){
 if(!Object.hasOwn(majorityModes,mode)||!Array.isArray(actions)||actions.length>5)throw new RangeError('記録が不正です。');
 let a=null,b=null,c=null,activated=false,stored=false,result=null;
 for(const action of actions){
  if(action==='copy-a'&&a===null&&!activated)a=[...majoritySources.A];
  else if(action==='copy-b'&&b===null&&!activated)b=[...majoritySources.B];
  else if((action==='fill-0'||action==='fill-1')&&c===null&&!activated)c=Array(4).fill(action==='fill-1'?1:0);
  else if(action==='activate'&&a&&b&&c&&!activated){result=majorityColumns(a,b,c);a=[...result];b=[...result];c=[...result];activated=true;}
  else if(action==='store'&&activated&&!stored)stored=true;
  else throw new RangeError('作業の順番を確認しましょう。');
 }
 const expected=majoritySources.A.map((v,i)=>mode==='and'?v&majoritySources.B[i]:v|majoritySources.B[i]);
 return {a,b,c,result,activated,stored,expected,correct:stored&&result.every((v,i)=>v===expected[i])};
}
export function majorityCreate(){return {mode:'and',runs:{and:[],or:[]},reflection:null};}
export function majorityComplete(q){return Object.keys(majorityModes).every(m=>majorityReplay(m,q.runs[m]).correct)&&q.reflection==='limited';}
export function majorityRestore(q){if(!q||!Object.hasOwn(majorityModes,q.mode)||!q.runs||![null,'limited','nochange','universal'].includes(q.reflection))throw new RangeError('途中記録が不正です。');const r=majorityCreate();r.mode=q.mode;r.reflection=q.reflection;for(const m of Object.keys(majorityModes)){majorityReplay(m,q.runs[m]);r.runs[m]=[...q.runs[m]];}return r;}
