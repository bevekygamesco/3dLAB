"""Pre-size desktop turntables to the viewer's actual 1000×800 drawing buffer.
Original 1600px renders remain untouched. Mobile already uses its native 800px frames.
"""
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
source=root/'public/assets/chair-turntable-v2'
out=root/'public/assets/chair-viewer'
original=optimized=0
for finish in range(5):
 for i in range(60):
  p=source/str(finish)/f'{i:04d}.webp';dest=out/str(finish)/p.name;dest.parent.mkdir(parents=True,exist_ok=True)
  im=Image.open(p).convert('RGBA').resize((1000,800),Image.Resampling.LANCZOS)
  temp=dest.with_suffix('.tmp');im.save(temp,format='WEBP',quality=94,method=4);temp.replace(dest)
  original+=p.stat().st_size;optimized+=dest.stat().st_size
print({'original_desktop_bytes':original,'viewer_desktop_bytes':optimized,'reduction_percent':round((1-optimized/original)*100,1)})
