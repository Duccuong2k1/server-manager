import React from 'react';
import { motion } from 'framer-motion';
import {
  MdAccessTime,
  MdCalendarViewWeek,
  MdCalendarMonth,
  MdTune,
} from 'react-icons/md';
import DateRangePicker from './DateRangePicker';

export type TimeRange = "24h" | "7d" | "30d" | "custom";

interface TimeRangeFilterProps {
  activeTimeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  customStart: Date | null;
  customEnd: Date | null;
  onCustomStartChange: (date: Date | null) => void;
  onCustomEndChange: (date: Date | null) => void;
}

const timeRangeOptions: { value: TimeRange; label: string; icon: React.ElementType }[] = [
  { label: '24 hours', value: '24h', icon: MdAccessTime },
  { label: '7 days', value: '7d', icon: MdCalendarViewWeek },
  { label: '30 days', value: '30d', icon: MdCalendarMonth },
  { label: 'Custom', value: 'custom', icon: MdTune },
];

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  activeTimeRange,
  onTimeRangeChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative flex bg-gray-100 dark:bg-gray-700 rounded-full p-1 shadow-inner max-w-fit"
      >
        {timeRangeOptions.map((option) => {
          const isActive = activeTimeRange === option.value;
          const IconComponent = option.icon;

          return (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTimeRangeChange(option.value)}
              className={`
                relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full z-10
                transition-colors duration-200 ease-in-out whitespace-nowrap
                ${isActive
                  ? 'text-blue-700 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
                }
              `}
            >
              <IconComponent className="w-4 h-4" />
              <span>{option.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-white dark:bg-blue-600 rounded-full shadow-sm -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {activeTimeRange === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-4 items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm"
        >
          <DateRangePicker
            startDate={customStart}
            endDate={customEnd}
            onStartDateChange={onCustomStartChange}
            onEndDateChange={onCustomEndChange}
          />
        </motion.div>
      )}
    </div>
  );
};

export default TimeRangeFilter;