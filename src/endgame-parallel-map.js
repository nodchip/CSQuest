export const parallelMapCases={map:[[1,2,3,4],[0,2,1,2]],reduce:[[1,2,3,4],[4,0,2,2]],pipeline:[[1,2,3,4],[0,2,1,2]]};
export function replayParallelMap(kind,history){
 const cases=parallelMapCases[kind];if(!cases||!Array.isArray(history))return null;let scene=0,mapped=[],pairs=[null,null],total=null,results=[];
 const reset=()=>{mapped=kind==='reduce'?[...cases[scene]]:cases[scene].map(()=>null);pairs=[null,null];total=null;};reset();
 for(const action of history){const values=cases[scene];if(!values||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const m=/^map:([0-3])$/.exec(action);if(m&&kind!=='reduce'){const i=Number(m[1]);if(mapped[i]!==null)return null;mapped[i]=values[i]*2;continue;}
  if(action==='pair:0'||action==='pair:1'){const i=Number(action.at(-1));if(kind==='map'||mapped.some(x=>x===null)||pairs[i]!==null)return null;pairs[i]=mapped[2*i]+mapped[2*i+1];continue;}
  if(action==='combine'){if(kind==='map'||pairs.some(x=>x===null)||total!==null)return null;total=pairs[0]+pairs[1];continue;}
  if(action==='check'&&(kind==='map'?mapped.every(x=>x!==null):total!==null)){results.push({mapped:[...mapped],pairs:[...pairs],total});scene++;if(cases[scene])reset();continue;}
  return null;
 }
 return {scene,mapped,pairs,total,results,done:scene===cases.length};
}
