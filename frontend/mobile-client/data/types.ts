// Types métier de l'application CLIENT — CORTEX FIBER.
// Cette couche de types est volontairement découplée des services mockés
// pour permettre à l'équipe backend de brancher une vraie API plus tard
// sans toucher aux écrans (voir dossier `services/`).

export type EligibiliteStatut = 'eligible' | 'non_eligible' | 'zone_a_etudier';

export interface Adresse {
  numero: string;
  rue: string;
  codePostal: string;
  ville: string;
  complement?: string;
}

export interface Client {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  adresse: Adresse;
}

export type DossierEtapeId =
  | 'adresse_verifiee'
  | 'demande_recue'
  | 'demande_validee'
  | 'rdv_a_planifier'
  | 'technicien_assigne'
  | 'installation'
  | 'confirmation_client'
  | 'fibre_active';

export type EtapeStatut = 'fait' | 'en_cours' | 'a_venir';

export interface DossierEtape {
  id: DossierEtapeId;
  titre: string;
  description: string;
  date?: string;
  statut: EtapeStatut;
}

export type DossierStatutGlobal = 'en_cours' | 'termine' | 'bloque';

export type DossierType = 'installation_fibre' | 'depannage_box' | 'demenagement' | 'changement_offre';

export interface Technicien {
  id: string;
  prenom: string;
  nom: string;
  note: number;
  telephone: string;
  vehicule: string;
  immatriculation: string;
  initiales: string;
  heureArriveeEstimee: string;
}

export interface RendezVous {
  date: string;
  creneau: string;
}

export interface Offre {
  id: string;
  nom: string;
  debit: string;
  prixFCFA: number;
  avantages: string[];
  icone: string;
}

export interface Dossier {
  id: string;
  numero: string;
  type: DossierType;
  statutGlobal: DossierStatutGlobal;
  etapes: DossierEtape[];
  technicien?: Technicien;
  rdv?: RendezVous;
  adresse: Adresse;
  interventionAConfirmer: boolean;
  offre?: Offre;
  dateActivation?: string;
}

export type Auteur = 'client' | 'technicien' | 'cortex';

export interface Message {
  id: string;
  auteur: Auteur;
  texte: string;
  heure: string;
}

export type ReclamationCategorie =
  | 'connexion_ne_fonctionne_pas'
  | 'installation_non_realisee'
  | 'installation_incomplete'
  | 'probleme_facture'
  | 'autre';

export type ReclamationStatut = 'ouverte' | 'en_traitement' | 'resolue';

export interface EtapeReclamation {
  id: string;
  titre: string;
  date?: string;
  statut: EtapeStatut;
}

export interface Reclamation {
  id: string;
  numero: string;
  categorie: ReclamationCategorie;
  description: string;
  date: string;
  statut: ReclamationStatut;
  etapes: EtapeReclamation[];
}

export interface ResultatEligibilite {
  statut: EligibiliteStatut;
  adresse: Adresse;
  debitEstime?: string;
  dateDisponibilitePrevue?: string;
}

export interface AppareilConnecte {
  id: string;
  nom: string;
  actif: boolean;
}

export interface WifiInfo {
  actif: boolean;
  nomReseau: string;
  motDePasse: string;
  appareilsConnectes: AppareilConnecte[];
}

export interface OptionRecharge {
  id: string;
  dureeLabel: string;
  prixFCFA: number;
}

export type NotificationCategorie = 'action_requise' | 'rendez_vous' | 'info';

export interface NotificationItem {
  id: string;
  titre: string;
  description: string;
  heure: string;
  categorie: NotificationCategorie;
  lue: boolean;
}
