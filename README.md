# E'nvlé Motion Studio

CAHIER DES CHARGES FINAL

E’NVLÉ MOTION

Imaginez. Décrivez. Réalisez.

1. VISION DU PRODUIT

E’nvlé Motion est une plateforme SaaS premium de création audiovisuelle assistée par intelligence artificielle.

E’nvlé Motion n’est pas un simple générateur de clips vidéo.

C’est un réalisateur audiovisuel IA capable de comprendre une idée exprimée naturellement par l’utilisateur, de la transformer en production audiovisuelle structurée, puis de réaliser automatiquement une vidéo cohérente, professionnelle et prête à être diffusée.

L’utilisateur n’a pas besoin de savoir écrire des prompts.

Il décrit simplement ce qu’il veut.

E’nvlé Motion :

comprend → scénarise → planifie → crée → contrôle → corrige → assemble → finalise.

Positionnement

L’utilisateur apporte l’idée. E’nvlé Motion réalise le film.

La priorité du produit est :

qualité ;

cohérence ;

fidélité au brief ;

continuité ;

qualité audio ;

qualité visuelle ;

langues et accents africains ;

simplicité ;

rapidité ;

optimisation des coûts.

Le produit doit être premium sans devenir inutilement complexe.

2. IDENTITÉ

Nom : E’nvlé Motion

Signature :

Imaginez. Décrivez. Réalisez.

Le produit doit conserver la cohérence graphique avec l’écosystème E’nvlé existant.

3. PUBLICS CIBLES

E’nvlé Motion doit être utilisable par :

particuliers ;

créateurs de contenu ;

artistes ;

réalisateurs ;

influenceurs ;

entreprises ;

agences ;

médias ;

établissements ;

associations ;

institutions ;

studios ;

équipes de communication ;

agences publicitaires.

Le produit doit particulièrement être pensé pour les marchés africains.

4. EXPÉRIENCE UTILISATEUR

L'utilisateur ne doit pas avoir besoin de comprendre :

les prompts ;

les modèles ;

les tokens ;

les APIs ;

les générations intermédiaires ;

les paramètres techniques ;

les contraintes des modèles vidéo.

Exemple :

« Fais-moi une publicité de 60 secondes pour Scoly. Deux jeunes, Dorkas et Bertrand, discutent de la rentrée scolaire. Dorkas porte un pantalon blanc et un haut bleu. Bertrand porte un jean noir et une chemise blanche. Ils parlent avec un accent ivoirien. Style publicitaire premium et réaliste. À la fin afficher exactement : AVEC SCOLY, MA RENTRÉE EST PAISIBLE. »

L’utilisateur choisit :

60 secondes

Puis :

RÉALISER

Le système fait automatiquement le reste.

5. DURÉES

L'interface doit proposer :

15 secondes ;

30 secondes ;

45 secondes ;

1 minute ;

1 min 30 ;

2 minutes ;

3 minutes ;

5 minutes ;

durée personnalisée selon les droits du compte.

RÈGLE FONDAMENTALE

Une vidéo de 60 secondes doit être considérée comme UNE production audiovisuelle de 60 secondes.

Une vidéo de 3 minutes doit être considérée comme UNE production audiovisuelle de 3 minutes.

Une vidéo de 5 minutes doit être considérée comme UNE production audiovisuelle de 5 minutes.

Les contraintes techniques des modèles doivent être invisibles pour l'utilisateur.

Le système peut effectuer plusieurs opérations internes, mais l'utilisateur ne doit jamais être obligé de :

découper manuellement ;

générer chaque scène ;

assembler les scènes ;

répéter les références ;

monter la vidéo dans CapCut ou un autre logiciel.

6. PROLONGER

Chaque production doit disposer d'un bouton :

➕ PROLONGER

Options :

+15 s ;

+30 s ;

+45 s ;

+1 min ;

+2 min ;

+3 min ;

durée personnalisée.

La prolongation doit être une véritable continuation.

Elle doit conserver automatiquement :

personnages ;

visages ;

vêtements ;

coiffures ;

accessoires ;

voix ;

accents ;

décors ;

objets ;

lumière ;

style ;

histoire ;

chronologie ;

relations ;

contexte ;

état des personnages ;

dernière action ;

dernière position ;

ambiance.

Exemple :

Production initiale :

0:00 → 1:00

Prolonger +1 minute :

1:00 → 2:00

Puis :

2:00 → 3:00

La nouvelle partie ne doit jamais simplement répéter la précédente.

7. E’NVLÉ MOTION DIRECTOR ENGINE

Créer une couche propriétaire :

E’nvlé Motion Director Engine

Elle constitue le cerveau d'orchestration de la plateforme.

Architecture :

Utilisateur
↓
Brief
↓
Brief Analyzer
↓
Director Engine
↓
Project Bible
↓
Story Engine
↓
Character Engine
↓
Dialogue Engine
↓
Voice Engine
↓
Continuity Engine
↓
Model Router
↓
Generation Engine
↓
Quality Control Engine
↓
Composition Engine
↓
Final Video

Le texte brut de l’utilisateur ne doit jamais être envoyé aveuglément à un modèle.

Le système doit d'abord le comprendre et le structurer.

8. BRIEF ANALYZER

