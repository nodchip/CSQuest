import {minimaxCases,minimaxValue,horizonExample,horizonValues} from './minimax.js';
export const strategyTrials={first:{east:minimaxCases.first.east,west:minimaxCases.first.west},second:{east:minimaxCases.second.east,west:minimaxCases.second.west},horizon:{east:horizonExample.terminal.east,west:horizonExample.terminal.west,estimate:horizonExample.estimate}};
export function replayGuardianStrategy(kind,history){
 if(!Object.hasOwn(strategyTrials,kind)||!Array.isArray(history)||history.length>30)return null;
 let step=0,done=false;const values=kind==='horizon'?horizonValues():minimaxValue(kind),expected=[...(kind==='horizon'?[`estimate:${values.shallow}`]:[]),`east:${values.east}`,`west:${values.west}`,`choose:${values.best}`];
 for(const action of history){if(typeof action!=='string'||done)return null;if(action==='reset'){step=0;continue;}if(action!==expected[step])return null;step++;if(step===expected.length)done=true;}
 return {step,done};
}
