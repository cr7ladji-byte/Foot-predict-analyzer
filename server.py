from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form
)

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from pathlib import Path

import tempfile
import json
import datetime
import os


from demo_provider import DemoProvider
from ocr import extract_text, candidate_lines
from models import analyze


# =========================================================
# CONFIGURATION
# =========================================================

BASE = Path(
    __file__
).resolve().parent


DB = (
    BASE
    / "data"
    / "history.json"
)


app = FastAPI(
    title="FOOT PREDICT ANALYZER"
)


app.mount(
    "/static",
    StaticFiles(
        directory=BASE
    ),
    name="static"
)


provider = DemoProvider()


# =========================================================
# HISTORIQUE
# =========================================================

def save_history(item: dict):

    DB.parent.mkdir(
        parents=True,
        exist_ok=True
    )


    records = []


    if DB.exists():

        try:

            records = json.loads(

                DB.read_text(
                    encoding="utf-8"
                )

            )

        except Exception:

            records = []


    item["saved_at"] = (

        datetime.datetime
        .utcnow()
        .isoformat()

        + "Z"

    )


    records.insert(
        0,
        item
    )


    DB.write_text(

        json.dumps(

            records[:100],

            ensure_ascii=False,

            indent=2

        ),

        encoding="utf-8"

    )


def get_history():

    if not DB.exists():

        return []


    try:

        return json.loads(

            DB.read_text(
                encoding="utf-8"
            )

        )

    except Exception:

        return []


# =========================================================
# OUTILS NUMERIQUES
# =========================================================

def get_number(
    data,
    *keys,
    default=0
):

    """
    Cherche une valeur numérique
    avec plusieurs noms de clés possibles.
    """

    if not isinstance(
        data,
        dict
    ):

        return default


    for key in keys:

        if key in data:

            value = data.get(
                key
            )


            try:

                return float(
                    value
                )

            except (
                TypeError,
                ValueError
            ):

                pass


    return default


def probability(value):

    """
    Normalise une probabilité.

    Accepte :
    0.72
    ou
    72
    """

    try:

        value = float(
            value
        )

    except (
        TypeError,
        ValueError
    ):

        return 0


    if value <= 1:

        value *= 100


    return max(

        0,

        min(

            100,

            round(
                value,
                1
            )

        )

    )


# =========================================================
# EXTRACTION RESULTAT 1X2
# =========================================================

def extract_result_data(result):

    """
    Le moteur peut retourner :

    {
        "result": {
            "home_win": ...,
            "draw": ...,
            "away_win": ...
        }
    }

    ou directement :

    {
        "home_win": ...,
        "draw": ...,
        "away_win": ...
    }
    """

    if not isinstance(
        result,
        dict
    ):

        return {}


    nested = result.get(
        "result"
    )


    if isinstance(
        nested,
        dict
    ):

        return nested


    return result


# =========================================================
# RECOMMANDATION RESULTAT
# =========================================================

def build_main_prediction(

    home,

    away,

    home_win,

    draw,

    away_win

):

    home_win = probability(
        home_win
    )

    draw = probability(
        draw
    )

    away_win = probability(
        away_win
    )


    home_or_draw = round(

        home_win
        +
        draw,

        1

    )


    away_or_draw = round(

        away_win
        +
        draw,

        1

    )


    difference = abs(

        home_win
        -
        away_win

    )


    # =====================================================
    # FAVORI DOMICILE
    # =====================================================

    if (

        home_win >= 60

        and

        difference >= 15

    ):

        return {

            "type": "victoire",

            "market": "1",

            "label":
                f"Victoire probable : {home}",

            "confidence":
                home_win,

            "alternative":
                "1X",

            "alternative_label":
                f"Double chance {home} ou Nul"

        }


    # =====================================================
    # FAVORI EXTERIEUR
    # =====================================================

    if (

        away_win >= 60

        and

        difference >= 15

    ):

        return {

            "type": "victoire",

            "market": "2",

            "label":
                f"Victoire probable : {away}",

            "confidence":
                away_win,

            "alternative":
                "X2",

            "alternative_label":
                f"Double chance Nul ou {away}"

        }


    # =====================================================
    # DOUBLE CHANCE DOMICILE
    # =====================================================

    if (

        home_or_draw >= away_or_draw

        and

        home_or_draw >= 65

    ):

        return {

            "type":
                "double_chance",

            "market":
                "1X",

            "label":
                f"Double chance : {home} ou Nul",

            "confidence":
                home_or_draw,

            "alternative":
                "1",

            "alternative_label":
                f"Victoire directe {home}"

        }


    # =====================================================
    # DOUBLE CHANCE EXTERIEUR
    # =====================================================

    if (

        away_or_draw > home_or_draw

        and

        away_or_draw >= 65

    ):

        return {

            "type":
                "double_chance",

            "market":
                "X2",

            "label":
                f"Double chance : Nul ou {away}",

            "confidence":
                away_or_draw,

            "alternative":
                "2",

            "alternative_label":
                f"Victoire directe {away}"

        }


    # =====================================================
    # MATCH INCERTAIN
    # =====================================================

    return {

        "type":
            "incertain",

        "market":
            "aucun",

        "label":
            "Match trop équilibré pour un choix fort",

        "confidence":
            max(
                home_win,
                draw,
                away_win
            ),

        "alternative":
            "prudence",

        "alternative_label":
            (
                "Aucun marché principal "
                "fortement recommandé"
            )

    }


