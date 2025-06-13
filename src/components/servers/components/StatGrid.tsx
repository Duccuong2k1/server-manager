import StatCard, { StatCardProps } from "./StatCard";
import { motion } from 'framer-motion';

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;