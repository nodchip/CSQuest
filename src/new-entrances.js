// Each request carries the facts needed for its own two situations.
const scenario=(prompt,choices,answer,hint)=>({prompt,choices,answer,hint});
const sequence=(prompt,choices,answer,hint)=>({...scenario(prompt,choices,answer,hint),mode:'sequence'});
export const newEntrances={
 'workshop-steps':{region:'workshop',title:'ノノへのお願いを並べる',goal:'お願いを順番にたどって目的地を確かめる',person:'lira',
  intro:'ノノは一歩進むお願いで１マス進み、右を向くお願いではその場で向きだけ変えるわ。札を上から順に試してみましょう。',
  lesson:'指示を順番に実行すると、場所や向きが変わります。これはプログラムの制御の流れと状態の入門です。',
  scenarios:[
   scenario('ノノは東向き。「一歩進む、右を向く、一歩進む」とお願いすると、始めの場所からどこへ着く？',['東に２マス','東に１マス、南に１マス','南に２マス'],[1],'東へ進んでから、右に向きを変えて進みます。'),
   scenario('ノノは南向き。「右を向く、一歩進む」とお願いすると、始めの場所からどこへ着く？',['西に１マス','東に１マス','南に１マス'],[0],'南を向いているノノが右を向くと西向きになります。')]},
 'archive-searches':{region:'archive',title:'二つの棚を調べる',goal:'順番に並んだ棚から探す範囲をしぼる',person:'aoi',
  intro:'番号順に並んだ棚なら、選んだ番号と目的の番号を比べて、調べる範囲をしぼれます。',
  lesson:'順序づけられた記録を比較し、候補を減らしました。探索アルゴリズムの考え方の一例です。',
  scenarios:[
   scenario('棚の番号は左から10、20、30、40、50。40を探し、中央の30を見た。次に探す範囲は？',['30より左','30より右','すべての棚を最初から'],[1],'40は30より大きく、番号は小さい順に並んでいます。'),
   scenario('棚の番号は左から10、20、30、40、50。20を探し、中央の30を見た。次に探す範囲は？',['30より右','すべての棚を最初から','30より左'],[2],'20は30より小さいので、左側にあります。')]},
 'valley-records':{region:'valley',title:'届け先の記録を選ぶ',goal:'記録の条件に合う荷物を選ぶ',person:'yuno',
  intro:'荷物の札には行き先と準備の状態が書いてあるの。両方の条件に合う札だけを集めましょう。',
  lesson:'決めた条件を満たす記録を選びました。データの問い合わせで行う選択の小さな例です。',
  scenarios:[
   scenario('山行きで準備済みの荷物はどれ？',['山行き・準備中','村行き・準備済み','山行き・準備済み'],[2],'山行きと準備済みの両方を確かめます。'),
   scenario('村行きで準備済みの荷物はどれ？',['村行き・準備済み','山行き・準備済み','村行き・準備中'],[0],'村行きと準備済みの両方を確かめます。')]},
 'station-sharing':{region:'station',title:'仕事の順番を決める',goal:'順番に仕事を進める',person:'haru',
  intro:'駅の一台の作業台では、一度に一人の仕事だけ進められる。今回は届いた順番に作業するよ。',
  lesson:'一つの作業台を順番に使いました。OS が複数の仕事の実行順を決めるスケジューリングにつながる例です。',
  scenarios:[
   scenario('仕事Ｂが先、仕事Ａが後に届いた。先に作業するのは？',['Ａ','Ｂ','同時に両方'],[1],'届いた順番に一つずつ作業します。'),
   scenario('仕事Ｃが先、仕事Ｄが後に届いた。Ｃが終わった後に作業するのは？',['Ｃをもう一度','同時に両方','Ｄ'],[2],'先に届いたＣが終わったら、残ったＤです。')]},
 'windmill-signals':{region:'windmill',title:'風車の合図を確かめる',goal:'合図を受けた灯りの動きを確かめる',person:'toma',
  intro:'橋の安全灯は、橋が安全で、向こうから合図も来たときだけ点くんだ。二つの状態を確かめよう。',
  lesson:'二つの入力から決まる灯りの出力を考えました。システムを部品と入出力の関係で考える入口です。',
  scenarios:[
   scenario('橋は安全、向こうからの合図はまだない。灯りはどうする？',['点ける','消したままにする','条件だけでは決められない'],[1],'二つの条件が両方そろうまでは点けません。'),
   scenario('橋は安全で、向こうからの合図も来た。灯りはどうする？',['消したままにする','条件だけでは決められない','点ける'],[2],'安全と合図の両方がそろいました。')]},
 'river-signals':{region:'river',title:'水門への合図',goal:'合図の意味と順番を確かめる',person:'mizuho',
  intro:'水門には、青い札なら開く、赤い札なら閉じると伝えています。札の意味を知っていれば、違う順番でも動きをたどれるよ。',
  lesson:'記号に意味を与え、並びが表す動きを考えました。プログラミング言語でも、書き方と意味を区別します。',
  scenarios:[
   scenario('水門は最初閉じている。青、赤の順に札を出すと、最後はどうなる？',['開いている','閉じている','札だけでは分からない'],[1],'青で開き、その後に赤で閉じます。'),
   scenario('水門は最初閉じている。赤、青の順に札を出すと、最後はどうなる？',['閉じている','札だけでは分からない','開いている'],[2],'最後の青は、水門を開く合図です。')]},
 'harbor-parallel':{region:'harbor',title:'二人で運ぶ荷物',goal:'同時に使えない台車を譲り合う',person:'ren',
  intro:'二人はそれぞれ荷物を運ぶけれど、台車は一台だけ。一人が借りて運んで返してから、次の人が使う順番を作ろう。',
  lesson:'同時に進む仕事が共有する道具を、ぶつからないよう順番に使いました。並行処理の調整の小さな例です。',
  scenarios:[
   sequence('アオから先に荷物を運ぶ。二人がそれぞれ借りて運び、返すまでの作業を順番に選ぼう。',['アオが借りる','ビーが運ぶ','アオが運ぶ','ビーが借りる','アオが返す','ビーが返す'],[0,2,4,3,1,5],'アオが借り、運び、返してから、ビーが借ります。'),
   sequence('今度はビーから先に荷物を運ぶ。二人の作業を順番に選ぼう。',['アオが返す','ビーが借りる','アオが借りる','ビーが返す','アオが運ぶ','ビーが運ぶ'],[1,5,3,2,4,0],'ビーが借り、運び、返してから、アオが借ります。')]},
 'garden-mosaic':{region:'garden',title:'花壇の絵をつくる',goal:'小さな色のマスで絵を表す',person:'nagi',
  intro:'花壇の絵を、色を塗った小さなマスの集まりで作ろう。一つのマスには一つの色を置くよ。',
  lesson:'マスの位置と色の集まりで絵を表しました。画面の画像を画素の集まりで表す方法に通じます。',
  scenarios:[
   scenario('左から３マスを「青・黄・青」にしたい。黄色を置く場所は？',['右のマス','真ん中のマス','左のマス'],[1],'青の間に黄が来ます。'),
   scenario('左から「赤・赤・白」にしたい。白を置く場所は？',['左のマス','真ん中のマス','右のマス'],[2],'最後のマスだけが白です。')]},
 'guide-privacy':{region:'guide',title:'旅人の知らせを預かる',goal:'必要な情報と本人の希望を確かめる',person:'marta',
  intro:'旅人の情報を預かるときは、何のために必要かを伝え、本人の希望を確かめましょう。',
  lesson:'情報を集める目的と、共有してよい範囲を考えました。状況に応じて、プライバシーへの配慮が必要です。',
  scenarios:[
   scenario('落とし物を本人へ返すため連絡先を尋ねる。まず伝えることは？',['連絡先の利用目的','すべての記録を公開する約束','好きな色の質問だけ'],[0],'何に使う情報か、本人が分かるようにします。'),
   scenario('旅人は連絡先を落とし物の返却にだけ使ってほしいと言った。案内板に連絡先を載せる？',['人目につく場所に載せる','本人の希望を確かめず配る','返却以外に公開しない'],[2],'預かった目的と本人の希望を大切にします。')]},
 'observatory-devices':{region:'observatory',title:'旅先の観測道具',goal:'持ち歩く道具に必要な機能を選ぶ',person:'sena',
  intro:'旅先で観測を記録できる携帯道具を作りたいの。使う場所と旅人の希望に合う機能を選んでね。',
  lesson:'持ち運ぶ端末に、許可を得た位置情報や通信がない間の保存を考えました。実際の開発では、端末や利用者に合わせた配慮が必要です。',
  scenarios:[
   scenario('旅人は観測した場所を記録したい。携帯道具に用意する機能は？',['何も確認せず常に位置を公開する','旅人の許可を得て、現在地を記録する','場所を記録せず色だけ変える'],[1],'本人に確認し、現在地を記録できるようにします。'),
   scenario('山では通信が届かない。観測を後から届けるための機能は？',['通信がない間は記録しない','端末に記録を保存し、通信できたら送る','通信がないことを隠して記録を消す'],[1],'通信できない間も端末に保存し、後で送ります。')]},
};
export const newEntranceIds=Object.keys(newEntrances);
export function checkNewEntrance(id,index,selection){
 const expected=newEntrances[id]?.scenarios[index]?.answer;
 const ordered=newEntrances[id]?.scenarios[index]?.mode==='sequence';
 return !!expected&&Array.isArray(selection)&&selection.length===expected.length&&new Set(selection).size===selection.length&&selection.every((n,i)=>ordered?n===expected[i]:expected.includes(n));
}
export function validNewEntranceDrafts(drafts,selections){
 if(!drafts||typeof drafts!=='object'||Array.isArray(drafts)||!selections||typeof selections!=='object'||Array.isArray(selections))return false;
 for(const [id,draft] of Object.entries(drafts)){
  const q=newEntrances[id];
  if(!q||!Array.isArray(draft)||draft.length>q.scenarios.length||draft.some((answer,i)=>!checkNewEntrance(id,i,answer)))return false;
 }
 return Object.entries(selections).every(([id,selection])=>{
  const q=newEntrances[id],scenario=q?.scenarios[(drafts[id]??[]).length];
  return !!q&&Array.isArray(selection)&&new Set(selection).size===selection.length&&selection.every(n=>Number.isInteger(n)&&scenario&&n>=0&&n<scenario.choices.length)&&(!!scenario||selection.length===0);
 });
}
