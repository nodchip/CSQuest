import {commands,levels,runScenarios} from './engine.js';
import {journeyQuests,workshopQuestIds,unlocked,completeQuest,emptyDraft,validDraft} from './workshop-journey-data.js';
import {cityQuestIds,recommend,validAnnouncements,restoreCitySort,restoreCityQueue} from './workshop-city.js';
import {containerEvents,containerStep} from './containers.js';

const app=document.querySelector('#preview');
const level=levels.find(item=>item.id==='sequence');
const forestLevel={cols:2,rows:2,start:[0,0],direction:1,goal:[1,1],walls:[[0,1]],available:['forward','right'],max:4};
const saveKey='csquest-workshop-journey-v1',settingsKey='csquest-workshop-preview-settings-v1';
let state=null,saveProtected=false,settingsProtected=false,settings={size:'normal',contrast:'normal'};
let error='';
try{
  const raw=localStorage.getItem(saveKey);
  if(raw!==null){
    const saved=JSON.parse(raw);
    const places=['world','introduction','quest','choices','talk','outside','forest-quest','forest-done','encounter','journey-quest','journey-done','travel','river','city','city-guild','city-market','city-quest','city-result','city-festival'];
    if(!saved||!places.includes(saved.place)||!Array.isArray(saved.program)||saved.program.length>level.max||saved.program.some(id=>!level.available.includes(id))||typeof saved.executed!=='boolean'||(saved.executed&&!saved.program.length)||(!['world','introduction','quest'].includes(saved.place)&&(!saved.executed||!runScenarios(level,saved.program).success)))throw Error('invalid');
    const forestProgram=saved.forestProgram??[],forestExecuted=saved.forestExecuted??false;
    if(!Array.isArray(forestProgram)||forestProgram.length>forestLevel.max||forestProgram.some(id=>!forestLevel.available.includes(id))||typeof forestExecuted!=='boolean'||(forestExecuted&&!forestProgram.length)||(saved.place==='forest-done'&&(!forestExecuted||!runScenarios(forestLevel,forestProgram).success)))throw Error('invalid');
    const completed=saved.completed??[],drafts=saved.drafts??{},activeQuest=saved.activeQuest??null;
    if(!Array.isArray(completed)||completed.some(id=>!['forest','branch','loop','river',...cityQuestIds].includes(id))||new Set(completed).size!==completed.length||!drafts||typeof drafts!=='object'||Object.keys(drafts).some(id=>!validDraft(id,drafts[id]))||(['encounter','journey-quest','journey-done'].includes(saved.place)&&!journeyQuests[activeQuest])||(['travel','river','city','city-guild','city-market','city-quest','city-result','city-festival'].includes(saved.place)&&!unlocked(completed))||(saved.place==='journey-done'&&(!completed.includes(activeQuest)||!drafts[activeQuest]?.executed||!runScenarios(journeyQuests[activeQuest].level,drafts[activeQuest].program).success)))throw Error('invalid');
    const citySort=saved.citySort??[],cityQueue=saved.cityQueue??[],cityQuest=saved.cityQuest??null,cityFrom=saved.cityFrom??'city-guild',announced=saved.announced??[];
    const sorted=restoreCitySort(citySort),queue=restoreCityQueue(cityQueue);
    if(!validAnnouncements(announced)||![null,...cityQuestIds].includes(cityQuest)||!['city-guild','city-market'].includes(cityFrom)||(['city-quest','city-result'].includes(saved.place)&&!cityQuest)||(saved.place==='city-result'&&(!completed.includes(cityQuest)||(cityQuest==='city-sort'?!sorted.done:queue.history.length!==containerEvents.length)))||(saved.place==='city-festival'&&!cityQuestIds.some(id=>completed.includes(id))))throw Error('invalid');
    state={place:saved.place,program:[...saved.program],executed:saved.executed,forestProgram:[...forestProgram],forestExecuted,completed:[...completed],drafts,activeQuest,citySort:[...citySort],cityQueue:[...cityQueue],cityQuest,cityFrom,announced:[...announced]};
  }
}catch{saveProtected=true;}
try{
  const raw=localStorage.getItem(settingsKey);
  if(raw!==null){const value=JSON.parse(raw);if(!value||!['normal','large'].includes(value.size)||!['normal','high'].includes(value.contrast))throw Error('invalid');settings=value;}
}catch{settingsProtected=true;}
function applySettings(){document.documentElement.dataset.size=settings.size;document.documentElement.dataset.contrast=settings.contrast;}
function persist(){
  if(saveProtected){error='冒険の記録を読み込めないため、元の記録を保護しています。今回の進行は保存されません。';return;}
  try{localStorage.setItem(saveKey,JSON.stringify(state));error='';}catch{error='冒険を保存できません。再読み込みすると進行が失われます。';}
}
function warning(){return error?`<p class="notice" role="status">${error}</p>`:'';}
function show(place){state.place=place;persist();render();window.scrollTo(0,0);}
function dialogue(id,line){const who={lira:'リラ',nono:'ノノ',kaede:'カエデ',mizuho:'ミズホ',mina:'ミナ',sara:'サラ'}[id];return `<div class="speech"><span class="portrait ${id}" role="img" aria-label="${who}の顔"></span><p class="dialogue"><strong>${who}</strong><br>「${line}」</p></div>`;}
function advice(place,speaker){
  const suggestion=recommend(place,state.completed),key=suggestion?`${place}:${suggestion[0]}`:null;
  let line='';
  if(key&&!state.announced.includes(key)){state.announced.push(key);persist();line=dialogue(speaker,`次は『${suggestion[1]}』を手伝ってみない？ ほかのことを選んでも大丈夫だよ。`);}
  return `<div class="advice"><div id="advice-response" role="status">${line}</div><button id="ask-advice">次のおすすめを聞く</button></div>`;
}
function bindAdvice(place,speaker){app.querySelector('#ask-advice').onclick=()=>{const suggestion=recommend(place,state.completed);app.querySelector('#advice-response').innerHTML=dialogue(speaker,suggestion?`『${suggestion[1]}』を手伝ってみない？ 好きな依頼を選んでね。`:'この場所で紹介できる依頼は、今は全部お手伝い済みだよ。');};}
function title(){
  app.innerHTML=`<section class="scene title-screen"><img src="./data/art/spirit-workshop.png" alt="森のそばの精霊の工房"><h1>CS Quest</h1><p>精霊とともに、小さな冒険へ。</p>${warning()}<div class="actions"><button class="primary" id="new">冒険を始める</button><button id="continue" ${state?'':'disabled'}>続きから</button><button id="settings">設定</button></div><details><summary>この体験版について</summary><p>風景・人物のイラストは CS Quest のために画像生成ツールを使って制作しました。学習内容の参考：<a href="https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm">Computer Science Curricula 2023</a>。</p></details></section>`;
  app.querySelector('#new').onclick=()=>{if(state&&!window.confirm('体験版の現在の冒険を最初から始めます。よろしいですか？'))return;state={place:'world',program:[],executed:false,forestProgram:[],forestExecuted:false,completed:[],drafts:{},activeQuest:null,citySort:[],cityQueue:[],cityQuest:null,cityFrom:'city-guild',announced:[]};persist();render();};
  app.querySelector('#continue').onclick=render;
  app.querySelector('#settings').onclick=settingScreen;
}
function settingScreen(){
  app.innerHTML=`<section class="panel"><h1>表示設定</h1><label>文字の大きさ <select id="size"><option value="normal">標準</option><option value="large">大きめ</option></select></label><label>コントラスト <select id="contrast"><option value="normal">標準</option><option value="high">強め</option></select></label><p role="status">${settingsProtected?'表示設定を保存できません。':''}</p><button id="settings-back">タイトルへ戻る</button></section>`;
  const size=app.querySelector('#size'),contrast=app.querySelector('#contrast');size.value=settings.size;contrast.value=settings.contrast;
  const update=()=>{settings={size:size.value,contrast:contrast.value};applySettings();if(!settingsProtected)try{localStorage.setItem(settingsKey,JSON.stringify(settings));}catch{settingsProtected=true;}app.querySelector('[role=status]').textContent=settingsProtected?'表示設定を保存できません。':'';};
  size.onchange=update;contrast.onchange=update;app.querySelector('#settings-back').onclick=title;size.focus();
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
  app.innerHTML=`<h1>ノノに道を教えよう</h1>${dialogue('nono','わたしは矢印の向きに進むよ。灯りのかけらまで連れていってね！')}<section class="panel"><h2>目標：灯りのかけらにたどり着く</h2><p class="tiles-label">矢印がノノ、✦ が灯りのかけらです。</p><div class="map" role="grid" aria-label="工房への道">${cells}</div><p>お願いを選ぶと、上から順に実行します。最大 ${level.max} 枚まで並べられます。</p><div class="program" aria-label="お願いの順番">${state.program.length?`<ol>${state.program.map((id,i)=>`<li>${i+1}. ${commands[id].label} <button data-remove="${i}" aria-label="${i+1}番目のお願いを消す">×</button></li>`).join('')}</ol>`:'<p>まだお願いはありません。</p>'}</div><div class="actions">${level.available.map(id=>`<button data-command="${id}" ${state.program.length>=level.max?'disabled':''}>${commands[id].icon} ${commands[id].label}</button>`).join('')}</div><p><button id="execute" class="primary" ${state.program.length?'':'disabled'}>ノノにお願いする</button></p><details><summary>手がかりを聞く</summary><p>${level.hint}</p></details>${warning()}</section>${result&&!result.success?`<section class="panel result" role="status"><h2>まだ灯りに届いていません</h2>${dialogue('nono','違う場所に着いたみたい。お願いを変えて、もう一度試してね。')}<p>${trace.map(step=>step.message).join(' → ')}</p></section>`:''}${result?.success?`<section class="panel result"><h2>灯りを見つけました！</h2><p>${trace.map(step=>step.message).join(' → ')}</p><button id="open-result">達成の場面を見る</button></section><dialog id="success-dialog" aria-labelledby="success-title"><h2 id="success-title">灯りを見つけました！</h2>${dialogue('nono','やった！ リラのところに持って帰ろう！')}<div class="actions"><button id="return" class="primary">工房へ戻る</button><button id="review">動きの記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{const id=b.dataset.command;state.program.push(id);state.executed=false;persist();quest();(app.querySelector(`[data-command="${id}"]:not(:disabled)`)||app.querySelector('#execute')).focus();});
  app.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.program.splice(Number(b.dataset.remove),1);state.executed=false;persist();quest();app.querySelector('[data-command]')?.focus();});
  app.querySelector('#execute').onclick=()=>{state.executed=true;persist();quest();const target=app.querySelector('#success-dialog')||app.querySelector('.result h2');if(target?.tagName==='DIALOG')target.showModal();else if(target){target.tabIndex=-1;target.focus();}};
  const dialog=app.querySelector('#success-dialog');
  if(dialog){app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>{dialog.close();app.querySelector('#open-result').focus();};app.querySelector('#return').onclick=()=>{dialog.close();show('choices');};dialog.addEventListener('close',()=>{if(app.contains(dialog))app.querySelector('#open-result')?.focus();});}
}
function choices(){
  const selection=state.place==='talk'?`<section class="panel" id="next-scene" tabindex="-1"><h2>ノノの話</h2>${dialogue('nono','もっといろんな道を歩いてみたいな。一緒に冒険しようよ！')}</section>`:'';
  const count=workshopQuestIds.filter(id=>state.completed.includes(id)).length;
  app.innerHTML=`<section class="scene"><img src="./data/art/spirit-workshop.png" alt="森のそばの精霊の工房"><h1>精霊の工房</h1>${dialogue('lira','灯りを取り戻してくれてありがとう。工房の近くにも、手助けを待っている人たちがいるの。') }<p>お願いを順番に並べたものを、コンピュータでは「プログラム」と呼びます。</p><p>工房周辺の依頼：${count}件達成。異なる２件を手伝うと、水辺の村や街へ旅立てます。</p>${advice('workshop','lira')}<div class="actions"><button id="talk">ノノと話す</button><button id="outside">森の入口へ：薬草の届けもの${state.completed.includes('forest')?'（達成済み）':''}</button><button data-encounter="branch">木立の道へ：届けもの${state.completed.includes('branch')?'（達成済み）':''}</button><button data-encounter="loop">工房の水路へ：消えた灯り${state.completed.includes('loop')?'（達成済み）':''}</button>${unlocked(state.completed)?'<button id="travel" class="primary">旅先を選ぶ</button>':''}</div>${selection}${warning()}<p><button id="title">タイトルへ戻る</button></p></section>`;
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
  app.innerHTML=`<h1>森の薬草を取りに行こう</h1>${dialogue('nono','矢印の向きに進むよ。🌿 の薬草まで連れていってね！')}<section class="panel"><h2>目標：薬草にたどり着く</h2><p>矢印がノノ、🌲 は通れない木です。「右を向く」では進まず、その場で向きだけ変えます。</p><div class="map forest-map" role="grid" aria-label="森の小道">${cells}</div><p>お願いは上から順に実行します。最大 ${forestLevel.max} 枚まで並べられます。</p><div class="program" aria-label="お願いの順番">${state.forestProgram.length?`<ol>${state.forestProgram.map((id,i)=>`<li>${i+1}. ${commands[id].label} <button data-remove="${i}" aria-label="${i+1}番目のお願いを消す">×</button></li>`).join('')}</ol>`:'<p>まだお願いはありません。</p>'}</div><div class="actions">${forestLevel.available.map(id=>`<button data-command="${id}" ${state.forestProgram.length>=forestLevel.max?'disabled':''}>${commands[id].icon} ${commands[id].label}</button>`).join('')}</div><p><button id="execute" class="primary" ${state.forestProgram.length?'':'disabled'}>ノノにお願いする</button></p><details><summary>手がかりを聞く</summary><p>まず右へ１マス進み、その場で右を向いてから、もう１マス進んでみましょう。</p></details>${warning()}<button id="back">森の入口へ戻る</button></section>${result&&!result.success?`<section class="panel result" role="status"><h2>まだ薬草に届いていません</h2>${dialogue('nono','お願いの順番を変えて、もう一度試してみよう！')}<p>${trace.map(step=>step.message).join(' → ')}</p></section>`:''}${result?.success?`<section class="panel result"><h2>薬草を見つけました！</h2><p>${trace.map(step=>step.message).join(' → ')}</p><button id="open-result">達成の場面を見る</button></section><dialog id="success-dialog" aria-labelledby="forest-success-title"><h2 id="forest-success-title">薬草を見つけました！</h2>${dialogue('nono','あったよ！ カエデに届けよう！')}<div class="actions"><button id="return" class="primary">薬草を届ける</button><button id="review">動きの記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{const id=b.dataset.command;state.forestProgram.push(id);state.forestExecuted=false;persist();forestQuest();(app.querySelector(`[data-command="${id}"]:not(:disabled)`)||app.querySelector('#execute')).focus();});
  app.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.forestProgram.splice(Number(b.dataset.remove),1);state.forestExecuted=false;persist();forestQuest();app.querySelector('[data-command]')?.focus();});
  app.querySelector('#back').onclick=()=>show('outside');
  app.querySelector('#execute').onclick=()=>{state.forestExecuted=true;persist();forestQuest();const target=app.querySelector('#success-dialog')||app.querySelector('.result h2');if(target?.tagName==='DIALOG')target.showModal();else if(target){target.tabIndex=-1;target.focus();}};
  const dialog=app.querySelector('#success-dialog');if(dialog){app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>dialog.close();app.querySelector('#return').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,'forest');show('forest-done');};dialog.addEventListener('close',()=>{if(app.contains(dialog))app.querySelector('#open-result')?.focus();});}
}
function forestDone(){
  app.innerHTML=`<section class="scene"><h1>薬草を届けました</h1>${dialogue('kaede','ありがとう！ この薬草を待っている川向こうの村へ、すぐに届けるよ。最近、向こうでも灯りが消えることがあるそうなんだ。')}${dialogue('nono','曲がり角では、向きを変えてから進めばよかったんだね！')}<p>行うことの順番を変えると、たどり着く場所も変わります。これもプログラムの大切な考え方です。</p>${warning()}<button id="back" class="primary">工房へ戻る</button></section>`;app.querySelector('#back').onclick=()=>show('choices');
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
  app.innerHTML=`<h1>${quest.title}</h1>${dialogue('nono','矢印の向きに進むよ。✦ のところまで連れていってね！')}<section class="panel"><h2>目標：${scenarios.length>1?'どちらの道でも':''}${quest.object}にたどり着く</h2><p>矢印がノノ、🌲 は通れない壁、✦ が目的地です。地図の外にも進めません。${scenarios.length>1?'同じお願いの並びを両方の道で試します。':''}</p>${maps}<p>お願いは上から順に実行します。最大 ${level.max} 枚まで並べられます。</p><ul>${level.available.map(command=>`<li>${commands[command].label}：${commands[command].description}</li>`).join('')}</ul><div class="program" aria-label="お願いの順番">${draft.program.length?`<ol>${draft.program.map((command,i)=>`<li>${i+1}. ${commands[command].label} <button data-remove="${i}" aria-label="${i+1}番目のお願いを消す">×</button></li>`).join('')}</ol>`:'<p>まだお願いはありません。</p>'}</div><div class="actions">${level.available.map(command=>`<button data-command="${command}" ${draft.program.length>=level.max?'disabled':''}>${commands[command].icon} ${commands[command].label}</button>`).join('')}</div><p><button id="execute" class="primary" ${draft.program.length?'':'disabled'}>ノノにお願いする</button></p><details><summary>手がかりを聞く</summary><p>${quest.hint}</p></details>${warning()}<button id="back">依頼の説明に戻る</button></section>${result&&!result.success?`<section class="panel result" role="status"><h2>まだ目標に届いていません</h2>${dialogue('nono','お願いを変えて、もう一度試してみよう！')}</section>`:''}${result?.success?`<section class="panel result"><h2>目標にたどり着きました！</h2><button id="open-result">達成の場面を見る</button></section><dialog id="success-dialog" aria-labelledby="journey-success-title"><h2 id="journey-success-title">目標にたどり着きました！</h2>${dialogue('nono','やった！ 知らせに戻ろう！')}<div class="actions"><button id="return" class="primary">結果を伝える</button><button id="review">動きの記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-command]').forEach(button=>button.onclick=()=>{const command=button.dataset.command;draft.program.push(command);draft.executed=false;persist();journeyQuest();(app.querySelector(`[data-command="${command}"]:not(:disabled)`)||app.querySelector('#execute')).focus();});
  app.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{draft.program.splice(Number(button.dataset.remove),1);draft.executed=false;persist();journeyQuest();app.querySelector('[data-command]')?.focus();});
  app.querySelector('#back').onclick=()=>show('encounter');
  app.querySelector('#execute').onclick=()=>{draft.executed=true;persist();journeyQuest();const target=app.querySelector('#success-dialog')||app.querySelector('.result h2');if(target?.tagName==='DIALOG')target.showModal();else if(target){target.tabIndex=-1;target.focus();}};
  const dialog=app.querySelector('#success-dialog');if(dialog){app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>dialog.close();app.querySelector('#return').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,id);show('journey-done');};dialog.addEventListener('close',()=>{if(app.contains(dialog))app.querySelector('#open-result')?.focus();});}
}
function journeyDone(){
  const quest=journeyQuests[state.activeQuest];
  app.innerHTML=`<section class="scene"><h1>${quest.title}を達成しました</h1>${dialogue(quest.speaker,quest.success)}<p>${quest.lesson}</p>${state.activeQuest==='river'?dialogue('mizuho','遠くの道しるべの灯りも消えているそうだよ。各地の灯りを取り戻して、人と精霊が安心して行き来できる道をつなげられたらいいね。'):dialogue('lira','川向こうの村でも灯りに困っていると聞いたわ。準備ができたら、手伝いに行きましょう。')}${warning()}<button id="back" class="primary">${state.activeQuest==='river'?'水辺の村':'工房'}へ戻る</button></section>`;
  app.querySelector('#back').onclick=()=>show(state.activeQuest==='river'?'river':'choices');
}
function travel(){
  app.innerHTML=`<section class="scene"><h1>旅先を選ぶ</h1><img src="./data/art/world-map.png" alt="森や川、町が描かれた旅の地図">${dialogue('lira','川向こうの村や、祭りの準備でにぎわう街にも行けるわ。工房にはいつでも帰れるからね。')}<p>行き先を選んでください。</p>${warning()}<div class="actions"><button id="river">水辺の村へ行く</button><button id="city" class="primary">街へ行く</button><button id="back">工房にとどまる</button></div></section>`;app.querySelector('#river').onclick=()=>show('river');app.querySelector('#city').onclick=()=>show('city');app.querySelector('#back').onclick=()=>show('choices');
}
function river(){
  app.innerHTML=`<section class="scene river-scene"><img src="./data/art/river-village.png" alt="川と橋のある水辺の村"><h1>水辺の村</h1>${dialogue('nono','川がきらきらしてる！ あそこにいる人に話しかけてみよう。')}<p>村では道を照らす灯りが消え、川の水かさによって道が変わるようです。</p>${advice('river','nono')}${warning()}<div class="actions"><button id="help" class="primary">村の世話役に話す${state.completed.includes('river')?'（依頼達成済み）':''}</button><button id="back">工房へ戻る</button></div></section>`;
  bindAdvice('river','nono');
  app.querySelector('#help').onclick=()=>{state.activeQuest='river';show('encounter');};app.querySelector('#back').onclick=()=>show('choices');
}
function city(){
  const festival=cityQuestIds.some(id=>state.completed.includes(id));
  app.innerHTML=`<section class="scene city-scene"><img src="./data/art/festival-city.png" alt="旗や灯りで飾られた街の広場"><h1>灯花の街</h1><p>人と精霊が行き交う街では、灯花祭の準備が進んでいます。市場には品物が並び、ギルドには荷物が届いています。</p>${dialogue('nono','わあ、にぎやか！ どこに行ってみよう？')}${warning()}<div class="actions"><button id="guild" class="primary">冒険者ギルドへ</button><button id="market">市場へ</button>${festival?'<button id="festival">祭りの準備を見る</button>':''}<button id="back">工房へ戻る</button></div></section>`;
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
  app.innerHTML=`<h1>${questTitle}</h1>${dialogue(speaker,sorting?'品札を小さい順に並べてほしいの。お客さんが欲しい品を見つけやすくなるわ。':'荷物を受け付けた順に届けたいんだ。順番を一緒に見てくれる？')}<section class="panel"><h2>目標：${sorting?'品札を小さい順に並べる':'すべての荷物を受け付けた順に届ける'}</h2>${activity}<details><summary>手がかりを聞く</summary><p>${sorting?'隣同士を比べて、左の数字が大きければ入れ替えてみましょう。':'待っている荷物を左から見て、残っている中で最初に受け付けたものを選びましょう。'}</p></details><details><summary>操作の記録を見る</summary><p>${log.length?log.join(' → '):'まだ操作はありません。'}</p></details>${warning()}<div class="actions"><button id="reset">この依頼を最初からやり直す</button><button id="back">依頼の受付へ戻る</button></div></section>${done?`<section class="panel result"><h2>${sorting?'品札が並びました！':'荷物を届けました！'}</h2><button id="open-result">達成の場面を見る</button></section><dialog id="success-dialog" aria-labelledby="city-success-title"><h2 id="city-success-title">${sorting?'品札が並びました！':'荷物を届けました！'}</h2>${dialogue(speaker,sorting?'ありがとう！ これでお客さんが探しやすくなるわ。':'ありがとう！ 届いた順に、みんなに渡せたよ。')}<div class="actions"><button id="finish" class="primary">結果を伝える</button><button id="review">操作の記録を見る</button></div></dialog>`:''}`;
  app.querySelectorAll('[data-swap]').forEach(button=>button.onclick=()=>{state.citySort.push(Number(button.dataset.swap));persist();cityQuest();if(restoreCitySort(state.citySort).done)app.querySelector('#success-dialog').showModal();else app.querySelector('[data-swap]:not(:disabled)')?.focus();});
  app.querySelector('#queue-put')?.addEventListener('click',()=>{const event=containerEvents[queue.history.length];state.cityQueue.push(`put:${event.put}`);persist();cityQuest();(app.querySelector('[data-take]')||app.querySelector('#queue-put'))?.focus();});
  app.querySelectorAll('[data-take]').forEach(button=>button.onclick=()=>{const action=`take:${button.dataset.take}`,next=containerStep(queue,action);if(next.history.length===queue.history.length){app.querySelector('#queue-message').textContent=next.message;return;}state.cityQueue.push(action);persist();cityQuest();if(state.cityQueue.length===containerEvents.length)app.querySelector('#success-dialog').showModal();else (app.querySelector('[data-take]')||app.querySelector('#queue-put'))?.focus();});
  app.querySelector('#reset').onclick=()=>{if(!window.confirm('この依頼の途中の操作を最初からやり直しますか？'))return;if(sorting)state.citySort=[];else state.cityQueue=[];persist();cityQuest();};
  app.querySelector('#back').onclick=()=>show(state.cityFrom);
  const dialog=app.querySelector('#success-dialog');if(dialog){let reviewing=false;app.querySelector('#open-result').onclick=()=>dialog.showModal();app.querySelector('#review').onclick=()=>{reviewing=true;dialog.close();};app.querySelector('#finish').onclick=()=>{dialog.close();state.completed=completeQuest(state.completed,state.cityQuest);show('city-result');};dialog.addEventListener('close',()=>{if(!app.contains(dialog))return;if(reviewing){reviewing=false;const details=app.querySelectorAll('details')[1];details.open=true;details.querySelector('summary').focus();}else app.querySelector('#open-result')?.focus();});}
}
function cityResult(){
  const sorting=state.cityQuest==='city-sort',speaker=sorting?'sara':'mina';
  app.innerHTML=`<section class="scene"><h1>${sorting?'品札が並びました':'荷物を届けました'}</h1>${dialogue(speaker,sorting?'ありがとう。品札を見つけやすくなったわ。祭りに並べる品も、これで準備が進むわね。':'ありがとう！ 祭りの飾りや品物を待っている人たちに、順番に届けられたよ。')}<p>${sorting?'品物を決まった順に並べることを、コンピュータでは「整列」と呼びます。隣同士を比べて入れ替えることも、並べる方法の一つです。':'荷物を受け付けた順に扱う方法は、待ち行列の一例です。先に入ったものを先に取り出す順番を、先入れ先出し（FIFO）と呼びます。優先順位で取り出す待ち行列もあります。'}</p>${warning()}<div class="actions"><button id="festival" class="primary">祭りの準備を見る</button><button id="back">街へ戻る</button></div></section>`;
  app.querySelector('#festival').onclick=()=>show('city-festival');app.querySelector('#back').onclick=()=>show('city');
}
function cityFestival(){
  const sorted=state.completed.includes('city-sort'),delivered=state.completed.includes('city-queue');
  app.innerHTML=`<section class="scene"><img src="./data/art/festival-city.png" alt="灯りと旗で飾られた街の広場"><h1>灯花祭の準備</h1><p>広場には、色とりどりの灯りと旗が飾られています。人と精霊が一緒に、祭りの日を楽しみにしています。</p>${sorted?dialogue('sara','並べてくれた品札のおかげで、屋台の準備が進んだわ。ありがとう。'):''}${delivered?dialogue('mina','届けてくれた荷物の飾りも、広場に並べられたよ。ありがとう！'):''}${dialogue('nono','みんなで準備すると、祭りがもっと楽しみになるね！')}<p>街の冒険は、ここまでお試しいただけます。工房や水辺の村にも戻れます。</p>${warning()}<button id="back" class="primary">街へ戻る</button></section>`;app.querySelector('#back').onclick=()=>show('city');
}
function render(){const cityPlace=state?.place?.startsWith('city');document.documentElement.dataset.region=cityPlace?'city':state?.place==='river'||state?.activeQuest==='river'&&['encounter','journey-quest','journey-done'].includes(state?.place)?'river':'workshop';document.querySelector('header small').textContent=cityPlace?'灯花の街':document.documentElement.dataset.region==='river'?'水辺の村':'工房のはじまり';if(!state){title();return;}if(state.place==='world')world();else if(state.place==='introduction')introduction();else if(state.place==='quest')quest();else if(state.place==='outside')forestEncounter();else if(state.place==='forest-quest')forestQuest();else if(state.place==='forest-done')forestDone();else if(state.place==='encounter')encounter();else if(state.place==='journey-quest')journeyQuest();else if(state.place==='journey-done')journeyDone();else if(state.place==='travel')travel();else if(state.place==='river')river();else if(state.place==='city')city();else if(state.place==='city-guild'||state.place==='city-market')cityPerson(state.place);else if(state.place==='city-quest')cityQuest();else if(state.place==='city-result')cityResult();else if(state.place==='city-festival')cityFestival();else choices();}
applySettings();if(saveProtected)error='以前の体験版の記録を読み込めません。元の記録を保護します。';title();
