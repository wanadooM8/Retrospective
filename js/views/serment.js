/** Step I: the guild oath, sealed by each member. */

import { state, ui } from "../state.js";
import { sealSvg } from "../svg.js";
import { escapeHtml } from "../utils.js";
import { needMembersBlock, sayBlock } from "./shared.js";

function sealButton(member) {
  const sworn = Boolean(state.sworn[member.id]);
  const classes = ["sealbtn", sworn ? "on" : "off"];
  if (sworn && ui.justSealedId === member.id) classes.push("fresh");
  return `<button type="button" class="${classes.join(" ")}" data-act="swear" data-id="${member.id}" aria-pressed="${sworn}">` +
    sealSvg(member.name.charAt(0).toUpperCase()) +
    `<span class="nm">${escapeHtml(member.name)}</span></button>`;
}

export function renderSerment() {
  const everyoneSworn = state.members.length > 0 && state.members.every((member) => state.sworn[member.id]);
  const seals = state.members.length
    ? `<div class="seals">${state.members.map(sealButton).join("")}</div>`
    : needMembersBlock();

  return `
    <div class="cols">
      <div class="side">
        ${sayBlock("Bienvenue à la taverne, aventuriers. Nous revenons de notre première quête. Nous allons raconter notre voyage, comprendre ce qui nous a ralentis et choisir comment mieux voyager la prochaine fois. Nous ne cherchons pas de coupable : nous cherchons comment améliorer la guilde.")}
        <h3>Les règles de la taverne</h3>
        <ul class="plain">
          <li>Une seule personne parle à la fois.</li>
          <li>On écoute sans juger.</li>
          <li>Ce qui est dit à la taverne reste à la taverne.</li>
          <li>Les téléphones restent dans le sac.</li>
        </ul>
        <p class="hint">Le déroulé en une phrase : d'abord on raconte, ensuite on comprend, puis on décide, et on finit par un bilan.</p>
      </div>
      <div class="main">
        <p class="oath-text">Quoi que nous découvrions aujourd'hui, nous croyons que chaque membre de la guilde a fait de son mieux, avec ce qu'il savait, ses compétences, les ressources disponibles et la situation du moment.</p>
        <h3>Chacun appose son sceau</h3>
        <p class="hint">Chaque membre lit le serment, puis on clique sur son sceau.</p>
        ${seals}
        ${everyoneSworn ? `<p class="banner-ok">La guilde a prêté serment.</p>` : ""}
      </div>
    </div>`;
}
