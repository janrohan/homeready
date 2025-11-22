import synthetic_generator
import pandas as pd
from pathlib import Path

def main():

    ROOT = Path(__file__).resolve().parents[2]

    df_real = pd.read_csv(ROOT / "data" / "synthetic_data.csv")

    print(df_real.ndim)
    print(df_real.shape)


if __name__ == "__main__":
    main()
