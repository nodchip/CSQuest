export const availabilityLevel={id:'castle-availability',number:'492',kind:'availability-attack',name:'伝令が押し寄せる門',tag:'サービス不能と回数制限',title:'押し寄せる依頼から受付を守ろう',story:'王城の受付には毎刻、村からの依頼と大量の妨害が届きます。門番の制限と送信元の違いを調べ、村の依頼が届くか確かめましょう。'};
export const availabilityCases={single:'一つの送信元から妨害',distributed:'三つの送信元から妨害',shared:'村と妨害が同じ送信元を共有'};
export const availabilityPolicies={none:'制限なし',limit:'送信元ごとに一刻１通'};
export function availabilityTrace(id,policy,ticks){
 if(!Object.hasOwn(availabilityCases,id)||!Object.hasOwn(availabilityPolicies,policy)||!Number.isInteger(ticks)||ticks<0||ticks>4)throw new RangeError('試行条件が不正です。');
 let queue=[],served=[],dropped=[],events=[];
 for(let t=1;t<=ticks;t++){
  const attacks=[0,1,2].map(i=>({name:`妨${t}-${i+1}`,source:id==='distributed'?['Ｘ','Ｙ','Ｚ'][i]:'Ｘ',kind:'attack'}));
  const legitimate={name:`村${t}`,source:id==='shared'?'Ｘ':'村',kind:'village'},arrivals=[...attacks,legitimate],counts={},accepted=[],lost=[];
  for(const request of arrivals){const source=request.source;counts[source]=(counts[source]||0)+1;let reason=null;
   if(policy==='limit'&&counts[source]>1)reason='制限';else if(queue.length===4)reason='満杯';
   if(reason){const item={...request,reason};lost.push(item);dropped.push(item);}else{queue.push(request);accepted.push(request);}
  }
  const processed=queue.splice(0,2);served.push(...processed);events.push({tick:t,accepted,lost,processed,waiting:[...queue]});
 }
 return {queue,served,dropped,events};
}
export function createAvailability(){return {selected:'single',policy:'none',ticks:Object.fromEntries(Object.keys(availabilityCases).map(id=>[id,{none:0,limit:0}])),answer:null,checked:false};}
export function availabilityComplete(s){return Object.keys(availabilityCases).every(id=>Object.keys(availabilityPolicies).every(p=>s.ticks[id][p]===4))&&s.answer==='tradeoff'&&s.checked;}
export function restoreAvailability(s){if(!s||!Object.hasOwn(availabilityCases,s.selected)||!Object.hasOwn(availabilityPolicies,s.policy)||!s.ticks||![null,'tradeoff','always','identity'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createAvailability();n.selected=s.selected;n.policy=s.policy;n.answer=s.answer;n.checked=s.checked;for(const id of Object.keys(availabilityCases))for(const p of Object.keys(availabilityPolicies)){availabilityTrace(id,p,s.ticks[id]?.[p]);n.ticks[id][p]=s.ticks[id][p];}return n;}
