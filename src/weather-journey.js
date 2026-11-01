import {weatherTrace} from './hidden-weather.js';
export const weatherJourneyLevel={id:'forest-weather-journey',number:'685',kind:'weather-journey',name:'霧の峠の二つの荷',tag:'隠れ状態・ベイズ更新・期待費用',title:'天気を推測して荷物を届けよう',story:'山の向こうの村へ二つの荷物を届けます。見えない空を観測石から推測し、荷物ごとの危険を考えて道を選びましょう。'};
export const weatherJourneyPlaces={camp:'森の入口',lookout:'観測の小屋',depot:'荷物の集積所',village:'山向こうの村'};
export const weatherLoads={ordinary:{name:'丈夫な薬草',fogCost:9},fragile:{name:'壊れやすい水晶',fogCost:16}};
const paths=[['camp','lookout'],['lookout','depot'],['depot','village']];
export function weatherJourneyNeighbors(place){if(!Object.hasOwn(weatherJourneyPlaces,place))throw new RangeError('場所が不正です。');return paths.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function weatherJourneyCosts(load){
 if(!Object.hasOwn(weatherLoads,load))throw new RangeError('荷物が不正です。');
 const p=weatherTrace('DL',2).sunny;return {sunny:p,mountain:p+(1-p)*weatherLoads[load].fogCost,shelter:4};
}
export function createWeatherJourney(){return {place:'camp',steps:0,likelihood:null,feedback:false,plans:{ordinary:null,fragile:null},routeReport:null,history:[],status:'playing'};}
export function weatherJourneyAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=120||s.status!=='playing')return {ok:false,message:'旅を続けられません。最初からやり直してください。'};
 const n={...s,plans:{...s.plans},history:[...s.history]};let message='';
 if(action.startsWith('move:')){
  const dest=action.slice(5);if(!weatherJourneyNeighbors(s.place).includes(dest))return {ok:false,message:'つながる道を選びましょう。'};
  if(dest==='depot'&&s.steps<2)return {ok:false,message:'観測の小屋で二日分の見込みを更新しましょう。'};
  if(dest==='village'&&(!s.plans.ordinary||!s.plans.fragile))return {ok:false,message:'二つの荷物について、それぞれの期待費用が小さい道を決めましょう。'};
  n.place=dest;if(dest==='village'){n.status='won';message='二つの荷物の計画を立て、村に到着しました！';}else message=`${weatherJourneyPlaces[dest]}に進みました。`;
 }
 else if(s.place==='lookout'&&(action==='likelihood:L'||action==='likelihood:D')&&s.steps<2){n.likelihood=action.slice(-1);n.feedback=false;message='観測に使う確率を選びました。';}
 else if(s.place==='lookout'&&action==='observe'&&s.steps<2){
  if(!s.likelihood)return {ok:false,message:'この日の観測に合う確率を選びましょう。'};
  if(s.likelihood!=='DL'[s.steps]){n.feedback=true;message='この日の石の表示と、使う観測確率が違います。見直しましょう。';}
  else {n.steps++;n.likelihood=null;n.feedback=false;message='遷移を予測し、観測の確率で見込みを更新しました。';}
 }
 else if(s.place==='depot'&&/^plan:(ordinary|fragile):(mountain|shelter)$/.test(action)){
  const [,load,route]=action.split(':'),costs=weatherJourneyCosts(load),best=costs.mountain<costs.shelter?'mountain':'shelter';
  n.routeReport={load,route,...costs,correct:route===best};n.plans[load]=route===best?route:null;
  message=route===best?'この荷物では選んだ道の期待費用が小さくなりました。':'この荷物ではもう一方の道の期待費用が小さくなります。もう一度選べます。';
 }
 else return {ok:false,message:'今いる場所と操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreWeatherJourney(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>120)throw new RangeError('途中記録が不正です。');let s=createWeatherJourney();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=weatherJourneyAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