Analyser automatiquement :

objectif ;

type de vidéo ;

durée ;

public ;

personnages ;

lieux ;

produits ;

marque ;

dialogues ;

narration ;

langue ;

accent ;

musique ;

ambiance ;

style ;

texte à l'écran ;

format ;

contraintes ;

références fournies.

Le système doit détecter les contradictions.

Exemple :

Si l'utilisateur écrit :

« Dorkas porte un pantalon blanc »

puis plus loin :

« Dorkas porte un pantalon noir »

le système doit détecter la contradiction et demander une clarification ou appliquer la règle de priorité définie dans le projet.

9. PROJECT BIBLE

Chaque projet possède une Bible persistante.

PERSONNAGES

Pour chaque personnage :

identifiant ;

nom ;

âge apparent ;

sexe ;

apparence ;

visage ;

teint ;

morphologie ;

coiffure ;

vêtements ;

chaussures ;

accessoires ;

personnalité ;

rôle ;

relations ;

voix ;

accent ;

langue ;

expressions ;

références visuelles.

DÉCORS

lieu ;

architecture ;

mobilier ;

environnement ;

météo ;

lumière ;

époque ;

ambiance ;

éléments permanents.

OBJETS

produits ;

téléphones ;

véhicules ;

emballages ;

logos ;

accessoires ;

objets narratifs.

STYLE

réalisme ;

cinématographie ;

objectif caméra ;

mouvement caméra ;

profondeur de champ ;

lumière ;

ambiance ;

palette ;

rythme ;

direction artistique.

La Bible est persistante pendant toute la durée du projet.

10. CHARACTER STUDIO

Créer un véritable espace de création et de gestion des personnages.

L'utilisateur peut :

créer un personnage à partir d'une description ;

créer un personnage à partir d'images ;

importer un personnage existant ;

modifier un personnage ;

dupliquer un personnage ;

sauvegarder un personnage ;

réutiliser un personnage dans plusieurs projets.

RÉFÉRENCES VISUELLES

Chaque personnage peut recevoir jusqu'à :

10 images de référence

Ces images peuvent montrer :

visage ;

profil ;

trois-quarts ;

corps entier ;

vêtements ;

expressions ;

coiffure ;

accessoires ;

différentes poses ;

différentes situations.

Le système doit analyser les références afin de créer une représentation cohérente du personnage.

11. RECONNAISSANCE DES RÉFÉRENCES

L'IA doit pouvoir analyser :

nom du fichier ;

texte présent dans l'image ;

métadonnées disponibles ;

contexte du projet.

Exemple :

Fichiers :

Dorkas_face.jpg

Dorkas_fullbody.jpg

Dorkas_profile.jpg

Le système doit comprendre que ces images appartiennent au même personnage :

DORKAS

Même logique pour jusqu'à 10 personnages principaux ou davantage selon les capacités techniques du projet.

12. CHARACTER LOCK

Chaque personnage possède un état de verrouillage.

Exemple :

DORKAS

Visage : LOCK
Coiffure : LOCK
Pantalon : BLANC — LOCK
Haut : BLEU — LOCK
Chaussures : BLANCHES — LOCK

BERTRAND

Visage : LOCK
Jean : NOIR — LOCK
Chemise : BLANCHE — LOCK
Chaussures : NOIRES — LOCK

Toute génération ultérieure doit respecter ces caractéristiques.

Une modification volontaire doit créer une nouvelle version.

13. MINI-SÉRIES

Créer un système de séries.

Une série possède :

titre ;

univers ;

personnages ;

lieux ;

chronologie ;

style ;

voix ;

bible générale ;

épisodes.

Chaque épisode hérite automatiquement de la continuité de la série.

Objectif :

Permettre de créer des séries, feuilletons, mini-films et campagnes publicitaires récurrentes sans recréer les personnages à chaque fois.

14. PROTECTION DES PERSONNAGES

Le système doit empêcher les incohérences involontaires.

Il doit notamment éviter :

changement de visage ;

changement de coiffure ;

changement de vêtements ;

changement de couleur des vêtements ;

changement arbitraire d'âge ;

mélange de deux personnages ;

fusion de visages ;

apparition/disparition incohérente d'accessoires.

Prévoir des mécanismes de détection et de correction automatique.

15. PERSONNALITÉS PUBLIQUES ET PROTECTION

Prévoir des règles de sécurité empêchant la création non autorisée de personnages ressemblant de manière trompeuse à des personnalités réelles lorsque cela est interdit par les politiques applicables.

Le système doit appliquer les règles de sécurité et de génération en vigueur chez les fournisseurs IA.

16. DIALOGUE ENGINE

Créer un système strict d'attribution des dialogues.

Exemple :

BERTRAND :
« Tu as déjà acheté tes fournitures ? »

DORKAS :
« Pas encore. Je vais commander sur Scoly. »

BERTRAND :
« C'est vraiment aussi simple ? »

DORKAS :
« Oui. Avec Scoly, la rentrée est paisible. »

Chaque réplique doit être liée à un identifiant de personnage.

Le moteur doit empêcher :

inversion des répliques ;

mauvais locuteur ;

voix attribuée au mauvais personnage ;

mélange des voix ;

