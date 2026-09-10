from typing import Protocol, Optional

class DataProvider(Protocol):
    name: str

    async def get_match_context(self, home: str, away: str, competition: str = "") -> Optional[dict]:
        """Retourne des données normalisées si le fournisseur est configuré."""
        ...
