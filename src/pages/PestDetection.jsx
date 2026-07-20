import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Bug,
  Pill,
  Info
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { isAuthenticated } from "../lib/actions/authActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DetectPest = () => {
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
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
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
    if (!selectedFile) {
      toast.error(t("selectFileFirst"));
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error(t("fileTooLarge"));
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://krishi-backend-1-e2vy.onrender.com/api/advisory/detect-pest-disease",
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
      console.log("Pest Analysis Result:", result);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisResult({
        Pest: t("networkError"),
        confidence: 0,
        severity: t("unknown"),
        treatment: [],
        prevention: [t("analysisNetworkError") + ": " + err.message],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Bug className="h-4 w-4 text-emerald-700" />
            <span>Crop Diagnostics Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {t("pestDetection.title")}
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            {t("pestDetection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Upload Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Camera className="h-5 w-5 text-emerald-600" />
              <span>{t("uploadImage.title")}</span>
            </h2>

            {!previewUrl ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[260px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
                  <UploadIcon className="h-6 w-6" />
                </div>

                <p className="text-sm font-semibold text-slate-800 mb-1">
                  {t("uploadArea.dropOrClick")}
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  {t("uploadArea.supports")}
                </p>

                <button
                  type="button"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  {t("uploadButtons.chooseFile")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Selected Crop Sample"
                    className="w-full h-64 object-cover"
                  />

                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      setSelectedFile(null);
                      setAnalysisResult(null);
                    }}
                    className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("analyzing")}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{t("analyzeButton")}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          {/* Diagnostic Report Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[340px] flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-emerald-600" />
              <span>{t("analysisResults.title")}</span>
            </h2>

            {!analysisResult && !isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <FileImage className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm font-medium">{t("analysisResults.empty")}</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-700">{t("analysisProgress")}</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-5 animate-fade-in">

                {/* Detected Pest Card */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-1 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Identified Issue</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-amber-950">
                    {analysisResult.Pest}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-amber-800">
                    <span>Confidence: {analysisResult.confidence}%</span>
                    <span>•</span>
                    <span>Severity: {analysisResult.severity}</span>
                  </div>
                </div>

                {/* Treatments */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Recommended Treatment</span>
                  </h3>
                  <ul className="space-y-1.5 text-sm text-slate-700">
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
                      <li className="text-xs text-slate-500">No treatment steps listed.</li>
                    )}
                  </ul>
                </div>

                {/* Pesticides */}
                {analysisResult.Pesticides && analysisResult.Pesticides.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Pill className="h-4 w-4 text-teal-600" />
                      <span>Approved Pesticides & Dosage</span>
                    </h3>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {analysisResult.Pesticides.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {analysisResult.Quantity && (
                      <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <strong className="font-semibold text-slate-800">Dosage Rate:</strong> {analysisResult.Quantity}
                      </p>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default DetectPest;
