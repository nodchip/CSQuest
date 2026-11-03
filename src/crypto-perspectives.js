export const cryptoPerspectivesLevel={id:'castle-crypto-perspectives',number:'1032',kind:'crypto-perspectives',name:'伝令を守る三つの視点',tag:'暗号の数学・手順・利用',title:'小さな鍵から安全な伝令へ',story:'王城の伝令が暗号の設計、計算、利用を点検します。以前の素数と鍵交換の学びを使いましょう。'};
export const perspectivesStages={
 math:{name:'数学：鍵の関係',question:'素数５と11を使い、法は55、φ(55)は40、公開指数は３とします。秘密指数として３との積を40で割った余りが１になるのは？',choices:{a:'７',b:'27',c:'40'},answer:'b',explanation:'３×27＝81で、40で割ると余り１です。27は法40における３の逆元です。'},
 algorithm:{name:'手順：印を変換',question:'印２を公開鍵 (55, 3) で変換します。２の３乗を55で割った余りは？',choices:{a:'６',b:'８',c:'16'},answer:'b',explanation:'２×２×２＝８なので、55で割った余りも８です。秘密指数27で８を変換すると元の２に戻ります。'},
 application:{name:'利用：届け先の確認',question:'伝令は受取人の公開鍵を受け取りました。すり替えを防いで利用するため、まず何を確かめますか？',choices:{a:'公開鍵が本当に受取人のものか、信頼できる方法で確かめる',b:'公開鍵を秘密にして、秘密指数を伝令に配る',c:'法55なら常に安全なので、相手の確認を省く'},answer:'a',explanation:'公開鍵と受取人の対応の確認は暗号計算と別に必要です。秘密指数は守り、法55は小さすぎて安全ではありません。'}
};
export function perspectivesCreate(){return {stage:'math',choice:null,seen:[],reflection:null};}
export function perspectivesCheck(q){const s=perspectivesStages[q.stage];if(!s||!Object.hasOwn(s.choices,q.choice))throw new RangeError('選択が必要です。');const ok=q.choice===s.answer;if(ok&&!q.seen.includes(q.stage))q.seen.push(q.stage);return {ok,explanation:s.explanation};}
export function perspectivesComplete(q){return Object.keys(perspectivesStages).every(k=>q.seen.includes(k))&&q.reflection==='together';}
export function perspectivesRestore(q){if(!q||!Object.hasOwn(perspectivesStages,q.stage)||!(q.choice===null||Object.hasOwn(perspectivesStages[q.stage].choices,q.choice))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(perspectivesStages,k))||![null,'together','math','algorithm'].includes(q.reflection))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
