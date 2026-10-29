from pathlib import Path
from PIL import Image
import time
root=Path(__file__).resolve().parent.parent
while True:
 n=0
 for f in range(5):
  for i in range(60):
   p=root.parent/'turntable-png'/str(f)/f'{i:04d}.png';out=root/'public/assets/chair-turntable'/str(f)/f'{i:04d}.webp';small=root/'public/assets/chair-turntable/mobile'/str(f)/out.name
   if out.exists() and small.exists():n+=1;continue
   if not p.exists():continue
   try:
    im=Image.open(p).convert('RGBA');im.load();out.parent.mkdir(parents=True,exist_ok=True);small.parent.mkdir(parents=True,exist_ok=True);im.save(out,quality=91,method=4);im.resize((640,512),Image.Resampling.LANCZOS).save(small,quality=88,method=4);n+=1
   except OSError:pass
 print('ENCODED',n,flush=True)
 if n==300:break
 time.sleep(5)
