import { useState, useEffect } from "react";
import { Calendar, Sprout, MapPin, Clock, PlusCircle, Loader2 } from "lucide-react";
import { getJSON, postJSON } from "../api";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";

const CropCalendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    dueDate: "",
    plotName: "",
    advice: "",
    isCompleted: false,
  });
  const [saving, setSaving] = useState(false);

  const { t, language } = useLanguage();

  const fetchData = async () => {
    try {
      const res = await getJSON("/tasks/today");
      setCalendar(res.tasks || []);
      setLoading(false);
    } catch (err) {
      console.error("Calendar error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (dueDate) => {
    const daysDiff = Math.ceil(
      (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff < 0) return "border-rose-400 bg-rose-50/50 text-rose-900";
    if (daysDiff <= 3) return "border-amber-400 bg-amber-50/50 text-amber-900";
    return "border-emerald-400 bg-emerald-50/50 text-emerald-900";
  };

  const groupedEvents = (calendar || []).reduce((acc, event) => {
    const dateKey = new Date(event.dueDate).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  const formatRelativeDays = (daysDiff) => {
    if (daysDiff === 0) return t("today");
    if (daysDiff === 1) return t("tomorrow");
    if (daysDiff > 1)
      return t("inFutureDays").replace("{{n}}", String(daysDiff));
    return t("pastDays").replace("{{n}}", String(Math.abs(daysDiff)));
  };

  const toggleEvent = async (eventId, current) => {
    try {
      const updated = !current;
      setCalendar((prev) =>
        prev.map((event) =>
          event.eventId === eventId ? { ...event, isCompleted: updated } : event
        )
      );
      await postJSON("/tasks/update", {
        eventId,
        isCompleted: updated,
      });
    } catch (err) {
      console.error("Toggle error", err);
      alert(t("updateTaskError"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.dueDate) {
      alert(t("requiredFieldsError"));
      return;
    }
    setSaving(true);
    try {
      const savedEvent = await postJSON("/tasks/add", newEvent);
      setCalendar((prev) => [...prev, savedEvent]);
      setModalOpen(false);
      setNewEvent({
        title: "",
        dueDate: "",
        plotName: "",
        advice: "",
        isCompleted: false,
      });
    } catch (err) {
      console.error("Add event error:", err);
      alert(t("addEventError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t("cropCalendar")}
            </h2>
            <p className="text-xs text-slate-500">
              {t("cropCalendarSubtitle")}
            </p>
          </div>
        </div>

        <Link to="/add-crop-event">
          <Button size="sm">
            <PlusCircle className="w-4 h-4" />
            <span>{t("addEvent")}</span>
          </Button>
        </Link>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
          <Loader2 className="animate-spin h-7 w-7 text-emerald-600" />
          <span className="text-xs font-medium">Loading schedule...</span>
        </div>
      ) : calendar.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Sprout className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">{t("noEvents")}</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
          {Object.entries(groupedEvents).map(([date, events]) => {
            const eventDate = new Date(date);
            const daysDiff = Math.ceil(
              (eventDate - new Date()) / 86400000
            );
            return (
              <div key={date}>
                <div
                  className={`flex items-center gap-3 mb-2 p-2.5 rounded-xl border-l-4 ${getStatusColor(
                    events[0].dueDate
                  )}`}
                >
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <div className="flex-1">
                    <p className="font-bold text-xs">
                      {eventDate.toLocaleDateString(
                        language === "ml" ? "ml-IN" : "en-IN",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </p>
                    <p className="text-[10px] opacity-75">
                      {formatRelativeDays(daysDiff)}
                    </p>
                  </div>
                  <Clock className="w-3.5 h-3.5 opacity-50" />
                </div>

                <div className="space-y-2 pl-3 border-l-2 border-emerald-200/80">
                  {events.map((event) => (
                    <div
                      key={event.eventId}
                      className={`p-3 rounded-xl border transition-all ${
                        event.isCompleted
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h4 className={`font-bold text-xs ${event.isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}>
                            {event.title}
                          </h4>
                          {event.plotName && (
                            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                              {t("plotLabel")} {event.plotName}
                            </p>
                          )}
                          {event.advice && (
                            <p className="text-[11px] text-slate-500 mt-1">
                              {event.advice}
                            </p>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={event.isCompleted}
                          onChange={() =>
                            toggleEvent(event.eventId, event.isCompleted)
                          }
                          className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer mt-0.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("addNewCropEvent")}
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t("titleLabel")} *
            </label>
            <Input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
              placeholder={t("titlePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t("dueDateLabel")} *
            </label>
            <Input
              type="date"
              name="dueDate"
              value={newEvent.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t("plotNameLabel")}
            </label>
            <Input
              type="text"
              name="plotName"
              value={newEvent.plotName}
              onChange={handleInputChange}
              placeholder={t("plotPlaceholder")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t("adviceNotesLabel")}
            </label>
            <textarea
              name="advice"
              value={newEvent.advice}
              onChange={handleInputChange}
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              placeholder={t("advicePlaceholder")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("saving") : t("addEvent")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CropCalendar;
