/** Step VII: the King's verdict (ROTI vote in crowns) and the honours. */

import { MAX_CROWNS } from "../data.js";
import { memberName, state, verdictVotes, writtenOaths } from "../state.js";
import { crownSvg } from "../svg.js";
import { average, escapeHtml, formatDecimal, plural } from "../utils.js";
import { memberOptions, needMembersBlock, sayBlock } from "./shared.js";

/** Votes at or below this value prompt the facilitator to ask what to change. */
const LOW_VOTE = 2;

function oathRecap() {
  const oaths = writtenOaths();
  if (!oaths.length) return `<p class="hint">Aucun serment écrit pour l'instant.</p>`;
  const items = oaths.map((oath) =>
    `<li>${escapeHtml(oath.text)}` +
    (oath.hero ? ` : <b>${escapeHtml(memberName(oath.hero))}</b>` : "") +
    (oath.date ? `, ${escapeHtml(oath.date)}` : "") +
    `</li>`);
  return `<ul class="plain">${items.join("")}</ul>`;
}

function honourList() {
  if (!state.honours.length) return "";
  const items = state.honours.map((honour, i) =>
    `<li><span><b>${escapeHtml(memberName(honour.to) || "Un membre")}</b> est honoré ${escapeHtml(honour.why)}</span>` +
    `<button type="button" class="rm" data-act="rmHonour" data-i="${i}" aria-label="Retirer">×</button></li>`);
  return `<ul class="honours">${items.join("")}</ul>`;
}

function crownRow(member) {
  const vote = state.verdict[member.id] || 0;
  let crowns = "";
  for (let n = 1; n <= MAX_CROWNS; n++) {
    crowns += `<button type="button" class="crown${n <= vote ? " on" : ""}" data-act="crown" data-id="${member.id}" data-n="${n}" aria-label="${n} ${plural(n, "couronne")} pour ${escapeHtml(member.name)}">${crownSvg()}</button>`;
  }
  return `<div class="vrow"><span>${escapeHtml(member.name)}</span><span class="crowns">${crowns}</span></div>`;
}

export function renderVerdict() {
  if (!state.members.length) return needMembersBlock();

  const votes = verdictVotes();
  const lowVoters = state.members.filter((member) => state.verdict[member.id] && state.verdict[member.id] <= LOW_VOTE);

  return `
    <div class="cols">
      <div class="side">
        <h3>D'abord, relire les serments</h3>
        ${oathRecap()}
        ${sayBlock("Combien de couronnes donnez-vous à cette rétrospective ? Une couronne : temps perdu. Cinq couronnes : excellente séance.")}
        <h3>Les Honneurs</h3>
        <p class="hint">Facultatif. Remercier un membre pour une action précise du Sprint.</p>
        <div class="fields single">
          <div>
            <label class="f" for="hTo">Qui est honoré ?</label>
            <select id="hTo">${memberOptions()}</select>
          </div>
          <div>
            <label class="f" for="hWhy">Pour quoi ?</label>
            <input type="text" id="hWhy" placeholder="Pour avoir préparé la réunion client">
          </div>
        </div>
        <button type="button" class="btn or honour-btn" data-act="addHonour">Rendre honneur</button>
        ${honourList()}
      </div>
      <div class="main">
        <div class="avg">
          <span class="n">${votes.length ? formatDecimal(average(votes)) : "-"}</span>
          <span>couronnes en moyenne<br><span class="hint">${votes.length} ${plural(votes.length, "vote")} sur ${state.members.length}</span></span>
        </div>
        ${state.members.map(crownRow).join("")}
        ${lowVoters.length ? `<div class="warn">Demandez à ${lowVoters.map((member) => escapeHtml(member.name)).join(", ")} ce qu'il faudrait changer pour la prochaine rétrospective.</div>` : ""}
      </div>
    </div>`;
}
