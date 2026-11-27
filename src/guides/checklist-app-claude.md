# ✅ Installer une app Claude sans mauvaise surprise

*Par @dupflodev. La checklist que je passe avant de cliquer sur « Install as app ». Mise à jour le 27 novembre 2026.*

Depuis le 24 novembre 2026, Claude Desktop transforme un artefact en vraie application Mac ou Windows : sa fenêtre, son icône dans le Dock. C'est génial pour des petits outils perso. Mais en cliquant, tu acceptes quelques règles du jeu. Les voilà, en 8 points, avec ce que je fais pour chacun.

> **En 10 secondes**
>
> | | Je l'installe | J'évite |
> |---|---|---|
> | **Usage** | minuteur, suivi perso, petit tableau de bord | outil dont dépend ton activité |
> | **Données** | des infos que tu pourrais montrer à un inconnu | mots de passe, données de clients, santé |
> | **Permission** | Default, ou App pour les notifications | Full access sans savoir ce que fait l'app |

---

## 1. Vérifie que tu y as accès

- **Claude Desktop** sur Mac ou Windows, version **6.28899.0 ou plus récente** (menu Claude → Check for Updates sur Mac, Help → Check for Updates sur Windows).
- Tous les abonnements, **gratuit compris**. Sur Enterprise, un admin doit l'activer.
- C'est une **bêta** : le fonctionnement peut encore changer.
- Pas installables : les artefacts Docs, Slides et Sheets, les anciens artefacts et les artefacts live de Cowork.

**Pour installer :** ouvre l'artefact dans Claude Desktop, menu du titre ou clic droit (ou Partager) → **Install as app** → **Install**.

## 2. Accepte que l'app dépend de Claude

L'app installée **ne s'ouvre pas sans internet**, et elle a besoin de **ton compte Claude connecté** dans Claude Desktop.

- ✅ **Ce que je fais :** je n'installe pas d'app dont j'ai besoin pour travailler le jour où Claude est en panne, ou le jour où je change d'abonnement.

## 3. Garde une sortie de secours

Ton app, c'est du code. Garde-le chez toi.

- ✅ **Copie le code de l'artefact** et range-le dans un dossier à toi (ton second cerveau, par exemple). Si un jour tu quittes Claude, tu pourras le reprendre ailleurs ou le faire adapter par une autre IA.
- ✅ **Si l'app garde des données** (une liste, un suivi), demande à Claude d'ajouter un bouton **« Exporter en CSV »**, et sers-t'en de temps en temps.

## 4. Fais attention à ce que tu tapes dedans

Tout ce que l'app envoie à Claude passe par les serveurs d'Anthropic, comme une conversation normale.

- ❌ **Jamais dedans :** mots de passe, clés d'API, coordonnées bancaires, données de santé, fichiers de tes clients.
- ✅ **Vérifie tes réglages :** dans Claude, Réglages → Confidentialité, regarde si tes conversations servent à améliorer les modèles, et choisis.
- Pour une entreprise : vérifie ce que ton contrat (Team, Enterprise) prévoit avant d'y mettre des données de travail.

## 5. Choisis le bon niveau de permission

Claude te demande quel accès donner à l'app. Il y a trois niveaux :

| Niveau | Ce que l'app peut faire | Quand je le choisis |
|---|---|---|
| **Default** | Ce que ferait une page web dans un navigateur | Presque toujours |
| **App permissions** | En plus : notifications, raccourcis clavier globaux, fenêtre toujours au premier plan, icône dans la barre de menu | Un minuteur, un rappel |
| **Full access to this computer** | Lancer des programmes, lire, modifier et **supprimer tes fichiers sans te demander** | Seulement si je sais exactement ce que fait l'app |

Anthropic le dit dans son aide : **les apps ne sont pas vérifiées avant l'installation**. L'accès complet est réservé aux apps que tu as créées (ou, en Team et Enterprise, à celles de ton organisation). Mais une app « que tu as créée » en trois prompts, sans lire le code, reste une app que tu n'as pas lue.

- ✅ **Avant le Full access, demande à Claude :** « Liste-moi tout ce que cette app lit, écrit, supprime ou lance sur mon ordinateur, fichier par fichier. »

## 6. Surveille tes quotas

La création de l'app **et chacune de ses requêtes à Claude** comptent dans les limites de ton abonnement.

- ✅ Une app qui interroge Claude en boucle (toutes les minutes, sur chaque frappe) peut vider ta limite de la journée. Demande-lui de n'appeler Claude que quand tu cliques sur un bouton.

## 7. Relis à chaque mise à jour

Une permission ne vaut que pour **une version** de l'app. Après chaque modification, même la tienne, Claude te redemande l'accès.

- ✅ Ne clique pas « oui » par réflexe : c'est le moment de vérifier ce qui a changé.

## 8. Sache comment l'enlever

Désinstaller l'app **retire ses permissions**, mais **ne supprime pas l'artefact** : tu le retrouves dans Claude. Si quelqu'un arrête de te partager une app, les programmes qu'elle avait lancés s'arrêtent dans les 20 minutes environ.

---

## Le prompt que j'utilise pour créer une app propre

Copie-le dans Claude Desktop et remplace la première ligne :

```text
Crée-moi une app qui [ce que tu veux].
Contraintes :
- Elle n'appelle Claude que quand je clique sur un bouton, jamais en boucle.
- Elle n'a besoin d'aucun accès à mes fichiers.
- Si elle garde des données, ajoute un bouton « Exporter en CSV ».
- Ne me demande jamais de mot de passe ni de clé.
À la fin, dis-moi en 3 lignes ce qu'elle envoie à Claude et quel niveau de permission elle demande.
```

---

## Mon verdict

C'est une très bonne nouveauté. Je l'utilise pour **des petits outils perso**, avec la permission par défaut. Pour quelque chose de critique ou avec des données sensibles, je garde un outil qui ne dépend pas d'un seul fournisseur. Parce que le meilleur modèle d'aujourd'hui ne sera peut-être pas celui de demain.

*Sources : [aide Claude, « Install an artifact as an app »](https://support.claude.com/en/articles/18516354-install-an-artifact-as-an-app) · [claude.com, « Turn artifacts into Mac and Windows apps »](https://claude.com/resources/articles/install-as-app).*
