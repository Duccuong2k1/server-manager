import { motion } from "framer-motion"
import React from "react"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export interface StatCardProps {
  title: string
  value?: string | number
  subValue?: string | number
  subValueLabel?: string
  change?: string
  changeType?: "increase" | "decrease"
  icon?: React.ReactNode
  isNew?: boolean
  isBeta?: boolean
  loading?: boolean
  listItems?: Array<{
    label: string
    value: string | number
    percentage?: number
    icon?: React.ReactNode
  }>
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  subValueLabel,
  change,
  changeType = "increase",
  icon,
  isNew = false,
  isBeta = false,
  loading = false, // Mặc định là false
  listItems,
}) => {
  const changeColorClass =
    changeType === "increase" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"

  const bgColorClass = changeType === "increase" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col h-full relative overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {!listItems && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-800/30 pointer-events-none" />
      )}

      <div className="flex justify-between items-start relative">
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`${bgColorClass} p-3 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm`}
            >
              {icon}
            </motion.div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
            <div className="flex gap-2 mt-1.5">
              <>
                {isNew && (
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full ring-1 ring-blue-200 dark:ring-blue-800">
                    New
                  </span>
                )}
                {isBeta && (
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded-full ring-1 ring-yellow-200 dark:ring-yellow-800">
                    Beta
                  </span>
                )}
              </>
            </div>
          </div>
        </div>
      </div>

      {listItems ? (
        <div className="mt-3 space-y-2.5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton circle width={28} height={28} />
                    <Skeleton width={100} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton width={40} />
                    <Skeleton width={50} height={20} borderRadius={999} />
                  </div>
                </div>
              ))
            : listItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/70 shadow-sm">{item.icon}</div>
                    <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                    {item.percentage !== undefined && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "auto" }}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full
                        ${
                          item.percentage > 50
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800"
                        }`}
                      >
                        {item.percentage}%
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full relative">
          {loading ? (
            <Skeleton width="70%" height={40} className="mt-2" />
          ) : (
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {value}
            </motion.p>
          )}
          {subValue !== undefined && subValueLabel ? (
            loading ? (
              <Skeleton width="50%" height={18} className="mt-1" />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              >
                {subValueLabel} <span className="font-semibold text-green-600 dark:text-gray-200">{subValue}</span>
              </motion.p>
            )
          ) : null}{" "}
          {change ? (
            <div className="flex items-center gap-2 mt-4">
              {loading ? (
                <Skeleton circle width={24} height={24} />
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`p-1.5 rounded-full ${bgColorClass} shadow-sm`}
                >
                  {changeType === "increase" ? (
                    <FaArrowUp className={`w-3.5 h-3.5 ${changeColorClass}`} />
                  ) : (
                    <FaArrowDown className={`w-3.5 h-3.5 ${changeColorClass}`} />
                  )}
                </motion.div>
              )}

              {loading ? (
                <Skeleton width={80} />
              ) : (
                <span className={`text-sm font-medium ${changeColorClass}`}>{change}</span>
              )}
            </div>
          ) : null}
        </div>
      )}
    </motion.div>
  )
}

export default StatCard