réponse par le même personnage ;

chevauchement involontaire.

17. VOICE ENGINE

Chaque personnage doit pouvoir posséder une voix persistante.

Une voix possède :

nom ;

sexe ;

âge vocal ;

langue ;

accent ;

région ;

style ;

tonalité ;

vitesse ;

registre ;

identifiant ;

fournisseur ;

modèle ;

statut de validation.

Une voix sélectionnée dans un projet reste verrouillée sauf modification volontaire.

RÈGLE

Une voix = une identité.

Le système ne doit jamais mélanger deux voix pour un même personnage.

18. ADMIN — VOICE LAB

Créer dans l'administration un espace :

VOICE LAB

L'administrateur / Super Admin / équipe autorisée peut :

importer des enregistrements vocaux ;

créer un profil vocal ;

attribuer un nom ;

définir sexe ;

langue ;

accent ;

région ;

âge vocal ;

style ;

catégorie ;

tags ;

statut ;

fournisseur ;

modèle ;

droits d'utilisation.

Le système peut analyser les enregistrements autorisés afin de créer un profil vocal exploitable lorsque le fournisseur et les droits le permettent.

Exemples :

Voix masculine — Côte d'Ivoire — Français ivoirien

Voix féminine — Côte d'Ivoire — Baoulé

Voix masculine — Sénégal — Français sénégalais

Voix féminine — Sénégal — Wolof

etc.

19. VOIX AFRICAINES

Créer une bibliothèque de voix organisée par :

pays ;

région ;

langue ;

accent ;

sexe ;

âge ;

style.

L'utilisateur peut rechercher :

Voix féminine → Côte d'Ivoire → Baoulé

Le système sélectionne automatiquement une voix compatible.

Pour chaque voix, afficher clairement son niveau de validation.

20. CONSENTEMENT ET DROITS SUR LES VOIX

Toute voix importée par l'administration doit être accompagnée des informations relatives :

à la source ;

au propriétaire ;

au consentement ;

aux droits d'utilisation ;

à la durée d'autorisation ;

aux restrictions.

Ne jamais permettre l'utilisation d'une voix dont les droits ne sont pas correctement établis.

21. E’NVLÉ LINGUA

Créer un module linguistique propriétaire :

E’NVLÉ LINGUA

Objectif :

Faire d'E'nvlé Motion une plateforme audiovisuelle réellement adaptée aux langues africaines.

Langues prioritaires :

français ;

dioula ;

baoulé ;

bété ;

gouro ;

wê ;

autres langues progressivement.

22. BASE LINGUISTIQUE

Chaque entrée doit pouvoir contenir :

langue ;

mot ;

expression ;

traduction française ;

traduction anglaise ;

signification ;

contexte ;

exemple ;

prononciation ;

variante régionale ;

orthographe ;

source ;

niveau de confiance ;

niveau de validation ;

validateur ;

date de validation.

Statuts :

IA proposée

À vérifier

Validée par locuteur natif

Validée par expert

Validée professionnellement

23. RÈGLE LINGUISTIQUE ABSOLUE

E'nvlé Motion ne doit jamais présenter une traduction inventée comme une traduction officielle.

Si une donnée linguistique n'est pas suffisamment fiable :

Validation humaine recommandée.

Ne jamais halluciner :

mot ;

expression ;

traduction ;

prononciation ;

signification.

24. TRADUCTION ET PRONONCIATION

Exemple :

Français :

« Dis à ma mère que je rentrerai demain matin. »

Le système peut proposer :

Baoulé

→ traduction

→ prononciation

→ signification

→ version vocale.

L'utilisateur peut écouter la prononciation avant validation.

25. AUDIO ET MUSIQUE

Prévoir :

voix ;

dialogues ;

narration ;

musique ;

ambiance ;

bruitages ;

mixage ;

ducking automatique ;

volume ;

synchronisation ;

fondu ;

normalisation.

Le système doit pouvoir sélectionner automatiquement le moteur adapté.

26. TEXTE À L'ÉCRAN

Le texte explicitement fourni par l'utilisateur est une donnée déterministe.

Exemple :

AVEC SCOLY, MA RENTRÉE EST PAISIBLE

Le système doit conserver exactement :

orthographe ;

accents ;

ponctuation ;

majuscules ;

chiffres ;

ordre des mots.

Ne jamais demander au modèle vidéo de générer du texte lorsqu'une composition logicielle peut le faire exactement.

Le texte doit être ajouté au moment de la composition finale.

Paramètres :

police ;

taille ;

couleur ;

position ;

animation ;

durée ;

alignement ;

arrière-plan ;

ombre ;

opacité.

27. LOGOS ET MARQUES

Les logos fournis par l'utilisateur doivent être utilisés comme assets réels.

Ne pas demander au modèle vidéo de recréer un logo complexe.

Le système doit préserver :

logo ;

proportions ;

couleurs ;

texte ;

identité visuelle.

28. CONTINUITÉ VISUELLE

Créer :

Visual Continuity Engine

Il vérifie entre les différentes parties :

personnages ;

vêtements ;

visages ;

accessoires ;

lieux ;

objets ;

lumière ;

météo ;

style ;

époque ;

position temporelle.

