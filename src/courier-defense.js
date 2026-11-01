export const courierDefenseLevel={id:'castle-courier-defense',number:'616',kind:'courier-defense',name:'王城から村への秘密の伝令',tag:'認証・暗号化・再送防止',title:'伝令の旅を守り抜こう',story:'ミラの伝令を村へ届けます。途中で鍵を確かめ、荷物を守り、古い伝令を見分けましょう。'};
export const courierThreats={spy:'森の盗み聞き',tamper:'橋での書き換え',swap:'塔での鍵の差し替え',replay:'門での古い伝令の再送'};
const keys=['checked','unchecked'],seals=['aead','plain'],gates=['sequence','none'];
export function courierOutcome(threat,key,seal,gate){
 if(!Object.hasOwn(courierThreats,threat)||!keys.includes(key)||!seals.includes(seal)||!gates.includes(gate))throw new RangeError('旅の条件が不正です');
 if(threat==='spy')return seal==='aead'?{safe:true,detail:'影は暗号文を見ましたが、この模型では秘密の共通鍵を知らず、本文を読めません。'}:{safe:false,detail:'本文をそのまま運んだため、影に読まれました。'};
 if(threat==='tamper')return seal==='aead'?{safe:true,detail:'影が暗号文を変更しましたが、村は認証に失敗した伝令を拒否しました。'}:{safe:false,detail:'影が本文を変更し、村は変更に気づかず受け取りました。'};
 if(threat==='swap'){
  if(key==='unchecked')return {safe:false,detail:'影の公開鍵を相手の鍵として使ったため、影が共通鍵を知り、暗号化した本文も読めます。'};
  return seal==='aead'?{safe:true,detail:'確認済みの鍵と異なるため差し替えを検出し、確認済みの正しい鍵で伝令を守りました。'}:{safe:false,detail:'鍵の差し替えは検出しましたが、本文をそのまま運んだため影に読まれました。'};
 }
 if(gate==='sequence'&&seal==='aead')return {safe:true,detail:'村は認証された番号と記録を照らし、受取済みの伝令を拒否しました。'};
 if(gate==='sequence')return {safe:false,detail:'番号を調べても本文とともに認証していないため、影が古い伝令の番号を変更して受理させました。'};
 return {safe:false,detail:'村に受取済みの番号を確かめる仕組みがなく、古い伝令を再び受理しました。'};
}
export function createCourierDefense(){return {threat:'spy',stage:'key',key:null,seal:null,gate:null,observed:[],answer:null,checked:false};}
export function courierRestart(s,threat=s.threat){if(!Object.hasOwn(courierThreats,threat))throw new RangeError('依頼が不正です');return {...s,threat,stage:'key',key:null,seal:null,gate:null,checked:false};}
export function courierChoose(s,choice){
 const next={...s,observed:[...s.observed],checked:false};
 if(s.stage==='key'&&keys.includes(choice)){next.key=choice;next.stage='seal';}
 else if(s.stage==='seal'&&seals.includes(choice)){next.seal=choice;next.stage='gate';}
 else if(s.stage==='gate'&&gates.includes(choice)){next.gate=choice;next.stage='result';if(courierOutcome(next.threat,next.key,next.seal,next.gate).safe&&!next.observed.includes(next.threat))next.observed.push(next.threat);}
 else throw new RangeError('現在の場所では選べません');
 return next;
}
export function courierDefenseComplete(s){return Object.keys(courierThreats).every(k=>s.observed.includes(k))&&s.answer==='layers'&&s.checked;}
export function restoreCourierDefense(s){
 if(!s||!Object.hasOwn(courierThreats,s.threat)||!['key','seal','gate','result'].includes(s.stage)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!Object.hasOwn(courierThreats,k))||![null,'layers','encryption','sequence'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 const valid=(s.stage==='key'&&s.key===null&&s.seal===null&&s.gate===null)||(s.stage==='seal'&&keys.includes(s.key)&&s.seal===null&&s.gate===null)||(s.stage==='gate'&&keys.includes(s.key)&&seals.includes(s.seal)&&s.gate===null)||(s.stage==='result'&&keys.includes(s.key)&&seals.includes(s.seal)&&gates.includes(s.gate));
 if(!valid)throw new RangeError('旅の途中記録が不正です');
 return {...s,observed:[...s.observed]};
}
