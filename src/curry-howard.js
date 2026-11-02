export const curryHowardLevel={id:'workshop-curry-howard',number:'768',kind:'curry-howard',name:'証明と道具の鏡',tag:'命題と型の対応',title:'証明と道具を組み立てよう',story:'鏡の塔には、証明の石と道具の部品が同じ形に映ります。石をつなぎ、左右の鏡で同じ組み立てを確かめましょう。'};
const A='A',B='B',C='C',fn=(a,b)=>['fn',a,b],pair=(a,b)=>['pair',a,b],sum=(a,b)=>['sum',a,b];
export const curryCases={identity:{name:'受け取ったものを返す',goal:fn(A,A)},swap:{name:'組の順番を変える',goal:fn(pair(A,B),pair(B,A))},apply:{name:'道具と材料を使う',goal:fn(pair(fn(A,B),A),B)},either:{name:'どちらの印でも入れ替える',goal:fn(sum(A,B),sum(B,A))},distribute:{name:'組の中の分かれ道',goal:fn(pair(A,sum(B,C)),sum(pair(A,B),pair(A,C)))}};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const hole=(goal,ctx=[])=>({goal,ctx,rule:null,children:[]});
const add=(ctx,type,name)=>[...ctx,{type,name,used:false}];
export function curryLabel(t,mode='logic'){
 if(typeof t==='string')return t;
 const a=curryLabel(t[1],mode),b=curryLabel(t[2],mode);
 return t[0]==='fn'?`（${a} ${mode==='logic'?'ならば':'から'} ${b}${mode==='logic'?'':'への道具'}）`:t[0]==='pair'?`（${a} ${mode==='logic'?'かつ':'と'} ${b}${mode==='logic'?'':'の組'}）`:`（${a} ${mode==='logic'?'または':'か'} ${b}${mode==='logic'?'':'の印付きの箱'}）`;
}
export function curryRoot(id){if(!Object.hasOwn(curryCases,id))throw new RangeError('依頼が不正です。');return hole(structuredClone(curryCases[id].goal));}
export function curryFirst(node){if(node.rule===null)return node;for(const child of node.children){const h=curryFirst(child);if(h)return h;}return null;}
export function curryOptions(node){
 if(!node||node.rule!==null)return [];
 const g=node.goal,ops=[];
 if(Array.isArray(g)){if(g[0]==='fn')ops.push({id:'intro',label:'前提を受け取る道具を作る'});if(g[0]==='pair')ops.push({id:'pair',label:'両方を作って組にする'});if(g[0]==='sum'){ops.push({id:'left',label:'左の印を付けた箱を作る'});ops.push({id:'right',label:'右の印を付けた箱を作る'});}}
 node.ctx.forEach((x,i)=>{if(eq(x.type,g))ops.push({id:`use:${i}`,label:`手元の ${x.name} を使う`});if(Array.isArray(x.type)&&x.type[0]==='pair'&&!x.used)ops.push({id:`unpack:${i}`,label:`${x.name} の組を開く`});if(Array.isArray(x.type)&&x.type[0]==='sum'&&!x.used)ops.push({id:`case:${i}`,label:`${x.name} の印で場合分けする`});if(Array.isArray(x.type)&&x.type[0]==='fn'&&eq(x.type[2],g))ops.push({id:`apply:${i}`,label:`${x.name} の道具に材料を渡す`});});
 return ops;
}
export function curryApply(root,action){
 const n=curryFirst(root);if(!n||!curryOptions(n).some(o=>o.id===action))return false;
 const [kind,indexText]=action.split(':'),i=Number(indexText),g=n.goal,ctx=n.ctx;n.rule=action;
 if(kind==='intro')n.children=[hole(g[2],add(ctx,g[1],`前提${ctx.length+1}`))];
 if(kind==='pair')n.children=[hole(g[1],ctx),hole(g[2],ctx)];
 if(kind==='left'||kind==='right')n.children=[hole(g[kind==='left'?1:2],ctx)];
 if(kind==='apply')n.children=[hole(ctx[i].type[1],ctx)];
 if(kind==='unpack'||kind==='case'){
  const next=ctx.map((x,j)=>j===i?{...x,used:true}:x),t=ctx[i].type;
  n.children=kind==='unpack'?[hole(g,add(add(next,t[1],`${ctx[i].name}の左`),t[2],`${ctx[i].name}の右`))]:[hole(g,add(next,t[1],`${ctx[i].name}が左`)),hole(g,add(next,t[2],`${ctx[i].name}が右`))];
 }
 return true;
}
// Reconstruct each inference from the goal and context; no status flag can certify a proof.
export function curryVerify(node,goal,ctx=[]){
 if(!node||!eq(node.goal,goal)||!eq(node.ctx,ctx)||node.rule===null)return false;
 const fresh=hole(goal,ctx);if(!curryApply(fresh,node.rule)||fresh.children.length!==node.children.length)return false;
 return node.children.every((child,i)=>curryVerify(child,fresh.children[i].goal,fresh.children[i].ctx));
}
export function curryReplay(id,history){if(!Array.isArray(history)||history.length>80)throw new RangeError('証明の記録が不正です。');const root=curryRoot(id);for(const action of history)if(typeof action!=='string'||!curryApply(root,action))throw new RangeError('証明の記録が不正です。');return root;}
export function curryCreate(){return {selected:'identity',histories:Object.fromEntries(Object.keys(curryCases).map(id=>[id,[]])),answer:'',checked:false};}
export function curryDone(id,history){const root=curryReplay(id,history);return curryVerify(root,curryCases[id].goal);}
export function curryComplete(s){return Object.keys(curryCases).every(id=>curryDone(id,s.histories[id]))&&s.answer==='correspond'&&s.checked;}
export function curryRestore(s){if(!s||!Object.hasOwn(curryCases,s.selected)||!s.histories||!['','correspond','same-values','no-relation'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=curryCreate();out.selected=s.selected;out.answer=s.answer;out.checked=s.checked;for(const id of Object.keys(curryCases)){curryReplay(id,s.histories[id]);out.histories[id]=[...s.histories[id]];}return out;}
