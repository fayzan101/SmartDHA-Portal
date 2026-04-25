"use client";

import { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./DashboardComponents.module.css";

type PropertyRow = {
  id: string;
  idSpot: string;
  category: string;
  type: string;
  possessionType: string;
  propertyTagDate: string;
  phase: string;
  zone: string;
  khayaban: string;
  floor: string;
};

// Sample property data
const properties: PropertyRow[] = [
  {
    id: "1",
    idSpot: "SPOT-001",
    category: "Residential",
    type: "Villa",
    possessionType: "Freehold",
    propertyTagDate: "2024-01-15",
    phase: "Phase 1",
    zone: "Zone A",
    khayaban: "Khayaban 1",
    floor: "Ground",
  },
  {
    id: "2",
    idSpot: "SPOT-002",
    category: "Commercial",
    type: "Shop",
    possessionType: "Leasehold",
    propertyTagDate: "2024-02-20",
    phase: "Phase 2",
    zone: "Zone B",
    khayaban: "Khayaban 2",
    floor: "1st",
  },
  {
    id: "3",
    idSpot: "SPOT-003",
    category: "Residential",
    type: "Apartment",
    possessionType: "Freehold",
    propertyTagDate: "2024-03-10",
    phase: "Phase 1",
    zone: "Zone A",
    khayaban: "Khayaban 1",
    floor: "3rd",
  },
];

export default function PropertyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(properties.length / rowsPerPage)),
    [rowsPerPage]
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = properties.slice(startIndex, endIndex);

  const rowStyle = (index: number) =>
    index % 2 !== 0 ? "bg-[#F4FFF1]" : "bg-white";

  return (
    <div className={styles.recentActivitiesSection}>
      <div className="bg-transparent rounded-bl-xl rounded-br-xl overflow-hidden">
        {/* Header */}
        <div className="py-3 flex justify-between items-center">
          <h2 className="text-xl font-bold">Property List</h2>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Rows :</span>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            >
              {[4, 5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="px-4 py-3 text-left">ID/Spot</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Possession Type</th>
                <th className="px-4 py-3 text-left">Property Tag Date</th>
                <th className="px-4 py-3 text-left">Phase</th>
                <th className="px-4 py-3 text-left">Zone</th>
                <th className="px-4 py-3 text-left">Khayaban</th>
                <th className="px-4 py-3 text-left">Floor</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${rowStyle(index)} hover:bg-gray-50`}
                  >
                    <td className="px-4 py-3 text-sm">{item.idSpot}</td>
                    <td className="px-4 py-3 text-sm">{item.category}</td>
                    <td className="px-4 py-3 text-sm">{item.type}</td>
                    <td className="px-4 py-3 text-sm">{item.possessionType}</td>
                    <td className="px-4 py-3 text-sm">{item.propertyTagDate}</td>
                    <td className="px-4 py-3 text-sm">{item.phase}</td>
                    <td className="px-4 py-3 text-sm">{item.zone}</td>
                    <td className="px-4 py-3 text-sm">{item.khayaban}</td>
                    <td className="px-4 py-3 text-sm">{item.floor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="py-3 border-t flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded border transition ${
                currentPage === 1
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#30B33D] text-[#30B33D] hover:bg-[#30B33D] hover:text-white"
              }`}
            >
              <FiChevronLeft />
            </button>

            <span className="px-4 py-1.5 rounded bg-[#30B33D] text-white text-sm font-semibold">
              {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded border transition ${
                currentPage === totalPages
                  ? "border-gray-300 text-gray-300 cursor-not-allowed"
                  : "border-[#30B33D] text-[#30B33D] hover:bg-[#30B33D] hover:text-white"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}