/** Small SVG drawings returned as HTML strings. The quest map lives in map.js. */

import { TINCTURES } from "./data.js";
import { escapeHtml } from "./utils.js";

const { sable: INK, argent: ARGENT, or: GOLD, gules: RED, wood: WOOD, vert: GREEN } = TINCTURES;

const SHIELD_PATH = "M6 6 H74 V44 C74 70 58 84 40 92 C22 84 6 70 6 44 Z";

/** Points of an n-branch star, centred on (cx, cy), as an SVG "points" attribute. */
function starPoints(cx, cy, outerRadius, innerRadius, branches) {
  const points = [];
  for (let i = 0; i < branches * 2; i++) {
    const angle = (Math.PI * i) / branches - Math.PI / 2;
    const radius = i % 2 ? innerRadius : outerRadius;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(" ");
}

/** Charges (emblems) drawn on each class shield. */
const SHIELD_CHARGES = {
  chevalier: `<rect x="37" y="14" width="6" height="46" fill="${ARGENT}" stroke="${INK}" stroke-width="1.5"/><rect x="26" y="58" width="28" height="6" rx="2" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/><rect x="37" y="64" width="6" height="11" fill="${WOOD}" stroke="${INK}" stroke-width="1.5"/><circle cx="40" cy="79" r="4" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/>`,
  mage: `<polygon points="${starPoints(40, 44, 24, 10, 8)}" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/><circle cx="40" cy="44" r="4" fill="${ARGENT}"/>`,
  barde: `<rect x="37" y="16" width="6" height="30" fill="${WOOD}" stroke="${INK}" stroke-width="1.5"/><rect x="34" y="12" width="12" height="8" rx="1" fill="${WOOD}" stroke="${INK}" stroke-width="1.5"/><ellipse cx="40" cy="58" rx="15" ry="18" fill="${GOLD}" stroke="${INK}" stroke-width="1.5"/><circle cx="40" cy="54" r="5" fill="${INK}"/><line x1="40" y1="20" x2="40" y2="72" stroke="${ARGENT}" stroke-width="1"/>`,
  eclaireur: `<path d="M30 18 Q62 48 30 80" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><line x1="30" y1="18" x2="30" y2="80" stroke="${INK}" stroke-width="1.5"/><line x1="22" y1="49" x2="58" y2="49" stroke="${INK}" stroke-width="3"/><polygon points="64,49 54,43 54,55" fill="${INK}"/><path d="M22 49 l-5 -5 M22 49 l-5 5" stroke="${INK}" stroke-width="2"/>`,
  alchimiste: `<rect x="35" y="16" width="10" height="18" fill="${ARGENT}" stroke="${INK}" stroke-width="1.5"/><path d="M35 34 L22 68 Q19 78 29 78 H51 Q61 78 58 68 L45 34 Z" fill="${ARGENT}" stroke="${INK}" stroke-width="1.5"/><path d="M27 58 H53 L57 68 Q59 76 51 76 H29 Q21 76 23 68 Z" fill="${GREEN}"/><circle cx="36" cy="66" r="2.5" fill="${ARGENT}"/><circle cx="45" cy="62" r="1.8" fill="${ARGENT}"/>`,
  perdu: `<text x="40" y="66" text-anchor="middle" font-family="Pirata One, Georgia, serif" font-size="54" fill="${INK}">?</text>`,
};

/** Coat of arms of a character class. */
export function shieldSvg(characterClass) {
  return `<svg viewBox="0 0 80 96" aria-hidden="true">` +
    `<path d="${SHIELD_PATH}" fill="${TINCTURES[characterClass.field]}"/>` +
    (SHIELD_CHARGES[characterClass.key] ?? "") +
    `<path d="${SHIELD_PATH}" fill="none" stroke="${INK}" stroke-width="4"/></svg>`;
}

export function heartSvg(full) {
  return `<svg viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21 C5 15 1 11 1 6.5 C1 3.5 3.5 1 6.5 1 C9 1 10.8 2.5 12 4.5 C13.2 2.5 15 1 17.5 1 C20.5 1 23 3.5 23 6.5 C23 11 19 15 12 21 Z" fill="${full ? RED : "none"}" stroke="currentColor" stroke-width="1.6"/></svg>`;
}

export function coinSvg() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="${GOLD}" stroke="${INK}" stroke-width="1.6"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#8A6414" stroke-width="1.4"/><path d="M12 8 V16 M9.5 10 H14.5" stroke="#8A6414" stroke-width="1.4"/></svg>`;
}

