// Preserve unrecognized IDs so a later version can still recover them.
export function parseCompleted(raw,knownIds){
  const saved=raw===null?[]:JSON.parse(raw);
  if(!Array.isArray(saved)||saved.some(id=>typeof id!=='string'))throw new TypeError('Invalid progress');
  const known=new Set(knownIds);
  return {completed:[...new Set(saved.filter(id=>known.has(id)))],unknown:[...new Set(saved.filter(id=>!known.has(id)))]};
}

export function mergeCompleted(first,second){
  return {completed:[...new Set([...first.completed,...second.completed])],unknown:[...new Set([...first.unknown,...second.unknown])]};
}
