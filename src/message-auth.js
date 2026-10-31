export const messageAuthLevel={id:'castle-message-auth',number:'262',kind:'message-auth',name:'伝令の印を確かめる',tag:'ハッシュとメッセージ認証',title:'書き換えられた伝令を見抜こう',story:'薬を届ける伝令の本文と印を、二つの方法で確かめます。'};
export const authModes={hash:'公開の指紋',mac:'秘密を使う印'};
export const authActions={honest:'元の伝令',modify:'本文だけ変更',replace:'本文と印を変更',replay:'古い伝令を再送'};
// An idealized fixed tag table, not a MAC implementation. The attacker can
// try only the explicitly listed changes and does not know the shared key.
export function authResult(mode,action){
 if(!Object.hasOwn(authModes,mode)||!Object.hasOwn(authActions,action))throw new RangeError('条件が不正です。');
 const altered=action==='modify'||action==='replace',body=altered?2:1;
 const tag=mode==='hash'?(action==='replace'?2:1):(action==='replace'?'銀':'金');
 const expected=mode==='hash'?body:(body===1?'金':'別の印');
 return {body,tag,accepted:tag===expected,replayed:action==='replay'};
}
export function createMessageAuth(){return {mode:'hash',action:'honest',tested:[]};}
export function messageAuthComplete(s){return Object.keys(authModes).every(m=>Object.keys(authActions).every(a=>s.tested.includes(`${m}:${a}`)));}
export function restoreMessageAuth(saved){const valid=Object.keys(authModes).flatMap(m=>Object.keys(authActions).map(a=>`${m}:${a}`));if(!saved||!Object.hasOwn(authModes,saved.mode)||!Object.hasOwn(authActions,saved.action)||!Array.isArray(saved.tested)||saved.tested.length>valid.length||new Set(saved.tested).size!==saved.tested.length||!saved.tested.every(id=>valid.includes(id)))throw new RangeError('途中記録が不正です。');return {mode:saved.mode,action:saved.action,tested:[...saved.tested]};}
