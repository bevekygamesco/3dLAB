"""Pack eight turntable views per WebP. Originals remain untouched."""
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import json
root=Path(__file__).resolve().parent.parent;dest=root/'public/assets/chair-atlas';source=root/'public/assets/chair-turntable-v2'
def encode(job):
 mobile,f,c=job;w,h=(640,512) if mobile else (960,768);p=dest/('mobile' if mobile else 'desktop')/str(f)/f'{c}.webp';p.parent.mkdir(parents=True,exist_ok=True)
 atlas=Image.new('RGBA',(w*4,h*2))
 for local in range(8):
  i=c*8+local
  if i>=60:break
  src=source/('mobile' if mobile else '')/str(f)/f'{i:04d}.webp'
  im=Image.open(src).convert('RGBA').resize((w,h),Image.Resampling.LANCZOS);atlas.paste(im,((local%4)*w,(local//4)*h))
 tmp=p.with_suffix('.tmp');atlas.save(tmp,format='WEBP',quality=86,method=4);tmp.replace(p);return {'path':str(p.relative_to(root/'public')),'bytes':p.stat().st_size,'frames':min(8,60-c*8)}
jobs=[(m,f,c) for m in [False,True] for f in range(5) for c in range(8)]
with ThreadPoolExecutor(max_workers=2) as pool:
 results=[]
 for n,r in enumerate(pool.map(encode,jobs),1):
  results.append(r)
  if n%10==0:print('ATLAS',n,'/80',flush=True)
(dest/'manifest.json').write_text(json.dumps({'frames':60,'per_sheet':8,'desktop_tile':[960,768],'mobile_tile':[640,512],'quality':86,'sheets':results},indent=2))
for mode in ['desktop','mobile']:
 files=[r for r in results if f'/{mode}/' in r['path']];print(mode,{'total_bytes':sum(r['bytes'] for r in files),'average_KB_per_view':round(sum(r['bytes'] for r in files)/300/1000,1),'largest_sheet_KB':round(max(r['bytes'] for r in files)/1000)},flush=True)
