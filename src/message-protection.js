export const messageProtectionLevel={id:'castle-message-protection',number:'998',kind:'message-protection',name:'王城への通信を守る',tag:'通信・機密性・認証',title:'伝言路に必要な守りを選ぼう',story:'村から王城に非公開の記録を送ります。途中の伝言路と、記録を読む権限を守りましょう。'};
export const messageControls={encrypt:'内容の暗号化',integrity:'改変検出',identity:'双方の身元と鍵の確認',authorize:'読む権限の確認'};
export const messageThreats={
 observe:{name:'盗み見',text:'途中の通行人は通信を受動的に観察します。鍵の差替えや端末への侵入は行いません。'},
 modify:{name:'途中改変',text:'攻撃者は伝言を途中で書き換えます。身元と鍵を確認しない場合は通信の鍵を差し替えられると仮定します。'},
 fake:{name:'相手のなりすまし',text:'攻撃者は自分を正規の王城だと名乗ります。本人確認の仕組みには正規の鍵が事前に登録済みと仮定します。'},
 role:{name:'権限のない読取り',text:'閲覧役ではない者が王城に記録の閲覧を求めます。身元を確認しない場合、閲覧役の名を偽れると仮定します。'}
};
export function messageOutcome(threat,controls){if(!Object.hasOwn(messageThreats,threat))throw new RangeError('不正な場面');const has=key=>controls.includes(key);if(threat==='observe')return has('encrypt');if(threat==='modify')return has('integrity')&&has('identity');if(threat==='fake')return has('identity');return has('identity')&&has('authorize');}
export function messageProtectionCreate(){return {selected:'observe',controls:[],observed:Object.fromEntries(Object.keys(messageThreats).map(id=>[id,{blocked:false,exposed:false}])),reflection:null};}
export function messageProtectionComplete(s){return Object.keys(messageThreats).every(id=>s.observed[id].blocked&&s.observed[id].exposed)&&Object.keys(messageControls).every(key=>s.controls.includes(key))&&s.reflection==='limits';}
export function messageProtectionRestore(saved){if(!saved||!Object.hasOwn(messageThreats,saved.selected)||!Array.isArray(saved.controls)||saved.controls.some(key=>!Object.hasOwn(messageControls,key))||new Set(saved.controls).size!==saved.controls.length||![null,'limits','encrypt','identity'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=messageProtectionCreate();s.selected=saved.selected;s.controls=[...saved.controls];s.reflection=saved.reflection;for(const id of Object.keys(messageThreats)){const o=saved.observed?.[id];if(!o||typeof o.blocked!=='boolean'||typeof o.exposed!=='boolean')throw new RangeError('途中記録が不正です');s.observed[id]={blocked:o.blocked,exposed:o.exposed};}return s;}
