import React from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Flag,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { GET_SHIPMENT_STATS, GET_SHIPMENTS } from '../lib/graphql';
import { ShipmentStats, ShipmentConnection, ShipmentStatus } from '../types';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: statsData, loading: statsLoading } = useQuery<{ shipmentStats: ShipmentStats }>(
    GET_SHIPMENT_STATS
  );
  const { data: recentData, loading: recentLoading } = useQuery<{ shipments: ShipmentConnection }>(
    GET_SHIPMENTS,
    { variables: { limit: 5, sort: { field: 'CREATED_AT', order: 'DESC' } } }
  );

  const stats = statsData?.shipmentStats;
  const recentShipments = recentData?.shipments.edges.map((e) => e.node) || [];

  const statCards = [
    {
      label: 'Total Shipments',
      value: stats?.total || 0,
      icon: <Package size={24} />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
    },
    {
      label: 'In Transit',
      value: stats?.inTransit || 0,
      icon: <Truck size={24} />,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/20',
    },
    {
      label: 'Delivered',
      value: stats?.delivered || 0,
      icon: <CheckCircle2 size={24} />,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/20',
    },
    {
      label: 'Pending',
      value: stats?.pending || 0,
      icon: <Clock size={24} />,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/20',
    },
    {
      label: 'Delayed',
      value: stats?.delayed || 0,
      icon: <AlertTriangle size={24} />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/20',
    },
    {
      label: 'Cancelled',
      value: stats?.cancelled || 0,
      icon: <XCircle size={24} />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20',
    },
    {
      label: 'Flagged',
      value: stats?.flagged || 0,
      icon: <Flag size={24} />,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/20',
    },
    {
      label: 'Avg Cost',
      value: `$${(stats?.avgCost || 0).toLocaleString()}`,
      icon: <DollarSign size={24} />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
    },
  ];

  const getStatusColor = (status: ShipmentStatus) => {
    const colors: Record<ShipmentStatus, string> = {
      PENDING: 'status-pending',
      PICKED_UP: 'status-in-transit',
      IN_TRANSIT: 'status-in-transit',
      OUT_FOR_DELIVERY: 'status-in-transit',
      DELIVERED: 'status-delivered',
      CANCELLED: 'status-cancelled',
      DELAYED: 'status-delayed',
      RETURNED: 'status-cancelled',
    };
    return colors[status] || 'status-pending';
  };

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
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.firstName}</span>!
          </h1>
          <p className="text-surface-400">
            Here's what's happening with your shipments today.
          </p>
        </div>
        <Link
          to="/shipments"
          className="btn-primary inline-flex items-center gap-2 self-start"
        >
          View All Shipments
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 card-hover"
          >
            {statsLoading ? (
              <div className="space-y-3">
                <div className="skeleton w-10 h-10 rounded-xl" />
                <div className="skeleton w-20 h-8 rounded-lg" />
                <div className="skeleton w-24 h-4 rounded" />
              </div>
            ) : (
              <>
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}
                >
                  <div className={`bg-gradient-to-br ${stat.color} bg-clip-text`}>
                    {stat.icon}
                  </div>
                </div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
                  className="text-2xl lg:text-3xl font-bold text-white mb-1"
                >
                  {stat.value}
                </motion.p>
                <p className="text-surface-400 text-sm">{stat.label}</p>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Activity size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Recent Shipments</h2>
            </div>
            <Link
              to="/shipments"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentShipments.map((shipment, index) => (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={`/shipments/${shipment.id}`}
                    className="flex items-center justify-between p-4 glass rounded-xl hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-700/50 flex items-center justify-center">
                        <Package size={18} className="text-surface-300" />
                      </div>
                      <div>
                        <p className="font-mono text-sm text-white group-hover:text-blue-400 transition-colors">
                          {shipment.trackingNumber}
                        </p>
                        <p className="text-sm text-surface-400">
                          {shipment.origin.city} → {shipment.destination.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {shipment.status.replace(/_/g, ' ')}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-surface-500 group-hover:text-white group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Stats / Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Performance</h2>
          </div>

          <div className="space-y-6">
            {/* Delivery Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-surface-400 text-sm">Delivery Rate</span>
                <span className="text-white font-medium">
                  {stats?.total
                    ? Math.round((stats.delivered / stats.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      stats?.total
                        ? Math.round((stats.delivered / stats.total) * 100)
                        : 0
                    }%`,
                  }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                />
              </div>
            </div>

            {/* On-Time Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-surface-400 text-sm">On-Time Rate</span>
                <span className="text-white font-medium">
                  {stats?.total && stats.delivered
                    ? Math.round(
                        ((stats.delivered - stats.delayed) / stats.delivered) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      stats?.total && stats.delivered
                        ? Math.round(
                            ((stats.delivered - stats.delayed) / stats.delivered) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
            </div>

            {/* Total Revenue */}
            <div className="pt-4 border-t border-surface-700/50">
              <p className="text-surface-400 text-sm mb-2">Total Shipment Value</p>
              <p className="text-3xl font-bold gradient-text">
                ${(stats?.totalCost || 0).toLocaleString()}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-surface-700/50 space-y-3">
              <Link
                to="/shipments?status=DELAYED"
                className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-orange-400" />
                  <span className="text-surface-300">Delayed Shipments</span>
                </div>
                <span className="text-orange-400 font-medium">{stats?.delayed || 0}</span>
              </Link>
              <Link
                to="/shipments?flagged=true"
                className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Flag size={18} className="text-pink-400" />
                  <span className="text-surface-300">Flagged Items</span>
                </div>
                <span className="text-pink-400 font-medium">{stats?.flagged || 0}</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

