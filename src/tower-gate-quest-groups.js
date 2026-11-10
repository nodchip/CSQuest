const groups={
 sky:[
  {id:'local',title:'知らせを中継する',local:true,quests:['tower-forward','tower-packets','tower-retry']},
  {id:'http',title:'塔の記録を受け取る',quests:['tower-http-request','tower-http-compare','tower-http-repair']},
  {id:'layers',title:'重ねた荷札を届ける',quests:['tower-layers-wrap','tower-layers-relay','tower-layers-route']},
  {id:'crypto',title:'知らせを守る',quests:['tower-crypto-encrypt','tower-crypto-digest','tower-crypto-integrity']},
  {id:'events',title:'知らせと灯りを動かす',quests:['tower-events-register','tower-events-toggle','tower-events-queue']},
  {id:'address',title:'宛先と送信口を確かめる',quests:['tower-name-lab','tower-queue-lab']},
 ],
 mist:[
  {id:'local',title:'送り主と記録を確かめる',local:true,quests:['gate-verify','gate-access','gate-integrity']},
  {id:'automata',title:'関所の合図機を作る',quests:['gate-automata-even','gate-automata-last','gate-automata-both']},
  {id:'security',title:'帳面を守る仕掛けを確かめる',quests:['gate-access-lab','gate-paths-lab']},
 ],
};
const prerequisites={
 'tower-http-repair':['tower-http-request','tower-http-compare'],
 'tower-layers-route':['tower-layers-wrap','tower-layers-relay'],
 'tower-crypto-integrity':['tower-crypto-encrypt','tower-crypto-digest'],
 'tower-events-queue':['tower-events-register','tower-events-toggle'],
 'gate-automata-both':['gate-automata-even','gate-automata-last'],
};
export function towerGateQuestGroups(region,completed,endgameAvailable){
 const done=new Set(completed);
 return groups[region].map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
