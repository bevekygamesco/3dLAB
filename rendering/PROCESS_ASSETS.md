# Process image assets

Created with the built-in image generation tool, then resized and encoded as WebP (1200×800, quality90) for the website. No fallback API or external stock imagery was used.

1. `public/assets/process-car.webp`: Premium photorealistic cinematic 3D process illustration. Sculptural pearl-silver electric sports car, three-quarter front view, full car in a warm dark architectural design studio. Fine technical wireframe overlays around the rear half, realistic metal and glass at the front. Coral rim light and ivory key light. No chairs, text, logos or watermark.
2. `public/assets/process-architecture.webp`: Premium photorealistic architectural scale model of a contemporary limestone and glass villa, warm interior, cantilevered volume, dark studio plinth and physical stone/glass/metal sample slabs. Restrained technical construction lines, charcoal background, ivory key and coral rim light. No text, logos or watermark.
3. `public/assets/process-bike.webp`: Fully assembled graphite electric urban bicycle in a dark cinematic studio, three-quarter front view, circular light arc, ivory rim lighting and subtle coral frame accent. Forest-green, scarlet-red and solar-yellow physical sample discs in the foreground. Realistic metal and rubber detail. No furniture, text, logos or watermark.

## Current three-stage automotive process

The current card sequence is `process-car-sketch.webp` → original `process-car.webp` → `process-car-finished.webp` inside the real HTML/CSS `CarProcessPreview` interface. The earlier architecture and bicycle assets remain in the source but are not used in these three cards.

Two built-in image-generation edits used the original process-car.webp as the reference:
- Sketch prompt: transform the same car, silhouette, wheels and three-quarter perspective into a precise ivory/copper automotive design drawing on a charcoal drafting background. No filled photoreal surfaces, no text, logo or UI. Output: public/assets/process-car-sketch.webp.
- Finished prompt: render the exact same silver sports car completely, keeping the perspective and studio; remove all wireframe and construction overlays, with realistic paint, wheels, glass, reflections and shadow. Leave margin for website controls, no generated UI or text. Output: public/assets/process-car-finished.webp.

Both assets are encoded as 1200×800 WebP Q90. Actual app controls and text are code, not baked into the image.
