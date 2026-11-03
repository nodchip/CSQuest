export const possibilityLevel={id:'village-possibility-measures',number:'1061',kind:'possibility-measures',name:'三色の水晶と可能性',tag:'確率・可能性・必然性',title:'不確かさの表し方を比べる',story:'水晶は赤・青・緑のいずれか１色です。複数の候補について、確率と可能性がどう違う形で集まるか調べましょう。'};
export const possibilityColors=['赤','青','緑'];
// Values are exact tenths; the two kinds of distribution are independently specified examples.
export const probabilityProfiles={first:{name:'確率の記録１',values:[5,3,2]},second:{name:'確率の記録２',values:[4,4,2]}};
export const possibilityProfiles={narrow:{name:'可能性の記録１',values:[10,7,2]},wide:{name:'可能性の記録２',values:[10,9,6]}};
export function possibilityValues(probability,possibility,mask){
 if(!Object.hasOwn(probabilityProfiles,probability)||!Object.hasOwn(possibilityProfiles,possibility)||!Number.isInteger(mask)||mask<0||mask>7)throw new RangeError('記録の条件が不正です。');
 const p=probabilityProfiles[probability].values,pi=possibilityProfiles[possibility].values;let probabilitySum=0,maximum=0,complementMaximum=0;
 for(let i=0;i<3;i++)if(mask&(1<<i)){probabilitySum+=p[i];maximum=Math.max(maximum,pi[i]);}else complementMaximum=Math.max(complementMaximum,pi[i]);
 return {probability:probabilitySum,possibility:maximum,necessity:10-complementMaximum};
}
export function possibilityCreate(){return {probability:'first',possibility:'narrow',mask:0,seen:[],interpretation:null,necessityAnswer:null};}
export function possibilityKey(p,pi,mask){possibilityValues(p,pi,mask);return `${p}:${pi}:${mask}`;}
export function possibilityDone(q){return ['first:narrow:0','first:narrow:1','first:narrow:2','first:narrow:4','first:narrow:6','first:narrow:7','first:wide:2','second:narrow:2'].every(k=>q.seen.includes(k))&&q.interpretation==='different'&&q.necessityAnswer==='complement';}
export function possibilityRestore(q){
 if(!q||!Array.isArray(q.seen)||q.seen.length>32||new Set(q.seen).size!==q.seen.length||![null,'different','equal','sum'].includes(q.interpretation)||![null,'complement','impossible','certain'].includes(q.necessityAnswer))throw new RangeError('途中記録が不正です。');
 possibilityValues(q.probability,q.possibility,q.mask);
 for(const key of q.seen){if(typeof key!=='string')throw new RangeError('途中記録が不正です。');const parts=key.split(':');if(parts.length!==3||key!==possibilityKey(parts[0],parts[1],Number(parts[2])))throw new RangeError('途中記録が不正です。');}
 return {probability:q.probability,possibility:q.possibility,mask:q.mask,seen:[...q.seen],interpretation:q.interpretation,necessityAnswer:q.necessityAnswer};
}
