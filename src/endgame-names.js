// A deliberately small name lookup model; this is not a DNS implementation.
export const nameScenes=[
 {name:'灯花の街の掲示係',time:0,records:[['灯花の街の掲示係',21],['水辺の村の掲示係',35]],goal:'lookup'},
 {name:'水辺の村の掲示係',time:0,records:[['灯花の街の掲示係',21],['水辺の村の掲示係',35]],goal:'lookup'},
 {name:'山の掲示係',time:0,records:[['灯花の街の掲示係',21],['水辺の村の掲示係',35]],goal:'lookup'},
 {name:'灯花の街の掲示係',time:1,records:[['灯花の街の掲示係',21],['水辺の村の掲示係',35]],goal:'cache'},
 {name:'灯花の街の掲示係',time:2,records:[['灯花の街の掲示係',48],['水辺の村の掲示係',35]],goal:'lookup'}
];

// Correct actions are replayed to restore both the current lookup and cache.
export function replayNames(history){
 if(!Array.isArray(history))return null;
 let scene=0,phase='start';const cache={},answers=[];
 for(const action of history){
  const s=nameScenes[scene];if(!s||typeof action!=='string')return null;
  const saved=cache[s.name],valid=saved&&s.time<saved.until;
  if(phase==='start'){
   if(action==='cache'&&valid){answers.push(saved.address);scene++;}
   else if(action==='lookup'&&s.goal==='lookup')phase='lookup';
   else return null;
  }else{
   const entry=s.records.find(row=>row[0]===s.name);
   if(!entry&&action==='missing'){answers.push(null);scene++;phase='start';}
   else if(entry&&action===`address:${entry[1]}`){cache[s.name]={address:entry[1],until:s.time+2};answers.push(entry[1]);scene++;phase='start';}
   else return null;
  }
 }
 return {scene,phase,cache,answers,done:scene===nameScenes.length};
}
