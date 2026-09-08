// Données factices — en attendant le branchement de l'API réelle
// (développée par l'équipe backend). Toute la donnée transite par
// `services/`, donc il suffira de remplacer l'implémentation là-bas.

import {
  AppareilConnecte,
  Client,
  Dossier,
  DossierEtape,
  Message,
  NotificationItem,
  Offre,
  OptionRecharge,
  Reclamation,
  ReclamationCategorie,
  Technicien,
  WifiInfo,
} from './types';

// Catalogue d'offres — repris de la maquette Figma (écran "Nouvelle demande").
// Le tarif de "Fibre UP Max" n'était pas visible sur la capture partagée :
// valeur estimée à ajuster par l'équipe produit.
export const offres: Offre[] = [
  {
    id: 'starter',
    nom: 'Fibre UP Starter',
    debit: '50 Mb/s',
    prixFCFA: 15000,
    avantages: ['Connexion illimitée', 'Ligne téléphonique'],
    icone: 'home',
  },
  {
    id: 'essentiel',
    nom: 'Fibre UP Essentiel',
    debit: '100 Mb/s',
    prixFCFA: 20000,
    avantages: ['Connexion illimitée', 'Ligne téléphonique', '60 min vers OCI'],
    icone: 'tv',
  },
  {
    id: 'plus',
    nom: 'Fibre UP Plus',
    debit: '200 Mb/s',
    prixFCFA: 25000,
    avantages: ['Connexion illimitée', 'Ligne fixe + IP', '60 min vers OCI'],
    icone: 'game-controller',
  },
  {
    id: 'premium',
    nom: 'Fibre UP Premium',
    debit: '500 Mb/s',
    prixFCFA: 65000,
    avantages: ['Connexion illimitée', 'Antivirus inclus', 'Ligne fixe + IP'],
    icone: 'briefcase',
  },
  {
    id: 'max',
    nom: 'Fibre UP Max',
    debit: '1 Gb/s',
    prixFCFA: 100000,
    avantages: ['Connexion illimitée', 'Antivirus inclus', 'Ligne fixe + IP', 'Support prioritaire'],
    icone: 'rocket',
  },
];

export const client: Client = {
  id: 'cli-1',
  prenom: 'Yves',
  nom: 'Goabi',
  telephone: '07 XX XX XX XX',
  email: 'yves.goabi@example.com',
  adresse: {
    numero: '3',
    rue: 'Riviera, Cocody Deux Plateaux, Rue K70',
    codePostal: '00225',
    ville: 'Abidjan',
  },
};

// Numéro de ligne fixe rattaché à la box fibre du client (distinct de son mobile).
export const numeroLigneFixe = '27 225 792 91';

// Code d'identification de la box (utile pour le support technique).
export const codeBox = 'BOX-CI-77492';

export const technicien: Technicien = {
  id: 'tech-1',
  prenom: 'Marc',
  nom: 'D.',
  note: 4.8,
  telephone: '07 55 66 77 88',
  vehicule: 'Fourgon Orange',
  immatriculation: 'CI-4521-AB',
  initiales: 'MD',
  heureArriveeEstimee: '12h - 16h',
};

export const etapesDossier: DossierEtape[] = [
  {
    id: 'adresse_verifiee',
    titre: 'Adresse vérifiée',
    description: 'Votre adresse a été confirmée comme éligible à la fibre.',
    date: '10 fév.',
    statut: 'fait',
  },
  {
    id: 'demande_recue',
    titre: 'Demande reçue',
    description: 'Documents enregistrés.',
    date: '10 fév.',
    statut: 'en_cours',
  },
  {
    id: 'demande_validee',
    titre: 'Demande validée',
    description: 'Votre dossier a été validé par nos équipes.',
    statut: 'a_venir',
  },
  {
    id: 'rdv_a_planifier',
    titre: 'Rendez-vous à planifier',
    description: 'Un créneau d\'intervention a été fixé avec vous.',
    statut: 'a_venir',
  },
  {
    id: 'technicien_assigne',
    titre: 'Technicien assigné',
    description: 'Un technicien a été affecté à votre installation.',
    statut: 'a_venir',
  },
  {
    id: 'installation',
    titre: 'Installation',
    description: 'Le technicien est en route ou intervient chez vous.',
    statut: 'a_venir',
  },
  {
    id: 'confirmation_client',
    titre: 'Confirmation client',
    description: 'Vérifiez que tout fonctionne pour clôturer le dossier.',
    statut: 'a_venir',
  },
  {
    id: 'fibre_active',
    titre: 'Fibre active',
    description: 'Votre fibre est activée et prête à l\'emploi.',
    statut: 'a_venir',
  },
];

