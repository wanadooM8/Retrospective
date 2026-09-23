/** Step VI: the scroll of oaths, i.e. SMART action items for the next Sprint. */

import { MAX_OATHS, ROMAN, SMART_CRITERIA } from "../data.js";
import { state } from "../state.js";
import { sealSvg } from "../svg.js";
import { escapeHtml } from "../utils.js";
import { memberOptions, sayBlock } from "./shared.js";

/** An oath is sealed when it is written, has a hero and meets every SMART criterion. */
const isSealed = (oath) =>
  SMART_CRITERIA.every((criterion) => oath.smart?.[criterion.k]) && oath.text.trim() && oath.hero;

function oathScroll(oath, i) {
  const criteria = SMART_CRITERIA.map((criterion) =>
    `<label><input type="checkbox" class="checkbox-input" data-act="smart" data-i="${i}" data-k="${criterion.k}"${oath.smart?.[criterion.k] ? " checked" : ""}>${criterion.t}</label>`);

  return `
    <div class="scroll">
      <div class="oathtop">
        <span class="ttl">Serment ${ROMAN[i]}</span>
        ${isSealed(oath) ? `<span class="sealed">${sealSvg("S")}Serment scellé</span>` : ""}
        ${state.oaths.length > 1 ? `<button type="button" class="btn quiet" data-act="rmOath" data-i="${i}">Retirer</button>` : ""}
      </div>
      <label class="f" for="o${i}t">Action précise</label>
      <textarea id="o${i}t" data-bind="oaths.${i}.text" placeholder="Ce que la guilde va faire, concrètement">${escapeHtml(oath.text)}</textarea>
      <div class="fields">
        <div>
          <label class="f" for="o${i}h">Héros responsable</label>
          <select id="o${i}h" data-bind="oaths.${i}.hero" data-rerender="1">${memberOptions(oath.hero)}</select>
        </div>
        <div>
          <label class="f" for="o${i}d">Échéance</label>
          <input type="text" id="o${i}d" data-bind="oaths.${i}.date" value="${escapeHtml(oath.date)}" placeholder="Par exemple : Sprint Planning du Sprint 2">
        </div>
      </div>
      <div class="proof-field">
        <label class="f" for="o${i}p">Comment saura-t-on que c'est fait ?</label>
        <input type="text" id="o${i}p" data-bind="oaths.${i}.proof" value="${escapeHtml(oath.proof)}" placeholder="Le signe visible que le serment est tenu">
      </div>
      <div class="smart">${criteria.join("")}</div>
    </div>`;
}

export function renderParchemin() {
  const addButton = state.oaths.length < MAX_OATHS
    ? `<button type="button" class="btn or" data-act="addOath">Ajouter un serment</button>`
    : `<p class="hint">Trois serments au maximum.</p>`;

  return `
    <div class="cols">
      <div class="side">
        ${sayBlock("Pour chaque cause trouvée par l'Oracle, quelle action la guilde s'engage-t-elle à faire pendant le Sprint 2 ?")}
        <p>Gardez 2 serments, 3 au maximum. Une guilde qui promet trop ne tient rien.</p>
        <p class="hint">Un serment est scellé quand les 5 conditions sont cochées. Après la séance, ajoutez les serments dans le backlog du Sprint 2.</p>
        <p class="hint">Exemple : « Pendant le Sprint Planning du Sprint 2, découper chaque tâche en sous-tâches d'un jour maximum. »</p>
      </div>
      <div class="main">
        ${state.oaths.map(oathScroll).join("")}
        ${addButton}
      </div>
    </div>`;
}
