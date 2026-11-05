import {createMetaLab,restoreMetaLab} from './meta-expression.js';
export const reflectionLevel={id:'workshop-reflection-menu',number:'779',kind:'reflection-menu',name:'姿を映す案内鏡',tag:'リフレクションと操作の生成',title:'精霊に合う操作を鏡で組み立てよう',story:'祭りの工房では、種類の違う精霊が交代します。精霊の情報から操作を並べ、二つの仕事を果たしましょう。'};
export const reflectionTypes={lamp:{name:'灯の精霊',methods:['glow','rest']},rain:{name:'雨の精霊',methods:['sprinkle','rest']}};
export const reflectionMethods={glow:'灯りをともす',sprinkle:'水をまく',rest:'力を回復する'};
export const reflectionTasks=['灯の精霊を鏡で調べる','調べた情報から操作札を作る','灯りをともす','雨の精霊に交代する','古い「灯りをともす」を試す','雨の精霊を鏡で調べる','新しい情報から操作札を作る','水をまく'];
const expected=['inspect','build','glow','switch','glow','inspect','build','sprinkle'];
export function reflectionInitial(){return {stage:0,type:'lamp',inspection:null,menu:[],lampEnergy:1,rainWater:1,lit:false,watered:false,last:''};}
export function reflectionPerform(s,action){
 if(s.stage>=expected.length||action!==expected[s.stage])throw new RangeError('仕事の順番と精霊の情報を確かめましょう');
 if(action==='inspect'){s.inspection={type:s.type,methods:[...reflectionTypes[s.type].methods]};s.last=`${reflectionTypes[s.type].name}の公開操作を調べました。`;}
 else if(action==='build'){if(!s.inspection||s.inspection.type!==s.type)throw new RangeError('今の精霊の情報を調べてください');s.menu=[...s.inspection.methods];s.last='調べた操作から札を作りました。';}
 else if(action==='switch'){s.type='rain';s.last='精霊が交代しました。古い札はまだ残っています。';}
 else {if(!s.menu.includes(action))throw new RangeError('札がありません');if(!reflectionTypes[s.type].methods.includes(action)){s.last='今の精霊にその操作はありません。実行せず、札の更新が必要です。';}else if(action==='glow'){if(!s.lampEnergy)throw new RangeError('力が足りません');s.lampEnergy--;s.lit=true;s.last='灯りがともりました。';}else if(action==='sprinkle'){if(!s.rainWater)throw new RangeError('水が足りません');s.rainWater--;s.watered=true;s.last='花に水をまきました。';}}
 s.stage++;return s;
}
export function reflectionReplay(history){if(!Array.isArray(history)||history.length>expected.length)throw new RangeError('記録が不正です');const s=reflectionInitial();for(const action of history)reflectionPerform(s,action);return s;}
export function reflectionCreate(){return {history:[],answer:null,meta:createMetaLab()};}
export function reflectionTry(q,action){reflectionPerform(reflectionReplay(q.history),action);q.history.push(action);}
export function reflectionComplete(q){const s=reflectionReplay(q.history);return s.lit&&s.watered&&s.stage===expected.length&&q.answer==='inspect';}
export function reflectionRestore(q){if(!q||![null,'inspect','same','unsafe'].includes(q.answer))throw new RangeError('記録が不正です');reflectionReplay(q.history);return {history:[...q.history],answer:q.answer,meta:q.meta===undefined?createMetaLab():restoreMetaLab(q.meta)};}
