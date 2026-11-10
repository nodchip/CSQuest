// Finite examples; these do not prove equivalences for arbitrary domains.
export const lightCases = {
  simple: [[true,true,true],[true,false,true],[false,false,false]],
  negation: [[true,false,true],[false,false,false],[true,true,true]],
};
export const toolCases = [
  [[true,false],[false,true]],
  [[true,true],[true,false]],
  [[false,false],[true,false]],
];

export function replayQuantifiers(kind, history) {
  if (!['simple','negation','nested'].includes(kind) || !Array.isArray(history)) return null;
  const cases = kind === 'nested' ? toolCases : lightCases[kind];
  let scene=0, answered=false, counter=false, witness=false, people=[], refuted=[], common=false, noPerson=false, done=false;
  const reset=()=>{answered=false;counter=false;witness=false;people=[];refuted=[];common=false;noPerson=false;};
  for (const action of history) {
    if (done || typeof action !== 'string') return null;
    if (action==='reset') { reset(); continue; }
    const c=cases[scene];
    const first=kind==='nested'?c.every(row=>row.some(Boolean)):kind==='simple'?c.every(Boolean):!c.every(Boolean);
    const second=kind==='nested'?c[0].some((_,t)=>c.every(row=>row[t])):kind==='simple'?c.some(Boolean):!c.some(Boolean);
    if (!answered && action===`answer:${Number(first)}:${Number(second)}`) { answered=true; continue; }
    if (!answered) return null;
    if (kind!=='nested') {
      const m=/^(counter|witness):(none|[012])$/.exec(action);
      if(m){const i=m[2]==='none'?null:Number(m[2]);
        if(m[1]==='counter' && (i===null?c.every(Boolean):!c[i])) {counter=true;continue;}
        if(m[1]==='witness' && (i===null?!c.some(Boolean):c[i])) {witness=true;continue;}
      }
    } else {
      let m=/^person:([01]):([01])$/.exec(action);
      if(m && c[+m[1]][+m[2]]) {if(!people.includes(+m[1]))people.push(+m[1]);continue;}
      m=/^no-person:([01])$/.exec(action);
      if(m && !c[+m[1]].some(Boolean)) {noPerson=true;continue;}
      m=/^common:([01])$/.exec(action);
      if(m && c.every(row=>row[+m[1]])) {common=true;continue;}
      m=/^refute:([01]):([01])$/.exec(action);
      if(m && !c[+m[2]][+m[1]]) {if(!refuted.includes(+m[1]))refuted.push(+m[1]);continue;}
    }
    if(action==='next' && (kind==='nested' ? (first?people.length===2:noPerson) && (second?common:refuted.length===2) : counter&&witness)) {
      scene++; done=scene===cases.length; if(!done)reset(); continue;
    }
    return null;
  }
  return {scene,answered,counter,witness,people,refuted,common,noPerson,done};
}
