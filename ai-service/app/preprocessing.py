"""
FEATURE PREPROCESSING PIPELINE - NER-SmartRoute AI Microservice

Feature Scale Documentation:
-----------------------------------------------------------
1.  rainfall24h              : 0 to 300 mm (continuous)
2.  rainfallForecast         : 0 to 300 mm (continuous)
3.  terrainRisk              : 0.0 to 1.0 (normalized float)
4.  roadConditionScore       : 0.0 to 10.0 (1.0 Worst, 10.0 Best)
5.  historicalDisruptionCount: 0 to 30 events/month (count)
6.  floodProbability         : 0.0 to 100.0 (percent float)
7.  landslideProbability     : 0.0 to 100.0 (percent float)
8.  trafficScore             : 0.0 to 10.0 (continuous)
9.  riverLevelPercent        : 0.0 to 100.0 (percent float)
10. activeIncidentCount      : 0 to 10 (count)
11. vehicleCount             : 0 to 100 (count)
12. supplyUrgency            : 0.0 to 10.0 (continuous)
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    "rainfall24h",
    "rainfallForecast",
    "terrainRisk",
    "roadConditionScore",
    "historicalDisruptionCount",
    "floodProbability",
    "landslideProbability",
    "trafficScore",
    "riverLevelPercent",
    "activeIncidentCount",
    "vehicleCount",
    "supplyUrgency"
]

class FeaturePreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.feature_names = FEATURE_NAMES
        self.is_fitted = False

    def fit(self, df: pd.DataFrame):
        X = df[self.feature_names]
        self.scaler.fit(X)
        self.is_fitted = True
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise ValueError("FeaturePreprocessor must be fitted before calling transform()")
        X = df[self.feature_names]
        return self.scaler.transform(X)

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        self.fit(df)
        return self.transform(df)

    def dict_to_dataframe(self, data_dict: dict) -> pd.DataFrame:
        """Converts a single request dict or dict payload into a DataFrame matching feature names."""
        single_row = {k: [data_dict[k]] for k in self.feature_names}
        return pd.DataFrame(single_row)
