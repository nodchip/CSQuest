export const pipelineActions={validate:'条件と列を確認',planKind:'種類→値段の索引を計画',planPrice:'値段→種類の索引を計画',execute:'計画を実行',send:'結果を返す'};
const sequence={both:['validate','planKind','execute','send'],price:['validate','planPrice','execute','send']};
export function createQueryPipeline(){return {selected:'both',histories:{both:[],price:[]}};}
export function queryPipelineState(id,history){
 if(!Object.hasOwn(sequence,id)||!Array.isArray(history)||history.length>4)throw new RangeError('問い合わせ記録が不正です。');
 for(let i=0;i<history.length;i++)if(history[i]!==sequence[id][i])throw new RangeError('条件の確認、候補の少ない計画、実行、返却の順を見直しましょう。');
 return {stage:history.length,method:id==='both'?'kindPrice':'priceKind'};
}
export function queryPipelineComplete(s){return Object.keys(sequence).every(id=>queryPipelineState(id,s.histories[id]).stage===4);}
export function restoreQueryPipeline(s){if(!s||!Object.hasOwn(sequence,s.selected)||!s.histories)throw new RangeError('問い合わせ記録が不正です。');const n=createQueryPipeline();n.selected=s.selected;for(const id of Object.keys(sequence)){queryPipelineState(id,s.histories[id]);n.histories[id]=[...s.histories[id]];}return n;}
