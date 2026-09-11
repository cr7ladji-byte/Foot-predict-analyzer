import math


# =========================================================
# OUTILS MATHEMATIQUES
# =========================================================

def poisson(k, lam):

    try:
        lam = float(lam)
    except (TypeError, ValueError):
        lam = 0

    if lam < 0:
        lam = 0

    return (
        math.exp(-lam)
        * lam ** k
        / math.factorial(k)
    )


def clamp(x, lo, hi):

    try:
        x = float(x)
    except (TypeError, ValueError):
        x = lo

    return max(
        lo,
        min(hi, x)
    )


def get_value(
    data,
    key,
    default=0
):

    """
    Récupère une valeur numérique de manière sécurisée.
    """

    try:
        return float(
            data.get(key, default)
        )
    except (AttributeError, TypeError, ValueError):
        return default


# =========================================================
# ANALYSE PRINCIPALE
# =========================================================

def analyze(
    data: dict,
    home: str,
    away: str
):

    # =====================================================
    # SECURITE DES DONNEES
    # =====================================================

    if not isinstance(data, dict):
        data = {}


    home_attack = get_value(
        data,
        "home_attack",
        1.0
    )

    away_attack = get_value(
        data,
        "away_attack",
        1.0
    )

    home_xg = get_value(
        data,
        "home_xg",
        1.0
    )

    away_xg = get_value(
        data,
        "away_xg",
        1.0
    )

    home_defense = get_value(
        data,
        "home_defense",
        1.0
    )

    away_defense = get_value(
        data,
        "away_defense",
        1.0
    )

    home_form = get_value(
        data,
        "home_form",
        1.0
    )

    away_form = get_value(
        data,
        "away_form",
        1.0
    )

    home_absence_impact = clamp(
        get_value(
            data,
            "home_absence_impact",
            0
        ),
        0,
        0.8
    )

    away_absence_impact = clamp(
        get_value(
            data,
            "away_absence_impact",
            0
        ),
        0,
        0.8
    )

    home_corners = get_value(
        data,
        "home_corners",
        4.5
    )

    away_corners = get_value(
        data,
        "away_corners",
        4.5
    )


    # =====================================================
    # BUTS ATTENDUS DOMICILE
    # =====================================================

    home_lambda = (

        0.32 * home_attack

        +

        0.26 * home_xg

        +

        0.22 * away_defense

        +

        0.12 * home_form

        +

        0.08

    ) * (

        1
        -
        home_absence_impact

    )


    # =====================================================
    # BUTS ATTENDUS EXTERIEUR
    # =====================================================

    away_lambda = (

        0.34 * away_attack

        +

        0.27 * away_xg

        +

        0.21 * home_defense

        +

        0.12 * away_form

        +

        0.03

    ) * (

        1
        -
        away_absence_impact

    )


    # =====================================================
    # AVANTAGE DU TERRAIN
    # =====================================================

    home_lambda *= 1.05


    # =====================================================
    # LIMITES DES BUTS ATTENDUS
    # =====================================================

    home_lambda = clamp(
        home_lambda,
        0.35,
        3.50
    )

    away_lambda = clamp(
        away_lambda,
        0.25,
        3.20
    )


    # =====================================================
    # MATRICE DES SCORES
    # =====================================================

    matrix = {}


    for h in range(8):

        for a in range(8):

            probability_score = (

                poisson(
                    h,
                    home_lambda
                )

                *

                poisson(
                    a,
                    away_lambda
                )

            )


            matrix[
                (h, a)
            ] = probability_score


    # =====================================================
    # PROBABILITES 1X2
    # =====================================================

    hw = sum(

        p

        for (h, a), p

        in matrix.items()

        if h > a

    )


    dr = sum(

        p

        for (h, a), p

        in matrix.items()

        if h == a

    )


    aw = sum(

        p

        for (h, a), p

        in matrix.items()

        if h < a

    )


    # =====================================================
    # NORMALISATION
    # =====================================================

    total_result_probability = (

        hw
        +
        dr
        +
        aw

    )


    if total_result_probability > 0:

        hw = (
            hw
            /
            total_result_probability
        )


        dr = (
            dr
            /
            total_result_probability
        )


        aw = (
            aw
            /
            total_result_probability
        )


    # =====================================================
    # TOTAL DE BUTS ATTENDUS
    # =====================================================

    total = (

        home_lambda
        +
        away_lambda

    )


    # =====================================================
    # OVER 1.5
    # =====================================================

    over15 = (

        1

        -

        sum(

            poisson(
                k,
                total
            )

            for k in range(2)

        )

    )


    # =====================================================
    # OVER 2.5
    # =====================================================

    over25 = (

        1

        -

        sum(

            poisson(
                k,
                total
            )

            for k in range(3)

        )

    )


    # =====================================================
    # UNDER 3.5
    # =====================================================

    under35 = sum(

        poisson(
            k,
            total
        )

        for k in range(4)

    )


    # =====================================================
    # BOTH TEAMS TO SCORE
    # =====================================================

    btts = (

        1

        -

        poisson(
            0,
            home_lambda
        )

    ) * (

        1

        -

        poisson(
            0,
            away_lambda
        )

    )


    # =====================================================
    # CORNERS ATTENDUS
    # =====================================================

    corner_lambda = clamp(

        home_corners
        +
        away_corners,

        5.5,

        14.0

    )


    # =====================================================
    # OVER 7.5 CORNERS
    # =====================================================

    over75 = (

        1

        -

        sum(

            poisson(
                k,
                corner_lambda
            )

            for k in range(8)

        )

    )


    # =====================================================
    # OVER 8.5 CORNERS
    # =====================================================

    over85 = (

        1

        -

        sum(

            poisson(
                k,
                corner_lambda
            )

            for k in range(9)

        )

    )


    # =====================================================
    # OVER 9.5 CORNERS
    # =====================================================

    over95 = (

        1

        -

        sum(

            poisson(
                k,
                corner_lambda
            )

            for k in range(10)

        )

    )


    # =====================================================
    # SCORES EXACTS
    # =====================================================

    exact = sorted(

        matrix.items(),

        key=lambda x: x[1],

        reverse=True

    )[:5]


    # =====================================================
    # CONFIANCE DU MODELE
    # =====================================================

    source_completeness = 0.70

    data_confidence = 0.68


    confidence = round(

        (

            source_completeness * 0.45

            +

            data_confidence * 0.55

        )

        * 100

    )


    # =====================================================
    # RESULTAT FINAL
    # =====================================================

    return {


        # =================================================
        # PROBABILITES DIRECTES
        # =================================================

        "home_win":

            round(
                hw * 100,
                1
            ),


        "draw":

            round(
                dr * 100,
                1
            ),


        "away_win":

            round(
                aw * 100,
                1
            ),


        # =================================================
        # RESULTAT 1X2
        # =================================================

        "result": {

            "home_win":

                round(
                    hw * 100,
                    1
                ),


            "draw":

                round(
                    dr * 100,
                    1
                ),


            "away_win":

                round(
                    aw * 100,
                    1
                )

        },


        # =================================================
        # BUTS ATTENDUS
        # =================================================

        "expected": {

            "home_goals":

                round(
                    home_lambda,
                    2
                ),


            "away_goals":

                round(
                    away_lambda,
                    2
                ),


            "total_goals":

                round(
                    total,
                    2
                ),


            "total_corners":

                round(
                    corner_lambda,
                    1
                )

        },


        # =================================================
        # MARCHE DES BUTS
        # =================================================

        "goals": {

            "over_1_5":

                round(
                    over15 * 100,
                    1
                ),


            "over_2_5":

                round(
                    over25 * 100,
                    1
                ),


            "under_3_5":

                round(
                    under35 * 100,
                    1
                ),


            "btts_yes":

                round(
                    btts * 100,
                    1
                )

        },


        # =================================================
        # CORNERS
        # =================================================

        "corners": {

            "over_7_5":

                round(
                    over75 * 100,
                    1
                ),


            "over_8_5":

                round(
                    over85 * 100,
                    1
                ),


            "over_9_5":

                round(
                    over95 * 100,
                    1
                )

        },


        # =================================================
        # SCORES EXACTS
        # =================================================

        "exact_scores": [

            {

                "score":

                    f"{h}-{a}",


                "probability":

                    round(
                        p * 100,
                        1
                    )

            }

            for (h, a), p

            in exact

        ],


        # =================================================
        # CONFIANCE
        # =================================================

        "confidence":

            confidence

    }
