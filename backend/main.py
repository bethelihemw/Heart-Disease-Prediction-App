from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Heart Disease API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
logistic_model = joblib.load("models/logistic_model.joblib")
tree_model = joblib.load("models/decision_tree_model.joblib")


class HeartFeatures(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int


@app.get("/")
def root():
    return {"message": "Heart Disease API is running. Use /docs to test."}


@app.post("/predict/logistic")
def predict_logistic(features: HeartFeatures):
    data = np.array([[
        features.age,
        features.sex,
        features.cp,
        features.trestbps,
        features.chol,
        features.fbs,
        features.restecg,
        features.thalach,
        features.exang,
        features.oldpeak,
        features.slope,
        features.ca,
        features.thal
    ]])

    prediction = logistic_model.predict(data)
    return {"prediction": int(prediction[0])}


@app.post("/predict/tree")
def predict_tree(features: HeartFeatures):
    data = np.array([[
        features.age,
        features.sex,
        features.cp,
        features.trestbps,
        features.chol,
        features.fbs,
        features.restecg,
        features.thalach,
        features.exang,
        features.oldpeak,
        features.slope,
        features.ca,
        features.thal
    ]])

    prediction = tree_model.predict(data)
    return {"prediction": int(prediction[0])}
