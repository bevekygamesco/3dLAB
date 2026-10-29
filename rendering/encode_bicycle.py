from pathlib import Path
from PIL import Image
import time
root=Path(__file__).resolve().parent.parent;source=root.parent/'bicycle-renders';dest=root/'public/assets/bicycle-cinematic'
while True:
 n=0
 for i in range(120):
  p=source/f'{i:04d}.png';out=dest/p.with_suffix('.webp').name;small=dest/'mobile'/out.name
  if out.exists() and small.exists():n+=1;continue
  if not p.exists():continue
  try:
   im=Image.open(p).convert('RGBA');im.load();out.parent.mkdir(parents=True,exist_ok=True);small.parent.mkdir(parents=True,exist_ok=True)
   for target,image,q in [(out,im,93),(small,im.resize((715,520),Image.Resampling.LANCZOS),90)]:
    temp=target.with_suffix('.tmp');image.save(temp,format='WEBP',quality=q,method=4);temp.replace(target)
   n+=1
  except (OSError,SyntaxError):pass
 print('BIKE_ENCODED',n,flush=True)
 if n==120:break
 time.sleep(6)
