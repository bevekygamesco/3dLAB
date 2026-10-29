# 3D CONFIG LAB

Next.js App Router + TypeScript + Tailwind CSS project, recreated from the supplied design.

## Run locally

Use Node.js 20.9 or newer (Node.js 22 LTS recommended).

```bash
npm ci
npm run dev
```

Open http://localhost:3000. To build for production:

```bash
npm run typecheck
npm run build
```

This project uses `output: 'export'`. Deploy the resulting `out/` folder on a static host. The ZIP also contains the ready-built `out/` folder. Serve that folder over HTTP to preview the production build; do not open its HTML directly through `file://`.

## Page composition

`app/page.tsx` contains only component imports and page composition. Every section has its own file:

- `StudioProvider.tsx`: shared state, project dialogs, image-based demos, inquiry list and project brief form.
- `CinematicLoader.tsx`: cinematic product reveal, perspective camera, orbiting material spheres, progress sequence, skip intro and reduced-motion support.
- `Header.tsx`: navigation and expanding circular menu.
- `Hero.tsx`: hero layout, four product slides, material swatches and navigation.
- `Marketplace.tsx`: three marketplace cards.
- `Projects.tsx`: category filtering, keyword search and collection layout.
- `ProjectCard.tsx`: reusable collection card.
- `ProjectCTA.tsx`: cream project call to action.
- `FAQ.tsx`: animated accordion.
- `Footer.tsx`: footer navigation and contact entry points.

Component files are in `components/`. `data/projects.ts` stores product data, categories and materials. `app/globals.css` contains Tailwind and base styles. `app/refinements.css` contains the V2 geometry corrections, motion and responsive refinements. `public/assets/` includes all local artwork, optimized WebP images, the logo and original vector shapes.

## Menu behavior

On desktop, hover the hamburger to expand the dark circular panel. Move into the panel to select Furniture, Automotive, Architecture or Fashion. The expanded menu and the red guide use the same diameter, top and right coordinates. The panel is clipped to that circle, and leaving it closes it after a short delay. The hamburger also toggles by click, touch or Enter. Escape closes it. Category links filter and scroll to the collection. Search focuses the collection search; the bag opens the inquiry list.

## Design and assets

The original logo, hero shape, FAQ shape, chair, product cutouts and material textures are used locally. All eight collection thumbnails were newly generated as individual premium CGI scenes and installed as optimized WebP files named `public/assets/thumb-*.webp`. Marketplace cards reuse the matching generated scenes. These images contain no text, labels, category tags or controls; all UI is live HTML.

The header dimensions are measured against the 1096px reference: logo begins at 5% and is 12.15vw wide; navigation begins at 28.74%; the header is 4.38vw high. The hamburger has independent measured offsets. The expanded circle shares its geometry with the red guide.

Product tiles use one closed SVG path with a proper viewBox. The furniture tile has no duplicate white arc. CTA and FAQ edges share the full page width with a straight separator; the previous cusp and negative overlap were removed.

`components/ReactiveSurfaces.tsx` implements the supplied code's reactive-surface pattern with eased pointer tilt, spotlight reflection and hover lift. The pasted markup did not contain the original effect implementation, so these behaviors are implemented here. Motion is disabled for reduced-motion and coarse-pointer devices.

Change project data in `data/projects.ts`, artwork in `public/assets/`, and V3 precision styles in `app/precision.css`.

## Interaction scope

This is a complete front-end showcase. Live previews use images, material filter effects and zoom controls; they are not production WebGL configurators and have no 3D model files. The cinematic intro uses the original chair artwork, CSS perspective camera motion, orbiting material spheres, studio lighting and a light sweep. It does not include a WebGL model.

Buy buttons add to an inquiry list; they do not process purchases. Contact buttons open a form that downloads a project brief as a text file. It does not email or upload submissions. No contact address, social account, payment provider or backend was invented. Connect your actual services before production launch. Request-more opens a custom-project brief because all eight supplied projects are already shown.

## Validation

Production export and TypeScript checks passed. Browser checks covered circular menu expansion, category filtering, keyword search, image preview material selection, inquiry list and FAQ. Desktop and a 390px mobile layout were visually inspected. No external assets or hosted font requests are required.

