import React, { useEffect, useState } from "react";
import { BadgeCheck, Search, Landmark, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getJSON } from "../api";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const Schemes = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [search, setSearch] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 9;

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const query = { page, limit };
      if (selectedFilter) query.department = selectedFilter;
      if (search) query.search = search;

      const res = await getJSON("/schemes", query);
      setSchemes(res.results || res.data?.results || []);
      setTotalPages(res.totalPages || res.data?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching schemes:", err);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [page, selectedFilter, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="Government Welfare"
          badgeIcon={Landmark}
          title="Government Agricultural Schemes"
          subtitle="Explore Central and Kerala State subsidies, crop insurance, equipment grants, and loan subsidies."
        />

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  type="text"
                  placeholder="Search schemes by keyword or department..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  icon={Search}
                />
              </div>

              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-900 text-xs outline-none cursor-pointer"
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Departments</option>
                <option value="Agriculture">Agriculture Department</option>
                <option value="Horticulture">Horticulture Mission</option>
                <option value="KeraFed">KeraFed / Coconut Development</option>
                <option value="Fisheries">Fisheries & Animal Husbandry</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Schemes Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">Loading government schemes...</span>
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Landmark className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No schemes found matching criteria.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {schemes.map((scheme) => (
                <Card key={scheme._id} className="hover:border-emerald-300 flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeCheck className="text-emerald-600 h-5 w-5 shrink-0" />
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                          {scheme.name}
                        </h3>
                      </div>

                      <div className="mb-3">
                        <Badge variant="emerald">{scheme.department || "Agricultural Dept"}</Badge>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {scheme.description}
                      </p>
                    </div>

                    <div>
                      {scheme.benefits && (
                        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 mb-4 text-xs font-bold text-emerald-800">
                          Benefit: {scheme.benefits}
                        </div>
                      )}

                      <Link to={`${scheme._id}`}>
                        <Button variant="secondary" className="w-full">
                          <span>View Scheme Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span className="text-xs font-bold text-slate-700">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schemes;
