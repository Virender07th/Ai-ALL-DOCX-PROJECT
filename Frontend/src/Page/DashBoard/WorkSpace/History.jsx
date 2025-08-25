import React, { useState } from "react";
import Button from "../../../Component/Reusable/Button";
import InputField from "../../../Component/Reusable/InputField";
import { FiSearch } from "react-icons/fi";

const histories = Array.from({ length: 10 }, (_, i) => ({
  title: `AI Video ${i + 1}`,
  type: "video",
  timestamps: "23:30 PM",
}));

const filterOptions = ["All", "Video", "Quiz", "Chats", "Documents"];

const History = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredHistories = histories.filter((h) =>
    (activeFilter.toLowerCase().trim() === "all" || h.type.toLowerCase().trim() === activeFilter.toLowerCase().trim()) &&
    h.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col px-4 md:px-8 gap-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-2 py-2 border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">History</h1>
        <p className="text-sm md:text-base text-[#4573A1] font-medium mt-1">
          Your recent activity
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-row gap-2 max-w-[600px]">
        {filterOptions.map((name, index) => (
          <Button
            key={index}
            content={name}
            btnColor="bg-[#E5EDF5] text-gray-800 hover:bg-blue-200"
            color={false}
            data={true}
            condition={true}
            style={`px-4 py-2 text-sm ${
              activeFilter === name ? "bg-blue-200 font-semibold" : ""
            }`}
            click={() => setActiveFilter(name)}
          />
        ))}
      </div>

      {/* Search Bar */}
      <div className="max-w-[600px]">
        <InputField
          placeholder="Search history here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={FiSearch}
          iconPosition="left"
          style="placeholder-[#4573A1]  rounded-xl border-none bg-[#E5EDF5]"
        />
      </div>

      {/* History Table */}
      <div className="overflow-x-auto border-2 border-[#CCDBEB] bg-[#F7FAFC] rounded-lg max-h-[420px] overflow-y-auto scroll-hide">
        <table className="min-w-full text-sm text-left text-black">
          <thead className="sticky top-0 bg-[#F7FAFC] z-10 font-semibold border-b border-[#E5E8EB]">
            <tr>
              <th className="px-4 py-">Title</th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Timestamp</th>
              <th className="px-4 py-4 text-[#4573A1]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E8EB]">
            {filteredHistories.length > 0 ? (
              filteredHistories.map((history, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">{history.title}</td>
                  <td className="px-4 py-4 capitalize">{history.type}</td>
                  <td className="px-4 py-4 text-[#4573A1] font-medium">
                    {history.timestamps}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 text-[#4573A1] font-semibold">
                      <button className="hover:underline hover:text-blue-600">
                        View
                      </button>
                      <span>|</span>
                      <button className="hover:underline hover:text-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
