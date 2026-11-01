import {createLinks,restoreLinks,linksComplete} from './link-choice.js';
export const transportNeedsLevel={id:'forest-transport-needs',number:'668',kind:'transport-needs',name:'失われた二通目の知らせ',tag:'TCP・UDP と用途の要求',title:'知らせに合う届け方を選ぼう',story:'森の伝令が三つの知らせを送ります。途中の二つ目が失われたとき、順序を守る道と一通ずつ届ける道で受け取り方を比べましょう。'};
export const transportModes={stream:'順序を守る道（TCP の模型）',datagram:'一通ずつの道（UDP の模型）'};
export function createTransportTrial(mode){if(!Object.hasOwn(transportModes,mode))throw new RangeError('方式が不正です。');return {mode,tick:0,delivered:[],buffered:[],timeline:[],history:[]};}
export function transportTrialStep(s){
 if(!s||s.tick>=4)return {ok:false,message:'この方式の観察は終わっています。必要ならやり直しましょう。'};
 const n={...s,delivered:[...s.delivered],buffered:[...s.buffered],timeline:[...s.timeline],history:[...s.history],tick:s.tick+1};let message='';
 if(n.tick===1){n.delivered.push(1);message='１番が届き、受け取り手に渡りました。';}
 else if(n.tick===2)message='２番は途中で失われました。';
 else if(n.tick===3){if(s.mode==='stream'){n.buffered.push(3);message='３番は届きましたが、順序を守るため２番を待ちます。';}else{n.delivered.push(3);message='３番は届いたので受け取り手に渡りました。２番は欠けたままです。';}}
 else if(s.mode==='stream'){n.delivered.push(2,...n.buffered);n.buffered=[];message='この例では２番の再送が届き、２番と待っていた３番を順に渡しました。';}
 else message='この例では送り直しを行わず、２番は欠けたままです。';
 n.timeline.push({tick:n.tick,delivered:[...n.delivered],buffered:[...n.buffered]});n.history.push('step');return {ok:true,state:n,message};
}
export function createTransportNeeds(){return {links:createLinks(),selected:'stream',trials:{stream:createTransportTrial('stream'),datagram:createTransportTrial('datagram')},letter:null,beacon:null,udp:null,checked:false};}
export function transportNeedsComplete(s){return Object.keys(transportModes).every(k=>s.trials[k].tick===4)&&s.letter==='stream'&&s.beacon==='datagram'&&s.udp==='application'&&s.checked&&linksComplete(s.links);}
export function restoreTransportNeeds(saved){if(!saved||!Object.hasOwn(transportModes,saved.selected)||!saved.trials||![null,'stream','datagram','either'].includes(saved.letter)||![null,'stream','datagram','either'].includes(saved.beacon)||![null,'application','guaranteed','impossible'].includes(saved.udp)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');const n=createTransportNeeds();n.links=restoreLinks(saved.links);n.selected=saved.selected;n.letter=saved.letter;n.beacon=saved.beacon;n.udp=saved.udp;n.checked=saved.checked;for(const mode of Object.keys(transportModes)){const h=saved.trials[mode]?.history;if(!Array.isArray(h)||h.length>4)throw new RangeError('途中記録が不正です。');for(const a of h){if(a!=='step')throw new RangeError('途中記録が不正です。');const r=transportTrialStep(n.trials[mode]);if(!r.ok)throw new RangeError('途中記録が不正です。');n.trials[mode]=r.state;}}return n;}
