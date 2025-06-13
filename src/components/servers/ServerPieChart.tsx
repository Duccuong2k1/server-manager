// src/components/ServerPieChart.tsx (hoặc đường dẫn tương tự)

"use client"

import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { BsThreeDots } from "react-icons/bs"
import Skeleton from "react-loading-skeleton"

interface ServerCategoryData {
  name: string
  value: number
  percentage: number
  color: string
}

interface ServerPieChartProps {
  title: string
  totalValue: string
  categories: ServerCategoryData[]
  loading?: boolean
}

const VIBRANT_COLORS = [
  "#6366F1", // Indigo 500
  "#EC4899", // Pink 500
  "#10B981", // Emerald 500
  "#F59E0B", // Amber 500
  "#EF4444", // Red 500
  "#06B6D4", // Cyan 500
  "#8B5CF6", // Violet 500
  "#EAB308", // Yellow 500
]

const ServerPieChart: React.FC<ServerPieChartProps> = ({ title, totalValue, categories, loading = false }) => {
  const dataWithColors = categories.map((cat, index) => ({
    ...cat,
    color: cat.color || VIBRANT_COLORS[index % VIBRANT_COLORS.length],
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {loading ? <Skeleton width={180} /> : title}
        </h2>
      </div>

      <div className="flex flex-col  items-center md:items-center md:justify-between gap-4 flex-grow">
        <div className="w-full md:w-1/2 flex justify-center items-center relative h-40">
          {loading ? (
            <Skeleton circle height={160} width={160} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithColors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            {loading ? (
              <>
                <Skeleton width={50} height={20} />
                <Skeleton width={30} height={10} className="mt-1" />
              </>
            ) : (
              <>
                <div className="font-bold text-xl text-gray-900 dark:text-white">{!!totalValue && totalValue}</div>
                <div className="text-sm text-gray-500">Total</div>
              </>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex-grow space-y-2.5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center text-sm">
                  <Skeleton circle width={12} height={12} className="mr-2" />
                  <Skeleton width={80} className="mr-auto" />
                  <Skeleton width={60} />
                </div>
              ))
            : dataWithColors.map((category, index) => (
                <div key={index} className="flex items-center text-sm">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></span>

                  <span className="font-medium text-gray-700 dark:text-gray-300">{category.name}</span>

                  <span className="ml-auto text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">{category.percentage}%</span> • {category.value} Products
                  </span>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

export default ServerPieChart
