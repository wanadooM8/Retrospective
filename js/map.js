/** Illustrated quest map (step IV). Each zone is a keyboard-focusable button. */

import { TINCTURES, findZone } from "./data.js";
import { state, notesInZone } from "./state.js";
import { escapeHtml, plural } from "./utils.js";

const INK = TINCTURES.sable;

const ISLAND_PATH = "M60 120 C120 60 260 50 360 72 C470 42 600 52 700 92 C762 122 772 200 742 262 C772 332 742 420 662 452 C562 492 422 472 332 482 C222 497 110 472 70 402 C30 342 50 262 40 202 C35 162 45 140 60 120 Z";

const WAVE_POSITIONS = [[70, 40], [250, 30], [520, 26], [700, 40], [40, 470], [210, 500], [470, 505], [610, 495], [760, 330], [30, 280]];
const TREE_POSITIONS = [[210, 150], [235, 175], [190, 190], [560, 450], [585, 430], [250, 330], [118, 250], [140, 275]];

/* ---------- Scenery ---------- */

const waves = WAVE_POSITIONS
  .map(([x, y]) => `<path d="M${x} ${y} q8 -7 16 0 t16 0" fill="none" stroke="#EFE6CF" stroke-width="2" opacity=".35"/>`)
  .join("");

const land = `<path d="${ISLAND_PATH}" fill="#DDCFAE" stroke="${INK}" stroke-width="4"/>`;
const coastHatch = `<path d="${ISLAND_PATH}" fill="none" stroke="#C4B08A" stroke-width="14" opacity=".9" stroke-dasharray="1 7"/>`;
const road = `<path d="M130 370 C200 430 270 420 330 392 S 372 262 400 230 S 520 330 560 350 S 628 240 650 190" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 11"/>`;

const trees = TREE_POSITIONS
  .map(([x, y]) =>
    `<path d="M${x} ${y - 18} l-10 20 h20 z" fill="#2E5E43" stroke="${INK}" stroke-width="2"/>` +
    `<line x1="${x}" y1="${y + 2}" x2="${x}" y2="${y + 8}" stroke="${INK}" stroke-width="2"/>`)
  .join("");

const compass = `<g transform="translate(752 470)"><circle r="22" fill="none" stroke="#EFE6CF" stroke-width="2" opacity=".6"/><polygon points="0,-30 6,0 0,30 -6,0" fill="#EFE6CF" opacity=".8"/><polygon points="-30,0 0,-6 30,0 0,6" fill="#EFE6CF" opacity=".5"/><text y="-34" text-anchor="middle" fill="#EFE6CF" font-size="13" font-family="Alegreya, Georgia, serif">N</text></g>`;

/* ---------- Zone artwork ---------- */

