/** Renders the step path and the current page, and handles step navigation. */

import { STEPS } from "./data.js";
import { setupDownloadButton } from "./export.js";
import { saveState, state, ui } from "./state.js";
import { STEP_ICONS } from "./svg.js";
import { isTimerRunning, setTimerForStep } from "./timer.js";
import { VIEWS } from "./views/index.js";

let pathElement = null;
let pageElement = null;

export function initRender() {
  pathElement = document.getElementById("path");
  pageElement = document.getElementById("page");
}

export const getPageElement = () => pageElement;

function renderPath() {
  pathElement.innerHTML = STEPS.map((step, i) => {
    const isCurrent = i === state.step;
    const mark = STEP_ICONS[step.key] ?? step.num;
    return `<button type="button" class="wp${isCurrent ? " cur" : ""}" data-act="go" data-step="${i}"${isCurrent ? ` aria-current="step"` : ""}>` +
      `<span class="m">${mark}</span><span class="l">${step.short}</span></button>`;
  }).join("");

  pathElement.querySelector(".cur")?.scrollIntoView?.({ block: "nearest", inline: "center" });
}

function stepHeader(step) {
  return `<div class="head">` +
    (step.num ? `<span class="num">${step.num}</span>` : "") +
    `<h2>${step.title}</h2>` +
    (step.minutes ? `<span class="dur">${step.minutes} minutes</span>` : "") +
    `</div>`;
}

function stepFooter() {
  const isFirst = state.step === 0;
  const isLast = state.step === STEPS.length - 1;
  const previous = isFirst ? "<span></span>" : `<button type="button" class="btn quiet" data-act="prev">Étape précédente</button>`;
  const next = !isFirst && !isLast ? `<button type="button" class="btn" data-act="next">Étape suivante</button>` : "";
  return `<div class="foot">${previous}${next}</div>`;
}

/** Re-renders the whole UI from the state, then saves it. */
export function render() {
  renderPath();

  const step = STEPS[state.step];
  const content = VIEWS[step.key]();
  pageElement.innerHTML = step.key === "accueil" ? content : stepHeader(step) + content + stepFooter();

  if (step.key === "chronique") setupDownloadButton();
  saveState();
}

export function goToStep(index) {
  const target = Math.max(0, Math.min(STEPS.length - 1, index));
  if (target === state.step) return;

  state.step = target;
  ui.selectedMemberId = null;
  if (!isTimerRunning()) setTimerForStep(target);
  render();
  window.scrollTo(0, 0);
}
