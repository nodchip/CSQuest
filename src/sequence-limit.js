export const sequenceLimitLevel={id:'crystal-sequence-limit',number:'1093',kind:'sequence-limit',name:'果てまで続く灯りの列',tag:'数列の極限と ε・N',title:'灯りの列の近づき方を調べよう',story:'水晶の道には、番号が進むほど中心へ近づく灯りが並びます。守りの幅に応じて、どこから先を守れるか調べましょう。'};
export const limitWidths=[2,5,10];
export function limitCandidates(k){if(!limitWidths.includes(k))throw new RangeError('幅が不正です');return [k,k+1,k+2];}
export function limitCheck(k,n){if(!limitCandidates(k).includes(n))throw new RangeError('番号が不正です');return n>k;}
export const limitProofCards={width:'任意の正の幅 ε を受け取る',choose:'1/ε より大きな整数 N を選ぶ',term:'N 以上の任意の番号 n を取る',bound:'1/n ≤ 1/N < ε と結ぶ'};
export const limitProofOrder=['width','choose','term','bound'];
export const oscillationCenters=[-1,0,1];
export function oscillationWitness(center,parity,N=4){if(!oscillationCenters.includes(center)||!['even','odd'].includes(parity)||!Number.isSafeInteger(N)||N<1||N>1000000)throw new RangeError('条件が不正です');const n=2*N+(parity==='odd'?1:0),value=parity==='even'?1:-1;return {n,value,distance:Math.abs(value-center),outside:Math.abs(value-center)>=0.5};}
export function limitCreate(){return {k:2,choices:{},reflection:null,proof:[],oscillation:{},oscillationReflection:null};}
export function limitRestore(q){
 if(!q||!limitWidths.includes(q.k)||!q.choices||typeof q.choices!=='object'||Array.isArray(q.choices)||![null,'every','one'].includes(q.reflection))throw new RangeError('途中記録が不正です');
 const choices={};for(const k of limitWidths){const n=q.choices[k];if(n!==undefined){if(!limitCandidates(k).includes(n))throw new RangeError('途中記録が不正です');choices[k]=n;}}
 const proof=q.proof??[],osc=q.oscillation??{},reflection=q.oscillationReflection??null;
 if(!Array.isArray(proof)||proof.length>4||new Set(proof).size!==proof.length||!proof.every(id=>Object.hasOwn(limitProofCards,id))||!osc||typeof osc!=='object'||Array.isArray(osc)||![null,'both','zero'].includes(reflection))throw new RangeError('途中記録が不正です');
 const oscillation={};for(const c of oscillationCenters){if(osc[c]!==undefined){oscillationWitness(c,osc[c]);oscillation[c]=osc[c];}}
 return {k:q.k,choices,reflection:q.reflection,proof:[...proof],oscillation,oscillationReflection:reflection};
}
export function limitDone(q){return limitWidths.every(k=>limitCheck(k,q.choices[k]??k))&&q.reflection==='every'&&Array.isArray(q.proof)&&limitProofOrder.every((id,i)=>q.proof[i]===id)&&oscillationCenters.every(c=>q.oscillation?.[c]&&oscillationWitness(c,q.oscillation[c]).outside)&&q.oscillationReflection==='both';}
