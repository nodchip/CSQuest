export const platformOverviewChoices={web:'ブラウザー間の表示とキーボード操作',mobile:'移動中の通信断と電池',game:'入力と描画を繰り返す時間',robot:'センサーと駆動部の安全な制御',embedded:'限られたメモリと期限',interactive:'多様な利用者の入力・表示方法'};
export const platformOverviewCases={
 web:{name:'Web：依頼掲示板',detail:'複数のブラウザーで開く掲示板で、キーボードだけでも依頼を選べる必要があります。',answer:'web',explanation:'ブラウザーの違いと、キー操作を含む画面の動作を調べます。'},
 mobile:{name:'モバイル：街道の案内',detail:'携帯水晶を持って圏外の街道を歩き、長時間の案内を使います。',answer:'mobile',explanation:'通信がない時間の動作と、電池の消費を考えます。'},
 game:{name:'ゲーム：戦いの広間',detail:'入力に反応しながら画面を繰り返し描き、動きが途切れないようにします。',answer:'game',explanation:'入力の処理と描画の時間を予算内に収める必要があります。'},
 robot:{name:'ロボット：荷運びの精霊',detail:'実際の床を移動し、人や障害物を検知して駆動部を動かします。',answer:'robot',explanation:'検知の誤りや遅れを含め、現実の動作と停止の安全を考えます。'},
 embedded:{name:'組込み：炉の見張り',detail:'小さな制御装置で温度を監視し、限られた記憶と決められた時間内で警報を出します。',answer:'embedded',explanation:'容量と、要求された期限内に応答することを検討します。'},
 interactive:{name:'対話型：村の案内板',detail:'画面を見ずに使う人や、細かな操作が難しい人も同じ案内を利用します。',answer:'interactive',explanation:'読み上げや異なる操作方法を含め、利用者と使いやすさを確かめます。'}
};
export function platformOverviewCreate(){return {caseId:'web',choice:null,seen:[],checked:false,reflection:null};}
export function platformOverviewCheck(q){if(!Object.hasOwn(platformOverviewCases,q.caseId)||!Object.hasOwn(platformOverviewChoices,q.choice))throw new RangeError('視点を選びましょう。');q.checked=true;const ok=q.choice===platformOverviewCases[q.caseId].answer;if(ok&&!q.seen.includes(q.caseId))q.seen.push(q.caseId);return ok;}
export function platformOverviewDone(q){return Object.keys(platformOverviewCases).every(k=>q.seen.includes(k))&&q.reflection==='overlap';}
export function platformOverviewRestore(q){if(!q||!Object.hasOwn(platformOverviewCases,q.caseId)||!(q.choice===null||Object.hasOwn(platformOverviewChoices,q.choice))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(platformOverviewCases,k))||typeof q.checked!=='boolean'||q.checked&&q.choice===null||![null,'overlap','exclusive'].includes(q.reflection))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
