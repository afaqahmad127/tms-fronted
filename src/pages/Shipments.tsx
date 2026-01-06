import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid3X3,
  LayoutGrid,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  MoreVertical,
  Edit,
  Flag,
  Trash2,
  Eye,
  X,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { GET_SHIPMENTS, DELETE_SHIPMENT, FLAG_SHIPMENT, UNFLAG_SHIPMENT } from '../lib/graphql';
import { ShipmentConnection, ShipmentStatus, ShipmentPriority, ViewMode, Shipment } from '../types';
import { useAuth } from '../context/AuthContext';

const Shipments: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('tile');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<ShipmentPriority[]>([]);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('CREATED_AT');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const { isAdmin } = useAuth();

  // Build filter from URL params
  const filter = useMemo(() => {
    const status = searchParams.get('status');
    const flagged = searchParams.get('flagged');
    
    const f: Record<string, unknown> = {};
    
    if (status) {
      f.status = [status];
    } else if (selectedStatus.length > 0) {
      f.status = selectedStatus;
    }
    
    if (flagged === 'true') {
      f.isFlagged = true;
    }
    
    if (selectedPriority.length > 0) {
      f.priority = selectedPriority;
    }
    
    if (searchTerm) {
      f.search = searchTerm;
    }
    
    return f;
  }, [searchParams, selectedStatus, selectedPriority, searchTerm]);

  const { data, loading, refetch } = useQuery<{ shipments: ShipmentConnection }>(
    GET_SHIPMENTS,
    {
      variables: {
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        sort: { field: sortField, order: sortOrder },
        page,
        limit: 20,
      },
    }
  );

  const [deleteShipment] = useMutation(DELETE_SHIPMENT);
  const [flagShipment] = useMutation(FLAG_SHIPMENT);
  const [unflagShipment] = useMutation(UNFLAG_SHIPMENT);

  const shipments = data?.shipments.edges.map((e) => e.node) || [];
  const pageInfo = data?.shipments.pageInfo;
  const totalCount = data?.shipments.totalCount || 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;
    
    try {
      await deleteShipment({ variables: { id } });
      toast.success('Shipment deleted successfully');
      refetch();
    } catch {
      toast.error('Failed to delete shipment');
    }
    setActiveMenu(null);
  };

  const handleFlag = async (id: string, isFlagged: boolean) => {
    try {
      if (isFlagged) {
        await unflagShipment({ variables: { id } });
        toast.success('Shipment unflagged');
      } else {
        const reason = prompt('Enter flag reason:');
        if (!reason) return;
        await flagShipment({ variables: { id, reason } });
        toast.success('Shipment flagged');
      }
      refetch();
    } catch {
      toast.error('Failed to update flag status');
    }
    setActiveMenu(null);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortOrder('DESC');
    }
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedPriority([]);
    setSearchTerm('');
    setSearchParams({});
  };

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

  const getPriorityColor = (priority: ShipmentPriority) => {
    const colors: Record<ShipmentPriority, string> = {
      LOW: 'priority-low',
      MEDIUM: 'priority-medium',
      HIGH: 'priority-high',
      URGENT: 'priority-urgent',
    };
    return colors[priority] || 'priority-medium';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const columns = [
    { key: 'TRACKING_NUMBER', label: 'Tracking #' },
    { key: 'STATUS', label: 'Status' },
    { key: 'PRIORITY', label: 'Priority' },
    { key: 'origin', label: 'Origin', sortable: false },
    { key: 'destination', label: 'Destination', sortable: false },
    { key: 'CARRIER', label: 'Carrier' },
    { key: 'weight', label: 'Weight', sortable: false },
    { key: 'COST', label: 'Cost' },
    { key: 'ESTIMATED_DELIVERY', label: 'Est. Delivery' },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Shipments</h1>
          <p className="text-surface-400">
            Manage and track all your shipments in one place
          </p>
        </div>
        <button className="btn-primary inline-flex items-center gap-2 self-start">
          <Plus size={18} />
          New Shipment
        </button>
      </div>

      {/* Controls */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by tracking number, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-surface-800/50 border border-surface-600/50 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary flex items-center gap-2 ${
                showFilters ? 'bg-blue-500/20 border-blue-500/50' : ''
              }`}
            >
              <Filter size={18} />
              Filters
              {(selectedStatus.length > 0 || selectedPriority.length > 0) && (
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center glass rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('tile')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'tile'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>

            {/* Results count */}
            <span className="text-surface-400 text-sm hidden sm:inline">
              {totalCount} shipments
            </span>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-surface-700/50">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(ShipmentStatus).map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            setSelectedStatus((prev) =>
                              prev.includes(status)
                                ? prev.filter((s) => s !== status)
                                : [...prev, status]
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedStatus.includes(status)
                              ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                              : 'bg-surface-700/50 text-surface-400 hover:bg-surface-600/50'
                          }`}
                        >
                          {status.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(ShipmentPriority).map((priority) => (
                        <button
                          key={priority}
                          onClick={() =>
                            setSelectedPriority((prev) =>
                              prev.includes(priority)
                                ? prev.filter((p) => p !== priority)
                                : [...prev, priority]
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedPriority.includes(priority)
                              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                              : 'bg-surface-700/50 text-surface-400 hover:bg-surface-600/50'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="btn-ghost text-sm flex items-center gap-2"
                    >
                      <X size={16} />
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : viewMode === 'tile' ? (
        <TileView
          shipments={shipments}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          formatDate={formatDate}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          handleDelete={handleDelete}
          handleFlag={handleFlag}
          isAdmin={isAdmin}
        />
      ) : (
        <GridView
          shipments={shipments}
          columns={columns}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          formatDate={formatDate}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          handleDelete={handleDelete}
          handleFlag={handleFlag}
          isAdmin={isAdmin}
        />
      )}

      {/* Pagination */}
      {pageInfo && (
        <div className="flex items-center justify-between glass-card rounded-xl p-4">
          <p className="text-surface-400 text-sm">
            Showing {shipments.length} of {totalCount} shipments
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pageInfo.hasPreviousPage}
              className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 py-2 text-surface-300">
              Page {pageInfo.currentPage} of {pageInfo.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pageInfo.hasNextPage}
              className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface TileViewProps {
  shipments: Shipment[];
  getStatusColor: (status: ShipmentStatus) => string;
  getPriorityColor: (priority: ShipmentPriority) => string;
  formatDate: (date: string) => string;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleDelete: (id: string) => void;
  handleFlag: (id: string, isFlagged: boolean) => void;
  isAdmin: boolean;
}

const TileView: React.FC<TileViewProps> = ({
  shipments,
  getStatusColor,
  getPriorityColor,
  formatDate,
  activeMenu,
  setActiveMenu,
  handleDelete,
  handleFlag,
  isAdmin,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  >
    {shipments.map((shipment, index) => (
      <motion.div
        key={shipment.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="glass-card rounded-2xl p-5 card-hover relative group"
      >
        {/* Menu Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              setActiveMenu(activeMenu === shipment.id ? null : shipment.id);
            }}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={18} className="text-surface-400" />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {activeMenu === shipment.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 z-20"
              >
                <Link
                  to={`/shipments/${shipment.id}`}
                  className="flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Eye size={16} />
                  View Details
                </Link>
                <Link
                  to={`/shipments/${shipment.id}/edit`}
                  className="flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Edit size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => handleFlag(shipment.id, shipment.isFlagged)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Flag size={16} />
                  {shipment.isFlagged ? 'Unflag' : 'Flag'}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(shipment.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Flag indicator */}
        {shipment.isFlagged && (
          <div className="absolute top-4 left-4">
            <Flag size={16} className="text-pink-400" />
          </div>
        )}

        <Link to={`/shipments/${shipment.id}`}>
          {/* Tracking Number */}
          <p className="font-mono text-sm text-blue-400 mb-3">
            {shipment.trackingNumber}
          </p>

          {/* Status & Priority Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                shipment.status
              )}`}
            >
              {shipment.status.replace(/_/g, ' ')}
            </span>
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(
                shipment.priority
              )}`}
            >
              {shipment.priority}
            </span>
          </div>

          {/* Route */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div className="w-0.5 h-8 bg-surface-600" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-xs text-surface-400">From</p>
                <p className="text-sm text-white truncate">
                  {shipment.origin.city}, {shipment.origin.state}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-400">To</p>
                <p className="text-sm text-white truncate">
                  {shipment.destination.city}, {shipment.destination.state}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-surface-400">
              <Truck size={14} />
              <span className="truncate">{shipment.carrier}</span>
            </div>
            <div className="flex items-center gap-2 text-surface-400">
              <DollarSign size={14} />
              <span>${shipment.cost.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-surface-400 col-span-2">
              <Calendar size={14} />
              <span>Est. {formatDate(shipment.estimatedDelivery)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    ))}
  </motion.div>
);

interface GridViewProps extends TileViewProps {
  columns: { key: string; label: string; sortable?: boolean }[];
  sortField: string;
  sortOrder: 'ASC' | 'DESC';
  handleSort: (field: string) => void;
}

const GridView: React.FC<GridViewProps> = ({
  shipments,
  columns,
  sortField,
  sortOrder,
  handleSort,
  getStatusColor,
  getPriorityColor,
  formatDate,
  activeMenu,
  setActiveMenu,
  handleDelete,
  handleFlag,
  isAdmin,
}) => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-700/50">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={`px-4 py-4 text-left text-sm font-medium text-surface-400 ${
                  col.sortable !== false
                    ? 'cursor-pointer hover:text-white transition-colors'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable !== false && sortField === col.key && (
                    <ArrowUpDown
                      size={14}
                      className={`transition-transform ${
                        sortOrder === 'ASC' ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr
              key={shipment.id}
              className="border-b border-surface-700/30 hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-4">
                <Link
                  to={`/shipments/${shipment.id}`}
                  className="font-mono text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
                >
                  {shipment.isFlagged && <Flag size={12} className="text-pink-400" />}
                  {shipment.trackingNumber}
                </Link>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    shipment.status
                  )}`}
                >
                  {shipment.status.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(
                    shipment.priority
                  )}`}
                >
                  {shipment.priority}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-surface-500" />
                  <span className="text-surface-300">
                    {shipment.origin.city}, {shipment.origin.state}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-surface-500" />
                  <span className="text-surface-300">
                    {shipment.destination.city}, {shipment.destination.state}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-surface-300 text-sm">{shipment.carrier}</td>
              <td className="px-4 py-4 text-surface-300 text-sm">
                {shipment.weight.toFixed(1)} lbs
              </td>
              <td className="px-4 py-4 text-surface-300 text-sm">
                ${shipment.cost.toLocaleString()}
              </td>
              <td className="px-4 py-4 text-surface-300 text-sm">
                {formatDate(shipment.estimatedDelivery)}
              </td>
              <td className="px-4 py-4">
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === shipment.id ? null : shipment.id)
                    }
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <MoreVertical size={16} className="text-surface-400" />
                  </button>

                  <AnimatePresence>
                    {activeMenu === shipment.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 z-20"
                      >
                        <Link
                          to={`/shipments/${shipment.id}`}
                          className="flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Eye size={16} />
                          View Details
                        </Link>
                        <Link
                          to={`/shipments/${shipment.id}/edit`}
                          className="flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Edit size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleFlag(shipment.id, shipment.isFlagged)}
                          className="w-full flex items-center gap-3 px-4 py-2 text-surface-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          {shipment.isFlagged ? <Check size={16} /> : <Flag size={16} />}
                          {shipment.isFlagged ? 'Unflag' : 'Flag'}
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(shipment.id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Shipments;

