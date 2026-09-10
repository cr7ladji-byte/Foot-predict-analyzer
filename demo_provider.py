import hashlib

class DemoProvider:
    """
    Fournisseur de démonstration.
    À remplacer/compléter par des adaptateurs d'API autorisées.
    """
    name = "Demo statistical provider"

    async def get_match_context(self, home: str, away: str, competition: str = ""):
        seed = int(hashlib.sha256(f"{home}|{away}|{competition}".encode()).hexdigest()[:8], 16)
        return {
            "source": self.name,
            "home_form": 0.52 + (seed % 24) / 100,
            "away_form": 0.38 + ((seed // 100) % 24) / 100,
            "home_attack": 1.25 + (seed % 65) / 100,
            "away_attack": 0.75 + ((seed // 1000) % 60) / 100,
            "home_defense": 0.80 + ((seed // 10000) % 50) / 100,
            "away_defense": 1.05 + ((seed // 100000) % 55) / 100,
            "home_xg": 1.35 + (seed % 50) / 100,
            "away_xg": 0.85 + ((seed // 100) % 45) / 100,
            "home_corners": 4.6 + (seed % 15) / 10,
            "away_corners": 3.4 + ((seed // 100) % 15) / 10,
            "home_absence_impact": (seed % 8) / 100,
            "away_absence_impact": ((seed // 100) % 8) / 100,
        }