## V2 refinements

- Original SVG paths now define the CTA ribbon, FAQ, hero and four product tile backgrounds.
- The menu disc shares its exact geometry with the red guide. Hover opens it with staggered category items; the first pointer click no longer immediately closes a hover-opened menu.
- Hero product layers track the pointer with eased perspective motion. Product cards have gentle tilt and light reflection.
- The intro reveals the original product with camera movement, material spheres, lighting and an iris-style upward transition.
- Scroll entrances and hero entrance animations respect reduced motion.

## V3 validation

- Next.js production export and TypeScript checks passed.
- Generated thumbnails were inspected individually through a QA contact sheet.
- The menu and guide circle have identical bounding rectangles; all menu icons fit inside.
- CTA and FAQ left and right coordinates are equal; the separator is straight.
- Header alignment, desktop navigation and mobile navigation were checked in the browser.

## Thumbnail generation

Built-in image generation was used for eight distinct product-mockup prompts. Shared direction: standalone landscape photorealistic premium CGI, physically based materials, refined ray-traced lighting, soft contact shadows, full main product in view, lower space for HTML text, no words/logos/watermarks/UI/borders. Subjects: anthracite roller shutter on a modern villa; cream boucle and walnut lounge chair with ottoman; charcoal sectional garage door; cream retractable fabric awning over a villa terrace; vertical-slat sliding gate; graphite sports coupe from rear three-quarter view; ivory sneaker with floating suede and leather samples; olive/ivory/charcoal hoodies on invisible mannequins.

## V4 — cinematic scrolling

Three separate sections have been added between the original content:

- `ExperienceStory.tsx`: three sticky scroll chapters with a product camera move, orbital finishes, perspective changes and alternating copy.
- `MaterialLab.tsx`: five scroll-selected finishes, dimensional texture cards and the original product artwork under subtle lighting variations. Material cards show the actual finishes; the chair remains image-based.
- `ProcessStory.tsx`: a three-step project story with an animated stack of generated project previews.

`SceneMotion.tsx` uses one requestAnimationFrame update per scroll event for progress, scene transforms, active chapters and image parallax. Existing sections receive staggered entrances, image movement, hero-exit motion and footer movement. `ScrollProgress.tsx` shows overall page progress. `app/scroll-scenes.css` contains the new layouts, sticky behavior, responsive styles and reduced-motion fallback.

Scrolling is native and reversible. No wheel/touch input is intercepted. Chapter buttons scroll to their chapter and update accessible pressed states. On mobile the composition stacks vertically with smaller perspective moves. With reduced motion, every chapter is visible in normal document flow, and transforms and sticky sequences are removed.

The header and hero How it works controls now lead to the process section. The base brand palette, original hero geometry, generated collection thumbnails and core page sections are preserved.

### V4 verification

The three scenes were inspected at desktop size and in a 390px-wide mobile viewport. Chapter controls selected the matching content and material. Normal downward scrolling advanced the project story from step 2 to step 3; upward scrolling restored step 2. Product and text compositions were visually checked. Production export and TypeScript validation passed.


## V5 — precise navigation and live materials

- Menu icon centers and the guide share one mathematical circle. SVG hover rings animate around every category. The bag icon next to search is removed.
- Menu search opens a keyboard-accessible dialog with live matching across project names, categories and descriptions, empty states, and clickable results.
- Hero uses the clean chair cutout and four CSS gradient spheres with reactive finish controls. Swatches use five equal grid columns and consistent gaps.
- `ChairModel.tsx` recolors upholstery via a clipped SVG luminance/tint pass; walnut and aluminum remain unchanged. Used in the hero, material lab, and furniture demo. This is an image-based material simulator, not a mesh model.
- Three generated process images follow one walnut/cream lounge-chair concept: blueprint, exploded assembly, finished product. The final preview has live finish controls and opens the simulator.
- Generated with the built-in image tool. Prompt set: architectural charcoal/coral chair blueprint; matching exploded assembly CGI; matching finished walnut/bouclé chair CGI. Assets: `public/assets/process-blueprint.webp`, `process-assembly.webp`, `process-finished.webp`.


