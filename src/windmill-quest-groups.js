const groups = [
  {id:'village', title:'里と橋を手入れする', quests:['windmill-lamp','windmill-order','windmill-signals']},
  {id:'reliability', title:'知らせと作業台を確かめる', quests:['windmill-copies','windmill-pipeline','windmill-recovery']},
  {id:'scatter', title:'風と回転を図にする', quests:['windmill-scatter-rising','windmill-scatter-falling','windmill-scatter-compare']},
  {id:'patterns', title:'模様を届ける', quests:['windmill-rle-encode','windmill-rle-decode','windmill-rle-compare']},
  {id:'prefix', title:'短い印で伝言を届ける', quests:['windmill-prefix-decode','windmill-prefix-encode','windmill-prefix-compare']},
];

// Completion includes locked quests; the count includes only quests available now.
export function windmillQuestGroups(completed, endgameAvailable) {
  const done = new Set(completed);
  return groups.map(group => {
    const available = group.quests.filter(id => {
      if (done.has(id)) return true;
      if (group.id === 'village') return true;
      if (!endgameAvailable) return false;
      if (id === 'windmill-recovery') return done.has('windmill-copies') && done.has('windmill-pipeline');
      if (id === 'windmill-scatter-compare') return done.has('windmill-scatter-rising') && done.has('windmill-scatter-falling');
      if (id === 'windmill-prefix-compare') return done.has('windmill-prefix-decode') && done.has('windmill-prefix-encode');
      if (id === 'windmill-rle-compare') return done.has('windmill-rle-encode') && done.has('windmill-rle-decode');
      return true;
    });
    return {...group, available, remaining:available.filter(id => !done.has(id)).length,
      complete:group.quests.every(id => done.has(id))};
  });
}
