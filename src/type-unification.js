export const typeUnificationLevel={id:'workshop-type-unification',number:'764',kind:'type-unification',name:'型の印をそろえる工房',tag:'型推論と単一化',title:'未知の型を結び直す',story:'道具と袋の印が消えました。つながる印が同じ型になるよう、条件を一つずつ整理しましょう。'};
export const unifyCases={chain:{name:'印をたどる',equations:[['a','b'],['b','n']],expected:'solved'},tool:{name:'道具の入口と出口',equations:[[['fn','a','b'],['fn','n','l']]],expected:'solved'},pouch:{name:'袋の中身',equations:[[['list','a'],['list','n']],['a','a']],expected:'solved'},open:{name:'共通の未知の型',equations:[[['fn','a','a'],['fn','b','b']]],expected:'solved'},conflict:{name:'両立しない印',equations:[['a','n'],['a','l']],expected:'conflict'},cycle:{name:'自分を含む袋',equations:[['a',['list','a']]],expected:'occurs'}};
const variables=['a','b'];
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function replaceTerm(term,variable,value){if(typeof term==='string')return term===variable?value:term;return [term[0],...term.slice(1).map(x=>replaceTerm(x,variable,value))];}
function occurs(variable,term){return typeof term==='string'?term===variable:term.slice(1).some(x=>occurs(variable,x));}
export function unifyRule(eq){const [left,right]=eq;if(equal(left,right))return 'remove';if(variables.includes(left)||variables.includes(right)){const v=variables.includes(left)?left:right,value=v===left?right:left;return occurs(v,value)?'occurs':'bind';}if(Array.isArray(left)&&Array.isArray(right)&&left[0]===right[0]&&left.length===right.length)return 'decompose';return 'conflict';}
export function unifyTrial(id){if(!Object.hasOwn(unifyCases,id))throw new RangeError('場面が不正です。');return {equations:structuredClone(unifyCases[id].equations),subst:{},phase:'working',selected:0,history:[]};}
export function unifyStep(t,index,action){
 if(!['bind','decompose','remove','reject'].includes(action)||!Number.isInteger(index))throw new RangeError('操作が不正です。');
 if(t.phase!=='working'||index<0||index>=t.equations.length)return false;
 const eq=t.equations[index],rule=unifyRule(eq);if(action==='reject'&&!['occurs','conflict'].includes(rule)||action!=='reject'&&action!==rule)return false;
 if(action==='reject')t.phase=rule;
 else if(action==='remove')t.equations.splice(index,1);
 else if(action==='decompose')t.equations.splice(index,1,...eq[0].slice(1).map((x,i)=>[x,eq[1][i+1]]));
 else{const [left,right]=eq,v=variables.includes(left)?left:right,value=v===left?right:left;t.equations.splice(index,1);t.equations=t.equations.map(([x,y])=>[replaceTerm(x,v,value),replaceTerm(y,v,value)]);for(const key of Object.keys(t.subst))t.subst[key]=replaceTerm(t.subst[key],v,value);t.subst[v]=value;}
 if(t.phase==='working'&&t.equations.length===0)t.phase='solved';t.selected=t.equations.length?Math.min(index,t.equations.length-1):null;t.history.push({index,action});return true;
}
export function unifyCreate(){return {selected:'chain',trials:Object.fromEntries(Object.keys(unifyCases).map(id=>[id,unifyTrial(id)])),answer:'',checked:false};}
export function unifyComplete(s){return Object.entries(unifyCases).every(([id,c])=>s.trials[id].phase===c.expected)&&s.answer==='finite'&&s.checked;}
export function unifyRestore(s){if(!s||!Object.hasOwn(unifyCases,s.selected)||!s.trials||!['','finite','always','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=unifyCreate();out.selected=s.selected;out.answer=s.answer;out.checked=s.checked;for(const id of Object.keys(unifyCases)){const saved=s.trials[id],trial=out.trials[id];if(!saved||!Array.isArray(saved.history)||saved.history.length>12)throw new RangeError('途中記録が不正です。');for(const e of saved.history)if(!e||!unifyStep(trial,e.index,e.action))throw new RangeError('途中記録が不正です。');if(saved.selected!==null&&(!Number.isInteger(saved.selected)||saved.selected<0||saved.selected>=trial.equations.length))throw new RangeError('途中記録が不正です。');if(saved.selected===null&&trial.equations.length&&trial.phase==='working')throw new RangeError('途中記録が不正です。');trial.selected=saved.selected;}return out;}
export function unifyLabel(term){if(typeof term==='string')return {a:'α',b:'β',n:'数',l:'灯り'}[term]??'?';return term[0]==='list'?`袋〈${unifyLabel(term[1])}〉`:`道具（${unifyLabel(term[1])} → ${unifyLabel(term[2])}）`;}
