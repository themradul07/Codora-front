import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getJSON } from "../api";
import { Link } from "react-router-dom";
import {
  User,
  MapPin,
  Leaf,
  Mountain,
  Droplets,
  Mail,
  Phone,
  Globe,
  Edit,
  Building2
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

function renderLocation(location, t) {
  if (!location) return t("locationNotAdded");
  if (typeof location === "object") {
    return `${location.district || ""}, Lat: ${location.latitude || ""}, Lng: ${location.longitude || ""}`;
  }
  return location;
}

export default function FarmerProfile() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const defaultProfile = {
    name: "",
    location: "",
    primaryCrop: "",
    landSize: "",
    soilType: "",
    irrigation: "",
    profileImage: null,
    email: "",
    phone: "",
  };

  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getJSON("/farmer/profile", token);
        setProfile(res || defaultProfile);
      } catch (err) {
        console.log("Failed to load profile", err);
        toast.error(t("failedLoadProfile"));
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          badge="Account Settings"
          badgeIcon={User}
          title={t("profileSettings")}
          subtitle={t("profileManage")}
          actions={
            <Link to="/update-profile">
              <Button>
                <Edit className="h-4 w-4" />
                <span>{t("editProfile")}</span>
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Contact */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <img
                  src={
                    profile.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-24 h-24 rounded-full border-4 border-emerald-500 object-cover shadow-sm mb-4"
                  alt={profile.name || t("farmerNamePlaceholder")}
                />
                <h2 className="text-lg font-extrabold text-slate-900">
                  {profile.name || t("farmerNamePlaceholder")}
                </h2>
                <Badge variant="emerald" className="mt-1 mb-3">Registered Farmer</Badge>

                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={14} className="text-emerald-600 shrink-0" />
                  <span>{renderLocation(profile.location, t)}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("contact")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="p-2 bg-slate-100 rounded-xl text-emerald-700">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t("email")}</span>
                    <p className="font-semibold text-slate-900">{profile.email || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="p-2 bg-slate-100 rounded-xl text-emerald-700">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{t("phone")}</span>
                    <p className="font-semibold text-slate-900">{profile.phone || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Farm Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("farmDetails")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Leaf className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t("primaryCrop")}</span>
                      <p className="text-sm font-bold text-slate-900">{profile.primaryCrop || "—"}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Mountain className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t("landSize")}</span>
                      <p className="text-sm font-bold text-slate-900">
                        {profile.landSize ? `${profile.landSize} ${t("acres")}` : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Mountain className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t("soilType")}</span>
                      <p className="text-sm font-bold text-slate-900">{profile.soilType || "—"}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Droplets className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{t("irrigation")}</span>
                      <p className="text-sm font-bold text-slate-900">{profile.irrigation || "—"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("accountSettings")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-600" />
                    <span>Language Preference</span>
                  </span>
                  <Badge variant="slate">{t("englishIndia")}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>Account Category</span>
                  </span>
                  <Badge variant="emerald">{t("farmer")}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
