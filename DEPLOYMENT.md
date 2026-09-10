# Déploiement

## Configuration minimale

- Python 3.10+
- `pip install -r requirements.txt`
- commande de démarrage :

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Important pour Android

Pour une installation PWA fiable, servez l'application via HTTPS.

Après déploiement :

1. Ouvrez l'URL HTTPS sur Android.
2. Utilisez le bouton « Installer l'application ».
3. L'application devient accessible depuis l'écran d'accueil.
