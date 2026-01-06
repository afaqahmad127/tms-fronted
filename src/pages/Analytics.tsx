import React from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';
import { GET_SHIPMENT_STATS } from '../lib/graphql';
import { ShipmentStats } from '../types';

const Analytics: React.FC = () => {
  const { data, loading } = useQuery<{ shipmentStats: ShipmentStats }>(GET_SHIPMENT_STATS);
  const stats = data?.shipmentStats;

  const deliveryRate = stats?.total
    ? Math.round((stats.delivered / stats.total) * 100)
    : 0;
  const onTimeRate =
    stats?.delivered && stats.delivered > 0
      ? Math.round(((stats.delivered - stats.delayed) / stats.delivered) * 100)
      : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-surface-400">
          Track performance metrics and shipping insights
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* Total Shipments */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Package size={24} className="text-blue-400" />
                </div>
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <TrendingUp size={16} />
                  +12.5%
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats?.total || 0}</p>
              <p className="text-surface-400">Total Shipments</p>
            </motion.div>

            {/* Delivery Rate */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                </div>
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <TrendingUp size={16} />
                  +3.2%
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{deliveryRate}%</p>
              <p className="text-surface-400">Delivery Rate</p>
            </motion.div>

            {/* On-Time Rate */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Clock size={24} className="text-cyan-400" />
                </div>
                <span className="flex items-center gap-1 text-red-400 text-sm">
                  <TrendingDown size={16} />
                  -1.8%
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{onTimeRate}%</p>
              <p className="text-surface-400">On-Time Rate</p>
            </motion.div>

            {/* Total Revenue */}
            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <DollarSign size={24} className="text-purple-400" />
                </div>
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <TrendingUp size={16} />
                  +8.7%
                </span>
              </div>
              <p className="text-3xl font-bold gradient-text mb-1">
                ${((stats?.totalCost || 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-surface-400">Total Revenue</p>
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <BarChart3 size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Status Distribution</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Delivered',
                    value: stats?.delivered || 0,
                    color: 'bg-emerald-500',
                    bgColor: 'bg-emerald-500/20',
                  },
                  {
                    label: 'In Transit',
                    value: stats?.inTransit || 0,
                    color: 'bg-blue-500',
                    bgColor: 'bg-blue-500/20',
                  },
                  {
                    label: 'Pending',
                    value: stats?.pending || 0,
                    color: 'bg-amber-500',
                    bgColor: 'bg-amber-500/20',
                  },
                  {
                    label: 'Delayed',
                    value: stats?.delayed || 0,
                    color: 'bg-orange-500',
                    bgColor: 'bg-orange-500/20',
                  },
                  {
                    label: 'Cancelled',
                    value: stats?.cancelled || 0,
                    color: 'bg-red-500',
                    bgColor: 'bg-red-500/20',
                  },
                ].map((item, index) => {
                  const percentage =
                    stats?.total ? Math.round((item.value / stats.total) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-surface-300">{item.label}</span>
                        <span className="text-white font-medium">
                          {item.value} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Activity size={20} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Performance Overview</h2>
              </div>

              {/* Circular Progress */}
              <div className="flex justify-center mb-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="rgba(100, 116, 139, 0.2)"
                      strokeWidth="16"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 502' }}
                      animate={{
                        strokeDasharray: `${(deliveryRate / 100) * 502} 502`,
                      }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{deliveryRate}%</span>
                    <span className="text-surface-400 text-sm">Delivery Rate</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">
                    ${(stats?.avgCost || 0).toFixed(0)}
                  </p>
                  <p className="text-surface-400 text-sm">Avg. Cost</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-pink-400">{stats?.flagged || 0}</p>
                  <p className="text-surface-400 text-sm">Flagged</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Alerts & Notifications</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-orange-400" />
                  <span className="text-white font-medium">Delayed Shipments</span>
                </div>
                <p className="text-3xl font-bold text-orange-400 mb-1">
                  {stats?.delayed || 0}
                </p>
                <p className="text-surface-400 text-sm">Requires attention</p>
              </div>

              <div className="glass rounded-xl p-4 border-l-4 border-pink-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-pink-400" />
                  <span className="text-white font-medium">Flagged Items</span>
                </div>
                <p className="text-3xl font-bold text-pink-400 mb-1">
                  {stats?.flagged || 0}
                </p>
                <p className="text-surface-400 text-sm">Review needed</p>
              </div>

              <div className="glass rounded-xl p-4 border-l-4 border-amber-500">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={18} className="text-amber-400" />
                  <span className="text-white font-medium">Pending Pickups</span>
                </div>
                <p className="text-3xl font-bold text-amber-400 mb-1">
                  {stats?.pending || 0}
                </p>
                <p className="text-surface-400 text-sm">Awaiting pickup</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Analytics;

