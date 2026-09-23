/** Maps each step key (see STEPS in data.js) to the function rendering its content. */

import { renderAccueil } from "./accueil.js";
import { renderCarte } from "./carte.js";
import { renderChronique } from "./chronique.js";
import { renderClasse } from "./classe.js";
import { renderEtat } from "./etat.js";
import { renderOr } from "./or.js";
import { renderParchemin } from "./parchemin.js";
import { renderSerment } from "./serment.js";
import { renderVerdict } from "./verdict.js";

export const VIEWS = {
  accueil: renderAccueil,
  serment: renderSerment,
  classe: renderClasse,
  etat: renderEtat,
  carte: renderCarte,
  or: renderOr,
  parchemin: renderParchemin,
  verdict: renderVerdict,
  chronique: renderChronique,
};