export const dossier: Dossier = {
  id: 'dos-1',
  numero: 'CF-2026-00124',
  type: 'installation_fibre',
  statutGlobal: 'en_cours',
  etapes: etapesDossier,
  adresse: client.adresse,
  interventionAConfirmer: false,
  offre: offres[0],
};

export const dossierDepannage: Dossier = {
  id: 'dos-2',
  numero: 'CF-2026-00125',
  type: 'depannage_box',
  statutGlobal: 'termine',
  etapes: [
    { id: 'demande_recue', titre: 'Demande reçue', description: 'Signalement de panne enregistré.', date: '06 juil.', statut: 'fait' },
    { id: 'demande_validee', titre: 'Diagnostic effectué', description: 'Problème identifié sur la box.', date: '06 juil.', statut: 'fait' },
    { id: 'technicien_assigne', titre: 'Technicien assigné', description: 'Intervention de dépannage planifiée.', date: '06 juil.', statut: 'fait' },
    { id: 'fibre_active', titre: 'Box réparée', description: 'Connexion rétablie.', date: '06 juil.', statut: 'fait' },
  ],
  adresse: client.adresse,
  interventionAConfirmer: false,
  offre: offres[0],
  dateActivation: '06 juillet 2026',
};

export const dossiers: Dossier[] = [dossier, dossierDepannage];

export const messagesInitiaux: Message[] = [
  {
    id: 'm1',
    auteur: 'technicien',
    texte: 'Je suis en route, j\'arrive dans environ 15 minutes.',
    heure: '10:42',
  },
  {
    id: 'm2',
    auteur: 'client',
    texte: 'Merci, je vous attends.',
    heure: '10:45',
  },
];

export const wifiInfo: WifiInfo = {
  actif: true,
  nomReseau: 'Fibre_Yves',
  motDePasse: 'CortexFibre2026!',
  appareilsConnectes: [
    { id: 'ap1', nom: 'iPhone de Yves', actif: true },
    { id: 'ap2', nom: 'Smart TV Salon', actif: true },
    { id: 'ap3', nom: 'PC Portable', actif: true },
  ],
};

export function toggleAppareilMock(appareils: AppareilConnecte[], id: string): AppareilConnecte[] {
  return appareils.map((a) => (a.id === id ? { ...a, actif: !a.actif } : a));
}

export const optionsRecharge: OptionRecharge[] = [
  { id: '1m', dureeLabel: '1 mois', prixFCFA: 15000 },
  { id: '3m', dureeLabel: '3 mois', prixFCFA: 45000 },
  { id: '6m', dureeLabel: '6 mois', prixFCFA: 90000 },
  { id: '12m', dureeLabel: '12 mois', prixFCFA: 180000 },
];

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    titre: 'Votre confirmation est requise',
    description: 'Veuillez valider le plan d\'implantation de la fibre optique pour votre adresse.',
    heure: 'Il y a 10 min',
    categorie: 'action_requise',
    lue: false,
  },
  {
    id: 'n2',
    titre: 'Votre technicien est en route',
    description: 'Marc D. arrivera dans environ 25 minutes à l\'adresse indiquée.',
    heure: '14:30',
    categorie: 'rendez_vous',
    lue: false,
  },
  {
    id: 'n3',
    titre: 'Votre fibre est active',
    description: 'L\'installation a été complétée avec succès. Vos services sont désormais actifs.',
    heure: 'Mar.',
    categorie: 'info',
    lue: true,
  },
  {
    id: 'n4',
    titre: 'Mise à jour du ticket',
    description: 'Un agent a répondu à votre demande concernant la configuration du routeur.',
    heure: 'Lun.',
    categorie: 'info',
    lue: true,
  },
];

