import React, { useEffect, useState } from "react";
import { Loader2, FlaskConical, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export default function SoilScanner() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [form, setForm] = useState({
    N: 100,
    P: 20,
    K: 150,
    pH: 6.5,
    moisture: 20,
    ec: 0.6,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  }

  async function submitJSON(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://krishi-backend-1-e2vy.onrender.com/api/soil/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Agro Science Engine"
          badgeIcon={FlaskConical}
          title="Soil Health Scanner"
          subtitle="Analyze key chemical parameters (N-P-K, pH, Moisture, EC) to predict soil health status and recommended treatments."
        />

        {/* Input Form Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Soil Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitJSON} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Nitrogen (N) mg/kg", name: "N" },
                  { label: "Phosphorus (P) mg/kg", name: "P" },
                  { label: "Potassium (K) mg/kg", name: "K" },
                  { label: "pH Level", name: "pH", step: "0.1" },
                  { label: "Moisture (%)", name: "moisture" },
                  { label: "EC (dS/m)", name: "ec", step: "0.1" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      {field.label}
                    </label>
                    <Input
                      name={field.name}
                      type="number"
                      step={field.step || "1"}
                      value={form[field.name]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="animate-spin h-4 w-4" />}
                {loading ? "Analyzing Soil Sample..." : "Run Soil Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card className="border-emerald-200 bg-white">
            <CardHeader className="bg-emerald-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="emerald" className="mb-1">Analysis Completed</Badge>
                  <CardTitle className="text-2xl text-emerald-950">
                    Status: {result.prediction}
                  </CardTitle>
                </div>
                {result.confidence && (
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-medium">Confidence Score</span>
                    <p className="text-lg font-bold text-emerald-700">
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {Array.isArray(result.symptoms) && result.symptoms.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span>Identified Symptoms & Deficiencies</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 pl-6 list-disc">
                    {result.symptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(result.recommended_actions) && result.recommended_actions.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Recommended Corrective Actions</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 pl-6 list-disc">
                    {result.recommended_actions.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
