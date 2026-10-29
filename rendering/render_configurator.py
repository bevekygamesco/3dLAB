import bpy,os,math
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parent.parent
bpy.ops.wm.open_mainfile(filepath=str(root/'rendering/configurator.blend'))
s=bpy.context.scene;c=bpy.data.objects['CONFIGURATOR | Fabric 1-5 + Rotation']
for o in s.objects:
 if 'Studio floor' in o.name:o.hide_render=True
s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True;s.render.use_persistent_data=True;s.render.resolution_x=1000;s.render.resolution_y=800;s.render.resolution_percentage=100;s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.threads_mode='FIXED';s.render.threads=8;s.cycles.seed=19
cam=s.camera;cam.animation_data_clear()
for con in list(cam.constraints):cam.constraints.remove(con)
cam.data.dof.use_dof=False;cam.location=Vector((-3.5,-4.5,2.4));cam.rotation_euler=(Vector((-.16,0,.94))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=52
for f,mat in enumerate([5,4,1,3,2]):
 c['Fabric']=mat
 for i in range(60):
  p=root.parent/'turntable-png'/str(f)/f'{i:04d}.png';p.parent.mkdir(parents=True,exist_ok=True)
  if p.exists():continue
  c['Rotation degrees']=i*6;c.update_tag();s.frame_set(1);bpy.context.view_layer.update();s.render.filepath=str(p);bpy.ops.render.render(write_still=True);print('DONE',f,i,flush=True)
