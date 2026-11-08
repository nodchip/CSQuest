// Small, deterministic stories about communication and trust. Histories are
// replayed when saved games are loaded, so fabricated progress is rejected.
export const towerGateQuests={
 'tower-forward':{region:'tower',title:'知らせの行き先を確かめよう',short:'行き先で中継する',goal:'三つの知らせを、行き先表に従って次の中継所へ送る'},
 'tower-packets':{region:'tower',title:'分かれた知らせをつなごう',short:'知らせの欠片をつなぐ',goal:'順番の札を確かめ、三つの欠片を元の順に並べる'},
 'tower-retry':{region:'tower',title:'返事のない知らせを届けよう',short:'返事を待ち、送り直す',goal:'二つの知らせについて受け取りの返事を確かめる'},
 'gate-verify':{region:'gate',title:'送り主を確かめよう',short:'送り主を確かめる',goal:'預かった知らせに書かれた連絡先を使わず、信頼できる名簿から送り主に確認する'},
 'gate-access':{region:'gate',title:'帳面を開く人を選ぼう',short:'帳面の権限を整える',goal:'それぞれの仕事に必要な権限だけを付ける'},
 'gate-integrity':{region:'gate',title:'書き変わった道しるべを探そう',short:'記録の違いを調べる',goal:'信頼できる控えと届いた記録を比べ、違う箇所を直す'},
};
export const towerGateIds=Object.keys(towerGateQuests);
export const towerIds=towerGateIds.filter(id=>towerGateQuests[id].region==='tower');
export const gateIds=towerGateIds.filter(id=>towerGateQuests[id].region==='gate');
export const valleyIds=['data-record','data-filter','data-join'];
export const towerGateOpen=completed=>valleyIds.every(id=>completed.includes(id));
export const towerGateConverged=completed=>towerGateIds.every(id=>completed.includes(id));

export const forwarding=[{id:'A',destination:'風の港町',next:'west'},{id:'B',destination:'山の集落',next:'east'},{id:'C',destination:'風の港町',next:'west'}];
export const pieces=[{id:'2',text:'明日の朝に'},{id:'3',text:'灯りを届けます'},{id:'1',text:'山の皆さんへ'}];
export const accessPeople=[{id:'ren',name:'伝令のレン',need:'知らせを読む',expected:1},{id:'yuno',name:'記録係のユノ',need:'記録を読んで書き直す',expected:2},{id:'guest',name:'通りかかった旅人',need:'この帳面を使う仕事はない',expected:0}];
export const permissions=['開けない','読む','読む・書く'];
export const originalWords=['東の橋','青い灯り','朝'];
export const receivedWords=['東の橋','赤い灯り','朝'];

export function towerGateReplay(id,history){
 if(!towerGateIds.includes(id)||!Array.isArray(history)||history.length>60||history.some(x=>typeof x!=='string'))throw new RangeError('依頼の記録を読み込めません。');
 if(id==='tower-forward'){
  for(const [i,action] of history.entries()){
   const packet=forwarding[i];
   if(!packet||action!==`${packet.id}:${packet.next}`)throw new RangeError('行き先と、中継先の対応をもう一度確かめましょう。');
  }
  return {done:history.length===forwarding.length,index:history.length};
 }
 if(id==='tower-packets'){
  const order=['1','2','3'];
  if(history.some((x,i)=>x!==order[i])||history.length>order.length)throw new RangeError('順番の札を確かめ、次の番号の欠片を選びましょう。');
  return {done:history.length===3,order:[...history]};
 }
 if(id==='tower-retry'){
  // First reply is lost; the receiver remembers the sequence number and
  // acknowledges a retry without delivering the same message twice.
  const actions=['send','wait','send','wait','send','wait'];
  if(history.some((x,i)=>x!==actions[i])||history.length>actions.length)throw new RangeError('今の状態を確かめ、送るか返事を待つか選びましょう。');
  return {done:history.length===actions.length,step:history.length};
 }
 if(id==='gate-verify'){
  const actions=['directory','call:trusted','confirmed'];
  if(history.some((x,i)=>x!==actions[i])||history.length>actions.length)throw new RangeError('知らせに書かれた連絡先ではなく、信頼できる名簿を使いましょう。');
  return {done:history.length===actions.length,step:history.length};
 }
 if(id==='gate-access'){
  const rights=Object.fromEntries(accessPeople.map(p=>[p.id,0]));let checked=false,done=false;
  for(const action of history){
   if(done)throw new RangeError('すでに達成しています。');
   if(action==='check'){checked=true;done=accessPeople.every(p=>rights[p.id]===p.expected);}
   else if(action.startsWith('cycle:')&&Object.hasOwn(rights,action.slice(6))){const key=action.slice(6);rights[key]=(rights[key]+1)%permissions.length;checked=false;}
   else throw new RangeError('権限を選び直してください。');
  }
  return {done,checked,rights};
 }
 let selected=null,done=false;
 for(const action of history){
  if(done)throw new RangeError('すでに達成しています。');
  if(/^spot:[0-2]$/.test(action)){selected=Number(action.slice(5));}
  else if(action==='restore'&&selected===1)done=true;
  else throw new RangeError('控えと比べ、違う箇所を選んでから直しましょう。');
 }
 return {done,selected};
}
export function validTowerGateDrafts(drafts){
 if(!drafts||typeof drafts!=='object'||Array.isArray(drafts))return false;
 try{return Object.entries(drafts).every(([id,history])=>{towerGateReplay(id,history);return true;});}catch{return false;}
}
