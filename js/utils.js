/** Small generic helpers with no dependency on the application state. */

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes a value so it can be safely inserted into an HTML string. */
export const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

/** Short random identifier, unique enough for a single retrospective. */
export const uid = () => Math.random().toString(36).slice(2, 9);

/** Adds an "s" to a French word when the count is greater than one. */
export const plural = (count, word) => (count > 1 ? `${word}s` : word);

export const sum = (values) => values.reduce((total, value) => total + value, 0);
export const average = (values) => sum(values) / values.length;

/** Formats a number with one decimal and a French decimal comma (e.g. "3,5"). */
export const formatDecimal = (value) => value.toFixed(1).replace(".", ",");

/** Formats a number of seconds as "m:ss". */
export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Sets a nested property from a dotted path, e.g. setByPath(obj, "oaths.0.text", "…").
 * Does nothing if an intermediate object is missing.
 */
export function setByPath(target, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let node = target;
  for (const key of keys) {
    node = node[key];
    if (node == null) return;
  }
  node[lastKey] = value;
}
