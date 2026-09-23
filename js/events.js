/**
 * User interactions. Every clickable element carries a `data-act` attribute
 * naming one of the ACTIONS below; a single delegated listener dispatches them.
 * Text fields with `data-bind="path.in.state"` write straight into the state.
 */

import { MAX_OATHS } from "./data.js";
import { buildChronicle } from "./chronicle.js";
import { copyChronicle, downloadChronicle } from "./export.js";
import { getPageElement, goToStep, render } from "./render.js";
import { createEmptyOath, nextUnsetMember, resetState, saveState, state, ui } from "./state.js";
import { resetTimer, setTimerForStep, stopTimer, toggleTimer } from "./timer.js";
import { setByPath, uid } from "./utils.js";

/* ---------- Actions reading a form field ---------- */

function addMember() {
  const input = document.getElementById("newMember");
  if (!input) return;
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return;
  }
  state.members.push({ id: uid(), name });
  render();
  document.getElementById("newMember")?.focus();
}

function addNote() {
  const textarea = document.getElementById("noteText");
  if (!textarea) return;
  const text = textarea.value.trim();
  if (!text) {
    textarea.focus();
    return;
  }
  state.notes.push({ id: uid(), zone: state.zone, text, coins: 0 });
  render();
  document.getElementById("noteText")?.focus();
}

function addHonour() {
  const recipient = document.getElementById("hTo");
  const reason = document.getElementById("hWhy").value.trim();
  if (!recipient.value) {
    recipient.focus();
    return;
  }
  // Prefix the reason with "pour" unless it already starts with it.
  const why = reason ? (/^pour\b/i.test(reason) ? reason : `pour ${reason}`) : "";
  state.honours.push({ to: recipient.value, why });
  render();
}

function removeMember(id) {
  state.members = state.members.filter((member) => member.id !== id);
  delete state.sworn[id];
  delete state.classes[id];
  delete state.states[id];
  delete state.verdict[id];
  render();
}

function selectZone(key) {
  state.zone = key;
  render();
}

function resetQuest() {
  const confirmed = window.confirm("Recommencer une nouvelle quête ? Toutes les informations de cette rétrospective seront effacées.");
  if (!confirmed) return;
  resetState();
  stopTimer();
  setTimerForStep(0);
  render();
}

/* ---------- Action table ---------- */

const intData = (el, name) => Number(el.dataset[name]);

/** @type {Record<string, (el: HTMLElement) => void>} */
const ACTIONS = {
  // Navigation
  go: (el) => goToStep(intData(el, "step")),
  next: () => goToStep(state.step + 1),
  prev: () => goToStep(state.step - 1),

  // Welcome and oath
  addMember,
  rmMember: (el) => removeMember(el.dataset.id),
  swear: (el) => {
    const { id } = el.dataset;
    state.sworn[id] = !state.sworn[id];
    ui.justSealedId = state.sworn[id] ? id : null;
    render();
    ui.justSealedId = null;
  },

  // Classes and states
  pick: (el) => {
    ui.selectedMemberId = el.dataset.id;
    render();
  },
  setClass: (el) => {
    if (ui.selectedMemberId) {
      state.classes[ui.selectedMemberId] = el.dataset.k;
      ui.selectedMemberId = nextUnsetMember(state.classes);
    }
    render();
  },
  setState: (el) => {
    if (ui.selectedMemberId) {
      state.states[ui.selectedMemberId] = el.dataset.k;
      ui.selectedMemberId = nextUnsetMember(state.states);
    }
    render();
  },

  // Map
  zone: (el) => selectZone(el.dataset.z),
  addNote,
  rmNote: (el) => {
    const { id } = el.dataset;
    state.notes = state.notes.filter((note) => note.id !== id);
    delete state.oracle[id];
    render();
  },

  // Coins and oracle
  allZones: (el) => {
    state.allZones = el.checked;
    render();
  },
  orTab: (el) => {
    state.orTab = el.dataset.t;
    render();
  },
  coin: (el) => {
    const note = state.notes.find((n) => n.id === el.dataset.id);
    if (note) note.coins = Math.max(0, (note.coins || 0) + intData(el, "d"));
    render();
  },

  // Oaths
  addOath: () => {
    if (state.oaths.length < MAX_OATHS) state.oaths.push(createEmptyOath());
    render();
  },
  rmOath: (el) => {
    state.oaths.splice(intData(el, "i"), 1);
    render();
  },
  smart: (el) => {
    const oath = state.oaths[intData(el, "i")];
    oath.smart ??= {};
    oath.smart[el.dataset.k] = el.checked;
    render();
  },

  // Verdict
  crown: (el) => {
    state.verdict[el.dataset.id] = intData(el, "n");
    render();
  },
  addHonour,
  rmHonour: (el) => {
    state.honours.splice(intData(el, "i"), 1);
    render();
  },

  // Chronicle
  copy: () => copyChronicle(buildChronicle()),
  download: () => downloadChronicle(buildChronicle()),

  // Global
  reset: resetQuest,
  timerToggle: toggleTimer,
  timerReset: () => resetTimer(state.step),
};

/* ---------- Listeners ---------- */

function onClick(event) {
  const el = event.target.closest("[data-act]");
  if (!el) return;
  ACTIONS[el.dataset.act]?.(el);
}

function onInput(event) {
  const path = event.target.dataset?.bind;
  if (!path) return;
  setByPath(state, path, event.target.value);
  saveState();
}

function onChange(event) {
  if (event.target.dataset?.rerender) render();
}

const isTextField = (el) => ["input", "textarea", "select"].includes(el.tagName?.toLowerCase());

function onKeyDown(event) {
  const { key, target } = event;

  if (key === "Enter" && target.id === "newMember") {
    event.preventDefault();
    addMember();
    return;
  }
  if (key === "Enter" && target.id === "noteText" && !event.shiftKey) {
    event.preventDefault();
    addNote();
    return;
  }
  // Map zones are SVG groups with role="button": activate them from the keyboard.
  if ((key === "Enter" || key === " ") && target.classList?.contains("zone")) {
    event.preventDefault();
    selectZone(target.dataset.z);
    getPageElement().querySelector(`.zone[data-z="${state.zone}"]`)?.focus();
    return;
  }

  if (isTextField(target)) return;
  if (key === "ArrowRight") goToStep(state.step + 1);
  if (key === "ArrowLeft") goToStep(state.step - 1);
}

export function bindEvents() {
  document.addEventListener("click", onClick);
  document.addEventListener("input", onInput);
  document.addEventListener("change", onChange);
  document.addEventListener("keydown", onKeyDown);
}
