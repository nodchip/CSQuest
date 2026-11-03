export const clauseWorkshopLevel={id:'ruin-clause-workshop',number:'1060',kind:'clause-workshop',name:'節に変える紋章',tag:'命題論理と連言標準形',title:'条件の紋章を組み直す',story:'遺跡の扉は、いくつかの選択肢をすべて満たす紋章を求めています。意味を変えない変形で、条件を節の形に整えましょう。'};
const v=name=>({op:'var',name}),not=child=>({op:'not',child}),binary=(op,left,right)=>({op,left,right});
export const clauseTasks=['「A または B」なら C','A なら「B かつ C」','「A なら B」ではない'];
export const clauseRules={imp:'ならを取り除く',demorgan:'否定を中へ移す',double:'二重否定を取り除く',distribute:'またはを分配する'};
export function clauseInitial(task){
 if(task===0)return binary('imp',binary('or',v('A'),v('B')),v('C'));
 if(task===1)return binary('imp',v('A'),binary('and',v('B'),v('C')));
 if(task===2)return not(binary('imp',v('A'),v('B')));
 throw new RangeError('紋章が不正です。');
}
export function clausePrint(e){if(e.op==='var')return e.name;if(e.op==='not')return `¬${e.child.op==='var'?clausePrint(e.child):`(${clausePrint(e.child)})`}`;return `(${clausePrint(e.left)} ${{and:'∧',or:'∨',imp:'→'}[e.op]} ${clausePrint(e.right)})`;}
export function clauseNodes(e,path=''){const nodes=[{path,text:clausePrint(e)}];if(e.op==='not')nodes.push(...clauseNodes(e.child,path+'N'));else if(e.op!=='var')nodes.push(...clauseNodes(e.left,path+'L'),...clauseNodes(e.right,path+'R'));return nodes;}
function change(e,rule){
 if(rule==='imp'&&e.op==='imp')return binary('or',not(e.left),e.right);
 if(rule==='demorgan'&&e.op==='not'&&['and','or'].includes(e.child.op))return binary(e.child.op==='and'?'or':'and',not(e.child.left),not(e.child.right));
 if(rule==='double'&&e.op==='not'&&e.child.op==='not')return e.child.child;
 if(rule==='distribute'&&e.op==='or'&&e.left.op==='and')return binary('and',binary('or',e.left.left,e.right),binary('or',e.left.right,e.right));
 if(rule==='distribute'&&e.op==='or'&&e.right.op==='and')return binary('and',binary('or',e.left,e.right.left),binary('or',e.left,e.right.right));
 throw new RangeError('選んだ部分にはその規則を使えません。');
}
export function clauseRewrite(e,path,rule){
 if(typeof path!=='string'||!/^[LRN]*$/.test(path)||path.length>24||!Object.hasOwn(clauseRules,rule))throw new RangeError('変形の指定が不正です。');
 if(path==='')return change(e,rule);
 const [part,...tail]=path,rest=tail.join('');
 if(part==='N'&&e.op==='not')return not(clauseRewrite(e.child,rest,rule));
 if((part==='L'||part==='R')&&['and','or','imp'].includes(e.op))return binary(e.op,part==='L'?clauseRewrite(e.left,rest,rule):e.left,part==='R'?clauseRewrite(e.right,rest,rule):e.right);
 throw new RangeError('選んだ部分が見つかりません。');
}
export function clauseValue(e,values){if(e.op==='var')return !!values[e.name];if(e.op==='not')return !clauseValue(e.child,values);const a=clauseValue(e.left,values),b=clauseValue(e.right,values);return e.op==='and'?a&&b:e.op==='or'?a||b:!a||b;}
export function clauseTruth(e){return Array.from({length:8},(_,i)=>clauseValue(e,{A:!!(i&4),B:!!(i&2),C:!!(i&1)}));}
export function clauseCnf(e){const literal=x=>x.op==='var'||(x.op==='not'&&x.child.op==='var');const clause=x=>literal(x)||(x.op==='or'&&clause(x.left)&&clause(x.right));return clause(e)||(e.op==='and'&&clauseCnf(e.left)&&clauseCnf(e.right));}
export function clauseReplay(task,history){
 if(!Array.isArray(history)||history.length>24)throw new RangeError('変形記録が不正です。');let expr=clauseInitial(task);const truth=clauseTruth(expr);
 for(const step of history){if(!step||typeof step!=='object')throw new RangeError('変形記録が不正です。');expr=clauseRewrite(expr,step.path,step.rule);if(clauseTruth(expr).some((x,i)=>x!==truth[i]))throw new RangeError('同値でない変形です。');}
 return expr;
}
export function clauseCreate(){return {task:0,path:'',histories:[[],[],[]],verified:[false,false,false],reflection:null};}
export function clauseRestore(q){
 if(!q||!Number.isInteger(q.task)||q.task<0||q.task>=clauseTasks.length||!Array.isArray(q.histories)||q.histories.length!==3||!Array.isArray(q.verified)||q.verified.length!==3||q.verified.some(x=>typeof x!=='boolean')||![null,'equivalence','one','syntax'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 const exprs=q.histories.map((h,i)=>clauseReplay(i,h));if(q.verified.some((yes,i)=>yes&&!clauseCnf(exprs[i]))||!clauseNodes(exprs[q.task]).some(x=>x.path===q.path))throw new RangeError('途中記録が不正です。');
 return {task:q.task,path:q.path,histories:q.histories.map(h=>h.map(x=>({path:x.path,rule:x.rule}))),verified:[...q.verified],reflection:q.reflection};
}
export function clauseDone(q){return q.verified.every(Boolean)&&q.reflection==='equivalence';}
