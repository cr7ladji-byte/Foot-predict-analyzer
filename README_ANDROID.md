# FOOT PREDICT ANALYZER — Installation Android gratuite

Cette version est une **PWA (Progressive Web App)**. Elle peut être installée sur Android et utilisée comme une application.

## Méthode recommandée

### 1. Mettre l'application en ligne

Une PWA doit normalement être servie via HTTPS pour être installable publiquement sur Android.

Vous pouvez héberger le projet sur un service compatible avec une application Python/FastAPI.

### 2. Ouvrir l'adresse sur Android

Ouvrez l'application dans Chrome ou un navigateur compatible.

### 3. Installer

- Appuyez sur **« Installer l'application »** si le bouton apparaît.
- Sinon, ouvrez le menu du navigateur.
- Choisissez **« Installer l'application »** ou **« Ajouter à l'écran d'accueil »**.

L'application apparaîtra ensuite avec son icône sur votre téléphone.

## Utilisation gratuite

Le moteur local et l'interface ne nécessitent pas d'abonnement.

Les fournisseurs externes de données restent indépendants : leurs éventuelles clés API, limites ou coûts dépendent de leurs propres conditions.

## Développement local

```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Pour installer réellement la PWA sur un téléphone, utilisez une URL HTTPS accessible depuis le téléphone.
