"""Blender 4.3.2: 144-frame cinematic shot; original source is never saved over."""
import bpy,math,os,json
from pathlib import Path
from mathutils import Matrix,Vector,Quaternion
ROOT=Path(__file__).resolve().parent.parent
OUT=Path(os.environ.get('CHAIR_RENDER_OUTPUT',str(ROOT.parent/'render-work/cinematic-frames')));OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'rendering/chair.blend'))
s=bpy.context.scene;s.frame_set(1)
for o in s.objects:
 if 'Studio floor' in o.name:o.hide_render=True
camera=s.camera;camera.animation_data_clear()
for c in list(camera.constraints):camera.constraints.remove(c)
# Remember the exact geometry transforms, including the source's connected arms.
objects=[o for o in s.objects if o.type in {'MESH','CURVE'} and not o.hide_render]
def depth(o):return 0 if not o.parent else 1+depth(o.parent)
objects.sort(key=depth);original={o.name:o.matrix_world.copy() for o in objects}
def family(o):
 n=o.name.lower()
 if 'headrest' in n:return 'head'
 if n.startswith('seat cushion'):return 'seat'
 if n.startswith('back cushion'):return 'back_pad'
 if n.startswith('back curved walnut') or 'back-shell mount' in n or 'upper-back mount' in n or 'headrest link' in n:return 'back_shell'
 if 'long armrest' in n or 'tailored piping' in n:return 'long_arms'
 if o.parent and o.parent.name in original:return family(o.parent)
 return 'fixed'
groups={o.name:family(o) for o in objects}
s.render.engine='CYCLES';s.cycles.device='CPU';s.cycles.samples=16;s.cycles.use_denoising=True;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.06
s.render.use_persistent_data=True;s.render.resolution_x=1080;s.render.resolution_y=864;s.render.resolution_percentage=100
s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.image_settings.color_depth='8'
s.render.threads_mode='FIXED';s.render.threads=int(os.environ.get('CHAIR_RENDER_THREADS','8'))
s.cycles.seed=19;s.cycles.use_animated_seed=False;camera.data.dof.use_dof=False
# A narrow traveling softbox brings out edge detail as the shot moves.
d=bpy.data.lights.new('Cinematic moving rim','AREA');d.energy=300;d.shape='RECTANGLE';d.size=1.6;d.size_y=3.0;d.color=(1.0,.75,.58)
rim=bpy.data.objects.new('Cinematic moving rim',d);s.collection.objects.link(rim)
pivot=Vector((-.161,0,.96))
# time, azimuth, distance, camera height, look height, lens, camera roll
keys=[(0,-150,5.35,1.05,.94,52,-5),(.16,-120,3.95,1.75,1.03,47,4),(.30,-80,5.35,2.65,1.05,48,-3),(.48,20,5.65,2.4,1.1,50,5),(.62,65,4.95,1.9,1.1,48,-4),(.76,160,5.4,1.5,.95,50,-4),(.88,222,3.95,1.35,.95,46,3),(1,238,4.8,1.6,.96,50,0)]
def smooth(a,b,x):
 t=max(0,min(1,(x-a)/(b-a)));return t*t*t*(t*(t*6-15)+10)
def shot(p):
 k=next((j for j in range(len(keys)-1) if p<=keys[j+1][0]),len(keys)-2)
 a,b=keys[k],keys[k+1];t=smooth(a[0],b[0],p)
 return [a[j]+(b[j]-a[j])*t for j in range(1,7)]
def spread(p,start,end,close_start,close_end):return smooth(start,end,p)*(1-smooth(close_start,close_end,p))
COUNT=144
VALIDATE_ONLY=os.environ.get('CHAIR_VALIDATE_ONLY')=='1'
validation=[]
for i in [int(v) for v in os.environ.get('CHAIR_RENDER_FRAMES',','.join(map(str,range(COUNT)))).split(',')]:
 path=OUT/f'{i:04d}.png'
 if path.exists() and not VALIDATE_ONLY:continue
 p=i/(COUNT-1)
 # Staggered, restrained material separation; mounts move with their shells.
 amounts={'head':spread(p,.25,.39,.67,.83),'seat':spread(p,.31,.43,.62,.75),'back_pad':spread(p,.28,.41,.64,.78),'back_shell':spread(p,.32,.44,.60,.74),'long_arms':spread(p,.34,.46,.58,.73),'fixed':0}
 vectors={'head':Vector((0,.08,.46)),'seat':Vector((0,-.04,.25)),'back_pad':Vector((0,-.23,.18)),'back_shell':Vector((0,.18,.09)),'long_arms':Vector((0,.06,.17)),'fixed':Vector((0,0,0))}
 for o in objects:
  group=groups[o.name];o.matrix_world=Matrix.Translation(vectors[group]*amounts[group])@original[o.name]
 az,radius,z,look,lens,roll=shot(p);az=math.radians(az)
 camera.location=Vector((pivot.x+radius*math.cos(az),radius*math.sin(az),z));target=Vector((pivot.x,0,look))
 camera.rotation_mode='QUATERNION';camera.rotation_quaternion=(target-camera.location).to_track_quat('-Z','Y')@Quaternion((0,0,1),math.radians(roll));camera.data.lens=lens
 rim.location=Vector((pivot.x+2.7*math.cos(az+2.2),2.7*math.sin(az+2.2),3.1));rim.rotation_euler=(pivot-rim.location).to_track_quat('-Z','Y').to_euler()
 # A brief darker opening resolves into the full material lighting.
 s.view_settings.exposure=-.45*(1-smooth(0,.14,p))+.05*math.sin(math.pi*p)
 if VALIDATE_ONLY:
  from bpy_extras.object_utils import world_to_camera_view
  bpy.context.view_layer.update()
  points=[world_to_camera_view(s,camera,o.matrix_world@Vector(c)) for o in objects for c in o.bound_box]
  validation.append({'frame':i,'bounds':[min(v.x for v in points),min(v.y for v in points),max(v.x for v in points),max(v.y for v in points)]})
  continue
 s.render.filepath=str(path);print(f'CINEMATIC_FRAME {i+1}/{COUNT}',flush=True);bpy.ops.render.render(write_still=True)
if VALIDATE_ONLY:
 print('CAMERA_VALIDATION',json.dumps(validation),flush=True)
else:
 print('CINEMATIC_RENDER_COMPLETE',flush=True)
