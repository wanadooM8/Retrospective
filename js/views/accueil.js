/** Welcome step: the tavern, where the guild members are listed. */

import { STEP_INDEX } from "../data.js";
import { state } from "../state.js";
import { escapeHtml } from "../utils.js";

function memberList() {
  if (!state.members.length) {
    return `<p class="hint">Aucun membre pour l'instant. Ajoute chaque personne, Scrum Master et Product Owner compris.</p>`;
  }
  const chips = state.members.map((member) => {
    const name = escapeHtml(member.name);
    return `<button type="button" class="chip" data-act="rmMember" data-id="${member.id}" aria-label="Retirer ${name}">${name}<span class="x" aria-hidden="true">×</span></button>`;
  });
  return `<div class="chips">${chips.join("")}</div>`;
}

export function renderAccueil() {
  return `
    <div class="hero">
      <div>
        <h2>Bienvenue à la taverne</h2>
        <p class="lede">La guilde revient de sa première quête. Installez-vous à la taverne : on raconte le voyage, on comprend ce qui nous a ralentis, et on prépare la prochaine quête.</p>
        <p class="hint">Durée prévue : 75 minutes. Le Maître de la Guilde (le Scrum Master) partage cet écran et anime.</p>
      </div>
      <div>
        <h3>Qui compose la guilde ?</h3>
        <div class="row member-form">
          <div class="field">
            <label class="f" for="newMember">Prénom d'un membre</label>
            <input type="text" id="newMember" placeholder="Par exemple : Léa" maxlength="30" autocomplete="off">
          </div>
          <button type="button" class="btn or" data-act="addMember">Ajouter</button>
        </div>
        ${memberList()}
        <button type="button" class="btn enter-btn" data-act="go" data-step="${STEP_INDEX.serment}">Entrer dans la taverne</button>
      </div>
    </div>`;
}