const ZONE_ART = {
  allies:
    `<path d="M86 372 L118 314 L150 372 Z" fill="#2E5E43" stroke="${INK}" stroke-width="3"/><path d="M110 372 L118 350 L126 372 Z" fill="${INK}"/><line x1="118" y1="314" x2="118" y2="290" stroke="${INK}" stroke-width="3"/><path d="M118 290 L142 297 L118 304 Z" fill="#9B2226" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M138 374 L164 328 L190 374 Z" fill="#C99A2E" stroke="${INK}" stroke-width="3"/><line x1="164" y1="328" x2="164" y2="374" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M180 348 h10 v8 l6 12 q2 6 -4 6 h-14 q-6 0 -4 -6 l6 -12 z" fill="#5B3A6B" stroke="${INK}" stroke-width="2"/>`,

  pieges:
    `<ellipse cx="330" cy="384" rx="62" ry="22" fill="#20443A" stroke="${INK}" stroke-width="3"/><path d="M296 382 q6 -5 12 0 M340 390 q6 -5 12 0 M318 374 q6 -5 12 0" fill="none" stroke="#9FC4AE" stroke-width="2"/>` +
    `<path d="M268 386 v-26 M274 388 v-18 M390 384 v-24 M384 388 v-16" stroke="${INK}" stroke-width="2.5"/><ellipse cx="268" cy="358" rx="3" ry="7" fill="#7A4B22"/><ellipse cx="390" cy="358" rx="3" ry="7" fill="#7A4B22"/>` +
    `<path d="M310 338 l6 -12 l6 12 l6 -12 l6 12 l6 -12 l6 12" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><rect x="306" y="338" width="42" height="6" fill="#8a8a8a" stroke="${INK}" stroke-width="2"/>`,

  dragon:
    `<path d="M322 262 L378 150 L432 262 Z" fill="#EADFC4" stroke="${INK}" stroke-width="3"/><path d="M364 178 L378 150 L392 178 L385 172 L378 180 L371 172 Z" fill="#F3EEDF" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M400 262 L448 176 L496 262 Z" fill="#CDBB94" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M392 214 C400 196 420 190 436 196 L470 164 L466 190 L490 176 L480 204 L502 200 L474 222 C462 232 440 236 420 232 C412 244 398 246 386 240 C396 236 400 230 398 224 Z" fill="#9B2226" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M392 214 C382 206 368 208 360 216 L350 212 L354 222 C360 228 374 228 384 224 Z" fill="#9B2226" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<circle cx="364" cy="214" r="2" fill="#C99A2E"/><path d="M350 218 q-10 -2 -16 4 q8 0 10 6 q2 -6 8 -6" fill="#C99A2E" stroke="${INK}" stroke-width="1.5"/>`,

  tresor:
    `<rect x="528" y="344" width="64" height="36" fill="#7A4B22" stroke="${INK}" stroke-width="3"/><path d="M528 344 Q560 314 592 344 Z" fill="#8F5A2A" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="528" y="352" width="64" height="6" fill="#C99A2E" stroke="${INK}" stroke-width="2"/><rect x="554" y="350" width="12" height="14" fill="#C99A2E" stroke="${INK}" stroke-width="2"/>` +
    `<circle cx="516" cy="378" r="7" fill="#C99A2E" stroke="${INK}" stroke-width="2"/><circle cx="604" cy="382" r="6" fill="#C99A2E" stroke="${INK}" stroke-width="2"/><circle cx="610" cy="370" r="5" fill="#C99A2E" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M600 300 l18 18 M618 300 l-18 18" stroke="#9B2226" stroke-width="5" stroke-linecap="round"/>`,

  chateau:
    `<rect x="612" y="142" width="80" height="54" fill="#EADFC4" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M612 142 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8" fill="none" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="596" y="112" width="26" height="84" fill="#EADFC4" stroke="${INK}" stroke-width="3"/><rect x="682" y="112" width="26" height="84" fill="#EADFC4" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M592 112 L609 84 L626 112 Z" fill="#1E3A6E" stroke="${INK}" stroke-width="3"/><path d="M678 112 L695 84 L712 112 Z" fill="#1E3A6E" stroke="${INK}" stroke-width="3"/>` +
    `<line x1="609" y1="84" x2="609" y2="66" stroke="${INK}" stroke-width="2.5"/><path d="M609 66 L630 72 L609 78 Z" fill="#9B2226" stroke="${INK}" stroke-width="1.5"/>` +
    `<line x1="695" y1="84" x2="695" y2="66" stroke="${INK}" stroke-width="2.5"/><path d="M695 66 L716 72 L695 78 Z" fill="#C99A2E" stroke="${INK}" stroke-width="1.5"/>` +
    `<path d="M640 196 v-22 q12 -16 24 0 v22 Z" fill="${INK}"/><rect x="604" y="130" width="8" height="12" fill="${INK}"/><rect x="690" y="130" width="8" height="12" fill="${INK}"/>`,
};

/**
 * Position of each zone on the map: centre of the clickable area (cx, cy),
 * label centre and top (labelX, labelY) and label width.
 * Order matters: later zones are drawn on top.
 */
const ZONE_LAYOUT = [
  { key: "allies",  cx: 138, cy: 352, labelX: 138, labelY: 392, labelWidth: 118 },
  { key: "pieges",  cx: 330, cy: 372, labelX: 330, labelY: 414, labelWidth: 118 },
  { key: "dragon",  cx: 420, cy: 214, labelX: 420, labelY: 272, labelWidth: 124 },
  { key: "tresor",  cx: 562, cy: 352, labelX: 562, labelY: 392, labelWidth: 118 },
  { key: "chateau", cx: 652, cy: 150, labelX: 652, labelY: 208, labelWidth: 130 },
];

function zoneSvg({ key, cx, cy, labelX, labelY, labelWidth }) {
  const zone = findZone(key);
  const count = notesInZone(key).length;
  const isActive = state.zone === key;
  const badgeX = labelX + labelWidth / 2;

  const badge = count
    ? `<g class="cnt"><circle cx="${badgeX}" cy="${labelY}" r="14"/><text x="${badgeX}" y="${labelY + 5}">${count}</text></g>`
    : "";

  return `<g class="zone${isActive ? " active" : ""}" data-act="zone" data-z="${key}" tabindex="0" role="button" aria-label="${escapeHtml(zone.name)}, ${count} ${plural(count, "idée")}">` +
    `<circle cx="${cx}" cy="${cy}" r="74" fill="transparent"/><circle class="ring" cx="${cx}" cy="${cy}" r="70"/>` +
    ZONE_ART[key] +
    `<g class="lbl"><rect x="${labelX - labelWidth / 2}" y="${labelY}" width="${labelWidth}" height="30" rx="3"/><text x="${labelX}" y="${labelY + 22}">${escapeHtml(zone.short)}</text></g>` +
    badge +
    `</g>`;
}

export function mapSvg() {
  return `<svg class="map" viewBox="0 0 800 520" role="group" aria-label="Carte de la quête. Choisis un lieu pour y ajouter des idées.">` +
    `<rect width="800" height="520" fill="#142A52"/>` +
    waves + land + coastHatch + trees + road + compass +
    ZONE_LAYOUT.map(zoneSvg).join("") +
    `</svg>`;
}
