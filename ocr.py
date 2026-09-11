import os

from PIL import Image

import pytesseract


# =========================================================
# CONFIGURATION OCR
# =========================================================

def ocr_enabled():

    """
    Vérifie si l'OCR est activé.

    Par défaut :

        OCR_ENABLED=false

    Pour activer :

        OCR_ENABLED=true
    """

    return (

        os.getenv(
            "OCR_ENABLED",
            "false"
        )

        .lower()

        == "true"

    )


# =========================================================
# EXTRACTION DU TEXTE
# =========================================================

def extract_text(path: str) -> str:

    """
    Lit le texte présent dans une image.

    Retourne une chaîne vide si :

    - OCR désactivé
    - fichier invalide
    - image impossible à lire
    - Tesseract indisponible
    """

    if not ocr_enabled():

        return ""


    try:

        with Image.open(path) as image:


            # Conversion RGB pour améliorer la compatibilité
            if image.mode not in (

                "RGB",

                "L"

            ):

                image = image.convert(
                    "RGB"
                )


            # Tentative avec français + anglais
            try:

                text = (

                    pytesseract.image_to_string(

                        image,

                        lang="fra+eng"

                    )

                )


            except Exception:


                # Si les langues ne sont pas installées,
                # tentative simple en anglais
                text = (

                    pytesseract.image_to_string(

                        image,

                        lang="eng"

                    )

                )


            return (

                text

                .strip()

            )


    except Exception:

        return ""


# =========================================================
# EXTRACTION DES LIGNES
# =========================================================

def candidate_lines(
    text: str
):

    """
    Transforme le texte OCR en liste de lignes propres.
    """

    if not isinstance(
        text,
        str
    ):

        return []


    lines = []


    for line in text.splitlines():

        line = (

            line

            .strip()

        )


        if line:

            lines.append(
                line
            )


    return lines
