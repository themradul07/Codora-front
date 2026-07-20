import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Leaf,
  Sprout,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";
import { getJSON } from "../api";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const PlotDetails = () => {
  const { id } = useParams();

  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getJSON(`/farmer/allfarms/${id}`);
        setPlot(res.farm);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load farm details");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const events = useMemo(() => plot?.events ?? [], [plot]);

  const calculateHarvestDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    d.setDate(d.getDate() + 120);
    return d.toISOString().split("T")[0];
  };

  const { todayEvents, upcoming, missed, completed } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const buckets = {
      todayEvents: [],
      upcoming: [],
      missed: [],
      completed: [],
    };

    events.forEach((ev) => {
      const due = new Date(ev.dueDate);
      if (ev.isCompleted) {
        buckets.completed.push(ev);
      } else if (due < startOfToday) {
        buckets.missed.push(ev);
      } else if (due >= startOfToday && due < endOfToday) {
        buckets.todayEvents.push(ev);
      } else {
        buckets.upcoming.push(ev);
      }
    });

    Object.values(buckets).forEach((list) =>
      list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    );

    return buckets;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeTab === "today") return todayEvents;
    if (activeTab === "upcoming") return upcoming;
    if (activeTab === "missed") return missed;
    if (activeTab === "completed") return completed;
    return events;
  }, [activeTab, todayEvents, upcoming, missed, completed, events]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-2">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Loading farm plot details...</p>
      </div>
    );
  }

  if (error || !plot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-rose-600 font-semibold text-sm">{error || "Plot not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Plot Details"
          badgeIcon={Leaf}
          title={plot.farmName || plot.plotName || "Farm Plot"}
          subtitle={`Crop: ${plot.cropName} • Variety: ${plot.variety || "Local standard"}`}
        />

        {/* Farm Metadata Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Crop Name</span>
                <p className="text-sm font-extrabold text-slate-900">{plot.cropName}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Sowing Date</span>
                <p className="text-sm font-extrabold text-slate-900">
                  {plot.sowingDate ? new Date(plot.sowingDate).toLocaleDateString() : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Expected Harvest</span>
                <p className="text-sm font-extrabold text-slate-900">
                  {calculateHarvestDate(plot.sowingDate)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks & Diary Tab View */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle>Field Task Operations ({events.length})</CardTitle>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {[
                  { id: "all", label: "All" },
                  { id: "today", label: "Today" },
                  { id: "upcoming", label: "Upcoming" },
                  { id: "missed", label: "Missed" },
                  { id: "completed", label: "Completed" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-6">
            {filteredEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No scheduled operations for this tab filter.</p>
            ) : (
              filteredEvents.map((ev) => (
                <div
                  key={ev._id}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ev.title}</p>
                    {ev.advice && <p className="text-xs text-slate-600 mt-0.5">{ev.advice}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">
                      Due: {new Date(ev.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={ev.isCompleted ? "emerald" : "amber"}>
                    {ev.isCompleted ? "Completed" : "Scheduled"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default PlotDetails;
