export const randomVariablesLevel={id:'crystal-random-variables',number:'651',kind:'random-variables',name:'二枚の札と数の魔法',tag:'確率変数・独立性・共分散',title:'札の結果を数に変えて比べよう',story:'宝石工房の精霊は２枚の札を投げ、その結果から二つの数を作ります。値を割り当てて、二つの数が独立か調べましょう。'};
export const variableOutcomes=['表・表','表・裏','裏・表','裏・裏'];
export const variableCases={
 independent:{name:'別々の表',definition:'X は１枚目が表なら１、それ以外は０。Y は２枚目が表なら１、それ以外は０。',x:[1,1,0,0],y:[1,0,1,0],independent:'yes'},
 dependent:{name:'両方の表',definition:'X は１枚目が表なら１、それ以外は０。Y は２枚とも表なら１、それ以外は０。',x:[1,1,0,0],y:[1,0,0,0],independent:'no'},
 covariance:{name:'同じ面と符号',definition:'X は両方表なら−１、異なる面なら０、両方裏なら１。Y は同じ面なら１、異なる面なら０。',x:[-1,0,0,1],y:[1,0,0,1],independent:'no'}
};
export function variableStats(x,y){
 if(!Array.isArray(x)||!Array.isArray(y)||x.length!==4||y.length!==4||x.some(n=>![-1,0,1].includes(n))||y.some(n=>![0,1].includes(n)))throw new RangeError('変数の値が不正です。');
 const xs=[...new Set(x)].sort((a,b)=>a-b),rows=xs.map(value=>({value,counts:[0,1].map(v=>x.filter((n,i)=>n===value&&y[i]===v).length),total:x.filter(n=>n===value).length})),yCounts=[0,1].map(v=>y.filter(n=>n===v).length),sumX=x.reduce((a,b)=>a+b,0),sumY=y.reduce((a,b)=>a+b,0),sumXY=x.reduce((a,n,i)=>a+n*y[i],0);
 return {rows,yCounts,cov16:4*sumXY-sumX*sumY,independent:rows.every(row=>row.counts.every((count,j)=>4*count===row.total*yCounts[j]))};
}
export function variableTrialCorrect(id,t){if(!Object.hasOwn(variableCases,id))return false;const c=variableCases[id];return t.checked&&t.independent===c.independent&&JSON.stringify(t.x)===JSON.stringify(c.x)&&JSON.stringify(t.y)===JSON.stringify(c.y);}
export function createRandomVariables(){return {selected:'independent',trials:Object.fromEntries(Object.keys(variableCases).map(id=>[id,{x:[null,null,null,null],y:[null,null,null,null],independent:null,checked:false}]))};}
export function randomVariablesComplete(s){return Object.keys(variableCases).every(id=>variableTrialCorrect(id,s.trials[id]));}
export function restoreRandomVariables(s){
 if(!s||!Object.hasOwn(variableCases,s.selected)||!s.trials)throw new RangeError('途中記録が不正です。');const trials={};for(const id of Object.keys(variableCases)){const t=s.trials[id];if(!t||!Array.isArray(t.x)||t.x.length!==4||t.x.some(n=>![null,-1,0,1].includes(n))||!Array.isArray(t.y)||t.y.length!==4||t.y.some(n=>![null,0,1].includes(n))||![null,'yes','no'].includes(t.independent)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');trials[id]={...t,x:[...t.x],y:[...t.y]};}return {...s,trials};
}
