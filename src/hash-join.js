export const hashJoinLevel={id:'village-hash-join',number:'666',kind:'hash-join',name:'桶で照らす二つの台帳',tag:'ハッシュ結合',title:'印から依頼と届け先を結ぼう',story:'薬師の依頼と村人の台帳を照らします。片方を桶に分け、もう片方の印から候補を探して番号を確かめましょう。'};
export const hashJoinPeople=[{id:'A',key:1},{id:'B',key:2},{id:'C',key:3},{id:'D',key:4}];
export const hashJoinOrders=[{id:'甲',key:1},{id:'乙',key:1},{id:'丙',key:3},{id:'丁',key:4},{id:'戊',key:5}];
export const hashJoinModes={people:'人の台帳を桶に入れる',orders:'依頼の台帳を桶に入れる'};
const sides=mode=>mode==='people'?{build:hashJoinPeople,probe:hashJoinOrders}:{build:hashJoinOrders,probe:hashJoinPeople};
export function createHashJoinTrial(mode){if(!Object.hasOwn(hashJoinModes,mode))throw new RangeError('方式が不正です。');return {mode,phase:'build',buildIndex:0,buckets:[[],[]],probeIndex:0,candidateIndex:0,output:[],comparisons:0,history:[]};}
export function hashJoinCurrent(s){const data=sides(s.mode);if(s.phase==='build')return {build:data.build[s.buildIndex]};if(s.phase==='probe'){const probe=data.probe[s.probeIndex],bucket=probe.key%2;return {probe,bucket,candidate:s.buckets[bucket][s.candidateIndex]};}return {};}
export function hashJoinTrialAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=64||s.phase==='done')return {ok:false,message:'この方式の作業は終わっています。必要ならやり直しましょう。'};
 const data=sides(s.mode),current=hashJoinCurrent(s),n={...s,buckets:s.buckets.map(a=>a.map(x=>({...x}))),output:[...s.output],history:[...s.history]};let message='';
 if(s.phase==='build'&&(action==='bucket:0'||action==='bucket:1')){const bucket=Number(action.slice(-1));if(current.build.key%2!==bucket)return {ok:false,message:'番号を２で割った余りに合う桶を選びましょう。'};n.buckets[bucket].push({...current.build});n.buildIndex++;message=`${current.build.id} を桶 ${bucket} に入れました。`;if(n.buildIndex===data.build.length){n.phase='probe';message+=' 桶ができたので、もう一方を探します。';}}
 else if(s.phase==='probe'&&(action==='compare:equal'||action==='compare:different')){
  const equal=current.probe.key===current.candidate.key;if((action==='compare:equal')!==equal)return {ok:false,message:'桶が同じでも番号が同じとは限りません。二つの番号を比べましょう。'};
  n.comparisons++;if(equal){const person=s.mode==='people'?current.candidate:current.probe,order=s.mode==='people'?current.probe:current.candidate;n.output.push(`${person.id}・${order.id}`);message=`番号が一致し、${person.id}・${order.id} を結果に加えました。`;}else message='番号が異なるため結果に加えません。';
  n.candidateIndex++;if(n.candidateIndex===n.buckets[current.bucket].length){n.probeIndex++;n.candidateIndex=0;if(n.probeIndex===data.probe.length){n.phase='done';message+=' すべての候補を調べました。';}else message+=' 次の行へ進みます。';}
 }
 else return {ok:false,message:'今の段階でできる操作を選びましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function createHashJoin(){return {selected:'people',trials:{people:createHashJoinTrial('people'),orders:createHashJoinTrial('orders')},answer:null,checked:false};}
export function hashJoinComplete(s){return Object.keys(hashJoinModes).every(k=>s.trials[k].phase==='done')&&s.answer==='verify'&&s.checked;}
export function restoreHashJoin(saved){if(!saved||!Object.hasOwn(hashJoinModes,saved.selected)||!saved.trials||![null,'verify','bucket','first'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createHashJoin();n.selected=saved.selected;n.answer=saved.answer;n.checked=saved.checked;for(const mode of Object.keys(hashJoinModes)){const h=saved.trials[mode]?.history;if(!Array.isArray(h)||h.length>64)throw new RangeError('途中記録が不正です。');for(const a of h){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=hashJoinTrialAct(n.trials[mode],a);if(!r.ok)throw new RangeError('途中記録が不正です。');n.trials[mode]=r.state;}}return n;}
