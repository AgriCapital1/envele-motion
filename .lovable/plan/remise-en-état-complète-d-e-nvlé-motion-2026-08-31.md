# Remise en état complète d’E’NVLÉ MOTION

## Objectif
Remplacer l’écran placeholder par une application complète, mobile et desktop, où un utilisateur peut s’inscrire, créer et suivre une production vidéo, gérer ses ressources, et où le super-administrateur peut piloter la plateforme.

## Parcours public et authentification
- Construire une page d’accueil premium bleu nuit/or avec le logo fourni, une proposition de valeur claire et des accès vers l’inscription et la connexion.
- Ajouter `/auth` avec inscription par email/mot de passe et Google, confirmation d’email explicite, connexion et récupération de mot de passe.
- Ajouter la route publique `/reset-password` pour définir un nouveau mot de passe depuis un lien de récupération.
- Conserver le profil complet (nom, téléphone, pays, bio, langue, avatar) dans la base existante.
- Protéger toutes les pages métier dans le layout authentifié géré par Lovable Cloud et fournir une déconnexion propre.
- Déclarer le favicon existant et supprimer toute référence visuelle au placeholder par défaut.

## Rôle super-administrateur
- Mettre à jour le déclencheur d’inscription pour attribuer automatiquement et uniquement le rôle `super_admin` au compte dont l’email normalisé est `innocentkoffi1@gmail.com`.
- Garder les rôles dans `user_roles`, sans information d’autorisation modifiable côté navigateur.
- Protéger chaque fonction d’administration côté serveur par une vérification de rôle, en plus de masquer les routes admin aux utilisateurs ordinaires.

## Application utilisateur
- Créer un shell responsive avec navigation vers Tableau de bord, Créer une vidéo, Mes projets, Mes vidéos, Personnages et Mes crédits.
- Tableau de bord : solde, projets récents, productions actives, vidéos terminées et raccourci de création.
- Créer une vidéo : brief simple, durée, format, style, langue, estimation en crédits, aperçu de la Project Bible et bouton de génération.
- Projet/production : détails, Bible, séquences, progression actualisée, erreurs explicites, lecteur enchaîné des clips terminés et action Prolonger.
- Mes projets et Mes vidéos : listes filtrées strictement sur l’utilisateur connecté avec états vides, statuts et accès au détail.
- Personnages : création, édition et suppression des fiches personnelles existantes.
- Mes crédits : solde, historique des transactions et grille tarifaire active.

## Fonctions serveur et moteur IA
- Exposer des fonctions serveur authentifiées et validées pour créer, lire, avancer et prolonger une production ; l’identité vient exclusivement de la session vérifiée.
- Exposer les lectures agrégées du tableau de bord et les opérations administratives avec DTO sérialisables.
- Corriger le découpage/lecteur pour qu’une commande de 15 s soit présentée et lue sur exactement 15 s, même si le fournisseur génère des clips techniques de 4/6/8 s.
- Utiliser la clé `LOVABLE_API_KEY` déjà stockée dans Lovable Cloud pour Gemini et Veo via Lovable AI Gateway ; aucune clé ne sera exposée au navigateur.
- Respecter les erreurs du gateway : erreurs définitives affichées sans répétition, débit/saturation repris avec attente bornée, remboursement conservé en cas d’échec technique.

## Administration
- Ajouter un espace `/admin` réservé aux rôles autorisés avec indicateurs : utilisateurs, projets, générations, crédits distribués/consommés/vendus et activité récente.
- Ajouter la configuration tarifaire : durée, prix FCFA, crédits, coût estimé, marge, coefficient de sécurité et activation.
- Permettre au super-admin de consulter les utilisateurs, projets et générations sans ouvrir ces données aux comptes ordinaires.

## Design et accessibilité
- Appliquer l’identité premium existante (bleu nuit, or, Sora/Manrope), avec composants cohérents, formulaires lisibles, états de chargement et erreurs accessibles.
- Optimiser d’abord le mobile observé dans la capture, puis vérifier les vues desktop ; aucune superposition, texte tronqué ou route blanche.
- Ajouter des métadonnées uniques à chaque route et conserver un seul H1 par page.

## Validation
- Vérifier le build et les erreurs runtime après chaque lot.
- Tester les routes publiques, les redirections protégées, l’inscription, la connexion, la récupération du mot de passe et la déconnexion.
- Tester l’isolation des données entre utilisateurs et le refus de l’administration pour un compte standard.
- Inscrire/connecter `innocentkoffi1@gmail.com` et confirmer son rôle `super_admin` côté serveur.
- Lancer une vraie production de 15 s, suivre les jobs jusqu’à la fin, vérifier le stockage privé, la lecture séquentielle à 15 s, la consommation des crédits et la visibilité dans Mes projets/Mes vidéos.

## Connexion des clés Google
- Pour l’IA, la clé Lovable AI existante donne déjà accès à Gemini et Veo et reste la solution par défaut sécurisée.
- Si une clé Google directe devient nécessaire, elle sera ajoutée comme secret serveur dans Lovable Cloud puis l’adaptateur provider-agnostic sera configuré pour la lire uniquement côté serveur.
- Pour la connexion Google des utilisateurs, activer le fournisseur Google géré par Lovable Cloud en même temps que le bouton de connexion ; aucune clé OAuth manuelle n’est requise par défaut.