# =========================================================
# HANDICAP
# =========================================================

def build_handicap(

    home,

    away,

    home_win,

    away_win

):

    home_win = probability(
        home_win
    )

    away_win = probability(
        away_win
    )


    difference = (

        home_win
        -
        away_win

    )


    if difference >= 30:

        return {

            "recommended":
                True,

            "label":
                f"{home} -1",

            "description":
                (
                    f"{home} est nettement "
                    "supérieur sur le modèle"
                )

        }


    if difference >= 20:

        return {

            "recommended":
                True,

            "label":
                f"{home} -0.5",

            "description":
                (
                    f"Avantage attendu pour "
                    f"{home}"
                )

        }


    if difference <= -30:

        return {

            "recommended":
                True,

            "label":
                f"{away} -1",

            "description":
                (
                    f"{away} est nettement "
                    "supérieur sur le modèle"
                )

        }


    if difference <= -20:

        return {

            "recommended":
                True,

            "label":
                f"{away} -0.5",

            "description":
                (
                    f"Avantage attendu pour "
                    f"{away}"
                )

        }


    return {

        "recommended":
            False,

        "label":
            "Handicap non recommandé",

        "description":
            (
                "Les forces semblent trop proches"
            )

    }


# =========================================================
# MATCH SERRE
# =========================================================

def build_match_tightness(

    home_win,

    draw,

    away_win

):

    home_win = probability(
        home_win
    )

    draw = probability(
        draw
    )

    away_win = probability(
        away_win
    )


    difference = abs(

        home_win
        -
        away_win

    )


    if difference <= 8:

        return {

            "level":
                "très_serré",

            "label":
                "Match très serré",

            "description":
                (
                    "Les deux équipes présentent "
                    "des chances de victoire très proches."
                ),

            "icon":
                "⚔️"

        }


    if difference <= 15:

        return {

            "level":
                "serré",

            "label":
                "Match disputé",

            "description":
                (
                    "Rencontre équilibrée "
                    "avec un léger avantage."
                ),

            "icon":
                "⚖️"

        }


    if difference <= 25:

        return {

            "level":
                "avantage_modéré",

            "label":
                "Avantage modéré",

            "description":
                (
                    "Une équipe possède un avantage "
                    "mais le match reste compétitif."
                ),

            "icon":
                "📈"

        }


    return {

        "level":
            "domination",

        "label":
            "Domination attendue",

        "description":
            (
                "Une équipe possède un avantage "
                "statistique important."
            ),

        "icon":
            "👑"

    }


# =========================================================
# AGRESSIVITE OFFENSIVE
# =========================================================

def classify_aggressiveness(

    team_expected_goals,

    total_expected_goals

):

    try:

        team_expected_goals = float(
            team_expected_goals
        )

    except (
        TypeError,
        ValueError
    ):

        team_expected_goals = 0


    try:

        total_expected_goals = float(
            total_expected_goals
        )

    except (
        TypeError,
        ValueError
    ):

        total_expected_goals = 0


    score = min(

        100,

        round(
            team_expected_goals * 40
        )

    )


    if total_expected_goals >= 3.5:

        score += 10


    elif total_expected_goals <= 1.8:

        score -= 10


    score = max(

        0,

        min(
            100,
            score
        )

    )


    if score >= 80:

        return {

            "score":
                score,

            "level":
                "très_agressive",

            "label":
                "Très agressive",

            "description":
                "Forte pression offensive attendue.",

            "icon":
                "🔥"

        }


    if score >= 60:

        return {

            "score":
                score,

            "level":
                "offensive",

            "label":
                "Offensive",

            "description":
                "Équipe portée vers l'attaque.",

            "icon":
                "⚡"

        }


    if score >= 40:

        return {

            "score":
                score,

            "level":
                "équilibrée",

            "label":
                "Équilibrée",

            "description":
                (
                    "Bon équilibre entre attaque "
                    "et contrôle."
                ),

            "icon":
                "⚖️"

        }


    if score >= 20:

        return {

            "score":
                score,

            "level":
                "prudente",

            "label":
                "Prudente",

            "description":
                (
                    "Approche offensive mesurée."
                ),

            "icon":
                "🛡️"

        }


    return {

        "score":
            score,

        "level":
            "défensive",

        "label":
            "Très prudente",

        "description":
            (
                "Faible intensité offensive attendue."
            ),

        "icon":
            "🧱"

    }


