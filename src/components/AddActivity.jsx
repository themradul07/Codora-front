import React, { useState } from "react";
import { postJSON } from "../api";
import { toast } from "react-toastify";
import { useLanguage } from "../contexts/LanguageContext";
import { Plus } from "lucide-react";
import { Button } from "./ui/Button";

export default function AddActivity() {
  const defaultform = { type: "", date: "", note: "" };
  const [form, setForm] = useState(defaultform);

  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await postJSON("/activity/add", form);

    if (res.farmerId) {
      toast.success(t("ActivitySuccess"));
      setForm(defaultform);
    } else {
      toast.error(t("ActivityFailed"));
    }
  };

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <form
      onSubmit={handleSubmit}
      onChange={onChange}
      className="w-full max-w-4xl mx-auto bg-white border border-slate-200/90 shadow-sm rounded-2xl p-3 flex flex-col md:flex-row md:items-center gap-2.5 text-xs"
    >
      <div className="flex items-center gap-2 pl-2">
        <span className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Plus className="h-3.5 w-3.5" />
        </span>
        <span className="font-bold text-slate-800 whitespace-nowrap">
          {t("Log activity")}
        </span>
      </div>

      <div className="flex-1 w-full">
        <select
          name="type"
          value={form.type}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">{t("Type")}</option>
          <option value="irrigation">{t("Irrigation")}</option>
          <option value="fertilization">{t("Fertilization")}</option>
          <option value="pesticide_application">{t("Pesticide")}</option>
          <option value="harvesting">{t("Harvesting")}</option>
          <option value="sowing">{t("Sowing")}</option>
          <option value="spraying">{t("Spraying")}</option>
          <option value="pest">{t("Pest Issue")}</option>
          <option value="Weatherimpact">{t("Weather Impact")}</option>
          <option value="Weeding">{t("Weeding")}</option>
          <option value="other">{t("Other")}</option>
        </select>
      </div>

      <div className="w-full md:w-36">
        <input
          name="date"
          type="date"
          value={form.date}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all"
        />
      </div>

      <div className="flex-1 w-full">
        <input
          name="note"
          value={form.note}
          placeholder={t("NotePlaceholder")}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition-all"
        />
      </div>

      <Button type="submit" size="sm" className="w-full md:w-auto px-5">
        {t("Save")}
      </Button>
    </form>
  );
}
