// Regions describe where the existing quests take place; they do not lock access.
export const regions=[
  {id:'guild',name:'冒険者ギルド',icon:'⚑',description:'旅人が集まり、世界各地からの依頼を受ける場所。',quests:['guild-sign','guild-sets','guild-revisions','sign-study','guild-web-requests','guild-containers','timetable-requirements','guild-enrollment','guild-chart','courier-strata']},
  {id:'workshop',name:'精霊の工房',icon:'✦',description:'精霊や自動人形とともに、道具の動かし方を学ぶ。',quests:['sequence','branch','loop','two-paths','sorting','merge-stones','typed-spells','scout-automaton','automaton-energy','rune-arrangements','stone-pipeline','multiplier-seals','lantern-spirits','instruction-engine','spell-syntax','workshop-lifecycle','event-lantern','spell-collision','workshop-interrupt','sign-memory']},
  {id:'ruins',name:'灯火の遺跡',icon:'♜',description:'古い門と迷宮に残された、灯火と紋章の謎。',quests:['circuit','guardian','depth-ruins','ruin-emblem','memory-gate','number-lanterns','lantern-adder','guardian-strategy','guardian-pruning','stone-duel','lantern-constraints','light-vectors','lantern-projection','rounding-crystals','lantern-proof','moon-qubit','nested-gate','mosaic-triangle','key-return-maze','matrix-mirror','square-induction','rope-gcd','lantern-expedition','guardian-captions','hamming-lanterns','eight-lanterns']},
  {id:'wilds',name:'霧の森と山道',icon:'⌖',description:'森と山を越え、調査隊と遠い村へ知らせを届ける。',quests:['forest-search','weighted-roads','message-delivery','village-bridges','guided-ruins','misleading-stars','routing-towers','address-towers','layered-message','rain-observations','beacon-inspection','mist-markov','beacon-availability']},
  {id:'castle',name:'王城',icon:'⚔',description:'城門と通行の仕組みを守り、約束を確かめる。',quests:['castle-access','ward-tests','protected-gate','secret-lanterns','ledger-seals']},
  {id:'village',name:'薬師の村',icon:'✿',description:'薬草と台帳を手がかりに、村の暮らしを支える。',quests:['herb-catalog','village-join','private-ledger','transfer-ledger','shared-ledger','ledger-order','festival-order','village-choices','village-decomposition','village-coins','herb-index-plan','village-cardinality','harvest-histogram','harvest-quartiles','village-fairness','village-data-life']},
  {id:'forge',name:'宝石の工房',icon:'◈',description:'炉と記録を共有する精霊たちを手伝う。',quests:['workshop-scheduling','shared-counter','counter-lock','two-locks','waiting-workers','parallel-workshop','forge-barrier','shared-cache']},
  {id:'archive',name:'鑑定士の書庫',icon:'⌗',description:'水晶の記録や魔導書を調べ、知識を届ける。',quests:['crystal-neighbors','crystal-evaluation','crystal-overfit','crystal-regression','gradient-valley','hash-archive','lantern-signals','archive-cache','search-ledger','search-invariant','tree-archive','page-frames','page-address','treasure-expectation','arrival-records','archive-file-links','treasure-variance','archive-search-growth','archive-utf8','archive-blocks','archive-huffman','archive-retrieval','archive-word-index','archive-word-order']},
];
export function findRegion(id){return regions.find(region=>region.id===id)||null;}
export function visibleQuests(levels,regionId){
  const region=findRegion(regionId);
  return levels.map((level,index)=>({level,index})).filter(({level})=>!region||region.quests.includes(level.id));
}
export function filterQuests(levels,regionId,query,status,completed){
  if(typeof query!=='string'||!['all','todo','done'].includes(status)||!Array.isArray(completed))throw new RangeError('検索条件が不正です。');
  const words=query.normalize('NFKC').toLowerCase().trim().split(/\s+/u).filter(Boolean),done=new Set(completed);
  return visibleQuests(levels,regionId).filter(({level})=>{
    const place=regions.find(region=>region.quests.includes(level.id));
    const text=[level.number,`quest ${level.number}`,level.name,level.title,level.tag,level.story,place?.name||''].join(' ').normalize('NFKC').toLowerCase();
    return words.every(word=>text.includes(word))&&(status==='all'||(status==='done')===done.has(level.id));
  });
}

// Suggested paths are optional; players may still open any quest in any order.
export const learningTrails=[
  {id:'first-steps',name:'精霊と始める',description:'順番、条件、繰り返しから、再帰やデータの処理へ進みます。',quests:['sequence','branch','loop','two-paths','rune-arrangements','typed-spells','lantern-spirits','stone-pipeline','multiplier-seals','spell-syntax','guild-containers','event-lantern']},
  {id:'logic',name:'灯火と計算',description:'論理の灯火から、整数表現や量子の干渉へ進みます。',quests:['circuit','guardian','lantern-proof','square-induction','rope-gcd','memory-gate','nested-gate','number-lanterns','archive-utf8','archive-huffman','hamming-lanterns','eight-lanterns','lantern-adder','rounding-crystals','instruction-engine','secret-lanterns','moon-qubit']},
  {id:'paths',name:'道と探索',description:'整列と探索から、最短路や条件を満たす探索へ進みます。',quests:['sorting','merge-stones','search-ledger','archive-search-growth','search-invariant','tree-archive','archive-retrieval','archive-word-index','archive-word-order','forest-search','depth-ruins','weighted-roads','village-bridges','festival-order','hash-archive','guided-ruins','misleading-stars','lantern-constraints','village-coins','key-return-maze','lantern-expedition']},
  {id:'data',name:'台帳と仲間',description:'集合と問い合わせから、台帳の同時更新へ進みます。',quests:['guild-sets','village-data-life','guild-enrollment','village-cardinality','harvest-histogram','harvest-quartiles','herb-catalog','herb-index-plan','village-join','village-decomposition','private-ledger','village-choices','transfer-ledger','shared-ledger','ledger-order']},
  {id:'systems',name:'支える仕組み',description:'仕事の順番、共有、記憶と通信をたどります。',quests:['workshop-scheduling','waiting-workers','parallel-workshop','forge-barrier','shared-cache','protected-gate','workshop-interrupt','shared-counter','counter-lock','two-locks','archive-cache','archive-blocks','page-frames','page-address','archive-file-links','routing-towers','address-towers','layered-message','message-delivery','guild-web-requests']},
  {id:'reasoning',name:'推測と勝負',description:'鑑定や確率を考え、守護者との読み合いに挑みます。',quests:['crystal-neighbors','crystal-evaluation','crystal-overfit','village-fairness','crystal-regression','gradient-valley','lantern-signals','rain-observations','sign-memory','beacon-inspection','mist-markov','beacon-availability','treasure-expectation','treasure-variance','arrival-records','guardian-strategy','guardian-pruning','stone-duel']},
  {id:'craft',name:'道具と暮らし',description:'案内や安全、試験、図形、自動人形を体験します。',quests:['guild-sign','sign-study','guardian-captions','guild-chart','courier-strata','timetable-requirements','castle-access','ward-tests','ledger-seals','guild-revisions','ruin-emblem','light-vectors','matrix-mirror','lantern-projection','mosaic-triangle','scout-automaton','automaton-energy','workshop-lifecycle','spell-collision']},
];
export function findTrail(id){return learningTrails.find(trail=>trail.id===id)||null;}
export function trailQuests(trail,levels){
  return trail.quests.map(id=>{const index=levels.findIndex(level=>level.id===id);return {level:levels[index],index};});
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
