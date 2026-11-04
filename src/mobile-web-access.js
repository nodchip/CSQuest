export const mobileWebLevel={id:'guild-mobile-web-access',number:'1329',kind:'mobile-web-access',name:'二つの案内水晶',tag:'モバイル・Web・オフライン',title:'案内の開き方を比べよう',story:'ギルドは Web 版と端末向けの案内水晶を用意しました。旅人の通信状態や準備を変え、地図が読めるか試しましょう。'};
export const mobileWebKinds={web:'Web 版',native:'端末向けの版'};
const accessSeen=['web-first-offline','web-online','web-cached-offline','native-before','native-offline'];
export function mobileWebCreate(){return {kind:'web',online:false,cached:false,installed:false,seen:[],reflection:null,checked:false};}
function mark(q,key){if(!q.seen.includes(key))q.seen.push(key);}
export function mobileWebInstall(q){if(q.kind!=='native')throw new RangeError('この操作は端末向けの版の導入です。');if(!q.online)throw new RangeError('この模型では導入時に通信が必要です。');q.installed=true;}
export function mobileWebOpen(q){if(q.kind==='web'){if(q.online){q.cached=true;mark(q,'web-online');return '通信して Web の地図を開き、再訪用に保存しました。';}if(q.cached){mark(q,'web-cached-offline');return '事前に保存した Web の地図を開きました。';}mark(q,'web-first-offline');return '初めての圏外では Web の地図を開けません。';}if(!q.installed){mark(q,'native-before');return 'この端末向けの版は先に導入が必要です。';}if(!q.online)mark(q,'native-offline');return '導入時に含まれた地図を開きました。';}
export function mobileWebDone(q){return accessSeen.every(k=>q.seen.includes(k))&&q.reflection==='depends'&&q.checked;}
export function mobileWebRestore(q){if(!q||!Object.hasOwn(mobileWebKinds,q.kind)||typeof q.online!=='boolean'||typeof q.cached!=='boolean'||typeof q.installed!=='boolean'||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!accessSeen.includes(k))||![null,'depends','webnever','nativealways'].includes(q.reflection)||typeof q.checked!=='boolean'||q.checked&&q.reflection!=='depends')throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
