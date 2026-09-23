/**
 * Application state: the persisted retrospective data (`state`),
 * the transient UI state (`ui`) and the selectors built on top of them.
 */

import { STORAGE_KEY, TOP_SUBJECTS_COUNT, WHYS_COUNT } from "./data.js";

export const createEmptyOath = () => ({ text: "", hero: "", date: "", proof: "", smart: {} });

export function createInitialState() {
  return {
    step: 0,
    members: [],   // [{ id, name }]
    sworn: {},     // memberId -> boolean
    classes: {},   // memberId -> class key
    states: {},    // memberId -> state key
    notes: [],     // [{ id, zone, text, coins }]
    zone: "dragon",
    allZones: false,
    orTab: "or",   // "or" | "oracle"
    oracle: {},    // noteId -> { whys: string[], cause }
    oaths: [createEmptyOath()],
    verdict: {},   // memberId -> 1..5
    honours: [],   // [{ to: memberId, why }]
  };
}

function loadState() {
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage unavailable or corrupted: start from scratch.
  }
  // Keys missing from an older save fall back to their default value.
  return { ...createInitialState(), ...saved };
}

/** Persisted data. Reassigned by `resetState`, importers see the new value (live binding). */
export let state = loadState();

/** Transient UI state, never persisted. */
export const ui = {
  /** Member currently selected in the class and state steps. */
  selectedMemberId: null,
  /** Member whose seal was just stamped, to play the animation once. */
  justSealedId: null,
};

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing or full storage: the app keeps working without persistence.
  }
}

export function resetState() {
  state = createInitialState();
  ui.selectedMemberId = null;
}

/* ---------- Selectors ---------- */

export const findMember = (id) => state.members.find((member) => member.id === id) ?? null;
export const memberName = (id) => findMember(id)?.name ?? "";

/** Names of the members whose value in `map` equals `key`. */
export const membersWith = (map, key) =>
  state.members.filter((member) => map[member.id] === key).map((member) => member.name);

export const notesInZone = (zoneKey) => state.notes.filter((note) => note.zone === zoneKey);

export const coinsOf = (note) => note.coins || 0;

/** The notes with the most coins, sent to the Oracle. */
export const topSubjects = () =>
  state.notes
    .filter((note) => coinsOf(note) > 0)
    .sort((a, b) => coinsOf(b) - coinsOf(a))
    .slice(0, TOP_SUBJECTS_COUNT);

export const writtenOaths = () => state.oaths.filter((oath) => oath.text.trim());

/** Crowns given by the members who voted. */
export const verdictVotes = () => state.members.map((member) => state.verdict[member.id]).filter(Boolean);

export function ensureOracleEntry(noteId) {
  state.oracle[noteId] ??= { whys: Array(WHYS_COUNT).fill(""), cause: "" };
  return state.oracle[noteId];
}

/* ---------- Member selection (class and state steps) ---------- */

/** First member with no value in `map`, or the current selection if all are set. */
export function nextUnsetMember(map) {
  return state.members.find((member) => !map[member.id])?.id ?? ui.selectedMemberId;
}

/** Makes sure a valid member is selected, preferring one with no value in `map`. */
export function ensureSelection(map) {
  if (ui.selectedMemberId && findMember(ui.selectedMemberId)) return;
  ui.selectedMemberId =
    state.members.find((member) => !map[member.id])?.id ?? state.members[0]?.id ?? null;
}
