import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Sprout, FileText, ArrowLeft, CheckCircle2 } from "lucide-react";
import { getJSON, postJSON } from "../api";
import { toast } from "react-toastify";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const AddCropEvent = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    plotId: "",
    advice: "",
    isCompleted: false,
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [plots, setPlots] = useState([]);
  const [plotsLoading, setPlotsLoading] = useState(true);
  const [plotsError, setPlotsError] = useState("");

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        setPlotsLoading(true);
        setPlotsError("");
        const res = await getJSON("/tasks/plots");
        setPlots(Array.isArray(res) ? res : res?.plots ?? []);
      } catch (err) {
        console.error("Error loading plots", err);
        setPlotsError(t("plotsLoadError"));
      } finally {
        setPlotsLoading(false);
      }
    };

    fetchPlots();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      toast.error(t("requiredFieldsError"));
      return;
    }

    try {
      setLoading(true);
      const res = await postJSON("/tasks/add", formData);
      if (res) {
        toast.success(t("addedSuccess"));
        navigate("/dashboard");
      } else {
        toast.error(t("saveError"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("saveError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          badge="Crop Calendar"
          badgeIcon={Calendar}
          title={t("addNewCropEvent")}
          subtitle={t("scheduleUpcomingTasks")}
        />

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t("eventTitle")} *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder={t("eventTitlePlaceholder")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t("dueDateLabel")} *
                  </label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t("plotFieldLabel")}
                  </label>
                  {plotsLoading ? (
                    <p className="text-xs text-slate-400 py-2">{t("loadingPlots")}</p>
                  ) : (
                    <select
                      name="plotId"
                      value={formData.plotId}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    >
                      <option value="">{t("selectPlot")}</option>
                      {plots.map((plot) => {
                        const key = plot.id ?? plot._id ?? plot.name;
                        const value = plot._id ?? plot.id ?? plot.name;
                        const label = plot.farmName ?? plot.name ?? plot.farm ?? value;
                        return (
                          <option key={key} value={value}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  )}
                  {plotsError && <p className="mt-1 text-xs text-rose-600">{plotsError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    {t("typeLabel")}
                  </label>
                  <Input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder={t("typePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t("adviceNotesLabel")}
                </label>
                <textarea
                  name="advice"
                  value={formData.advice}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-slate-200/90 rounded-xl p-3 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                  placeholder={t("advicePlaceholder")}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="completed"
                  type="checkbox"
                  name="isCompleted"
                  checked={formData.isCompleted}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="completed" className="text-xs font-medium text-slate-700 cursor-pointer">
                  {t("markAsCompleted")}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? t("saving") : t("saveEvent")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCropEvent;
