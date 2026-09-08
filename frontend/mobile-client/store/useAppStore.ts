// Store applicatif (zustand) — état central de l'app CLIENT.
// Toutes les actions qui "parlent au backend" sont regroupées ici et
// simulées avec des données mock. C'est le point d'intégration unique
// à modifier quand l'équipe backend expose ses vraies routes.

import { create } from 'zustand';

import {
  client as clientMock,
  dossiers as dossiersMock,
  genererNumeroDossier,
  genererNumeroReclamation,
  libellesCategorieReclamation,
  messagesInitiaux,
  notifications as notificationsMock,
  nouvellesEtapesReclamation,
  reponseCortex,
  technicien as technicienMock,
  wifiInfo as wifiInfoMock,
} from '@/data/mockData';
import {
  Adresse,
  AppareilConnecte,
  Client,
  Dossier,
  DossierEtape,
  Message,
  NotificationItem,
  Offre,
  Reclamation,
  ReclamationCategorie,
  ResultatEligibilite,
  WifiInfo,
} from '@/data/types';
import { verifierEligibilite as verifierEligibiliteService } from '@/services/eligibiliteService';

function heureActuelle(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface DemandeInstallationParams {
  adresse: Adresse;
  offre: Offre;
  telephone: string;
}

interface AppState {
  client: Client;
  dossiers: Dossier[];
  dossier: Dossier | null;
  messagesTechnicien: Message[];
  messagesCortex: Message[];
  reclamations: Reclamation[];
  wifi: WifiInfo;
  notifications: NotificationItem[];

  eligibiliteResult: ResultatEligibilite | null;
  eligibiliteLoading: boolean;
  demandeEnCours: boolean;
  rechargeEnCours: boolean;

  technicienAbsentSignale: boolean;

  verifierEligibilite: (adresse: Adresse) => Promise<ResultatEligibilite>;
  reinitialiserEligibilite: () => void;

  creerDemandeInstallation: (params: DemandeInstallationParams) => Promise<Dossier>;
  dossierParId: (id: string) => Dossier | undefined;

  envoyerMessageTechnicien: (texte: string) => void;
  signalerTechnicienAbsent: () => void;
  confirmerFinIntervention: () => void;

  creerReclamation: (categorie: ReclamationCategorie, description: string) => Reclamation;

  toggleAppareilWifi: (id: string) => void;
  effectuerRecharge: (optionId: string) => Promise<void>;
  marquerNotificationLue: (id: string) => void;

  envoyerMessageCortex: (texte: string) => void;
}

function remplacerDossier(dossiers: Dossier[], maj: Dossier): Dossier[] {
  return dossiers.map((d) => (d.id === maj.id ? maj : d));
}

export const useAppStore = create<AppState>((set, get) => ({
  client: clientMock,
  dossiers: dossiersMock,
  dossier: dossiersMock[0] ?? null,
  messagesTechnicien: messagesInitiaux,
  messagesCortex: [
    {
      id: 'cortex-0',
      auteur: 'cortex',
      texte: `Bonjour ${clientMock.prenom} 👋 Je suis Cortex, votre assistant Orange. Comment puis-je vous aider aujourd'hui ?`,
      heure: heureActuelle(),
    },
  ],
  reclamations: [],
  wifi: wifiInfoMock,
  notifications: notificationsMock,

  eligibiliteResult: null,
  eligibiliteLoading: false,
  demandeEnCours: false,
  rechargeEnCours: false,

  technicienAbsentSignale: false,

  verifierEligibilite: async (adresse) => {
    set({ eligibiliteLoading: true, eligibiliteResult: null });
    const resultat = await verifierEligibiliteService(adresse);
    set({ eligibiliteResult: resultat, eligibiliteLoading: false });
    return resultat;
  },

  reinitialiserEligibilite: () => set({ eligibiliteResult: null }),

  dossierParId: (id) => get().dossiers.find((d) => d.id === id),

  creerDemandeInstallation: async ({ adresse, offre }) => {
    set({ demandeEnCours: true });
    await delay(1100);

    const etapes: DossierEtape[] = [
      { id: 'adresse_verifiee', titre: 'Adresse vérifiée', description: 'Votre adresse a été confirmée comme éligible à la fibre.', date: 'Aujourd\'hui', statut: 'fait' },
      { id: 'demande_recue', titre: 'Demande reçue', description: 'Documents enregistrés.', date: 'Aujourd\'hui', statut: 'fait' },
      { id: 'demande_validee', titre: 'Demande validée', description: 'Votre dossier est en cours de validation.', statut: 'en_cours' },
      { id: 'rdv_a_planifier', titre: 'Rendez-vous à planifier', description: 'Un créneau d\'intervention vous sera proposé.', statut: 'a_venir' },
      { id: 'technicien_assigne', titre: 'Technicien assigné', description: 'Un technicien sera affecté à votre installation.', statut: 'a_venir' },
      { id: 'installation', titre: 'Installation', description: 'Le technicien interviendra chez vous.', statut: 'a_venir' },
      { id: 'confirmation_client', titre: 'Confirmation client', description: 'Vous confirmerez la fin de l\'intervention.', statut: 'a_venir' },
      { id: 'fibre_active', titre: 'Fibre active', description: 'Votre fibre sera activée et prête à l\'emploi.', statut: 'a_venir' },
    ];

    const nouveauDossier: Dossier = {
      id: `dos-${Date.now()}`,
      numero: genererNumeroDossier(),
      type: 'installation_fibre',
      statutGlobal: 'en_cours',
      etapes,
      adresse,
      interventionAConfirmer: false,
      offre,
    };

    set((state) => ({
      dossier: nouveauDossier,
      dossiers: [nouveauDossier, ...state.dossiers],
      demandeEnCours: false,
    }));
    return nouveauDossier;
  },

  envoyerMessageTechnicien: (texte) => {
    const nouveauMessage: Message = {
      id: `m-${Date.now()}`,
      auteur: 'client',
      texte,
      heure: heureActuelle(),
    };
    set((state) => ({ messagesTechnicien: [...state.messagesTechnicien, nouveauMessage] }));

    // Réponse simulée du technicien pour une démo vivante.
    setTimeout(() => {
      const reponse: Message = {
        id: `m-${Date.now() + 1}`,
        auteur: 'technicien',
        texte: 'Bien reçu, merci pour votre message !',
        heure: heureActuelle(),
      };
      set((state) => ({ messagesTechnicien: [...state.messagesTechnicien, reponse] }));
    }, 1400);
  },

  signalerTechnicienAbsent: () => {
    set({ technicienAbsentSignale: true });
    const dossier = get().dossier;
    if (dossier) {
      const maj: Dossier = {
        ...dossier,
        etapes: dossier.etapes.map((e) =>
          e.id === 'installation'
            ? { ...e, description: 'Signalement d\'absence transmis, un conseiller revient vers vous.' }
            : e
        ),
      };
      set((state) => ({ dossier: maj, dossiers: remplacerDossier(state.dossiers, maj) }));
    }
  },

  confirmerFinIntervention: () => {
    const dossier = get().dossier;
    if (!dossier) return;
    const maintenant = new Date();
    const dateActivation =
      maintenant.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) +
      ` à ${heureActuelle().replace(':', 'h')}`;

    const maj: Dossier = {
      ...dossier,
      statutGlobal: 'termine',
      interventionAConfirmer: false,
      dateActivation,
      etapes: dossier.etapes.map((e) => {
        if (e.id === 'installation') return { ...e, statut: 'fait', date: 'Aujourd\'hui' };
        if (e.id === 'confirmation_client') return { ...e, statut: 'fait', date: 'Aujourd\'hui' };
        if (e.id === 'fibre_active') return { ...e, statut: 'fait', date: 'Aujourd\'hui' };
        return e;
      }),
    };
    set((state) => ({ dossier: maj, dossiers: remplacerDossier(state.dossiers, maj) }));
  },

  creerReclamation: (categorie, description) => {
    const reclamation: Reclamation = {
      id: `rec-${Date.now()}`,
      numero: genererNumeroReclamation(),
      categorie,
      description,
      date: 'Aujourd\'hui',
      statut: 'ouverte',
      etapes: nouvellesEtapesReclamation(),
    };
    set((state) => ({ reclamations: [reclamation, ...state.reclamations] }));
    return reclamation;
  },

  toggleAppareilWifi: (id) => {
    set((state) => ({
      wifi: {
        ...state.wifi,
        appareilsConnectes: state.wifi.appareilsConnectes.map((a: AppareilConnecte) =>
          a.id === id ? { ...a, actif: !a.actif } : a
        ),
      },
    }));
  },

  effectuerRecharge: async (_optionId) => {
    set({ rechargeEnCours: true });
    await delay(1000);
    set({ rechargeEnCours: false });
  },

  marquerNotificationLue: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, lue: true } : n)),
    }));
  },

  envoyerMessageCortex: (texte) => {
    const messageClient: Message = {
      id: `c-${Date.now()}`,
      auteur: 'client',
      texte,
      heure: heureActuelle(),
    };
    set((state) => ({ messagesCortex: [...state.messagesCortex, messageClient] }));

    setTimeout(() => {
      const reponse: Message = {
        id: `c-${Date.now() + 1}`,
        auteur: 'cortex',
        texte: reponseCortex(texte, get().dossier),
        heure: heureActuelle(),
      };
      set((state) => ({ messagesCortex: [...state.messagesCortex, reponse] }));
    }, 900);
  },
}));

// Ré-export pratique pour les écrans qui n'ont besoin que du technicien mock
// avant qu'un vrai dossier ne soit créé (ex: écran technicien en accès direct).
export { technicienMock, libellesCategorieReclamation };
