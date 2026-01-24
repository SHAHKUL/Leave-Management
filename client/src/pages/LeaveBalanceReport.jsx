import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LeaveBalanceReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setIsLoading(true);

        const data = await api.getBalances(token);

        const grouped = {};

        data.forEach((item) => {
          const empId = item.employeeId;

          if (!grouped[empId]) {
            grouped[empId] = {
              id: empId,
              name: item.employeeName,
              annual: { total: 0, used: 0 },
              sick: { total: 0, used: 0 },
              paid: { total: 0, used: 0 },
            };
          }

          const type = item.leaveType.toLowerCase(); // annual | sick | paid

          if (grouped[empId][type]) {
            grouped[empId][type].total = item.entitlementDays;
            grouped[empId][type].used = item.usedDays;
          }
        });

        setBalances(Object.values(grouped));
      } catch (error) {
        console.error(error);
        setBalances([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [token]);

  const filteredBalances = balances.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleExportCSV = () => {
    if (!filteredBalances.length) return;

    const headers = [
      "Employee Name",
      "Annual Used",
      "Annual Total",
      "Sick Used",
      "Sick Total",
      "Paid Used",
      "Paid Total",
    ];

    const rows = filteredBalances.map((b) => [
      b.name,
      b.annual.used,
      b.annual.total,
      b.sick.used,
      b.sick.total,
      b.paid.used,
      b.paid.total,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "leave-balance-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading reports...</div>;
  }

  const handleRowClick = (employeeId) => {
    navigate(`/profile/${employeeId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Leave Balance Report
      </h1>

      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-sm font-medium text-black
               bg-white border border-gray-300 rounded-lg shadow
               hover:bg-gray-100 hover:border-gray-500
               transition-colors duration-200"
          >
            Export CSV
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1011.25 3.75a7.5 7.5 0 005.4 12.9z"
                />
              </svg>
            </span>

            <input
              type="text"
              className="block w-full rounded-lg border border-slate-300
                         pl-10 pr-4 py-2.5 text-sm text-slate-700
                         placeholder-slate-400 focus:ring-2
                         focus:ring-primary-200 focus:border-primary-500"
              placeholder="Search employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Annual (Used / Total)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Sick (Used / Total)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Paid (Used / Total)
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {filteredBalances.map((balance) => (
                <tr
                  key={balance.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  {/* Employee Name */}
                  <td
                    onClick={() => handleRowClick(balance.id)}
                    className="px-6 py-4 text-base font-semibold text-indigo-700
                 cursor-pointer hover:underline whitespace-nowrap"
                  >
                    {balance.name}
                  </td>

                  {/* Annual Leave */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {balance.annual.used}
                    </span>
                    <span className="mx-1 text-slate-400">/</span>
                    <span>{balance.annual.total}</span>
                  </td>

                  {/* Sick Leave */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {balance.sick.used}
                    </span>
                    <span className="mx-1 text-slate-400">/</span>
                    <span>{balance.sick.total}</span>
                  </td>

                  {/* Paid Leave */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {balance.paid.used}
                    </span>
                    <span className="mx-1 text-slate-400">/</span>
                    <span>{balance.paid.total}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceReport;
