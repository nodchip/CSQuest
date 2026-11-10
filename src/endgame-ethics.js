export const impactCases=[
 {context:'広場の案内板に予約人数と予約者の名前を掲示する案です。案内板は誰でも見られます。',options:{a:'旅人は掲示された予約人数を見られる',b:'予約者の名前が広場で見られる',c:'名前は案内係だけが見られる'},required:['a','b']},
 {context:'一つの村からの予約は１人で、広場にその村の人数１だけを掲示します。見る人は別の情報から、その村の該当者が誰かを知っています。',options:{a:'見る人は掲示された人数を見られる',b:'別の情報と合わせ、予約者を推測できる場合がある',c:'名前を載せなければ必ず本人を推測できない'},required:['a','b']}
];
export const questionCases=[
 {context:'村ごとの予約人数を広場に出す案です。小さな村では他の情報と合わせて本人を推測されるかもしれません。本人の希望はまだ分かりません。',options:{a:'本人はどの範囲の公開を望むか',b:'見る人が他に何を知り得るか',c:'確認せず集計だけで常に安全と決める'},required:['a','b']},
 {context:'30人分の人数だけを出す別の案です。集計する範囲や、見る人が持つ他の情報はまだ分かりません。',options:{a:'何のために誰へどの範囲で知らせる必要があるか',b:'期間や地域の分け方と、他に見られる情報は何か',c:'人数の多さだけで常に安全と決める'},required:['a','b']}
];
export const decisionCases=[
 {context:'予約者は広場に予約人数を出してほしくないと話しています。担当者は窓口で人数を確認する必要があると話しています。窓口だけに知らせるか、人数案内自体を取りやめるか考えます。',plans:{counter:{label:'人数を担当者の窓口だけに知らせる',reason:'広場には出さず担当者が人数を確認できる',risk:'担当者からの漏れや他の情報による推測は残る'},none:{label:'人数案内を取りやめる',reason:'この案内から人数を公開しない',risk:'担当者も人数を確認できず、運営方法の見直しが必要'}}},
 {context:'30人分の人数だけを広場に出す案について、この架空の予約者30人は全員、人数の掲示を希望しています。名前は出しません。他の情報と照合された場合の影響はまだ分かりません。',plans:{counter:{label:'人数だけ広場に出す',reason:'旅人が人数を見て混雑を考えられる',risk:'他の情報と合わせて推測される可能性は残る'},none:{label:'人数の掲示を見合わせる',reason:'この掲示から人数を公開しない',risk:'旅人はこの掲示で混雑を確認できず、予約者の掲示希望もかなわない'}}}
];
export function replayEthics(kind,history){
 if(!['impact','questions','decision'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,selected=[],plan=null,reason=null,risk=null,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){selected=[];plan=null;reason=null;risk=null;continue;}
  if(kind!=='decision'){
   const task=(kind==='impact'?impactCases:questionCases)[scene],m=/^select:([abc])$/.exec(action);
   if(m){selected=selected.includes(m[1])?selected.filter(x=>x!==m[1]):[...selected,m[1]];continue;}
   if(action==='check'&&selected.length===task.required.length&&task.required.every(x=>selected.includes(x))){scene++;done=scene===2;selected=[];continue;}
   return null;
  }
  const m=/^(plan|reason|risk):(counter|none)$/.exec(action);
  if(m){if(m[1]==='plan'){plan=m[2];reason=null;risk=null;}else if(m[1]==='reason')reason=m[2];else risk=m[2];continue;}
  if(action==='check'&&plan&&reason===plan&&risk===plan){scene++;done=scene===decisionCases.length;plan=null;reason=null;risk=null;continue;}
  return null;
 }
 return {scene,selected,plan,reason,risk,done};
}
