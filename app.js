const $ = id => document.getElementById(id);


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

    el.innerHTML = arr.map((item) => {

        if (typeof item === "object") {
            return `<div class="row">
                ${JSON.stringify(item)}
            </div>`;
        }

        return `<div class="row">${item}</div>`;

    }).join("");

}


// =========================================================
// CREATION CARTE VERDICT
// =========================================================

function verdictCard(title, icon, content) {

    return `
        <div class="verdict-card">

            <div class="verdict-title">
                <span>${icon}</span>
                <strong>${title}</strong>
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

                <h3>${main.label}</h3>

                <div class="probability">
                    Confiance :
                    <strong>${main.confidence}%</strong>
                </div>

                <div class="market">
                    Marché : <strong>${main.market}</strong>
                </div>

                <hr>

                <div class="alternative">
                    Alternative :
                    <strong>${main.alternative}</strong>
                    <br>
                    ${main.alternative_label}
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
            <h3>${handicap.label}</h3>

            <p>
                ${handicap.description}
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
            <h3>${tightness.label}</h3>

            <p>
                ${tightness.description}
            </p>
            `
        );

    }


    // =====================================================
    // AGRESSIVITE DOMICILE
    // =====================================================

    const homeAggression = verdict.home_aggression;

    if (homeAggression) {

        html += verdictCard(

            `Profil offensif : ${homeAggression.team}`,

            homeAggression.icon || "🔥",

            `
            <h3>${homeAggression.label}</h3>

            <div class="probability">

                Intensité offensive :
                <strong>
                    ${homeAggression.score}/100
                </strong>

            </div>

            <p>
                ${homeAggression.description}
            </p>
            `
        );

    }


    // =====================================================
    // AGRESSIVITE EXTERIEUR
    // =====================================================

    const awayAggression = verdict.away_aggression;

    if (awayAggression) {

        html += verdictCard(

            `Profil offensif : ${awayAggression.team}`,

            awayAggression.icon || "🔥",

            `
            <h3>${awayAggression.label}</h3>

            <div class="probability">

                Intensité offensive :
                <strong>
                    ${awayAggression.score}/100
                </strong>

            </div>

            <p>
                ${awayAggression.description}
            </p>
            `
        );

    }


    // =====================================================
    // PREMIER BUT
    // =====================================================

    const firstGoal = verdict.first_goal;

    if (firstGoal) {

        html += verdictCard(

            "Timing du premier but",

            firstGoal.icon || "⚽",

            `
            <h3>${firstGoal.label}</h3>

            <p>
                ${firstGoal.description}
            </p>
            `
        );

    }


    // =====================================================
    // PROBABILITES 1X2
    // =====================================================

    const probabilities = verdict.probabilities;

    if (probabilities) {

        html += verdictCard(

            "Probabilités 1X2",

            "📈",

            `
            <div class="probability-row">

                <div>
                    Domicile :
                    <strong>
                        ${probabilities.home_win}%
                    </strong>
                </div>

                <div>
                    Nul :
                    <strong>
                        ${probabilities.draw}%
                    </strong>
                </div>

                <div>
                    Extérieur :
                    <strong>
                        ${probabilities.away_win}%
                    </strong>
                </div>

            </div>
            `
        );

    }


    // =====================================================
    // BUTS ATTENDUS
    // =====================================================

    const goals = verdict.expected_goals;

    if (goals) {

        html += verdictCard(

            "Buts attendus",

            "⚽",

            `
            <div class="goals-row">

                <div>
                    Domicile :
                    <strong>
                        ${goals.home}
                    </strong>
                </div>

                <div>
                    Extérieur :
                    <strong>
                        ${goals.away}
                    </strong>
                </div>

                <div>
                    Total :
                    <strong>
                        ${goals.total}
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

const readBtn = $("readBtn");


if (readBtn) {

    readBtn.onclick = async () => {

        const file = $("file").files[0];

        if (!file) {

            alert(
                "Choisis une capture d'écran."
            );

            return;

        }


        const form = new FormData();

        form.append(
            "screenshot",
            file
        );


        $("ocrBox").textContent =
            "Lecture de la capture...";


        try {

            const response = await fetch(

                "/api/read-capture",

                {
                    method: "POST",

                    body: form
                }

            );


            const data =
                await response.json();


            $("ocrBox").textContent =
                data.ocr_text
                || "Aucun texte détecté.";


        }

        catch (error) {

            $("ocrBox").textContent =
                "Erreur pendant la lecture.";

            console.error(error);

        }

    };

}


// =========================================================
// ANALYSE DU MATCH
// =========================================================

const form = $("form");


if (form) {

    form.onsubmit = async (event) => {

        event.preventDefault();


        // -----------------------------------------------
        // LOADING
        // -----------------------------------------------

        $("loading")
            ?.classList
            .remove("hidden");


        $("report")
            ?.classList
            .add("hidden");


        try {

            // -------------------------------------------
            // FORM DATA
            // -------------------------------------------

            const formData =
                new FormData(form);


            // -------------------------------------------
            // API ANALYSE
            // -------------------------------------------

            const response = await fetch(

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


            // -------------------------------------------
            // MATCH
            // -------------------------------------------

            const match =
                data.match || {};


            $("matchOut").textContent =

                `${match.home || ""}

                vs

                ${match.away || ""}`;


            // -------------------------------------------
            // COMPETITION
            // -------------------------------------------

            const competition =
                match.competition
                || "";


            const competitionEl =
                $("competitionOut");


            if (competitionEl) {

                competitionEl.textContent =
                    competition;

            }


            // -------------------------------------------
            // ANALYSE CLASSIQUE
            // -------------------------------------------

            const analysis =
                data.analysis || {};


            // Affichage simple des données
            const analysisEl =
                $("analysisOut");


            if (analysisEl) {

                analysisEl.innerHTML =
                    `<pre>${JSON.stringify(
                        analysis,
                        null,
                        2
                    )}</pre>`;

            }


            // -------------------------------------------
            // VERDICT INTELLIGENT
            // -------------------------------------------

            const verdictEl =
                $("verdictOut");


            if (verdictEl) {

                verdictEl.innerHTML =
                    renderVerdict(
                        data.verdict
                    );

            }


            // -------------------------------------------
            // AFFICHAGE DU RAPPORT
            // -------------------------------------------

            $("report")
                ?.classList
                .remove("hidden");


            $("report")
                ?.scrollIntoView({

                    behavior: "smooth"

                });


        }

        catch (error) {

            console.error(error);


            alert(

                "Impossible d'analyser le match."

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


                const data =
                    await response.json();


                const historyEl =
                    $("history");


                if (!historyEl) {

                    return;

                }


                if (
                    !Array.isArray(data)
                    || data.length === 0
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


                        return `

                        <div class="history-item">

                            <strong>

                                ${match.home}
                                vs
                                ${match.away}

                            </strong>

                            <br>

                            ${match.competition || ""}

                            <br>

                            🏆

                            ${prediction.label
                                || "Analyse disponible"}

                            <br>

                            <small>

                                ${item.saved_at
                                    || ""}

                            </small>

                        </div>

                        `;

                    }).join("");


            }

            catch (error) {

                console.error(error);

            }

        };

                  }
