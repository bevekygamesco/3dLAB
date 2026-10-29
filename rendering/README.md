# Cinematic chair · WebP scroll pipeline

The original `chair.blend` is preserved unchanged, with packed textures.

Run with Blender 4.3.2:

```sh
blender -b -t 8 --python rendering/render_chair_frames.py
python3 rendering/encode_frames.py ../render-work/cinematic-frames
```

The encoder requires Pillow. `CHAIR_RENDER_OUTPUT` changes the PNG directory; `CHAIR_RENDER_THREADS` changes the CPU thread count. For a new model or animation, use an empty render/output directory to avoid reusing earlier frames.

144 transparent frames at 1080×864 tell a three-act story:

- Low-angle reveal, moving softbox and strong camera push-in.
- Crane up and pull back as the headrest, seat, upholstery and walnut shells separate in staggered layers.
- Reassemble in sequence, sweep around the structure, then dolly into a final hero view.

Camera radius varies from 3.95 to 5.65 m, height from 1.05 to 2.65 m, with coordinated lens and camera-roll changes. Original geometry/materials are retained; only temporary object transforms and render lighting are animated.

Encoded assets go to `public/assets/chair-cinematic/` and `mobile/` (640×512). The frontend uses Canvas 2D and scroll-scrubbed WebP images, with a small decoded-frame cache. It does not use Three.js or WebGL.
