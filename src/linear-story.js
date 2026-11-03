export const linearStoryLevel={id:'ruin-linear-story',number:'1202',kind:'linear-story',name:'救援の荷を数える',tag:'文章題と連立方程式',title:'物資の報告を式にしよう',story:'遺跡に向かう救援隊は２種類の袋を受け取ります。袋の数を知らせる２つの報告を整理し、それぞれ何袋か確かめましょう。'};
export const linearStoryCases={
 bridge:{name:'橋の補修',story:'青い袋１つには木材が２束と縄が１巻。赤い袋１つには木材が１束と縄が２巻。届いた合計は木材８束と縄７巻です。',rows:[[2,1,8],[1,2,7]],units:['木材','縄']},
 shelter:{name:'避難所の準備',story:'青い袋１つには毛布が３枚と灯油が１瓶。赤い袋１つには毛布が１枚と灯油が２瓶。届いた合計は毛布６枚と灯油７瓶です。',rows:[[3,1,6],[1,2,7]],units:['毛布','灯油']}
};
export function linearStoryCreate(){return {selected:'bridge',trials:Object.fromEntries(Object.keys(linearStoryCases).map(k=>[k,{coeff:[0,0,0,0],x:0,y:0,checked:false}]))};}
export function linearStoryResult(id,t){const c=linearStoryCases[id];if(!c)throw new RangeError('依頼が不正です。');const correct=c.rows.every((r,i)=>t.coeff[i*2]===r[0]&&t.coeff[i*2+1]===r[1]);const actual=c.rows.map(r=>r[0]*t.x+r[1]*t.y);return {correct,actual,solved:correct&&actual.every((v,i)=>v===c.rows[i][2])};}
export function linearStoryDone(q){return Object.keys(linearStoryCases).every(id=>q.trials[id].checked&&linearStoryResult(id,q.trials[id]).solved);}
export function linearStoryRestore(q){if(!q||!Object.hasOwn(linearStoryCases,q.selected)||!q.trials)throw new RangeError('記録が不正です。');const out=linearStoryCreate();out.selected=q.selected;for(const id of Object.keys(linearStoryCases)){const t=q.trials[id];if(!t||!Array.isArray(t.coeff)||t.coeff.length!==4||t.coeff.some(n=>!Number.isInteger(n)||n<0||n>3)||!Number.isInteger(t.x)||t.x<0||t.x>5||!Number.isInteger(t.y)||t.y<0||t.y>5||typeof t.checked!=='boolean')throw new RangeError('記録が不正です。');out.trials[id]={coeff:[...t.coeff],x:t.x,y:t.y,checked:t.checked};}return out;}
