import React, { useState, useEffect } from "react";
import { Search, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const API_BASE = `${import.meta.env.VITE_API_BASE}/knowledge`;

const Knowledge = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "", crop: "all" }),
    })
      .then((res) => res.json())
      .then((data) => data.success && setResults(data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: search, crop: "all" }),
        });
        const data = await res.json();
        if (data.success) setSuggestions(data.data.slice(0, 5));
      } catch {}
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: search,
          crop: selectedCrop,
        }),
      });

      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setResults(data.data);
      } else {
        setResults([]);
        setError("No matching agricultural advice found.");
      }
    } catch {
      setError("Backend connection failed.");
    }

    setLoading(false);
  };

  const uniqueCrops = Array.from(new Set(results.map((r) => r.crop))).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Knowledge Repository"
          badgeIcon={BookOpen}
          title="Agricultural Knowledge Base"
          subtitle="Search FAQs, best practices, disease guides, and government crop recommendations."
        />

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by crop, pest, or question..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={Search}
                />
                {suggestions.length > 0 && (
                  <div className="absolute w-full bg-white border border-slate-200 shadow-lg rounded-xl mt-1 z-20 overflow-hidden">
                    {suggestions.map((s) => (
                      <div
                        key={s._id}
                        className="px-4 py-2.5 hover:bg-slate-50 text-xs text-slate-800 font-medium cursor-pointer border-b border-slate-100 last:border-0"
                        onClick={() => {
                          setSearch(s.question);
                          setSuggestions([]);
                        }}
                      >
                        {s.question}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <select
                className="px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none cursor-pointer sm:w-44"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="all">All Crops</option>
                {uniqueCrops.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>

              <Button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && <p className="text-rose-600 text-xs font-semibold mb-4">{error}</p>}

        <div className="space-y-4">
          {results.slice(0, 10).map((item, index) => (
            <Card
              key={item._id || index}
              className="cursor-pointer hover:border-emerald-300"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-slate-900 flex-1 pr-4">
                    {item.question}
                  </h2>
                  <div className="text-slate-400">
                    {openIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </CardHeader>

              {openIndex === index && (
                <CardContent className="pt-0 border-t border-slate-100">
                  <p className="text-xs text-slate-700 leading-relaxed mt-3">{item.answer}</p>
                  <div className="mt-3 flex gap-2 flex-wrap items-center">
                    {item.crop && <Badge variant="emerald">{item.crop}</Badge>}
                    {item.stage && <Badge variant="slate">Stage: {item.stage}</Badge>}
                    {item.tags?.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="purple">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
