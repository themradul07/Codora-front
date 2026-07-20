import { useState } from "react";
import { postJSON } from "../api";
import { Sprout, CalendarDays, Leaf, LandPlot } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "./ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

export default function AddCropForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cropName: "",
    variety: "",
    sowingDate: "",
    farmName: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await postJSON("/farmer/add-crop", form);
      console.log(res);
      toast.success("🌾 Crop added successfully! Calendar generated.");
      navigate("/farms");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add crop.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <PageHeader
          badge="Land Management"
          badgeIcon={LandPlot}
          title="Add New Farm Plot"
          subtitle="Register a new crop field, variety, and sowing date to automatically initialize your AI crop calendar."
        />

        <Card>
          <CardHeader>
            <CardTitle>Plot Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Farm / Plot Name *
                </label>
                <Input
                  name="farmName"
                  value={form.farmName}
                  onChange={handleChange}
                  placeholder="E.g. North Field Paddy, Plot B"
                  icon={LandPlot}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Select Crop Category *
                </label>
                <select
                  name="cropName"
                  value={form.cropName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                  required
                >
                  <option value="">Select a crop type</option>
                  <option value="Paddy">Paddy (90 days)</option>
                  <option value="Banana">Banana (240 days)</option>
                  <option value="Coconut">Coconut</option>
                  <option value="Pepper">Pepper (210 days)</option>
                  <option value="Rubber">Rubber</option>
                  <option value="Tapioca">Tapioca (240 days)</option>
                  <option value="Ginger">Ginger (210 days)</option>
                  <option value="Turmeric">Turmeric (270 days)</option>
                  <option value="Vegetables_Mixed">Vegetables Mixed (40 days)</option>
                  <option value="Cashew">Cashew (150 days)</option>
                  <option value="Arecanut">Arecanut (180 days)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Crop Variety
                </label>
                <Input
                  name="variety"
                  value={form.variety}
                  onChange={handleChange}
                  placeholder="E.g. Jyothi, Robusta, Nendran"
                  icon={Sprout}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Sowing / Planting Date *
                </label>
                <Input
                  type="date"
                  name="sowingDate"
                  value={form.sowingDate}
                  onChange={handleChange}
                  icon={CalendarDays}
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Registering Farm Plot..." : "Add Farm Plot"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
