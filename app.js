const $ = id => document.getElementById(id);


// =========================================================
// SECURITE HTML
// =========================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// CREATION CARTE VERDICT
// =========================================================

function verdictCard(title, icon, content) {

    return `
        <div class="verdict-card">

            <div class="verdict-title">

                <span class="verdict-icon">
                    ${icon}
                </span>

                <strong>
                    ${escapeHtml(title)}
                </strong>

            </div>

            <div class="verdict-content">

                ${content}

            </div>

        </div>
    `;

}


// =========================================================
// AFFICHAGE DU VERDICT INTELLIGENT
// =========================================================

function renderVerdict(verdict) {

    if (!verdict) {

        return `
            <p>
                Aucun verdict disponible.
            </p>
        `;

    }


    let html = "";


    // =====================================================
    // RECOMMANDATION PRINCIPALE
    // =====================================================

    const main =
        verdict.main_prediction;


    if (main) {

        html += verdictCard(

            "Recommandation principale",

            "🏆",

            `

            <div class="verdict-main">

                <h3>
                    ${escapeHtml(
                        main.label
                    )}
                </h3>


                <div class="verdict-stat">

                    Confiance :

                    <strong>

                        ${escapeHtml(
                            main.confidence
                        )}%

                    </strong>

                </div>


                <div class="verdict-stat">

                    Marché :

                    <strong>

                        ${escapeHtml(
                            main.market
                        )}

                    </strong>

                </div>


                <hr>


                <div class="alternative">

                    <strong>
                        Alternative :
                    </strong>

                    ${escapeHtml(
                        main.alternative_label
                    )}

                </div>

            </div>

            `

        );

    }


    // =====================================================
    // HANDICAP
    // =====================================================

    const handicap =
        verdict.handicap;


    if (handicap) {

        html += verdictCard(

            "Handicap",

            handicap.recommended
                ? "📊"
                : "⚠️",

            `

            <h3>

                ${escapeHtml(
                    handicap.label
                )}

            </h3>


            <p>

                ${escapeHtml(
                    handicap.description
                )}

            </p>

            `

        );

    }


    // =====================================================
    // MATCH SERRE
    // =====================================================

    const tightness =
        verdict.match_tightness;


    if (tightness) {

        html += verdictCard(

            "Analyse du match",

            tightness.icon
                || "⚔️",

            `

            <h3>

                ${escapeHtml(
                    tightness.label
                )}

            </h3>


            <p>

                ${escapeHtml(
                    tightness.description
                )}

            </p>

            `

        );

    }


    // =====================================================
    // PROFIL OFFENSIF DOMICILE
    // =====================================================

    const homeAggression =
        verdict.home_aggression;


    if (homeAggression) {

        html += verdictCard(

            `Profil offensif : ${homeAggression.team}`,

            homeAggression.icon
                || "🔥",

            `

            <h3>

                ${escapeHtml(
                    homeAggression.label
                )}

            </h3>


            <div class="verdict-stat">

                Intensité offensive :

                <strong>

                    ${escapeHtml(
                        homeAggression.score
                    )}/100

                </strong>

            </div>


            <p>

                ${escapeHtml(
                    homeAggression.description
                )}

            </p>

            `

        );

    }


    // =====================================================
    // PROFIL OFFENSIF EXTERIEUR
    // =====================================================

    const awayAggression =
        verdict.away_aggression;


    if (awayAggression) {

        html += verdictCard(

            `Profil offensif : ${awayAggression.team}`,

            awayAggression.icon
                || "🔥",

            `

            <h3>

                ${escapeHtml(
                    awayAggression.label
                )}

            </h3>


            <div class="verdict-stat">

                Intensité offensive :

                <strong>

                    ${escapeHtml(
                        awayAggression.score
                    )}/100

                </strong>

            </div>


            <p>

                ${escapeHtml(
                    awayAggression.description
                )}

            </p>

            `

        );

    }


    // =====================================================
    // TIMING DU PREMIER BUT
    // =====================================================

    const firstGoal =
        verdict.first_goal;


    if (firstGoal) {

        html += verdictCard(

            "Timing du premier but",

            firstGoal.icon
                || "⚽",

            `

            <h3>

                ${escapeHtml(
                    firstGoal.label
                )}

            </h3>


            <p>

                ${escapeHtml(
                    firstGoal.description
                )}

            </p>

            `

        );

    }


    // =====================================================
    // PROBABILITES 1X2
    // =====================================================

    const probabilities =
        verdict.probabilities;


    if (probabilities) {

        html += verdictCard(

            "Probabilités 1X2",

            "📈",

            `

            <div class="probability-grid">

                <div class="probability-item">

                    <span>
                        Domicile
                    </span>

                    <strong>

                        ${escapeHtml(
                            probabilities.home_win
                        )}%

                    </strong>

                </div>


                <div class="probability-item">

                    <span>
                        Nul
                    </span>

                    <strong>

                        ${escapeHtml(
                            probabilities.draw
                        )}%

                    </strong>

                </div>


                <div class="probability-item">

                    <span>
                        Extérieur
                    </span>

                    <strong>

                        ${escapeHtml(
                            probabilities.away_win
                        )}%

                    </strong>

                </div>

            </div>

            `

        );

    }


    // =====================================================
    // BUTS ATTENDUS
    // =====================================================

    const expectedGoals =
        verdict.expected_goals;


    if (expectedGoals) {

        html += verdictCard(

            "Buts attendus",

            "⚽",

            `

            <div class="probability-grid">

                <div class="probability-item">

                    <span>
                        Domicile
                    </span>

                    <strong>

                        ${escapeHtml(
                            expectedGoals.home
                        )}

                    </strong>

                </div>


                <div class="probability-item">

                    <span>
                        Extérieur
                    </span>

                    <strong>

                        ${escapeHtml(
                            expectedGoals.away
                        )}

                    </strong>

                </div>


                <div class="probability-item">

                    <span>
                        Total
                    </span>

                    <strong>

                        ${escapeHtml(
                            expectedGoals.total
                        )}

                    </strong>

                </div>

            </div>

            `

        );

    }


    return html;

}


