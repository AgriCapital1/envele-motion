/**
 * Domaine officiel E'nvlé Motion.
 * Tous les e-mails (confirmation d'inscription, réinitialisation de mot de passe)
 * doivent renvoyer ici, jamais vers une adresse technique de développement.
 */
export const OFFICIAL_SITE_URL = "https://motion.ivoireprojet.com";

/** Base à utiliser pour les liens envoyés par e-mail. */
export function authRedirectBase(): string {
  return OFFICIAL_SITE_URL;
}