Une vidéo longue doit être traitée comme un seul récit continu, même si plusieurs opérations techniques sont effectuées derrière.

29. QUALITY CONTROL ENGINE

Après chaque génération importante, analyser automatiquement :

identité des personnages ;

visage ;

vêtements ;

couleurs ;

nombre de personnages ;

dialogues ;

voix ;

synchronisation ;

décor ;

objets ;

marque ;

logo ;

texte ;

continuité ;

artefacts ;

qualité audio ;

conformité au brief.

Attribuer un :

QUALITY SCORE

Exemple :

94/100

Si une erreur critique est détectée :

→ correction automatique.

30. RÉGÉNÉRATION INTELLIGENTE

Ne jamais recommencer inutilement toute une production.

Avant une correction :

identifier le problème ;

conserver les éléments validés ;

modifier uniquement les paramètres nécessaires ;

régénérer la partie concernée lorsque techniquement possible ;

réintégrer le résultat ;

effectuer un nouveau contrôle.

31. ERREURS TECHNIQUES NON FACTURÉES

Une erreur provoquée par le système ou par le fournisseur ne doit pas devenir une nouvelle facture pour l'utilisateur.

Exemples :

mauvais locuteur ;

mauvais vêtement ;

texte incorrect ;

erreur de continuité ;

génération techniquement défectueuse.

Les régénérations internes nécessaires à la conformité doivent être absorbées dans le coût opérationnel prévu par le Pricing Engine.

32. MODEL ROUTER

Créer :

AI MODEL ROUTER

Le système choisit automatiquement le modèle adapté à chaque opération.

Exemple :

Analyse du brief
→ modèle de raisonnement

Image
→ meilleur modèle image disponible

Vidéo
→ Gemini Omni prioritaire

Vidéo très haute qualité
→ modèle premium approprié

Voix
→ meilleur moteur TTS disponible

Langue
→ moteur + base linguistique

Composition
→ logiciel déterministe

33. CHOIX MANUEL DU MODÈLE

L'utilisateur avancé doit pouvoir choisir le modèle.

Pour la vidéo :

Automatique ;

Gemini Omni ;

autres modèles disponibles.

Pour les images :

modèle standard ;

modèle premium ;

autres modèles disponibles.

Le système doit afficher :

modèle ;

qualité ;

coût en crédits ;

résolution ;

capacités ;

éventuelles limites.

Le mode automatique reste recommandé pour les utilisateurs ordinaires.

34. ARCHITECTURE PROVIDER-AGNOSTIC

Ne jamais enfermer E'nvlé Motion dans un seul fournisseur.

Créer :

AI Provider Adapter

avec interfaces :

generateVideo();

extendVideo();

generateImage();

generateSpeech();

generateMusic();

analyzeText();

translate();

analyzeReference();

checkQuality().

Permettre l'ajout futur de nouveaux fournisseurs sans reconstruire l'application.

35. GEMINI / GOOGLE API

Prévoir l'intégration sécurisée des API Google nécessaires.

Le moteur vidéo doit privilégier Gemini Omni lorsque ses capacités correspondent à la production demandée.

Prévoir également les modèles image et audio disponibles.

L'architecture doit permettre l'évolution lorsque Google ajoute ou retire des modèles.

36. CLÉS API

Toutes les clés doivent rester côté serveur.

Prévoir notamment :

GOOGLE_API_KEY

GEMINI_API_KEY

SUPABASE_URL

SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

La Service Role Key ne doit JAMAIS être exposée au navigateur.

Les clés doivent être stockées dans des Secrets / Environment Variables sécurisés.

37. JOBS ASYNCHRONES

Les productions longues doivent fonctionner en arrière-plan.

États :

QUEUED

→ PLANNED

→ ANALYZING

→ GENERATING

→ QUALITY_CHECK

→ REGENERATING

→ COMPOSITING

→ FINALIZING

→ COMPLETED

États d'erreur :

FAILED

CANCELLED

PAUSED

Le traitement doit continuer même si l'utilisateur ferme son navigateur.

38. PRODUCTION LONGUE

Pour une vidéo de 3 ou 5 minutes :

L'utilisateur demande simplement :

Créer une vidéo de 5 minutes

Le système orchestre automatiquement les opérations nécessaires.

L'utilisateur ne voit pas :

les sous-générations ;

les scènes techniques ;

les appels API ;

les retries ;

les contrôles.

Il voit :

Production en cours — 43 %

Puis :

Votre film est prêt.

39. COMPOSITION ENGINE

Utiliser un moteur logiciel pour :

assembler ;

synchroniser ;

ajouter les textes ;

ajouter les logos ;

mixer l'audio ;

gérer les transitions ;

gérer les sous-titres ;

exporter ;

produire différentes résolutions.

FFmpeg ou une solution équivalente peut être utilisé côté serveur.

40. FORMATS

Prévoir :

16:9 ;

9:16 ;

1:1 ;

4:5.

Exports adaptés :

YouTube ;

TikTok ;

Instagram ;

Facebook ;

WhatsApp ;

présentation ;

publicité.

41. MODE SIMPLE

Interface extrêmement simple :

Que voulez-vous créer ?

Grand champ :

Décrivez votre idée...

Puis :

Durée

