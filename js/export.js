/**
 * Copying and downloading the chronicle.
 * The download button relies on the Claude Artifact runtime (`window.claude`)
 * and stays hidden everywhere else. See types/downloads.d.ts.
 */

const DOWNLOAD_FILENAME = "retro-sprint-1.txt";

let downloads = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) toast.textContent = message;
}

/** Shows the download button when the downloads capability is available. */
export function setupDownloadButton() {
  const button = document.getElementById("dlbtn");
  if (!button) return;
  if (downloads) {
    button.hidden = false;
    return;
  }
  if (typeof window.claude?.use !== "function") return;

  window.claude.use("downloads")
    .then((capability) => {
      downloads = capability;
      // The page may have been re-rendered in the meantime: look the button up again.
      const currentButton = document.getElementById("dlbtn");
      if (capability && currentButton) currentButton.hidden = false;
    })
    .catch(() => {});
}

export function downloadChronicle(text) {
  if (!downloads) return;
  const data = new Blob([text], { type: "text/plain;charset=utf-8" });
  Promise.resolve(downloads.save({ filename: DOWNLOAD_FILENAME, data }))
    .then(() => showToast("Compte rendu téléchargé."), () => showToast("Téléchargement annulé."));
}

/** Selects the chronicle text and tries the legacy copy command. */
function copyBySelection() {
  const range = document.createRange();
  range.selectNodeContents(document.getElementById("chron"));
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    // Not supported: the user can still press Ctrl+C on the selection.
  }
  showToast(copied ? "Compte rendu copié." : "Le texte est sélectionné : utilise Ctrl+C pour le copier.");
}

export function copyChronicle(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast("Compte rendu copié."), copyBySelection);
  } else {
    copyBySelection();
  }
}
