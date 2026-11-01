import {createRequirementStories,restoreRequirementStories,requirementStoriesComplete} from './requirement-stories.js';
export const requirementsLevel={id:'timetable-requirements',number:'87',kind:'requirements',name:'旅人の時刻表を作る前に',tag:'要件の聞き取りと検証',title:'時刻表の約束を整えよう',story:'ギルドは旅人のための時刻表を作ります。旅人と管理人の声を聞き、必要な機能と確かめるべきことを整理しましょう。'};
export const interviews={traveler:{name:'旅人 リリ',text:'誰でもログインせずに時刻表を見たいです。キーボードだけでも操作できると助かります。'},keeper:{name:'管理人 トル',text:'行き先を選ぶと、その行き先の時刻を表示したいです。表示は「速い」ものにしてください。'},healer:{name:'薬師 セラ',text:'個人の予約は本人だけに見せてほしいです。'},clerk:{name:'受付 ユノ',text:'私は、個人の予約をすべての旅人にも見せたいと思っています。'}};
export const requirementClasses={function:'機能',quality:'品質・制約',unclear:'確認が必要'};
export const requirementItems={
  search:{text:'行き先を選ぶと、その時刻を表示する。',answer:'function',reason:'利用者に提供する振る舞いです。'},
  keyboard:{text:'キーボードだけで時刻表を操作できる。',answer:'quality',reason:'利用しやすさに関する品質・制約です。'},
  fast:{text:'表示が「速い」。',answer:'unclear',reason:'どの条件で何秒以内か決まらず、達成を確かめにくい表現です。'},
  privacy:{text:'同じ個人予約を、本人だけに見せる案と全旅人に見せる案。',answer:'unclear',reason:'閲覧範囲の希望が食い違うため、関係者と調整が必要です。'},
  open:{text:'誰でもログインせずに時刻表を閲覧できる。',answer:'function',reason:'時刻表を閲覧する際に提供する振る舞いです。'}
};
export const behaviorClasses={required:'必要',forbidden:'禁止',unspecified:'この約束だけでは未規定'};
export const behaviorItems={
  guest:{text:'ログインしていない旅人が時刻表を見る。',answer:'required',reason:'ログインなしで誰でも閲覧できることが約束されています。'},
  locked:{text:'時刻表を見る全員にログインを要求する。',answer:'forbidden',reason:'ログインなしでの閲覧を妨げるため、約束に反します。'},
  weather:{text:'時刻表の横に天気の飾りを表示する。',answer:'unspecified',reason:'提示した約束は天気の飾りについて決めていません。'}
};
export function createRequirements(){return {stories:createRequirementStories(),observed:[],requirements:Object.fromEntries(Object.keys(requirementItems).map(id=>[id,''])),behaviors:Object.fromEntries(Object.keys(behaviorItems).map(id=>[id,''])),checked:false};}
export function requirementsComplete(state){return state.observed.length===Object.keys(interviews).length&&state.checked&&Object.entries(requirementItems).every(([id,item])=>state.requirements[id]===item.answer)&&Object.entries(behaviorItems).every(([id,item])=>state.behaviors[id]===item.answer)&&requirementStoriesComplete(state.stories);}
export function restoreRequirements(saved){
  if(!saved||!Array.isArray(saved.observed)||new Set(saved.observed).size!==saved.observed.length||saved.observed.some(id=>!Object.hasOwn(interviews,id))||!saved.requirements||!saved.behaviors||typeof saved.checked!=='boolean'||(saved.checked&&saved.observed.length!==Object.keys(interviews).length))throw new RangeError('途中記録が不正です。');
  const result=createRequirements();result.stories=restoreRequirementStories(saved.stories);result.observed=saved.observed.slice();result.checked=saved.checked;
  for(const [key,options] of [['requirements',requirementClasses],['behaviors',behaviorClasses]])for(const id of Object.keys(result[key])){const answer=saved[key][id];if(answer!==''&&!Object.hasOwn(options,answer))throw new RangeError('途中記録が不正です。');result[key][id]=answer;}
  return result;
}
