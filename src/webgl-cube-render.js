// Each cube face has its own vertices so that its color stays constant.
export const cubeFaces=[
 {positions:[-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1],color:[1,.45,.12]},
 {positions:[1,-1,-1, 1,-1,1, 1,1,1, 1,1,-1],color:[.25,.8,.55]},
 {positions:[-1,1,-1, 1,1,-1, 1,1,1, -1,1,1],color:[1,.85,.25]},
 {positions:[-1,-1,1, -1,-1,-1, -1,1,-1, -1,1,1],color:[.7,.4,.85]},
 {positions:[-1,-1,1, 1,-1,1, 1,-1,-1, -1,-1,-1],color:[.7,.65,.4]},
 {positions:[-1,-1,1, 1,-1,1, 1,1,1, -1,1,1],color:[.18,.4,.95]},
];
export const cubePositions=new Float32Array(cubeFaces.flatMap(face=>face.positions));
export const cubeColors=new Float32Array(cubeFaces.flatMap(face=>Array.from({length:4},()=>face.color).flat()));
export const cubeIndices=new Uint16Array(cubeFaces.flatMap((_,i)=>{const n=i*4;return [n,n+1,n+2,n,n+2,n+3];}));

const vertexSource=`attribute vec3 position; attribute vec3 color; uniform float angle; varying vec3 vColor;
void main(){float c=cos(angle),s=sin(angle);vec3 p=vec3(c*position.x+s*position.z,position.y,-s*position.x+c*position.z);
vec3 t=vec3(p.x,0.88*p.y-0.48*p.z,0.48*p.y+0.88*p.z);gl_Position=vec4(t.x*0.4125,t.y*0.55,t.z*0.4,1.0);vColor=color;}`;
const fragmentSource=`precision mediump float; varying vec3 vColor; void main(){gl_FragColor=vec4(vColor,1.0);}`;
const resources=new WeakMap();
function shader(gl,type,source){const result=gl.createShader(type);if(!result)throw new Error('シェーダーを作成できません。');gl.shaderSource(result,source);gl.compileShader(result);if(!gl.getShaderParameter(result,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(result);gl.deleteShader(result);throw new Error(`シェーダーの準備に失敗しました: ${error}`);}return result;}
function initialize(gl){
 const vs=shader(gl,gl.VERTEX_SHADER,vertexSource),fs=shader(gl,gl.FRAGMENT_SHADER,fragmentSource),program=gl.createProgram();if(!program)throw new Error('プログラムを作成できません。');gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('シェーダーを接続できません。');
 const buffer=(target,data)=>{const b=gl.createBuffer();if(!b)throw new Error('描画用の記録を作成できません。');gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b;};
 return {program,position:gl.getAttribLocation(program,'position'),color:gl.getAttribLocation(program,'color'),angle:gl.getUniformLocation(program,'angle'),positions:buffer(gl.ARRAY_BUFFER,cubePositions),colors:buffer(gl.ARRAY_BUFFER,cubeColors),indices:buffer(gl.ELEMENT_ARRAY_BUFFER,cubeIndices)};
}
export function drawWebglCube(canvas,{shape,angle,depth}){
 if(!['face','solid'].includes(shape)||![0,45].includes(angle)||typeof depth!=='boolean')throw new RangeError('描画条件が不正です。');
 try{
  const gl=canvas.getContext('webgl',{antialias:false,preserveDrawingBuffer:true});if(!gl||gl.isContextLost())return {ok:false,message:'この環境では WebGL を利用できません。'};
  let r=resources.get(gl);if(!r){r=initialize(gl);resources.set(gl,r);}
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.06,.09,.14,1);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(depth)gl.enable(gl.DEPTH_TEST);else gl.disable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.disable(gl.CULL_FACE);
  gl.useProgram(r.program);gl.bindBuffer(gl.ARRAY_BUFFER,r.positions);gl.vertexAttribPointer(r.position,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(r.position);gl.bindBuffer(gl.ARRAY_BUFFER,r.colors);gl.vertexAttribPointer(r.color,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(r.color);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,r.indices);gl.uniform1f(r.angle,angle*Math.PI/180);gl.drawElements(gl.TRIANGLES,shape==='face'?6:36,gl.UNSIGNED_SHORT,0);
  if(gl.getError()!==gl.NO_ERROR)return {ok:false,message:'WebGL の描画に失敗しました。'};return {ok:true};
 }catch(error){return {ok:false,message:`描画を準備できませんでした。${error.message}`};}
}