export function crownSvg() {
  return `<svg viewBox="0 0 40 30" aria-hidden="true"><path class="c" d="M4 24 L6 7 L14 15 L20 3 L26 15 L34 7 L36 24 Z"/><rect class="c" x="4" y="24" width="32" height="4"/></svg>`;
}

/** Irregular wax outline, computed once since it never changes. */
const WAX_POINTS = (() => {
  const sides = 22;
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides;
    const radius = 27 + (((i * 7) % 5) - 2) * 0.9 + (i % 3 === 0 ? 1.6 : 0);
    points.push(`${(32 + radius * Math.cos(angle)).toFixed(1)},${(32 + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(" ");
})();

/** Wax seal stamped with a letter. */
export function sealSvg(letter, className = "") {
  return `<svg viewBox="0 0 64 64" class="${className}" aria-hidden="true">` +
    `<polygon class="wax" points="${WAX_POINTS}" fill="${RED}" stroke="#5E1215" stroke-width="1.5"/>` +
    `<circle cx="32" cy="32" r="19" fill="none" stroke="#6E181B" stroke-width="2"/>` +
    `<text class="let" x="32" y="42" text-anchor="middle" font-family="Pirata One, Georgia, serif" font-size="28" fill="#E7B8A8">${escapeHtml(letter)}</text></svg>`;
}

export function oracleSvg() {
  return `<svg viewBox="0 0 120 140" width="120" aria-hidden="true">
    <path d="M30 118 L90 118 L82 134 L38 134 Z" fill="${WOOD}" stroke="${INK}" stroke-width="3"/>
    <circle cx="60" cy="68" r="48" fill="#5B3A6B" stroke="${INK}" stroke-width="3"/>
    <circle cx="60" cy="68" r="48" fill="none" stroke="#C9A6DC" stroke-width="2" stroke-dasharray="2 9" opacity=".7"/>
    <path d="M28 68 Q60 40 92 68 Q60 96 28 68 Z" fill="${ARGENT}" stroke="${INK}" stroke-width="2.5"/>
    <circle cx="60" cy="68" r="12" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><circle cx="60" cy="68" r="5" fill="${INK}"/>
    <circle cx="42" cy="44" r="6" fill="${ARGENT}" opacity=".35"/></svg>`;
}

/** Inner content of the hourglass; `fraction` is the share of sand left on top (0 to 1). */
export function hourglassContent(fraction) {
  const f = Math.max(0, Math.min(1, fraction));
  const topY = 30 - f * 21;
  const bottomHeight = (1 - f) * 21;
  return `<defs><clipPath id="gt"><path d="M10 8 L30 8 L21.5 30 L18.5 30 Z"/></clipPath><clipPath id="gb"><path d="M18.5 30 L21.5 30 L30 52 L10 52 Z"/></clipPath></defs>` +
    `<rect x="0" y="${topY.toFixed(2)}" width="40" height="${(30 - topY).toFixed(2)}" fill="${GOLD}" clip-path="url(#gt)"/>` +
    `<rect x="0" y="${(52 - bottomHeight).toFixed(2)}" width="40" height="${bottomHeight.toFixed(2)}" fill="${GOLD}" clip-path="url(#gb)"/>` +
    `<path d="M10 8 L30 8 L21.5 30 L30 52 L10 52 L18.5 30 Z" fill="none" stroke="#EFE6CF" stroke-width="2" stroke-linejoin="round"/>` +
    `<rect x="4" y="2" width="32" height="6" rx="1" fill="${WOOD}" stroke="#EFE6CF" stroke-width="1.5"/><rect x="4" y="52" width="32" height="6" rx="1" fill="${WOOD}" stroke="#EFE6CF" stroke-width="1.5"/>`;
}

/** Icons shown in the step path for the steps without a roman numeral. */
export const STEP_ICONS = {
  accueil: `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6 H15 V20 H5 Z M15 9 H18 Q20 9 20 11 V14 Q20 16 18 16 H15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M4 5 Q7 2 10 4 Q13 2 16 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  chronique: `<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4 H18 V18 Q18 21 15 21 H6 Q3 21 3 18 V16 H6 Z M6 16 V4 Q3 4 3 7 V8 H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8 H15 M9 11 H15 M9 14 H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};
