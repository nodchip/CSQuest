import {commands,levels,runScenarios} from './engine.js';
import {journeyQuests,workshopQuestIds,unlocked,completeQuest,emptyDraft,validDraft} from './workshop-journey-data.js';
import {cityQuestIds,recommend,validAnnouncements,restoreCitySort,restoreCityQueue} from './workshop-city.js';
import {containerEvents,containerStep} from './containers.js';
import {harborNodes,harborUnlocked,validHarborRoute,harborNext,harborDelivered} from './harbor-route.js';
import {midQuests,midIds,recordNumbers,windTasks,midUnlocked,bridgeReady,midReplay,validMidDrafts} from './midgame.js';

const app=document.querySelector('#preview');
const level=levels.find(item=>item.id==='sequence');
const forestLevel={cols:2,rows:2,start:[0,0],direction:1,goal:[1,1],walls:[[0,1]],available:['forward','right'],max:4};
const saveKey='csquest-workshop-journey-v1',settingsKey='csquest-workshop-preview-settings-v1';
let state=null,saveProtected=false,settingsProtected=false,settings={size:'normal',contrast:'normal',motion:'on'};
let error='';
try{
  const raw=localStorage.getItem(saveKey);
  if(raw!==null){
    const saved=JSON.parse(raw);
    const places=['world','introduction','quest','opening-done','choices','talk','outside','forest-quest','forest-done','encounter','journey-quest','journey-done','travel','river','city','city-guild','city-market','city-quest','city-result','city-festival','harbor','harbor-quest','harbor-result','mid-archive','mid-windmill','mid-quest','mid-result','mid-bridge'];
    if(!saved||!places.includes(saved.place)||!Array.isArray(saved.program)||saved.program.length>level.max||saved.program.some(id=>!level.available.includes(id))||typeof saved.executed!=='boolean'||(saved.executed&&!saved.program.length)||(!['world','introduction','quest'].includes(saved.place)&&(!saved.executed||!runScenarios(level,saved.program).success)))throw Error('invalid');
    const forestProgram=saved.forestProgram??[],forestExecuted=saved.forestExecuted??false;
    if(!Array.isArray(forestProgram)||forestProgram.length>forestLevel.max||forestProgram.some(id=>!forestLevel.available.includes(id))||typeof forestExecuted!=='boolean'||(forestExecuted&&!forestProgram.length)||(saved.place==='forest-done'&&(!forestExecuted||!runScenarios(forestLevel,forestProgram).success)))throw Error('invalid');
    const completed=saved.completed??[],drafts=saved.drafts??{},activeQuest=saved.activeQuest??null;
    if(!Array.isArray(completed)||completed.some(id=>!['forest','branch','loop','river','harbor-message',...cityQuestIds,...midIds].includes(id))||new Set(completed).size!==completed.length||!drafts||typeof drafts!=='object'||Object.keys(drafts).some(id=>!validDraft(id,drafts[id]))||(['encounter','journey-quest','journey-done'].includes(saved.place)&&!journeyQuests[activeQuest])||(['travel','river','city','city-guild','city-market','city-quest','city-result','city-festival','harbor','harbor-quest','harbor-result',...['mid-archive','mid-windmill','mid-quest','mid-result','mid-bridge']].includes(saved.place)&&!unlocked(completed))||(saved.place==='journey-done'&&(!completed.includes(activeQuest)||!drafts[activeQuest]?.executed||!runScenarios(journeyQuests[activeQuest].level,drafts[activeQuest].program).success)))throw Error('invalid');
    const citySort=saved.citySort??[],cityQueue=saved.cityQueue??[],cityQuest=saved.cityQuest??null,cityFrom=saved.cityFrom??'city-guild',announced=saved.announced??[];
    const sorted=restoreCitySort(citySort),queue=restoreCityQueue(cityQueue);
    if(!validAnnouncements(announced)||![null,...cityQuestIds].includes(cityQuest)||!['city-guild','city-market'].includes(cityFrom)||(['city-quest','city-result'].includes(saved.place)&&!cityQuest)||(saved.place==='city-result'&&(!completed.includes(cityQuest)||(cityQuest==='city-sort'?!sorted.done:queue.history.length!==containerEvents.length)))||(saved.place==='city-festival'&&!cityQuestIds.some(id=>completed.includes(id))))throw Error('invalid');
    const harborRoute=saved.harborRoute??[];
    if(!validHarborRoute(harborRoute)||(saved.place.startsWith('harbor')&&!harborUnlocked(completed))||(saved.place==='harbor-result'&&(!completed.includes('harbor-message')||!harborDelivered(harborRoute))))throw Error('invalid');
    const midActive=saved.midActive??null,midDrafts=saved.midDrafts??{},bridgeOpen=saved.bridgeOpen??false,bridgeFrom=saved.bridgeFrom??'archive';
    if(!validMidDrafts(midDrafts)||![null,...midIds].includes(midActive)||typeof bridgeOpen!=='boolean'||!['archive','windmill'].includes(bridgeFrom)||(saved.place.startsWith('mid-')&&!midUnlocked(completed))||(['mid-quest','mid-result'].includes(saved.place)&&!midActive)||(saved.place==='mid-result'&&(!completed.includes(midActive)||!midReplay(midActive,midDrafts[midActive]??[]).done))||((bridgeOpen||saved.place==='mid-bridge')&&!bridgeReady(completed)))throw Error('invalid');
    state={place:saved.place,program:[...saved.program],executed:saved.executed,forestProgram:[...forestProgram],forestExecuted,completed:[...completed],drafts,activeQuest,citySort:[...citySort],cityQueue:[...cityQueue],cityQuest,cityFrom,announced:[...announced],harborRoute:[...harborRoute],midActive,midDrafts,bridgeOpen,bridgeFrom};
  }
}catch{saveProtected=true;}
try{
  const raw=localStorage.getItem(settingsKey);
  if(raw!==null){const value=JSON.parse(raw);if(!value||!['normal','large'].includes(value.size)||!['normal','high'].includes(value.contrast)||!['off','system','on'].includes(value.motion??'on'))throw Error('invalid');settings={...value,motion:value.motion??'on'};}
}catch{settingsProtected=true;}
function applySettings(){document.documentElement.dataset.size=settings.size;document.documentElement.dataset.contrast=settings.contrast;document.documentElement.dataset.motion=settings.motion;}
function persist(){
  if(saveProtected){error='冒険の記録を読み込めないため、元の記録を保護しています。今回の進行は保存されません。';return;}
  try{localStorage.setItem(saveKey,JSON.stringify(state));error='';}catch{error='冒険を保存できません。再読み込みすると進行が失われます。';}
}
function warning(){return error?`<p class="notice" role="status">${error}</p>`:'';}
function show(place){state.place=place;persist();render();window.scrollTo(0,0);}
function dialogue(id,line){const who={lira:'リラ',nono:'ノノ',kaede:'カエデ',mizuho:'ミズホ',mina:'ミナ',sara:'サラ',ren:'レン',aoi:'アオイ',toma:'ゲン'}[id];return `<div class="speech"><span class="portrait ${id}" role="img" aria-label="${who}の顔"></span><p class="dialogue"><strong>${who}</strong><br>「${line}」</p></div>`;}
function advice(place,speaker){
  const suggestion=recommend(place,state.completed),key=suggestion?`${place}:${suggestion[0]}`:null;
  let line='';
  if(key&&!state.announced.includes(key)){state.announced.push(key);persist();line=dialogue(speaker,`次は『${suggestion[1]}』を手伝ってみない？ ほかのことを選んでも大丈夫だよ。`);}
  return `<div class="advice"><div id="advice-response" role="status">${line}</div><button id="ask-advice">次のおすすめを聞く</button></div>`;
}
function bindAdvice(place,speaker){app.querySelector('#ask-advice').onclick=()=>{const suggestion=recommend(place,state.completed);app.querySelector('#advice-response').innerHTML=dialogue(speaker,suggestion?`『${suggestion[1]}』を手伝ってみない？ 好きな依頼を選んでね。`:'この場所で紹介できる依頼は、今は全部お手伝い済みだよ。');};}
function title(){
  app.innerHTML=`<section class="scene title-screen"><img src="./data/art/spirit-workshop.png" alt="森のそばの精霊の工房"><h1>CS Quest</h1><p>精霊とともに、小さな冒険へ。</p><p>この冒険は開発中です。遊べる地域は今後増えていきます。</p>${warning()}<div class="actions"><button class="${state?'':'primary'}" id="new">冒険を始める</button><button id="continue" ${state?'':'disabled'}>続きから</button><button id="settings">設定</button></div><details><summary>この体験版について</summary><p>風景・人物のイラストは CS Quest のために画像生成ツールを使って制作しました。学習内容の参考：<a href="https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm">Computer Science Curricula 2023</a>。</p></details></section>`;
  app.querySelector('#new').onclick=()=>{if(state&&!window.confirm('体験版の現在の冒険を最初から始めます。よろしいですか？'))return;state={place:'world',program:[],executed:false,forestProgram:[],forestExecuted:false,completed:[],drafts:{},activeQuest:null,citySort:[],cityQueue:[],cityQuest:null,cityFrom:'city-guild',announced:[],harborRoute:[],midActive:null,midDrafts:{},bridgeOpen:false,bridgeFrom:'archive'};persist();render();};
  app.querySelector('#continue').onclick=render;
  app.querySelector('#settings').onclick=settingScreen;
}
function settingScreen(){
  app.innerHTML=`<section class="panel"><h1>表示設定</h1><label>文字の大きさ <select id="size"><option value="normal">標準</option><option value="large">大きめ</option></select></label><label>コントラスト <select id="contrast"><option value="normal">標準</option><option value="high">強め</option></select></label><label>依頼達成の演出 <select id="motion"><option value="off">動かさない</option><option value="system">端末の設定に従う</option><option value="on">動かす</option></select></label><p role="status">${settingsProtected?'表示設定を保存できません。':''}</p><button id="settings-back">タイトルへ戻る</button></section>`;
  const size=app.querySelector('#size'),contrast=app.querySelector('#contrast'),motion=app.querySelector('#motion');size.value=settings.size;contrast.value=settings.contrast;motion.value=settings.motion;
  const update=()=>{settings={size:size.value,contrast:contrast.value,motion:motion.value};applySettings();if(!settingsProtected)try{localStorage.setItem(settingsKey,JSON.stringify(settings));}catch{settingsProtected=true;}app.querySelector('[role=status]').textContent=settingsProtected?'表示設定を保存できません。':'';};
  size.onchange=update;contrast.onchange=update;motion.onchange=update;app.querySelector('#settings-back').onclick=title;size.focus();
}
function world(){
  app.innerHTML=`<section class="scene"><img src="./data/art/spirit-workshop.png" alt="森のそばにたたずむ精霊の工房"><h1>精霊と人が暮らす世界</h1><p>この世界では、人と精霊が力を合わせて暮らしています。町はずれの工房では、灯りや道具を作り、旅人たちを助けています。</p><p>ある夕暮れ、工房の灯りが消えてしまいました。</p>${warning()}<button class="primary" id="next">工房を訪ねる</button></section>`;
  app.querySelector('#next').onclick=()=>show('introduction');
}
function introduction(){
  app.innerHTML=`<section class="scene"><h1>工房での出会い</h1><div class="characters"><figure><img src="./data/art/lira.png" alt="緑の服と白いエプロンを着た工房の見習いリラの全身"><figcaption><strong>リラ</strong><br>工房で道具を作る見習い</figcaption></figure><figure><img src="./data/art/nono.png" alt="葉のような手と明るい顔を持つ小さな光の精霊ノノの全身"><figcaption><strong>ノノ</strong><br>道案内が好きな光の精霊</figcaption></figure></div>${dialogue('lira','困ったわ。工房の灯りが消えてしまったの。ノノに灯りのかけらまでの道を教えてくれない？')}${dialogue('nono','うん！ 道を教えてくれたら、わたしが取りに行くよ。')}<p>ノノと一緒に灯りのかけらを取りに行きましょう。</p>${warning()}<button class="primary" id="accept">ノノを手伝う</button></section>`;
  app.querySelector('#accept').onclick=()=>show('quest');
}
function quest(){
  const result=state.executed?runScenarios(level,state.program):null;
  const trace=result?.cases[0].trace,position=trace?.at(-1)??{x:0,y:0,direction:1};
  const facing=['↑','→','↓','←'][position.direction];
  const cells=Array.from({length:3},(_,x)=>`<div class="tile" role="gridcell" aria-label="${x+1}マス目${position.x===x?'、ノノ、'+['上','右','下','左'][position.direction]+'向き':''}${x===2?'、灯りのかけら':''}">${position.x===x?facing:''}${x===2?' ✦':''}</div>`).join('');
  app.innerHTML=`<h1>ノノに道を教えよう</h1>${dialogue('nono','わたしは矢印の向きに進むよ。灯りのかけらまで連れていってね！')}<section class="panel"><h2>目標：灯りのかけらにたどり着く</h2><p class="tiles-label">矢印がノノ、✦ が灯りのかけらです。</p><div class="map" role="grid" aria-label="工房への道">${cells}</div><p>お願いを選ぶと、上から順に実行します。最大 ${level.max} 枚まで並べられます。</p><div class="program" aria-label="お願いの順番">${state.program.length?`<ol>${state.program.map((id,i)=>`<li>${i+1}. ${commands[id].label} <button data-remove="${i}" aria-label="${i+1}番目のお願いを消す">×</button></li>`).join('')}</ol>`:'<p>まだお願いはありません。</p>'}</div><div class="actions">${level.available.map(id=>`<button data-command="${id}" ${state.program.length>=level.max?'disabled':''}>${commands[id].icon} ${commands[id].label}</button>`).join('')}</div><p><button id="execute" class="primary" ${state.program.length?'':'disabled'}>ノノにお願いする</button></p><details><summary>手がかりを聞く</summary><p>${level.hint}</p></details>${warning()}</section>${result&&!result.success?`<section class="panel result" role="status"><h2>まだ灯りに届いていません</h2>${dialogue('nono','違う場所に着いたみたい。お願いを変えて、もう一度試してね。')}<p>${trace.map(step=>step.message).join(' → ')}</p></section>`:''}${result?.success?`<section class="panel result"><h2>灯りを見つけました！</h2><p>${trace.map(step=>step.message).join(' → ')}</p><button id="open-result" class="primary">達成の場面を見る</button></section><dialog id="success-dialog" class="story-success" aria-labelledby="success-title"><h2 id="success-title">依頼達成<span class="success-detail">灯りを見つけました！</span></h2>${dialogue('nono','やった！ リラのところに持って帰ろう！')}<div class="actions"><button id="return" class="primary">工房へ戻る</button><button id="review">動きの記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{const id=b.dataset.command;state.program.push(id);state.executed=false;persist();quest();(app.querySelector(`[data-command="${id}"]:not(:disabled)`)||app.querySelector('#execute')).focus();});
  app.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.program.splice(Number(b.dataset.remove),1);state.executed=false;persist();quest();app.querySelector('[data-command]')?.focus();});
  app.querySelector('#execute').onclick=()=>{state.executed=true;persist();quest();const target=app.querySelector('#success-dialog')||app.querySelector('.result h2');if(target?.tagName==='DIALOG')target.showModal();else if(target){target.tabIndex=-1;target.focus();}};
  const dialog=app.querySelector('#success-dialog');
  if(dialog){app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>{dialog.close();app.querySelector('#open-result').focus();};app.querySelector('#return').onclick=()=>{dialog.close();show('opening-done');};dialog.addEventListener('close',()=>{if(app.contains(dialog))app.querySelector('#open-result')?.focus();});}
}
function openingDone(){
  app.innerHTML=`<section class="scene"><h1>工房に灯りが戻りました</h1><img src="./data/art/result-opening.png" alt="工房で、ノノから灯りのかけらを受け取るリラ">${dialogue('lira','ありがとう！ 灯りが戻って、また工房で仕事ができるわ。')}${dialogue('nono','道を教えてくれてありがとう！ 一緒に届けられたね。')}<p>お願いを順番に並べたものを、コンピュータでは「プログラム」と呼びます。</p>${warning()}<button id="back" class="primary">工房で過ごす</button></section>`;
  app.querySelector('#back').onclick=()=>show('choices');
}
function choices(){
  const selection=state.place==='talk'?`<section class="panel" id="next-scene" tabindex="-1"><h2>ノノの話</h2>${dialogue('nono','もっといろんな道を歩いてみたいな。一緒に冒険しようよ！')}</section>`:'';
  const count=workshopQuestIds.filter(id=>state.completed.includes(id)).length;
  const ready=unlocked(state.completed);
  const journeyAdvice=ready?'近くの人たちを助けてくれてありがとう。経験も積めたし、そろそろ遠くへ出かけてみませんか？':count?'遠出の前に、近くで困っている人たちをもう少し手伝って、経験を積みましょう。':'初めて遠くへ出かける前に、近くで困っている人たちを手伝って、経験を積みましょう。';
  app.innerHTML=`<section class="scene"><img src="./data/art/spirit-workshop.png" alt="森のそばの精霊の工房"><h1>精霊の工房</h1>${dialogue('lira',journeyAdvice)}<p>お願いを順番に並べたものを、コンピュータでは「プログラム」と呼びます。</p>${advice('workshop','lira')}<div class="actions"><button id="talk">ノノと話す</button><button id="outside">森の入口へ：薬草の届けもの${state.completed.includes('forest')?'（達成済み）':''}</button><button data-encounter="branch">木立の道へ：届けもの${state.completed.includes('branch')?'（達成済み）':''}</button><button data-encounter="loop">工房の水路へ：消えた灯り${state.completed.includes('loop')?'（達成済み）':''}</button>${ready?'<button id="travel">旅先を選ぶ</button>':''}</div>${selection}${warning()}<p><button id="title">タイトルへ戻る</button></p></section>`;
  bindAdvice('workshop','lira');
  app.querySelector('#talk').onclick=()=>{state.place='talk';persist();choices();app.querySelector('#next-scene').focus();};
  app.querySelector('#outside').onclick=()=>show('outside');
  app.querySelectorAll('[data-encounter]').forEach(button=>button.onclick=()=>{state.activeQuest=button.dataset.encounter;show('encounter');});
  app.querySelector('#travel')?.addEventListener('click',()=>show('travel'));
  app.querySelector('#title')?.addEventListener('click',title);
}
function forestEncounter(){
  app.innerHTML=`<section class="scene"><h1>森の入口での出会い</h1><p>工房の外へ出ると、森の入口で旅支度をした人が地図を広げていました。</p><div class="characters"><figure><img src="./data/art/kaede.png" alt="外套をまとった森の配達人カエデの全身"><figcaption><strong>カエデ</strong><br>森を行き来する配達人</figcaption></figure></div>${dialogue('kaede','向こうに薬草を忘れてしまって。細い道は荷物を持ったままでは通れないんだ。')}${dialogue('nono','わたしなら通れるよ！ 道を教えてくれない？')}<p>ノノに道を教え、薬草のところまで案内しましょう。</p>${warning()}<div class="actions"><button class="primary" id="forest-accept">手伝う</button><button id="forest-back">いったん工房へ戻る</button></div></section>`;
  app.querySelector('#forest-accept').onclick=()=>show('forest-quest');app.querySelector('#forest-back').onclick=()=>show('choices');
}
function forestQuest(){
  const result=state.forestExecuted?runScenarios(forestLevel,state.forestProgram):null;
  const trace=result?.cases[0].trace,position=trace?.at(-1)??{x:0,y:0,direction:1};
  const cells=Array.from({length:4},(_,i)=>{const x=i%2,y=Math.floor(i/2),wall=x===0&&y===1,goal=x===1&&y===1,here=position.x===x&&position.y===y;return `<div class="tile${wall?' wall':''}" role="gridcell" aria-label="${y+1}行${x+1}列${wall?'、通れない木':''}${here?'、ノノ、'+['上','右','下','左'][position.direction]+'向き':''}${goal?'、薬草':''}">${wall?'🌲':''}${here?['↑','→','↓','←'][position.direction]:''}${goal?' 🌿':''}</div>`;}).join('');
  app.innerHTML=`<h1>森の薬草を取りに行こう</h1>${dialogue('nono','矢印の向きに進むよ。🌿 の薬草まで連れていってね！')}<section class="panel"><h2>目標：薬草にたどり着く</h2><p>矢印がノノ、🌲 は通れない木です。「右を向く」では進まず、その場で向きだけ変えます。</p><div class="map forest-map" role="grid" aria-label="森の小道">${cells}</div><p>お願いは上から順に実行します。最大 ${forestLevel.max} 枚まで並べられます。</p><div class="program" aria-label="お願いの順番">${state.forestProgram.length?`<ol>${state.forestProgram.map((id,i)=>`<li>${i+1}. ${commands[id].label} <button data-remove="${i}" aria-label="${i+1}番目のお願いを消す">×</button></li>`).join('')}</ol>`:'<p>まだお願いはありません。</p>'}</div><div class="actions">${forestLevel.available.map(id=>`<button data-command="${id}" ${state.forestProgram.length>=forestLevel.max?'disabled':''}>${commands[id].icon} ${commands[id].label}</button>`).join('')}</div><p><button id="execute" class="primary" ${state.forestProgram.length?'':'disabled'}>ノノにお願いする</button></p><details><summary>手がかりを聞く</summary><p>まず右へ１マス進み、その場で右を向いてから、もう１マス進んでみましょう。</p></details>${warning()}<button id="back">森の入口へ戻る</button></section>${result&&!result.success?`<section class="panel result" role="status"><h2>まだ薬草に届いていません</h2>${dialogue('nono','お願いの順番を変えて、もう一度試してみよう！')}<p>${trace.map(step=>step.message).join(' → ')}</p></section>`:''}${result?.success?`<section class="panel result"><h2>薬草を見つけました！</h2><p>${trace.map(step=>step.message).join(' → ')}</p><button id="open-result" class="primary">達成の場面を見る</button></section><dialog id="success-dialog" class="story-success" aria-labelledby="forest-success-title"><h2 id="forest-success-title">依頼達成<span class="success-detail">薬草を見つけました！</span></h2>${dialogue('nono','あったよ！ カエデに届けよう！')}<div class="actions"><button id="return" class="primary">薬草を届ける</button><button id="review">動きの記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{const id=b.dataset.command;state.forestProgram.push(id);state.forestExecuted=false;persist();forestQuest();(app.querySelector(`[data-command="${id}"]:not(:disabled)`)||app.querySelector('#execute')).focus();});
  app.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.forestProgram.splice(Number(b.dataset.remove),1);state.forestExecuted=false;persist();forestQuest();app.querySelector('[data-command]')?.focus();});
  app.querySelector('#back').onclick=()=>show('outside');
  app.querySelector('#execute').onclick=()=>{state.forestExecuted=true;persist();forestQuest();const target=app.querySelector('#success-dialog')||app.querySelector('.result h2');if(target?.tagName==='DIALOG')target.showModal();else if(target){target.tabIndex=-1;target.focus();}};
  const dialog=app.querySelector('#success-dialog');if(dialog){app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>dialog.close();app.querySelector('#return').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,'forest');show('forest-done');};dialog.addEventListener('close',()=>{if(app.contains(dialog))app.querySelector('#open-result')?.focus();});}
}
function forestDone(){
  app.innerHTML=`<section class="scene"><h1>薬草を届けました</h1><img src="./data/art/forest-herb-handoff.png" alt="森の入口で、ノノから薬草を受け取るカエデ">${dialogue('kaede','ありがとう！ この薬草を待っている川向こうの村へ、すぐに届けるよ。最近、向こうでも灯りが消えることがあるそうなんだ。')}${dialogue('nono','カエデに届けられてよかった！ 一緒に道を考えてくれてありがとう！')}<p>行うことの順番を変えると、たどり着く場所も変わります。これもプログラムの大切な考え方です。</p>${warning()}<button id="back" class="primary">工房へ戻る</button></section>`;app.querySelector('#back').onclick=()=>show('choices');
}
function encounter(){
  const quest=journeyQuests[state.activeQuest];
  const intro=state.activeQuest==='river'?`<div class="characters"><figure><img src="./data/art/mizuho.png" alt="灯りを持つ水辺の村の世話役ミズホの全身"><figcaption><strong>ミズホ</strong><br>水辺の村の世話役</figcaption></figure></div>`:'';
  app.innerHTML=`<section class="scene"><h1>${quest.place}での出会い</h1>${intro}${dialogue(quest.speaker,quest.intro)}${dialogue('nono','わたしが行くよ！ 道を教えてね。')}<p>目標：ノノを${quest.object}まで案内する。</p>${warning()}<div class="actions"><button id="accept" class="primary">手伝う</button><button id="back">戻る</button></div></section>`;
  app.querySelector('#accept').onclick=()=>{state.drafts[state.activeQuest]??=emptyDraft();show('journey-quest');};
  app.querySelector('#back').onclick=()=>show(state.activeQuest==='river'?'river':'choices');
}
function journeyQuest(){
  const id=state.activeQuest,quest=journeyQuests[id],level=quest.level,draft=state.drafts[id]??(state.drafts[id]=emptyDraft());
  const result=draft.executed?runScenarios(level,draft.program):null;
  const scenarios=level.scenarios??[{name:'通り道',goal:level.goal,walls:level.walls}];
  const maps=scenarios.map((scenario,index)=>{
    const position=result?.cases[index].trace.at(-1)??{x:level.start[0],y:level.start[1],direction:level.direction};
    const goal=scenario.goal??level.goal,walls=scenario.walls??level.walls;
    const cells=Array.from({length:level.cols*level.rows},(_,i)=>{const x=i%level.cols,y=Math.floor(i/level.cols),wall=walls.some(([wx,wy])=>wx===x&&wy===y),here=position.x===x&&position.y===y,target=goal[0]===x&&goal[1]===y;return `<div class="tile${wall?' wall':''}" role="gridcell" aria-label="${y+1}行${x+1}列${wall?'、壁':''}${here?'、ノノ、'+['上','右','下','左'][position.direction]+'向き':''}${target?'、'+quest.object:''}">${wall?'🌲':''}${here?['↑','→','↓','←'][position.direction]:''}${target?' ✦':''}</div>`;}).join('');
    return `<section><h3>${scenario.name}${result?'：'+(result.cases[index].success?'到着':'未到着'):''}</h3><div class="map" role="grid" aria-label="${scenario.name}" style="grid-template-columns:repeat(${level.cols},minmax(0,1fr))">${cells}</div>${result?`<p>${result.cases[index].trace.map(step=>step.message).join(' → ')}</p>`:''}</section>`;
  }).join('');
  app.innerHTML=`<h1>${quest.title}</h1>${dialogue('nono','矢印の向きに進むよ。✦ のところまで連れていってね！')}<section class="panel"><h2>目標：${scenarios.length>1?'どちらの道でも':''}${quest.object}にたどり着く</h2><p>矢印がノノ、🌲 は通れない壁、✦ が目的地です。地図の外にも進めません。${scenarios.length>1?'同じお願いの並びを両方の道で試します。':''}</p>${maps}<p>お願いは上から順に実行します。最大 ${level.max} 枚まで並べられます。</p><ul>${level.available.map(command=>`<li>${commands[command].label}：${commands[command].description}</li>`).join('')}</ul><div class="program" aria-label="お願いの順番">${draft.program.length?`<ol>${draft.program.map((command,i)=>`<li>${i+1}. ${commands[command].label} <button data-remove="${i}" aria-label="${i+1}番目のお願いを消す">×</button></li>`).join('')}</ol>`:'<p>まだお願いはありません。</p>'}</div><div class="actions">${level.available.map(command=>`<button data-command="${command}" ${draft.program.length>=level.max?'disabled':''}>${commands[command].icon} ${commands[command].label}</button>`).join('')}</div><p><button id="execute" class="primary" ${draft.program.length?'':'disabled'}>ノノにお願いする</button></p><details><summary>手がかりを聞く</summary><p>${quest.hint}</p></details>${warning()}<button id="back">依頼の説明に戻る</button></section>${result&&!result.success?`<section class="panel result" role="status"><h2>まだ目標に届いていません</h2>${dialogue('nono','お願いを変えて、もう一度試してみよう！')}</section>`:''}${result?.success?`<section class="panel result"><h2>目標にたどり着きました！</h2><button id="open-result" class="primary">達成の場面を見る</button></section><dialog id="success-dialog" class="story-success" aria-labelledby="journey-success-title"><h2 id="journey-success-title">依頼達成<span class="success-detail">目標にたどり着きました！</span></h2>${dialogue('nono','やった！ 知らせに戻ろう！')}<div class="actions"><button id="return" class="primary">結果を伝える</button><button id="review">動きの記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-command]').forEach(button=>button.onclick=()=>{const command=button.dataset.command;draft.program.push(command);draft.executed=false;persist();journeyQuest();(app.querySelector(`[data-command="${command}"]:not(:disabled)`)||app.querySelector('#execute')).focus();});
  app.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{draft.program.splice(Number(button.dataset.remove),1);draft.executed=false;persist();journeyQuest();app.querySelector('[data-command]')?.focus();});
  app.querySelector('#back').onclick=()=>show('encounter');
  app.querySelector('#execute').onclick=()=>{draft.executed=true;persist();journeyQuest();const target=app.querySelector('#success-dialog')||app.querySelector('.result h2');if(target?.tagName==='DIALOG')target.showModal();else if(target){target.tabIndex=-1;target.focus();}};
  const dialog=app.querySelector('#success-dialog');if(dialog){app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>dialog.close();app.querySelector('#return').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,id);show('journey-done');};dialog.addEventListener('close',()=>{if(app.contains(dialog))app.querySelector('#open-result')?.focus();});}
}
function journeyDone(){
  const quest=journeyQuests[state.activeQuest];
  const title={branch:'届けものが届きました',loop:'水路に灯りが戻りました',river:'水辺の道が明るくなりました'}[state.activeQuest];
  const alt={branch:'木立の道で届けものを受け取る旅人と、喜ぶノノとリラ',loop:'工房の水路で灯りをともすノノとリラ',river:'水辺の村で灯りをともすノノとミズホ'}[state.activeQuest];
  app.innerHTML=`<section class="scene"><h1>${title}</h1><img src="./data/art/result-${state.activeQuest}.png" alt="${alt}">${dialogue(quest.speaker,quest.success)}${dialogue('nono',state.activeQuest==='branch'?'届けものが届いてよかった！':state.activeQuest==='loop'?'水路が明るくなったね！':'水辺の道が明るくなったね！')}<p>${quest.lesson}</p>${state.activeQuest==='river'?dialogue('mizuho','遠くの道しるべの灯りも消えているそうだよ。各地の灯りを取り戻して、人と精霊が安心して行き来できる道をつなげられたらいいね。'):dialogue('lira','川向こうの村でも灯りに困っていると聞いたわ。準備ができたら、手伝いに行きましょう。')}${warning()}<button id="back" class="primary">${state.activeQuest==='river'?'水辺の村':'工房'}へ戻る</button></section>`;
  app.querySelector('#back').onclick=()=>show(state.activeQuest==='river'?'river':'choices');
}
function travel(){
  const harbor=harborUnlocked(state.completed),mid=midUnlocked(state.completed);
  app.innerHTML=`<section class="scene"><h1>旅先を選ぶ</h1><img src="./data/art/world-map.png" alt="森や川、町が描かれた旅の地図">${dialogue('lira',mid?'レンが教えてくれた森の文庫と風車の里にも行ってみましょう。どちらから訪ねてもいいわ。':harbor?'村や街を旅して、少し遠くまで出かけられそうね。風の港町にも行ってみない？':'川向こうの村や、祭りの準備でにぎわう街にも行けるわ。工房にはいつでも帰れるからね。')}<p>行き先を選んでください。</p>${warning()}<div class="actions"><button id="river">水辺の村へ行く</button><button id="city">街へ行く</button>${harbor?'<button id="harbor">風の港町へ行く</button>':''}${mid?'<button id="archive">森の文庫へ行く</button><button id="windmill">風車の里へ行く</button>':''}<button id="back">工房にとどまる</button></div></section>`;app.querySelector('#river').onclick=()=>show('river');app.querySelector('#city').onclick=()=>show('city');app.querySelector('#harbor')?.addEventListener('click',()=>show('harbor'));app.querySelector('#archive')?.addEventListener('click',()=>show('mid-archive'));app.querySelector('#windmill')?.addEventListener('click',()=>show('mid-windmill'));app.querySelector('#back').onclick=()=>show('choices');
}
function river(){
  app.innerHTML=`<section class="scene river-scene"><img src="./data/art/river-village.png" alt="川と橋のある水辺の村"><h1>水辺の村</h1>${dialogue('nono','川がきらきらしてる！ あそこにいる人に話しかけてみよう。')}<p>村では道を照らす灯りが消え、川の水かさによって道が変わるようです。</p>${advice('river','nono')}${warning()}<div class="actions"><button id="help" class="primary">村の世話役に話す${state.completed.includes('river')?'（依頼達成済み）':''}</button><button id="back">工房へ戻る</button></div></section>`;
  bindAdvice('river','nono');
  app.querySelector('#help').onclick=()=>{state.activeQuest='river';show('encounter');};app.querySelector('#back').onclick=()=>show('choices');
}
function city(){
  const festival=cityQuestIds.some(id=>state.completed.includes(id));
  app.innerHTML=`<section class="scene city-scene"><img src="./data/art/festival-city.png" alt="旗や灯りで飾られた街の広場"><h1>灯花の街</h1><p>人と精霊が行き交う街では、灯花祭の準備が進んでいます。市場には品物が並び、ギルドには荷物が届いています。</p>${dialogue('nono','わあ、にぎやか！ どこに行ってみよう？')}${warning()}<div class="actions"><button id="guild">冒険者ギルドへ</button><button id="market">市場へ</button>${festival?'<button id="festival">祭りの準備を見る</button>':''}<button id="back">工房へ戻る</button></div></section>`;
  app.querySelector('#guild').onclick=()=>show('city-guild');app.querySelector('#market').onclick=()=>show('city-market');app.querySelector('#festival')?.addEventListener('click',()=>show('city-festival'));app.querySelector('#back').onclick=()=>show('choices');
}
function cityPerson(place){
  const guild=place==='city-guild',speaker=guild?'mina':'sara',name=guild?'ミナ':'サラ',role=guild?'ギルドの受付と荷物の担当':'市場で品物を扱う商人';
  const line=guild?'ようこそ！ 市場にもギルドにも手伝ってほしい仕事があるんだ。':'いらっしゃい。品物を手に取ってもらいやすいように並べたいの。';
  const sortDone=state.completed.includes('city-sort'),queueDone=state.completed.includes('city-queue');
  app.innerHTML=`<section class="scene"><h1>${guild?'冒険者ギルド':'市場'}</h1><div class="characters"><figure><img src="./data/art/${speaker}.png" alt="${role}${name}の全身"><figcaption><strong>${name}</strong><br>${role}</figcaption></figure></div>${dialogue(speaker,line)}${advice('city',speaker)}<p>${guild?'手伝いたい仕事を選んでね。':'市場の品札を並べる仕事を手伝えます。'}</p><div class="actions"><button data-city-quest="city-sort">市場の品札を並べる${sortDone?'（達成済み）':''}</button>${guild?`<button data-city-quest="city-queue">ギルドの荷物を届ける${queueDone?'（達成済み）':''}</button>`:''}<button id="back">街へ戻る</button></div>${warning()}</section>`;
  bindAdvice('city',speaker);app.querySelectorAll('[data-city-quest]').forEach(button=>button.onclick=()=>{state.cityQuest=button.dataset.cityQuest;state.cityFrom=place;show('city-quest');});app.querySelector('#back').onclick=()=>show('city');
}
function cityQuest(){
  const sorting=state.cityQuest==='city-sort',speaker=sorting?'sara':'mina',questTitle=sorting?'市場の品札を並べよう':'荷物を届いた順に届けよう';
  const sort=restoreCitySort(state.citySort),queue=restoreCityQueue(state.cityQueue),done=sorting?sort.done:queue.history.length===containerEvents.length;
  const log=sorting?state.citySort.map((index,i)=>`${i+1}回目：${index+1}番目と${index+2}番目を入れ替え`):queue.history.map((action,i)=>`${i+1}：${action.startsWith('put:')?action.slice(4)+'を受け付け':action.slice(5)+'を届けた'}`);
  let activity='';
  if(sorting){
    const row=sort.values.map((value,index)=>`<span class="stone" aria-label="${index+1}番目は${value}">${value}</span>${index<sort.values.length-1?`<button data-swap="${index}" aria-label="${value}と${sort.values[index+1]}を入れ替える" ${done||state.citySort.length>=500?'disabled':''}>⇄</button>`:''}`).join('');
    activity=`<p>左から小さい数字の順に並べます。隣り合う品札の間の矢印を押すと、２枚を入れ替えられます。</p><div class="stones" aria-label="品札の並び">${row}</div><p role="status">${done?'品札が小さい順に並びました。':'まだ小さい順には並んでいません。'}</p>`;
  }else{
    const next=containerEvents[queue.history.length];
    const actions=next?.put?`<button id="queue-put">荷物 ${next.put} を受け付ける</button>`:next?.take?queue.items.map(item=>`<button data-take="${item}">荷物 ${item} を届ける</button>`).join(''):'';
    activity=`<p>届いた順に荷物を受け付け、残っている中で一番先に受け付けた荷物から届けます。</p><p>待っている荷物：${queue.items.length?queue.items.join(' → '):'なし'}<br>届けた荷物：${queue.output.length?queue.output.join(' → '):'なし'}</p><div class="actions">${actions}</div><p id="queue-message" role="status">${queue.message}</p>`;
  }
  app.innerHTML=`<h1>${questTitle}</h1>${dialogue(speaker,sorting?'品札を小さい順に並べてほしいの。お客さんが欲しい品を見つけやすくなるわ。':'荷物を受け付けた順に届けたいんだ。順番を一緒に見てくれる？')}<section class="panel"><h2>目標：${sorting?'品札を小さい順に並べる':'すべての荷物を受け付けた順に届ける'}</h2>${activity}<details><summary>手がかりを聞く</summary><p>${sorting?'隣同士を比べて、左の数字が大きければ入れ替えてみましょう。':'待っている荷物を左から見て、残っている中で最初に受け付けたものを選びましょう。'}</p></details><details><summary>操作の記録を見る</summary><p>${log.length?log.join(' → '):'まだ操作はありません。'}</p></details>${warning()}<div class="actions"><button id="reset">この依頼を最初からやり直す</button><button id="back">依頼の受付へ戻る</button></div></section>${done?`<section class="panel result"><h2>${sorting?'品札が並びました！':'荷物を届けました！'}</h2><button id="open-result" class="primary">達成の場面を見る</button></section><dialog id="success-dialog" class="story-success" aria-labelledby="city-success-title"><h2 id="city-success-title">依頼達成<span class="success-detail">${sorting?'品札が並びました！':'荷物を届けました！'}</span></h2>${dialogue(speaker,sorting?'ありがとう！ これでお客さんが探しやすくなるわ。':'ありがとう！ 届いた順に、みんなに渡せたよ。')}<div class="actions"><button id="finish" class="primary">結果を伝える</button><button id="review">操作の記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-swap]').forEach(button=>button.onclick=()=>{state.citySort.push(Number(button.dataset.swap));persist();cityQuest();if(restoreCitySort(state.citySort).done)app.querySelector('#success-dialog').showModal();else app.querySelector('[data-swap]:not(:disabled)')?.focus();});
  app.querySelector('#queue-put')?.addEventListener('click',()=>{const event=containerEvents[queue.history.length];state.cityQueue.push(`put:${event.put}`);persist();cityQuest();(app.querySelector('[data-take]')||app.querySelector('#queue-put'))?.focus();});
  app.querySelectorAll('[data-take]').forEach(button=>button.onclick=()=>{const action=`take:${button.dataset.take}`,next=containerStep(queue,action);if(next.history.length===queue.history.length){app.querySelector('#queue-message').textContent=next.message;return;}state.cityQueue.push(action);persist();cityQuest();if(state.cityQueue.length===containerEvents.length)app.querySelector('#success-dialog').showModal();else (app.querySelector('[data-take]')||app.querySelector('#queue-put'))?.focus();});
  app.querySelector('#reset').onclick=()=>{if(!window.confirm('この依頼の途中の操作を最初からやり直しますか？'))return;if(sorting)state.citySort=[];else state.cityQueue=[];persist();cityQuest();};
  app.querySelector('#back').onclick=()=>show(state.cityFrom);
  const dialog=app.querySelector('#success-dialog');if(dialog){let reviewing=false;app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>{reviewing=true;dialog.close();};app.querySelector('#finish').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,state.cityQuest);show('city-result');};dialog.addEventListener('close',()=>{if(!app.contains(dialog))return;if(reviewing){reviewing=false;const details=app.querySelectorAll('details')[1];details.open=true;details.querySelector('summary').focus();}else app.querySelector('#open-result')?.focus();});}
}
function cityResult(){
  const sorting=state.cityQuest==='city-sort',speaker=sorting?'sara':'mina';
  app.innerHTML=`<section class="scene"><h1>${sorting?'品札が並びました':'荷物を届けました'}</h1><img src="./data/art/result-${sorting?'city-sort':'city-queue'}.png" alt="${sorting?'品札の並んだ市場で喜ぶサラとノノ':'街で荷物を届けるミナとノノ'}">${dialogue(speaker,sorting?'ありがとう。品札を見つけやすくなったわ。祭りに並べる品も、これで準備が進むわね。':'ありがとう！ 祭りの飾りや品物を待っている人たちに、順番に届けられたよ。')}${dialogue('nono',sorting?'品札が並んで、探しやすくなったね！':'待っている人に荷物を届けられたね！')}<p>${sorting?'品物を決まった順に並べることを、コンピュータでは「整列」と呼びます。隣同士を比べて入れ替えることも、並べる方法の一つです。':'荷物を受け付けた順に扱う方法は、待ち行列の一例です。先に入ったものを先に取り出す順番を、先入れ先出し（FIFO）と呼びます。優先順位で取り出す待ち行列もあります。'}</p>${warning()}<div class="actions"><button id="festival">祭りの準備を見る</button><button id="back">街へ戻る</button></div></section>`;
  app.querySelector('#festival').onclick=()=>show('city-festival');app.querySelector('#back').onclick=()=>show('city');
}
function cityFestival(){
  const sorted=state.completed.includes('city-sort'),delivered=state.completed.includes('city-queue');
  app.innerHTML=`<section class="scene"><img src="./data/art/festival-city.png" alt="灯りと旗で飾られた街の広場"><h1>灯花祭の準備</h1><p>広場には、色とりどりの灯りと旗が飾られています。人と精霊が一緒に、祭りの日を楽しみにしています。</p>${sorted?dialogue('sara','並べてくれた品札のおかげで、屋台の準備が進んだわ。ありがとう。'):''}${delivered?dialogue('mina','届けてくれた荷物の飾りも、広場に並べられたよ。ありがとう！'):''}${dialogue('nono','みんなで準備すると、祭りがもっと楽しみになるね！')}<p>街の冒険は、ここまでお試しいただけます。工房や水辺の村にも戻れます。</p>${warning()}<button id="back" class="primary">街へ戻る</button></section>`;app.querySelector('#back').onclick=()=>show('city');
}
function harbor(){
  const done=state.completed.includes('harbor-message');
  app.innerHTML=`<section class="scene harbor-scene"><img src="./data/art/wind-harbor.png" alt="船や飛行船が行き交う風の港町"><h1>風の港町</h1><p>風に揺れる旗の向こうに、船と飛行船が見えます。港には、遠くの町へ向かう人や荷物が集まっています。</p><div class="characters"><figure><img src="./data/art/ren-pose-v2.png" alt="手紙かばんを持つ伝令役レンの全身"><figcaption><strong>レン</strong><br>港で働き始めた伝令役</figcaption></figure></div>${dialogue('ren',done?'知らせを届けてくれてありがとう！ また港に遊びに来てね。':'こんにちは！ 僕は伝令役のレン。まだ仕事を始めたばかりなんだ。')}${dialogue('nono','風が気持ちいいね！ レンは何を運んでいるの？')}<p>港に着いた旅人が、離れた家族へ無事を知らせたいようです。</p>${warning()}<div class="actions"><button id="help" class="primary">知らせを届ける${done?'（達成済み）':''}</button><button id="back">旅先を選ぶ</button></div></section>`;
  app.querySelector('#help').onclick=()=>show('harbor-quest');app.querySelector('#back').onclick=()=>show('travel');
}
function harborQuest(){
  const route=state.harborRoute,current=route.at(-1)??'port',next=harborNext(route),done=harborDelivered(route);
  const nodes=['port','light','fog','village','hill','home'].map(id=>`<button class="route-node route-${id}${id===current?' current':''}${route.includes(id)?' visited':''}" data-point="${id}" aria-label="${harborNodes[id]}${id===current?'、知らせの現在地':''}">${id===current?'✉ ':''}${harborNodes[id]}</button>`).join('');
  app.innerHTML=`<h1>家族へ知らせを届けよう</h1>${dialogue('ren','港に着いた旅人が、家族に無事を伝えたいんだ。中継所をたどって、知らせを届けよう！')}<section class="panel"><h2>目標：知らせを家まで届ける</h2><p>線でつながった次の場所を選ぶと、✉ がそこへ進みます。霧の岬からは先へ進めません。</p><div class="route-map" role="group" aria-label="知らせを届ける地図"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M12 50 L38 17 L63 50 M12 50 L38 50 M12 50 L38 83 L63 50 M63 50 L88 50"/></svg>${nodes}</div><p id="route-status" role="status">知らせの現在地：${harborNodes[current]}。${done?'家に届きました！':next.length?'線でつながった次の場所を選んでください。':'ここからは先へ進めません。一つ前に戻って別の道を選びましょう。'}</p><details><summary>通った道を見る</summary><p>${['port',...route].map(id=>harborNodes[id]).join(' → ')}</p></details><details><summary>手がかりを聞く</summary><p>灯台か浜辺の中継所から丘の中継所へ進むと、家へ届けられます。</p></details>${warning()}<div class="actions"><button id="undo" ${route.length?'':'disabled'}>一つ前に戻る</button><button id="back">港へ戻る</button></div></section>${done?`<section class="panel result"><h2>知らせが届きました！</h2><button id="open-result" class="primary">達成の場面を見る</button></section><dialog id="success-dialog" class="story-success" aria-labelledby="harbor-success"><h2 id="harbor-success">依頼達成<span class="success-detail">知らせが届きました！</span></h2>${dialogue('ren','届いたよ！ 家族も安心してくれるね。')}<div class="actions"><button id="finish" class="primary">結果を伝える</button><button id="review">通った道を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-point]').forEach(button=>button.onclick=()=>{const id=button.dataset.point;if(!next.includes(id)){app.querySelector('#route-status').textContent='そこへは今いる場所から直接進めません。線でつながる次の場所を選んでください。';return;}state.harborRoute.push(id);persist();harborQuest();if(harborDelivered(state.harborRoute))app.querySelector('#success-dialog').showModal();else app.querySelector(`[data-point="${id}"]`).focus();});
  app.querySelector('#undo').onclick=()=>{state.harborRoute.pop();persist();harborQuest();app.querySelector(`[data-point="${state.harborRoute.at(-1)??'port'}"]`).focus();};
  app.querySelector('#back').onclick=()=>show('harbor');
  const dialog=app.querySelector('#success-dialog');if(dialog){let reviewing=false;app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>{reviewing=true;dialog.close();};app.querySelector('#finish').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,'harbor-message');show('harbor-result');};dialog.addEventListener('close',()=>{if(!app.contains(dialog))return;if(reviewing){reviewing=false;const details=app.querySelector('details');details.open=true;details.querySelector('summary').focus();}else app.querySelector('#open-result')?.focus();});}
}
function harborResult(){
  app.innerHTML=`<section class="scene"><h1>家族へ知らせが届きました</h1><img src="./data/art/result-harbor.png" alt="届いた手紙を読む家族と見守るレンとノノ"><p>離れた家では、旅人の家族が知らせを受け取り、ほっと胸をなでおろしました。</p>${dialogue('ren',state.bridgeOpen?'ありがとう！ 中継所をつないだから、港から遠くまで知らせが届いたね。森と里の橋も開いて、みんな喜んでいるよ！':'ありがとう！ 中継所をつないだから、港から遠くまで知らせが届いたね。森の文庫と風車の里を結ぶ橋も使えなくて、みんな困っているんだ。よかったら訪ねてみて！')}${dialogue('nono','つながっている道を選ぶと、遠くの人にも伝えられるんだね！')}<p>コンピュータの通信でも、情報がいくつかの中継地点を通って届くことがあります。この依頼は、その道筋を選ぶ考え方を表しています。</p>${warning()}<div class="actions"><button id="back">港へ戻る</button><button id="travel">旅先を選ぶ</button></div></section>`;
  app.querySelector('#back').onclick=()=>show('harbor');app.querySelector('#travel').onclick=()=>show('travel');
}
function midRegion(region){
  const archive=region==='archive',speaker=archive?'aoi':'toma',name=archive?'アオイ':'ゲン',title=archive?'木もれびの文庫':'風車の里';
  const role=archive?'森の文庫で記録を守る司書':'風車と橋を手入れする職人';
  const own=midIds.filter(id=>midQuests[id].region===region),helped=own.some(id=>state.completed.includes(id)),ready=bridgeReady(state.completed);
  const line=state.bridgeOpen?'橋がつながって、また行き来できるようになったね。':ready?'両方の準備が整ったよ。橋のところへ行ってみよう！':helped?(archive?'ありがとう。風車の里でも橋を直そうとしているの。訪ねてみてね。':'ありがとう。森の文庫でも橋に必要なものを探しているよ。訪ねてみてね。'):(archive?'こんにちは。私はアオイ、この文庫の司書よ。橋が使えず山へ本を届けられなくて、記録を探しているの。':'ようこそ。わしはゲン、風車と橋を直す職人だよ。橋の形は直ったが、安全に渡る準備がまだなんだ。');
  const quests=own.map(id=>`<button data-mid-quest="${id}">${midQuests[id].short}${state.completed.includes(id)?'（達成済み）':''}</button>`).join('');
  app.innerHTML=`<section class="scene mid-scene"><img src="./data/art/${archive?'forest-library':'windmill-village'}.png" alt="${title}の風景"><h1>${title}</h1><p>${archive?'木々の間にある文庫には、人と精霊が集めた本や記録が並んでいます。':'風車の音が響く里では、人と精霊が道具や灯りを手入れしています。'}</p><div class="characters"><figure><img src="./data/art/${archive?'aoi-pose-v3':'toma-pose-v2'}.png" alt="${role}、${name}の全身"><figcaption><strong>${name}</strong><br>${role}</figcaption></figure></div>${dialogue(speaker,line)}${dialogue('nono','どんなお手伝いができるかな？')}<p>手伝いたいことを選びましょう。もう一方も後から選べます。</p>${warning()}<div class="actions">${quests}${ready&&!state.bridgeOpen?'<button id="bridge">橋の開通を見届ける</button>':''}${state.bridgeOpen?`<button id="cross">つながりの道を通って${archive?'風車の里':'森の文庫'}へ</button>`:''}<button id="travel">旅先を選ぶ</button></div></section>`;
  app.querySelectorAll('[data-mid-quest]').forEach(button=>button.onclick=()=>{state.midActive=button.dataset.midQuest;state.midDrafts[state.midActive]??=[];show('mid-quest');});
  app.querySelector('#bridge')?.addEventListener('click',()=>{state.bridgeFrom=region;show('mid-bridge');});
  app.querySelector('#cross')?.addEventListener('click',()=>show(archive?'mid-windmill':'mid-archive'));
  app.querySelector('#travel').onclick=()=>show('travel');
}
function midQuest(){
  const id=state.midActive,quest=midQuests[id],history=state.midDrafts[id]??(state.midDrafts[id]=[]),draft=midReplay(id,history),speaker=quest.region==='archive'?'aoi':'toma';
  let introduction='',activity='',hint='';
  if(id==='archive-search'){
    introduction='橋の古い記録は、棚に番号の小さい順に並んでいるの。番号50の記録を探してくれる？ 選んだ番号が小さければ、もっと大きい方を探せるわ。';
    const inspected=history.filter(action=>action.startsWith('pick:')).map(action=>Number(action.slice(5)));
    const last=inspected.at(-1),comparison=last===undefined?'':`棚${last+1}は番号${recordNumbers[last]}。${recordNumbers[last]<50?'50より小さいので右側を探します。':recordNumbers[last]>50?'50より大きいので左側を探します。':'探していた記録です。'}`;
    activity=`<p>目標：番号50の記録を見つける。棚の番号札を選ぶと、中の記録を見られます。記録は左から小さい順に並んでいます。</p><div class="actions">${recordNumbers.map((number,index)=>`<button data-mid-action="pick:${index}" ${draft.done||index<draft.lo||index>draft.hi?'disabled':''}>棚${index+1}${inspected.includes(index)?`（${number}）`:''}</button>`).join('')}</div><p role="status">${comparison} ${draft.done?'番号50の記録が見つかりました！':`まだ探せるのは棚${draft.lo+1}から棚${draft.hi+1}です。`}</p>`;
    hint='真ん中付近を選ぶと、比べた結果に応じて広い範囲を一度に外せます。';
  }else if(id==='archive-filter'){
    introduction='橋が使えなくて山への本を届けられないの。山へ届ける「本」だけを選んで、準備してくれる？ 地図や森の本は今回は入れないでね。';
    activity=`<p>目標：「本」と「山向け」の両方に当てはまるものを表示する。条件を選んで「確かめる」を押します。</p><div class="actions"><button data-mid-action="book" aria-pressed="${draft.book}" ${draft.done?'disabled':''}>本：${draft.book?'選択中':'選んでいない'}</button><button data-mid-action="mountain" aria-pressed="${draft.mountain}" ${draft.done?'disabled':''}>山向け：${draft.mountain?'選択中':'選んでいない'}</button><button data-mid-action="test" class="primary" ${draft.done?'disabled':''}>確かめる</button></div><p>記録には、本か地図か、山向けか森向けかが書かれています。</p><ul><li>山の薬草図鑑：本・山向け</li><li>山道の手引き：本・山向け</li><li>森の絵本：本・森向け</li><li>山の地図：地図・山向け</li></ul>${draft.tested?`<p role="status">選ばれたもの：${draft.books.map(item=>item.name).join('、')||'なし'}。${draft.done?'必要な本がそろいました！':'条件をもう一度確かめましょう。'}</p>`:''}`;
    hint='「本」と「山向け」を両方選ぶと、両方に当てはまる記録だけ残ります。';
  }else if(id==='windmill-lamp'){
    introduction='橋の安全灯を直したいんだ。橋が丈夫で、向こうから合図が来たときだけ灯るようにしたい。どんな部品を使おうか？';
    activity=`<p>目標：二つの合図が両方そろったときだけ灯る部品を選ぶ。部品を選び、すべての組み合わせで試します。</p><div class="actions">${[['AND','両方なら灯る'],['OR','どちらかなら灯る'],['NAND','両方なら消える']].map(([part,label])=>`<button data-mid-action="${part}" aria-pressed="${draft.part===part}" ${draft.done?'disabled':''}>${label}${draft.part===part?'（選択中）':''}</button>`).join('')}<button data-mid-action="test" class="primary" ${draft.done?'disabled':''}>試す</button></div>${draft.tested?`<table><caption>試した結果（点灯＝●、消灯＝○）</caption><thead><tr><th>橋</th><th>合図</th><th>灯り</th><th>目標</th></tr></thead><tbody>${draft.rows.map(row=>`<tr><td>${row.a?'丈夫':'未確認'}</td><td>${row.b?'あり':'なし'}</td><td>${row.actual?'●':'○'}</td><td>${row.expected?'●':'○'}</td></tr>`).join('')}</tbody></table><p role="status">${draft.done?'すべての組み合わせで、目標どおりです！':'目標と違うところがあります。別の部品も試せます。'}</p>`:''}`;
    hint='橋が丈夫でも合図がなければ消灯、合図があっても橋が未確認なら消灯です。';
  }else{
    introduction='森と里を結ぶ橋の道具を準備しよう。まず橋を調べ、それから板と灯りを用意して、最後に取り付けるんだ。板と灯りはどちらを先に用意してもいいよ。';
    activity=`<p>目標：橋を調べ、板と灯りの両方を用意してから、橋に取り付ける。順番に仕事を選びます。</p><div class="actions">${windTasks.map(task=>`<button data-mid-action="${task.id}" ${draft.chosen.includes(task.id)?'disabled':''}>${task.name}${draft.chosen.includes(task.id)?'（準備済み）':''}</button>`).join('')}</div><p role="status">${draft.done?'橋の準備が整いました！':`済んだ仕事：${draft.chosen.length?draft.chosen.map(key=>windTasks.find(task=>task.id===key).name).join(' → '):'まだありません。'}`}</p>`;
    hint='橋を調べた後、板と灯りは好きな順番で準備できます。取り付けは両方の準備が済んでからです。';
  }
  const actionLabel=action=>action.startsWith('pick:')?`番号${recordNumbers[Number(action.slice(5))]}を調べた`:action==='book'?'本の条件を切り替えた':action==='mountain'?'山向けの条件を切り替えた':action==='test'?'確かめた':windTasks.find(task=>task.id===action)?.name??({AND:'両方なら灯る部品を選んだ',OR:'どちらかなら灯る部品を選んだ',NAND:'両方なら消える部品を選んだ'}[action]);
  const steps=history.length?history.map((action,index)=>`${index+1}. ${actionLabel(action)}`).join(' → '):'まだ操作はありません。';
  app.innerHTML=`<h1>${quest.title}</h1>${dialogue(speaker,introduction)}<section class="panel">${activity}<p id="mid-message" role="status"></p><details><summary>手がかりを聞く</summary><p>${hint}</p></details><details id="mid-record"><summary>操作の記録を見る</summary><p>${steps}</p></details>${warning()}<div class="actions"><button id="undo" ${history.length?'':'disabled'}>一つ前に戻る</button><button id="reset">依頼を最初からやり直す</button><button id="back">${quest.region==='archive'?'文庫':'里'}へ戻る</button></div></section>${draft.done?`<section class="panel result"><h2>目標を達成しました！</h2><button id="open-result" class="primary">達成の場面を見る</button></section><dialog id="success-dialog" class="story-success" aria-labelledby="mid-success"><h2 id="mid-success">依頼達成<span class="success-detail">目標を達成しました！</span></h2>${dialogue(speaker,'ありがとう！ これで橋の準備が進むよ。')}<div class="actions"><button id="finish" class="primary">結果を伝える</button><button id="review">操作を見直す</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-mid-action]').forEach(button=>button.onclick=()=>{
    const action=button.dataset.midAction,candidate=[...history,action];
    try{midReplay(id,candidate);}catch(e){app.querySelector('#mid-message').textContent=e.message;return;}
    state.midDrafts[id]=candidate;persist();midQuest();if(midReplay(id,candidate).done)app.querySelector('#success-dialog').showModal();else app.querySelector(`[data-mid-action="${action}"]:not(:disabled)`)?.focus();
  });
  app.querySelector('#undo').onclick=()=>{state.midDrafts[id]=history.slice(0,-1);persist();midQuest();app.querySelector('#undo').focus();};
  app.querySelector('#reset').onclick=()=>{if(!window.confirm('この依頼の操作を最初からやり直しますか？'))return;state.midDrafts[id]=[];persist();midQuest();app.querySelector('[data-mid-action]:not(:disabled)')?.focus();};
  app.querySelector('#back').onclick=()=>show(`mid-${quest.region}`);
  const dialog=app.querySelector('#success-dialog');if(dialog){let reviewing=false;app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>{reviewing=true;dialog.close();};app.querySelector('#finish').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,id);show('mid-result');};dialog.addEventListener('close',()=>{if(!app.contains(dialog))return;if(reviewing){reviewing=false;const details=app.querySelector('#mid-record');details.open=true;details.querySelector('summary').focus();}else app.querySelector('#open-result')?.focus();});}
}
function midResult(){
  const id=state.midActive,quest=midQuests[id],archive=quest.region==='archive',speaker=archive?'aoi':'toma';
  const lesson={'archive-search':'番号順の記録は、比べた結果から探す範囲を狭められます。中央付近を調べる方法は、二分探索の考え方につながります。','archive-filter':'二つの条件を両方満たす記録だけを選ぶとき、「かつ（AND）」を使って考えられます。','windmill-lamp':'二つの合図が両方あるときだけ灯る部品は、論理積（AND）の例です。すべての組み合わせで試すと、振る舞いを確かめられます。','windmill-order':'作業には、先に終えておく必要があるものがあります。互いに待つ必要のない仕事は、どちらから進めてもかまいません。'}[id];
  const line=state.bridgeOpen?'手伝ってくれてありがとう。橋がつながって、行き来が楽しくなったね。':bridgeReady(state.completed)?'両方の準備が整ったよ。橋の開通を見届けに行こう！':archive?'ありがとう。これで橋へ運ぶ資料の準備が進んだわ。風車の里にも訪ねてみてね。':'ありがとう。橋を直す準備が進んだよ。森の文庫にも訪ねてみてね。';
  const title={'archive-search':'薬草の記録が見つかりました','archive-filter':'山に届ける本がそろいました','windmill-lamp':'安全灯が直りました','windmill-order':'橋の道具がそろいました'}[id];
  const alt={'archive-search':'文庫で薬草の記録を見つけたアオイとノノ','archive-filter':'山へ届ける本を用意したアオイとノノ','windmill-lamp':'直った安全灯を見つめるゲンとノノ','windmill-order':'橋の道具を準備したゲンとノノ'}[id];
  app.innerHTML=`<section class="scene"><h1>${title}</h1><img src="./data/art/result-${id}.png" alt="${alt}">${dialogue(speaker,line)}${dialogue('nono',{'archive-search':'探していた薬草の記録が見つかったね！','archive-filter':'山に届ける本を用意できたね！','windmill-lamp':'安全灯がついて、みんな安心だね！','windmill-order':'橋に使う道具がそろったね！'}[id])}<p>${lesson}</p>${warning()}<div class="actions"><button id="back" class="primary">${archive?'文庫':'里'}へ戻る</button><button id="travel">旅先を選ぶ</button></div></section>`;
  app.querySelector('#back').onclick=()=>show(`mid-${quest.region}`);app.querySelector('#travel').onclick=()=>show('travel');
}
function midBridge(){
  const open=state.bridgeOpen;
  app.innerHTML=`<section class="scene">${open?'<img src="./data/art/connected-bridge.png" alt="森と風車の里を結ぶ橋">':''}<h1>${open?'つながりの道が開きました':'橋の開通'}</h1><p>${open?'森の文庫と風車の里を結ぶ橋に、人と精霊が行き交い始めました。':'文庫と里で受け取った助けをもとに、みんなが橋の仕上げをしています。'}</p>${dialogue('aoi',open?'これで本を山へ届けられるわ。みんな、ありがとう！':'文庫での手助けが、橋の準備につながったわ。ゲン、こちらはどう？')}${dialogue('toma',open?'里の灯りも、森まで届けられるようになったよ。':'みんなの手助けで準備は万端だよ。一緒に橋を開こう！')}${dialogue('nono',open?'新しい道を歩けるんだね！':'文庫と里がつながるの、楽しみ！')}${warning()}<div class="actions">${open?'<button id="archive">つながりの道で森の文庫へ</button><button id="windmill">つながりの道で風車の里へ</button><button id="travel">旅先を選ぶ</button>':'<button id="open" class="primary">橋を開く</button><button id="back">いったん戻る</button>'}</div></section>`;
  app.querySelector('#open')?.addEventListener('click',()=>{state.bridgeOpen=true;persist();midBridge();app.querySelector('h1').tabIndex=-1;app.querySelector('h1').focus();});
  app.querySelector('#back')?.addEventListener('click',()=>show(`mid-${state.bridgeFrom}`));app.querySelector('#archive')?.addEventListener('click',()=>show('mid-archive'));app.querySelector('#windmill')?.addEventListener('click',()=>show('mid-windmill'));app.querySelector('#travel')?.addEventListener('click',()=>show('travel'));
}
function render(){
  const cityPlace=state?.place?.startsWith('city'),harborPlace=state?.place?.startsWith('harbor'),midPlace=state?.place?.startsWith('mid-');
  const midRegionName=state?.place==='mid-archive'?'archive':state?.place==='mid-windmill'?'windmill':state?.place==='mid-bridge'?state?.bridgeFrom:midQuests[state?.midActive]?.region;
  document.documentElement.dataset.region=midPlace?midRegionName:harborPlace?'harbor':cityPlace?'city':state?.place==='river'||state?.activeQuest==='river'&&['encounter','journey-quest','journey-done'].includes(state?.place)?'river':'workshop';
  document.querySelector('header small').textContent=midPlace?(midRegionName==='archive'?'木もれびの文庫':'風車の里'):harborPlace?'風の港町':cityPlace?'灯花の街':document.documentElement.dataset.region==='river'?'水辺の村':'工房のはじまり';
  if(!state){title();return;}if(state.place==='world')world();else if(state.place==='introduction')introduction();else if(state.place==='quest')quest();else if(state.place==='opening-done')openingDone();else if(state.place==='outside')forestEncounter();else if(state.place==='forest-quest')forestQuest();else if(state.place==='forest-done')forestDone();else if(state.place==='encounter')encounter();else if(state.place==='journey-quest')journeyQuest();else if(state.place==='journey-done')journeyDone();else if(state.place==='travel')travel();else if(state.place==='river')river();else if(state.place==='city')city();else if(state.place==='city-guild'||state.place==='city-market')cityPerson(state.place);else if(state.place==='city-quest')cityQuest();else if(state.place==='city-result')cityResult();else if(state.place==='city-festival')cityFestival();else if(state.place==='harbor')harbor();else if(state.place==='harbor-quest')harborQuest();else if(state.place==='harbor-result')harborResult();else if(state.place==='mid-archive')midRegion('archive');else if(state.place==='mid-windmill')midRegion('windmill');else if(state.place==='mid-quest')midQuest();else if(state.place==='mid-result')midResult();else if(state.place==='mid-bridge')midBridge();else choices();
}
applySettings();if(saveProtected)error='以前の体験版の記録を読み込めません。元の記録を保護します。';title();