15 s | 30 s | 45 s | 1 min | 1:30 | 2 min | 3 min | 5 min

Format

16:9 | 9:16 | 1:1 | 4:5

Style

Réaliste | Publicitaire | Cinématographique | Documentaire | Clip musical | Institutionnel | Réseaux sociaux | Animation

Langue

Français | Dioula | Baoulé | Bété | Gouro | Wê | etc.

Modèle

Automatique | Omni | autres modèles disponibles

RÉALISER

42. MODE EXPERT

Les professionnels peuvent modifier :

scénario ;

scènes ;

personnages ;

dialogues ;

caméra ;

style ;

voix ;

musique ;

texte ;

références ;

durée ;

ordre ;

modèle ;

paramètres avancés.

Le mode expert ne doit jamais compliquer le mode simple.

43. GESTION DES PROJETS

Chaque utilisateur possède :

projets ;

versions ;

personnages ;

assets ;

scripts ;

vidéos ;

séries.

Fonctions :

Créer

Dupliquer

Renommer

Archiver

Supprimer

Restaurer

Partager

44. VERSIONING

Créer :

v1

v2

v3

etc.

Chaque modification importante doit produire une nouvelle version.

Une version validée ne doit jamais être détruite sans confirmation.

45. ASSETS

Permettre de stocker :

images ;

vidéos ;

logos ;

musiques ;

sons ;

voix ;

personnages ;

références ;

documents.

Créer une bibliothèque personnelle réutilisable.

46. PARTAGE DE PROJET

Prévoir la possibilité de partager un projet selon les droits :

lecture ;

commentaire ;

édition ;

génération ;

administration.

47. ESPACE ENTREPRISE

Créer :

Organizations

Une entreprise peut posséder :

organisation ;

membres ;

équipes ;

projets ;

rôles ;

crédits ;

abonnement.

Rôles :

Owner ;

Admin ;

Manager ;

Creator ;

Editor ;

Viewer.

Une entreprise peut inviter plusieurs utilisateurs.

Les membres peuvent travailler sur les mêmes projets selon leurs permissions.

48. GESTION DES ÉQUIPES

Permettre :

invitation ;

suppression ;

changement de rôle ;

permissions ;

projets partagés ;

historique des actions ;

consommation de crédits par membre.

L'entreprise doit pouvoir voir :

Qui a créé quoi ?

Combien de crédits ont été utilisés ?

Quel projet coûte combien ?

49. AUTHENTIFICATION

Inscription simple.

Prévoir :

email ;

numéro de téléphone ;

mot de passe ;

connexion ;

récupération ;

changement de mot de passe ;

éventuellement fournisseurs OAuth futurs.

Aucune procédure inutilement complexe.

50. PROFIL UTILISATEUR

Chaque utilisateur peut gérer :

nom ;

prénom ;

photo ;

bio ;

pays ;

langue préférée ;

paramètres ;

préférences de production.

51. CRÉDITS

Créer un système de crédits sécurisé.

Le frontend ne doit jamais modifier directement le solde.

Types :

acheté ;

utilisé ;

réservé ;

remboursé ;

bonus ;

parrainage ;

promotion.

Créer un ledger immuable :

credit_transactions

Chaque opération doit être traçable.

52. MODÈLE ÉCONOMIQUE

Le modèle économique doit être conçu pour :

qualité élevée + accessibilité africaine + rentabilité durable.

Ne pas chercher une marge excessive.

Objectif :

15–20 % de marge opérationnelle

après prise en compte des coûts réels.

Le système doit prendre en compte :

coût API vidéo ;

coût API image ;

coût voix ;

coût musique ;

coût traduction ;

stockage ;

traitement ;

infrastructure ;

paiements ;

régénérations techniques ;

bonus ;

parrainage.

53. PRICING ENGINE

Ne jamais coder définitivement les prix dans le frontend.

Créer un moteur :

PRICING ENGINE

Il calcule :

coût réel estimé

coûts opérationnels

provision de sécurité

coût du programme de parrainage

marge cible

=

prix recommandé

L'Admin peut modifier :

coût de référence ;

marge cible ;

coefficient de sécurité ;

prix public ;

promotions ;

bonus ;

modèles.

54. TARIFICATION VIDÉO INITIALE

À titre de configuration de lancement, prévoir une grille de référence autour de :

GEMINI OMNI

15 s → 2 000 FCFA

30 s → 3 500 FCFA

45 s → 5 000 FCFA

1 min → 6 500 FCFA

1 min 30 → 9 500 FCFA

2 min → 12 500 FCFA

3 min → 18 000 FCFA

5 min → 29 000 FCFA

Cette grille doit rester configurable.

Le Pricing Engine doit pouvoir recalculer les prix lorsque les coûts API changent.

55. CRÉDIT DE RÉFÉRENCE

Configuration commerciale de départ :

1 crédit = 100 FCFA

Mais le système ne doit pas imposer une conversion rigide identique à tous les modèles.

Chaque modèle possède son propre coût en crédits.

56. PARRAINAGE

Créer un programme de parrainage natif.

Chaque utilisateur possède :

lien de parrainage unique.

Lorsqu'un filleul s'inscrit avec ce lien et achète un plan :

Le parrain reçoit :

