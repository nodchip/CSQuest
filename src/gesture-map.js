export const gestureMapLevel={id:'guild-gesture-map',number:'1298',kind:'gesture-map',name:'指先でめくる旅の地図',tag:'ジェスチャーと代替操作',title:'地図を動かす方法を比べよう',story:'旅の地図に三つの場所が描かれています。地図を左右に動かし、誰もが使える操作方法を考えましょう。'};
export const gesturePlaces=['西の森','ギルド','東の村'];
export function gestureDirection(dx,dy){if(!Number.isFinite(dx)||!Number.isFinite(dy))throw new RangeError('移動量が不正です。');return Math.abs(dx)>=40&&Math.abs(dx)>Math.abs(dy)?(dx<0?1:-1):0;}
export function gestureCreate(){return {position:1,visited:[false,true,false],reflection:null};}
export function gestureMove(q,direction){if(direction!==-1&&direction!==1)throw new RangeError('移動方向が不正です。');q.position=Math.max(0,Math.min(2,q.position+direction));q.visited[q.position]=true;return q.position;}
export function gestureDone(q){return q.visited.every(Boolean)&&q.reflection==='alternative';}
export function gestureRestore(q){if(!q||!Number.isInteger(q.position)||q.position<0||q.position>2||!Array.isArray(q.visited)||q.visited.length!==3||!q.visited.every(x=>typeof x==='boolean')||!q.visited[1]||!q.visited[q.position]||![null,'alternative','gesture'].includes(q.reflection))throw new RangeError('途中記録が不正です。');return {position:q.position,visited:[...q.visited],reflection:q.reflection};}
