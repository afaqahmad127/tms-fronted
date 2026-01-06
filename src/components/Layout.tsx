import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Truck,
  Users,
  MapPin,
  FileText,
  HelpCircle,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  submenu?: { label: string; path: string }[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Shipments', path: '/shipments', icon: <Package size={20} /> },
    {
      label: 'Operations',
      icon: <Truck size={20} />,
      submenu: [
        { label: 'Fleet Management', path: '/fleet' },
        { label: 'Route Planning', path: '/routes' },
        { label: 'Driver Assignments', path: '/drivers' },
      ],
    },
    {
      label: 'Reports',
      icon: <FileText size={20} />,
      submenu: [
        { label: 'Performance', path: '/analytics' },
        { label: 'Cost Analysis', path: '/cost-analysis' },
        { label: 'Delivery Stats', path: '/delivery-stats' },
      ],
    },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    ...(isAdmin
      ? [{ label: 'Users', path: '/users', icon: <Users size={20} /> }]
      : []),
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const horizontalNavItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'All Shipments', path: '/shipments' },
    { label: 'In Transit', path: '/shipments?status=IN_TRANSIT' },
    { label: 'Delivered', path: '/shipments?status=DELIVERED' },
    { label: 'Flagged', path: '/shipments?flagged=true' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-pattern grid-pattern">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-72 glass-card z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center justify-between mb-8">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Truck className="text-white" size={22} />
                  </div>
                  <span className="text-xl font-bold gradient-text">TMS Pro</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.submenu ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                          }
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                            openSubmenu === item.label
                              ? 'bg-white/10 text-white'
                              : 'text-surface-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${
                              openSubmenu === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubmenu === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-4 mt-1"
                            >
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                    isActivePath(subItem.path)
                                      ? 'bg-primary-500/20 text-primary-400'
                                      : 'text-surface-400 hover:bg-white/5 hover:text-white'
                                  }`}
                                >
                                  <MapPin size={16} />
                                  <span className="text-sm">{subItem.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path!}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActivePath(item.path)
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                            : 'text-surface-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Help & Support */}
              <div className="mt-8 pt-6 border-t border-surface-700/50">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-surface-300 hover:bg-white/5 hover:text-white transition-all duration-200">
                  <HelpCircle size={20} />
                  <span className="font-medium">Help & Support</span>
                </button>
              </div>

              {/* User Profile */}
              <div className="mt-6 p-4 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{user?.fullName}</p>
                    <p className="text-xs text-surface-400">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass border-b border-surface-700/50">
          <div className="max-w-[1920px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo & Hamburger */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                >
                  <Menu size={24} />
                </button>
                <Link to="/dashboard" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Truck className="text-white" size={20} />
                  </div>
                  <span className="text-lg font-bold gradient-text hidden sm:inline">
                    TMS Pro
                  </span>
                </Link>
              </div>

              {/* Center: Horizontal Navigation (Desktop) */}
              <nav className="hidden lg:flex items-center gap-1">
                {horizontalNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname + location.search === item.path
                        ? 'bg-white/10 text-white'
                        : 'text-surface-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Right: Search, Notifications, Profile */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search shipments..."
                      className="w-64 pl-10 pr-4 py-2 bg-surface-800/50 border border-surface-600/50 rounded-xl text-sm text-white placeholder-surface-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <Bell size={20} className="text-surface-300" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-surface-700/50">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{user?.fullName}</p>
                    <p className="text-xs text-surface-400">{user?.role}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer">
                    <User size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-[1920px] mx-auto px-4 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

