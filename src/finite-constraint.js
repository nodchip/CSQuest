export const finiteConstraintLevel={id:'ruins-finite-constraint',number:'1237',kind:'finite-constraint',name:'二つの数を守る灯り',tag:'有限領域と制約論理',title:'候補を絞って二つの解を探す',story:'遺跡の門には二つの数の札が必要です。条件を伝えて候補を絞り、行き止まりから戻って解を探しましょう。'};
const initial=()=>({x:[1,2,3,4],y:[1,2,3,4],stack:null,solutions:[],sawFailure:false,backtracked:false});
const same=(a,b)=>a.x===b.x&&a.y===b.y;
export function finitePropagate(domains,rule){if(!domains||!Array.isArray(domains.x)||!Array.isArray(domains.y)||!['sum','order'].includes(rule))throw new RangeError('条件が不正です。');const ok=rule==='sum'?(x,y)=>x+y===5:(x,y)=>x<y;return {x:domains.x.filter(x=>domains.y.some(y=>ok(x,y))),y:domains.y.filter(y=>domains.x.some(x=>ok(x,y)))};}
export function finiteReplay(history){if(!Array.isArray(history)||history.length>10000)throw new RangeError('履歴が不正です。');const s=initial();for(const action of history){if(typeof action!=='string')throw new RangeError('操作が不正です。');const fail=!s.x.length||!s.y.length;
 if(['sum','order'].includes(action)&&!fail){const d=finitePropagate(s,action);s.x=d.x;s.y=d.y;if(!s.x.length||!s.y.length)s.sawFailure=true;}
 else if(action.startsWith('choose:')&&!fail&&!s.stack){const value=Number(action.slice(7));if(!Number.isInteger(value)||!s.x.includes(value)||action!==`choose:${value}`)throw new RangeError('候補にない札です。');s.stack={x:[...s.x],y:[...s.y]};s.x=[value];}
 else if(action==='undo'&&s.stack){s.x=s.stack.x;s.y=s.stack.y;s.stack=null;if(fail)s.backtracked=true;}
 else if(action==='root'){s.x=[1,2,3,4];s.y=[1,2,3,4];s.stack=null;if(fail)s.backtracked=true;}
 else if(action==='save'&&!fail&&s.stack&&s.x.length===1&&s.y.length===1){const pair={x:s.x[0],y:s.y[0]};if(pair.x+pair.y!==5||pair.x>=pair.y||s.solutions.some(p=>same(p,pair)))throw new RangeError('解が不正か記録済みです。');s.solutions.push(pair);}
 else throw new RangeError('その操作はできません。');}return s;}
export function finiteCreate(){return {history:[],reflection:null};}
export function finiteStep(q,action){try{const next=finiteReplay([...q.history,action]);const key=JSON.stringify(next);for(let i=0;i<=q.history.length;i++){if(JSON.stringify(finiteReplay(q.history.slice(0,i)))===key){q.history=q.history.slice(0,i);return true;}}q.history.push(action);return true;}catch{return false;}}
export function finiteDone(q){const s=finiteReplay(q.history);return s.sawFailure&&s.backtracked&&s.solutions.some(p=>p.x===1&&p.y===4)&&s.solutions.some(p=>p.x===2&&p.y===3)&&q.reflection==='domains';}
export function finiteRestore(q){if(!q||![null,'domains','always'].includes(q.reflection))throw new RangeError('記録が不正です。');finiteReplay(q.history);return {history:[...q.history],reflection:q.reflection};}
