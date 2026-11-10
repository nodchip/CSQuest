export const snapshotCases=[
 {v1:'森の道',v2:'橋の道',draft:'港の道',target:'v1'},
 {v1:'細い道',v2:'広い道',draft:'川の道',target:'v2'}
];
export const mergeCases=[
 {base:{route:'森の道',notice:'注意なし'},a:{route:'橋の道'},b:{notice:'雨に注意'},goal:{route:'橋の道',notice:'雨に注意'}},
 {base:{route:'森の道',notice:'注意なし'},a:{route:'橋の道'},b:{route:'舟の道'},goal:{route:'舟の道',notice:'注意なし'}}
];
export const releaseCases=[{passed:'v1',target:'v2'},{passed:'v2',target:'v1'}];
export function replayVersioning(kind,history){
 if(!['snapshot','merge','release'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,viewed=[],current=null,applied=[],merged={...mergeCases[0].base},conflict=false,pending=false,passed=[releaseCases[0].passed],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){viewed=[];current=null;applied=[];merged={...mergeCases[scene].base};conflict=false;pending=false;passed=[releaseCases[scene].passed];continue;}
  if(kind==='snapshot'){
   const v=/^view:(v[12])$/.exec(action);
   if(v){current=v[1];if(!viewed.includes(current))viewed.push(current);continue;}
   if(action===`choose:${snapshotCases[scene].target}`&&viewed.length===2){scene++;done=scene===snapshotCases.length;viewed=[];current=null;continue;}
   return null;
  }
  if(kind==='merge'){
   const m=/^merge:([ab])$/.exec(action),c=mergeCases[scene];
   if(m&&!applied.includes(m[1])&&!pending){
    const changes=c[m[1]],overlap=Object.keys(changes).some(field=>merged[field]!==c.base[field]&&merged[field]!==changes[field]);
    applied.push(m[1]);if(overlap){conflict=true;pending=true;}else Object.assign(merged,changes);continue;
   }
   const resolved=/^resolve:([ab])$/.exec(action);
   if(resolved&&conflict&&applied.length===2){merged.route=c[resolved[1]].route;pending=false;continue;}
   if(action==='check'&&applied.length===2&&!pending&&Object.keys(c.goal).every(field=>merged[field]===c.goal[field])){scene++;done=scene===mergeCases.length;if(!done)merged={...mergeCases[scene].base};applied=[];conflict=false;pending=false;continue;}
   return null;
  }
  const t=/^test:(v[12])$/.exec(action);
  if(t){if(!passed.includes(t[1]))passed.push(t[1]);continue;}
  if(action===`release:${releaseCases[scene].target}`&&passed.includes(releaseCases[scene].target)){scene++;done=scene===releaseCases.length;if(!done)passed=[releaseCases[scene].passed];continue;}
  return null;
 }
 return {scene,viewed,current,applied,merged,conflict,pending,passed,done};
}
