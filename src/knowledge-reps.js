export const knowledgeRepsLevel={id:'village-knowledge-reps',number:'1062',kind:'knowledge-reps',name:'薬草の三つの記録',tag:'関係網・フレーム・規則',title:'知識の形を比べる',story:'薬師が月草の育て方を記録します。関係の網、既定値つきフレーム、条件規則で、同じ入力から分かることを比べましょう。'};
export const knowledgeReps={network:'関係の網',frame:'フレーム',rules:'条件規則'};
export const knowledgeContexts={unknown:{name:'洞窟か未確認・個別指定なし',cave:false,explicit:null},cave:{name:'洞窟と記録・個別指定なし',cave:true,explicit:null},override:{name:'洞窟と記録・個別に日なたを指定',cave:true,explicit:'sun'}};
const parents={shadeHerb:'herb',herb:'plant'};
const labels={sun:'日なた',shade:'日陰'};
export function knowledgeTypes(start){
 if(!['shadeHerb','herb','plant'].includes(start))throw new RangeError('種類が不正です。');const result=[start];let current=start;
 while(Object.hasOwn(parents,current)){current=parents[current];result.push(current);}return result;
}
export function knowledgeEvaluate(representation,context){
 if(!Object.hasOwn(knowledgeReps,representation)||!Object.hasOwn(knowledgeContexts,context))throw new RangeError('知識の条件が不正です。');
 const data=knowledgeContexts[context],types=knowledgeTypes('shadeHerb');let values=[],explanation='';
 if(representation==='network'){if(data.explicit)values.push(data.explicit);explanation=data.explicit?'個別に記録された場所を返します。':'種類の関係はたどれますが、場所は記録されていません。';}
 if(representation==='frame'){values=[data.explicit||'shade'];explanation=data.explicit?'個別指定が既定値に優先します。':'陰草の既定値を受け継ぎます。植物の既定値より近い種類の既定値を優先します。';}
 if(representation==='rules'){if(data.explicit)values.push(data.explicit);if(types.includes('shadeHerb')&&data.cave)values.push('shade');explanation=values.length===2?'個別指定と規則から異なる候補が出ます。この模型には優先順位を決める規則がありません。':data.cave?'陰草かつ洞窟という規則が当てはまります。':'洞窟という事実がないため規則は発火しません。';}
 return {types,values:values.map(x=>labels[x]),conflict:values.length>1,explanation};
}
export function knowledgeCreate(){return {representation:'network',context:'unknown',seen:[],difference:null,conflictAnswer:null};}
export function knowledgeDone(q){return Object.keys(knowledgeReps).every(r=>Object.keys(knowledgeContexts).every(c=>q.seen.includes(`${r}:${c}`)))&&q.difference==='assumptions'&&q.conflictAnswer==='policy';}
export function knowledgeRestore(q){
 const keys=Object.keys(knowledgeReps).flatMap(r=>Object.keys(knowledgeContexts).map(c=>`${r}:${c}`));
 if(!q||!Object.hasOwn(knowledgeReps,q.representation)||!Object.hasOwn(knowledgeContexts,q.context)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'assumptions','same','false'].includes(q.difference)||![null,'policy','always','ignore'].includes(q.conflictAnswer))throw new RangeError('途中記録が不正です。');
 return {representation:q.representation,context:q.context,seen:[...q.seen],difference:q.difference,conflictAnswer:q.conflictAnswer};
}