## V6 — stable material circles on every hero model

All four material circles now appear for Furniture, Architecture, Fashion, and Metalwork. They share the active finish with the material panel. Controls have stationary pointer/touch hit areas outside the parallax plane; hover animates only the decorative child. The right circles sit clear of the customization panel. Interactive controls do not drive pointer parallax.


## V7 — orbital cursor and short trail

`StudioCursor.tsx` provides a precise coral point, eased segmented orbit, seven subtle fading trail points, interactive arrow state and press feedback. It never intercepts clicks. Native cursor remains on form fields and keyboard navigation; touch and reduced-motion preferences disable the effect. One requestAnimationFrame updates only transforms/opacity, stops when settled, and cleans up on blur or unmount.


## V8 — adaptive high-contrast cursor

The precise pointer core is never scaled or repositioned on hover. Screen positioning lives on outer nodes, while appearance changes affect inner children only. A crisp lens reticle adds corner brackets, an orbiting accent, and a centered diamond hover state. Colors adapt to coral, light, and dark surfaces, with a contrasting keyline. The small trail follows the same palette. Surface detection refreshes on pointer movement and scrolling. Browser checks confirmed exact core/translation alignment, dark ink over coral controls, pale ink over dark sections, working material-circle clicks, and native text-field fallback.


## V10 — supplied Blender chair, rendered WebP scroll animation

Only the chair in “The experience, reimagined” is replaced. The existing circles, material orbs, background, chapter copy and left/right choreography are retained. The user's original Blender model is rendered with its packed fabric/wood textures and studio lights, a full camera orbit and a restrained dolly. 120 transparent desktop WebPs and matching 640 px mobile WebPs play forward or backward from the section's native scroll progress.

There is no Three.js, WebGL, or runtime 3D dependency. `ChairFrameSequence.tsx` draws the renders with Canvas 2D, preloads compressed frames near the section, and limits decoded images to 14 on desktop / 10 on mobile. It retains the last complete frame while loading and uses the same-model static poster for reduced motion.

The unmodified source `rendering/chair.blend`, render script, encoder and reproduction instructions are included. Run `npm install` and `npm run dev` for the Next.js project.

V10 validation: production build and TypeScript passed; all 240 WebPs verified (120 desktop at 960×768, 120 mobile at 640×512), transparent alpha and complete frame coverage. All 120 original renders fit within their bounds. Browser checks reached frame 59 at chapter 2 and frame 99 at chapter 3; native reverse scroll changed frame 99 → 83, and forward scroll advanced 83 → 93. Mobile chapter 3 reached frame 99 without decode errors. Original source model hash matches the uploaded .blend.


## V11 — cinematic choreography

The chair sequence is rebuilt as 144 renders at 1080×864: low-angle reveal and push-in, rising camera with staggered material separation, reassembly, orbit sweep and final dolly. The camera varies distance, height, aim, lens and roll; a traveling softbox reveals surface edges. Desktop/mobile WebP playback remains driven by the original scroll position, forward and backward. The section's circles, material spheres, background, text and layout are retained. See `rendering/README.md` to reproduce the animation.

V11 validation: production build and TypeScript passed. All 288 WebPs verified with alpha and complete coverage; all 144 camera positions fit the model. Desktop chapters reached frames 24, 71 and 119 without decode errors; native reverse scroll moved 119 → 96 and forward scroll advanced again. Mobile chapter 2 reached frame 71 with the model visible and no decode errors.


## V12 — stronger contrast, larger model, smoother scrubbing

The real chair is 12.5% larger with a modest contrast/saturation grade. Its scroll sequence uses a time-based 140ms follow and fractional blending between neighboring transparent WebP frames, including reverse playback. Weighted premultiplied alpha keeps the canvas edges clean. A longer scroll runway allows more time to see each camera move. Existing background, orbits and material spheres are unchanged; reduced motion retains the static model.

Playback settles on a single crisp frame when scrolling stops; blending is only used while the camera is moving.

V12 validation: production build/TypeScript passed. Browser checks confirmed larger framing, fractional blending while scrolling, native forward/reverse playback, desktop chapter 2 settling at frame 72 and mobile chapter 3 at frame 119 with zero blend and no decode errors.