// =========================================================
// OCR / LECTURE CAPTURE
// =========================================================

const readBtn =
    $("readBtn");


if (readBtn) {

    readBtn.onclick =
        async () => {


            const file =
                $("file")?.files[0];


            if (!file) {

                alert(
                    "Choisis une capture d'écran."
                );

                return;

            }


            const formData =
                new FormData();


            formData.append(

                "screenshot",

                file

            );


            const ocrBox =
                $("ocrBox");


            if (ocrBox) {

                ocrBox.classList
                    .remove("hidden");


                ocrBox.textContent =
                    "🔎 Lecture de la capture...";

            }


            try {

                const response =
                    await fetch(

                        "/api/read-capture",

                        {

                            method: "POST",

                            body: formData

                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        "Erreur OCR"
                    );

                }


                const data =
                    await response.json();


                if (ocrBox) {

                    ocrBox.textContent =

                        data.ocr_text

                        ||

                        "Aucun texte détecté.";

                }


            }

            catch (error) {

                console.error(
                    error
                );


                if (ocrBox) {

                    ocrBox.textContent =

                        "❌ Erreur pendant la lecture.";

                }

            }

        };

}


// =========================================================
// ANALYSE DU MATCH
// =========================================================

const form =
    $("form");


if (form) {

    form.onsubmit =
        async (event) => {


            event.preventDefault();


            // =============================================
            // AFFICHAGE CHARGEMENT
            // =============================================

            $("loading")
                ?.classList
                .remove("hidden");


            $("report")
                ?.classList
                .add("hidden");


            try {


                // =========================================
                // DONNEES FORMULAIRE
                // =========================================

                const formData =
                    new FormData(
                        form
                    );


                // =========================================
                // APPEL API
                // =========================================

                const response =
                    await fetch(

                        "/api/analyze",

                        {

                            method: "POST",

                            body: formData

                        }

                    );


                if (!response.ok) {

                    throw new Error(
                        "Impossible d'analyser le match."
                    );

                }


                const data =
                    await response.json();


                // =========================================
                // INFORMATIONS MATCH
                // =========================================

                const match =
                    data.match
                    || {};


                const matchOut =
                    $("matchOut");


                if (matchOut) {

                    matchOut.textContent =

                        `${match.home || ""}
                         vs
                         ${match.away || ""}`;

                }


                // =========================================
                // COMPETITION
                // =========================================

                const competitionOut =
                    $("competitionOut");


                if (competitionOut) {

                    competitionOut.textContent =

                        match.competition
                        || "";

                }


                // =========================================
                // VERDICT INTELLIGENT
                // =========================================

                const verdictOut =
                    $("verdictOut");


                if (verdictOut) {

                    verdictOut.innerHTML =

                        renderVerdict(
                            data.verdict
                        );

                }


                // =========================================
                // ANALYSE STATISTIQUE
                // =========================================

                const analysis =
                    data.analysis
                    || {};


                const analysisOut =
                    $("analysisOut");


                if (analysisOut) {

                    analysisOut.innerHTML =

                        `<pre>${escapeHtml(
                            JSON.stringify(
                                analysis,
                                null,
                                2
                            )
                        )}</pre>`;

                }


                // =========================================
                // RESULTAT 1X2
                // =========================================

                const result =
                    analysis.result
                    || {};


                const resultEl =
                    $("result");


                if (resultEl) {

                    resultEl.innerHTML = `

                        <div class="row">

                            Victoire domicile :

                            <strong>

                                ${result.home_win ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            Match nul :

                            <strong>

                                ${result.draw ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            Victoire extérieur :

                            <strong>

                                ${result.away_win ?? 0}%

                            </strong>

                        </div>

                    `;

                }


                // =========================================
                // BUTS
                // =========================================

                const goals =
                    analysis.goals
                    || {};


                const goalsEl =
                    $("goals");


                if (goalsEl) {

                    goalsEl.innerHTML = `

                        <div class="row">

                            Plus de 1.5 :

                            <strong>

                                ${goals.over_1_5 ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            Plus de 2.5 :

                            <strong>

                                ${goals.over_2_5 ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            Moins de 3.5 :

                            <strong>

                                ${goals.under_3_5 ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            BTTS Oui :

                            <strong>

                                ${goals.btts_yes ?? 0}%

                            </strong>

                        </div>

                    `;

                }


                // =========================================
                // CORNERS
                // =========================================

                const corners =
                    analysis.corners
                    || {};


                const cornersEl =
                    $("corners");


                if (cornersEl) {

                    cornersEl.innerHTML = `

                        <div class="row">

                            Plus de 7.5 :

                            <strong>

                                ${corners.over_7_5 ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            Plus de 8.5 :

                            <strong>

                                ${corners.over_8_5 ?? 0}%

                            </strong>

                        </div>


                        <div class="row">

                            Plus de 9.5 :

                            <strong>

                                ${corners.over_9_5 ?? 0}%

                            </strong>

                        </div>

                    `;

                }


                // =========================================
                // SCORES EXACTS
                // =========================================

                const scores =
                    analysis.exact_scores
                    || [];


                const scoresEl =
                    $("scores");


                if (scoresEl) {

                    if (
                        Array.isArray(scores)
                        &&
                        scores.length > 0
                    ) {

                        scoresEl.innerHTML =

                            scores.map(
                                item => `

                                <div class="score">

                                    <strong>

                                        ${escapeHtml(
                                            item.score
                                        )}

                                    </strong>


                                    <span>

                                        ${escapeHtml(
                                            item.probability
                                        )}%

                                    </span>

                                </div>

                                `
                            ).join("");

                    }

                    else {

                        scoresEl.innerHTML =

                            "<p>Aucun score disponible.</p>";

                    }

                }


                // =========================================
                // INDICATEURS ATTENDUS
                // =========================================

                const expected =
                    analysis.expected
                    || {};


                const expectedEl =
                    $("expected");


                if (expectedEl) {

                    expectedEl.innerHTML = `

                        <div class="row">

                            Buts attendus domicile :

                            <strong>

                                ${expected.home_goals ?? 0}

                            </strong>

                        </div>


                        <div class="row">

                            Buts attendus extérieur :

                            <strong>

                                ${expected.away_goals ?? 0}

                            </strong>

                        </div>


                        <div class="row">

                            Total buts attendus :

                            <strong>

                                ${expected.total_goals ?? 0}

                            </strong>

                        </div>


                        <div class="row">

                            Total corners attendu :

                            <strong>

                                ${expected.total_corners ?? 0}

                            </strong>

                        </div>

                    `;

                }


                // =========================================
                // SOURCES
                // =========================================

                const sources =
                    data.sources
                    || [];


                const sourcesEl =
                    $("sources");


                if (sourcesEl) {

                    if (
                        Array.isArray(
                            sources
                        )
                    ) {

                        sourcesEl.innerHTML =

                            sources.map(
                                source => `

                                <div class="source">

                                    <strong>

                                        ${escapeHtml(
                                            source.name
                                        )}

                                    </strong>

                                    <br>

                                    <small>

                                        ${escapeHtml(
                                            source.status
                                        )}

                                    </small>

                                </div>

                                `
                            ).join("");

                    }

                }


                // =========================================
                // AVERTISSEMENT
                // =========================================

                const disclaimer =
                    $("disclaimer");


                if (disclaimer) {

                    disclaimer.textContent =

                        data.disclaimer
                        || "";

                }


                // =========================================
                // AFFICHAGE RAPPORT
                // =========================================

                $("report")
                    ?.classList
                    .remove("hidden");


                $("report")
                    ?.scrollIntoView(

                        {

                            behavior:
                                "smooth"

                        }

                    );


            }

            catch (error) {


                console.error(
                    error
                );


                alert(

                    "❌ Impossible d'analyser le match. Vérifie que le serveur fonctionne correctement."

                );


            }

            finally {


                $("loading")
                    ?.classList
                    .add("hidden");


            }

        };

}


