export const diamondLevel={id:'guild-diamond-notice',number:'823',kind:'double-diamond',name:'知らせを届ける二つの探検',tag:'発散・収束と反復設計',title:'困りごとと解決案を広げて、確かめよう',story:'祭りの知らせが届かない旅人がいます。決めつけずに話を聞き、いくつかの案を試してギルドの仕組みを見直しましょう。'};
export const diamondPeople={ao:{name:'アオ',voice:'内容を周りに知られたくない。自分では文字を読める。'},bea:{name:'ベア',voice:'文字を読めないが、手持ちの受信機とイヤホンで音を聞ける。'},rin:{name:'リン',voice:'個人の受信機は持っていない。文字は読める。'}};
export const diamondFrames={access:'内容を他人に見せず、それぞれが知らせを受け取れるようにする',screen:'全員に同じ画面を持たせることだけを考える',public:'早く広く伝わるなら個人の内容を公開する'};
export const diamondOptions={board:{name:'内容を広場の掲示板に出す',feedback:'アオの内容が周りに見え、ベアは文字を読めません。'},paper:{name:'内容を書いた封書だけを手渡す',feedback:'アオとリンは読めますが、ベアは文字を読めません。'},audio:{name:'個人の受信機への音声だけにする',feedback:'ベアは聞けますが、リンは受信機を持っていません。'},combined:{name:'封書と個人の音声を選べるようにする',feedback:'この３人は、それぞれ読める封書か手持ちの受信機を選べます。封書を他人に見せず渡し、音をイヤホンだけに流せると仮定します。'}};
export function diamondCreate(){return {heard:[],frame:null,tested:[],choice:null,reflection:null};}
export function diamondStep(q,action){
 if(typeof action!=='string')throw new RangeError('操作が不正です。');const [op,id,...extra]=action.split(':');if(extra.length)throw new RangeError('操作が不正です。');
 if(op==='hear'&&Object.hasOwn(diamondPeople,id)){if(q.heard.includes(id))throw new RangeError('この人の声は聞きました。');q.heard.push(id);return;}
 if(op==='frame'&&Object.hasOwn(diamondFrames,id)){if(q.heard.length!==3)throw new RangeError('まず３人の話を聞きましょう。');q.frame=id;q.tested=[];q.choice=null;return;}
 if(op==='test'&&Object.hasOwn(diamondOptions,id)){if(q.frame!=='access')throw new RangeError('話をもとに今回の課題を見直しましょう。');if(q.tested.includes(id))throw new RangeError('この案は試しました。');q.tested.push(id);return;}
 if(op==='choose'&&Object.hasOwn(diamondOptions,id)){if(q.tested.length!==4)throw new RangeError('４つの案を試してから選びましょう。');q.choice=id;return;}
 if(op==='reflect'&&['iterate','linear','universal'].includes(id)){q.reflection=id;return;}
 throw new RangeError('操作が不正です。');
}
export function diamondComplete(q){return q.heard.length===3&&q.frame==='access'&&q.tested.length===4&&q.choice==='combined'&&q.reflection==='iterate';}
export function diamondRestore(q){
 if(!q||!Array.isArray(q.heard)||new Set(q.heard).size!==q.heard.length||q.heard.some(x=>!Object.hasOwn(diamondPeople,x))||![null,...Object.keys(diamondFrames)].includes(q.frame)||!Array.isArray(q.tested)||new Set(q.tested).size!==q.tested.length||q.tested.some(x=>!Object.hasOwn(diamondOptions,x))||![null,...Object.keys(diamondOptions)].includes(q.choice)||![null,'iterate','linear','universal'].includes(q.reflection))throw new RangeError('記録が不正です。');
 if((q.frame!==null&&q.heard.length!==3)||(q.tested.length&&q.frame!=='access')||(q.choice!==null&&q.tested.length!==4))throw new RangeError('記録が不正です。');
 return {heard:[...q.heard],frame:q.frame,tested:[...q.tested],choice:q.choice,reflection:q.reflection};
}