## V13 — complete scroll-triggered chapters
One deliberate wheel, swipe or keyboard gesture plays the entire next camera move. Further scroll input is held until playback completes, the destination text reveals, and a short reading pause passes. Trackpad momentum cannot skip chapters. Exact WebP frames replace crossfades; the timeline waits for decoding before advancing. Chapter 02 warms the background; chapter 03 returns to dark. The model is larger in all chapters. Reverse playback, chapter buttons, boundary exit, Escape release and reduced-motion fallback are supported.
Validation: production build/TypeScript passed. Browser wheel input triggered 01→02; additional input during playback did not skip ahead. Chapter 02 completed at frame 72 with its text and warm background. Next gesture completed chapter 03 at frame 143 with no decode errors.

## Five-finish 360 configurator
Uploaded Rose, Cognac, Greige and Charcoal previews replace the old tints; original white is retained. Four floating spheres select these materials. The existing furniture modal now lazy-loads a Canvas 2D turntable: 60 views for each of five finishes, rendered from the unchanged supplied `rendering/configurator.blend`. Drag or use arrow keys for full-circle rotation. Finish changes retain angle; existing zoom/inquiry controls remain. Desktop frames are 1000×800 and mobile 640×512, with bounded decoded caches of 24/12 frames. No Three.js or WebGL. Reproduce with Blender 4.3.2 and `rendering/render_configurator.py`, then `python3 rendering/encode_configurator.py`.

## Fast-scroll guard, mobility concept and selected work
Large wheel deltas now detect crossing into a cinematic section. Busy playback intercepts wheel input before geometry tests and restores the pin on scrollbar jumps. Cross-section scroll jumps enter a complete chapter instead of snapping to the final phase. Frame loading no longer bypasses playback after four seconds: it waits for the actual render. Escape and chapter-boundary exit remain available.
The shared controller also drives the new electric bicycle concept section. Its generated image is a temporary visual layer with CSS perspective/zoom/light choreography, ready for a future rendered model sequence. Generated with the built-in image tool; prompt: isolated graphite electric bicycle, coral accents, realistic studio rim lighting, no logos or riders. Asset: public/assets/mobility-ebike.webp.
Selected Work uses the five user-supplied project presentations and their exact live links. Four destinations could not be retrieved by the web lookup tool; project attribution and imagery use the user's supplied material.
Validation: production build/TypeScript passed. Browser confirmed chair transition under a large scroll burst, bicycle chapter display and all five outbound destinations.

## Real projects in the original collection
RIGAT, BMN Metal, PANCO, Équipe Baie and STORE 2000 now populate the existing ProjectCard grid via collectionProjects. The original featured/standard card markup, styles, filters and search remain. Live-demo/view actions use the supplied project URLs; inquiry controls retain their existing behavior. The duplicate RealWork section/component and unused section styles are removed. Existing demo product data remains separate so the hero and furniture configurator continue working.
Validation: production build and TypeScript passed; browser confirmed all five collection titles and no separate RealWork section.

## STORE 2000 first; persistent loading cache
STORE 2000 leads the unchanged collection layout. During the intro, warmIntro registers an asset-only service worker and warms the main product images, real-project images, finishes and initial model frames. The viewport-appropriate chair cinematic sequence warms afterward (except Save Data mode); other rendered frames cache on demand. Compressed assets persist between visits, while decoded-frame limits remain unchanged. HTML, JavaScript, API responses and third-party URLs are never intercepted.
`npm run build` runs generate-asset-cache.mjs to hash public assets and generate the worker allowlist/version. Changed assets create a new version, whose activation removes only old Config Lab asset caches. Quota errors or unavailable storage fall back to normal network loading. The intro remains skippable and never waits indefinitely for caching.
Validation: production build/TypeScript passed. Isolated worker checks passed cache reuse/query normalization, document/external bypass, old-cache cleanup and blocked-storage network fallback. Browser verified project order. Local HTTP preview uses the image-loading fallback; persistent service worker registration applies on the hosted HTTPS site.

