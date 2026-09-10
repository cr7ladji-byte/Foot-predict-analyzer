import hashlib


class DemoProvider:
    """
    Fournisseur de données de démonstration.

    Les valeurs générées sont déterministes :
    le même match produira toujours les mêmes données.

    À remplacer plus tard par des API de données
    football autorisées.
    """

    name = "Demo statistical provider"


    async def get_match_context(
        self,
        home: str,
        away: str,
        competition: str = ""
    ):


        # =================================================
        # GENERATION D'UNE GRAINE UNIQUE
        # =================================================

        match_key = (
            f"{home}|{away}|{competition}"
        )


        seed = int(

            hashlib.sha256(
                match_key.encode()
            ).hexdigest()[:8],

            16

        )


        # =================================================
        # DONNEES DU MATCH
        # =================================================

        return {


            # ---------------------------------------------
            # SOURCE
            # ---------------------------------------------

            "source":

                self.name,


            # ---------------------------------------------
            # FORME DES EQUIPES
            # ---------------------------------------------

            "home_form":

                0.52
                +
                (seed % 24) / 100,


            "away_form":

                0.38
                +
                ((seed // 100) % 24) / 100,


            # ---------------------------------------------
            # FORCE OFFENSIVE
            # ---------------------------------------------

            "home_attack":

                1.25
                +
                (seed % 65) / 100,


            "away_attack":

                0.75
                +
                ((seed // 1000) % 60) / 100,


            # ---------------------------------------------
            # FORCE DEFENSIVE
            # ---------------------------------------------

            "home_defense":

                0.80
                +
                ((seed // 10000) % 50) / 100,


            "away_defense":

                1.05
                +
                ((seed // 100000) % 55) / 100,


            # ---------------------------------------------
            # EXPECTED GOALS
            # ---------------------------------------------

            "home_xg":

                1.35
                +
                (seed % 50) / 100,


            "away_xg":

                0.85
                +
                ((seed // 100) % 45) / 100,


            # ---------------------------------------------
            # CORNERS
            # ---------------------------------------------

            "home_corners":

                4.6
                +
                (seed % 15) / 10,


            "away_corners":

                3.4
                +
                ((seed // 100) % 15) / 10,


            # ---------------------------------------------
            # IMPACT DES ABSENCES
            # ---------------------------------------------

            "home_absence_impact":

                (seed % 8) / 100,


            "away_absence_impact":

                ((seed // 100) % 8) / 100

        }