export const reclamations: Reclamation[] = [];

export const libellesCategorieReclamation: Record<ReclamationCategorie, string> = {
  connexion_ne_fonctionne_pas: 'La connexion ne fonctionne pas',
  installation_non_realisee: "L'installation n'a pas été réalisée",
  installation_incomplete: "L'installation est incomplète",
  probleme_facture: 'Problème de facturation',
  autre: 'Autre problème',
};

export const descriptionsCategorieReclamation: Record<ReclamationCategorie, string> = {
  connexion_ne_fonctionne_pas: 'Box allumée mais pas d\'accès internet',
  installation_non_realisee: 'Le technicien n\'a pas pu terminer ou n\'est pas venu',
  installation_incomplete: 'Matériel manquant ou non fixé correctement',
  probleme_facture: 'Montant, paiement, options',
  autre: 'Précisez ci-dessous',
};

let compteurReclamation = 421;
export function genererNumeroReclamation(): string {
  const n = `SIG-2026-${String(compteurReclamation).padStart(5, '0')}`;
  compteurReclamation += 1;
  return n;
}

let compteurDossier = 126;
export function genererNumeroDossier(): string {
  const n = `CF-2026-${String(compteurDossier).padStart(5, '0')}`;
  compteurDossier += 1;
  return n;
}

export function nouvellesEtapesReclamation(): Reclamation['etapes'] {
  return [
    { id: 'envoyee', titre: 'Enregistré', date: 'Aujourd\'hui', statut: 'fait' },
    { id: 'analyse', titre: 'Analyse en cours', statut: 'en_cours' },
    { id: 'info', titre: 'Information de la suite', statut: 'a_venir' },
  ];
}

// Réponses simulées de l'assistant IA Cortex, choisies par mots-clés.
// Conçu pour être remplacé facilement par un vrai appel au modèle Cortex.
export const suggestionsCortex = [
  'Suis-je éligible à la fibre ?',
  'Où en est mon dossier ?',
  'Mon technicien est en retard',
  'Je veux faire une réclamation',
];

export function reponseCortex(question: string, dossierActuel: Dossier | null): string {
  const q = question.toLowerCase();

  if (q.includes('eligib') || q.includes('éligib')) {
    return 'Pour vérifier votre éligibilité, rendez-vous dans "Tester mon éligibilité" depuis l\'accueil et renseignez votre adresse. Je vous donne une réponse en quelques secondes.';
  }
  if (q.includes('dossier') || q.includes('suivi') || q.includes('où en est')) {
    if (dossierActuel) {
      const etapeEnCours = dossierActuel.etapes.find((e) => e.statut === 'en_cours');
      return etapeEnCours
        ? `Votre dossier ${dossierActuel.numero} en est à l'étape « ${etapeEnCours.titre} ». ${etapeEnCours.description}`
        : `Votre dossier ${dossierActuel.numero} suit son cours normalement.`;
    }
    return 'Je ne trouve pas de dossier en cours. Avez-vous déjà fait une demande d\'installation ?';
  }
  if (q.includes('retard') || q.includes('absent')) {
    return 'Je suis désolé pour ce désagrément. Vous pouvez signaler l\'absence du technicien directement depuis la fiche "Mon technicien", bouton "Signaler une absence". Souhaitez-vous que je vous y emmène ?';
  }
  if (q.includes('réclam') || q.includes('reclam') || q.includes('problème') || q.includes('probleme')) {
    return 'Je peux vous aider à déposer une réclamation. Rendez-vous dans "Mes réclamations" ou dites-moi ce qui ne va pas et je vous guide.';
  }
  if (q.includes('bonjour') || q.includes('salut') || q.includes('hello')) {
    return 'Bonjour ! Je suis Cortex, votre assistant Orange. Je peux vous aider sur votre éligibilité, le suivi de votre dossier, votre technicien ou une réclamation. Que puis-je faire pour vous ?';
  }
  if (q.includes('merci')) {
    return 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.';
  }
  return 'Je note votre message. Pour l\'instant je peux surtout vous aider sur : l\'éligibilité fibre, le suivi de dossier, votre technicien et les réclamations. Essayez une des suggestions ci-dessous 👇';
}
