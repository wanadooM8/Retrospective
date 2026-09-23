/** Builds the plain-text report ("chronicle") of the retrospective. */

import { STATES, ZONES, findClass } from "./data.js";
import { coinsOf, memberName, notesInZone, state, topSubjects, verdictVotes, writtenOaths } from "./state.js";
import { average, formatDecimal, plural } from "./utils.js";

const orUndefined = (text) => text?.trim() || "à définir";

function membersSection(lines) {
  const names = state.members.map((member) => member.name).join(", ");
  lines.push(`La guilde : ${names || "non renseignée"}`);
}

function classesSection(lines) {
  const withClass = state.members.filter((member) => state.classes[member.id]);
  if (!withClass.length) return;
  lines.push("", "CLASSES");
  withClass.forEach((member) => lines.push(`- ${member.name} : ${findClass(state.classes[member.id]).name}`));
}

function statesSection(lines) {
  const withState = state.members.filter((member) => state.states[member.id]);
  if (!withState.length) return;
  lines.push("", "ÉTAT DES VOYAGEURS");
  STATES.forEach((travellerState) => {
    const count = withState.filter((member) => state.states[member.id] === travellerState.key).length;
    if (count) lines.push(`- ${travellerState.name} : ${count}`);
  });
}

function mapSection(lines) {
  lines.push("", "LA CARTE DE LA QUÊTE");
  ZONES.forEach((zone) => {
    const notes = notesInZone(zone.key);
    lines.push(`${zone.name} (${zone.q})`);
    if (!notes.length) lines.push("- Rien de noté");
    notes.forEach((note) => {
      const coins = coinsOf(note);
      lines.push(`- ${note.text}${coins ? `  [${coins} ${plural(coins, "pièce")}]` : ""}`);
    });
  });
}

function oracleSection(lines) {
  const top = topSubjects();
  if (!top.length) return;
  lines.push("", "SUJETS ANALYSÉS PAR L'ORACLE");
  top.forEach((note, i) => {
    const entry = state.oracle[note.id] ?? { whys: [], cause: "" };
    lines.push(`${i + 1}. ${note.text}`);
    entry.whys.forEach((why, j) => {
      if (why?.trim()) lines.push(`   Pourquoi ${j + 1} : ${why.trim()}`);
    });
    lines.push(`   Cause trouvée : ${entry.cause?.trim() || "non renseignée"}`);
  });
}

function oathsSection(lines) {
  const oaths = writtenOaths();
  lines.push("", "SERMENTS POUR LE SPRINT 2");
  if (!oaths.length) lines.push("- Aucun serment");
  oaths.forEach((oath, i) => {
    lines.push(
      `${i + 1}. ${oath.text.trim()}`,
      `   Héros responsable : ${memberName(oath.hero) || "à définir"}`,
      `   Échéance : ${orUndefined(oath.date)}`,
      `   Comment on saura que c'est fait : ${orUndefined(oath.proof)}`,
    );
  });
}

function verdictSection(lines) {
  const votes = verdictVotes();
  if (!votes.length) return;
  lines.push("", `VERDICT DU ROI : ${formatDecimal(average(votes))} couronnes sur 5 (${votes.length} votes)`);
}

function honoursSection(lines) {
  if (!state.honours.length) return;
  lines.push("", "HONNEURS");
  state.honours.forEach((honour) => lines.push(`- ${memberName(honour.to) || "Un membre"} ${honour.why}`));
}

export function buildChronicle() {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const lines = [
    "RÉTROSPECTIVE DU SPRINT 1 : LA QUÊTE DE LA GUILDE",
    `Date : ${today}`,
    "",
  ];

  membersSection(lines);
  classesSection(lines);
  statesSection(lines);
  mapSection(lines);
  oracleSection(lines);
  oathsSection(lines);
  verdictSection(lines);
  honoursSection(lines);

  return lines.join("\n");
}
