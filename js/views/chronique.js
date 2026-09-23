/** Final step: the chronicle, a plain-text report of the session to copy or download. */

import { buildChronicle } from "../chronicle.js";
import { sealSvg } from "../svg.js";
import { escapeHtml } from "../utils.js";

export function renderChronique() {
  return `
    <div class="cols">
      <div class="side">
        ${sealSvg("G", "bigseal")}
        <p class="fin">La guilde a prêté serment. Rendez-vous à la prochaine taverne pour voir si nous les avons tenus.</p>
        <p>Merci à tous.</p>
        <h3>Après la séance</h3>
        <ul class="plain">
          <li>Envoyer ce compte rendu à l'équipe dans les 48 heures.</li>
          <li>Ajouter les serments dans le backlog du Sprint 2.</li>
          <li>Ouvrir la prochaine rétro en vérifiant chaque serment : tenu, en cours ou abandonné.</li>
        </ul>
      </div>
      <div class="main">
        <h3>Compte rendu de la séance</h3>
        <pre class="chronicle" id="chron" tabindex="0">${escapeHtml(buildChronicle())}</pre>
        <div class="row">
          <button type="button" class="btn" data-act="copy">Copier le compte rendu</button>
          <button type="button" class="btn or" data-act="download" id="dlbtn" hidden>Télécharger en .txt</button>
        </div>
        <p class="toast" id="toast" aria-live="polite"></p>
      </div>
    </div>`;
}
