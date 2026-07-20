import React, { useEffect, useMemo, useState } from "react";
import { getJSON, postJSON } from "../api";
import {
  Droplets,
  Sprout,
  Bug,
  Tractor,
  MoreHorizontal,
  CheckCircle2,
  Search,
  RefreshCw,
  Sparkles,
  Activity,
  Calendar,
  Loader2
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { toast } from "react-toastify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const iconsMap = {
  irrigation: <Droplets className="h-5 w-5 text-emerald-600" />,
  fertilization: <Sprout className="h-5 w-5 text-emerald-600" />,
  pesticide_application: <Bug className="h-5 w-5 text-rose-600" />,
  harvesting: <Tractor className="h-5 w-5 text-amber-600" />,
  other: <MoreHorizontal className="h-5 w-5 text-slate-500" />,
};

function truncateText(str, n = 300) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export default function ActivityDashboard() {
  const { t } = useLanguage();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [suggestions, setSuggestions] = useState([]);
  const [lastAiAt, setLastAiAt] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const loadActivities = () => {
    setLoading(true);
    getJSON("/activity/list")
      .then((res) => {
        setActivities(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load activities", err);
        setError(t("failedLoadActivities"));
        toast.error(t("failedLoadActivities"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadActivities();
  }, [t]);

  const activityTypes = useMemo(() => {
    const s = new Set();
    activities.forEach((a) => {
      if (a.type) s.add(a.type);
    });
    return Array.from(s);
  }, [activities]);

  const topActivityTypes = useMemo(() => {
    const freq = {};
    activities.forEach((a) => {
      const k = a.type || "other";
      freq[k] = (freq[k] || 0) + 1;
    });
    const arr = Object.keys(freq).map((k) => ({ type: k, count: freq[k] }));
    arr.sort((a, b) => b.count - a.count);
    return arr.slice(0, 10);
  }, [activities]);

  const displayed = useMemo(() => {
    return activities
      .filter((a) => (filterType === "all" ? true : a.type === filterType))
      .filter((a) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          (a.note || "").toLowerCase().includes(q) ||
          (a.type || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activities, filterType, query]);

  const prettyDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const generateAiSuggestions = async () => {
    setAiLoading(true);
    setSuggestions([]);
    setLastAiAt(null);

    try {
      const res = await postJSON("/advisory/generate-suggestions");
      if (res && res.suggestions && res.suggestions.length) {
        setSuggestions(res.suggestions);
        setLastAiAt(new Date().toISOString());
      } else {
        setSuggestions([{ title: t("noSuggestionsTitle"), description: t("noSuggestionsDetail") }]);
      }
    } catch (e) {
      console.error("AI suggestion error", e);
      setSuggestions([{ title: t("aiErrorTitle"), description: t("aiErrorDetail") }]);
      toast.error(t("aiErrorToast"));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="Activity Audit Trail"
          badgeIcon={Activity}
          title={t("activityDashboard")}
          subtitle={t("recentOperations")}
          actions={
            <Button variant="secondary" size="sm" onClick={loadActivities}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span>{t("refresh")}</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Activity Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2">
                    <span>Logged Field Activities</span>
                    <Badge variant="emerald">{activities.length} total</Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("searchPlaceholder")}
                      icon={Search}
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none cursor-pointer sm:w-44"
                  >
                    <option value="all">{t("allTypes")}</option>
                    {activityTypes.map((tt, idx) => (
                      <option key={idx} value={tt}>
                        {t(`type_${tt}`) || tt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timeline Entries */}
                <div className="space-y-3 pt-2">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                      <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                      <span className="text-xs font-semibold">{t("loadingActivities")}</span>
                    </div>
                  ) : displayed.length ? (
                    displayed.map((act) => (
                      <div
                        key={act._id || act.timestamp + act.type}
                        className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3.5"
                      >
                        <div className="p-2.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs shrink-0">
                          {iconsMap[act.type] || <CheckCircle2 className="h-5 w-5 text-slate-600" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-extrabold text-slate-900 capitalize">
                              {t(`type_${act.type}`) || act.type || "other"}
                            </h4>
                            <span className="text-[10px] font-medium text-slate-400">
                              {prettyDate(act.timestamp)}
                            </span>
                          </div>

                          {act.note && (
                            <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                              {truncateText(act.note, 400)}
                            </p>
                          )}

                          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[10px]">
                            <Badge variant="emerald">{act.field ? act.field : t("fieldNA")}</Badge>
                            <Badge variant="slate">{t("loggedBy")}: {act.user || "—"}</Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-8 font-medium">{t("noActivities")}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("uniqueTypes")}</span>
                  <p className="text-lg font-black text-slate-900 mt-0.5">{activityTypes.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("topActivity")}</span>
                  <p className="text-lg font-black text-slate-900 capitalize mt-0.5">{topActivityTypes[0]?.type || "—"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("mostRecent")}</span>
                  <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                    {activities[0] ? prettyDate(activities[0].timestamp) : "—"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: AI Advisory & Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <CardTitle>{t("aiSuggestionsTitle")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">{t("aiSuggestionsSubtitle")}</p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800 block mb-1.5">{t("topActivityTypesLabel")}</span>
                  <ol className="space-y-1 text-slate-600 list-decimal list-inside pl-1">
                    {topActivityTypes.map((titem) => (
                      <li key={titem.type}>
                        <span className="capitalize">{t(`type_${titem.type}`) || titem.type}</span> — <strong className="text-slate-900">{titem.count}</strong>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={generateAiSuggestions}
                    disabled={aiLoading}
                    className="flex-1"
                    size="sm"
                  >
                    {aiLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{aiLoading ? t("generating") : t("generateSuggestions")}</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSuggestions([]);
                      setLastAiAt(null);
                    }}
                  >
                    {t("clear")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated AI Advisory Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>{t("suggestions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiLoading && (
                  <div className="flex items-center justify-center py-6 text-slate-400 gap-2 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span>{t("aiThinking")}</span>
                  </div>
                )}

                {!aiLoading && suggestions.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6 font-medium">{t("noSuggestionsPrompt")}</p>
                )}

                {suggestions.map((s, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-900">{s.title || `${t("suggestion")} ${i + 1}`}</h5>
                      {s.confidence && (
                        <Badge variant="emerald">{Math.round(s.confidence * 100)}% Match</Badge>
                      )}
                    </div>

                    {s.description && <p className="text-slate-700 leading-relaxed">{s.description}</p>}

                    {s.timing && (
                      <p className="text-slate-500 font-medium">
                        <strong>{t("timing")}:</strong> {s.timing}
                      </p>
                    )}

                    {s.reason && (
                      <p className="text-slate-500 font-medium">
                        <strong>{t("reason")}:</strong> {s.reason}
                      </p>
                    )}
                  </div>
                ))}

                {lastAiAt && (
                  <p className="text-[10px] text-slate-400 text-right pt-1 font-medium">
                    {t("lastGenerated")}: {prettyDate(lastAiAt)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Explainer */}
            <Card>
              <CardContent className="p-4 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-900 block">{t("howAiWorksTitle")}</span>
                <ul className="space-y-1 text-slate-500 list-disc pl-4 leading-relaxed">
                  <li>{t("howAiUsesTopAndRecent")}</li>
                  <li>{t("howAiFlagsAnomalies")}</li>
                  <li>{t("howAiAdvisoryNote")}</li>
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