# =========================================================
# TIMING DU PREMIER BUT
# =========================================================

def build_first_goal_timing(

    total_expected_goals

):

    try:

        total_expected_goals = float(
            total_expected_goals
        )

    except (
        TypeError,
        ValueError
    ):

        total_expected_goals = 0


    if total_expected_goals >= 3.5:

        return {

            "timing":
                "précoce",

            "label":
                "Début de match explosif",

            "description":
                (
                    "Ouverture du score "
                    "potentiellement rapide."
                ),

            "icon":
                "⚡"

        }


    if total_expected_goals >= 2.7:

        return {

            "timing":
                "assez_rapide",

            "label":
                (
                    "Ouverture du score attendue "
                    "relativement tôt"
                ),

            "description":
                (
                    "Le rythme offensif pourrait "
                    "produire un but dans la première "
                    "partie du match."
                ),

            "icon":
                "🟡"

        }


    if total_expected_goals >= 2.1:

        return {

            "timing":
                "normal",

            "label":
                (
                    "Rythme d'ouverture du score normal"
                ),

            "description":
                (
                    "Le premier but est attendu "
                    "selon un scénario de match classique."
                ),

            "icon":
                "⚖️"

        }


    if total_expected_goals >= 1.5:

        return {

            "timing":
                "tardif",

            "label":
                (
                    "Ouverture du score "
                    "potentiellement tardive"
                ),

            "description":
                (
                    "Le match pourrait mettre du temps "
                    "à se débloquer."
                ),

            "icon":
                "🟠"

        }


    return {

        "timing":
            "très_tardif",

        "label":
            "Début de match fermé",

        "description":
            (
                "Risque élevé d'une ouverture "
                "du score tardive."
            ),

        "icon":
            "🔒"

    }


# =========================================================
# CONSTRUCTION DU VERDICT
# =========================================================

def build_verdict(

    result,

    home,

    away

):

    """
    Transforme les résultats de models.py
    en verdict exploitable par app.js.
    """


    if not isinstance(
        result,
        dict
    ):

        result = {}


    # =====================================================
    # EXTRACTION DU RESULTAT 1X2
    # =====================================================

    result_data = extract_result_data(
        result
    )


    home_win = get_number(

        result_data,

        "home_win",

        "home",

        "p_home",

        default=0

    )


    draw = get_number(

        result_data,

        "draw",

        "p_draw",

        default=0

    )


    away_win = get_number(

        result_data,

        "away_win",

        "away",

        "p_away",

        default=0

    )


    # =====================================================
    # DONNEES ATTENDUES
    # =====================================================

    expected = result.get(
        "expected",
        {}
    )


    if not isinstance(
        expected,
        dict
    ):

        expected = {}


    total_expected_goals = get_number(

        expected,

        "total_goals",

        "goals",

        "total",

        default=0

    )


    home_expected_goals = get_number(

        expected,

        "home_goals",

        "home",

        default=0

    )


    away_expected_goals = get_number(

        expected,

        "away_goals",

        "away",

        default=0

    )


    # =====================================================
    # CALCUL DU TOTAL SI NECESSAIRE
    # =====================================================

    if (

        total_expected_goals == 0

        and

        (
            home_expected_goals > 0
            or
            away_expected_goals > 0
        )

    ):

        total_expected_goals = (

            home_expected_goals
            +
            away_expected_goals

        )


    # =====================================================
    # REPARTITION DES BUTS SI NECESSAIRE
    # =====================================================

    if (

        home_expected_goals == 0

        and

        away_expected_goals == 0

        and

        total_expected_goals > 0

    ):

        total_strength = (

            home_win
            +
            away_win

        )


        if total_strength > 0:

            home_expected_goals = (

                total_expected_goals

                *

                home_win

                /

                total_strength

            )


            away_expected_goals = (

                total_expected_goals

                *

                away_win

                /

                total_strength

            )


        else:

            home_expected_goals = (

                total_expected_goals
                /
                2

            )


            away_expected_goals = (

                total_expected_goals
                /
                2

            )


    # =====================================================
    # CREATION DU VERDICT
    # =====================================================

    main_prediction = build_main_prediction(

        home,

        away,

        home_win,

        draw,

        away_win

    )


    handicap = build_handicap(

        home,

        away,

        home_win,

        away_win

    )


    tightness = build_match_tightness(

        home_win,

        draw,

        away_win

    )


    home_aggression = (
        classify_aggressiveness(

            home_expected_goals,

            total_expected_goals

        )
    )


    away_aggression = (
        classify_aggressiveness(

            away_expected_goals,

            total_expected_goals

        )
    )


    first_goal = (
        build_first_goal_timing(

            total_expected_goals

        )
    )


    return {

        "main_prediction":
            main_prediction,


        "handicap":
            handicap,


        "confidence":
            main_prediction["confidence"],


        "match_tightness":
            tightness,


        "home_aggression": {

            "team":
                home,

            **home_aggression

        },


        "away_aggression": {

            "team":
                away,

            **away_aggression

        },


        "first_goal":
            first_goal,


        "probabilities": {

            "home_win":
                probability(
                    home_win
                ),

            "draw":
                probability(
                    draw
                ),

            "away_win":
                probability(
                    away_win
                )

        },


        "expected_goals": {

            "home":
                round(
                    home_expected_goals,
                    2
                ),

            "away":
                round(
                    away_expected_goals,
                    2
                ),

            "total":
                round(
                    total_expected_goals,
                    2
                )

        }

    }


