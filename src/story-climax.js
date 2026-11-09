// Each accepted action advances a visible, self-contained stage.  A saved
// history is replayed instead of trusting a saved completion flag.
export const climaxSteps=[
 {quest:1,goal:'記録を古い順に選んで、手紙の道筋をたどる',prompt:'記録の時刻を見て、最初の記録を選びましょう。',choices:[['noon','昼：丘の中継所から森へ'],['morning','朝：港から丘の中継所へ'],['evening','夕：森に手紙が到着']],answer:'morning',hint:'朝・昼・夕の順に記録をたどります。'},
 {quest:1,goal:'記録を古い順に選んで、手紙の道筋をたどる',prompt:'次に起きたことを選びましょう。',choices:[['evening','夕：森に手紙が到着'],['noon','昼：丘の中継所から森へ']],answer:'noon',hint:'朝の次は昼です。'},
 {quest:1,goal:'記録を古い順に選んで、手紙の道筋をたどる',prompt:'最後の記録を選びましょう。',choices:[['evening','夕：森に手紙が到着']],answer:'evening',hint:'最後は夕方の記録です。'},
 {quest:1,goal:'古い道しるべが使われた場所を見つける',prompt:'記録と新しい道しるべを比べ、行き違いが起きた場所を選びましょう。',choices:[['port','港'],['hill','丘の中継所'],['forest','森']],answer:'hill',hint:'丘で古い札に従い、森へ送っています。'},
 {quest:1,goal:'手紙の現在地から次の中継先へ送り直す',prompt:'森から、手紙を次にどこへ送りましょう？',choices:[['port','港'],['village','水辺の村'],['hill','丘の中継所']],answer:'hill',hint:'新しい札は、丘から水辺の村を指しています。森からまず丘へ戻します。'},
 {quest:2,goal:'準備と急ぎ具合を見て、先に運ぶ人を選ぶ',prompt:'荷車を先に使うのは誰でしょう？',choices:[['mei','メイ：まだ荷物を準備中'],['haru','ハル：準備済みの急ぎの手紙を運ぶ']],answer:'haru',hint:'すぐ出発でき、急いでいる仕事があります。'},
 {quest:2,goal:'荷車を使い終え、次の人へ渡す',prompt:'ハルが運んでいる間に、メイの準備ができました。荷車をどうしますか？',choices:[['wait','ハルが使い終えるのを待つ'],['share','二人で同時に使う']],answer:'wait',hint:'荷車は一台なので、同時には使えません。'},
 {quest:2,goal:'荷車を使い終え、次の人へ渡す',prompt:'ハルが戻り、荷車は空きました。次はどうしますか？',choices:[['hold','誰にも渡さず置いておく'],['transfer','メイに荷車を渡す']],answer:'transfer',hint:'荷車が空いたら、準備のできたメイが使えます。'},
 {quest:3,goal:'本人が使いやすく、安全な方法を相談する',prompt:'手紙を受け取る人に、まず何をしますか？',choices:[['guess','様子だけで伝え方を決める'],['ask','使いやすい伝え方を本人に尋ねる'],['name','名前だけを見て手紙を渡す']],answer:'ask',hint:'使いやすさは本人に尋ねて確かめます。'},
 {quest:3,goal:'本人が使いやすく、安全な方法を相談する',prompt:'本人は「文字で伝えたい」と希望しました。どこで確かめますか？',choices:[['square','人が行き交う広場'],['private','周囲から見えない静かな部屋']],answer:'private',hint:'文字も周りから読まれない場所を選びます。'},
 {quest:3,goal:'合言葉を確かめて、手紙を本人に渡す',prompt:'配達側は本人と事前に合言葉を共有しています。何を確かめますか？',choices:[['secret','本人が紙に書いた合言葉'],['name','封筒に書かれた名前'],['clothing','服の色']],answer:'secret',hint:'名前や服の色は周囲にも分かります。事前に共有した秘密を使います。'},
 {quest:3,goal:'合言葉を確かめて、手紙を本人に渡す',prompt:'部屋で確認すると、配達側の控えは「青い星」、本人が紙に書いた言葉も「青い星」でした。どう判断しますか？',choices:[['different','一致しないので、まだ渡さない'],['match','一致したので、本人と確かめられた']],answer:'match',hint:'本人の言葉と、事前に共有した配達側の控えを比べます。'},
 {quest:3,goal:'合言葉を確かめて、手紙を本人に渡す',prompt:'合言葉が一致しました。次にどうしますか？',choices:[['announce','合言葉を広場で発表する'],['deliver','紙を人目に触れないよう片付け、本人に手紙を渡す']],answer:'deliver',hint:'合言葉を他の人に知らせず、手紙を渡します。'},
];

export function validClimaxHistory(history){
 return Array.isArray(history)&&history.length<=climaxSteps.length&&history.every((value,index)=>value===climaxSteps[index].answer);
}

export function tryClimaxAction(history,action){
 if(!validClimaxHistory(history))return {history:[],accepted:false};
 const step=climaxSteps[history.length];
 if(!step||action!==step.answer)return {history:[...history],accepted:false};
 return {history:[...history,action],accepted:true};
}

export function climaxComplete(history){return validClimaxHistory(history)&&history.length===climaxSteps.length;}
