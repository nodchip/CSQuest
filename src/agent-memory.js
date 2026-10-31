export const agentLevel={id:'sign-memory',number:'109',kind:'agentmemory',name:'道しるべを覚える人形',tag:'部分観測とエージェント',title:'入口の印を忘れずに',story:'自動人形は入口に現れる印を見て、同じ見た目の分かれ道から安全な道を選びます。印をどう使うか決めましょう。'};
export const agentCases={sun:{name:'太陽の印',safe:'left'},moon:{name:'月の印',safe:'right'}};
export const agentDirections={left:'左の道',right:'右の道'};
export function createAgentPolicy(){return {memory:false,sun:'left',moon:'left',fallback:'left',tested:false};}
export function runAgent(policy,id){
 if(!Object.hasOwn(agentCases,id)||!policy||typeof policy.memory!=='boolean'||!['left','right'].includes(policy.sun)||!['left','right'].includes(policy.moon)||!['left','right'].includes(policy.fallback))throw new RangeError('設定が不正です。');
 const remembered=policy.memory?id:null,choice=remembered?policy[remembered]:policy.fallback;
 return {observed:id,remembered,choice,success:choice===agentCases[id].safe};
}
export function restoreAgent(saved){if(!saved||typeof saved.tested!=='boolean')throw new RangeError('途中記録が不正です。');runAgent(saved,'sun');return {memory:saved.memory,sun:saved.sun,moon:saved.moon,fallback:saved.fallback,tested:saved.tested};}
export function agentComplete(policy){return policy.tested&&Object.keys(agentCases).every(id=>runAgent(policy,id).success);}
