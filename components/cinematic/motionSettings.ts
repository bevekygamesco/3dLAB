/** Duration in milliseconds. Larger duration values play more slowly. */
export const motionSettings = {
  chapterDurationMs: 760,
  materialDurationMs: 420,
  /** Show the completed view briefly before playing the one buffered step. */
  settleDurationMs: 120,
  /** Ignore the first inertia tail; later repeated input buffers just one step. */
  queueIntentMs: 180,
  /** Accumulate tiny trackpad deltas; reject incidental direction reversals. */
  wheelIntentPx: 18,
  wheelGestureGapMs: 160,
};
