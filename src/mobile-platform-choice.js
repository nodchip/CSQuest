import {platformOverviewCreate,platformOverviewRestore} from './platform-overview.js';
export const mobilePlatformLevel={id:'guild-mobile-platform-choice',number:'1325',kind:'mobile-platform-choice',name:'二つの王国の水晶',tag:'モバイル・共通開発・比較',title:'水晶の作り方を選ぼう',story:'二つの王国で使う案内水晶を作ります。依頼ごとの条件に合わせて、別々に作るか、処理を共有するか考えましょう。'};
export const mobilePlatformWays={separate:'王国ごとに別々に作る',shared:'共通の処理と王国ごとの画面を組み合わせる'};
export const mobilePlatformCases={
  reuse:{name:'同じ道順の計算',description:'二つの王国で道順の計算規則は同じ。画面は王国ごとに作り、計算の変更は両方に反映したい。共通化の道具は両王国に対応している。',answer:'shared',explanation:'計算を共通部分に置けば、一つの変更を両方に反映できます。画面や端末固有の部分は別途作り、両方で試します。'},
  unique:{name:'片方だけの特殊な機能',description:'この依頼は片方の王国だけで使い、その端末固有の機能が中心。共通化するもう一方の製品は予定されていない。',answer:'separate',explanation:'この条件では、使う予定のない共通層を設けず対象端末向けに作る方が単純です。将来の事情が変われば選択も変わります。'},
  test:{name:'対応していない道具',description:'二つの王国に必要な機能だが、検討中の共通開発の道具は、一方の必須機能に対応していない。橋渡しを自作する時間も予算もない。',answer:'separate',explanation:'この条件では、必須機能を利用できる各端末向けの実装を選びます。別の共通開発の道具や、橋渡しが利用できれば結論は変わりえます。'}
};
export function mobilePlatformCreate(){return {caseId:'reuse',choice:null,seen:[],reflection:null,checked:false,overview:platformOverviewCreate()};}
export function mobilePlatformCheck(q){if(!Object.hasOwn(mobilePlatformCases,q.caseId)||!Object.hasOwn(mobilePlatformWays,q.choice))throw new RangeError('条件と作り方を選びましょう。');const item=mobilePlatformCases[q.caseId],ok=q.choice===item.answer;if(ok&&!q.seen.includes(q.caseId))q.seen.push(q.caseId);return {ok,explanation:item.explanation};}
export function mobilePlatformDone(q){return Object.keys(mobilePlatformCases).every(id=>q.seen.includes(id))&&q.reflection==='both'&&q.checked;}
export function mobilePlatformRestore(q){if(!q||!Object.hasOwn(mobilePlatformCases,q.caseId)||![null,...Object.keys(mobilePlatformWays)].includes(q.choice)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(id=>!Object.hasOwn(mobilePlatformCases,id))||![null,'both','once','none'].includes(q.reflection)||typeof q.checked!=='boolean'||q.checked&&q.reflection!=='both')throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen],overview:Object.hasOwn(q,'overview')?platformOverviewRestore(q.overview):platformOverviewCreate()};}