10 % de la valeur en crédits achetés.

Exemple :

Filleul achète :

100 crédits

Parrain reçoit :

10 crédits

Le bonus doit être calculé en crédits et non comme une sortie d'argent.

Le système doit intégrer le coût économique de ce bonus dans le Pricing Engine afin que le programme ne crée pas une perte structurelle.

Prévoir :

code unique ;

lien ;

clics ;

inscriptions ;

conversions ;

crédits générés ;

historique ;

anti-fraude.

57. ANTI-FRAUDE PARRAINAGE

Empêcher :

auto-parrainage ;

comptes multiples frauduleux ;

abus de bonus ;

boucles de parrainage ;

manipulation des achats.

Le bonus doit être accordé uniquement après validation du paiement.

58. ABONNEMENTS

Prévoir plusieurs plans configurables par l'Admin.

Chaque plan peut définir :

crédits ;

durée ;

modèles autorisés ;

durée maximale des vidéos ;

nombre de projets ;

stockage ;

personnages ;

séries ;

fonctionnalités premium ;

priorité de génération ;

membres d'équipe.

Ne pas figer les plans dans le code.

59. ACHATS PONCTUELS

Permettre également :

packs de crédits

sans abonnement.

Les crédits achetés doivent apparaître dans le ledger.

60. PAIEMENT

Architecture :

Payment Provider Adapter

Préparer :

Mobile Money ;

carte bancaire ;

paiements internationaux ;

abonnements ;

achats de crédits.

Le système doit pouvoir intégrer plusieurs prestataires.

61. SUPABASE

Utiliser Supabase externe appartenant au propriétaire du produit comme backend principal.

Ne pas rendre l'application définitivement dépendante de Lovable Cloud.

Supabase :

PostgreSQL ;

Auth ;

Storage ;

RLS ;

Realtime ;

Edge Functions.

Lovable sert principalement à développer l'application.

62. ARCHITECTURE TECHNIQUE

Frontend

Lovable / React / TypeScript

Backend

Supabase

Database

PostgreSQL

Auth

Supabase Auth

Storage

Supabase Storage

Server logic

Supabase Edge Functions et/ou backend sécurisé

Video processing

FFmpeg / infrastructure appropriée

AI

AI Provider Adapter

Queue

Jobs asynchrones

63. BASE DE DONNÉES

Créer au minimum :

users

profiles

organizations

organization_members

projects

project_members

project_versions

project_bibles

characters

character_versions

character_references

character_reference_analysis

locations

objects

scripts

script_versions

scenes

scene_versions

dialogues

dialogue_lines

voice_profiles

voice_references

voice_validations

languages

language_terms

language_expressions

language_sources

language_validations

assets

asset_versions

series

series_characters

series_episodes

generation_jobs

generation_attempts

quality_checks

quality_issues

video_sequences

video_extensions

final_videos

credit_accounts

credit_transactions

subscriptions

plans

payments

referrals

referral_events

providers

provider_models

provider_credentials

pricing_rules

cost_records

notifications

audit_logs

admin_users

admin_roles

admin_permissions

64. RLS

Toutes les données sensibles doivent être protégées par Row Level Security.

Un utilisateur ne peut accéder qu'à :

ses projets ;

ses assets ;

ses personnages ;

ses vidéos ;

ses crédits.

Une entreprise ne peut accéder qu'aux ressources autorisées à son organisation.

Les données administratives doivent être strictement protégées.

65. ADMINISTRATION

Créer un véritable :

E’NVLÉ MOTION ADMIN

Ce n'est pas un simple panneau CRUD.

Le dashboard doit permettre de piloter toute la plateforme.

66. ADMIN — DASHBOARD GLOBAL

Afficher :

utilisateurs ;

utilisateurs actifs ;

nouveaux utilisateurs ;

projets ;

vidéos générées ;

vidéos terminées ;

générations échouées ;

crédits vendus ;

crédits consommés ;

chiffre d'affaires ;

coûts API ;

coût moyen par vidéo ;

coût moyen par minute ;

marge ;

taux d'échec ;

taux de régénération ;

modèles utilisés ;

fournisseurs utilisés.

67. ADMIN — UTILISATEURS

Permettre :

rechercher ;

filtrer ;

voir profil ;

voir activité ;

voir crédits ;

voir projets ;

voir vidéos ;

voir paiements ;

suspendre ;

réactiver ;

modifier certaines données selon permissions.

68. ADMIN — PROJETS

Voir :

projet ;

propriétaire ;

organisation ;

statut ;

durée ;

modèle ;

coût ;

crédits consommés ;

qualité ;

erreurs ;

versions.

69. ADMIN — GÉNÉRATIONS

Chaque génération doit avoir :

generation_id

Enregistrer :

utilisateur ;

projet ;

modèle ;

provider ;

durée ;

paramètres ;

tokens si disponibles ;

coût estimé ;

coût réel ;

temps ;

statut ;

nombre de tentatives ;

erreur ;

qualité.

70. ADMIN — AI PROVIDERS

Section :

AI PROVIDERS

Permettre de configurer :

fournisseur ;

endpoint ;

modèle ;

clé ;

statut ;

priorité ;

coût ;

capacités ;

limites ;

fallback.

Les clés doivent être sécurisées.

