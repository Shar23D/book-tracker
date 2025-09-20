import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStatistics } from "../hooks/useStatistics";

const StatisticsPage = ({ books, onBack }) => {
  const [statsView, setStatsView] = useState({
    monthly: "books",
    yearly: "books",
    format: "yearly",
  });

  const stats = useStatistics(books);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Reading Statistics
          </h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Books
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Books Read
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.totalRead}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Pages Read
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalPages.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              This Year
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.currentYearBooks}
            </p>
            <p className="text-sm text-gray-600">
              {stats.currentYearPages.toLocaleString()} pages
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Avg Pages/Year
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats.avgPagesPerYear.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Progress */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Past 12 Months Progress</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setStatsView({ ...statsView, monthly: "books" })
                  }
                  className={`px-3 py-1 text-sm rounded ${statsView.monthly === "books"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Books
                </button>
                <button
                  onClick={() =>
                    setStatsView({ ...statsView, monthly: "pages" })
                  }
                  className={`px-3 py-1 text-sm rounded ${statsView.monthly === "pages"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Pages
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} tickCount={6} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={statsView.monthly}
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Yearly Overview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setStatsView({ ...statsView, yearly: "books" })
                  }
                  className={`px-3 py-1 text-sm rounded ${statsView.yearly === "books"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Books
                </button>
                <button
                  onClick={() =>
                    setStatsView({ ...statsView, yearly: "pages" })
                  }
                  className={`px-3 py-1 text-sm rounded ${statsView.yearly === "pages"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Pages
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.yearly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey={statsView.yearly} fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Format Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Reading Format Distribution
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setStatsView({ ...statsView, format: "monthly" })
                  }
                  className={`px-3 py-1 text-sm rounded ${statsView.format === "monthly"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() =>
                    setStatsView({ ...statsView, format: "yearly" })
                  }
                  className={`px-3 py-1 text-sm rounded ${statsView.format === "yearly"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={
                  statsView.format === "yearly"
                    ? stats.formatYearly
                    : stats.formatMonthly
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={statsView.format === "yearly" ? "year" : "month"}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="ebook" stackId="a" fill="#3B82F6" name="E-book" />
                <Bar
                  dataKey="audiobook"
                  stackId="a"
                  fill="#10B981"
                  name="Audiobook"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Top 5 Most Read Tags</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.tags}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.tags.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"][
                        index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {stats.tags.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No tags found in your read books
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
