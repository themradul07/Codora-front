import React, { useEffect, useState } from "react";
import { Search, IndianRupee, Percent, Clock, Landmark, Loader2 } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

const AllNgos = () => {
  const [ngos, setNgos] = useState([]);
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedNgo, setSelectedNgo] = useState(null);
  const [loanAmount, setLoanAmount] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const fetchNgos = async () => {
    try {
      const res = await fetch("https://krishi-backend-1-e2vy.onrender.com/api/loan/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setNgos(data.loans);
        setFilteredNgos(data.loans);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching NGOs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  useEffect(() => {
    let filtered = ngos;
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (ngo) =>
          ngo.name.toLowerCase().includes(searchText.toLowerCase()) ||
          ngo.description?.toLowerCase().includes(searchText.toLowerCase()) ||
          ngo.address?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredNgos(filtered);
  }, [searchText, ngos]);

  const openLoanModal = (ngo) => {
    setSelectedNgo(ngo);
    setLoanAmount("");
    setLoanPurpose("");
    setErrors({});
    setModalOpen(true);
  };

  const submitLoan = async () => {
    const newErrors = {};

    if (!loanAmount || loanAmount <= 0)
      newErrors.amount = "Enter valid loan amount";

    if (loanAmount > selectedNgo.maxLoan)
      newErrors.amount = `Amount exceeds NGO limit (₹${selectedNgo.maxLoan})`;

    if (!loanPurpose.trim())
      newErrors.purpose = "Purpose is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch("https://krishi-backend-1-e2vy.onrender.com/api/loan/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ngoId: selectedNgo._id,
          amount: loanAmount,
          purpose: loanPurpose,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Loan request submitted!");
        setModalOpen(false);
      } else {
        alert(data.message || "Failed to submit loan");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          badge="Agri Finance"
          badgeIcon={Landmark}
          title="Microfinance & NGO Agricultural Loans"
          subtitle="Apply directly for low-interest micro-loans from verified agricultural NGOs and SHG cooperatives."
        />

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="max-w-md">
              <Input
                type="text"
                placeholder="Search NGO or financial provider..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                icon={Search}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Loan Programs ({filteredNgos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="text-xs font-semibold">Loading NGO programs...</span>
              </div>
            ) : filteredNgos.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Landmark className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No NGO loan schemes found matching criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 px-2">Organization</th>
                      <th className="pb-3 px-2">Contact</th>
                      <th className="pb-3 px-2">Criteria</th>
                      <th className="pb-3 px-2">Interest Rate</th>
                      <th className="pb-3 px-2">Max Loan</th>
                      <th className="pb-3 px-2">Processing Time</th>
                      <th className="pb-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNgos.map((ngo) => (
                      <tr key={ngo._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-2 font-extrabold text-slate-900">{ngo.name}</td>
                        <td className="py-3 px-2 text-slate-600">
                          <p className="font-semibold">{ngo.phone}</p>
                          <p className="text-[11px] text-slate-400">{ngo.email}</p>
                        </td>
                        <td className="py-3 px-2 text-slate-600 font-medium max-w-xs">{ngo.loanCriteria}</td>
                        <td className="py-3 px-2">
                          <Badge variant="emerald">{ngo.interestRate}% P.A.</Badge>
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-900">
                          ₹{Number(ngo.maxLoan).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-2 text-slate-600">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3.5 w-3.5 text-slate-400" /> {ngo.processingTime} Days
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <Button size="sm" onClick={() => openLoanModal(ngo)}>
                            Apply Now
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Apply for Loan - ${selectedNgo?.name}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Requested Loan Amount (Max ₹{selectedNgo?.maxLoan?.toLocaleString('en-IN')}) *
              </label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g. 50000"
                icon={IndianRupee}
              />
              {errors.amount && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Loan Purpose / Usage Plan *
              </label>
              <textarea
                rows="3"
                className="w-full border border-slate-200/90 rounded-xl p-3 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                placeholder="Describe seeds, fertilizer, equipment purchase or land preparation plan..."
              />
              {errors.purpose && <p className="text-xs text-rose-600 mt-1 font-semibold">{errors.purpose}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitLoan}>
                Submit Loan Application
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default AllNgos;
