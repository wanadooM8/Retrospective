/** Hourglass timer shown in the header. Each step sets its own planned duration. */

import { DEFAULT_TIMER_SECONDS, STEPS } from "./data.js";
import { hourglassContent } from "./svg.js";
import { formatDuration } from "./utils.js";

const timer = {
  duration: 0,      // seconds
  remaining: 0,     // seconds
  running: false,
  ended: false,
  intervalId: null,
};

let elements = null;
let audioContext = null;

export function initTimer() {
  elements = {
    root: document.getElementById("timer"),
    value: document.getElementById("timer-value"),
    glass: document.getElementById("timer-glass"),
    toggle: document.getElementById("timer-toggle"),
  };
}

function draw() {
  elements.value.textContent = formatDuration(timer.remaining);
  elements.glass.innerHTML = hourglassContent(timer.duration ? timer.remaining / timer.duration : 1);
  elements.toggle.textContent = timer.running ? "Pause" : "Lancer";
  elements.root.classList.toggle("done", timer.ended);
}

export const isTimerRunning = () => timer.running;

export function setTimerForStep(stepIndex) {
  timer.duration = STEPS[stepIndex].minutes * 60;
  timer.remaining = timer.duration;
  timer.ended = false;
  draw();
}

export function stopTimer() {
  timer.running = false;
  clearInterval(timer.intervalId);
  timer.intervalId = null;
}

function tick() {
  if (timer.remaining > 0) timer.remaining--;
  if (timer.remaining <= 0) {
    timer.remaining = 0;
    stopTimer();
    timer.ended = true;
    ringBell();
  }
  draw();
}

export function toggleTimer() {
  if (timer.running) {
    stopTimer();
  } else {
    if (timer.remaining <= 0) {
      timer.remaining = timer.duration;
      timer.ended = false;
    }
    if (timer.duration === 0) {
      timer.duration = timer.remaining = DEFAULT_TIMER_SECONDS;
    }
    timer.running = true;
    timer.intervalId = setInterval(tick, 1000);
    // Browsers only allow audio created during a user gesture: prepare it now for the final bell.
    getAudioContext();
  }
  draw();
}

export function resetTimer(stepIndex) {
  stopTimer();
  setTimerForStep(stepIndex);
}

/* ---------- Bell ---------- */

function getAudioContext() {
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    // Web Audio unavailable: the timer stays silent.
  }
  return audioContext;
}

/** Three-note chime played when time is up. */
function ringBell() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [660, 990, 1320].forEach((frequency, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.25 / (i + 1), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + 2.3);
    });
  } catch {
    // Ignore audio errors, the visual "done" state is enough.
  }
}