71. ADMIN — MODEL CATALOG

Pour chaque modèle :

nom ;

provider ;

type ;

image ;

vidéo ;

audio ;

TTS ;

traduction ;

extension ;

résolution ;

coût ;

prix en crédits ;

statut ;

priorité ;

disponibilité.

72. ADMIN — MODEL ROUTER

Permettre de définir :

Modèle principal

Modèle secondaire

Fallback

pour chaque tâche.

Exemple :

Vidéo :

Omni

modèle secondaire

fallback

73. ADMIN — PRICING

Créer un véritable tableau de configuration des prix.

L'Admin peut modifier :

crédits ;

coût API ;

coût estimé ;

marge cible ;

coefficient ;

prix public ;

promotions ;

bonus ;

parrainage.

Afficher :

Coût

Prix

Marge

Marge %

Avant activation d'un nouveau tarif.

74. ADMIN — VOICE LAB

Le Super Admin et les membres autorisés peuvent :

uploader une voix ;

analyser ;

créer un profil ;

nommer ;

catégoriser ;

définir langue ;

définir accent ;

définir pays ;

définir sexe ;

définir âge ;

tester ;

valider ;

désactiver ;

versionner.

Créer une bibliothèque centrale de voix.

75. ADMIN — LINGUA LAB

Permettre :

ajouter langue ;

ajouter mot ;

ajouter expression ;

ajouter traduction ;

ajouter prononciation ;

ajouter audio ;

ajouter source ;

demander validation ;

valider ;

rejeter ;

versionner.

Afficher :

Niveau de confiance

Source

Validateur

Date

76. ADMIN — MODÉRATION

Créer une équipe de modération.

Permissions :

examiner les projets signalés ;

examiner les contenus ;

suspendre un contenu ;

suspendre un compte ;

traiter les signalements ;

consulter les logs ;

appliquer les règles de sécurité.

Créer un historique complet des actions.

77. RÔLES ADMINISTRATIFS

SUPER ADMIN

Accès total.

ADMIN

Gestion globale selon permissions.

AI MANAGER

Gestion modèles/providers.

VOICE MANAGER

Gestion Voice Lab.

LINGUA MANAGER

Gestion linguistique.

MODERATOR

Modération.

FINANCE

Paiements, crédits, coûts, marges.

SUPPORT

Utilisateurs et assistance.

Toutes les permissions doivent être configurables.

78. AUDIT LOG

Enregistrer :

utilisateur ;

administrateur ;

action ;

date ;

ancienne valeur ;

nouvelle valeur ;

adresse IP lorsque légalement approprié ;

ressource concernée.

79. OBSERVABILITÉ

Créer un système permettant de connaître exactement :

combien coûte chaque vidéo.

Suivre :

API ;

modèle ;

temps ;

tokens ;

stockage ;

traitement ;

retries ;

erreurs ;

coûts.

Créer des tableaux de bord financiers.

80. NOTIFICATIONS

Priorité aux notifications internes :

production terminée ;

production échouée ;

crédits faibles ;

paiement confirmé ;

bonus de parrainage ;

invitation équipe ;

validation linguistique.

Prévoir architecture extensible pour :

push ;

WhatsApp ;

SMS.

L'email n'est pas une priorité du MVP.

81. DESIGN UX/UI

L'application doit être :

responsive ;

rapide ;

moderne ;

premium ;

claire ;

intuitive ;

minimaliste ;

adaptée ordinateur ;

tablette ;

mobile.

Ne jamais surcharger l'utilisateur avec les paramètres techniques.

Le mode simple doit être extrêmement accessible.

Le mode expert doit être puissant mais séparé.

82. ARCHITECTURE DE DOMAINES

Prévoir une architecture cohérente avec l'écosystème E’nvlé.

Application principale :

motion.envle.app

Back-office :

admin.motion.envle.app

ou une structure équivalente propre et sécurisée.

Le domaine exact doit rester configurable dans l'environnement de déploiement.

83. SÉCURITÉ

Ne jamais exposer :

API keys ;

secrets ;

Service Role Key ;

credentials fournisseurs ;

secrets paiement.

Tous les appels sensibles passent par le backend.

84. ENVIRONNEMENTS

Prévoir :

Development

Staging

Production

Utiliser des clés séparées lorsque les fournisseurs le permettent.

Ne jamais utiliser les clés de production pour les tests.

85. RÉSILIENCE

Prévoir :

retry intelligent ;

timeout ;

rate limiting ;

fallback ;

reprise après erreur ;

reprise des jobs ;

idempotence ;

journalisation.

Un problème d'API ne doit pas casser le projet.

86. CACHE

Mettre en cache les éléments déjà validés :

références ;

personnages ;

assets ;

analyses ;

voix ;

scènes ;

résultats intermédiaires.

Ne jamais recalculer inutilement quelque chose déjà validé.

87. RÈGLE D'OR D'E’NVLÉ MOTION

L'IA fait ce qu'elle sait bien faire.

compréhension ;

créativité ;

scénario ;

direction ;

génération ;

interprétation ;

analyse ;

traduction lorsque fiable.

Le logiciel fait ce qu'il peut faire parfaitement.

texte exact ;

logo exact ;

