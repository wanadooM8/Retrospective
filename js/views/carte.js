/** Step IV: the quest map, where ideas are written as sticky notes on each zone. */

import { ZONES, findZone } from "../data.js";
import { mapSvg } from "../map.js";
import { notesInZone, state } from "../state.js";
import { escapeHtml } from "../utils.js";

function zoneChips(activeKey) {
  const chips = ZONES.map((zone) =>
    `<button type="button" class="chip${zone.key === activeKey ? " on" : ""}" data-act="zone" data-z="${zone.key}">${escapeHtml(zone.short)}</button>`);
  return `<div class="minizones" role="group" aria-label="Lieux">${chips.join("")}</div>`;
}

function noteList(notes) {
  if (!notes.length) return `<p class="empty">Ce lieu est encore vide. Ajoutez la première idée.</p>`;
  const items = notes.map((note) =>
    `<li class="note"><span>${escapeHtml(note.text)}</span><button type="button" class="rm" data-act="rmNote" data-id="${note.id}" aria-label="Retirer cette idée">×</button></li>`);
  return `<ul class="notes">${items.join("")}</ul>`;
}

export function renderCarte() {
  const zone = findZone(state.zone);

  return `
    <div class="mapgrid">
      <div>
        ${mapSvg()}
        <p class="hint map-hint">Déroulé : 2 min pour rappeler ce qui s'est passé pendant le Sprint, 8 min d'écriture silencieuse sur post-it, 8 min de lecture et de regroupement, 2 min pour nommer les groupes. Encouragez aussi les idées positives : les Alliés et le Trésor.</p>
      </div>
      <div class="zonepanel" style="--zone-color: ${zone.color}">
        ${zoneChips(zone.key)}
        <h3><span class="sw"></span>${escapeHtml(zone.name)}</h3>
        <p class="q">${escapeHtml(zone.q)}</p>
        <label class="f" for="noteText">Nouvelle idée pour ce lieu</label>
        <textarea id="noteText" placeholder="Une idée par post-it" maxlength="200"></textarea>
        <div class="row note-actions">
          <button type="button" class="btn" data-act="addNote">Ajouter au lieu</button>
          <span class="hint">Entrée pour ajouter</span>
        </div>
        ${noteList(notesInZone(zone.key))}
      </div>
    </div>`;
}
