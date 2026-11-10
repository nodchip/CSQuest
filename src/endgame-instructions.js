// Fixed examples about naming and explanatory comments, not a code editor.
export const instructionCases={
 name:[
  {title:'出発までの残り時間',context:'出発までの残り時間を分で持つ数字です。値が５なら残り５分です。',prompt:'この値に付ける、意味と単位が伝わる名前は？',choices:[['seconds','出発までの残り時間（秒）'],['minutes','出発までの残り時間（分）'],['number','数値']],correct:'minutes',explanation:'５は分なので「出発までの残り時間（分）」と名付けます。単位を誤ると60倍の取り違えにつながります。'},
  {title:'扉の状態',context:'扉が開いているときに真、閉じているときに偽になる値です。',prompt:'状態の意味と、真のときの状態が伝わる名前は？',choices:[['closed','閉じている'],['state','扉の値'],['open','開いている']],correct:'open',explanation:'真が開いている状態に対応するため「開いている」です。'},
 ],
 comment:[
  {title:'届ける数の確認',context:'届ける数が棚の数を超えるときは配達しません。確認は、配達の途中で品が足りなくなるのを防ぐために行います。',prompt:'確認の理由を次の担当者に伝える説明は？',choices:[['repeat','数を確認する'],['reason','途中で品切れにならないよう、配達前に棚の数を確かめる'],['wrong','配達後に棚の数を確かめる']],correct:'reason',explanation:'手順を繰り返すだけでなく、配達前に確認する理由を伝えます。'},
  {title:'時間の端数',context:'受付に必要な時間は、待ち時間を不足なく見積もるため、分に直すとき端数を切り上げます。',prompt:'切り上げる理由と実際の動きに合う説明は？',choices:[['floor','短く見積もるため、端数を切り捨てる'],['why','待ち時間を不足なく見積もるため、端数を切り上げる'],['none','端数の扱いは決まっていない']],correct:'why',explanation:'決まっている切り上げとその理由を両方記します。'},
 ],
 revise:[
  {title:'灯りを消す時刻',context:'灯りを消すまでの待ち時間が３分から５分に変更されました。手順はすでに５分に変更済みですが、説明には「３分後に消す」と残っています。',prompt:'説明をどう整えますか？',choices:[['old','３分後に消す'],['new','５分後に消す'],['code','説明だけを変え、手順を３分に戻す']],correct:'new',explanation:'実際の手順と説明を５分にそろえます。説明の更新だけで手順そのものが直るわけではありません。'},
  {title:'まだ古い手順',context:'今度は仕様が５分に変わった一方、手順も説明もまだ３分のままです。',prompt:'仕様と手順と説明を一致させるには？',choices:[['comment','説明だけ５分にする'],['both','手順を５分に直して確かめ、説明も５分に更新する'],['ignore','手順と説明を３分のまま残す']],correct:'both',explanation:'説明だけ変えると実際の待ち時間は３分のままです。手順を直し、確かめてから説明も合わせます。'},
 ],
};
export function replayInstructions(kind,history){
 if(!Object.hasOwn(instructionCases,kind)||!Array.isArray(history))return null;
 let scene=0,results=[],done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  const task=instructionCases[kind][scene];
  if(action!==`answer:${task.correct}`)return null;
  results.push(task.correct);scene++;done=scene===instructionCases[kind].length;
 }
 return {scene,results,done};
}
