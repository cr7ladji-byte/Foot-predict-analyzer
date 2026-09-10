# FOOT PREDICT ANALYZER — Version avancée (architecture MVP+)

## Objectif

Cette version ajoute une architecture prête pour :

1. Importer une capture d'écran.
2. Extraire le texte par OCR lorsque Tesseract est installé.
3. Détecter / confirmer les équipes et la compétition.
4. Interroger plusieurs fournisseurs de données **autorisés** via des adaptateurs.
5. Normaliser les statistiques.
6. Calculer des indicateurs :
   - forme ;
   - domicile / extérieur ;
   - buts ;
   - xG / xGA lorsque disponibles ;
   - absences ;
   - corners.
7. Produire des probabilités :
   - 1X2 ;
   - Over/Under ;
   - BTTS ;
   - corners ;
   - scores exacts.
8. Conserver un historique local des analyses.

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
# Windows : .venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Ouvrir ensuite :

`http://127.0.0.1:8000`

## OCR

Le module OCR est optionnel. Installez Tesseract sur votre système, puis activez :

```env
OCR_ENABLED=true
```

La reconnaissance automatique doit toujours être suivie d'une confirmation des équipes, car une capture peut être ambiguë.

## Données réelles

Les fichiers dans `app/providers/` sont des adaptateurs. Ils ne doivent être connectés qu'à des API ou fournisseurs de données dont vous avez le droit d'utiliser l'accès automatisé.

Ne mettez jamais en production un scraping qui violerait les conditions d'utilisation d'un site.

## Modèle

Le modèle actuel combine un score pondéré et une distribution de Poisson. Les coefficients sont configurables et doivent être calibrés sur des données historiques réelles avant toute utilisation sérieuse.

Les résultats sont des probabilités, jamais des certitudes.
