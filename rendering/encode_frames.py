"""python3 rendering/encode_frames.py /path/to/rendered/pngs"""
from pathlib import Path
from PIL import Image
import sys,json
root=Path(__file__).resolve().parent.parent
src=Path(sys.argv[1]);out=root/'public/assets/chair-cinematic';(out/'mobile').mkdir(parents=True,exist_ok=True)
for p in sorted(src.glob('*.png')):
 if (out/(p.stem+'.webp')).exists() and (out/'mobile'/(p.stem+'.webp')).exists():continue
 im=Image.open(p).convert('RGBA');im.save(out/(p.stem+'.webp'),quality=89,method=4)
 small=im.copy();small.thumbnail((640,512));small.save(out/'mobile'/(p.stem+'.webp'),quality=86,method=4)
files=list(out.glob('*.webp'));print(json.dumps({'frames':len(files),'desktop_bytes':sum(p.stat().st_size for p in files),'mobile_bytes':sum(p.stat().st_size for p in (out/'mobile').glob('*.webp'))}))
