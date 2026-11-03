export const cryptoAccelerationLevel={id:'forge-crypto-acceleration',number:'1088',kind:'crypto-acceleration',name:'暗号の炉と三つの道具',tag:'暗号ハードウェアと費用',title:'封印する道具を選ぶ',story:'工房は同じ暗号処理を３種類の道具で行えます。箱の数に応じた準備と処理の時間を比べましょう。'};
export const cryptoAccelModes={software:'汎用の命令',instructions:'CPU の専用命令',device:'外付けの専用装置'};
export const cryptoAccelSizes=[1,8,16];
export const cryptoAccelGuesses=[20,45,108,160,164,228,320,360,720];
export const cryptoAccelKeys=Object.keys(cryptoAccelModes).flatMap(m=>cryptoAccelSizes.map(n=>`${m}:${n}`));
export function cryptoAccelEstimate(mode,blocks){if(!Object.hasOwn(cryptoAccelModes,mode)||!cryptoAccelSizes.includes(blocks))throw new RangeError('条件が不正です');const setup=mode==='device'?100:0,perBlock=mode==='software'?45:mode==='instructions'?20:8;return {setup,perBlock,total:setup+perBlock*blocks};}
export function cryptoAccelCreate(){return {mode:'software',blocks:1,guess:null,seen:[],choice:null,security:null};}
export function cryptoAccelRestore(q){
 if(!q||!Object.hasOwn(cryptoAccelModes,q.mode)||!cryptoAccelSizes.includes(q.blocks)||![null,...cryptoAccelGuesses].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>9||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!cryptoAccelKeys.includes(k))||![null,'device','instructions'].includes(q.choice)||![null,'authentication','automatic'].includes(q.security))throw new RangeError('記録が不正です');return {...q,seen:[...q.seen]};
}
export function cryptoAccelDone(q){return cryptoAccelKeys.every(k=>q.seen.includes(k))&&q.choice==='device'&&q.security==='authentication';}
