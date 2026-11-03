export const intervalReasonLevel={id:'forest-interval-reasoning',number:'1059',kind:'interval-reasoning',name:'時と位置の区間',tag:'時間・空間の定性的推論',title:'３つの区間をつなぐ',story:'伝令の行動時間と、地図上の荷車の位置を調べます。区間を動かし、隣同士の関係から何が分かるか確かめましょう。'};
export const intervalReasonScenes={time:'行動の時間',space:'地図の横方向'};
export const intervalReasonNames={before:'前に離れる',meets:'前から接する',overlaps:'前から重なる',starts:'同時に始まり先に終わる',during:'中に入る',finishes:'後から始まり同時に終わる',equal:'一致する',finishedBy:'先に始まり同時に終わる',contains:'中に含む',startedBy:'同時に始まり後に終わる',overlappedBy:'後から重なる',metBy:'後から接する',after:'後に離れる'};
export function intervalReasonValid(x){return Array.isArray(x)&&x.length===2&&x.every(Number.isInteger)&&x[0]>=0&&x[1]<=6&&x[0]<x[1];}
export function intervalReasonRelation(a,b){
 if(!intervalReasonValid(a)||!intervalReasonValid(b))throw new RangeError('区間が不正です。');
 const [s,e]=a,[t,f]=b;
 if(e<t)return 'before';if(e===t)return 'meets';if(s>f)return 'after';if(s===f)return 'metBy';if(s===t&&e===f)return 'equal';
 if(s===t)return e<f?'starts':'startedBy';if(e===f)return s>t?'finishes':'finishedBy';
 if(s>t&&e<f)return 'during';if(s<t&&e>f)return 'contains';return s<t?'overlaps':'overlappedBy';
}
export function intervalReasonCreate(){return {scene:'time',positions:{time:[[0,2],[1,3],[4,6]],space:[[0,2],[1,4],[3,5]]},timeSeen:false,spaceSeen:[],reflection:null};}
export function intervalReasonCheck(q){
 const [a,b,c]=q.positions[q.scene],ab=intervalReasonRelation(a,b),bc=intervalReasonRelation(b,c),ac=intervalReasonRelation(a,c);
 return {ab,bc,ac,qualifies:q.scene==='time'?ab==='meets'&&bc==='meets':ab==='overlaps'&&bc==='overlaps'};
}
export function intervalReasonDone(q){return q.timeSeen&&['before','meets','overlaps'].every(x=>q.spaceSeen.includes(x))&&q.reflection==='projection';}
export function intervalReasonRestore(q){
 if(!q||!Object.hasOwn(intervalReasonScenes,q.scene)||!q.positions||Object.keys(intervalReasonScenes).some(s=>!Array.isArray(q.positions[s])||q.positions[s].length!==3||q.positions[s].some(x=>!intervalReasonValid(x)))||typeof q.timeSeen!=='boolean'||!Array.isArray(q.spaceSeen)||new Set(q.spaceSeen).size!==q.spaceSeen.length||q.spaceSeen.some(x=>!['before','meets','overlaps'].includes(x))||![null,'projection','always','same'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {scene:q.scene,positions:{time:q.positions.time.map(x=>[...x]),space:q.positions.space.map(x=>[...x])},timeSeen:q.timeSeen,spaceSeen:[...q.spaceSeen],reflection:q.reflection};
}
