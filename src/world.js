// Regions describe where the existing quests take place; they do not lock access.
export const regions=[
  {id:'guild',name:'冒険者ギルド',icon:'⚑',description:'旅人が集まり、世界各地からの依頼を受ける場所。',quests:['guild-sign']},
  {id:'workshop',name:'精霊の工房',icon:'✦',description:'精霊や自動人形とともに、道具の動かし方を学ぶ。',quests:['sequence','branch','loop','two-paths','sorting','typed-spells','scout-automaton','rune-arrangements']},
  {id:'ruins',name:'灯火の遺跡',icon:'♜',description:'古い門と迷宮に残された、灯火と紋章の謎。',quests:['circuit','guardian','depth-ruins','ruin-emblem','memory-gate','number-lanterns','lantern-adder']},
  {id:'wilds',name:'霧の森と山道',icon:'⌖',description:'森と山を越え、調査隊と遠い村へ知らせを届ける。',quests:['forest-search','weighted-roads','message-delivery','village-bridges','guided-ruins']},
  {id:'castle',name:'王城',icon:'⚔',description:'城門と通行の仕組みを守り、約束を確かめる。',quests:['castle-access','ward-tests']},
  {id:'village',name:'薬師の村',icon:'✿',description:'薬草と台帳を手がかりに、村の暮らしを支える。',quests:['herb-catalog','village-join','private-ledger','transfer-ledger','shared-ledger','ledger-order']},
  {id:'forge',name:'宝石の工房',icon:'◈',description:'炉と記録を共有する精霊たちを手伝う。',quests:['workshop-scheduling','shared-counter','counter-lock','two-locks']},
  {id:'archive',name:'鑑定士の書庫',icon:'⌗',description:'水晶の記録や魔導書を調べ、知識を届ける。',quests:['crystal-neighbors','crystal-evaluation','hash-archive','lantern-signals','archive-cache','search-ledger','page-frames','page-address','treasure-expectation']},
];
export function findRegion(id){return regions.find(region=>region.id===id)||null;}
export function visibleQuests(levels,regionId){
  const region=findRegion(regionId);
  return levels.map((level,index)=>({level,index})).filter(({level})=>!region||region.quests.includes(level.id));
}

export const storyScenes=[
  {id:'beginning',threshold:0,title:'消えかけた道しるべ',speaker:'ギルド長 ミラ',text:'旅人たちを導く、ギルドの塔の灯りが弱くなっているの。各地から届く知らせも、少しずつ途切れがちになったわ。精霊のノノと一緒に、困っている人の声を聞いてくれない？'},
  {id:'first-light',threshold:1,title:'小さな知らせ',speaker:'精霊 ノノ',text:'見て、塔の灯りが少し明るくなった！ 助けた場所から届く知らせが、灯りに力を分けているみたい。次はどこへ行こう？'},
  {id:'connections',threshold:4,title:'つながる道',speaker:'ギルド長 ミラ',text:'各地で生まれた工夫が、別の場所にも届き始めたわ。一つのやり方が、別の困りごとを解く手がかりになることもあるのね。'},
  {id:'beacon',threshold:8,title:'八つの知らせと塔の灯り',speaker:'精霊 ノノ',text:'八つの場所から知らせが届いたよ！ 塔の灯りが、また遠くまで道を照らしている。これで旅人たちも、助けを求める声を見つけやすくなるね。ミラと一緒に、これからも世界を巡ろう！'},
];
export function storyProgress(completed){
  const done=new Set(completed);
  const visited=regions.filter(region=>region.quests.some(id=>done.has(id)));
  const scenes=storyScenes.filter(scene=>scene.threshold<=visited.length);
  return {visited,scenes,current:scenes.at(-1),next:storyScenes.find(scene=>scene.threshold>visited.length)||null};
}
