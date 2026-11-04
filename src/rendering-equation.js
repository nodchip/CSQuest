export const renderingEquationLevel={id:'ruin-rendering-equation',number:'1258',kind:'rendering-equation',name:'祭壇へ届く光の総和',tag:'レンダリング方程式',title:'二つの方向から光を集める',story:'遺跡の祭壇を描くため、精霊が光の出入りを調べています。光の方向や材質、遮蔽を変えて、見る方向へ返る光を見積もりましょう。'};
// Each entry is a deliberately coarse two-patch quadrature model, not a point light.
export const renderCases={base:{name:'二つの方向から照らす',a:4,b:6,ca:1,cb:.5,brdf:.25,emission:0},blocked:{name:'方向Ｂが遮られる',a:4,b:0,ca:1,cb:.5,brdf:.25,emission:0},tilted:{name:'祭壇を傾ける',a:4,b:6,ca:.5,cb:.5,brdf:.25,emission:0},dark:{name:'暗い材質に替える',a:4,b:6,ca:1,cb:.5,brdf:.125,emission:0},emitting:{name:'祭壇自身も光る',a:4,b:6,ca:1,cb:.5,brdf:.25,emission:1}};
export const renderGuesses=[.875,1,1.25,1.75,2.75,3,4];
export function renderEstimate(id){if(!Object.hasOwn(renderCases,id))throw new RangeError('条件が不正です。');const c=renderCases[id],a=c.a*c.ca*c.brdf,b=c.b*c.cb*c.brdf;return {a,b,emission:c.emission,total:c.emission+a+b};}
export function renderCreate(){return {selected:'base',guess:null,seen:[],reflection:null};}
export function renderCheck(q){if(q.guess===null)return null;const result=renderEstimate(q.selected),ok=q.guess===result.total;if(ok&&!q.seen.includes(q.selected))q.seen.push(q.selected);return {ok,...result};}
export function renderDone(q){return Object.keys(renderCases).every(id=>q.seen.includes(id))&&q.reflection==='integral';}
export function renderRestore(q){if(!q||!Object.hasOwn(renderCases,q.selected)||![null,...renderGuesses].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(id=>!Object.hasOwn(renderCases,id))||![null,'integral','only'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,seen:[...q.seen]};}
