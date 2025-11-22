# ml-service/src/generator/simulation.py
import numpy as np

def simulate_readiness(
    starting_income,
    income_growth_rate,
    current_savings,
    savings_rate,
    debt_level,
    property_price,
    max_years=40,
    label_noise_std=1.5,
    return_timeline=False
):
    """
    Simulate year-by-year until:
      - downpayment (20%) is reached
      - DTI < 40%
    Returns:
      years_to_readiness (noisy, for ML label)
      optionally timeline: list[dict] for visualization
    """

    savings = float(current_savings)
    income = float(starting_income)
    REQUIRED_DOWNPAYMENT = property_price * 0.20

    timeline = []

    ready_year_raw = max_years  # raw (pre-noise) readiness time
    ready_found = False

    for year in range(max_years):
        # Check readiness conditions *before* this year's income increases
        monthly_income = income / 12
        monthly_mortgage = (property_price * 0.03 / 12) + (property_price * 0.02 / 12)
        dti = monthly_mortgage / max(monthly_income, 1e-6)

        has_downpayment = savings >= REQUIRED_DOWNPAYMENT
        is_dti_ok = dti < 0.40

        if (not ready_found) and has_downpayment and is_dti_ok:
            ready_year_raw = year
            ready_found = True

        timeline.append({
            "year": year,
            "annual_income": income,
            "savings": savings,
            "dti": dti,
            "has_downpayment": has_downpayment,
            "is_dti_ok": is_dti_ok,
            "ready": ready_found,
        })

        # simulate shocks: job loss, expenses, new debt
        if np.random.rand() < 0.03:  # 3% chance per year of big expense
            savings *= np.random.uniform(0.2, 0.7)

        if np.random.rand() < 0.03:  # 3% chance of taking additional credit
            debt_level += np.random.randint(2000, 15000)

        # incomes change over time with growth + noise
        income *= (1 + income_growth_rate * np.random.normal(1.0, 0.2))
        income = max(12000, income)

        # savings accumulate
        savings += income * savings_rate

    # Add noise to label (to avoid perfect determinism)
    noisy = ready_year_raw + np.random.normal(0, label_noise_std)
    noisy = max(0, min(max_years, noisy))

    if return_timeline:
        return noisy, ready_year_raw, timeline
    else:
        return noisy
