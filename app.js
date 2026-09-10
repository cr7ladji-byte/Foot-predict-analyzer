const $ = id => document.getElementById(id);


// =========================================================
// OUTILS
// =========================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function formatNumber(value, decimals = 1) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toFixed(decimals);

}


// =========================================================
// AFFICHAGE DES LIGNES
// =========================================================

function rows(id, arr) {

    const el = $(id);

    if (!el) {
        return;
    }

    if (!Array.isArray(arr)) {

        el.innerHTML = "";
        return;

    }


    el.innerHTML = arr.map(item => {

        if (
            typeof item === "object"
            && item !== null
        ) {

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
// BARRE DE PROBABILITE
// =========================================================

function probabilityBar(label, value) {

    const percentage = Math.max(
        0,
        Math.min(
            100,
            Number(value) || 0
        )
    );


    return `

        <div class="row">

            <div class="top">

                <span>
                    ${escapeHtml(label)}
                </span>

                <strong>
                    ${formatNumber(
                        percentage,
                        1
                    )}%
                </strong>

            </div>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${percentage}%"
                ></div>

            </div>

        </div>

    `;

}


// =========================================================
// CREATION CARTE VERDICT
// =========================================================

function verdictCard(title, icon, content) {

    return `

        <div class="verdict-card">

            <div class="verdict-title">

                <span>
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


                <div class="probability">

                    Confiance :

                    <strong>
                        ${formatNumber(
                            main.confidence
                        )}%
                    </strong>

                </div>


                <div class="market">

                    Marché :

                    <strong>
                        ${escapeHtml(
                            main.market
                        )}
                    </strong>

                </div>


                <hr>


                <div class="alternative">

                    Alternative :

                    <strong>
                        ${escapeHtml(
                            main.alternative
                        )}
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

            tightness.icon || "⚔️",

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
                    ${formatNumber(
                        homeAggression.score,
                        0
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
                    ${formatNumber(
                        awayAggression.score,
                        0
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


    return html;

}


// =========================================================
// AFFICHAGE RESULTAT 1X2
// =========================================================

function renderResult(
    analysis,
    verdict
) {

    const probabilities =
        verdict?.probabilities || {};


    const home =
        probabilities.home_win || 0;


    const draw =
        probabilities.draw || 0;


    const away =
        probabilities.away_win || 0;


    return `

        ${probabilityBar(
            "Victoire domicile",
            home
        )}

        ${probabilityBar(
            "Match nul",
            draw
        )}

        ${probabilityBar(
            "Victoire extérieur",
            away
        )}

        <hr>

        ${renderVerdict(verdict)}

    `;

}


// =========================================================
// AFFICHAGE BUTS
// =========================================================

function renderGoals(
    verdict
) {

    const goals =
        verdict?.expected_goals || {};


    return `

        <div class="row">

            <div class="top">

                <span>
                    Buts attendus domicile
                </span>

                <strong>
                    ${formatNumber(
                        goals.home,
                        2
                    )}
                </strong>

            </div>

        </div>


        <div class="row">

            <div class="top">

                <span>
                    Buts attendus extérieur
                </span>

                <strong>
                    ${formatNumber(
                        goals.away,
                        2
                    )}
                </strong>

            </div>

        </div>


        <div class="row">

            <div class="top">

                <span>
                    Total attendu
                </span>

                <strong>
                    ${formatNumber(
                        goals.total,
                        2
                    )}
                </strong>

            </div>

        </div>

    `;

}


// =========================================================
// AFFICHAGE DONNEES GENERALES
// =========================================================

function renderObject(
    data
) {

    if (
        !data
        || typeof data !== "object"
    ) {

        return `
            <p>
                Données non disponibles.
            </p>
        `;

    }


    return Object.entries(data)

        .map(([key, value]) => {

            if (
                typeof value === "object"
                && value !== null
            ) {

                return `

                    <div class="row">

                        <strong>
                            ${escapeHtml(key)}
                        </strong>

                        <br>

                        <small>
                            ${escapeHtml(
                                JSON.stringify(value)
                            )}
                        </small>

                    </div>

                `;

            }


            return `

                <div class="row">

                    <div class="top">

                        <span>
                            ${escapeHtml(key)}
                        </span>

                        <strong>
                            ${escapeHtml(value)}
                        </strong>

                    </div>

                </div>

            `;

        })

        .join("");

}


// =========================================================
// AFFICHAGE SCORES EXACTS
// =========================================================

function renderScores(
    analysis
) {

    if (!analysis) {

        return `
            <p>
                Scores non disponibles.
            </p>
        `;

    }


    const scores =
        analysis.scores
        || analysis.exact_scores
        || analysis.score_predictions
        || [];


    if (!Array.isArray(scores)) {

        return `
            <p>
                Scores exacts non disponibles.
            </p>
        `;

    }


    return scores.map(score => {

        if (
            typeof score === "object"
            && score !== null
        ) {

            const label =
                score.label
                || score.score
                || `${score.home ?? ""}-${score.away ?? ""}`;


            const probability =
                score.probability
                || score.prob
                || "";


            return `

                <div class="score">

                    <span>
                        ${escapeHtml(label)}
                    </span>

                    <strong>
                        ${probability !== ""
                            ? `${probability}%`
                            : ""}
                    </strong>

                </div>

            `;

        }


        return `

            <div class="score">

                ${escapeHtml(score)}

            </div>

        `;

    }).join("");

}


// =========================================================
// AFFICHAGE SOURCES
// =========================================================

function renderSources(
    sources
) {

    if (!Array.isArray(sources)) {

        return `
            <p>
                Aucune source.
            </p>
        `;

    }


    return sources.map(source => `

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
                $("file")?.files?.[0];


            if (!file) {

                alert(
                    "Choisis une capture d'écran."
                );

                return;

            }


            const ocrBox =
                $("ocrBox");


            if (ocrBox) {

                ocrBox.classList
                    .remove("hidden");


                ocrBox.textContent =
                    "Lecture de la capture...";

            }


            const formData =
                new FormData();


            formData.append(
                "screenshot",
                file
            );


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


                let content =

                    data.ocr_text
                    || "Aucun texte détecté.";


                if (
                    Array.isArray(
                        data.candidate_lines
                    )

                    &&

                    data.candidate_lines.length > 0
                ) {

                    content +=

                        "\n\n--- Lignes détectées ---\n\n"

                        +

                        data.candidate_lines.join(
                            "\n"
                        );

                }


                if (ocrBox) {

                    ocrBox.textContent =
                        content;

                }

            }

            catch (error) {

                console.error(error);


                if (ocrBox) {

                    ocrBox.textContent =

                        "Erreur pendant la lecture de la capture.";

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


            const home =
                $("home")?.value.trim();


            const away =
                $("away")?.value.trim();


            const competition =
                $("competition")?.value.trim()
                || "";


            if (!home || !away) {

                alert(
                    "Indique les deux équipes."
                );

                return;

            }


            // =================================================
            // LOADING
            // =================================================

            $("loading")
                ?.classList
                .remove("hidden");


            $("report")
                ?.classList
                .add("hidden");


            // =================================================
            // DONNEES FORMULAIRE
            // =================================================

            const formData =
                new FormData();


            formData.append(
                "home",
                home
            );


            formData.append(
                "away",
                away
            );


            formData.append(
                "competition",
                competition
            );


            try {

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


                if ($("matchOut")) {

                    $("matchOut").textContent =

                        `${match.home || home} vs ${match.away || away}`;

                }


                // =============================================
                // COMPETITION
                // =============================================

                if ($("compOut")) {

                    $("compOut").textContent =

                        match.competition
                        || competition
                        || "Compétition non précisée";

                }


                // =============================================
                // CONFIANCE
                // =============================================

                const confidence =
                    data.verdict?.confidence
                    || 0;


                if ($("confidence")) {

                    $("confidence").textContent =

                        `${formatNumber(
                            confidence,
                            1
                        )}%`;

                }


                // =============================================
                // RESULTAT
                // =============================================

                if ($("result")) {

                    $("result").innerHTML =

                        renderResult(

                            data.analysis,

                            data.verdict

                        );

                }


                // =============================================
                // BUTS
                // =============================================

                if ($("goals")) {

                    $("goals").innerHTML =

                        renderGoals(
                            data.verdict
                        );

                }


                // =============================================
                // CORNERS
                // =============================================

                if ($("corners")) {

                    const corners =

                        data.analysis?.expected?.corners

                        ||

                        data.analysis?.corners

                        ||

                        data.provider_data?.corners

                        ||

                        null;


                    $("corners").innerHTML =

                        corners

                            ? renderObject(corners)

                            : `

                                <p>
                                    Données corners non disponibles.
                                </p>

                            `;

                }


                // =============================================
                // SCORES EXACTS
                // =============================================

                if ($("scores")) {

                    $("scores").innerHTML =

                        renderScores(
                            data.analysis
                        );

                }


                // =============================================
                // INDICATEURS ATTENDUS
                // =============================================

                if ($("expected")) {

                    const expected =

                        data.analysis?.expected

                        ||

                        data.verdict?.expected_goals

                        ||

                        {};


                    $("expected").innerHTML =

                        renderObject(
                            expected
                        );

                }


                // =============================================
                // SOURCES
                // =============================================

                if ($("sources")) {

                    $("sources").innerHTML =

                        renderSources(
                            data.sources
                        );

                }


                // =============================================
                // DISCLAIMER
                // =============================================

                if ($("disclaimer")) {

                    $("disclaimer").textContent =

                        data.disclaimer

                        ||

                        "Les résultats sont des estimations probabilistes et non des garanties.";

                }


                // =============================================
                // AFFICHAGE RAPPORT
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

                    "Impossible d'analyser le match. Vérifie que le serveur FastAPI fonctionne."

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

                        `
                        <p>
                            Aucun historique.
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
                            verdict.main_prediction || {};


                        let date =

                            item.saved_at
                            || "";


                        try {

                            if (date) {

                                date =
                                    new Date(
                                        date
                                    )
                                    .toLocaleString(
                                        "fr-FR"
                                    );

                            }

                        }

                        catch (error) {

                            console.error(error);

                        }


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


                                <br><br>


                                🏆


                                ${escapeHtml(

                                    prediction.label

                                    ||

                                    "Analyse disponible"

                                )}


                                <br>


                                <small>

                                    ${escapeHtml(
                                        date
                                    )}

                                </small>

                            </div>

                        `;

                    }).join("");

            }

            catch (error) {

                console.error(error);


                if (historyEl) {

                    historyEl.innerHTML =

                        `
                        <p>
                            Impossible de charger l'historique.
                        </p>
                        `;

                }

            }

        };

}


// =========================================================
// PWA / INSTALLATION
// =========================================================

let deferredPrompt = null;


const installBtn =
    $("installBtn");


window.addEventListener(

    "beforeinstallprompt",

    event => {

        event.preventDefault();


        deferredPrompt =
            event;


        if (installBtn) {

            installBtn.classList
                .remove("hidden");

        }

    }

);


if (installBtn) {

    installBtn.onclick =
        async () => {

            if (!deferredPrompt) {

                alert(

                    "Utilise le menu du navigateur puis « Installer l'application » ou « Ajouter à l'écran d'accueil »."

                );

                return;

            }


            deferredPrompt.prompt();


            await deferredPrompt
                .userChoice;


            deferredPrompt =
                null;


            installBtn.classList
                .add("hidden");

        };

}


window.addEventListener(

    "appinstalled",

    () => {

        if (installBtn) {

            installBtn.classList
                .add("hidden");

        }

    }

);
