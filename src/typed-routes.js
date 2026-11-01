export const typedRoutesLevel={id:'village-typed-routes',number:'596',kind:'typed-routes',name:'灯りを魔石に変える道',tag:'関数型と有限の写像',title:'二つの灯りの行き先を決めよう',story:'前に届けた灯りと魔石を使い、灯りを受け取って魔石を返す道具を作ります。どの割り当てなら、すべての灯りに一つずつ答えられるでしょう。'};
export const routeInputs=['moon','sun'],routeOutputs=['moon','star','rain'];
export const routeNames={moon:'月',sun:'太陽',star:'星',rain:'雨'};
export const routeCases={missing:'行き先のない灯りがある',same:'両方が同じ魔石に行く',different:'異なる魔石に行く',multiple:'一つの灯りに複数の行き先がある'};
export function classifyTypedRoutes(rows){
 if(!Array.isArray(rows)||rows.length!==2||rows.some(x=>!Number.isInteger(x)||x<0||x>7))throw new RangeError('道の指定が不正です。');
 if(rows.some(x=>x===0))return 'missing';
 if(rows.some(x=>(x&(x-1))!==0))return 'multiple';
 return rows[0]===rows[1]?'same':'different';
}
export function createTypedRoutes(){return {rows:[0,0],guess:null,tested:[],forward:null,reverse:null,answer:null,checked:false,message:'道を選び、関数かどうか予想しましょう。'};}
export function checkTypedRoutes(s){
 const category=classifyTypedRoutes(s.rows),valid=category==='same'||category==='different';
 if(s.guess===null) return {...s,message:'関数かどうかを選びましょう。'};
 if(s.guess!==valid)return {...s,message:valid?'各灯りの行き先は一つずつです。同じ魔石でも構いません。':'行き先がない灯り、または複数ある灯りを確かめましょう。'};
 return {...s,tested:[...new Set([...s.tested,category])],checked:false,message:`予想が合いました。「${routeCases[category]}」を確認しました。`};
}
export function typedRoutesComplete(s){return Object.keys(routeCases).every(key=>s.tested.includes(key))&&s.forward===9&&s.reverse===8&&s.answer==='total'&&s.checked;}
export function restoreTypedRoutes(saved){
 if(!saved||!Array.isArray(saved.rows)||saved.rows.length!==2||saved.rows.some(x=>!Number.isInteger(x)||x<0||x>7)||![null,true,false].includes(saved.guess)||!Array.isArray(saved.tested)||new Set(saved.tested).size!==saved.tested.length||saved.tested.some(x=>!Object.hasOwn(routeCases,x))||![null,6,8,9,12].includes(saved.forward)||![null,6,8,9,12].includes(saved.reverse)||![null,'total','injective','partial'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...createTypedRoutes(),rows:[...saved.rows],guess:saved.guess,tested:[...saved.tested],forward:saved.forward,reverse:saved.reverse,answer:saved.answer,checked:saved.checked};
}
