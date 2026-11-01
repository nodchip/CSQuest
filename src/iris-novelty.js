import {irisSetosa} from './iris-setosa.js';
import {irisPartition,irisFit,irisPredict} from './iris-learning.js';
export const irisNoveltyLevel={id:'archive-iris-novelty',number:'554',kind:'iris-novelty',name:'知らない花が届いたら',tag:'未知の種類と保留',title:'分類できない可能性を考えよう',story:'二種類のアヤメを見分ける精霊のもとへ、学習時にはなかった種類の花が届きました。'};
export const noveltyChoices=[{name:'保留しない',limit:null},{name:'距離 0.25 を超えたら保留',limit:0.25},{name:'距離 0.5 を超えたら保留',limit:0.5},{name:'距離 2 を超えたら保留',limit:2}];
export function irisNoveltyDistance(model,row){return Math.sqrt(Math.min(...model.train.map(r=>[0,1].reduce((a,i)=>a+(row[i]-r[i])**2/model.variances[i],0))));}
export function irisNoveltyResult(index){if(!Number.isInteger(index)||index<0||index>=noveltyChoices.length)throw new RangeError('境界が不正です。');const {train,test}=irisPartition(),model=irisFit(3,train),limit=noveltyChoices[index].limit;const accept=r=>limit===null||irisNoveltyDistance(model,r)<=limit;const accepted=test.filter(accept);return {knownTotal:test.length,knownAccepted:accepted.length,knownCorrect:accepted.filter(r=>irisPredict(model,r)===r[2]).length,novelTotal:irisSetosa.length,novelRejected:irisSetosa.filter(r=>!accept(r)).length};}
export function createIrisNovelty(){return {selected:0,tried:0,reflection:null,checked:false};}
export function irisNoveltyComplete(s){const r=irisNoveltyResult(s.selected);return s.tried===15&&r.knownAccepted===r.knownTotal&&r.novelRejected===r.novelTotal&&s.reflection==='limits'&&s.checked;}
export function restoreIrisNovelty(s){if(!s||!Number.isInteger(s.selected)||s.selected<0||s.selected>=4||!Number.isInteger(s.tried)||s.tried<0||s.tried>=16||![null,'limits','guarantee','known'].includes(s.reflection)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s};}
