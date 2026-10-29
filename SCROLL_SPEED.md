# Change animation speed

Edit `components/cinematic/motionSettings.ts`:

```ts
export const motionSettings = {
  chapterDurationMs: 760, // chair and bicycle: larger = slower
  materialDurationMs: 420, // fabric changes: larger = slower
  settleDurationMs: 120, // brief hold on the complete view
  queueIntentMs: 180, // ignore the initial wheel inertia tail
  wheelIntentPx: 18, // minimum accumulated wheel intent
  wheelGestureGapMs: 160, // reset accumulation after a pause
};
```

For slower cinematic movement, change `chapterDurationMs` from `760` to `1200`.
For quicker movement, try `550`. Values are milliseconds.

Each transition finishes before another starts. Repeated scrolling buffers only one next direction, replacing older requests rather than building a long queue. A short settle hold shows the finished view before the pending step. The animation never waits for exact-frame decoding and never speeds up because of spam input. There is no requirement to stop scrolling for a quiet interval before progressing.

Scrollbar dragging, resizing, Escape and opening a dialog clear pending input and cancel the motion. Wheel input is captured before its projected destination crosses a section, even when the delta is larger than the viewport. While a chapter plays, incidental native wheel drift is corrected; dragging the scrollbar explicitly cancels this protection and stays free. After changing the setting, run `npm run build` and publish the updated build.

Fractional trackpad input is consumed while a step is playing, so native scrolling cannot interrupt it. Tiny direction reversals must accumulate 18 pixels before requesting another step. Scheduled native-scroll paints are cancelled when a chapter starts.
