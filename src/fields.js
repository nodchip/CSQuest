// These are starting points, not a complete mapping of every quest to CS2023.
export const fields=[
 {id:'AI',name:'人工知能',quests:['workshop-ai-kinds','forest-search','crystal-neighbors'],trails:['ai-journey']},
 {id:'AL',name:'アルゴリズムと計算量',quests:['forest-search','weighted-roads','forest-bst-delete'],trails:['paths']},
 {id:'AR',name:'計算機構成',quests:['circuit','number-lanterns','instruction-engine'],trails:['circuit-oven-journey','logic']},
 {id:'DM',name:'データ管理',quests:['herb-catalog','village-join','transfer-ledger'],trails:['relational','data']},
 {id:'FPL',name:'プログラミング言語の基礎',quests:['typed-spells','workshop-lexer-scroll','workshop-type-unification'],trails:['type-journey','oop-journey']},
 {id:'GIT',name:'グラフィックスと対話技術',quests:['matrix-mirror','ruin-view-grid','workshop-frame-time'],trails:['image-journey','animation-journey']},
 {id:'HCI',name:'人間とコンピューターの相互作用',quests:['guild-sign','sign-study','guild-focus-dialog'],trails:['hci-journey']},
 {id:'MSF',name:'数学・統計の基礎',quests:['guild-sets','arrival-records','lantern-proof'],trails:['calculus','linear','statistics']},
 {id:'NC',name:'ネットワークと通信',quests:['message-delivery','address-towers','forest-receiver-flow'],trails:['network-journey']},
 {id:'OS',name:'オペレーティングシステム',quests:['workshop-scheduling','page-address','archive-file-calls'],trails:['realtime-journey','virtualization-journey']},
 {id:'PDC',name:'並列・分散計算',quests:['shared-counter','counter-lock','forge-barrier'],trails:['systems']},
 {id:'SDF',name:'ソフトウェア開発の基礎',quests:['sequence','branch','loop'],trails:['first-steps','software-foundations']},
 {id:'SE',name:'ソフトウェア工学',quests:['ward-tests','guild-revisions','village-inventory-contract'],trails:['se-journey','software-foundations']},
 {id:'SEC',name:'セキュリティ',quests:['castle-security-triad','castle-access','secret-lanterns'],trails:['security-journey']},
 {id:'SEP',name:'社会・倫理・専門職',quests:['village-choices','guild-credit-scrolls','guild-asset-license'],trails:['craft']},
 {id:'SF',name:'システムの基礎',quests:['instruction-engine','workshop-memory-power','shared-cache'],trails:['systems','virtualization-journey']},
 {id:'SPD',name:'特化型プラットフォーム開発',quests:['village-mobile-location','workshop-frame-time','ruin-view-grid'],trails:['circuit-oven-journey','animation-journey']}
];
export function findField(id){return fields.find(field=>field.id===id)||null;}
export function fieldQuests(field,levels){if(!field||!Array.isArray(levels))throw new RangeError('分野または依頼が不正です');return field.quests.map(id=>{const index=levels.findIndex(level=>level.id===id);if(index<0)throw new RangeError(`依頼 ${id} がありません`);return {level:levels[index],index};});}