# =========================================================
# PAGE ACCUEIL
# =========================================================

@app.get("/")
def home():

    return FileResponse(

        BASE
        /
        "index.html"

    )


# =========================================================
# API HISTORIQUE
# =========================================================

@app.get("/api/history")
def history():

    return get_history()


# =========================================================
# LECTURE CAPTURE OCR
# =========================================================

@app.post("/api/read-capture")
async def read_capture(

    screenshot: UploadFile = File(...)

):

    suffix = Path(

        screenshot.filename
        or
        "capture.png"

    ).suffix or ".png"


    path = None


    try:

        with tempfile.NamedTemporaryFile(

            delete=False,

            suffix=suffix

        ) as f:

            f.write(

                await screenshot.read()

            )


            path = f.name


        text = extract_text(
            path
        )


        return {

            "filename":
                screenshot.filename,

            "ocr_text":
                text,

            "candidate_lines":
                candidate_lines(
                    text
                )[:20],

            "note":
                (
                    "Confirme toujours les équipes "
                    "avant l'analyse."
                )

        }


    finally:

        if path:

            try:

                os.unlink(
                    path
                )

            except Exception:

                pass


# =========================================================
# ANALYSE DU MATCH
# =========================================================

@app.post("/api/analyze")
async def api_analyze(

    home: str = Form(...),

    away: str = Form(...),

    competition: str = Form("")

):


    # =====================================================
    # NETTOYAGE
    # =====================================================

    home = home.strip()

    away = away.strip()

    competition = competition.strip()


    # =====================================================
    # VERIFICATION
    # =====================================================

    if not home or not away:

        return {

            "error":
                "Les deux équipes sont obligatoires."

        }


    # =====================================================
    # DONNEES DU FOURNISSEUR
    # =====================================================

    raw = await provider.get_match_context(

        home,

        away,

        competition

    )


    # =====================================================
    # MOTEUR D'ANALYSE
    # =====================================================

    result = analyze(

        raw,

        home,

        away

    )


    # =====================================================
    # VERDICT
    # =====================================================

    verdict = build_verdict(

        result,

        home,

        away

    )


    # =====================================================
    # RESULTAT FINAL
    # =====================================================

    payload = {

        "match": {

            "home":
                home,

            "away":
                away,

            "competition":

                competition

                or

                "Non précisée"

        },


        "provider_data":
            raw,


        "analysis":
            result,


        "verdict":
            verdict,


        "sources": [

            {

                "name":
                    "Adaptateur de données",

                "status":
                    (
                        "Architecture prête pour "
                        "API autorisées"
                    )

            },


            {

                "name":
                    "OCR / capture",

                "status":
                    "Module optionnel"

            },


            {

                "name":
                    "Moteur statistique",

                "status":
                    "Poisson + pondération"

            }

        ],


        "disclaimer":

            (
                "Les résultats sont des estimations "
                "probabilistes et non des garanties."
            )

    }


    # =====================================================
    # SAUVEGARDE HISTORIQUE
    # =====================================================

    save_history(
        payload
    )


    return payload
