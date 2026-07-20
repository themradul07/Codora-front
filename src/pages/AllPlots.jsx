import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Calendar, Sprout, ArrowRight, PlusCircle } from "lucide-react";
import { getJSON } from "../api";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const AllPlots = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  const navigate = useNavigate();

  const [plots, setPlots] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getJSON("/farmer/allFarms");
      console.log("Farm plots data:", data);
      setPlots(data.farms || []);
    } catch (err) {
      console.error("Failed to load plots:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="Farm Management"
          badgeIcon={Leaf}
          title="Your Registered Farm Plots"
          subtitle="View active crop fields, land records, sowing schedules, and expected harvest dates."
          actions={
            <Button onClick={() => navigate("/farms/add")}>
              <PlusCircle className="h-4 w-4" />
              <span>Add Farm Plot</span>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plots.map((plot) => (
            <Card
              key={plot.id || plot._id}
              className="cursor-pointer hover:border-emerald-300 flex flex-col justify-between"
              onClick={() => navigate(`/farms/${plot._id}`, { state: plot })}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="emerald">{plot.cropName || "Active Crop"}</Badge>
                  <span className="text-[11px] font-semibold text-slate-400">ID: {plot._id?.slice(-6)}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  <span>{plot.farmName || plot.plotName}</span>
                </h3>

                <div className="space-y-2 text-xs text-slate-600 mb-6">
                  <p className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-slate-400" />
                    <span>Crop: <strong className="text-slate-800">{plot.cropName}</strong></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Sowing Date: <strong className="text-slate-800">{plot.sowingDate}</strong></span>
                  </p>
                </div>

                <Button variant="secondary" className="w-full">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPlots;