// =========================================================
// HISTORIQUE
// =========================================================

const historyBtn =
    $("historyBtn");


if (historyBtn) {

    historyBtn.onclick =
        async () => {


            const historyEl =
                $("history");


            if (historyEl) {

                historyEl.innerHTML =

                    "Chargement de l'historique...";

            }


            try {


                const response =
                    await fetch(
                        "/api/history"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Erreur historique"
                    );

                }


                const data =
                    await response.json();


                if (!historyEl) {

                    return;

                }


                if (

                    !Array.isArray(data)

                    ||

                    data.length === 0

                ) {

                    historyEl.innerHTML =

                        "<p>Aucune analyse enregistrée.</p>";

                    return;

                }


                historyEl.innerHTML =

                    data.map(

                        item => {


                            const match =
                                item.match
                                || {};


                            const verdict =
                                item.verdict
                                || {};


                            const prediction =
                                verdict.main_prediction
                                || {};


                            return `

                                <div class="history-item">

                                    <strong>

                                        ${escapeHtml(
                                            match.home
                                        )}

                                        vs

                                        ${escapeHtml(
                                            match.away
                                        )}

                                    </strong>


                                    <br>


                                    <small>

                                        ${escapeHtml(
                                            match.competition
                                            || ""
                                        )}

                                    </small>


                                    <br>


                                    🏆

                                    ${escapeHtml(

                                        prediction.label

                                        ||

                                        "Analyse disponible"

                                    )}


                                    <br>


                                    <small>

                                        ${escapeHtml(
                                            item.saved_at
                                            || ""
                                        )}

                                    </small>

                                </div>

                            `;

                        }

                    ).join("");


            }

            catch (error) {


                console.error(
                    error
                );


                if (historyEl) {

                    historyEl.innerHTML =

                        "❌ Impossible de charger l'historique.";

                }

            }

        };

}
