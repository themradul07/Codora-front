import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Camera,
  FileImage,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FlaskConical
} from "lucide-react";
import { toast } from "react-toastify";
import { isAuthenticated } from "../lib/actions/authActions";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const DetectPesticide = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileRef = useRef(null);

  const handleFile = (file) => {
    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(
        "https://krishi-backend-1-e2vy.onrender.com/api/advisory/detect-pesticide",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to analyze!");

      const data = await response.json();
      setResult(data);
    } catch (e) {
      toast.error("Network error, try again");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStatusBadge = (status) => {
    if (status === "Allowed")
      return <Badge variant="emerald"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Allowed</Badge>;
    if (status === "Restricted")
      return <Badge variant="amber"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> Restricted</Badge>;
    if (status === "Banned")
      return <Badge variant="rose"><XCircle className="h-3.5 w-3.5 mr-1" /> Banned</Badge>;
    return <Badge variant="slate">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Chemical Scanner"
          badgeIcon={FlaskConical}
          title="Pesticide Detection"
          subtitle="Upload a photo of a pesticide bottle or chemical label to detect active ingredients and verify government regulations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Pesticide Image</CardTitle>
            </CardHeader>
            <CardContent>
              {!previewUrl ? (
                <div
                  className="border-2 border-dashed border-emerald-300 p-8 rounded-xl text-center cursor-pointer bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors flex flex-col items-center justify-center min-h-[220px]"
                  onClick={() => fileRef.current?.click()}
                >
                  <UploadIcon className="h-10 w-10 text-emerald-600 mb-3" />
                  <p className="font-bold text-sm text-slate-800 mb-1">Upload Label or Bottle Photo</p>
                  <p className="text-xs text-slate-500 mb-3">Supports JPG, PNG (Max 10MB)</p>
                  <Button size="sm" variant="secondary">Choose File</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="preview" className="w-full object-contain max-h-72" />
                    <button
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setResult(null);
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <Button
                    onClick={analyze}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing Chemical...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>Analyze Pesticide</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card className="min-h-[340px]">
            <CardHeader>
              <CardTitle>Analysis Diagnostic Report</CardTitle>
            </CardHeader>
            <CardContent>
              {!result && !isAnalyzing && (
                <div className="text-center text-slate-400 py-12">
                  <FileImage className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">Upload sample to view status</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin text-emerald-600" />
                  <p className="text-xs font-semibold text-slate-700">Identifying chemical compound...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4 animate-fade-in">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-lg font-extrabold text-slate-900">{result.name}</h3>
                    <div className="mt-2">
                      {renderStatusBadge(result.status)}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Ingredient</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {result.activeIngredient || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Chemical Category</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {result.category || "Unknown"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Detection Confidence</p>
                    <p className="text-sm font-bold text-emerald-700">{result.confidence}%</p>
                  </div>

                  {result.reason && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700">
                      {result.reason}
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

export default DetectPesticide;
