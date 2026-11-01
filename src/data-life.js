import {createAnalysisCycle,restoreAnalysisCycle,analysisCycleComplete} from './analysis-cycle.js';
export const lifecycleLevel={id:'village-data-life',number:'122',kind:'datalife',name:'村の配達記録',tag:'データのライフサイクル',title:'配達の記録を扱おう',story:'薬師の村は１日の配達数をまとめ、必要な期間だけ保管したいそうです。記録を作って確かめ、後で読み返し、役目が終わったら処理しましょう。'};
export const lifeSteps=[
 {stage:'作成',question:'配達の記録を作ります。目的に必要な情報として何を記録しますか？',choices:{counts:'北村２件・南村３件という件数',names:'全員の名前と病歴',none:'何も記録しない'},correct:'counts',wrong:'今回の目的は村別の配達件数です。病歴などは必要ありません。'},
 {stage:'処理',question:'２つの村の配達数を合わせます。合計は何件ですか？',choices:{four:'４件',five:'５件',six:'６件'},correct:'five',wrong:'北村２件と南村３件を合わせましょう。'},
 {stage:'確認・報告',question:'集計結果を確認し、ギルドへ渡す報告はどれですか？',choices:{report:'配達は合計５件という報告',wrong:'配達は合計６件という報告',identities:'受取人の病歴の一覧'},correct:'report',wrong:'集計と一致し、目的に必要な範囲の報告を選びます。'},
 {stage:'保管・検索',question:'後日確認するため、定められた期間中はどうしますか？',choices:{keep:'報告を読めるように保管する',discard:'ただちに報告を消す',publish:'報告を誰でも変更できるようにする'},correct:'keep',wrong:'後で確認する必要があるため、その期間中は適切に保管します。'},
 {stage:'保管・検索',question:'保管した報告を確認します。何を読み出しますか？',choices:{retrieve:'保管した合計５件の報告',invent:'新しく作った６件の報告',private:'記録しなかった病歴'},correct:'retrieve',wrong:'以前に保存した報告を探して読み出します。'},
 {stage:'廃棄',question:'保管期間が終わり、継続保管や法的な保存義務もないと確認しました。記録と報告をどうしますか？',choices:{destroy:'両方を削除する',forever:'目的がなくても永久に保存する',leak:'村の人々に無断で配る'},correct:'destroy',wrong:'この例では両方とも保管の必要がなくなっています。削除を選びましょう。'}
];
export function createLife(){return {actions:[],feedback:'',analysis:createAnalysisCycle()};}
export function restoreLife(saved){const actions=Array.isArray(saved)?saved:saved?.actions;if(!Array.isArray(actions)||actions.length>lifeSteps.length||actions.some((action,i)=>action!==lifeSteps[i].correct))throw new RangeError('途中記録が不正です。');return {actions:actions.slice(),feedback:'',analysis:saved?.analysis===undefined?createAnalysisCycle():restoreAnalysisCycle(saved.analysis)};}
export function chooseLife(state,choice){const i=state.actions.length,step=lifeSteps[i];if(!step||!Object.hasOwn(step.choices,choice))throw new RangeError('操作が不正です。');if(choice!==step.correct)return {...state,actions:state.actions.slice(),feedback:step.wrong};return {...state,actions:[...state.actions,choice],feedback:''};}
export function lifeSnapshot(state){const n=state.actions.length;return {records:n>=1&&n<6?[{village:'北村',count:2},{village:'南村',count:3}]:[],total:n>=2&&n<6?5:null,report:n>=3&&n<6?'配達は合計５件':null,stored:n>=4&&n<6,retrieved:n>=5,deleted:n===6};}
export function lifeStagesComplete(state){return state.actions.length===lifeSteps.length;}
export function lifeComplete(state){return lifeStagesComplete(state)&&analysisCycleComplete(state.analysis);}
