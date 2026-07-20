import React, { useState, useEffect } from "react";
import {
  MapPin,
  Tractor,
  FlaskConical,
  Store,
  Loader2,
  Navigation,
  Sparkles,
  Compass
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function NearbyAgriServices() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState("all");
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distanceLimit, setDistanceLimit] = useState(10);

  useEffect(() => {
    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }&libraries=places`;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Please enable location permissions to locate nearby services.")
    );
  }, []);

  const fetchServices = async () => {
    if (!location) return;

    const api = import.meta.env.VITE_API_URL || "https://krishi-backend-1-e2vy.onrender.com";
    const finalURL = `${api}/api/services?lat=${location.lat}&lng=${location.lng}&category=${category}`;
    setLoading(true);

    try {
      const res = await fetch(finalURL);
      const data = await res.json();
      setServices(data || []);
    } catch (e) {
      console.error("ERROR calling backend:", e);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (location) fetchServices();
  }, [category]);

  useEffect(() => {
    const filteredList = services.filter(
      (s) => s.distance !== undefined && s.distance <= distanceLimit
    );
    setFiltered(filteredList);
  }, [distanceLimit, services]);

  const openInMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const categoryOptions = [
    { value: "all", label: "All Services", icon: Store },
    { value: "shop", label: "Agri Shops", icon: Store },
    { value: "lab", label: "Soil Labs", icon: FlaskConical },
    { value: "tractor", label: "Machinery", icon: Tractor },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="GIS Services"
          badgeIcon={Compass}
          title="Nearby Agricultural Services"
          subtitle="Locate seed shops, fertilizer vendors, soil testing laboratories, and tractor rental operators."
        />

        {/* Filter Toolbar */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categoryOptions.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <span>Distance Radius:</span>
                <select
                  className="px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl outline-none cursor-pointer"
                  value={distanceLimit}
                  onChange={(e) => setDistanceLimit(Number(e.target.value))}
                >
                  <option value={5}>5 km radius</option>
                  <option value={10}>10 km radius</option>
                  <option value={20}>20 km radius</option>
                  <option value={50}>50 km radius</option>
                </select>
              </div>

              <Button onClick={fetchServices} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Locating..." : "Find Services Nearby"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Leaflet Map */}
        {location && (
          <Card className="mb-6 overflow-hidden">
            <div className="w-full h-80">
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>Current Location</Popup>
                </Marker>
                <Circle
                  center={[location.lat, location.lng]}
                  radius={distanceLimit * 1000}
                  pathOptions={{
                    color: "#059669",
                    fillColor: "#10b981",
                    fillOpacity: 0.15,
                  }}
                />
                {services.map((s, i) => (
                  <Marker key={i} position={[s.lat, s.lng]}>
                    <Popup>
                      <b>{s.name}</b> <br />
                      {s.address} <br />
                      {s.distance?.toFixed(2)} km away
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
        )}

        {/* Results */}
        <div className="space-y-4">
          {filtered.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-base text-slate-900">{s.name}</h3>
                    <Badge variant="emerald">{s.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{s.address}</span>
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    {s.distance?.toFixed(2)} km from current location
                  </p>
                </div>

                <Button variant="secondary" size="sm" onClick={() => openInMaps(s.lat, s.lng)}>
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Google Maps Navigation</span>
                </Button>
              </CardContent>
            </Card>
          ))}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-12 font-medium">
              No agricultural services detected within {distanceLimit} km radius.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
