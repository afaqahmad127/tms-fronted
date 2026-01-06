import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Package,
  MapPin,
  Truck,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Box,
  Flag,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  GET_SHIPMENT,
  DELETE_SHIPMENT,
  FLAG_SHIPMENT,
  UNFLAG_SHIPMENT,
  UPDATE_SHIPMENT_STATUS,
} from '../lib/graphql';
import { Shipment, ShipmentStatus, ShipmentPriority } from '../types';
import { useAuth } from '../context/AuthContext';

const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data, loading, refetch } = useQuery<{ shipment: Shipment }>(GET_SHIPMENT, {
    variables: { id },
    skip: !id,
  });

  const [deleteShipment] = useMutation(DELETE_SHIPMENT);
  const [flagShipment] = useMutation(FLAG_SHIPMENT);
  const [unflagShipment] = useMutation(UNFLAG_SHIPMENT);
  const [updateStatus] = useMutation(UPDATE_SHIPMENT_STATUS);

  const shipment = data?.shipment;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      await deleteShipment({ variables: { id } });
      toast.success('Shipment deleted successfully');
      navigate('/shipments');
    } catch {
      toast.error('Failed to delete shipment');
    }
  };

  const handleFlag = async () => {
    if (!shipment) return;

    try {
      if (shipment.isFlagged) {
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
  };

  const handleStatusUpdate = async (status: ShipmentStatus) => {
    try {
      await updateStatus({ variables: { id, status } });
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      refetch();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
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

  const getStatusIcon = (status: ShipmentStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="text-emerald-400" size={24} />;
      case 'IN_TRANSIT':
      case 'PICKED_UP':
      case 'OUT_FOR_DELIVERY':
        return <Truck className="text-blue-400" size={24} />;
      case 'DELAYED':
        return <AlertTriangle className="text-orange-400" size={24} />;
      case 'PENDING':
        return <Clock className="text-amber-400" size={24} />;
      default:
        return <Package className="text-surface-400" size={24} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-48 rounded-xl" />
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="text-center py-20">
        <Package size={64} className="mx-auto text-surface-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Shipment Not Found</h2>
        <p className="text-surface-400 mb-6">
          The shipment you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/shipments" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Shipments
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/shipments')}
            className="p-2 rounded-xl glass hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono">
                {shipment.trackingNumber}
              </h1>
              <button
                onClick={() => copyToClipboard(shipment.trackingNumber)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Copy tracking number"
              >
                <Copy size={16} className="text-surface-400" />
              </button>
            </div>
            <p className="text-surface-400">
              Created {formatDateTime(shipment.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="btn-secondary flex items-center gap-2"
          >
            {getStatusIcon(shipment.status)}
            Update Status
          </button>
          <button
            onClick={handleFlag}
            className={`btn-secondary flex items-center gap-2 ${
              shipment.isFlagged ? 'bg-pink-500/20 border-pink-500/50' : ''
            }`}
          >
            <Flag size={18} className={shipment.isFlagged ? 'text-pink-400' : ''} />
            {shipment.isFlagged ? 'Unflag' : 'Flag'}
          </button>
          <Link
            to={`/shipments/${id}/edit`}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit size={18} />
            Edit
          </Link>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="btn-secondary flex items-center gap-2 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              {getStatusIcon(shipment.status)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                    shipment.status
                  )}`}
                >
                  {shipment.status.replace(/_/g, ' ')}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg text-sm font-medium ${getPriorityColor(
                    shipment.priority
                  )}`}
                >
                  {shipment.priority} Priority
                </span>
                <span className="px-2.5 py-1 rounded-lg text-sm font-medium bg-surface-700/50 text-surface-300">
                  {shipment.type}
                </span>
              </div>
              <p className="text-surface-400">{shipment.description}</p>
            </div>
          </div>

          {shipment.isFlagged && (
            <div className="flex items-center gap-3 px-4 py-3 bg-pink-500/20 rounded-xl border border-pink-500/30">
              <Flag size={18} className="text-pink-400" />
              <div>
                <p className="text-sm font-medium text-pink-400">Flagged</p>
                <p className="text-xs text-pink-300/70">{shipment.flagReason}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Route & Addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-400" />
              Shipping Route
            </h2>

            <div className="relative">
              {/* Route Visualization */}
              <div className="flex items-start gap-6">
                {/* Origin */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-400 uppercase tracking-wider">
                        Origin
                      </p>
                      <p className="font-medium text-white">
                        {shipment.origin.city}, {shipment.origin.state}
                      </p>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-surface-300">{shipment.origin.street}</p>
                    <p className="text-surface-400 text-sm">
                      {shipment.origin.city}, {shipment.origin.state}{' '}
                      {shipment.origin.zipCode}
                    </p>
                    <p className="text-surface-400 text-sm">{shipment.origin.country}</p>
                    <div className="mt-3 pt-3 border-t border-surface-700/50 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={14} className="text-surface-500" />
                        <span className="text-surface-300">
                          {shipment.origin.contactName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-surface-500" />
                        <span className="text-surface-300">
                          {shipment.origin.contactPhone}
                        </span>
                      </div>
                      {shipment.origin.contactEmail && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-surface-500" />
                          <span className="text-surface-300">
                            {shipment.origin.contactEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex flex-col items-center pt-12">
                  <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500" />
                  <Truck
                    size={24}
                    className="text-surface-400 -mt-3 bg-surface-900 px-2"
                  />
                </div>

                {/* Destination */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-400 uppercase tracking-wider">
                        Destination
                      </p>
                      <p className="font-medium text-white">
                        {shipment.destination.city}, {shipment.destination.state}
                      </p>
                    </div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-surface-300">{shipment.destination.street}</p>
                    <p className="text-surface-400 text-sm">
                      {shipment.destination.city}, {shipment.destination.state}{' '}
                      {shipment.destination.zipCode}
                    </p>
                    <p className="text-surface-400 text-sm">
                      {shipment.destination.country}
                    </p>
                    <div className="mt-3 pt-3 border-t border-surface-700/50 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={14} className="text-surface-500" />
                        <span className="text-surface-300">
                          {shipment.destination.contactName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-surface-500" />
                        <span className="text-surface-300">
                          {shipment.destination.contactPhone}
                        </span>
                      </div>
                      {shipment.destination.contactEmail && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} className="text-surface-500" />
                          <span className="text-surface-300">
                            {shipment.destination.contactEmail}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Special Instructions */}
          {shipment.specialInstructions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-amber-400" />
                Special Instructions
              </h2>
              <p className="text-surface-300">{shipment.specialInstructions}</p>
            </motion.div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Shipment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Box size={20} className="text-purple-400" />
              Package Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-700/50">
                <span className="text-surface-400">Weight</span>
                <span className="text-white font-medium">
                  {shipment.weight.toFixed(2)} lbs
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-700/50">
                <span className="text-surface-400">Dimensions</span>
                <span className="text-white font-medium">
                  {shipment.dimensions.length}" × {shipment.dimensions.width}" ×{' '}
                  {shipment.dimensions.height}"
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-700/50">
                <span className="text-surface-400">Carrier</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <Truck size={16} className="text-surface-500" />
                  {shipment.carrier}
                </span>
              </div>
              {shipment.vehicleId && (
                <div className="flex items-center justify-between py-3 border-b border-surface-700/50">
                  <span className="text-surface-400">Vehicle ID</span>
                  <span className="text-white font-mono text-sm">
                    {shipment.vehicleId}
                  </span>
                </div>
              )}
              {shipment.assignedDriver && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-surface-400">Driver</span>
                  <span className="text-white font-medium">
                    {shipment.assignedDriver}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Cost & Insurance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-400" />
              Cost Summary
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-700/50">
                <span className="text-surface-400">Shipping Cost</span>
                <span className="text-white font-medium">
                  ${shipment.cost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-surface-700/50">
                <span className="text-surface-400 flex items-center gap-2">
                  <Shield size={14} />
                  Insurance
                </span>
                <span className="text-white font-medium">
                  ${shipment.insurance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-surface-300 font-medium">Total</span>
                <span className="text-xl font-bold gradient-text">
                  ${(shipment.cost + shipment.insurance).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-cyan-400" />
              Timeline
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-surface-400 text-sm">Estimated Delivery</p>
                  <p className="text-white font-medium">
                    {formatDate(shipment.estimatedDelivery)}
                  </p>
                </div>
              </div>
              {shipment.actualDelivery && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-surface-400 text-sm">Actual Delivery</p>
                    <p className="text-white font-medium">
                      {formatDate(shipment.actualDelivery)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Audit Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-4"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-surface-500 text-xs">Created By</p>
                <p className="text-surface-300">{shipment.createdBy?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Last Updated By</p>
                <p className="text-surface-300">
                  {shipment.lastUpdatedBy?.fullName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Created At</p>
                <p className="text-surface-300">{formatDateTime(shipment.createdAt)}</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs">Updated At</p>
                <p className="text-surface-300">{formatDateTime(shipment.updatedAt)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Update Status</h2>
            <div className="space-y-2">
              {Object.values(ShipmentStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    shipment.status === status
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      status
                    )}`}
                  >
                    {status.replace(/_/g, ' ')}
                  </span>
                  {shipment.status === status && (
                    <CheckCircle2 size={18} className="text-blue-400" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              className="w-full mt-4 btn-secondary"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ShipmentDetail;

