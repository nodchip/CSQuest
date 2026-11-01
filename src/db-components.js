export const dbComponents={analysis:'問い合わせの解析',planner:'計画・最適化',executor:'問い合わせの実行',buffer:'バッファ管理',storage:'保存領域の管理',transaction:'取引管理'};
export const componentTasks={
 analysis:'問い合わせの形式を読み、名前が使えるか確かめる。',
 planner:'候補となる実行方法を比較して計画を選ぶ。',
 executor:'選ばれた計画に従い、行の条件を調べて結果を作る。',
 buffer:'必要なページをメモリ上の領域に保持し、再利用する。',
 storage:'ページを保存領域から読み書きする。',
 transaction:'複数の変更をひとまとまりとして確定・取消しし、同時の取引を調整する。'
};
export function createComponents(){return {selected:'analysis',answers:Object.fromEntries(Object.keys(componentTasks).map(k=>[k,null])),checked:Object.fromEntries(Object.keys(componentTasks).map(k=>[k,false]))};}
export function componentCorrect(s,id){return s.checked[id]&&s.answers[id]===id;}
export function componentsComplete(s){return Object.keys(componentTasks).every(id=>componentCorrect(s,id));}
export function restoreComponents(s){if(!s||!Object.hasOwn(componentTasks,s.selected)||!s.answers||!s.checked)throw new RangeError('記録が不正です。');const n=createComponents();n.selected=s.selected;for(const id of Object.keys(componentTasks)){const a=s.answers[id],c=s.checked[id];if(!(a===null||Object.hasOwn(dbComponents,a))||typeof c!=='boolean'||(c&&a===null))throw new RangeError('記録が不正です。');n.answers[id]=a;n.checked[id]=c;}return n;}
