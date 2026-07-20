import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, AlertTriangle, ShieldCheck, FlaskConical } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function PesticideRestrictionChecker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [allPesticides, setAllPesticides] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch("https://krishi-backend-1-e2vy.onrender.com/api/pesticides");
        const data = await res.json();
        setAllPesticides(data);
      } catch (err) {
        console.error("Failed to load pesticides list:", err);
      }
    }
    loadAll();
  }, []);

  async function lookupPesticideAPI(name) {
    if (!name) return null;

    try {
      const res = await fetch(
        `https://krishi-backend-1-e2vy.onrender.com/api/pesticides/${encodeURIComponent(name)}`
      );

      if (!res.ok) {
        return {
          name,
          status: "Unknown",
          alternatives: ["Not found in government restriction registry"]
        };
      }

      return await res.json();
    } catch (err) {
      return {
        name,
        status: "Error",
        alternatives: ["Server connection failed"]
      };
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const r = await lookupPesticideAPI(query.trim());
    setResult(r);
  }

  function StatusBadge({ status }) {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'banned')
      return <Badge variant="rose"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> BANNED</Badge>;
    if (s === 'restricted')
      return <Badge variant="amber"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> RESTRICTED</Badge>;
    if (s === 'allowed')
      return <Badge variant="emerald"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> ALLOWED</Badge>;

    return <Badge variant="slate">{status.toUpperCase()}</Badge>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Chemical Compliance Engine"
          badgeIcon={ShieldCheck}
          title="Pesticide Restriction Checker"
          subtitle="Search any chemical or pesticide compound to verify whether it is permitted, restricted, or banned under Kerala Agricultural regulations."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Search Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Search Chemical Database</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Pesticide Trade Name / Compound
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setResult(null); }}
                      placeholder="e.g. Endosulfan, Malathion, Neem Oil"
                      icon={Search}
                    />
                    <Button type="submit" className="shrink-0">
                      Check Status
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick List Action */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Database Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-4">
                View all regulated chemical compounds listed in the Kerala State Agricultural Database.
              </p>
              <Button
                variant="secondary"
                onClick={() => setShowAll((s) => !s)}
                className="w-full"
              >
                {showAll ? "Hide Registry" : "View Full Registry"}
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Result Display */}
        {result && (
          <Card className="mt-6 border-emerald-200">
            <CardHeader className="bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{result.name}</CardTitle>
                  <div className="mt-1">
                    <StatusBadge status={result.status} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Recommended Organic / Approved Alternatives
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.alternatives?.map((alt, i) => (
                  <div key={i} className="text-xs font-medium text-slate-800 bg-slate-100 p-2.5 rounded-xl border border-slate-200/80">
                    {alt}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Registry Modal / Drawer List */}
        {showAll && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Regulated Chemical Compounds ({allPesticides.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {allPesticides.length === 0 ? (
                  <p className="text-xs text-slate-400">Loading chemical registry...</p>
                ) : (
                  allPesticides.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs font-medium">
                      <span className="text-slate-900 font-bold">{p.name}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
