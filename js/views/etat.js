/** Step III: how each traveller comes back from the quest. */

import { HURT_STATES, HURT_WARNING_THRESHOLD, MAX_HEARTS, STATES, findState } from "../data.js";
import { ensureSelection, membersWith, state } from "../state.js";
import { heartSvg } from "../svg.js";
import { escapeHtml } from "../utils.js";
import { memberPicker, needMembersBlock, sayBlock } from "./shared.js";

function stateCard(travellerState) {
  const who = membersWith(state.states, travellerState.key).map(escapeHtml).join(", ");
  let hearts = "";
  for (let i = 0; i < MAX_HEARTS; i++) hearts += heartSvg(i < travellerState.hearts);

  return `<button type="button" class="state" data-act="setState" data-k="${travellerState.key}">` +
    `<span class="hearts">${hearts}</span>` +
    `<span><span class="t">${travellerState.name}</span><br><span class="d">${travellerState.desc}</span>` +
    (who ? `<br><span class="who">${who}</span>` : "") +
    `</span></button>`;
}

export function renderEtat() {
  if (!state.members.length) return needMembersBlock();
  ensureSelection(state.states);

  const hurtCount = state.members.filter((member) => HURT_STATES.includes(state.states[member.id])).length;

  return `
    <div class="cols">
      <div class="side">
        ${sayBlock("Dans quel état revenez-vous de la quête ? Pas besoin de vous justifier.")}
        <p class="hint">Ne forcez personne à expliquer son choix. Si plusieurs voyageurs sont blessés, dites-le simplement et proposez d'en parler pendant la Carte de la Quête.</p>
      </div>
      <div class="main">
        ${memberPicker(state.states, (key) => findState(key)?.name ?? "")}
        <div class="states">${STATES.map(stateCard).join("")}</div>
        ${hurtCount >= HURT_WARNING_THRESHOLD ? `<div class="warn">Plusieurs voyageurs sont blessés ou à bout de forces. Prenez le temps d'en parler pendant la Carte de la Quête.</div>` : ""}
      </div>
    </div>`;
}
