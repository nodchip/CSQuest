export const deutschLevel={id:'ruin-deutsch-interferometer',number:'1221',kind:'deutsch-interferometer',name:'二筋の光と秘密の紋章',tag:'Deutsch の問題と干渉',title:'一度の問い合わせで紋章を比べよう',story:'二筋の道を通る光に、精霊が秘密の紋章をかけました。光を合わせ、紋章が同じか違うかを調べましょう。'};
export const deutschCases={A:{name:'紋章 A',values:[0,0]},B:{name:'紋章 B',values:[0,1]},C:{name:'紋章 C',values:[1,0]},D:{name:'紋章 D',values:[1,1]}};
const h=1/Math.sqrt(2);
export function deutschTrace(id){
 if(!Object.hasOwn(deutschCases,id))throw new RangeError('紋章が不正です。');
 const values=deutschCases[id].values,start=[1,0],split=[h,h],oracle=split.map((x,i)=>values[i]?-x:x),combined=[(oracle[0]+oracle[1])*h,(oracle[0]-oracle[1])*h];
 return {start,split,oracle,combined,probabilities:combined.map(x=>x*x)};
}
export function deutschCreate(){return {selected:'A',phase:'ready',prediction:null,seen:[],classical:Object.fromEntries(Object.keys(deutschCases).map(k=>[k,null])),reflection:null};}
export function deutschCheck(q){if(q.phase!=='oracle')throw new RangeError('先に紋章を通してください。');const values=deutschCases[q.selected].values,correct=q.prediction===(values[0]^values[1]);if(correct&&!q.seen.includes(q.selected))q.seen.push(q.selected);return correct;}
export function deutschDone(q){return Object.keys(deutschCases).every(k=>q.seen.includes(k)&&q.classical[k]!==null)&&q.reflection==='queries';}
export function deutschRestore(q){
 if(!q||!Object.hasOwn(deutschCases,q.selected)||!['ready','split','oracle','combined'].includes(q.phase)||![null,0,1].includes(q.prediction)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(deutschCases,k))||!q.classical||![null,'queries','all-values'].includes(q.reflection))throw new RangeError('記録が不正です。');
 const out=deutschCreate();for(const k of Object.keys(deutschCases)){if(![null,0,1].includes(q.classical[k]))throw new RangeError('記録が不正です。');out.classical[k]=q.classical[k];}return {...out,selected:q.selected,phase:q.phase,prediction:q.prediction,seen:[...q.seen],reflection:q.reflection};
}
