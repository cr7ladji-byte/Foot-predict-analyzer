# FOOT PREDICT ANALYZER — Édition gratuite et réutilisable

Cette édition est conçue pour être utilisée gratuitement autant de fois que vous le souhaitez sur votre ordinateur.

## Ce qui est gratuit

- Import de captures d'écran.
- Confirmation des équipes.
- Calcul statistique local.
- Probabilités 1X2.
- Prévisions de buts.
- BTTS.
- Prévisions de corners.
- Scores exacts probables.
- Historique local.
- OCR optionnel si vous installez Tesseract.

Aucun abonnement n'est nécessaire pour utiliser le prototype local.

## Installation simple

### 1. Installer Python

Installez Python 3.10 ou plus récent.

### 2. Installer les dépendances

Dans le dossier du projet :

```bash
pip install -r requirements.txt
```

### 3. Démarrer l'application

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Puis ouvrez :

`http://127.0.0.1:8000`

## Utilisation gratuite et répétée

À chaque nouveau match :

1. Ouvrez l'application.
2. Importez la capture du match.
3. Confirmez les équipes.
4. Cliquez sur « Lancer l'analyse avancée ».
5. Consultez les probabilités.
6. Recommencez avec un autre match.

L'historique est conservé localement dans :

`data/history.json`

## Important concernant les données réelles

Cette édition gratuite utilise actuellement un fournisseur de démonstration pour permettre une utilisation immédiate sans abonnement.

Pour obtenir des prédictions basées sur des données réelles, vous pouvez connecter des sources gratuites ou payantes uniquement si leur API ou leurs conditions autorisent votre usage. Certaines sources peuvent imposer des limites, des clés API ou des coûts.

Les résultats sont des estimations statistiques et non des garanties.
