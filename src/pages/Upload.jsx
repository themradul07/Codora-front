import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Microscope,
  Sprout
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { isAuthenticated } from "../lib/actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const Upload = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error(t("pleaseLoginFirst"));
      navigate("/login");
    }
  }, [navigate, t]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File too large");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://krishi-backend-1-e2vy.onrender.com/api/advisory/detect-crop-disease",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to analyze image");

      const result = await response.json();
      console.log("Analysis:", result);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisResult({
        disease: "Network error",
        confidence: 0,
        severity: "Unknown",
        stage: "Unknown",
        treatment: [],
        prevention: [],
        Fertilizers: [],
        Quantity: "",
        quantityPerUnit: "",
        totalQuantity: "",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="AI Diagnostics"
          badgeIcon={Microscope}
          title={t("cropDetection.title")}
          subtitle={t("cropDetection.subtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* UPLOAD CARD */}
          <Card>
            <CardHeader>
              <CardTitle>{t("uploadImage.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              {!previewUrl ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[220px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon className="h-10 w-10 text-emerald-600 mb-3" />
                  <p className="font-bold text-sm text-slate-800 mb-1">{t("uploadArea.dropOrClick")}</p>
                  <p className="text-xs text-slate-500 mb-4">{t("uploadArea.supports")}</p>

                  <div className="flex gap-2">
                    <Button size="sm">
                      <Camera className="h-4 w-4" />
                      <span>{t("uploadButtons.takePhoto")}</span>
                    </Button>
                    <Button size="sm" variant="secondary">
                      <FileImage className="h-4 w-4" />
                      <span>{t("uploadButtons.chooseFile")}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={previewUrl} className="w-full max-h-72 object-contain" alt="preview" />
                    <button
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setAnalysisResult(null);
                      }}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>

                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t("analyzing")}</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>{t("analyzeButton")}</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </CardContent>
          </Card>

          {/* RESULTS CARD */}
          <Card className="min-h-[340px]">
            <CardHeader>
              <CardTitle>{t("analysisResults.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              {!analysisResult && !isAnalyzing && (
                <div className="text-center py-12 text-slate-400">
                  <FileImage className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium">{t("analysisResults.empty")}</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-700">{t("analysisProgress")}</p>
                </div>
              )}

              {analysisResult && (
                <div className="space-y-4 animate-fade-in">

                  {/* Disease Details Card */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{t("analysisResults.diseaseDetected")}</span>
                        <h3 className="text-lg font-extrabold text-amber-950 mt-0.5">{analysisResult.disease}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-amber-900">
                          <span>Confidence: {analysisResult.confidence}%</span>
                          <span>•</span>
                          <span>Severity: {analysisResult.severity}</span>
                        </div>
                      </div>
                      {analysisResult.totalQuantity && (
                        <Badge variant="emerald" className="bg-white text-emerald-800">
                          Total: {analysisResult.totalQuantity}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${analysisResult.confidence}%` }}
                        className="h-full bg-emerald-600 rounded-full"
                      ></div>
                    </div>
                  </div>

                  {/* Treatments */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{t("analysisResults.treatmentRecommendations")}</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {analysisResult.treatment?.length ? (
                        analysisResult.treatment.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-slate-400">No treatment steps found.</li>
                      )}
                    </ul>
                  </div>

                  {/* Fertilizers */}
                  {analysisResult.Fertilizers?.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <Sprout className="h-4 w-4 text-emerald-600" />
                        <span>Recommended Fertilizers</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {analysisResult.Fertilizers.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Upload;
