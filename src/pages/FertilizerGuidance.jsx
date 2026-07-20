import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../contexts/LanguageContext";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import { Download, Sprout, Loader2 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const API = axios.create({
  baseURL: "https://krishi-backend-1-e2vy.onrender.com/api",
});

async function fetchFontAsBase64(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

export default function FertilizerGuidance() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const { t, language } = useLanguage();
  const lang = language === "ml" ? "ml" : "en";

  const [fertilizerData, setFertilizerData] = useState({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [weather, setWeather] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const fontLoadedRef = useRef(false);

  useEffect(() => {
    API.get("/fertilizer/all")
      .then((res) => {
        const mapped = {};
        res.data.forEach((item) => {
          let priorityTag = "all";
          const npk = item.npk.toLowerCase();
          if (npk.includes("n")) priorityTag = "high-n";
          if (npk.includes("p")) priorityTag = "high-p";
          if (npk.includes("k")) priorityTag = "high-k";

          let weatherTag = "all";
          const w = item.weather.toLowerCase();

          if (w.includes("rain") || w.includes("rainfall"))
            weatherTag = "rain-sensitive";
          if (w.includes("water") || w.includes("waterlogging"))
            weatherTag = "waterlogging-sensitive";
          if (w.includes("moist") || w.includes("humidity"))
            weatherTag = "moisture-sensitive";

          mapped[item.crop] = {
            en: {
              name: item.crop,
              npk: item.npk,
              weather: item.weather,
              key: item.key,
            },
            ml: {
              name: item.crop,
              npk: item.npk,
              weather: item.weather,
              key: item.key,
            },
            category: item.category || "general",
            priority: priorityTag,
            weatherTag: weatherTag,
          };
        });
        setFertilizerData(mapped);
      })
      .catch((err) => console.error("Backend fetch error:", err));
  }, []);

  const cropKeys = Object.keys(fertilizerData);

  const filteredCrops = cropKeys.filter((crop) => {
    const entry = fertilizerData[crop];
    const nameEn = entry.en.name.toLowerCase();
    const nameMl = entry.ml.name.toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch = nameEn.includes(q) || nameMl.includes(q);
    const matchesCategory = category === "all" || entry.category === category;
    const matchesPriority = priority === "all" || entry.priority === priority;
    const matchesWeather = weather === "all" || entry.weatherTag === weather;

    return matchesSearch && matchesCategory && matchesPriority && matchesWeather;
  });

  async function generatePDF() {
    setIsGenerating(true);

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      let cursorY = margin;

      if (lang === "ml" && !fontLoadedRef.current) {
        try {
          const base64Font = await fetchFontAsBase64(
            "https://cdn.jsdelivr.net/gh/google/fonts/ofl/notosansmalayalam/NotoSansMalayalam-Regular.ttf"
          );
          doc.addFileToVFS("NotoSansMalayalam-Regular.ttf", base64Font);
          doc.addFont("NotoSansMalayalam-Regular.ttf", "NotoMalayalam", "normal");
          fontLoadedRef.current = true;
        } catch (e) {
          console.error("Malayalam font loading failed:", e);
        }
      }

      const pdfFont =
        lang === "ml" && fontLoadedRef.current ? "NotoMalayalam" : "helvetica";

      doc.setFont(pdfFont);
      doc.setFontSize(20);
      const title = lang === "ml" ? "വളം മാർഗ്ഗനിർദ്ദേശങ്ങൾ" : "Fertilizer Guidance";
      doc.text(title, margin, cursorY);
      cursorY += 28;

      doc.setFontSize(11);
      const subtitle = t("fertilizerGuideSubtitle");
      const subtitleLines = doc.splitTextToSize(subtitle, maxWidth);
      doc.text(subtitleLines, margin, cursorY);
      cursorY += subtitleLines.length * 14 + 10;

      doc.setDrawColor(180);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 16;

      doc.setFontSize(12);

      for (let key of filteredCrops) {
        const crop = fertilizerData[key][lang];

        if (cursorY > pageHeight - 100) {
          doc.addPage();
          doc.setFont(pdfFont);
          cursorY = margin;
        }

        doc.setFontSize(14);
        doc.text(crop.name, margin, cursorY);
        cursorY += 22;

        doc.setFontSize(11);
        const npkText = `${t("NPKLabel")} ${crop.npk}`;
        const npkLines = doc.splitTextToSize(npkText, maxWidth);
        doc.text(npkLines, margin, cursorY);
        cursorY += npkLines.length * 14 + 6;

        const weatherText = `${t("weatherPrecautionLabel")} ${crop.weather}`;
        const weatherLines = doc.splitTextToSize(weatherText, maxWidth);
        doc.text(weatherLines, margin, cursorY);
        cursorY += weatherLines.length * 14 + 6;

        const keyText = `${t("keyTakeawayLabel")} ${crop.key}`;
        const keyLines = doc.splitTextToSize(keyText, maxWidth);
        doc.text(keyLines, margin, cursorY);
        cursorY += keyLines.length * 14 + 14;

        doc.setDrawColor(230);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 16;
      }

      const fileName =
        lang === "ml" ? "fertilizer_guide_ml.pdf" : "fertilizer_guide_en.pdf";
      doc.save(fileName);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(t("pdfFailed"));
    }

    setIsGenerating(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="Agro Nutrition"
          badgeIcon={Sprout}
          title={t("fertilizerGuideTitle")}
          subtitle="Comprehensive N-P-K nutrient schedules, weather application precautions, and crop recommendations."
          actions={
            <Button onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{isGenerating ? "Generating..." : "Export PDF"}</span>
            </Button>
          }
        />

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder={lang === "ml" ? "വിളയുടെ പേര് തിരയുക…" : "Search crop…"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">{lang === "ml" ? "എല്ലാ വിഭാഗങ്ങൾ" : "All Categories"}</option>
                <option value="cereal">{lang === "ml" ? "ധാന്യങ്ങൾ" : "Cereals"}</option>
                <option value="plantation">{lang === "ml" ? "തോട്ടവിളകൾ" : "Plantation"}</option>
                <option value="spice">{lang === "ml" ? "മസാല" : "Spices"}</option>
                <option value="vegetable">{lang === "ml" ? "പച്ചക്കറികൾ" : "Vegetables"}</option>
              </select>

              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="all">{lang === "ml" ? "എല്ലാ NPK" : "All NPK Priority"}</option>
                <option value="high-n">{lang === "ml" ? "ഉയർന്ന N" : "High Nitrogen"}</option>
                <option value="high-p">{lang === "ml" ? "ഉയർന്ന P" : "High Phosphorus"}</option>
                <option value="high-k">{lang === "ml" ? "ഉയർന്ന K" : "High Potassium"}</option>
              </select>

              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              >
                <option value="all">{lang === "ml" ? "എല്ലാം" : "All Weather Types"}</option>
                <option value="rain-sensitive">{lang === "ml" ? "മഴ-സെൻസിറ്റീവ്" : "Rain Sensitive"}</option>
                <option value="waterlogging-sensitive">{lang === "ml" ? "വെള്ളക്കെട്ട്" : "Waterlogging Sensitive"}</option>
                <option value="moisture-sensitive">{lang === "ml" ? "നനവ്" : "Moisture Sensitive"}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCrops.length ? (
            filteredCrops.map((key) => {
              const crop = fertilizerData[key][lang];
              return (
                <Card key={key} className="hover:border-emerald-300">
                  <CardHeader className="bg-slate-50/50">
                    <CardTitle>{crop.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-4">
                    <p className="text-xs text-slate-700">
                      <strong className="font-bold text-slate-900">NPK Ratio:</strong> {crop.npk}
                    </p>
                    <p className="text-xs text-slate-700">
                      <strong className="font-bold text-slate-900">{lang === "ml" ? "കാലാവസ്ഥ:" : "Weather Precaution:"}</strong> {crop.weather}
                    </p>
                    <p className="text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 mt-2">
                      <strong className="font-bold text-emerald-800">{t("keyTakeawayLabel")}</strong> {crop.key}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-400">
              <p className="text-sm font-medium">
                {lang === "ml" ? "ഒന്നും കണ്ടെത്താനായില്ല." : "No matching crop guidance found."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
