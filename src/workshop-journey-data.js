import {levels} from './engine.js';

const byId=id=>levels.find(level=>level.id===id);
export const journeyQuests={
  branch:{level:byId('branch'),title:'木立の道しるべ',place:'木立の道',speaker:'lira',object:'届け先',intro:'木立の道は倒れた木でふさがれているの。ノノに道を教えて、先で待つ旅人に荷物を届けてくれる？',success:'届けものが届いたわ。道の前に壁があるときだけ、向きを変えられたのね。',lesson:'条件が成り立つときにだけ操作を行う方法を「条件分岐」と呼びます。',hint:'最初に１歩進むと前に木があります。壁なら右を向き、もう１歩進みましょう。'},
  loop:{level:byId('loop'),title:'水路の灯りを届ける',place:'工房の水路',speaker:'lira',object:'灯りの台',intro:'水路の灯りも消えてしまったわ。お願いの札は３枚だけ。ノノを灯りの台まで案内してくれる？',success:'灯りが戻ったわ！ 同じ動きをまとめると、少ない札で道を伝えられるのね。',lesson:'同じ操作をまとめて繰り返すことを「繰り返し」と呼びます。ここでは２回と決めて繰り返します。',hint:'「２回進む」を置くと、向いている方向へ２マス進みます。次に「右を向く」を置き、もう一度「２回進む」を置いてみましょう。'},
  river:{level:byId('two-paths'),title:'水辺の道を照らす',place:'水辺の村',speaker:'mizuho',object:'灯りの台',intro:'水辺の道は水かさによって変わるんだ。どちらの日でも、同じお願いでノノを灯りの台まで案内してほしい。',success:'どちらの道にも灯りを届けられたよ。道の様子が変わっても確かめられて安心だね。',lesson:'同じ手順を複数の状況で試すと、一つの例だけでは見つからない問題に気づけます。条件分岐で状況に応じて動作を変えられます。',hint:'１歩進んだ後、前が壁のときだけ右を向き、もう１歩進むお願いを試しましょう。'},
};

export const workshopQuestIds=['forest','branch','loop'];
export function unlocked(completed){return [...workshopQuestIds,'workshop-steps'].filter(id=>completed.includes(id)).length>=2;}
export function completeQuest(completed,id){return completed.includes(id)?completed:[...completed,id];}
export function emptyDraft(){return {program:[],executed:false};}
export function validDraft(id,draft){const level=journeyQuests[id]?.level;return !!level&&!!draft&&Array.isArray(draft.program)&&draft.program.length<=level.max&&draft.program.every(id=>typeof id==='string'&&level.available.includes(id))&&typeof draft.executed==='boolean'&&(!draft.executed||draft.program.length>0);}
