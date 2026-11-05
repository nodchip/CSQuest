import {visualStudyCreate,visualStudyRestore} from './visual-study-plan.js';
export const usabilityLevel={id:'sign-study',number:'60',kind:'usability',name:'案内板を試す旅人たち',tag:'利用者による評価',title:'四人の声を聞こう',story:'ギルドの案内板を二つ試作しました。旅人たちの試用記録を調べ、次の改善につなげましょう。'};
export const studyVisitors={
  kira:{name:'キラ',order:'Ａ → Ｂ',a:20,b:12,note:'Ｂでは行き先をすぐ見つけました。'},
  bast:{name:'バスト',order:'Ｂ → Ａ',a:24,b:14,note:'Ｂでは表示が分かりやすかったそうです。'},
  nono:{name:'ノノ',order:'Ａ → Ｂ',a:22,b:13,note:'Ａでは行き先を探して少し迷いました。'},
  rei:{name:'レイ',order:'Ｂ → Ａ',a:24,b:40,note:'キーボードを使い、Ｂでは選択位置を見失って操作をやり直しました。'}
};
export const studyQuestions={average:{name:'４人の平均時間',options:{a:'Ａが短い',b:'Ｂが短い',same:'同じ'}},purpose:{name:'今回の評価の使い方',options:{formative:'改善点を探す形成的評価',summative:'完成品の最終評価だけ'}},conclusion:{name:'記録から言えること',options:{limited:'４人ではＢの平均が短いが、レイの操作を調べ改善する',all:'Ｂはすべての人にとって使いやすいと証明できた',universal:'Ｂはどんな状況でも必ず速いと証明できた'}}};
export const studyAnswers={average:'b',purpose:'formative',conclusion:'limited'};
export function studyAverage(design){if(!['a','b'].includes(design))throw new RangeError('未知の案内板です。');const values=Object.values(studyVisitors);return values.reduce((sum,item)=>sum+item[design],0)/values.length;}
export function createStudy(){return {visualPlan:visualStudyCreate(),observed:[],answers:{average:'',purpose:'',conclusion:''},checked:false};}
export function studyComplete(s){return s.observed.length===Object.keys(studyVisitors).length&&s.checked&&Object.keys(studyAnswers).every(id=>s.answers[id]===studyAnswers[id]);}
export function restoreStudy(saved){
  if(!saved||!Array.isArray(saved.observed)||new Set(saved.observed).size!==saved.observed.length||saved.observed.some(id=>typeof id!=='string'||!Object.hasOwn(studyVisitors,id))||!saved.answers||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
  const s=createStudy();s.visualPlan=saved.visualPlan===undefined?visualStudyCreate():visualStudyRestore(saved.visualPlan);s.observed=saved.observed.slice();for(const [id,q] of Object.entries(studyQuestions)){const value=saved.answers[id];if(value!==''&&!Object.hasOwn(q.options,value))throw new RangeError('途中記録が不正です。');s.answers[id]=value;}if(saved.checked&&s.observed.length!==Object.keys(studyVisitors).length)throw new RangeError('途中記録が不正です。');s.checked=saved.checked;return s;
}
