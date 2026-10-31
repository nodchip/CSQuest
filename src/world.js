// Regions describe where the existing quests take place; they do not lock access.
export const regions=[
  {id:'guild',name:'冒険者ギルド',icon:'⚑',description:'旅人が集まり、世界各地からの依頼を受ける場所。',quests:['guild-sign']},
  {id:'workshop',name:'精霊の工房',icon:'✦',description:'精霊や自動人形とともに、道具の動かし方を学ぶ。',quests:['sequence','branch','loop','two-paths','sorting','typed-spells','scout-automaton']},
  {id:'ruins',name:'灯火の遺跡',icon:'♜',description:'古い門と迷宮に残された、灯火と紋章の謎。',quests:['circuit','guardian','depth-ruins','ruin-emblem']},
  {id:'wilds',name:'霧の森と山道',icon:'⌖',description:'森と山を越え、調査隊と遠い村へ知らせを届ける。',quests:['forest-search','weighted-roads','message-delivery']},
  {id:'castle',name:'王城',icon:'⚔',description:'城門と通行の仕組みを守り、約束を確かめる。',quests:['castle-access','ward-tests']},
  {id:'village',name:'薬師の村',icon:'✿',description:'薬草と台帳を手がかりに、村の暮らしを支える。',quests:['herb-catalog','village-join','private-ledger']},
  {id:'forge',name:'宝石の工房',icon:'◈',description:'炉と記録を共有する精霊たちを手伝う。',quests:['workshop-scheduling','shared-counter','counter-lock']},
  {id:'archive',name:'鑑定士の書庫',icon:'⌗',description:'水晶の記録や魔導書を調べ、知識を届ける。',quests:['crystal-neighbors','crystal-evaluation','hash-archive','lantern-signals','archive-cache']},
];
export function findRegion(id){return regions.find(region=>region.id===id)||null;}
export function visibleQuests(levels,regionId){
  const region=findRegion(regionId);
  return levels.map((level,index)=>({level,index})).filter(({level})=>!region||region.quests.includes(level.id));
}
