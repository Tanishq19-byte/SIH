"""
TRAINING & VALIDATION PIPELINE - NER-SmartRoute AI Microservice (v1.1)
Trains a Random Forest Classifier on 110 prototype records with 5-Fold Stratified Cross-Validation,
ROC-AUC metric calculation, classification report, and ranked feature importances.
"""

import json
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

from app.preprocessing import FeaturePreprocessor, FEATURE_NAMES

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "training_data.json")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "disruption_model.joblib")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.joblib")

def train_and_validate():
    print("====================================================")
    print("  NER-SmartRoute AI Model Training & Validation (v1.1)")
    print("====================================================")

    # 1. Load Training Dataset
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Training dataset missing at {DATA_PATH}")

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        records = json.load(f)

    print(f"[1/7] Loaded {len(records)} prototype training records.")

    df = pd.DataFrame(records)
    X_df = df[FEATURE_NAMES]
    y = df["actualDisruption"].values

    # 2. Holdout Train / Test Split (80/20)
    X_train_df, X_test_df, y_train, y_test = train_test_split(
        X_df, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"[2/7] Split holdout data: {len(X_train_df)} Train samples, {len(X_test_df)} Test samples.")

    # 3. Fit Preprocessing Pipeline on Training Set
    preprocessor = FeaturePreprocessor()
    X_train_scaled = preprocessor.fit_transform(X_train_df)
    X_test_scaled = preprocessor.transform(X_test_df)

    print("[3/7] Fitted feature preprocessor (StandardScaler).")

    # 4. Stratified 5-Fold Cross-Validation on Full Dataset
    print("[4/7] Performing Stratified 5-Fold Cross-Validation...")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    cv_accs, cv_precs, cv_recs, cv_f1s = [], [], [], []
    X_all_scaled = FeaturePreprocessor().fit_transform(X_df)

    for fold, (train_idx, val_idx) in enumerate(skf.split(X_all_scaled, y), 1):
        X_cv_tr, y_cv_tr = X_all_scaled[train_idx], y[train_idx]
        X_cv_val, y_cv_val = X_all_scaled[val_idx], y[val_idx]

        cv_clf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
        cv_clf.fit(X_cv_tr, y_cv_tr)
        y_cv_pred = cv_clf.predict(X_cv_val)

        cv_accs.append(accuracy_score(y_cv_val, y_cv_pred))
        cv_precs.append(precision_score(y_cv_val, y_cv_pred, zero_division=0))
        cv_recs.append(recall_score(y_cv_val, y_cv_pred, zero_division=0))
        cv_f1s.append(f1_score(y_cv_val, y_cv_pred, zero_division=0))

    cv_acc_mean, cv_acc_std = np.mean(cv_accs), np.std(cv_accs)
    cv_prec_mean = np.mean(cv_precs)
    cv_rec_mean = np.mean(cv_recs)
    cv_f1_mean = np.mean(cv_f1s)

    # 5. Train Final Model on Holdout Training Set
    final_model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    final_model.fit(X_train_scaled, y_train)

    print("[5/7] Trained final RandomForestClassifier on holdout training set.")

    # 6. Evaluate Holdout Test Set Metrics
    y_pred = final_model.predict(X_test_scaled)
    y_pred_proba = final_model.predict_proba(X_test_scaled)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    cm = confusion_matrix(y_test, y_pred)
    clf_rep = classification_report(y_test, y_pred, target_names=["NO_MAJOR_DISRUPTION", "LIKELY_DISRUPTION"])

    # 7. Extract Feature Importances
    importances = final_model.feature_importances_
    ranked_features = sorted(zip(FEATURE_NAMES, importances), key=lambda x: x[1], reverse=True)

    print("\n----------------------------------------------------")
    print("        A. HOLDOUT TEST EVALUATION METRICS (80/20)")
    print("----------------------------------------------------")
    print(f"Accuracy  : {acc * 100:.2f}%")
    print(f"Precision : {prec * 100:.2f}%")
    print(f"Recall    : {rec * 100:.2f}%")
    print(f"F1 Score  : {f1 * 100:.2f}%")
    print(f"ROC-AUC   : {roc_auc:.4f}")
    print("Confusion Matrix:")
    print(cm)
    print("\nCLASSIFICATION REPORT:")
    print(clf_rep)

    print("----------------------------------------------------")
    print("     B. STRATIFIED 5-FOLD CROSS-VALIDATION RESULTS")
    print("----------------------------------------------------")
    print(f"CV Accuracy Mean  : {cv_acc_mean * 100:.2f}% (Std: ±{cv_acc_std * 100:.2f}%)")
    print(f"CV Precision Mean : {cv_prec_mean * 100:.2f}%")
    print(f"CV Recall Mean    : {cv_rec_mean * 100:.2f}%")
    print(f"CV F1 Score Mean  : {cv_f1_mean * 100:.2f}%")

    print("\n----------------------------------------------------")
    print("     C. TOP 10 MODEL FEATURE IMPORTANCES (RANKED)")
    print("----------------------------------------------------")
    for rank, (feat, imp) in enumerate(ranked_features[:10], 1):
        print(f"{rank:2d}. {feat:<28} : {imp * 100:6.2f}% (model feature importance)")

    print("----------------------------------------------------")
    print("NOTE: Prototype metrics reflect synthetic data patterns")
    print("and should not be interpreted as real-world performance.")

    # Save Model & Preprocessor Artifacts
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(final_model, MODEL_PATH)
    joblib.dump(preprocessor, PREPROCESSOR_PATH)

    print(f"\n[7/7] Saved model artifact -> '{MODEL_PATH}'")
    print(f"      Saved preprocessor artifact -> '{PREPROCESSOR_PATH}'")
    print("====================================================")

    return {
        "holdout": {
            "accuracy": float(acc),
            "precision": float(prec),
            "recall": float(rec),
            "f1": float(f1),
            "roc_auc": float(roc_auc),
            "confusion_matrix": cm.tolist()
        },
        "cv_5fold": {
            "accuracy_mean": float(cv_acc_mean),
            "accuracy_std": float(cv_acc_std),
            "precision_mean": float(cv_prec_mean),
            "recall_mean": float(cv_rec_mean),
            "f1_mean": float(cv_f1_mean)
        },
        "top_features": [{"feature": f, "importance": float(i), "percentage": round(float(i)*100, 2)} for f, i in ranked_features[:10]]
    }

if __name__ == "__main__":
    train_and_validate()
