const catalogs={
 forge:[
  {id:'lights',title:'灯りと命令を調べる',local:true,quests:['forge-bits','forge-cpu']},
  {id:'storage',title:'記憶の箱と棚を調べる',local:true,quests:['forge-memory','forge-cache']},
  {id:'signedlamps',title:'負の数を灯りで表す',quests:['forge-signedlamps-minus','forge-signedlamps-zero','forge-signedlamps-limit']},
  {id:'writepolicy',title:'記憶の写しを書き戻す',quests:['forge-writepolicy-through','forge-writepolicy-back','forge-writepolicy-compare']},
  {id:'cache',title:'手元の記憶棚を調べる',quests:['forge-cache-temporal','forge-cache-spatial','forge-cache-mapping']},
  {id:'cpu',title:'計算道具を動かす',quests:['forge-cpu-basic','forge-cpu-branch','forge-cpu-data']},
  {id:'switch',title:'スイッチの信号を整える',quests:['forge-switch-raw','forge-switch-filter','forge-switch-compare']},
  {id:'io',title:'装置の完成を受け取る',quests:['forge-io-poll','forge-io-interrupt','forge-io-compare']},
  {id:'objects',title:'灯り道具を組み立てる',quests:['forge-objects-identity','forge-objects-encapsulation','forge-objects-interaction']},
  {id:'rounding-stones',title:'魔石の丸めを調べる',quests:['forge-roundstone-even','forge-roundstone-odd','forge-roundstone-compare']},
  {id:'numbers',title:'灯りの計数器を直す',quests:['forge-integer-unsigned','forge-integer-reading','forge-integer-addition']},
  {id:'boxes',title:'記録の箱と番号札を調べる',quests:['forge-swap-lab','forge-pages-lab']},
 ],
 station:[
  {id:'delivery',title:'荷物を送り出す',local:true,quests:['station-fcfs','station-round','station-sharing']},
  {id:'tools',title:'道具と場所を使う',local:true,quests:['station-lock','station-memory']},
  {id:'priority',title:'急ぎの荷物を選ぶ',quests:['station-heap-queue','station-heap-insert','station-heap-remove','station-schedule-lab']},
  {id:'replacement',title:'記憶の棚を入れ替える',quests:['station-replacement-fifo','station-replacement-lru','station-replacement-compare']},
  {id:'office',title:'駅の共通窓口を使う',quests:['station-os-queue','station-os-storage','station-os-access']},
 ],
};
const prerequisites={
 'forge-signedlamps-limit':['forge-signedlamps-minus','forge-signedlamps-zero'],
 'forge-writepolicy-compare':['forge-writepolicy-through','forge-writepolicy-back'],
 'forge-cache-mapping':['forge-cache-temporal','forge-cache-spatial'],
 'forge-cpu-data':['forge-cpu-basic','forge-cpu-branch'],
 'forge-switch-compare':['forge-switch-raw','forge-switch-filter'],
 'forge-io-compare':['forge-io-poll','forge-io-interrupt'],
 'forge-objects-interaction':['forge-objects-identity','forge-objects-encapsulation'],
 'forge-roundstone-compare':['forge-roundstone-even','forge-roundstone-odd'],
 'forge-integer-addition':['forge-integer-unsigned','forge-integer-reading'],
 'station-heap-remove':['station-heap-queue','station-heap-insert'],
 'station-replacement-compare':['station-replacement-fifo','station-replacement-lru'],
 'station-os-access':['station-os-queue','station-os-storage'],
};
export function forgeStationQuestGroups(region,completed,endgameAvailable){
 const done=new Set(completed);
 return catalogs[region].map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
