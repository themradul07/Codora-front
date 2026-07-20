import React, { useState, useEffect } from "react";
import { Plus, BadgeCheck, Trash2, ShieldCheck, Edit, Loader2 } from "lucide-react";
import { getJSON, deleteJSON } from "../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const AdminDashboard = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const query = { page, limit };
      const res = await getJSON("/schemes", query);

      setSchemes(res.results || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [page]);

  const deleteScheme = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this government scheme?"
    );

    if (!confirmDelete) return;

    try {
      const res = await deleteJSON(`/schemes/${id}`);
      if (res.success) {
        toast.success("Scheme deleted successfully!");
        fetchSchemes();
      } else {
        toast.error("Failed to delete scheme.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting scheme.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="Admin Console"
          badgeIcon={ShieldCheck}
          title="Government Scheme Management"
          subtitle="Publish, modify, or retire official government agricultural welfare programs and subsidies."
          actions={
            <Link to="/admin/schemes/add">
              <Button>
                <Plus className="h-4 w-4" />
                <span>Add New Scheme</span>
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">Loading schemes directory...</span>
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BadgeCheck className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No schemes published yet.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {schemes.map((scheme) => (
                <Card key={scheme._id} className="flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BadgeCheck className="text-emerald-600 h-5 w-5 shrink-0" />
                        <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                          {scheme.name}
                        </h3>
                      </div>

                      <div className="mb-3">
                        <Badge variant="emerald">{scheme.department || "General"}</Badge>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {scheme.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <Link to={`/admin/schemes/${scheme._id}`} className="block">
                        <Button variant="secondary" className="w-full">
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit Details</span>
                        </Button>
                      </Link>

                      <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => deleteScheme(scheme._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Scheme</span>
                      </Button>
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

export default AdminDashboard;
