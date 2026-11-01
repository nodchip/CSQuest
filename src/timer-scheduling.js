export const timerSchedulingLevel={id:'forge-timer-scheduling',number:'623',kind:'timer-scheduling',name:'時を告げる炉の鐘',tag:'タイマーとスケジューリング',title:'鐘で仕事を交代しよう',story:'工房の炉を長い仕事が使っています。急ぎの仕事が届いたとき、鐘と仕事の協力で順番がどう変わるか調べましょう。'};
export const timerScenarios={cooperative:{name:'自分から譲る仕事・鐘なし',timer:false,yield:true},stubborn:{name:'譲らない仕事・鐘なし',timer:false,yield:false},cooperativeTimer:{name:'自分から譲る仕事・鐘あり',timer:true,yield:true},stubbornTimer:{name:'譲らない仕事・鐘あり',timer:true,yield:false}};
export function timerSchedule(id,steps){
 const scenario=timerScenarios[id];if(!scenario||!Number.isInteger(steps)||steps<0||steps>7)throw new RangeError('場面か進行が不正です。');
 let active='A',a=0,b=0,slice=0;const history=[];
 for(let time=0;time<steps;time++){
  const running=active;history.push(running);
  if(running==='A'){a++;slice++;}else b++;
  const bReady=time+1>=2&&b===0;
  if(running==='B') {active=a<6?'A':null;slice=0;}
  else if(a===6){active=bReady?'B':null;slice=0;}
  else if((scenario.timer&&slice===2)||(scenario.yield&&a===4)) {if(bReady)active='B';slice=0;}
 }
 return {history,a,b,active,bStart:history.indexOf('B')<0?null:history.indexOf('B')};
}
export function createTimerScheduling(){return {selected:'cooperative',trials:Object.fromEntries(Object.keys(timerScenarios).map(k=>[k,{steps:0,guess:null,verified:false}])),answer:null,checked:false};}
export function timerTrialComplete(id,t){return t.steps===7&&t.verified&&t.guess===timerSchedule(id,7).bStart;}
export function timerSchedulingComplete(s){return Object.keys(timerScenarios).every(k=>timerTrialComplete(k,s.trials[k]))&&s.answer==='limited'&&s.checked;}
export function restoreTimerScheduling(s){
 if(!s||!Object.hasOwn(timerScenarios,s.selected)||!s.trials||![null,'limited','automatic','fair'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const result=createTimerScheduling();result.selected=s.selected;result.answer=s.answer;result.checked=s.checked;
 for(const id of Object.keys(timerScenarios)){const t=s.trials[id];if(!t||!Number.isInteger(t.steps)||t.steps<0||t.steps>7||![null,2,4,6].includes(t.guess)||typeof t.verified!=='boolean'||(t.verified&&(t.steps!==7||t.guess!==timerSchedule(id,7).bStart)))throw new RangeError('途中記録が不正です。');result.trials[id]={...t};}
 return result;
}
