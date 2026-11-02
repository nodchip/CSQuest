import {userNeedsPeople} from './user-needs.js';
export const journeyMapLevel={id:'guild-journey-map',number:'961',kind:'journey-map',name:'配達人の旅をたどる',tag:'人物像・共感・ジャーニーマップ',title:'旅の途中の困りごと',story:'山道を通る配達人の声と架空の観察記録から、時刻案内を改善する手がかりを作りましょう。'};
export const journeyQuote=userNeedsPeople.offline.quote;
export const journeyProfile={schedule:'出発時刻を確認したい',offline:'山では通信が使えない場合がある',old:'年齢が高い',inexperienced:'水晶の使い方を知らない',paperAlways:'必ず紙だけを好む'};
export const journeyProfileExpected=['schedule','offline'];
export const journeyNotes={
 said:{text:'「時刻をその場で確認したい」と本人が話した。',category:'says'},
 did:{text:'通信できない表示を見て、水晶の画面を閉じた。',category:'does'},
 felt:{text:'「遅れるかもしれず焦った」と本人が話した。',category:'feels'},
 guess:{text:'紙の案内がいつも一番好きに違いない。',category:'unknown'}
};
export const journeyCategories={says:'発言',does:'観察した行動',feels:'本人が語った気持ち',unknown:'確認が必要な推測'};
export const journeySteps={start:'出発前に水晶で時刻を確認する',offline:'峠で通信が途切れ、再確認できない',paper:'休憩所にある紙の時刻表を見る',confirm:'時刻を確認し、道を進む'};
export const journeyOrder=['start','offline','paper','confirm'];
export function journeyProfileCorrect(selected){if(!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(k=>!Object.hasOwn(journeyProfile,k)))throw new RangeError('人物像の選択が不正です。');return selected.length===journeyProfileExpected.length&&journeyProfileExpected.every(k=>selected.includes(k));}
export function journeyRouteCorrect(route){if(!Array.isArray(route)||route.length>4||new Set(route).size!==route.length||route.some(k=>!Object.hasOwn(journeySteps,k)))throw new RangeError('道筋が不正です。');return route.length===4&&journeyOrder.every((k,i)=>route[i]===k);}
export function journeyCreate(){return {selected:[],profileChecked:false,note:'said',category:null,notes:{},last:null,route:[],routeChecked:false,improvement:null,reflection:null};}
export function journeyCheckNote(q){if(!Object.hasOwn(journeyNotes,q.note)||!Object.hasOwn(journeyCategories,q.category))throw new RangeError('札が不正です。');const correct=journeyNotes[q.note].category===q.category;q.last={note:q.note,category:q.category,correct};if(correct)q.notes[q.note]=q.category;}
export function journeyComplete(q){return q.profileChecked&&journeyProfileCorrect(q.selected)&&Object.keys(journeyNotes).every(k=>q.notes[k]===journeyNotes[k].category)&&q.routeChecked&&journeyRouteCorrect(q.route)&&q.improvement==='paper'&&q.reflection==='limited';}
export function journeyRestore(q){if(!q||typeof q.profileChecked!=='boolean'||!Object.hasOwn(journeyNotes,q.note)||!(q.category===null||Object.hasOwn(journeyCategories,q.category))||!q.notes||typeof q.notes!=='object'||Array.isArray(q.notes)||Object.entries(q.notes).some(([k,v])=>!Object.hasOwn(journeyNotes,k)||journeyNotes[k].category!==v)||typeof q.routeChecked!=='boolean'||![null,'paper','online','guess'].includes(q.improvement)||![null,'limited','everyone','stereotype'].includes(q.reflection))throw new RangeError('記録が不正です。');journeyProfileCorrect(q.selected);journeyRouteCorrect(q.route);let last=null;if(q.last!==null){const l=q.last;if(!l||!Object.hasOwn(journeyNotes,l.note)||!Object.hasOwn(journeyCategories,l.category)||l.correct!==(journeyNotes[l.note].category===l.category))throw new RangeError('記録が不正です。');last={...l};}return {selected:[...q.selected],profileChecked:q.profileChecked,note:q.note,category:q.category,notes:{...q.notes},last,route:[...q.route],routeChecked:q.routeChecked,improvement:q.improvement,reflection:q.reflection};}
