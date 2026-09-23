/** Step V: gold-coin voting on ideas, then the "5 whys" Oracle on the top subjects. */

import { COINS_PER_MEMBER, MAX_DRAWN_COINS, PROBLEM_ZONES, ROMAN, STEP_INDEX, findZone } from "../data.js";
import { coinsOf, ensureOracleEntry, state, topSubjects } from "../state.js";
import { coinSvg, oracleSvg } from "../svg.js";
import { escapeHtml, plural, sum } from "../utils.js";
import { sayBlock } from "./shared.js";

/* ---------- Gold coins ---------- */

function coinPurse() {
  const total = Math.max(state.members.length, 1) * COINS_PER_MEMBER;
  const left = total - sum(state.notes.map(coinsOf));
  return { total, left };
}

function subjectRow(note, isTop, canAddCoin) {
  const coins = coinsOf(note);
  const pile = coinSvg().repeat(Math.min(coins, MAX_DRAWN_COINS));

  return `<div class="subj${isTop ? " top" : ""}" style="--zone-color: ${findZone(note.zone).color}">` +
    `<span>${isTop ? `<span class="tag">Choisi par la guilde</span>` : ""}${escapeHtml(note.text)}</span>` +
    `<span class="coins">` +
      `<button type="button" class="cbtn minus" data-act="coin" data-id="${note.id}" data-d="-1" aria-label="Retirer une pièce"${coins ? "" : " disabled"}>−</button>` +
      `<span class="pile" aria-hidden="true">${pile}</span>` +
      `<b class="count" aria-label="${coins} pièces">${coins}</b>` +
      `<button type="button" class="cbtn" data-act="coin" data-id="${note.id}" data-d="1" aria-label="Ajouter une pièce"${canAddCoin ? "" : " disabled"}>+</button>` +
    `</span></div>`;
}

function renderCoins() {
  const pool = state.notes.filter((note) => state.allZones || PROBLEM_ZONES.includes(note.zone));
  const { total, left } = coinPurse();
  const topIds = topSubjects().map((note) => note.id);

  const subjects = pool.length
    ? pool.map((note) => subjectRow(note, topIds.includes(note.id), left > 0)).join("")
    : `<p class="empty">Aucune idée dans les zones Dragon et Pièges. Retournez à la Carte de la Quête, ou affichez les idées de tous les lieux.</p>`;

  return `
    <div class="cols">
      <div class="side">
        ${sayBlock("Chacun a 3 pièces d'or. Placez-les sur les sujets qui méritent le plus d'être traités. Vous pouvez mettre plusieurs pièces sur le même sujet.")}
        <p>Les 2 sujets les plus riches partent chez l'Oracle.</p>
        <label class="row hint toggle">
          <input type="checkbox" class="checkbox-input" data-act="allZones"${state.allZones ? " checked" : ""}>
          Afficher les idées de tous les lieux
        </label>
      </div>
      <div class="main">
        <div class="purse">${coinSvg()}<span>${left} ${plural(left, "pièce")} ${plural(left, "restante")} sur ${total}</span></div>
        ${subjects}
        ${topIds.length ? `<button type="button" class="btn to-oracle" data-act="orTab" data-t="oracle">Consulter l'Oracle</button>` : ""}
      </div>
    </div>`;
}

/* ---------- Oracle (5 whys) ---------- */

function whyChain(note) {
  const entry = ensureOracleEntry(note.id);
  const whys = entry.whys.map((answer, i) =>
    `<li><span class="k">Pourquoi ${ROMAN[i]}</span>` +
    `<input type="text" aria-label="Réponse au pourquoi ${i + 1}" data-bind="oracle.${note.id}.whys.${i}" value="${escapeHtml(answer)}" placeholder="${i === 0 ? "Parce que..." : "Et pourquoi cela ?"}"></li>`);

  return `
    <div class="scroll why-scroll">
      <p class="problem">${escapeHtml(note.text)}</p>
      <ol class="chain">${whys.join("")}</ol>
      <div class="cause">
        <label class="f" for="c_${note.id}">Cause trouvée, sur laquelle la guilde peut agir</label>
        <input type="text" id="c_${note.id}" data-bind="oracle.${note.id}.cause" value="${escapeHtml(entry.cause)}">
      </div>
    </div>`;
}

function renderOracle() {
  const top = topSubjects();
  const intro = `
    <div class="oracle">
      ${oracleSvg()}
      <div>
        ${sayBlock("L'Oracle ne répond qu'à une seule question : pourquoi ? Posez-la jusqu'à 5 fois, en partant de la réponse précédente, jusqu'à trouver une cause sur laquelle la guilde peut agir.")}
        <p class="hint">Environ 6 minutes par sujet. Si la cause ne dépend pas de l'équipe, cherchez ce qu'elle peut quand même influencer, par exemple en posant la question au tuteur.</p>
      </div>
    </div>`;

  if (!top.length) return `${intro}<p class="empty">Aucun sujet choisi. Distribuez d'abord les pièces d'or.</p>`;

  return intro + top.map(whyChain).join("") +
    `<button type="button" class="btn" data-act="go" data-step="${STEP_INDEX.parchemin}">Écrire les serments</button>`;
}

/* ---------- Tabs ---------- */

function tab(key, label) {
  const selected = state.orTab === key;
  return `<button type="button" class="tab${selected ? " on" : ""}" role="tab" aria-selected="${selected}" data-act="orTab" data-t="${key}">${label}</button>`;
}

export function renderOr() {
  return `<div class="tabs" role="tablist">${tab("or", "Les Pièces d'or")}${tab("oracle", "L'Oracle")}</div>` +
    (state.orTab === "or" ? renderCoins() : renderOracle());
}
