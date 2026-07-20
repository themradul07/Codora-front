import React, { useEffect, useState } from "react";
import { Users, CheckCircle2, Clock, IndianRupee, BarChart3, Loader2 } from "lucide-react";
import NgoSidebar from "../components/NgoSidebar";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const NgoDashboard = () => {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        fetch("https://krishi-backend-1-e2vy.onrender.com/api/ngo/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://krishi-backend-1-e2vy.onrender.com/api/ngo/dashboard/recent", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const recentData = await recentRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (recentData.success) setRecentLoans(recentData.loans);
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderBadge = (status) => {
    if (status === "approved") return <Badge variant="emerald">Approved</Badge>;
    if (status === "pending") return <Badge variant="amber">Pending</Badge>;
    return <Badge variant="rose">Rejected</Badge>;
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xs font-medium text-slate-500 gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        Loading NGO console...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NgoSidebar />
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            badge="NGO Officer Console"
            badgeIcon={BarChart3}
            title="NGO Microfinance Dashboard"
            subtitle="Overview of loan disbursements, active farmer accounts, pending applications, and approval queues."
          />

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Disbursed</span>
                  <p className="text-xl font-black text-slate-900 mt-1">₹{stats.totalDisbursed.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                  <IndianRupee className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Farmers</span>
                  <p className="text-xl font-black text-slate-900 mt-1">{stats.totalFarmers}</p>
                </div>
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved Loans</span>
                  <p className="text-xl font-black text-slate-900 mt-1">{stats.approved}</p>
                </div>
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Requests</span>
                  <p className="text-xl font-black text-slate-900 mt-1">{stats.pending}</p>
                </div>
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {recentLoans.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No recent loan requests found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="pb-3 px-2">Farmer</th>
                        <th className="pb-3 px-2">Requested Amount</th>
                        <th className="pb-3 px-2">Purpose</th>
                        <th className="pb-3 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLoans.map((loan) => (
                        <tr key={loan._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-2 font-extrabold text-slate-900">{loan.farmerName}</td>
                          <td className="py-3 px-2 font-bold text-slate-900">₹{loan.amount.toLocaleString()}</td>
                          <td className="py-3 px-2 text-slate-600 font-medium">{loan.purpose}</td>
                          <td className="py-3 px-2 text-right">{renderBadge(loan.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
