import math

def poisson(k, lam):
    return math.exp(-lam) * lam**k / math.factorial(k)

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

def analyze(data: dict, home: str, away: str):
    # Pondération démonstrative. À calibrer sur historique réel.
    home_lambda = (
        0.32 * data["home_attack"] +
        0.26 * data["home_xg"] +
        0.22 * data["away_defense"] +
        0.12 * data["home_form"] +
        0.08
    ) * (1 - data["home_absence_impact"])

    away_lambda = (
        0.34 * data["away_attack"] +
        0.27 * data["away_xg"] +
        0.21 * data["home_defense"] +
        0.12 * data["away_form"] +
        0.03
    ) * (1 - data["away_absence_impact"])

    home_lambda = clamp(home_lambda, 0.35, 3.0)
    away_lambda = clamp(away_lambda, 0.25, 2.6)

    matrix = {}
    for h in range(8):
        for a in range(8):
            matrix[(h,a)] = poisson(h, home_lambda) * poisson(a, away_lambda)

    hw = sum(p for (h,a),p in matrix.items() if h>a)
    dr = sum(p for (h,a),p in matrix.items() if h==a)
    aw = sum(p for (h,a),p in matrix.items() if h<a)

    total = home_lambda + away_lambda
    over15 = 1 - sum(poisson(k,total) for k in range(2))
    over25 = 1 - sum(poisson(k,total) for k in range(3))
    under35 = sum(poisson(k,total) for k in range(4))
    btts = (1-poisson(0,home_lambda))*(1-poisson(0,away_lambda))

    corner_lambda = clamp(data["home_corners"] + data["away_corners"], 5.5, 14.0)
    over75 = 1-sum(poisson(k,corner_lambda) for k in range(8))
    over85 = 1-sum(poisson(k,corner_lambda) for k in range(9))
    over95 = 1-sum(poisson(k,corner_lambda) for k in range(10))

    exact = sorted(matrix.items(), key=lambda x:x[1], reverse=True)[:5]

    source_completeness = 0.58
    data_confidence = 0.62
    confidence = round((source_completeness*0.45 + data_confidence*0.55)*100)

    return {
        "expected": {"home_goals": round(home_lambda,2), "away_goals": round(away_lambda,2),
                     "total_goals": round(total,2), "total_corners": round(corner_lambda,1)},
        "result": {"home_win": round(hw*100,1), "draw": round(dr*100,1), "away_win": round(aw*100,1)},
        "goals": {"over_1_5": round(over15*100,1), "over_2_5": round(over25*100,1),
                  "under_3_5": round(under35*100,1), "btts_yes": round(btts*100,1)},
        "corners": {"over_7_5": round(over75*100,1), "over_8_5": round(over85*100,1),
                    "over_9_5": round(over95*100,1)},
        "exact_scores": [{"score":f"{h}-{a}", "probability":round(p*100,1)} for (h,a),p in exact],
        "confidence": confidence
    }
