import bpy,math,os,json
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion
from bpy_extras.object_utils import world_to_camera_view
root=Path(__file__).resolve().parent.parent;out=root.parent/'bicycle-color-renders';out.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(root/'rendering/ebike.blend'))
s=bpy.context.scene;s.frame_set(1)
for o in s.objects:
 if o.name.startswith('GROUND') or o.name.startswith('REFERENCE'):o.hide_render=True
objects=[o for o in s.objects if o.type in {'MESH','CURVE'} and not o.hide_render]
def depth(o):return 0 if not o.parent else 1+depth(o.parent)
objects.sort(key=depth);original={o.name:o.matrix_world.copy() for o in objects}
def group(o):
 names=[o.name];p=o.parent
 while p:names.append(p.name);p=p.parent
 if any(n.startswith('FRONT WHEEL') for n in names):return 'front'
 if any(n.startswith('REAR WHEEL') for n in names):return 'rear'
 n=o.name
 if n.startswith('Battery'):return 'battery'
 if n.startswith(('Handlebar','Stem','Grip','Display','Bell','Shifter')):return 'cockpit'
 if n.startswith(('Saddle','Seatpost')):return 'seat'
 return 'fixed'
groups={o.name:group(o) for o in objects};vectors={'front':Vector((.36,0,.08)),'rear':Vector((-.36,0,.08)),'battery':Vector((0,-.22,.16)),'cockpit':Vector((0,0,.16)),'seat':Vector((0,0,.14)),'fixed':Vector((0,0,0))}
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.045;s.cycles.seed=27;s.cycles.use_animated_seed=False;s.render.use_persistent_data=True;s.render.threads_mode='FIXED';s.render.threads=8
s.render.resolution_x=1100;s.render.resolution_y=800;s.render.resolution_percentage=100;s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
cam=s.camera;cam.animation_data_clear()
for con in list(cam.constraints):cam.constraints.remove(con)
cam.data.dof.use_dof=False
for label,position,energy in [('Cinematic key',(1,-3,3.8),650),('Cinematic fill',(-2,2,2.8),500)]:
 light=bpy.data.lights.new(label,'AREA');light.energy=energy;light.shape='DISK';light.size=3
 obj=bpy.data.objects.new(label,light);s.collection.objects.link(obj);obj.location=Vector(position);obj.rotation_euler=(Vector((0,0,.65))-obj.location).to_track_quat('-Z','Y').to_euler()

keys=[(0,-58,5.0,1.5,.67,55,-2),(1/3,-95,4.5,1.25,.66,52,0),(2/3,-130,4.8,1.75,.67,53,2),(1,-60,4.8,1.5,.67,54,0)]
def smooth(a,b,x):
 t=max(0,min(1,(x-a)/(b-a)));return t*t*(3-2*t)
def shot(p):
 k=next((i for i in range(len(keys)-1) if p<=keys[i+1][0]),len(keys)-2);a,b=keys[k:k+2];t=smooth(a[0],b[0],p);return [a[i]+(b[i]-a[i])*t for i in range(1,7)]
mat=bpy.data.materials.get('Graphite | satin metallic powder coat');node=next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None) if mat and mat.use_nodes else None
base=tuple(node.inputs['Base Color'].default_value) if node else (0.04,.04,.04,1)
validation=[]
for i in range(120):
 p=i/119;spread=0
 for o in objects:o.matrix_world=Matrix.Translation(vectors[groups[o.name]]*spread)@original[o.name]
 az,r,z,aim,lens,roll=shot(p);az=math.radians(az);cam.location=Vector((r*.88*math.cos(az),r*.88*math.sin(az),z));cam.rotation_mode='QUATERNION';cam.rotation_quaternion=(Vector((0,0,aim))-cam.location).to_track_quat('-Z','Y')@Quaternion((0,0,1),math.radians(roll));cam.data.lens=lens
 colors=[(.025,.032,.035,1),(.035,.24,.09,1),(.55,.025,.035,1),(.85,.5,.02,1)]
 segment=min(2,int(p*3));t=smooth(segment/3,(segment+1)/3,p)
 color=tuple(colors[segment][j]*(1-t)+colors[segment+1][j]*t for j in range(4))
 if node:node.inputs['Base Color'].default_value=color
 accent=bpy.data.materials.get('Coral | painted accent')
 if accent and accent.use_nodes:
  for n in accent.node_tree.nodes:
   if n.type=='BSDF_PRINCIPLED':n.inputs['Base Color'].default_value=color
 bpy.context.view_layer.update()
 points=[world_to_camera_view(s,cam,o.matrix_world@Vector(c)) for o in objects for c in o.bound_box];bounds=[min(v.x for v in points),min(v.y for v in points),max(v.x for v in points),max(v.y for v in points)];validation.append(bounds)
 if os.environ.get('VALIDATE'):continue
 if os.environ.get('TEST') and i not in [0,59,119]:continue
 path=out/f'{i:04d}.png'
 if path.exists():continue
 s.render.filepath=str(path);print('BIKE_FRAME',i+1,flush=True);bpy.ops.render.render(write_still=True)
print('BOUNDS',json.dumps([min(v[0] for v in validation),min(v[1] for v in validation),max(v[2] for v in validation),max(v[3] for v in validation)]),flush=True)
