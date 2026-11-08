// Each scenario includes its own evidence; no other quest is required to solve it.
const scenario=(prompt,choices,answer,hint)=>({prompt,choices,answer,hint});
const sequence=(prompt,choices,answer,hint)=>({prompt,choices,answer,hint,mode:'sequence'});
export const fourRegions={
 garden:{name:'星読みの庭園',person:'ナギ',quests:{
  'garden-combinations':{title:'星花の石飾り',goal:'条件に合う石飾りを選ぶ',intro:'石は色と形を一つずつ組み合わせて作ります。花壇に合う飾りを探してね。',scenarios:[
   scenario('赤か青の石があり、形は星か丸。赤くて星形の飾りになるよう、色と形を一つずつ選ぼう。',['赤い石','青い石','丸い形','星形'],[0,3],'色と形を一つずつ選びます。'),
   scenario('今度は青い石で、星形ではない飾りを作ろう。色と形を一つずつ選んでね。',['星形','青い石','赤い石','丸い形'],[1,3],'青くて、星ではない形を探そう。')]},
  'garden-sets':{title:'札の重なる場所',goal:'二つの仲間に共通する札を探す',intro:'一枚の札が、二つの仲間に入ることもあります。両方に入る札を選ぼう。',scenarios:[
   scenario('「赤い」仲間は赤い星・赤い丸・赤い葉。「星か葉」の仲間は赤い星・青い星・赤い葉。両方に入る札をすべて選ぼう。',['赤い丸','赤い星','青い星','赤い葉'],[1,3],'赤い仲間と、星か葉の仲間に同時に入る札です。'),
   scenario('「香りがある」は月草・光花・雪花。「白い」は雪花・月草・雲花。両方に入る花をすべて選ぼう。',['雲花','雪花','光花','月草'],[1,3],'二つの仲間に同じ名前があるか一つずつ見よう。')]},
  'garden-logic':{title:'二つの灯りの門',goal:'門が開く灯りの組み合わせを選ぶ',intro:'灯りが一つずつ付いた二つの台があります。「または」は両方ついている場合も含みます。',scenarios:[
   scenario('門は「赤と青の両方」が点灯すると開く。開く状態を選ぼう。',['赤だけ','赤と青','青だけ'],[1],'「両方」なので、どちらも必要です。'),
   scenario('門は「赤または青」が点灯すると開く。開く状態をすべて選ぼう。',['赤だけ','どちらも消灯','赤と青','青だけ'],[0,2,3],'少なくとも一方が点灯すればよく、両方でも開きます。')]},
  'garden-counterexample':{title:'庭の言い伝え',goal:'「いつも」と異なる例を見つける',intro:'「すべてそうだ」という話には、一つでも違う例があれば反例になります。',scenarios:[
   scenario('「星形の花はいつも白い」。これを確かめる花を選ぼう。',['白い星形の花','青い星形の花','青い丸い花'],[1],'星形でありながら白くない花を探そう。'),
   scenario('「背の高い木には必ず赤い実がなる」。反例になる木は？',['低くて赤い実の木','高くて赤い実の木','高くて青い実の木'],[2],'背が高く、赤い実でない木が反例です。')]}
 }},
 observatory:{name:'夢見の観測所',person:'セナ',quests:{
  'observatory-classify':{title:'雲の仲間分け',goal:'決めた特徴で雲を分ける',intro:'今回は雲の色ではなく形で分けるよ。もこもこなら綿雲、細長ければ帯雲と呼ぶことにしよう。',scenarios:[
   scenario('観測した四つの雲から、綿雲の札をすべて選んで観測帳に集めよう。',['白くてもこもこ','白くて細長い','灰色でもこもこ','灰色で細長い'],[0,2],'綿雲にする条件は色ではなく、もこもこの形です。'),
   scenario('次の観測では、帯雲の札をすべて集めよう。',['白くてもこもこ','灰色で細長い','灰色でもこもこ','白くて細長い'],[1,3],'帯雲にする条件は色ではなく、細長い形です。')]},
  'observatory-predict':{title:'雲の知らせを予想',goal:'観測例を手がかりに予想する',intro:'過去の観測から、この庭の雲と雨の関係を予想しよう。予想は必ず当たるとは限らないよ。',scenarios:[
   scenario('前に観た３回は、低く厚い雲の後に雨が降った。今も低く厚い雲。どんな予想が観測例に沿う？',['雨が降るかもしれない','絶対に晴れる'],[0],'似た特徴の過去の例を手がかりにするよ。'),
   scenario('前に観た３回は、薄く高い雲の後は雨が降らなかった。今も薄く高い雲。どんな予想が例に沿う？',['必ず大雨','雨は降らないかもしれない'],[1],'過去の例はヒントですが保証ではありません。')]},
  'observatory-uncertainty':{title:'まだ知らない空',goal:'根拠が足りないことを伝える',intro:'似た雲を十分に観測していない場合は、決めつけず、観測が足りないと伝えよう。',scenarios:[
   scenario('緑色の雲は初めて見た。雨が降るか尋ねられたら？',['絶対に降る','例がなく、まだ分からない','必ず降らない'],[1],'初めての雲に確かな予想の根拠はありません。'),
   scenario('一度だけ見た縞雲の後は晴れた。次も必ず晴れる？',['一度の観測だけでは分からない','必ず晴れる'],[0],'一回の例だけでは確実とはいえません。')]},
  'observatory-evaluate':{title:'初めての雲で試す',goal:'学習に使っていない観測で予想を試す',intro:'予想を作るのに使った観測と、出来具合を調べる観測を分けておこう。',scenarios:[
   scenario('観測ＡとＢで予想を作った。まだ使っていないＣがある。試すのに使うのは？',['Ａをもう一度','Ｃ','Ｂをもう一度'],[1],'予想作りに使っていない観測を選ぼう。'),
   scenario('予想作りにＤ・Ｅ・Ｆを使った。Ｇ・Ｈは取っておいた。試す観測は？',['ＤとＥ','ＦとＧ','ＧとＨ'],[2],'取っておいた観測で、初めて見る例への働きを調べます。')]}
 }},
 tailor:{name:'願いをかなえる仕立て屋',person:'ダリオ',quests:{
  'tailor-needs':{title:'願いを聞く',goal:'相手の要望を確かめる',intro:'注文を決めつけず、使う人が何に困っているか聞いてみよう。',scenarios:[
   scenario('旅人「雨の日も手紙を濡らさず運びたい」。まず確かめたいことは？',['好きな星の数','どんな雨の中で使うか','店の飾りの色'],[1],'使う場面を聞くと、必要な性質が分かります。'),
   scenario('花売り「荷物を出し入れしやすい鞄がほしい」。確かめたいことは？',['花をどんな時に取り出すか','店の窓の数','作り手の好きな布'],[0],'使う人の仕事や困りごとを聞こう。')]},
  'tailor-design':{title:'部品を組み合わせる',goal:'要望に合う部品を組み合わせる',intro:'相手の願いを、布や留め具などの組み合わせにしてみよう。',scenarios:[
   scenario('雨から手紙を守り、口を閉じたい。必要な部品をすべて選ぼう。',['水を通しにくい布','飾りだけの鈴','口を閉じる留め具'],[0,2],'雨への備えと、口を閉じる仕組みの両方が必要です。'),
   scenario('暗い道で目立ち、持ち運びたい灯り袋。必要な部品を選ぼう。',['反射する印','持ち手','飾りだけの房'],[0,1],'目立つ工夫と持ち運ぶ工夫を選ぼう。')]},
  'tailor-testing':{title:'いろいろな場面で試す',goal:'要望に合うか複数の場面で試す',intro:'出来上がったものは、使う場面を変えて確かめよう。',scenarios:[
   scenario('雨の日用の鞄。水が入らないか調べる試し方は？',['雨を想定して外側に水をかける','色の名前を数える'],[0],'雨に関係する場面で確かめよう。'),
   scenario('荷物を出し入れする鞄。使いやすさを試すには？',['棚に飾るだけ','実際に荷物を出し入れする'],[1],'期待する動作を実際に試します。')]},
  'tailor-debug':{title:'留め具の不調を直す',goal:'原因を確かめて直す',intro:'うまく動かないときは、様子を確かめて原因を探し、直した後にも試そう。',scenarios:[
   sequence('留め具が閉まらない鞄。糸が穴をふさいでいるかもしれない。必要な作業を順に並べて直そう。',['糸を取り除く','閉じて開く操作を試す','原因を調べる','飾りの色を変える'],[2,0,1],'不調を調べ、原因を直し、同じ操作をもう一度試します。'),
   sequence('今度は持ち手の縫い目がほつれた袋。持ち手を直し、確かめる作業を順に並べよう。',['荷物を入れて持ってみる','飾りの色を変える','ほつれを調べる','縫い目を直す'],[2,3,0],'まず様子を調べ、原因を直して、使う動作を試します。')]}
 }},
 guide:{name:'旅人の案内所',person:'マルタ',quests:{
  'guide-needs':{title:'旅人の声を聞く',goal:'旅人の困りごとを理解する',intro:'同じ案内でも、旅人によって困ることは違うの。まず本人の声を聞きましょう。',scenarios:[
   scenario('旅人「文字が小さくて読めない」。どんなことを尋ねる？',['どの大きさなら読めるか','好きな料理は何か'],[0],'本人が使える文字の大きさを確かめよう。'),
   scenario('旅人「道が分からず迷った」。何を聞く？',['案内のどこで迷ったか','靴の色だけ'],[0],'実際に困った場面を聞きます。')]},
  'guide-signs':{title:'伝わる道しるべ',goal:'行き先が分かる案内を選ぶ',intro:'旅人が次に何をすればよいか分かる、具体的な案内を考えましょう。',scenarios:[
   scenario('広場から港へ行く道を案内する。分かりやすい看板は？',['あちらへ','港 →','見れば分かる'],[1],'行き先と方向が示されています。'),
   scenario('受付の場所を伝える札は？',['受付はこちら','その先にあるもの','ひみつ'],[0],'行き先を具体的な言葉で示そう。')]},
  'guide-access':{title:'さまざまな旅人へ',goal:'見え方や操作方法の違いに配慮する',intro:'人によって必要な工夫は違います。本人に確かめながら、複数の手がかりを用意しましょう。',scenarios:[
   scenario('色の違いが分かりにくい旅人のための札。色以外の手がかりになる工夫をすべて選ぼう。',['赤と緑だけで区別','行き先を文字で書く','模様や形でも区別','もっと似た色にする'],[1,2],'色に加えて、文字や形でも見分けられるようにします。'),
   scenario('細かな操作が難しい旅人のために、まず試したいことをすべて選ぼう。',['小さい操作部だけにする','本人に困りごとを聞く','大きな操作部を試す','使えないと決めつける'],[1,2],'本人に合うか聞き、使いやすい大きさを試して調整します。')]},
  'guide-observe':{title:'使う様子を見て直す',goal:'使う人の様子を見て改善を試す',intro:'案内を作った後も、使う人の様子を見て、困ったところを改善できます。',scenarios:[
   sequence('旅人が案内板の前で何度も立ち止まる。案内を改善する手順を選んで順に並べよう。',['分かりやすい言葉に直す','迷ったところを本人に尋ねる','直した札を使ってもらう','迷っていないと決めつける'],[1,0,2],'困りごとを尋ね、直して、使って確かめます。'),
   sequence('別の日、受付の矢印を見落とす旅人がいた。改善するための手順を並べよう。',['矢印の位置を調整する','使う様子をもう一度見る','どこで見落としたか尋ねる','調べずに札を外す'],[2,0,1],'どこで困ったか聞いてから直し、再び使う様子を見ます。')]}
 }}
};
export const fourRegionIds=Object.keys(fourRegions);
export const fourQuests=Object.fromEntries(fourRegionIds.flatMap(region=>Object.entries(fourRegions[region].quests).map(([id,quest])=>[id,{...quest,region}])));
export const fourQuestIds=Object.keys(fourQuests);
// The result ties each individual action to the story and names the CS idea
// without suggesting that a small example covers the entire subject.
export const fourResults={
 'garden-combinations':{thanks:'選んでくれた色と形で、花壇の飾り石が作れたよ。花のそばに並べよう。',lesson:'色と形のように、別々の選択を組み合わせて一つの飾りを作りました。'},
 'garden-sets':{thanks:'札を重ねてくれたおかげで、香りと色の両方に合う花が見つかったよ。',lesson:'それぞれの仲間を「集合」と呼び、両方に入るものを共通部分と呼びます。'},
 'garden-logic':{thanks:'灯りと門の約束を確かめられたね。庭の灯りを安心して使えるよ。',lesson:'「両方」は論理積、「少なくとも一方」は論理和の例です。論理和には両方の場合も含まれます。'},
 'garden-counterexample':{thanks:'言い伝えに合わない花や木も見つかったね。見つけたものを庭の記録に残そう。',lesson:'「すべてについて成り立つ」という主張には、一つの反例で成り立たないことを示せます。'},
 'observatory-classify':{thanks:'雲を形で分けられたね！ 観測帳が見やすくなったよ。',lesson:'この例では人が決めた形の規則で分類しました。学習によって規則を作ったわけではありません。どの特徴を使うかで分け方は変わります。'},
 'observatory-predict':{thanks:'前の観測を手がかりに、次の空への備えができそう！ 外れることも記録しようね。',lesson:'過去の例をもとに未知の状況を予測しました。例に似ていても、予測が必ず当たるとは限りません。'},
 'observatory-uncertainty':{thanks:'分からないことを分からないと伝えられたね。もう少し観測を集めてみよう。',lesson:'根拠が足りないときは、不確かさを伝え、追加の情報を集めることが大切です。'},
 'observatory-evaluate':{thanks:'取っておいた観測でも試せたね。初めて見る雲への予想を、これからも確かめたいな。',lesson:'学習に使わなかった事例による評価は、未知の事例への働きを調べる手がかりです。少数の例だけで全体の性能は分かりません。'},
 'tailor-needs':{thanks:'使う場面を聞けたから、旅人や花売りの願いに近づけそうだよ。',lesson:'何を作るか決める前に、使う人の目的や状況を確かめることは要件を考える第一歩です。'},
 'tailor-design':{thanks:'願いに合う部品を組み合わせられたね。これなら贈り物を作り始められるよ。',lesson:'求められる働きを、布や留め具の組み合わせに対応させる設計の小さな例です。'},
 'tailor-testing':{thanks:'雨の日も荷物の出し入れも試せたね。使うときの様子がよく分かったよ。',lesson:'用途に合わせた複数の状況で試すと、一つの試験だけでは分からない問題に気づけます。'},
 'tailor-debug':{thanks:'原因を調べて直し、使えるかもう一度確かめられたね。袋も鞄もまた使えるよ。',lesson:'不調の観察、修正、再確認を順に行いました。原因を確かめずに無関係な部分を変えても直るとは限りません。'},
 'guide-needs':{thanks:'旅人の声を聞いてくれてありがとう。どこを直せばよいか、一緒に考えられるわ。',lesson:'使う人の目的や困りごとを聞くことは、利用者を理解するための手がかりです。'},
 'guide-signs':{thanks:'行き先の分かる札ができたわ。初めて来る旅人にも試してもらいましょう。',lesson:'目的地や方向を具体的に示すと、利用者が次の行動を判断しやすくなります。'},
 'guide-access':{thanks:'いろいろな手がかりを考えてくれたのね。それぞれの旅人に使ってもらって確かめましょう。',lesson:'色だけに頼らない表示や操作部の大きさは配慮の例です。必要な工夫は人や状況によって異なります。'},
 'guide-observe':{thanks:'困ったところを聞き、直した後も確かめてくれたわ。少しずつ使いやすくしていけるわね。',lesson:'使う様子を観察し、改善して、再び評価する流れは反復的な設計の例です。'},
};
export function festivalProgress(completed){
 return Object.fromEntries(fourRegionIds.map(region=>[region,Math.min(2,Object.keys(fourRegions[region].quests).filter(id=>completed.includes(id)).length)]));
}
export function festivalReady(completed){return fourRegionIds.every(region=>festivalProgress(completed)[region]===2);}
export function validFourDraft(id,draft){
 const q=fourQuests[id];
 return !!q&&Array.isArray(draft)&&draft.length<=q.scenarios.length&&draft.every((answer,i)=>checkFourAnswer(id,i,answer));
}
export function validFourDrafts(drafts){return !!drafts&&typeof drafts==='object'&&!Array.isArray(drafts)&&Object.entries(drafts).every(([id,draft])=>validFourDraft(id,draft));}
// Unsubmitted choices are stored separately so a reload never loses a partial selection.
export function validFourSelections(selections,drafts){
 if(!selections||typeof selections!=='object'||Array.isArray(selections)||!validFourDrafts(drafts))return false;
 return Object.entries(selections).every(([id,selection])=>{
  const scenario=fourQuests[id]?.scenarios[(drafts[id]??[]).length];
  return !!fourQuests[id]&&Array.isArray(selection)&&new Set(selection).size===selection.length&&
   selection.every(n=>Number.isInteger(n)&&scenario&&n>=0&&n<scenario.choices.length)&&
   (scenario||selection.length===0);
 });
}
export function checkFourAnswer(id,index,selection){
 const s=fourQuests[id]?.scenarios[index];
 return !!s&&Array.isArray(selection)&&selection.length===s.answer.length&&new Set(selection).size===selection.length&&selection.every((n,i)=>s.mode==='sequence'?n===s.answer[i]:s.answer.includes(n));
}
