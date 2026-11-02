export const banditLevel={id:'guild-bandit-pouches',number:'895',kind:'bandit-pouches',name:'二つの薬草袋を試す',tag:'探索と活用',title:'知らない袋をどう選ぶ？',story:'ギルドは二つの袋から薬草を集めます。袋ごとの成果を記録し、試すことと集めることの間で選びましょう。'};
export const banditNames={a:'太陽の袋',b:'月の袋'};
const rewards={a:[1,0,1,0,1,0,1,0],b:[0,1,1,1,1,1,1,0]};
export function banditReplay(actions){if(!Array.isArray(actions)||actions.length>8||actions.some(a=>!Object.hasOwn(banditNames,a)))throw new RangeError('記録が不正です。');const counts={a:0,b:0},totals={a:0,b:0},events=[];for(const a of actions){const reward=rewards[a][counts[a]++];totals[a]+=reward;events.push({arm:a,reward});}return {counts,totals,events,total:totals.a+totals.b,done:actions.length===8};}
export function banditCreate(){return {trip:'first',trips:{first:[],second:[]},reflection:null};}
export function banditPick(q,arm){if(!Object.hasOwn(banditNames,arm)||!Object.hasOwn(q.trips,q.trip)||q.trips[q.trip].length>=8)throw new RangeError('この旅ではもう選べません。');q.trips[q.trip].push(arm);}
export function banditComplete(q){const a=banditReplay(q.trips.first),b=banditReplay(q.trips.second);return a.done&&b.done&&a.counts.a>=4&&a.counts.b>=1&&b.counts.b>=4&&b.counts.a>=1&&q.reflection==='uncertain';}
export function banditRestore(q){if(!q||!['first','second'].includes(q.trip)||!q.trips||![null,'uncertain','certain','never'].includes(q.reflection))throw new RangeError('記録が不正です。');const trips={};for(const name of ['first','second']){banditReplay(q.trips[name]);trips[name]=[...q.trips[name]];}return {trip:q.trip,trips,reflection:q.reflection};}
