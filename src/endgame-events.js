export const eventBindings=[{river:'east',port:'west'},{river:'west',port:'east'}];
export const toggleCases=[{initial:false,presses:2},{initial:true,presses:1}];
export const queueCases=[[{id:'A',type:'river'},{id:'B',type:'port'}],[{id:'B',type:'port'},{id:'A',type:'river'}]];
export function replayEvents(kind,history){
 if(!['register','toggle','queue'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,bindings={river:null,port:null},log=[],rule=null,lit=kind==='toggle'?toggleCases[0].initial:false,presses=0,queue=kind==='queue'?[...queueCases[0]]:[],lights={east:false,west:false},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='register'){
   const bind=/^bind:(river|port):(east|west)$/.exec(action);if(bind){bindings[bind[1]]=bind[2];log=[];continue;}
   const fire=/^fire:(river|port)$/.exec(action);if(fire){const type=fire[1];log.push({type,light:bindings[type]});continue;}
   if(action==='check'&&Object.keys(bindings).every(k=>bindings[k]===eventBindings[scene][k])&&['river','port'].every(t=>log.some(x=>x.type===t&&x.light===bindings[t]))){scene++;done=scene===eventBindings.length;if(!done){bindings={river:null,port:null};log=[];}continue;}
   return null;
  }
  if(kind==='toggle'){
   const choice=/^rule:(toggle|on|off)$/.exec(action);if(choice){rule=choice[1];lit=toggleCases[scene].initial;presses=0;continue;}
   if(action==='press'&&rule&&presses<toggleCases[scene].presses){lit=rule==='toggle'?!lit:rule==='on';presses++;continue;}
   if(action==='reset'){lit=toggleCases[scene].initial;presses=0;continue;}
   if(action==='check'&&rule==='toggle'&&presses===toggleCases[scene].presses&&lit===false){scene++;done=scene===toggleCases.length;if(!done){rule=null;lit=toggleCases[scene].initial;presses=0;}continue;}
   return null;
  }
  if(action==='dispatch'&&queue.length){const item=queue.shift(),light=item.type==='river'?'east':'west';lights[light]=true;log.push({...item,light});continue;}
  if(action==='next'&&!queue.length){scene++;done=scene===queueCases.length;if(!done){queue=[...queueCases[scene]];lights={east:false,west:false};log=[];}continue;}
  return null;
 }
 return {scene,bindings,log,rule,lit,presses,queue,lights,done};
}
