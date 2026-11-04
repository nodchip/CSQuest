export const syndromeLevel={id:'workshop-syndrome-control',number:'1218',kind:'syndrome-control',name:'二つの合図と守りの水晶',tag:'量子誤りと古典制御',title:'合図で修正を選ぶ門を整えよう',story:'三つの水晶に守られた灯りを、二つの合図で見守ります。合図から修正を選ぶ門を整え、故障が増えた場合も試しましょう。'};
export const syndromeCases={none:{name:'反転なし',x:0,z:0},left:{name:'左だけ反転',x:1,z:0},middle:{name:'中央だけ反転',x:2,z:0},right:{name:'右だけ反転',x:4,z:0},double:{name:'左と中央が反転',x:3,z:0},phase:{name:'中央に位相反転',x:0,z:2}};
export const syndromeActions={none:'修正なし',left:'左に X',middle:'中央に X',right:'右に X'};
export const syndromeLabels=['00','10','11','01'];
export function syndromeOf(x){if(!Number.isInteger(x)||x<0||x>7)throw new RangeError('反転が不正です。');return `${(x&1?1:0)^(x&2?1:0)}${(x&2?1:0)^(x&4?1:0)}`;}
export function syndromeRun(id,rules){
 if(!Object.hasOwn(syndromeCases,id))throw new RangeError('場面が不正です。');
 const c=syndromeCases[id],signal=syndromeOf(c.x),action=rules[signal];
 if(!Object.hasOwn(syndromeActions,action))throw new RangeError('合図の規則が未設定です。');
 const masks={none:0,left:1,middle:2,right:4},remainingX=c.x^masks[action];
 return {signal,action,remainingX,remainingZ:c.z,restored:remainingX===0&&c.z===0};
}
export function syndromeCreate(){return {rules:{'00':null,'10':null,'11':null,'01':null},selected:'none',prediction:null,seen:[],reflection:null};}
export function syndromeCheck(q){const result=syndromeRun(q.selected,q.rules),correct=q.prediction===(result.restored?'restored':'not-restored');if(correct&&!q.seen.includes(q.selected))q.seen.push(q.selected);return {result,correct};}
export function syndromeDone(q){const expected={'00':'none','10':'left','11':'middle','01':'right'};return Object.entries(expected).every(([s,a])=>q.rules[s]===a)&&Object.keys(syndromeCases).every(k=>q.seen.includes(k))&&q.reflection==='limits';}
export function syndromeRestore(q){
 if(!q||!q.rules||!Object.hasOwn(syndromeCases,q.selected)||![null,'restored','not-restored'].includes(q.prediction)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(syndromeCases,k))||![null,'limits','all'].includes(q.reflection))throw new RangeError('記録が不正です。');
 const out=syndromeCreate();for(const s of syndromeLabels){const a=q.rules[s];if(!(a===null||Object.hasOwn(syndromeActions,a)))throw new RangeError('記録が不正です。');out.rules[s]=a;}out.selected=q.selected;out.prediction=q.prediction;out.seen=[...q.seen];out.reflection=q.reflection;return out;
}
