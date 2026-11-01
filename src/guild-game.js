export const guildMoves={work:'見張る',rest:'休む'};
export function guildPayoff(a,b){
 if(!Object.hasOwn(guildMoves,a)||!Object.hasOwn(guildMoves,b))throw new RangeError('行動が不正です。');
 if(a==='work'&&b==='work')return [3,3];
 if(a==='work'&&b==='rest')return [0,5];
 if(a==='rest'&&b==='work')return [5,0];
 return [1,1];
}
export function guildIndex(a,b){guildPayoff(a,b);return (a==='rest'?2:0)+(b==='rest'?1:0);}
export function createGuildGame(){return {a:null,b:null,visited:0,last:null,equilibrium:null,welfare:null,checked:false};}
export function guildGameComplete(s){return s.visited===15&&s.equilibrium==='rest'&&s.welfare==='work'&&s.checked;}
export function restoreGuildGame(s){
 if(!s||![null,'work','rest'].includes(s.a)||![null,'work','rest'].includes(s.b)||!Number.isInteger(s.visited)||s.visited<0||s.visited>15||![null,0,1,2,3].includes(s.last)||![null,'work','rest','mixed'].includes(s.equilibrium)||![null,'work','rest','mixed'].includes(s.welfare)||typeof s.checked!=='boolean'||(s.last!==null&&!(s.visited&(1<<s.last))))throw new RangeError('記録が不正です。');
 return {...s};
}
