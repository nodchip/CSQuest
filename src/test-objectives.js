export const objectivesLevel={id:'village-test-objectives',number:'979',kind:'test-objectives',name:'五つの試験で守る受付',tag:'試験目的・判定・改善',title:'受付をいろいろな目で試そう',story:'薬師の村の受付が新しくなりました。旅人の操作から守りまで、異なる試験で確かめましょう。'};
export const objectiveCases={
 usability:{name:'使用性',goal:'初めての５人のうち４人以上が薬の申込みを見つける',before:'５人のうち１人が見つけた',after:'５人のうち４人が見つけた',fix:'申込みの案内を分かりやすくする'},
 reliability:{name:'信頼性',goal:'決められた４回の再起動のすべてで記録を読み戻す',before:'４回中１回は読み戻せなかった',after:'４回すべて読み戻せた',fix:'記録の読戻しを直す'},
 conformance:{name:'仕様への適合',goal:'在庫３個から１個を渡すと残りは２個になる',before:'残りが１個になった',after:'残りが２個になった',fix:'在庫の減らし方を直す'},
 performance:{name:'性能',goal:'指定された荷物１件への応答が５刻以内に返る',before:'応答まで９刻かかった',after:'応答まで４刻かかった',fix:'応答の処理を短くする'},
 security:{name:'セキュリティ',goal:'権限のない人の台帳閲覧を拒否する',before:'権限のない人が閲覧できた',after:'権限のない人は拒否された',fix:'閲覧の権限確認を加える'}
};
export function objectiveReplay(id,history){
 if(!Object.hasOwn(objectiveCases,id)||!Array.isArray(history)||history.length>5)throw new RangeError('試験の記録が不正です');
 const s={observed:false,failed:false,fixed:false,passed:false};
 for(const a of history){
  if(a==='run'&&!s.observed&&(!s.failed||s.fixed))s.observed=true;
  else if(a==='judge:fail'&&s.observed&&!s.fixed&&!s.failed){s.failed=true;s.observed=false;}
  else if(a===`fix:${id}`&&s.failed&&!s.fixed){s.fixed=true;}
  else if(a==='judge:pass'&&s.observed&&s.fixed&&!s.passed){s.passed=true;s.observed=false;}
  else throw new RangeError('試験の記録が不正です');
 }
 return s;
}
export function objectiveStep(id,history,action){
 const s=objectiveReplay(id,history);
 if(action==='run'&&!s.observed&&!s.passed&&(!s.failed||s.fixed))return {ok:true,history:[...history,action],message:'結果を基準と比べましょう。'};
 if(action.startsWith('judge:')&&s.observed){const expected=s.fixed?'judge:pass':'judge:fail';if(action===expected)return {ok:true,history:[...history,action],message:s.fixed?'この条件では基準を満たしました。':'基準を満たしません。改善を選びましょう。'};return {ok:false,message:'試験結果と基準をもう一度比べましょう。'};}
 if(action.startsWith('fix:')&&s.failed&&!s.fixed){if(action===`fix:${id}`)return {ok:true,history:[...history,action],message:'改善しました。同じ条件で再試験しましょう。'};return {ok:false,message:'この試験で見つけた問題に対応する改善を選びましょう。'};}
 return {ok:false,message:'試験、判定、改善、再試験の順に進めましょう。'};
}
export function objectivesCreate(){return {selected:'usability',trials:Object.fromEntries(Object.keys(objectiveCases).map(k=>[k,[]])),reflection:null};}
export function objectivesRestore(saved){if(!saved||!Object.hasOwn(objectiveCases,saved.selected)||![null,'scope','all','same'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const q=objectivesCreate();q.selected=saved.selected;q.reflection=saved.reflection;for(const id of Object.keys(objectiveCases)){objectiveReplay(id,saved.trials?.[id]);q.trials[id]=[...saved.trials[id]];}return q;}
export function objectivesComplete(q){return q.reflection==='scope'&&Object.keys(objectiveCases).every(id=>objectiveReplay(id,q.trials[id]).passed);}