couleur exacte ;

position exacte ;

durée exacte ;

assemblage ;

synchronisation ;

crédits ;

paiement ;

stockage ;

sécurité ;

versioning.

88. CE QUI DOIT ÊTRE INVISIBLE

L'utilisateur ne doit pas avoir à gérer :

prompts complexes ;

découpage technique ;

générations intermédiaires ;

références répétées ;

appels API ;

tokens ;

retries ;

montage ;

synchronisation ;

composition.

Tout cela appartient au moteur E’nvlé Motion.

89. CE QUI DOIT ÊTRE VISIBLE

L'utilisateur doit voir :

son idée ;

son projet ;

ses personnages ;

ses références ;

sa durée ;

son modèle ;

son coût ;

son avancement ;

son résultat ;

ses versions ;

Prolonger ;

Corriger ;

Exporter.

90. STRUCTURE DE NAVIGATION UTILISATEUR

Dashboard

Créer une vidéo

Mes projets

Mes vidéos

Personnages

Séries

Assets

E’nvlé Lingua

Crédits

Abonnement

Parrainage

Équipe

Profil

Paramètres

91. PAGE VIDÉO

Actions :

▶ Lire

✏ Modifier

➕ Prolonger

↻ Corriger

Versionner

Partager

Exporter

Afficher :

durée ;

modèle ;

qualité ;

crédits utilisés ;

date ;

statut.

92. PAGE PERSONNAGE

Afficher :

portrait ;

nom ;

références ;

caractéristiques verrouillées ;

voix ;

projets ;

séries.

Actions :

Modifier

Ajouter référence

Créer vidéo

Dupliquer

93. PAGE SÉRIE

Afficher :

univers ;

personnages ;

épisodes ;

chronologie ;

bible ;

style ;

voix.

Actions :

Nouvel épisode

Prolonger

Continuer

94. MVP PRIORITAIRE

Le MVP doit réellement fonctionner.

Priorité :

Auth ;

profils ;

Dashboard ;

projets ;

prompt naturel ;

Director Engine ;

Project Bible ;

Character Studio ;

références jusqu'à 10 images ;

Character Lock ;

Dialogue Lock ;

Voice architecture ;

Model Router ;

Gemini/Omni ;

génération vidéo ;

Quality Control ;

composition ;

texte déterministe ;

Prolonger ;

historique ;

crédits ;

paiement ;

Supabase ;

Storage ;

jobs asynchrones ;

administration ;

observabilité.

95. PHASE 2

Ajouter :

Voice Lab complet ;

E’nvlé Lingua complet ;

musique IA ;

bibliothèque vocale africaine ;

mini-séries ;

entreprises ;

équipes ;

partage avancé ;

parrainage ;

modèles supplémentaires ;

WhatsApp/SMS ;

fonctionnalités professionnelles.

96. PHASE 3

Développer progressivement :

séries longues ;

productions 10+ minutes ;

workflows professionnels ;

agences ;

studios ;

API E’nvlé Motion ;

intégration dans d'autres produits E’nvlé ;

marketplace de voix/éléments autorisés ;

catalogue linguistique africain plus vaste.

97. API E’NVLÉ MOTION

Prévoir dès la conception une API interne permettant ultérieurement à d'autres produits E’nvlé ou partenaires de demander :

génération vidéo ;

génération image ;

voix ;

traduction ;

analyse ;

composition.

L'API E’nvlé Motion doit rester indépendante des API fournisseurs.

98. PRINCIPLE D'EXTENSIBILITÉ

Ne jamais construire une fonctionnalité de manière à empêcher :

changement de modèle ;

changement de fournisseur ;

ajout d'un modèle ;

ajout d'une langue ;

ajout d'une voix ;

ajout d'un moyen de paiement ;

ajout d'une fonctionnalité ;

changement de tarification.

99. EXIGENCE LOVABLE

Lovable ne doit pas produire uniquement une interface visuelle.

Le développeur doit construire :

vraie base Supabase ;

vraies tables ;

vraies relations ;

vraies fonctions ;

vrais jobs ;

vraie authentification ;

vrais contrôles RLS ;

vraie gestion des crédits ;

vraies APIs ;

vraie architecture backend ;

vrais appels fournisseurs ;

vraie administration.

Ne pas simuler les générations avec de faux résultats.

Ne pas mettre les secrets dans le frontend.

Ne pas enfermer l'application dans Lovable Cloud.

Le code doit rester portable, propre, modulaire et documenté.

100. RÈGLE DE QUALITÉ ABSOLUE

E’nvlé Motion doit être construit selon une philosophie simple :

L'utilisateur ne doit pas apprendre à utiliser l'IA.

L'IA doit apprendre à comprendre l'utilisateur.

Et surtout :

E’nvlé Motion ne vend pas des générations.

E’nvlé Motion réalise des films.

L'utilisateur décrit.

E’nvlé Motion pense.

E’nvlé Motion orchestre.

E’nvlé Motion contrôle.

E’nvlé Motion corrige.

E’nvlé Motion réalise.

E’nvlé Motion

Imaginez. Décrivez. Réalisez.

je vais utiliser lovable cloud

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://envele-motion.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/211ad287-f8e9-4363-9c60-569784459992).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
