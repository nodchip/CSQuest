export const bundleLevel={id:'village-bundle-withdrawal',number:'227',kind:'bundle-withdrawal',name:'薬草セットの受け渡し',tag:'操作の組合せと失敗時の状態',title:'二種類の薬草を一緒に届けよう',story:'薬師は二種類の薬草を一組で使います。片方だけが減ったままにならない受け渡しを考えましょう。'};
export const bundlePlans={sequential:'順に取り出し、失敗したら中止',precheck:'両方の在庫を先に確認してから取り出す',rollback:'順に取り出し、失敗したら先の分を戻す'};
export const bundleCases={normal:{name:'両方に余裕がある',stock:[3,2]},exact:{name:'両方ちょうどある',stock:[2,1]},secondShort:{name:'二種類目が足りない',stock:[3,0]},firstShort:{name:'一種類目が足りない',stock:[1,3]}};
const need=[2,1];
export function runBundle(plan,id){if(!Object.hasOwn(bundlePlans,plan)||!Object.hasOwn(bundleCases,id))throw new RangeError('方法か場面が不正です。');const initial=bundleCases[id].stock,stock=[...initial],trace=[];let success=false;
 if(plan==='precheck'&&stock.some((n,i)=>n<need[i]))trace.push('事前確認で不足を発見し、どちらも取り出さなかった。');
 else {let i=0;for(;i<2;i++){if(stock[i]<need[i]){trace.push(`${i+1}種類目は不足のため拒否され、在庫は変わらない。`);break;}stock[i]-=need[i];trace.push(`${i+1}種類目を${need[i]}個取り出した。`);}success=i===2;if(!success&&plan==='rollback'&&i===1){stock[0]+=need[0];trace.push('先に取り出した１種類目をすべて戻した。');}}
 if(success)trace.push('二種類がそろった。');return {success,stock,trace};}
export function bundlePass(plan,id){const actual=runBundle(plan,id),initial=bundleCases[id].stock,can=initial.every((n,i)=>n>=need[i]),expected=can?initial.map((n,i)=>n-need[i]):initial;return actual.success===can&&actual.stock.every((n,i)=>n===expected[i]);}
export function createBundle(){return {plan:'sequential',tested:Object.fromEntries(Object.keys(bundleCases).map(id=>[id,false]))};}
export function bundleComplete(s){return Object.keys(bundleCases).every(id=>s.tested[id]&&bundlePass(s.plan,id));}
export function restoreBundle(saved){if(!saved||!Object.hasOwn(bundlePlans,saved.plan)||!saved.tested||!Object.keys(bundleCases).every(id=>typeof saved.tested[id]==='boolean'))throw new RangeError('途中記録が不正です。');return {plan:saved.plan,tested:Object.fromEntries(Object.keys(bundleCases).map(id=>[id,saved.tested[id]]))};}
