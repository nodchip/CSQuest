export const journeyLevel={id:'ruin-guardian-journey',number:'155',kind:'guardian-journey',name:'守護者の塔への旅',tag:'道順と灯りの条件',title:'鍵と灯りで塔へ進もう',story:'灯りの塔から救援が届きました。鍵を探して遺跡を進み、灯りの条件を見極めて守護者の先へ向かいましょう。'};
export const journeyPlaces={S:'野営地',K:'鍵の祭壇',H:'癒やしの泉',G:'守護者の間',T:'灯りの塔'};
export const journeyMaps={dusk:{name:'夕暮れの遺跡',lights:[[0,0],[0,1]],edges:[['S','K'],['S','H'],['K','G'],['H','G'],['G','T']],energy:6},dawn:{name:'夜明けの遺跡',lights:[[1,0],[1,1]],edges:[['S','H'],['S','K'],['H','K'],['K','G'],['G','T']],energy:6}};
export function journeyNeighbors(id,place){if(!Object.hasOwn(journeyMaps,id)||!Object.hasOwn(journeyPlaces,place))throw new RangeError('場所が不正です。');return journeyMaps[id].edges.flatMap(([a,b])=>a===place?[b]:b===place?[a]:[]);}
export function createJourneyTrial(id){if(!Object.hasOwn(journeyMaps,id))throw new RangeError('地図が不正です。');return {id,place:'S',key:false,health:2,energy:journeyMaps[id].energy,guardian:false,turn:0,status:'playing',history:[],message:'鍵の祭壇を探し、塔を目指しましょう。'};}
export function journeyStep(s,action){
  if(s.status!=='playing')return {...s,message:'旅は終わっています。この地図を最初から試せます。'};
  if(s.history.length>=40)return {...s,message:'操作が多くなりました。この地図を最初から試しましょう。'};
  const n={...s,history:s.history.slice()};
  if(action==='attack'||action==='guard'){
    if(s.place!=='G'||s.guardian)return {...s,message:'守護者との戦いのときに選びましょう。'};
    const [a,b]=journeyMaps[s.id].lights[s.turn%journeyMaps[s.id].lights.length];n.turn++;
    if(action==='guard')n.message='身を守り、次の灯りを待ちました。';
    else if(a!==b){n.guardian=true;n.message='片方だけが点いている隙を突き、守護者を退けました。';}
    else {n.health--;n.message='二つの灯りが同じ状態で攻撃が跳ね返されました。';if(n.health===0){n.status='lost';n.message+=' 旅をやり直しましょう。';}}
  }else{
    if(!journeyNeighbors(s.id,s.place).includes(action))return {...s,message:'今いる場所からつながる道を選びましょう。'};
    if(s.place==='G'&&!s.guardian)return {...s,message:'守護者が道をふさいでいます。灯りに合わせて戦いましょう。'};
    if(action==='T'&&(!s.key||!s.guardian))return {...s,message:'塔へは鍵と守護者の突破が必要です。'};
    n.place=action;n.energy--;if(action==='K')n.key=true;if(action==='H')n.health=Math.min(2,n.health+1);
    n.status=action==='T'?'won':n.energy===0?'lost':'playing';
    n.message=n.status==='won'?'鍵を使って塔に到着しました！':n.status==='lost'?'旅の灯りが尽きました。道を見直しましょう。':action==='K'?'祭壇で鍵を手に入れました。':action==='H'?'泉で体力を１回復しました。':action==='G'&&!n.guardian?'守護者が現れました。灯りを見ましょう。':`${journeyPlaces[action]}へ進みました。`;
  }
  n.history.push(action);return n;
}
export function createJourney(){return {selected:'dusk',trials:Object.fromEntries(Object.keys(journeyMaps).map(id=>[id,createJourneyTrial(id)]))};}
export function journeyComplete(s){return Object.keys(journeyMaps).every(id=>s.trials[id].status==='won');}
export function restoreJourney(saved){if(!saved||!Object.hasOwn(journeyMaps,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const r=createJourney();r.selected=saved.selected;for(const id of Object.keys(journeyMaps)){const h=saved.histories[id];if(!Array.isArray(h)||h.length>40)throw new RangeError('途中記録が不正です。');for(const action of h){const before=r.trials[id],after=journeyStep(before,action);if(after.history.length!==before.history.length+1)throw new RangeError('途中記録が不正です。');r.trials[id]=after;}}return r;}
