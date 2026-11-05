export const firewallLevel={id:'castle-firewall-state',number:'279',kind:'firewall-state',name:'門番と返事の記録',tag:'ステートフルな通信制御',title:'頼んだ返事だけを通そう',story:'城の門番が、外の商人への依頼と外部からの伝令を区別します。'};
export const firewallModes={open:'外からの伝令をすべて通す',closed:'外からの伝令をすべて止める',stateful:'依頼に対応する返事だけ通す'};
export const firewallActions={out:'城から商人へ依頼',reply:'商人から返事',stranger:'別の相手から新しい伝令',expire:'記録の期限を過ぎる'};
export function firewallRun(mode,history){
 if(!Object.hasOwn(firewallModes,mode)||!Array.isArray(history)||history.length>24||!history.every(a=>Object.hasOwn(firewallActions,a)))throw new RangeError('操作が不正です。');
 let known=false;const events=[];
 for(const action of history){const before=known,allow=action==='expire'?null:action==='out'||mode==='open'||mode==='stateful'&&action==='reply'&&known;if(action==='out'&&allow)known=true;if(action==='expire')known=false;events.push({action,before,allow,known});}
 return {known,events};
}
export function firewallReplyPreview(mode,history,content){if(!['safe','harmful'].includes(content))throw new RangeError('内容が不正です。');const {known}=firewallRun(mode,history);return {known,allow:mode==='open'||mode==='stateful'&&known,harmful:content==='harmful'};}
export function createFirewall(){return {content:'safe',selected:'open',histories:{open:[],closed:[],stateful:[]}};}
export function firewallObserved(mode,history){const events=firewallRun(mode,history).events;return events.some(e=>e.action==='out'&&e.allow)&&events.some(e=>e.action==='reply'&&e.before&&e.allow===(mode!=='closed'))&&events.some(e=>e.action==='stranger'&&e.allow===(mode==='open'))&&(mode!=='stateful'||events.some(e=>e.action==='reply'&&!e.before&&!e.allow));}
export function firewallComplete(s){return Object.keys(firewallModes).every(mode=>firewallObserved(mode,s.histories[mode]));}
export function restoreFirewall(saved){if(!saved||!Object.hasOwn(firewallModes,saved.selected)||!saved.histories)throw new RangeError('途中記録が不正です。');const s=createFirewall();if(saved.content!==undefined&&!['safe','harmful'].includes(saved.content))throw new RangeError('内容が不正です。');s.content=saved.content??'safe';s.selected=saved.selected;for(const mode of Object.keys(firewallModes)){firewallRun(mode,saved.histories[mode]);s.histories[mode]=[...saved.histories[mode]];}return s;}
