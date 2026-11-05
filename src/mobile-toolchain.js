import {virtualSensorCreate,virtualSensorRestore} from './mobile-virtual-sensor.js';
export const toolchainPlatforms={android:'Android の依頼',ios:'iOS の依頼'};
export const toolchainLanguages={kotlin:'Kotlin',swift:'Swift'};
export const toolchainEnvironments={studio:'Android Studio',xcode:'Xcode'};
export const toolchainSpecs={android:{language:'kotlin',environment:'studio'},ios:{language:'swift',environment:'xcode'}};
export function toolchainCreate(){return {platform:'android',language:null,environment:null,phase:0,seen:[],reflection:null,sensor:virtualSensorCreate()};}
export function toolchainMatches(q){if(!Object.hasOwn(toolchainSpecs,q.platform))throw new RangeError('依頼が不正です。');const spec=toolchainSpecs[q.platform];return q.language===spec.language&&q.environment===spec.environment;}
export function toolchainStep(q){if(!toolchainMatches(q)||q.phase>=3)throw new RangeError('指定の道具を選び、順に進めましょう。');q.phase++;if(q.phase===3&&!q.seen.includes(q.platform))q.seen.push(q.platform);}
export function toolchainDone(q){return ['android','ios'].every(k=>q.seen.includes(k))&&q.reflection==='both';}
export function toolchainRestore(q){if(!q||!Object.hasOwn(toolchainPlatforms,q.platform)||![null,...Object.keys(toolchainLanguages)].includes(q.language)||![null,...Object.keys(toolchainEnvironments)].includes(q.environment)||!Number.isInteger(q.phase)||q.phase<0||q.phase>3||q.phase>0&&!toolchainMatches(q)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(toolchainPlatforms,k))||![null,'both','virtual','same'].includes(q.reflection))throw new RangeError('道具の記録が不正です。');return {...q,seen:[...q.seen],sensor:Object.hasOwn(q,'sensor')?virtualSensorRestore(q.sensor):virtualSensorCreate()};}
