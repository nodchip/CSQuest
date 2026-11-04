export const agentCommunicationLevel={id:'guild-agent-communication',number:'1336',kind:'agent-communication',name:'旅人と案内人形',tag:'AI・人との通信・曖昧さ',title:'伝わり方を確かめよう',story:'旅人が案内人形に行き先を伝えます。言葉と身ぶりを試し、意味が曖昧なときは確認しましょう。'};
export const agentCommunicationModes={words:'言葉の札',gesture:'身ぶりの札'};
export const agentCommunicationTargets={north:'北門',south:'南門'};
export function agentCommunicationCreate(){return {mode:'words',target:'north',phase:'ready',seen:[],reflection:null,checked:false};}
export function agentCommunicationConfigure(q,field,value){const options=field==='mode'?agentCommunicationModes:field==='target'?agentCommunicationTargets:null;if(!options||!Object.hasOwn(options,value))throw new RangeError('選択が不正です。');q[field]=value;q.phase='ready';}
export function agentCommunicationSend(q){if(q.phase!=='ready')throw new RangeError('先に新しい指示を選びましょう。');q.phase=q.mode==='words'?'understood':'ambiguous';}
export function agentCommunicationAsk(q){if(q.phase!=='ambiguous')throw new RangeError('曖昧な身ぶりを受け取ってから確認しましょう。');q.phase='asked';}
export function agentCommunicationConfirm(q){if(q.phase!=='asked')throw new RangeError('先に人形が行き先を尋ねましょう。');q.phase='understood';}
export function agentCommunicationGo(q){if(q.phase!=='understood')throw new RangeError('行き先を理解してから出発しましょう。');if(!q.seen.includes(q.mode))q.seen.push(q.mode);q.phase='arrived';}
export function agentCommunicationDone(q){return ['words','gesture'].every(id=>q.seen.includes(id))&&q.reflection==='alternatives'&&q.checked;}
export function agentCommunicationRestore(q){if(!q||!Object.hasOwn(agentCommunicationModes,q.mode)||!Object.hasOwn(agentCommunicationTargets,q.target)||!['ready','ambiguous','asked','understood','arrived'].includes(q.phase)||q.mode==='words'&&['ambiguous','asked'].includes(q.phase)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(id=>!Object.hasOwn(agentCommunicationModes,id))||![null,'alternatives','guess','one'].includes(q.reflection)||typeof q.checked!=='boolean'||q.checked&&q.reflection!=='alternatives')throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
