// Couche service — à remplacer par de vrais appels API par l'équipe backend.
// Toute la logique "métier simulée" vit ici, isolée des écrans.

import { Adresse, ResultatEligibilite } from '@/data/types';

function delay<T>(value: T, ms = 900): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * Simule une vérification d'éligibilité fibre à partir d'une adresse.
 * Règle simulée : le code postal détermine le résultat, pour permettre
 * de tester facilement les 3 cas depuis l'app (éligible / non éligible / à l'étude).
 */
export async function verifierEligibilite(adresse: Adresse): Promise<ResultatEligibilite> {
  const dernierChiffre = Number(adresse.codePostal.slice(-1));

  if (Number.isNaN(dernierChiffre) || dernierChiffre % 3 === 0) {
    return delay({
      statut: 'eligible',
      adresse,
      debitEstime: 'Jusqu\'à 1 Gb/s',
      dateDisponibilitePrevue: undefined,
    });
  }

  if (dernierChiffre % 3 === 1) {
    return delay({
      statut: 'zone_a_etudier',
      adresse,
      dateDisponibilitePrevue: 'Estimation : 4 à 8 semaines',
    });
  }

  return delay({
    statut: 'non_eligible',
    adresse,
  });
}
