/** HTML fragments shared by several steps. */

import { STEP_INDEX } from "../data.js";
import { state, ui } from "../state.js";
import { escapeHtml } from "../utils.js";

/** Line the Scrum Master reads aloud. `text` is trusted HTML. */
export const sayBlock = (text) => `<div class="say"><b>À dire</b>${text}</div>`;

export const needMembersBlock = () => `
  <div class="empty">
    Ajoute d'abord les membres de la guilde dans la taverne.<br><br>
    <button type="button" class="btn quiet" data-act="go" data-step="${STEP_INDEX.accueil}">Retour à la taverne</button>
  </div>`;

/**
 * Row of member chips used to pick who is answering.
 * @param {Object} map memberId -> chosen value
 * @param {(value: string) => string} labelOf label shown next to members who already chose
 */
export function memberPicker(map, labelOf) {
  const chips = state.members.map((member) => {
    const value = map[member.id];
    const classes = ["chip"];
    if (ui.selectedMemberId === member.id) classes.push("on");
    if (value) classes.push("set");
    const suffix = value ? ` (${escapeHtml(labelOf(value))})` : "";
    return `<button type="button" class="${classes.join(" ")}" data-act="pick" data-id="${member.id}">${escapeHtml(member.name)}${suffix}</button>`;
  });
  return `<div class="chips" role="group" aria-label="Choisir un membre">${chips.join("")}</div>`;
}

/** `<option>` list of members, with `selectedId` preselected. */
export function memberOptions(selectedId = "") {
  return `<option value="">Choisir</option>` + state.members
    .map((member) => `<option value="${member.id}"${member.id === selectedId ? " selected" : ""}>${escapeHtml(member.name)}</option>`)
    .join("");
}