## Even category-menu spacing
Category centers now use evenly spaced vertical positions, with horizontal coordinates solved from the existing radius-88 guide circle. First/last positions, circle size, labels and hover effects are unchanged. Browser measurement confirmed equal row-center intervals (~45.63px at the checked desktop viewport); responsive percentage positioning applies the same spacing on mobile. Production build/TypeScript passed.

## Supplied high-detail chairs and real bicycle cinematic sequence
The furniture configurator now uses the five supplied 60-view image sets from yyyyyy.zip. Mapping: original white, rose, cognac, greige, charcoal. All 600 outputs verified: 1600×1280 desktop / 800×640 mobile RGBA WebPs. Combined output is 73,224,316 bytes versus 242,187,357 bytes of supplied image files (~69.8% smaller, including both responsive sizes). High-quality encoding and aspect-preserving fit retain fine surface detail; viewer bitmap decoding remains capped to viewport needs, with 24/12 decoded frames in memory. Prior public turntables are removed. Reproduce using CHAIR_SOURCE_ZIP=/path/to/yyyyyy.zip python3 rendering/optimize_uploaded_turntables.py.
The generated bicycle placeholder is replaced with 120 actual Blender renders: camera rotation and dolly, controlled wheel/battery/cockpit/saddle separation, reassembly, and graphite→blue→graphite material choreography. The background uses the identical normalized color timeline. 240 WebPs are 1100×800 desktop / 715×520 mobile, totaling 12,231,160 bytes. rendering/ebike.blend is the unchanged supplied source. Render and encode with rendering/render_bicycle.py and rendering/encode_bicycle.py. The common frame player/controller now reads each sequence's own frame count; the chair story remains 144 frames.
Validation: every frame decoded with expected size and alpha, all bicycle camera bounds checked within frame, original Blender hash matched, production build and TypeScript passed.
Browser QA confirmed the replacement greige turntable at frame 59 after finish switching. Bicycle chapter 02 reached frame 60/119 with the real separated geometry and synchronized blue material/background; forward wheel input started reassembly while holding the section pinned.

## Colour studio and larger configurator

The furniture modal now expands to 1180px with a taller responsive model stage and a fitted initial chair view. Existing drag rotation, materials, zoom and inquiry actions are preserved.

Chair and bicycle chapter transitions still complete on wheel/touch input. Native scrollbar dragging and anchor navigation cancel an in-flight transition and follow the document position without snapping back.

The bicycle section is a centered colour studio with Graphite, Forest, Scarlet and Solar chapters. All bicycle parts remain assembled. A 120-frame camera sequence rendered from the supplied ebike.blend changes the painted frame finish alongside the background. Desktop frames are 1100×800 WebP Q93, mobile frames 715×520 Q90; Cycles denoising and bounded lazy bitmap decoding preserve detail while controlling runtime memory. Reproduce with rendering/render_bicycle_colors.py and rendering/encode_bicycle_colors.py. The source blend is unchanged.

Validation: full decode of all 240 bicycle WebP assets, camera bounds checked across all frames, production build and TypeScript checks, desktop viewer and chapter navigation checks. Asset-cache manifest is regenerated by the build.

## Performance and portfolio refinement

The viewer uses WebP atlases with eight rendered angles in each file. Drawing the next angle from an already decoded sheet avoids per-angle requests and decoding during drag. Desktop tiles are 960×768; mobile tiles are 640×512, WebP Q86. Only three nearby sheets stay decoded; original high-resolution renders and Blender source remain available. The superseded chair-viewer folder has been removed. Story bitmaps are released offscreen or when a dialog opens.

Chapter motion no longer waits for exact-frame network/decode completion. One continuous wheel/trackpad gesture advances exactly one chapter, at the same 760ms duration regardless of input speed. No fast-scroll acceleration is applied. A fresh gesture is identified by a 220ms quiet interval. Native document navigation and scrollbar dragging can interrupt immediately. The materials section uses a 420ms transition. Settings and examples are in SCROLL_SPEED.md. The chair has four stops, including the requested front view at frame39, with demo copy visible throughout.

The intro is shorter, preloading is restricted to critical assets and a small nearby frame window, and the image service worker returns responses without waiting for cache writes or scanning all cache keys per frame. Render dimensions and material artwork used on the page are preserved.

