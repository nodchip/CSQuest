export const motionPosterLevel={id:'village-motion-poster',number:'1254',kind:'motion-poster',name:'動く祭りの案内',tag:'モーショングラフィックス',title:'文字と紋章に動きを付ける',story:'祭りの案内係から、文字と星の紋章が出会う動く看板を頼まれました。時刻ごとの位置を決め、案内を再生しましょう。'};
export const posterTitlePositions=[12,42,72];
export const posterStarPositions=[135,150,165];
const target=[{title:12,star:165},{title:42,star:150},{title:72,star:135}];
export function posterValue(keys,time){if(!Array.isArray(keys)||keys.length!==3||keys.some(k=>!k||!posterTitlePositions.includes(k.title)||!posterStarPositions.includes(k.star))||!Number.isFinite(time)||time<0||time>2)throw new RangeError('位置か時刻が不正です。');const i=Math.min(Math.floor(time),1),fraction=time-i;return {title:keys[i].title+(keys[i+1].title-keys[i].title)*fraction,star:keys[i].star+(keys[i+1].star-keys[i].star)*fraction};}
export function posterMatches(keys){return Array.isArray(keys)&&keys.length===3&&keys.every((k,i)=>k&&k.title===target[i].title&&k.star===target[i].star);}
export function posterCreate(){return {frame:0,title:12,star:165,keys:[null,null,null],played:false,reflection:null};}
export function posterRecord(q){q.keys[q.frame]={title:q.title,star:q.star};q.played=false;}
export function posterPlay(q){if(q.keys.some(x=>x===null))return false;posterValue(q.keys,0);q.played=posterMatches(q.keys);return true;}
export function posterDone(q){return q.played&&posterMatches(q.keys)&&q.reflection==='graphics';}
export function posterRestore(q){if(!q||![0,1,2].includes(q.frame)||!posterTitlePositions.includes(q.title)||!posterStarPositions.includes(q.star)||!Array.isArray(q.keys)||q.keys.length!==3||q.keys.some(x=>x!==null&&(!x||!posterTitlePositions.includes(x.title)||!posterStarPositions.includes(x.star)))||typeof q.played!=='boolean'||(q.played&&!posterMatches(q.keys))||![null,'graphics','still'].includes(q.reflection))throw new RangeError('記録が不正です。');return {...q,keys:q.keys.map(x=>x?{...x}:null)};}
