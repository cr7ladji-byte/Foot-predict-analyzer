import hashlib


# =========================================================
# FOURNISSEUR DE DONNEES DEMO
# =========================================================

class DemoProvider:

    """
    Fournisseur de données de démonstration.

    IMPORTANT :
    Les données sont générées de manière déterministe.

    Cela signifie que le même match :

        Arsenal vs Tottenham

    avec la même compétition produira toujours
    les mêmes valeurs.

    Ce fournisseur devra être remplacé plus tard
    par une ou plusieurs API de données football
    autorisées.
    """


    # =====================================================
    # NOM DU FOURNISSEUR
    # =====================================================

    name = "Demo statistical provider"


    # =====================================================
    # RECUPERATION DU CONTEXTE DU MATCH
    # =====================================================

    async def get_match_context(

        self,

        home: str,

        away: str,

        competition: str = ""

    ):


        # =================================================
        # NETTOYAGE DES DONNEES
        # =================================================

        home = (
            str(home or "")
            .strip()
        )


        away = (
            str(away or "")
            .strip()
        )


        competition = (
            str(competition or "")
            .strip()
        )


        # =================================================
        # CLE UNIQUE DU MATCH
        # =================================================

        match_key = (

            f"{home.lower()}"

            f"|"

            f"{away.lower()}"

            f"|"

            f"{competition.lower()}"

        )


        # =================================================
        # GENERATION D'UNE GRAINE
        # =================================================

        hash_value = (

            hashlib.sha256(

                match_key.encode(
                    "utf-8"
                )

            )

            .hexdigest()

        )


        seed = int(

            hash_value[:8],

            16

        )


        # =================================================
        # CALCUL DES DONNEES
        # =================================================

        # -----------------------------------------------
        # FORME
        # -----------------------------------------------

        home_form = (

            0.52

            +

            (seed % 24) / 100

        )


        away_form = (

            0.38

            +

            (
                (seed // 100) % 24
            ) / 100

        )


        # -----------------------------------------------
        # ATTAQUE
        # -----------------------------------------------

        home_attack = (

            1.25

            +

            (seed % 65) / 100

        )


        away_attack = (

            0.75

            +

            (
                (seed // 1000) % 60
            ) / 100

        )


        # -----------------------------------------------
        # DEFENSE
        # -----------------------------------------------

        home_defense = (

            0.80

            +

            (
                (seed // 10000) % 50
            ) / 100

        )


        away_defense = (

            1.05

            +

            (
                (seed // 100000) % 55
            ) / 100

        )


        # -----------------------------------------------
        # EXPECTED GOALS
        # -----------------------------------------------

        home_xg = (

            1.35

            +

            (seed % 50) / 100

        )


        away_xg = (

            0.85

            +

            (
                (seed // 100) % 45
            ) / 100

        )


        # -----------------------------------------------
        # CORNERS
        # -----------------------------------------------

        home_corners = (

            4.6

            +

            (seed % 15) / 10

        )


        away_corners = (

            3.4

            +

            (
                (seed // 100) % 15
            ) / 10

        )


        # -----------------------------------------------
        # ABSENCES
        # -----------------------------------------------

        home_absence_impact = (

            (seed % 8)

            / 100

        )


        away_absence_impact = (

            (
                (seed // 100) % 8
            )

            / 100

        )


        # =================================================
        # RETOUR DES DONNEES
        # =================================================

        return {


            # ---------------------------------------------
            # INFORMATIONS
            # ---------------------------------------------

            "source":

                self.name,


            "provider_type":

                "demo",


            "data_mode":

                "deterministic_simulation",


            # ---------------------------------------------
            # MATCH
            # ---------------------------------------------

            "home_team":

                home,


            "away_team":

                away,


            "competition":

                competition,


            # ---------------------------------------------
            # FORME
            # ---------------------------------------------

            "home_form":

                round(
                    home_form,
                    2
                ),


            "away_form":

                round(
                    away_form,
                    2
                ),


            # ---------------------------------------------
            # ATTAQUE
            # ---------------------------------------------

            "home_attack":

                round(
                    home_attack,
                    2
                ),


            "away_attack":

                round(
                    away_attack,
                    2
                ),


            # ---------------------------------------------
            # DEFENSE
            # ---------------------------------------------

            "home_defense":

                round(
                    home_defense,
                    2
                ),


            "away_defense":

                round(
                    away_defense,
                    2
                ),


            # ---------------------------------------------
            # EXPECTED GOALS
            # ---------------------------------------------

            "home_xg":

                round(
                    home_xg,
                    2
                ),


            "away_xg":

                round(
                    away_xg,
                    2
                ),


            # ---------------------------------------------
            # CORNERS
            # ---------------------------------------------

            "home_corners":

                round(
                    home_corners,
                    1
                ),


            "away_corners":

                round(
                    away_corners,
                    1
                ),


            # ---------------------------------------------
            # IMPACT DES ABSENCES
            # ---------------------------------------------

            "home_absence_impact":

                round(
                    home_absence_impact,
                    2
                ),


            "away_absence_impact":

                round(
                    away_absence_impact,
                    2
                )

        }
