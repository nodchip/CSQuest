// Directions are north, east, south, west. The two exits require connected paths from the source.
export const beaconTiles=[
 {id:'fork',name:'中央の分岐',row:1,col:0,base:[0,2,3]},
 {id:'top-bend',name:'上の角',row:0,col:0,base:[1,2]},
 {id:'top-mid',name:'上の道',row:0,col:1,base:[1,3]},
 {id:'top-end',name:'上の出口',row:0,col:2,base:[1,3]},
 {id:'bottom-bend',name:'下の角',row:2,col:0,base:[0,1]},
 {id:'bottom-mid',name:'下の道',row:2,col:1,base:[1,3]},
 {id:'bottom-end',name:'下の出口',row:2,col:2,base:[1,3]}
];
const directionNames=['上','右','下','左'],deltas=[[-1,0],[0,1],[1,0],[0,-1]];
export function beaconDirections(tile,rotation){return tile.base.map(d=>(d+rotation)%4).sort((a,b)=>a-b);}
export function beaconSymbol(tile,rotation){const key=beaconDirections(tile,rotation).join('');return {'02':'│','13':'─','12':'┌','01':'└','23':'┐','03':'┘','023':'┤','012':'├','123':'┬','013':'┴'}[key];}
export function beaconDescription(tile,rotation){return beaconDirections(tile,rotation).map(d=>directionNames[d]).join('・');}
export function createBeacon(){return {rotations:[1,1,1,1,1,1,1],solved:false};}
export function beaconReach(rotations){if(!Array.isArray(rotations)||rotations.length!==beaconTiles.length||!rotations.every(n=>Number.isInteger(n)&&n>=0&&n<4))throw new RangeError('向きが不正です');const dirs=beaconTiles.map((t,i)=>beaconDirections(t,rotations[i])),seen=new Set();if(dirs[0].includes(3))seen.add(0);const queue=[...seen];while(queue.length){const i=queue.shift(),tile=beaconTiles[i];for(const d of dirs[i]){const [dr,dc]=deltas[d],j=beaconTiles.findIndex(t=>t.row===tile.row+dr&&t.col===tile.col+dc);if(j>=0&&dirs[j].includes((d+2)%4)&&!seen.has(j)){seen.add(j);queue.push(j);}}}return {reachable:[...seen],top:seen.has(3)&&dirs[3].includes(1),bottom:seen.has(6)&&dirs[6].includes(1)};}
export function beaconSolved(s){const r=beaconReach(s.rotations);return r.top&&r.bottom;}
export function restoreBeacon(saved){if(!saved||typeof saved.solved!=='boolean')throw new RangeError('途中記録が不正です');const s={rotations:[...saved.rotations],solved:saved.solved};beaconReach(s.rotations);if(s.solved&&!beaconSolved(s))throw new RangeError('完成した道が不正です');return s;}
