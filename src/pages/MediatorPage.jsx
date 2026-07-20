import React, { useEffect } from "react";
import { MessageCircle, Brain, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const MediatorPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Model Selector"
          badgeIcon={Sparkles}
          title="Ask With AI"
          subtitle="Choose which AI diagnostic engine model you wish to analyze your crop sample with."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-emerald-300">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100 shadow-xs">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Ask with Gemini Vision
              </h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Powered by Google Gemini Vision for multimodal crop & plant disease analysis.
              </p>
              <Button onClick={() => navigate("/upload")} className="w-full">
                Go to Gemini AI
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-300">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 shadow-xs">
                <Brain className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Ask with Custom Crop Model
              </h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Trained specifically on Kerala paddy, coconut, pepper, and banana crop diseases.
              </p>
              <Button onClick={() => navigate("/uploadmodel")} variant="dark" className="w-full">
                Go to Custom Model
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MediatorPage;
