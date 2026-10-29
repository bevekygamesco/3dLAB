from pathlib import Path
from zipfile import ZipFile
from PIL import Image
import io,json,os
root=Path(__file__).resolve().parent.parent;source=Path(os.environ.get('CHAIR_SOURCE_ZIP',str(root.parent/'upload/yyyyyy.zip')));dest=root/'public/assets/chair-turntable-v2';stats=[]
folders=['Nouveau dossier (5)','Nouveau dossier (4)','Nouveau dossier','Nouveau dossier (3)','Nouveau dossier (2)']
with ZipFile(source) as z:
 for f,folder in enumerate(folders):
  names=sorted(n for n in z.namelist() if str(Path(n).parent)=='yyyyyy/'+folder and not n.endswith('/'))
  assert len(names)==60
  for i,n in enumerate(names):
   out=dest/str(f)/f'{i:04d}.webp';small=dest/'mobile'/str(f)/out.name
   im=Image.open(io.BytesIO(z.read(n))).convert('RGBA');im.thumbnail((1600,1440),Image.Resampling.LANCZOS)
   # Fit without stretching into the viewer's existing 5:4 canvas.
   im.thumbnail((1600,1280),Image.Resampling.LANCZOS);canvas=Image.new('RGBA',(1600,1280));canvas.alpha_composite(im,((1600-im.width)//2,(1280-im.height)//2))
   out.parent.mkdir(parents=True,exist_ok=True);small.parent.mkdir(parents=True,exist_ok=True)
   canvas.save(out,quality=94,method=4);canvas.resize((800,640),Image.Resampling.LANCZOS).save(small,quality=91,method=4)
  print('FINISH_COMPLETE',f,flush=True)
print('OPTIMIZED_BYTES',sum(p.stat().st_size for p in dest.rglob('*.webp')),flush=True)
