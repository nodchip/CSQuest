// These quests gained required activities after the original completion record existed.
const revisedIds=new Set(['crystal-sequence-limit','guild-child-environment','village-aggregate-inference','archive-generated-scroll','castle-proof-fork','guild-inclusive-cycle','forest-bst-delete','archive-search-tradeoffs','forge-election-overlap','workshop-interrupt-priority']);
export function completionRevisionToken(id){return revisedIds.has(id)?`csquest-current-completion:${id}:1`:null;}
export function completionStatus(id,completed,extra){
 if(!completed.includes(id))return 'uncompleted';
 const token=completionRevisionToken(id);
 return token&&!extra.includes(token)?'unverified':'current';
}
export function completionLabel(id,completed,extra){const status=completionStatus(id,completed,extra);return status==='uncompleted'?'未達成':status==='unverified'?'✓ 達成済み（追加条件は未確認）':'✓ 達成済み';}
export function markCurrentCompletion(id,extra){const token=completionRevisionToken(id);return token&&!extra.includes(token)?[...extra,token]:[...extra];}
