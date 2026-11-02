// These are starting points, not a complete mapping of every quest to CS2023.
export const fields=[
 {id:'AI',name:'人工知能',quests:['workshop-ai-kinds','forest-search','crystal-neighbors']},
 {id:'AL',name:'アルゴリズムと計算量',quests:['forest-search','weighted-roads','forest-bst-delete']},
 {id:'AR',name:'計算機構成',quests:['circuit','number-lanterns','instruction-engine']},
 {id:'DM',name:'データ管理',quests:['herb-catalog','village-join','transfer-ledger']},
 {id:'FPL',name:'プログラミング言語の基礎',quests:['typed-spells','workshop-lexer-scroll','workshop-type-unification']},
 {id:'GIT',name:'グラフィックスと対話技術',quests:['matrix-mirror','ruin-view-grid','workshop-frame-time']},
 {id:'HCI',name:'人間とコンピューターの相互作用',quests:['guild-sign','sign-study','guild-focus-dialog']},
 {id:'MSF',name:'数学・統計の基礎',quests:['guild-sets','arrival-records','lantern-proof']},
 {id:'NC',name:'ネットワークと通信',quests:['message-delivery','address-towers','forest-receiver-flow']},
 {id:'OS',name:'オペレーティングシステム',quests:['workshop-scheduling','page-address','archive-file-calls']},
 {id:'PDC',name:'並列・分散計算',quests:['shared-counter','counter-lock','forge-barrier']},
 {id:'SDF',name:'ソフトウェア開発の基礎',quests:['sequence','branch','loop']},
 {id:'SE',name:'ソフトウェア工学',quests:['ward-tests','guild-revisions','village-inventory-contract']},
 {id:'SEC',name:'セキュリティ',quests:['castle-security-triad','castle-access','secret-lanterns']},
 {id:'SEP',name:'社会・倫理・専門職',quests:['village-choices','guild-credit-scrolls','guild-asset-license']},
 {id:'SF',name:'システムの基礎',quests:['instruction-engine','workshop-memory-power','shared-cache']},
 {id:'SPD',name:'特化型プラットフォーム開発',quests:['village-mobile-location','workshop-frame-time','ruin-view-grid']}
];
export function findField(id){return fields.find(field=>field.id===id)||null;}
export function fieldQuests(field,levels){if(!field||!Array.isArray(levels))throw new RangeError('分野または依頼が不正です');return field.quests.map(id=>{const index=levels.findIndex(level=>level.id===id);if(index<0)throw new RangeError(`依頼 ${id} がありません`);return {level:levels[index],index};});}
