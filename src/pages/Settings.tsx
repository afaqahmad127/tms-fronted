import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    department: user?.department || '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    shipmentUpdates: true,
    delayAlerts: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-surface-400">Manage your account preferences and settings</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="glass-card rounded-2xl p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                    : 'text-surface-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-surface-700/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User size={36} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{user?.fullName}</h3>
                  <p className="text-surface-400">{user?.role}</p>
                  <button className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, firstName: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, lastName: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      className="input-field pl-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-2">
                    Department
                  </label>
                  <select
                    value={profileData.department}
                    onChange={(e) =>
                      setProfileData({ ...profileData, department: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Dispatch">Dispatch</option>
                    <option value="Management">Management</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  {
                    key: 'emailAlerts',
                    label: 'Email Alerts',
                    description: 'Receive important alerts via email',
                  },
                  {
                    key: 'shipmentUpdates',
                    label: 'Shipment Updates',
                    description: 'Get notified when shipment status changes',
                  },
                  {
                    key: 'delayAlerts',
                    label: 'Delay Alerts',
                    description: 'Receive alerts when shipments are delayed',
                  },
                  {
                    key: 'weeklyReports',
                    label: 'Weekly Reports',
                    description: 'Receive weekly performance summaries',
                  },
                  {
                    key: 'marketingEmails',
                    label: 'Marketing Emails',
                    description: 'Receive news and promotional content',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4 border-b border-surface-700/50 last:border-0"
                  >
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-surface-400 text-sm">{item.description}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications],
                        })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-blue-500'
                          : 'bg-surface-600'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications]
                            ? 'translate-x-7'
                            : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                          size={18}
                        />
                        <input
                          type="password"
                          className="input-field pl-11"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                          size={18}
                        />
                        <input
                          type="password"
                          className="input-field pl-11"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                          size={18}
                        />
                        <input
                          type="password"
                          className="input-field pl-11"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-700/50">
                  <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                  <p className="text-surface-400 mb-4">
                    Add an extra layer of security to your account by enabling two-factor
                    authentication.
                  </p>
                  <button className="btn-secondary flex items-center gap-2">
                    <Shield size={18} />
                    Enable 2FA
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Appearance Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['Dark', 'Light', 'System'].map((theme) => (
                      <button
                        key={theme}
                        className={`p-4 glass rounded-xl text-center transition-all ${
                          theme === 'Dark'
                            ? 'bg-blue-500/20 border border-blue-500/50'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                        <span className="text-white font-medium">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-700/50">
                  <h3 className="text-lg font-medium text-white mb-4">Language</h3>
                  <div className="max-w-xs">
                    <div className="relative">
                      <Globe
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                        size={18}
                      />
                      <select className="input-field pl-11">
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-700/50">
                  <h3 className="text-lg font-medium text-white mb-4">Accent Color</h3>
                  <div className="flex gap-3">
                    {[
                      'from-blue-500 to-purple-600',
                      'from-emerald-500 to-cyan-600',
                      'from-orange-500 to-red-600',
                      'from-pink-500 to-rose-600',
                      'from-violet-500 to-purple-600',
                    ].map((gradient, i) => (
                      <button
                        key={i}
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} ${
                          i === 0 ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-900' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

