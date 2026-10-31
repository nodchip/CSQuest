export const bezierLevel={id:'ruin-bezier',number:'142',kind:'bezier',name:'曲がる光の橋',tag:'ベジェ曲線と補間',title:'光の橋を紋章へ導く',story:'二つの岸を結ぶ光の橋を調整します。制御点を動かし、橋の途中が指定された紋章を通るようにしましょう。'};
export const bezierCases={straight:{name:'低い紋章',target:0},middle:{name:'中の紋章',target:1},high:{name:'高い紋章',target:2}};
export const bezierHeights=[0,1,2,3,4];
export const bezierParameters=[0,0.25,0.5,0.75,1];
export function bezierAt(height,t){if(!bezierHeights.includes(height)||!bezierParameters.includes(t))throw new RangeError('入力が不正です。');const weights=[(1-t)**2,2*t*(1-t),t**2],points=[[0,0],[2,height],[4,0]],point=[0,1].map(i=>points.reduce((sum,p,j)=>sum+weights[j]*p[i],0));return {weights,point};}
export function bezierGeometry(height){if(!bezierHeights.includes(height))throw new RangeError('制御点が不正です。');return {p0:{x:0,y:0},p1:{x:2,y:height},p2:{x:4,y:0},q0:{x:1,y:height/2},q1:{x:3,y:height/2},middle:{x:2,y:height/2}};}
export function bezierCorrect(id,c){return c.checked&&c.height!==null&&bezierGeometry(c.height).middle.y===bezierCases[id].target;}
export function createBezier(){return {selected:'straight',parameter:0.5,choices:Object.fromEntries(Object.keys(bezierCases).map(id=>[id,{height:null,checked:false}]))};}
export function restoreBezier(s){if(!s||!Object.hasOwn(bezierCases,s.selected)||!s.choices||!(s.parameter===undefined||bezierParameters.includes(s.parameter)))throw new RangeError('途中記録が不正です。');const r=createBezier();r.selected=s.selected;r.parameter=s.parameter??0.5;for(const id of Object.keys(bezierCases)){const c=s.choices[id];if(!c||!(c.height===null||bezierHeights.includes(c.height))||typeof c.checked!=='boolean')throw new RangeError('制御点が不正です。');r.choices[id]={height:c.height,checked:c.checked};}return r;}
export function bezierComplete(s){return Object.keys(bezierCases).every(id=>bezierCorrect(id,s.choices[id]));}
