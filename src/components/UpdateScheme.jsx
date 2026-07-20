import React, { useState, useEffect } from "react";
import { getJSON } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateScheme = () => {
  const { schemeId } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch existing scheme
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const data = await getJSON(`/schemes/${schemeId}`);
        // const data = await res.json();
        console.log(data);
        setScheme(data.scheme);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScheme();
  }, [schemeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheme({ ...scheme, [name]: value });
  };

  const handleEligibilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScheme({
      ...scheme,
      eligibility: {
        ...scheme.eligibility,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const updateScheme = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://krishi-backend-1-e2vy.onrender.com/api/schemes/${schemeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheme),
      });


      toast.success("Scheme updated successfully!");
      navigate("/admin/dashboard");


    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-green-600">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-green-300">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Update Scheme</h2>

      <form onSubmit={updateScheme} className="space-y-6">

        {/* Scheme Name */}
        <div>
          <label className="block mb-1 font-medium text-green-700">Scheme Name</label>
          <input
            type="text"
            name="name"
            value={scheme.name}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium text-green-700">Description</label>
          <textarea
            name="description"
            value={scheme.description}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        {/* Department */}
        <div>
          <label className="block mb-1 font-medium text-green-700">Department</label>
          <input
            type="text"
            name="department"
            value={scheme.department}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2"
          />
        </div>

        {/* Benefits */}
        <div>
          <label className="block mb-1 font-medium text-green-700">Benefits</label>
          <textarea
            name="benefits"
            value={scheme.benefits}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2"
          ></textarea>
        </div>

        {/* Eligibility Section */}
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-3">Eligibility</h3>

          {/* State */}
          <label className="block mb-1 text-green-700">State</label>
          <input
            type="text"
            name="state"
            value={scheme.eligibility.state ?? ''}
            onChange={handleEligibilityChange}
            className="w-full border border-green-300 rounded-lg p-2 mb-3"
          />

          {/* District */}
          <label className="block mb-1 text-green-700">Districts (comma separated)</label>
          <input
            type="text"
            name="district"
            value={scheme.eligibility.district.join(", ")}
            onChange={(e) =>
              setScheme({
                ...scheme,
                eligibility: {
                  ...scheme.eligibility,
                  district: e.target.value.split(",").map((d) => d.trim()),
                },
              })
            }
            className="w-full border border-green-300 rounded-lg p-2 mb-3"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Min Land */}
            <div>
              <label className="block mb-1 text-green-700">Min Land (Acres)</label>
              <input
                type="number"
                name="minLand"
                value={scheme.eligibility.minLand}
                onChange={handleEligibilityChange}
                className="w-full border border-green-300 rounded-lg p-2"
              />
            </div>

            {/* Max Land */}
            <div>
              <label className="block mb-1 text-green-700">Max Land (Acres)</label>
              <input
                type="number"
                name="maxLand"
                value={scheme.eligibility.maxLand}
                onChange={handleEligibilityChange}
                className="w-full border border-green-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Crops */}
          <label className="block mt-3 mb-1 text-green-700">Crops (comma separated)</label>
          <input
            type="text"
            name="crops"
            value={scheme.eligibility.crops.join(", ")}
            onChange={(e) =>
              setScheme({
                ...scheme,
                eligibility: {
                  ...scheme.eligibility,
                  crops: e.target.value.split(",").map((c) => c.trim()),
                },
              })
            }
            className="w-full border border-green-300 rounded-lg p-2"
          />

          {/* Irrigation Required */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="irrigationRequired"
              checked={scheme.eligibility.irrigationRequired}
              onChange={handleEligibilityChange}
              className="h-5 w-5 text-green-600"
            />
            <label className="text-green-700">Irrigation Required</label>
          </div>

          {/* Income limit */}
          <label className="block mt-3 mb-1 text-green-700">Income Limit (₹)</label>
          <input
            type="number"
            name="incomeLimit"
            value={scheme.eligibility.incomeLimit}
            onChange={handleEligibilityChange}
            className="w-full border border-green-300 rounded-lg p-2"
          />
        </div>

        {/* Documents */}
        <div>
          <label className="block mb-1 text-green-700">Documents Required (comma separated)</label>
          <input
            type="text"
            name="documents"
            value={scheme.documents.join(", ")}
            onChange={(e) =>
              setScheme({
                ...scheme,
                documents: e.target.value.split(",").map((d) => d.trim()),
              })
            }
            className="w-full border border-green-300 rounded-lg p-2"
          />
        </div>

        {/* Deadline */}
        <div>
          <label className="block mb-1 text-green-700">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={scheme.deadline?.split("T")[0]}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2"
          />
        </div>

        {/* Link */}
        <div>
          <label className="block mb-1 text-green-700">Official Link</label>
          <input
            type="text"
            name="link"
            value={scheme.link}
            onChange={handleChange}
            className="w-full border border-green-300 rounded-lg p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Update Scheme
        </button>
      </form>
    </div>
  );
};

export default UpdateScheme;
