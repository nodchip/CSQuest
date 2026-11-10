export const layerPlaces={workshop:'工房',sky:'中継塔',archive:'文庫',river:'水辺の村',harbor:'港町',windmill:'風車の里',city:'灯花の街'};
export const layerCases={
 wrap:[{destination:'river',next:'sky'},{destination:'city',next:'harbor'}],
 relay:[{here:'sky',destination:'river',next:'archive'},{here:'harbor',destination:'city',next:'windmill'}],
 route:[{route:['workshop','sky','archive','river']},{route:['harbor','windmill','sky','city']}]
};
export function replayLayers(kind,history){
 const cases=layerCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,inner=null,outer=null,hop=0,finished=false,done=false,log=[];
 function reset(){const c=cases[scene];inner=kind==='wrap'?null:kind==='relay'?c.destination:c.route.at(-1);outer=kind==='relay'?c.here:null;hop=0;finished=false;log=[];}
 reset();
 for(const action of history){
  if(typeof action!=='string'||done)return null;const c=cases[scene];
  if(action==='next'&&finished){scene++;done=scene===cases.length;if(!done)reset();continue;}
  if(finished)return null;
  if(action==='reset'){reset();continue;}
  const m=/^(inner|outer):([a-z]+)$/.exec(action);
  if(m&&Object.hasOwn(layerPlaces,m[2])){
   if(m[1]==='inner'&&kind==='wrap'&&outer===null){inner=m[2];continue;}
   if(m[1]==='outer'&&inner!==null&&(kind!=='relay'||outer===null)){outer=m[2];continue;}
   return null;
  }
  if(action==='remove'&&kind==='relay'&&outer!==null){outer=null;continue;}
  if(action==='check'&&kind==='wrap'&&inner===c.destination&&outer===c.next){finished=true;continue;}
  if(action==='send'&&kind==='relay'&&outer===c.next){log.push(outer);finished=true;continue;}
  if(action==='send'&&kind==='route'&&outer===c.route[hop+1]){hop++;log.push(outer);outer=null;if(hop===c.route.length-1)finished=true;continue;}
  return null;
 }
 return {scene,inner,outer,hop,finished,done,log};
}
