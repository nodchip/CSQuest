export const randomCutLevel={id:'forest-random-cut',number:'693',kind:'random-cut',name:'二つの見張り隊と偶然の札',tag:'確率的アルゴリズムと期待値',title:'塔を分けて道を見張ろう',story:'四つの塔を北隊と南隊に分け、異なる隊の塔を結ぶ道を見張ります。札による割当の結果と平均を比べましょう。'};
export const cutVertices=['A','B','C','D'];
export const cutEdges=[['A','B'],['B','C'],['C','A'],['C','D']];
export function cutCrossing(mask){if(!Number.isInteger(mask)||mask<0||mask>15)throw new RangeError('札の組が不正です。');return cutEdges.filter(([a,b])=>Boolean(mask&(1<<cutVertices.indexOf(a)))!==Boolean(mask&(1<<cutVertices.indexOf(b))));}
export function cutDistribution(){const counts=[0,0,0,0,0];for(let mask=0;mask<16;mask++)counts[cutCrossing(mask).length]++;return counts;}
export function createRandomCut(){return {mask:0,seen:[],expected:null,claim:null,checked:false};}
export function randomCutComplete(s){const seen=new Set(s.seen.map(mask=>cutCrossing(mask).length));return s.checked&&seen.has(0)&&seen.has(1)&&seen.has(3)&&s.expected==='two'&&s.claim==='average';}
export function restoreRandomCut(s){if(!s||!Number.isInteger(s.mask)||s.mask<0||s.mask>15||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||s.seen.some(mask=>!Number.isInteger(mask)||mask<0||mask>15)||![null,'one','two','three'].includes(s.expected)||![null,'average','always','optimal'].includes(s.claim)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {mask:s.mask,seen:[...s.seen],expected:s.expected,claim:s.claim,checked:s.checked};}
