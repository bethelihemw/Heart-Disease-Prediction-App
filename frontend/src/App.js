import { useState } from "react";
import "./App.css"

function App() {
  const [form, setForm] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    thalach: "",
    exang: "",
    oldpeak: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Payload sent to backend (includes defaults)
    const payload = {
      age: Number(form.age),
      sex: Number(form.sex),
      cp: Number(form.cp),
      trestbps: Number(form.trestbps),
      chol: Number(form.chol),
      thalach: Number(form.thalach),
      exang: Number(form.exang),
      oldpeak: Number(form.oldpeak),

      // Auto-filled values (hidden from users)
      fbs: 0,
      restecg: 1,
      slope: 1,
      ca: 0,
      thal: 2
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8080/predict/logistic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      setResult(data.prediction);
    } catch (error) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Heart Disease Prediction</h2>

      <form onSubmit={handleSubmit}>
        <label>Age</label>
        <input type="number" name="age" onChange={handleChange} required />

        <label>Sex</label>
        <select name="sex" onChange={handleChange} required>
          <option value="">Select</option>
          <option value="1">Male</option>
          <option value="0">Female</option>
        </select>

        <label>Chest Pain Type</label>
        <select name="cp" onChange={handleChange} required>
          <option value="">Select</option>
          <option value="0">Typical Angina</option>
          <option value="1">Atypical Angina</option>
          <option value="2">Non-anginal Pain</option>
          <option value="3">Asymptomatic</option>
        </select>

        <label>Resting Blood Pressure (mm Hg)</label>
        <input type="number" name="trestbps" onChange={handleChange} required />

        <label>Cholesterol (mg/dl)</label>
        <input type="number" name="chol" onChange={handleChange} required />

        <label>Maximum Heart Rate Achieved</label>
        <input type="number" name="thalach" onChange={handleChange} required />

        <label>Exercise-induced Chest Pain?</label>
        <select name="exang" onChange={handleChange} required>
          <option value="">Select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label>ST Depression (Oldpeak)</label>
        <input
          type="number"
          step="0.1"
          name="oldpeak"
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result !== null && (
        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          {result === 1 ? (
            <p style={{ color: "red" }}>
              ⚠️ High risk of heart disease. Please consult a doctor.
            </p>
          ) : (
            <p style={{ color: "green" }}>
              ✅ Low risk of heart disease.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
