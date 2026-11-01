import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';

const out='dist';
await mkdir(out,{recursive:true});
// Keep source URLs available for visitors with the previous HTML cached.
for(const path of ['src','docs','data','style.css','CSQUEST_GOAL.md']) await cp(path,`${out}/${path}`,{recursive:true});
const result=await build({entryPoints:['src/app.js'],bundle:true,format:'esm',platform:'browser',write:false,charset:'utf8',minify:true,keepNames:true,logLevel:'warning'});
const bundle=result.outputFiles[0].contents;
const digest=createHash('sha256').update(bundle).digest('hex').slice(0,16);
const bundleName=`app.js?v=${digest}`;
await writeFile(`${out}/app.js`,bundle);
const css=await readFile('style.css');
const cssName=`style.css?v=${createHash('sha256').update(css).digest('hex').slice(0,16)}`;
for(const name of ['index.html','sources.html']){
  let html=await readFile(name,'utf8');
  if(name==='index.html'){
    const source="import('./src/app.js')";
    if(!html.includes(source))throw new Error('The app entry point was not found in index.html');
    html=html.replace(source,`import('./${bundleName}')`);
  }
  html=html.replace('href="style.css"',`href="${cssName}"`);
  await writeFile(`${out}/${name}`,html);
}
console.log(`Built ${bundleName} (${bundle.byteLength} bytes) and ${cssName}`);
