export const stopMotionLevel={id:'village-stop-motion',number:'1253',kind:'stop-motion',name:'人形の小さな一歩',tag:'ストップモーション',title:'写真を並べて動かそう',story:'祭りの人形師は、人形が橋を渡る短い映像を作りたいそうです。少しずつ位置を変えて撮影し、写真を順番に再生しましょう。'};
export function stopMotionCreate(){return {position:0,frames:[],fps:2,seen:[],reflection:null};}
export function stopMotionCapture(q){if(q.frames.length>=4)return false;q.frames.push(q.position);q.seen=[];return true;}
export function stopMotionUndo(q){if(!q.frames.length)return false;q.frames.pop();q.seen=[];return true;}
export function stopMotionTarget(frames){return Array.isArray(frames)&&frames.length===4&&frames.every((p,i)=>p===i);}
export function stopMotionDuration(frames,fps){if(!Array.isArray(frames)||frames.length>4||frames.some(p=>![0,1,2,3].includes(p))||![2,4].includes(fps))throw new RangeError('写真か速度が不正です。');return frames.length/fps;}
export function stopMotionPlay(q){if(q.frames.length!==4)return false;if(stopMotionTarget(q.frames)&&!q.seen.includes(q.fps))q.seen.push(q.fps);return true;}
export function stopMotionDone(q){return stopMotionTarget(q.frames)&&[2,4].every(n=>q.seen.includes(n))&&q.reflection==='frames';}
export function stopMotionRestore(q){if(!q||![0,1,2,3].includes(q.position)||!Array.isArray(q.frames)||q.frames.length>4||q.frames.some(x=>![0,1,2,3].includes(x))||![2,4].includes(q.fps)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>![2,4].includes(x))||(q.seen.length&&!stopMotionTarget(q.frames))||![null,'frames','continuous'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,frames:[...q.frames],seen:[...q.seen]};}
