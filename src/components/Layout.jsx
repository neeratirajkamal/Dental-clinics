import React, { useState } from 'react';
import {
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  Stethoscope,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { ProfileSettings } from './ProfileSettings';
import { useLocation } from 'react-router-dom';

export const Layout = ({
  children,
  role,
  setRole,
  messages = [],
  notifications = [],
  setNotifications,
  userProfile,
  setUserProfile,
  onResetIdentity,
  onOpenMessaging
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const unreadCount = messages.filter(m => m.role === role && !m.read).length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/portal' || path === '/') return 'Dashboard';
    const name = path.substring(1).split('/')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const roles = [
    { id: 'doctor', label: 'Doctor', icon: Stethoscope },
    { id: 'patient', label: 'Patient', icon: User },
  ];

  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/book';

  if (isLandingPage) {
    return (
      <div className="layout-container landing-view">
        <main className="main-content-fluid">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={`layout-container ${isSidebarCollapsed ? 'collapsed-mode' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Sidebar
          role={role}
          userProfile={userProfile}
          onResetIdentity={onResetIdentity}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          unreadCount={unreadCount}
          onOpenMessaging={onOpenMessaging}
        />
      </div>

      <main className="main-content">
        <header className="main-header glass">
          <div className="header-left">
            <button
              className="mobile-toggle"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>
            <div className="title-stack">
              <h2 className="page-title">{getPageTitle()}</h2>
              <p className="header-date hide-mobile">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="header-right">
            <div className="search-bar hide-tablet">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search anything..." />
            </div>

            <div className="header-actions">
              <div className="role-selector-container">
                <div className="role-pill glass" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  {(() => {
                    const activeRole = roles.find(r => r.id === role);
                    const Icon = activeRole?.icon;
                    return Icon ? <Icon size={16} className="role-icon" /> : null;
                  })()}
                  <span className="role-label hide-mobile">{role === 'doctor' ? 'Admin' : 'Patient'}</span>
                  <ChevronDown size={14} className={`chevron ${isProfileOpen ? 'rotate' : ''}`} />
                </div>

                {isProfileOpen && (
                  <div className="role-dropdown card animate-pop">
                    <p className="dropdown-hint">Switch Perspective</p>
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        className={`role-opt ${role === r.id ? 'active' : ''}`}
                        onClick={() => {
                          setRole(r.id);
                          setIsProfileOpen(false);
                        }}
                      >
                        <r.icon size={16} />
                        <span>{r.label} View</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="notification-container">
                <button
                  className={`icon-btn notification-btn ${isNotifOpen ? 'active' : ''}`}
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && <span className="notification-dot"></span>}
                </button>

                {isNotifOpen && (
                  <div className="notification-dropdown card animate-pop">
                    <div className="notif-header">
                      <h3>Clinical Alerts</h3>
                      <button className="text-btn" onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>Mark all read</button>
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 ? (
                        <div className="empty-notifs">No new alerts.</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                            <div className={`notif-brand-icon ${n.type}`} />
                            <div className="notif-body">
                              <span className="notif-title">{n.title}</span>
                              <p className="notif-msg">{n.message}</p>
                              <span className="notif-time">{n.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="user-profile-header hide-mobile" onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }}>
                <div className="avatar">{userProfile?.name?.[0]?.toUpperCase() || 'U'}</div>
              </div>
            </div>
          </div>
        </header>

        <ProfileSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={userProfile}
          onUpdate={setUserProfile}
          onDelete={onResetIdentity}
        />

        <div className="content-area page-enter">
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .layout-container { display: flex; min-height: 100vh; background: var(--bg-main); }
        
        .sidebar-wrapper { width: var(--sidebar-width); height: 100vh; position: sticky; top: 0; left: 0; z-index: 1000; transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s; background: white; }
        .sidebar-wrapper.collapsed { width: var(--sidebar-collapsed-width); }
        
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; padding: 20px; }
        
        .main-header { height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--glass-border); margin: 12px; border-radius: 16px; margin-top: 12px; }
        
        .header-left { display: flex; align-items: center; gap: 16px; }
        .mobile-toggle { display: none; color: var(--text-main); background: #f1f5f9; padding: 8px; border-radius: 12px; transition: all 0.2s; }
        .mobile-toggle:hover { background: #e2e8f0; color: var(--primary); }
        .page-title { font-size: 22px; font-weight: 850; color: var(--text-main); letter-spacing: -0.5px; }
        .header-date { font-size: 12px; color: var(--text-muted); font-weight: 600; }
        .title-stack { display: flex; flex-direction: column; }
        
        .header-right { display: flex; align-items: center; gap: 24px; }
        .search-bar { display: flex; align-items: center; gap: 10px; background: #f1f5f9; padding: 8px 16px; border-radius: 12px; width: 280px; }
        .search-bar input { border: none; background: transparent; outline: none; font-size: 14px; width: 100%; color: var(--text-main); }
        .search-icon { color: var(--text-muted); }
        
        .header-actions { display: flex; align-items: center; gap: 16px; }
        
        .role-selector-container { position: relative; }
        .role-pill { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 40px; cursor: pointer; border: 1px solid var(--glass-border); background: white; transition: all 0.2s; }
        .role-pill:hover { border-color: var(--primary); }
        .role-icon { color: var(--primary); }
        .role-label { font-size: 14px; font-weight: 600; color: var(--text-main); }
        .chevron { color: var(--text-muted); transition: transform 0.2s; }
        .chevron.rotate { transform: rotate(180deg); }
        
        .role-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 180px; padding: 8px; z-index: 1000; box-shadow: var(--shadow-lg); }
        .dropdown-hint { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; padding: 8px 12px 4px; letter-spacing: 0.5px; }
        .role-opt { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted); transition: all 0.2s; }
        .role-opt:hover { background: #f1f5f9; color: var(--primary); }
        .role-opt.active { background: rgba(13, 148, 136, 0.08); color: var(--primary); }
        
        .icon-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: var(--text-muted); position: relative; transition: all 0.2s; }
        .icon-btn.active { background: #f1f5f9; color: var(--primary); }
        
        .notification-container { position: relative; }
        .notification-dropdown { position: absolute; top: calc(100% + 12px); right: 0; width: 320px; max-height: 400px; overflow-y: auto; z-index: 1000; box-shadow: var(--shadow-lg); border-radius: 20px; background: white; border: 1px solid var(--glass-border); display: flex; flex-direction: column; }
        .notif-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .notif-header h3 { font-size: 15px; font-weight: 800; color: var(--text-main); margin: 0; }
        .notif-list { display: flex; flex-direction: column; }
        .notif-item { display: flex; gap: 14px; padding: 16px 20px; border-bottom: 1px solid #f8fafc; transition: background 0.2s; cursor: pointer; }
        .notif-item:hover { background: #f8fafc; }
        .notif-item.unread { background: rgba(13, 148, 136, 0.03); }
        .notif-brand-icon { width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; background: #f1f5f9; position: relative; }
        .notif-brand-icon.info { background: #dcfce7; }
        .notif-brand-icon.calendar { background: #dbeafe; }
        .notif-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .notif-title { font-size: 13px; font-weight: 700; color: var(--text-main); }
        .notif-msg { font-size: 12px; color: var(--text-muted); margin: 0; line-height: 1.4; }
        .notif-time { font-size: 10px; color: var(--text-muted); margin-top: 4px; font-weight: 600; }
        .empty-notifs { padding: 40px; text-align: center; color: var(--text-muted); font-size: 14px; }
        
        .notification-dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: var(--secondary); border: 2px solid white; border-radius: 50%; }
        
        .user-profile-header .avatar { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        
        .content-area { padding: 12px 20px 20px; }

        .animate-pop { animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 1024px) {
          .sidebar-wrapper { position: fixed; transform: translateX(-100%); width: 280px; box-shadow: 20px 0 50px rgba(0,0,0,0.1); }
          .sidebar-wrapper.open { transform: translateX(0); }
          .sidebar-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(4px); z-index: 999; }
          .mobile-toggle { display: block; }
          .main-header { padding: 0 16px; margin: 8px; height: 64px; }
          .content-area { padding: 8px 16px 24px; }
          .hide-tablet { display: none; }
        }

        @media (max-width: 640px) {
          .role-label, .hide-mobile { display: none; }
          .role-pill { padding: 8px 12px; }
          .page-title { font-size: 18px; }
          .header-actions { gap: 12px; }
          .main-header { height: 60px; }
        }
      ` }} />
    </div>
  );
};
