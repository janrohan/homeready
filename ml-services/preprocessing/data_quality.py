import pandas as pd
import numpy as np
from pathlib import Path
from matplotlib import pyplot as plt
import seaborn as sns

# ------------------------------
# Helper Functions
# ------------------------------

def check_numeric_ranges(df):
    print("\n=== NUMERIC RANGE CHECKS ===")

    rules = {
        "age": (18, 60),
        "starting_income": (15000, 150000),
        "income_growth_rate": (0.0, 0.12),
        "savings_rate": (0.0, 0.35),
        "current_savings": (0, None),
        "debt_level": (0, None),
        "property_price": (50000, None),
        "price_per_sqm": (500, 20000),
        "years_to_readiness": (0, 40),
    }

    bad_rows = {}

    for col, (low, high) in rules.items():
        if low is not None:
            invalid_low = df[df[col] < low]
            if len(invalid_low):
                bad_rows[col + "_too_low"] = invalid_low.index.tolist()

        if high is not None:
            invalid_high = df[df[col] > high]
            if len(invalid_high):
                bad_rows[col + "_too_high"] = invalid_high.index.tolist()

    if not bad_rows:
        print("✔ All numeric values within expected ranges.")
    else:
        print("⚠ Found problematic values:")
        for k, rows in bad_rows.items():
            print(f" - {k}: {len(rows)} rows")

    return bad_rows


def check_missing_values(df):
    print("\n=== MISSING VALUE CHECK ===")
    missing = df.isnull().sum()
    print(missing[missing > 0])


def check_category_distributions(df, category_cols):
    print("\n=== CATEGORY DISTRIBUTIONS ===")
    for col in category_cols:
        print(f"\n--- {col.upper()} ---")
        print(df[col].value_counts(normalize=True) * 100)


def detect_outliers(df, cols):
    print("\n=== OUTLIER DETECTION (IQR & Z-SCORE) ===")

    outlier_report = {}

    for col in cols:
        series = df[col]

        # IQR-based outliers
        Q1 = series.quantile(0.25)
        Q3 = series.quantile(0.75)
        IQR = Q3 - Q1
        iqr_mask = (series < (Q1 - 1.5 * IQR)) | (series > (Q3 + 1.5 * IQR))

        # Z-score outliers
        z_scores = (series - series.mean()) / series.std()
        z_mask = np.abs(z_scores) > 3

        outlier_report[col] = {
            "iqr_outliers": int(iqr_mask.sum()),
            "z_outliers": int(z_mask.sum())
        }

    for col, info in outlier_report.items():
        print(f"{col}: IQR={info['iqr_outliers']}, Z={info['z_outliers']}")

    return outlier_report


def correlation_matrix(df, cols):
    print("\n=== CORRELATION MATRIX ===")
    corr = df[cols].corr()
    print(corr)
    return corr


def check_duplicates(df):
    print("\n=== DUPLICATE ROWS CHECK ===")
    dup = df.duplicated().sum()
    print(f"Duplicate rows: {dup}")
    return dup


# ------------------------------
# Main Data Quality Workflow
# ------------------------------

def main():
    root = Path(__file__).resolve().parents[2]
    data_path = root / "ml-services" / "data" / "synthetic_data.csv"

    print(f"Loading dataset from: {data_path}\n")
    df = pd.read_csv(data_path)



    # 4. Outliers
    numeric_cols = [
        "starting_income",
        "income_growth_rate",
        "current_savings",
        "savings_rate",
        "debt_level",
        "property_price",
        "price_per_sqm",
    ]
    detect_outliers(df, numeric_cols)

    # 5. Correlation matrix
    corr_cols = numeric_cols + ["years_to_readiness"]
    correlation_matrix(df, corr_cols)

    corr = df.corr(numeric_only=True)

    plt.figure(figsize=(12, 10))
    sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
    plt.show()


    # ------------------------------
    # Automatic Cleaning
    # ------------------------------

    print("\n=== CLEANING DATASET ===")

    # Drop values outside expected ranges
    for col, (low, high) in {
        "starting_income": (15000, 150000),
        "income_growth_rate": (0.0, 0.12),
        "savings_rate": (0.0, 0.35),
        "property_price": (50000, None),
        "price_per_sqm": (500, 20000)
    }.items():
        if low is not None:
            df = df[df[col] >= low]
        if high is not None:
            df = df[df[col] <= high]

    # Export cleaned dataset
    clean_path = root / "ml-services" / "data" / "synthetic_data_cleaned.csv"
    df.to_csv(clean_path, index=False)

    print(f"✔ Cleaned dataset saved to: {clean_path}")
    print(f"Final cleaned size: {df.shape[0]} rows")


if __name__ == "__main__":
    main()
