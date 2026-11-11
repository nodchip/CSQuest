const groups=[
 {id:'start',title:'工房の近くを手伝う',local:true,quests:['workshop-opening','forest','branch','loop','workshop-steps']},
 {id:'lambdajourney',title:'名前を守って巻物を簡約する',quests:['workshop-lambdajourney-simple','workshop-lambdajourney-capture','workshop-lambdajourney-compare']},
 {id:'streamjourney',title:'灯の列を取り出す',quests:['workshop-streamjourney-eager','workshop-streamjourney-lazy','workshop-streamjourney-infinite']},
 {id:'closurejourney',title:'倍率を覚える封印を作る',quests:['workshop-closurejourney-first','workshop-closurejourney-second','workshop-closurejourney-compare']},
 {id:'fiblantern',title:'灯の数と記録を調べる',quests:['workshop-fiblantern-plain','workshop-fiblantern-memo','workshop-fiblantern-compare']},
 {id:'recursion',title:'入れ子の箱を調べる',quests:['workshop-recursion-sum','workshop-recursion-tree','workshop-recursion-repair']},
 {id:'invariant',title:'札を数える仕掛けを確かめる',quests:['workshop-invariant-trace','workshop-invariant-proof','workshop-invariant-compare']},
 {id:'debug',title:'花を数える装置を直す',quests:['workshop-debug-trace','workshop-debug-breakpoint','workshop-debug-repair']},
 {id:'instructions',title:'指示書の名前と説明を整える',quests:['workshop-instructions-name','workshop-instructions-comment','workshop-instructions-revise']},
 {id:'scrolltokens',title:'巻物の文字を印に分ける',quests:['workshop-scrolltokens-joined','workshop-scrolltokens-separate','workshop-scrolltokens-compare']},
 {id:'boxcollection',title:'つながる箱を片付ける',quests:['workshop-boxcollection-chain','workshop-boxcollection-cycle','workshop-boxcollection-compare']},
 {id:'scopelight',title:'同じ名前の光を調べる',quests:['workshop-scopelight-lexical','workshop-scopelight-dynamic','workshop-scopelight-compare']},
 {id:'refactor',title:'仕分け機を整理して受け継ぐ',quests:['workshop-refactor-structure','workshop-refactor-interface','workshop-refactor-migration']},
 {id:'flower',title:'花びらの仕分け機を作る',quests:['workshop-flower-lab']},
];
const prerequisites={
 'workshop-lambdajourney-compare':['workshop-lambdajourney-simple','workshop-lambdajourney-capture'],
 'workshop-streamjourney-infinite':['workshop-streamjourney-eager','workshop-streamjourney-lazy'],
 'workshop-closurejourney-compare':['workshop-closurejourney-first','workshop-closurejourney-second'],
 'workshop-fiblantern-compare':['workshop-fiblantern-plain','workshop-fiblantern-memo'],
 'workshop-recursion-repair':['workshop-recursion-sum','workshop-recursion-tree'],
 'workshop-invariant-compare':['workshop-invariant-trace','workshop-invariant-proof'],
 'workshop-debug-repair':['workshop-debug-trace','workshop-debug-breakpoint'],
 'workshop-instructions-revise':['workshop-instructions-name','workshop-instructions-comment'],
 'workshop-scrolltokens-compare':['workshop-scrolltokens-joined','workshop-scrolltokens-separate'],
 'workshop-boxcollection-compare':['workshop-boxcollection-chain','workshop-boxcollection-cycle'],
 'workshop-scopelight-compare':['workshop-scopelight-lexical','workshop-scopelight-dynamic'],
 'workshop-refactor-migration':['workshop-refactor-structure','workshop-refactor-interface'],
};
export function workshopQuestGroups(completed,endgameAvailable,openingComplete){
 const done=new Set(completed);if(openingComplete)done.add('workshop-opening');
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
