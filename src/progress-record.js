// Preserve unrecognized IDs so a later version can still recover them.
export function parseCompleted(raw,knownIds){
  const saved=raw===null?[]:JSON.parse(raw);
  if(!Array.isArray(saved)||saved.some(id=>typeof id!=='string'))throw new TypeError('Invalid progress');
  const known=new Set(knownIds);
  return {completed:[...new Set(saved.filter(id=>known.has(id)))],unknown:[...new Set(saved.filter(id=>!known.has(id)))]};
}
