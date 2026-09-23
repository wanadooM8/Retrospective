/** Step II: each member picks the character class that describes their Sprint. */

import { CLASSES, findClass } from "../data.js";
import { ensureSelection, membersWith, state } from "../state.js";
import { shieldSvg } from "../svg.js";
import { escapeHtml } from "../utils.js";
import { memberPicker, needMembersBlock, sayBlock } from "./shared.js";

function classCard(characterClass) {
  const who = membersWith(state.classes, characterClass.key).map(escapeHtml).join(", ");
  return `<button type="button" class="pcard" data-act="setClass" data-k="${characterClass.key}">` +
    shieldSvg(characterClass) +
    `<span class="n">${characterClass.name}</span>` +
    `<span class="d">${characterClass.desc}</span>` +
    `<span class="who">${who}</span></button>`;
}

export function renderClasse() {
  if (!state.members.length) return needMembersBlock();
  ensureSelection(state.classes);

  return `
    <div class="cols">
      <div class="side">
        ${sayBlock("Quelle classe de personnage te représente le mieux pendant ce Sprint ? Explique ton choix en une phrase.")}
        <p>Exemple : « Je suis Barde, parce que j'ai rédigé les comptes rendus et préparé les échanges avec le commanditaire. »</p>
        <p class="hint">Si plusieurs personnes choisissent Aventurier perdu, c'est une information utile : gardez-la en tête pour la Carte de la Quête.</p>
      </div>
      <div class="main">
        <p class="hint flush">Choisis un membre, puis sa classe. On passe ensuite automatiquement au membre suivant.</p>
        ${memberPicker(state.classes, (key) => findClass(key)?.name ?? "")}
        <div class="deck">${CLASSES.map(classCard).join("")}</div>
      </div>
    </div>`;
}
