import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())await walk(p);else files.push(p)}}
await walk('public/assets');files.sort();const hash=createHash('sha256');for(const p of files){hash.update(p);hash.update(await readFile(p))}
await writeFile('public/asset-cache-manifest.js',`self.ASSET_CACHE_VERSION=${JSON.stringify(hash.digest('hex').slice(0,16))};\nself.ASSET_CACHE_URLS=${JSON.stringify(files.map(p=>p.slice(6)))};\n`);