Selected-work cards are slightly shorter. View Project now opens an overview and work-details modal; live links remain available inside it. Copy now covers cinematic 3D websites and configurators. The hero has five floating material circles including the original sand. Fabric controls sit in a separate space below the model, and material artwork crossfades throughout the chair views.

Three new built-in image-generation assets replace the chair process imagery: public/assets/process-car.webp, process-architecture.webp and process-bike.webp. They are encoded at 1200×800 WebP Q90 for the cards. Prompts and generation provenance are in rendering/PROCESS_ASSETS.md.

Desktop viewer asset comparison: original 55,638,738 bytes; optimized drawing-resolution frames approximately 28.1MB (49.5% less transfer). This compares the desktop turntable files, not overall website speed. The exact original source renders remain untouched. Production compilation and TypeScript pass; browser checks cover front-view chapter39, fourth chapter, material navigation and layout at desktop and 390px mobile width, 360 rotation with material changes, project-detail modal, process visuals, and native navigation cancellation. No device-wide FPS benchmark is claimed.


## Current atlas, caching and dialog update

All five material turntables use 80 WebP atlases (40 desktop, 40 mobile), 60 views per material, eight views per sheet. Desktop total: 19,582,806 bytes, about 65.3KB per rendered view; mobile total: 11,177,322 bytes, about 37.3KB per view. Each request contains a sheet of up to eight views; the largest desktop sheet is approximately 591KB. These totals compare to the prior desktop viewer set of 28,086,750 bytes (about 30% smaller) and the original 55,638,738-byte desktop renders (about 65% smaller). Originals remain available. Rebuild atlases with rendering/build_viewer_atlases.py.

The intro warms the initial viewer sheets and visible assets. A two-request background queue then caches the remaining material sheets; a small initial chair/bicycle frame window is also cached. Service-worker cache writes run separately from the visual response, and warming waits for persistence. Save-data connections limit atlas warming to the original material.

All modal types now use a viewport fitting frame. ResizeObserver measures natural content and scales it to the available viewport, including keyboard/visual-viewport resize. Furniture, case studies, search results, contact forms and shortlist dialogs have no internal scrolling region.

The process cards now consistently show the same car as a drawing, a partial model/render, and a fully rendered car in a working HTML/CSS configurator preview.

Validation: production build and TypeScript, full decode of all 80 atlas files, drag to frame39 followed by material change at the same angle, fast five-page wheel gesture advancing one chapter, and furniture/project/contact dialogs fitting a 390×600 viewport with no internal overflow. No universal FPS or zero-network-latency guarantee is implied.

## Current material, click-menu and input update

All upholstery circles share six newly generated material textures, including the original white/sand. Desktop/mobile hero spheres, material controls, configurator popup swatches, intro spheres, chair-story orbs and painted bicycle/car swatches use the new texture set. Small circular controls use 128px WebP files (32,466 bytes combined); material cards use 512px files. Textures are included in the versioned cache and critical preload list. Generation details and paths are in rendering/MATERIAL_TEXTURES.md. Original rendered models are unchanged.

The hamburger is drawn with two CSS spans. It opens only on click, morphs into an X and closes on another click, Escape or an outside click. Hover and pointer-leave handlers no longer open or close it. Existing arc geometry and equal category spacing remain.

The chair and bicycle controller no longer relies on a quiet period between gestures. Each animation finishes at the configured speed; repeated input stores only one pending direction. The finished view is held for 120ms, then that one pending step can run. Initial wheel inertia is ignored for 180ms. There is no unbounded input queue, decode-dependent lock or spam acceleration. Native scrollbar navigation, resize, Escape and dialog opening cancel both the animation and pending step. This behavior supersedes the older quiet-gesture description above; current settings are in SCROLL_SPEED.md.

Current validation: production build and TypeScript pass; all 12 generated WebP assets fully decoded with expected dimensions. Browser checks confirm pointer-over leaves the menu closed, click toggles open/close and the two spans form an X, desktop/mobile close-target placement, completed chair motion followed by the single pending step, matching bicycle behavior, and native navigation clearing the buffer. Mobile menu inspected at 390px width.
