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
// AFFICHAGE DES LIGNES
// =========================================================

function rows(id, arr) {

    const el = $(id);

    if (!el) return;

    if (!Array.isArray(arr)) {

        el.innerHTML = "";
        return;

    }


    el.innerHTML = arr.map(item => {

        if (typeof item === "object") {

            return `
                <div class="row">
                    ${escapeHtml(
                        JSON.stringify(item)
                    )}
                </div>
            `;

        }


        return `
            <div class="row">
                ${escapeHtml(item)}
            </div>
        `;

    }).join("");

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
// AFFICHAGE DU VERDICT
// =========================================================

function renderVerdict(verdict) {

    if (!verdict) {

        return "";

    }


    let html = "";


    // =====================================================
    // PRONOSTIC PRINCIPAL
    // =====================================================

    const main = verdict.main_prediction;

    if (main) {

        html += verdictCard(

            "Recommandation principale",

            "🏆",

            `

            <div class="verdict-main">

                <h3>
                    ${escapeHtml(main.label)}
                </h3>


                <div class="probability">

                    Confiance :

                    <strong>
                        ${escapeHtml(main.confidence)}%
                    </strong>

                </div>


                <div class="market">

                    Marché :

                    <strong>
                        ${escapeHtml(main.market)}
                    </strong>

                </div>


                <hr>


                <div class="alternative">

                    Alternative :

                    <strong>
                        ${escapeHtml(main.alternative)}
                    </strong>

                    <br>

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

    const handicap = verdict.handicap;

    if (handicap) {

        html += verdictCard(

            "Handicap",

            handicap.recommended
                ? "📊"
                : "⚠️",

            `

            <h3>
                ${escapeHtml(handicap.label)}
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

    const tightness = verdict.match_tightness;

    if (tightness) {

        html += verdictCard(

            "Analyse du match",

            tightness.icon || "⚔️",

            `

            <h3>
                ${escapeHtml(tightness.label)}
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
    // AGRESSIVITE DOMICILE
    // =====================================================

    const homeAggression =
        verdict.home_aggression;

    if (homeAggression) {

        html += verdictCard(

            `Profil offensif : ${homeAggression.team}`,

            homeAggression.icon || "🔥",

            `

            <h3>
                ${escapeHtml(
                    homeAggression.label
                )}
            </h3>


            <div class="probability">

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
    // AGRESSIVITE EXTERIEUR
    // =====================================================

    const awayAggression =
        verdict.away_aggression;

    if (awayAggression) {

        html += verdictCard(

            `Profil offensif : ${awayAggression.team}`,

            awayAggression.icon || "🔥",

            `

            <h3>

                ${escapeHtml(
                    awayAggression.label
                )}

            </h3>


            <div class="probability">

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
    // PREMIER BUT
    // =====================================================

    const firstGoal =
        verdict.first_goal;

    if (firstGoal) {

        html += verdictCard(

            "Timing du premier but",

            firstGoal.icon || "⚽",

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

            <div class="probability-row">

                <div>

                    Domicile :

                    <strong>

                        ${escapeHtml(
                            probabilities.home_win
                        )}%

                    </strong>

                </div>


                <div>

                    Nul :

                    <strong>

                        ${escapeHtml(
                            probabilities.draw
                        )}%

                    </strong>

                </div>


                <div>

                    Extérieur :

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

            <div class="goals-row">

                <div>

                    Domicile :

                    <strong>

                        ${escapeHtml(
                            expectedGoals.home
                        )}

                    </strong>

                </div>


                <div>

                    Extérieur :

                    <strong>

                        ${escapeHtml(
                            expectedGoals.away
                        )}

                    </strong>

                </div>


                <div>

                    Total :

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
// AFFICHAGE RESULTAT 1X2
// =========================================================

function renderResult(analysis) {

    const result =
        analysis.result;

    if (!result) {

        return "";

    }


    return `

        <div class="row">

            <div class="top">

                <span>Victoire domicile</span>

                <strong>
                    ${escapeHtml(result.home_win)}%
                </strong>

            </div>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${result.home_win}%"
                ></div>

            </div>

        </div>


        <div class="row">

            <div class="top">

                <span>Match nul</span>

                <strong>
                    ${escapeHtml(result.draw)}%
                </strong>

            </div>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${result.draw}%"
                ></div>

            </div>

        </div>


        <div class="row">

            <div class="top">

                <span>Victoire extérieur</span>

                <strong>
                    ${escapeHtml(result.away_win)}%
                </strong>

            </div>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${result.away_win}%"
                ></div>

            </div>

        </div>

    `;

}


// =========================================================
// AFFICHAGE BUTS
// =========================================================

function renderGoals(analysis) {

    const goals =
        analysis.goals;

    if (!goals) {

        return "";

    }


    return `

        <div class="pill">

            Over 1.5 :
            ${escapeHtml(goals.over_1_5)}%

        </div>


        <div class="pill">

            Over 2.5 :
            ${escapeHtml(goals.over_2_5)}%

        </div>


        <div class="pill">

            Under 3.5 :
            ${escapeHtml(goals.under_3_5)}%

        </div>


        <div class="pill">

            BTTS Oui :
            ${escapeHtml(goals.btts_yes)}%

        </div>

    `;

}


// =========================================================
// AFFICHAGE CORNERS
// =========================================================

function renderCorners(analysis) {

    const corners =
        analysis.corners;

    if (!corners) {

        return "";

    }


    return `

        <div class="pill">

            Over 7.5 :
            ${escapeHtml(corners.over_7_5)}%

        </div>


        <div class="pill">

            Over 8.5 :
            ${escapeHtml(corners.over_8_5)}%

        </div>


        <div class="pill">

            Over 9.5 :
            ${escapeHtml(corners.over_9_5)}%

        </div>

    `;

}


// =========================================================
// AFFICHAGE SCORES EXACTS
// =========================================================

function renderScores(analysis) {

    const scores =
        analysis.exact_scores;

    if (!Array.isArray(scores)) {

        return "";

    }


    return scores.map(item => `

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

    `).join("");

}


// =========================================================
// AFFICHAGE DONNEES ATTENDUES
// =========================================================

function renderExpected(analysis) {

    const expected =
        analysis.expected;

    if (!expected) {

        return "";

    }


    return `

        <div class="row">

            <strong>
                Buts domicile :
            </strong>

            ${escapeHtml(
                expected.home_goals
            )}

        </div>


        <div class="row">

            <strong>
                Buts extérieur :
            </strong>

            ${escapeHtml(
                expected.away_goals
            )}

        </div>


        <div class="row">

            <strong>
                Total buts :
            </strong>

            ${escapeHtml(
                expected.total_goals
            )}

        </div>


        <div class="row">

            <strong>
                Total corners :
            </strong>

            ${escapeHtml(
                expected.total_corners
            )}

        </div>

    `;

}


// =========================================================
// AFFICHAGE DES SOURCES
// =========================================================

function renderSources(sources) {

    if (!Array.isArray(sources)) {

        return "";

    }


    return sources.map(source => `

        <div class="source">

            <strong>

                ${escapeHtml(
                    source.name
                )}

            </strong>

            <br>

            ${escapeHtml(
                source.status
            )}

        </div>

    `).join("");

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

                ocrBox.classList.remove(
                    "hidden"
                );

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

                console.error(error);


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
        async event => {

            event.preventDefault();


            // =================================================
            // LOADING
            // =================================================

            $("loading")
                ?.classList
                .remove("hidden");


            $("report")
                ?.classList
                .add("hidden");


            try {

                // =============================================
                // FORM DATA
                // =============================================

                const formData =
                    new FormData(form);


                // =============================================
                // API ANALYSE
                // =============================================

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
                        "Erreur API"
                    );

                }


                const data =
                    await response.json();


                // =============================================
                // MATCH
                // =============================================

                const match =
                    data.match || {};


                const matchOut =
                    $("matchOut");


                if (matchOut) {

                    matchOut.textContent =

                        `${match.home || ""} vs ${match.away || ""}`;

                }


                // =============================================
                // COMPETITION
                // =============================================

                const competitionOut =
                    $("competitionOut");


                if (competitionOut) {

                    competitionOut.textContent =

                        match.competition
                        || "";

                }


                // =============================================
                // VERDICT
                // =============================================

                const verdictOut =
                    $("verdictOut");


                if (verdictOut) {

                    verdictOut.innerHTML =

                        renderVerdict(
                            data.verdict
                        );

                }


                // =============================================
                // ANALYSE STATISTIQUE
                // =============================================

                const analysis =
                    data.analysis || {};


                const analysisOut =
                    $("analysisOut");


                if (analysisOut) {

                    analysisOut.innerHTML = `

                        <pre>

${escapeHtml(
    JSON.stringify(
        analysis,
        null,
        2
    )
)}

                        </pre>

                    `;

                }


                // =============================================
                // RESULTAT
                // =============================================

                const resultEl =
                    $("result");


                if (resultEl) {

                    resultEl.innerHTML =

                        renderResult(
                            analysis
                        );

                }


                // =============================================
                // BUTS
                // =============================================

                const goalsEl =
                    $("goals");


                if (goalsEl) {

                    goalsEl.innerHTML =

                        renderGoals(
                            analysis
                        );

                }


                // =============================================
                // CORNERS
                // =============================================

                const cornersEl =
                    $("corners");


                if (cornersEl) {

                    cornersEl.innerHTML =

                        renderCorners(
                            analysis
                        );

                }


                // =============================================
                // SCORES EXACTS
                // =============================================

                const scoresEl =
                    $("scores");


                if (scoresEl) {

                    scoresEl.innerHTML =

                        renderScores(
                            analysis
                        );

                }


                // =============================================
                // DONNEES ATTENDUES
                // =============================================

                const expectedEl =
                    $("expected");


                if (expectedEl) {

                    expectedEl.innerHTML =

                        renderExpected(
                            analysis
                        );

                }


                // =============================================
                // SOURCES
                // =============================================

                const sourcesEl =
                    $("sources");


                if (sourcesEl) {

                    sourcesEl.innerHTML =

                        renderSources(
                            data.sources
                        );

                }


                // =============================================
                // DISCLAIMER
                // =============================================

                const disclaimerEl =
                    $("disclaimer");


                if (disclaimerEl) {

                    disclaimerEl.textContent =

                        data.disclaimer
                        || "";

                }


                // =============================================
                // AFFICHAGE DU RAPPORT
                // =============================================

                $("report")
                    ?.classList
                    .remove("hidden");


                $("report")
                    ?.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });


            }

            catch (error) {

                console.error(error);


                alert(

                    "❌ Impossible d'analyser le match."

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


                const historyEl =
                    $("history");


                if (!historyEl) {

                    return;

                }


                if (

                    !Array.isArray(data)

                    ||

                    data.length === 0

                ) {

                    historyEl.innerHTML = `

                        <p>
                            Aucun historique disponible.
                        </p>

                    `;

                    return;

                }


                historyEl.innerHTML =

                    data.map(item => {


                        const match =
                            item.match || {};


                        const verdict =
                            item.verdict || {};


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


                                ${escapeHtml(
                                    match.competition
                                    || ""
                                )}


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

                    }).join("");


            }

            catch (error) {

                console.error(error);


                const historyEl =
                    $("history");


                if (historyEl) {

                    historyEl.innerHTML = `

                        <p>
                            ❌ Impossible de charger l'historique.
                        </p>

                    `;

                }

            }

        };

}
