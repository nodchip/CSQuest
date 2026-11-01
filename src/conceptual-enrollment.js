export const conceptQuestions={
  entities:{label:'管理する二つの実体の種類',choices:{both:'冒険者と依頼',onlyPerson:'冒険者だけ',onlyQuest:'依頼だけ'},correct:'both',explanation:'冒険者と依頼をそれぞれ識別して管理します。'},
  relation:{label:'二つの実体を結ぶ関係',choices:{join:'参加する',name:'冒険者の名前',time:'受付時刻'},correct:'join',explanation:'参加は、ある冒険者とある依頼の結びつきです。'},
  attribute:{label:'受付時刻を記録する場所',choices:{person:'冒険者そのもの',quest:'依頼そのもの',participation:'参加の組'},correct:'participation',explanation:'同じ冒険者でも依頼ごとに受付時刻が違うため、この約束では参加の組の属性です。'},
  maximum:{label:'両側から見た参加の上限',choices:{oneOne:'１対１',oneMany:'１対多',manyMany:'多対多'},correct:'manyMany',explanation:'一人が複数の依頼に参加でき、一つの依頼に複数人が参加できます。'},
  minimum:{label:'参加しない冒険者や参加者のいない依頼',choices:{allowed:'どちらも許す',personRequired:'全冒険者の参加が必須',bothRequired:'双方とも必ず参加が必要'},correct:'allowed',explanation:'この約束では双方とも０件を許します。多対多という上限だけでは参加必須とは決まりません。'}
};
export function createConceptEnrollment(){return {answers:Object.fromEntries(Object.keys(conceptQuestions).map(k=>[k,null])),checked:false};}
export function conceptEnrollmentComplete(s){return s.checked&&Object.entries(conceptQuestions).every(([id,q])=>s.answers[id]===q.correct);}
export function restoreConceptEnrollment(saved){if(!saved||!saved.answers||typeof saved.checked!=='boolean')throw new RangeError('概念図の記録が不正です。');const s=createConceptEnrollment();for(const [id,q] of Object.entries(conceptQuestions)){const a=saved.answers[id];if(a!==null&&!Object.hasOwn(q.choices,a))throw new RangeError('選択が不正です。');s.answers[id]=a;}s.checked=saved.checked;return s;}
