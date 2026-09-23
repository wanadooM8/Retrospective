/** Entry point: wires the DOM, restores the saved session and draws the first screen. */

import { bindEvents } from "./events.js";
import { initRender, render } from "./render.js";
import { state } from "./state.js";
import { initTimer, setTimerForStep } from "./timer.js";

initTimer();
initRender();
bindEvents();

setTimerForStep(state.step);
render();
