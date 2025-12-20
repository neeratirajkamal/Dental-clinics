import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Activity,
  ShoppingBag,
  MessageCircle,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Sidebar = ({ role, userProfile, onResetIdentity, isCollapsed, toggleCollapse, unreadCount = 0, onOpenMessaging }) => {

  const doctorItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/portal' },
    { icon: Activity, label: 'Doctors', path: '/doctors' },
    { icon: Users, label: 'Patients', path: '/patients' },
    { icon: Calendar, label: 'Appointments', path: '/appointments' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const patientItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/portal' },
    { icon: ShoppingBag, label: 'Check Services', path: '/services' },
    { icon: Calendar, label: 'My Bookings', path: '/appointments' },
    { icon: ShieldCheck, label: 'My Records', path: '/patients' },
    { icon: FileText, label: 'Statements', path: '/reports' },
    { icon: MessageCircle, label: 'Messages', path: '/messages', badge: unreadCount }, // New Item
    { icon: Settings, label: 'Account', path: '/settings' },
  ];

  const navItems = role === 'doctor' ? doctorItems : patientItems;

  return (
    <aside className={`sidebar glass ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-pulse-box">
            <Activity size={20} color="white" />
          </div>
          <span className={`logo-text ${isCollapsed ? 'fade-out' : 'fade-in'}`}>
            Medi<span className="text-accent">Sync</span>
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isMessaging = item.path === '/messages';

          const sharedProps = {
            key: `${role}-${item.path}-${item.label}`,
            className: `nav-item`,
            title: item.label,
            onClick: isMessaging ? (e) => {
              e.preventDefault();
              onOpenMessaging?.();
            } : undefined
          };

          const content = (
            <>
              <div className="icon-wrapper">
                <item.icon size={20} className="nav-icon" />
                {item.badge > 0 && isCollapsed && <span className="mini-badge" />}
              </div>

              <span className={`nav-label ${isCollapsed ? 'fade-out' : 'fade-in'}`}>{item.label}</span>

              {item.badge > 0 && !isCollapsed && (
                <span className="badge-pill">{item.badge}</span>
              )}

              {!item.badge && (
                <ChevronRight size={16} className={`nav-chevron ${isCollapsed ? 'hidden' : ''}`} />
              )}
            </>
          );

          if (isMessaging) {
            return (
              <button {...sharedProps} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                {content}
              </button>
            );
          }

          return (
            <NavLink
              {...sharedProps}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {content}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className={`user-profile ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="user-avatar">{userProfile?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className={`user-info ${isCollapsed ? 'fade-out hidden' : 'fade-in'}`}>
            <span className="user-name">{userProfile?.name || 'Clinic Admin'}</span>
            <span className="user-role">{role === 'doctor' ? 'Clinical Admin' : 'Patient'}</span>
          </div>
          {!isCollapsed && (
            <button className="logout-btn-sidebar" title="Log Out">
              <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
            </button>
          )}
        </div>

        <div className="footer-actions">
          <button className="collapse-btn" onClick={toggleCollapse} title={isCollapsed ? "Expand" : "Collapse"}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button className={`logout-btn ${isCollapsed ? 'small' : ''}`} onClick={onResetIdentity} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .sidebar { width: 100%; height: 100%; display: flex; flex-direction: column; padding: 24px 16px; border-right: 1px solid var(--glass-border); background: white; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); overflow: hidden; }
        .sidebar.collapsed { padding: 24px 12px; }
        
        .sidebar-header { padding: 8px 4px 32px; height: 80px; }
        .logo-container { display: flex; align-items: center; gap: 12px; height: 40px; }
        .logo-icon { width: 40px; height: 40px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3); flex-shrink: 0; transition: all 0.3s; }
        .logo-text { font-size: 20px; font-weight: 700; color: #000000; white-space: nowrap; transition: opacity 0.2s, transform 0.2s; transform-origin: left; }
        .text-accent { color: var(--primary); }
        
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .nav-item { display: flex; align-items: center; padding: 12px 16px; border-radius: 12px; color: var(--text-muted); transition: all 0.3s; gap: 12px; position: relative; height: 48px; }
        .sidebar.collapsed .nav-item { padding: 12px 0; justify-content: center; }
        
        .nav-item:hover { background: #f8fafc; color: var(--primary); transform: translateX(4px); }
        .sidebar.collapsed .nav-item:hover { transform: none; background: rgba(13, 148, 136, 0.1); }
        
        .nav-item.active { background: var(--primary); color: white; box-shadow: 0 8px 20px rgba(13, 148, 136, 0.2); }
        .nav-item.active::after { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 4px; background: white; border-radius: 0 4px 4px 0; transition: opacity 0.2s; }
        .sidebar.collapsed .nav-item.active::after { display: none; }
        
        .icon-wrapper { position: relative; display: flex; align-items: center; justify-content: center; }
        .nav-icon { flex-shrink: 0; transition: transform 0.3s; }
        .nav-item:hover .nav-icon { transform: scale(1.1); }
        
        .nav-label { font-size: 15px; font-weight: 600; flex: 1; white-space: nowrap; opacity: 1; transition: opacity 0.2s; }
        
        .badge-pill { background: #ef4444; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; min-width: 20px; text-align: center; }
        .mini-badge { position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid white; }
        
        .nav-chevron { opacity: 0; transition: all 0.3s; transform: translateX(-10px); }
        .nav-item:hover .nav-chevron { opacity: 0.5; transform: translateX(0); }
        .nav-item.active .nav-chevron { opacity: 0; }
        
        /* Collapse States */
        .fade-out { opacity: 0; width: 0; pointer-events: none; overflow: hidden; }
        .fade-in { opacity: 1; width: auto; pointer-events: auto; }
        .hidden { display: none; }
        
        .sidebar-footer { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 16px; }
        .user-profile { display: flex; align-items: center; gap: 12px; min-width: 0; transition: all 0.3s; }
        .justify-center { justify-content: center; }
        
        .user-avatar { width: 36px; height: 36px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: var(--text-main); flex-shrink: 0; }
        .user-info { display: flex; flex-direction: column; white-space: nowrap; overflow: hidden; }
        .user-name { font-size: 14px; font-weight: 600; color: var(--text-main); }
        .user-role { font-size: 12px; color: var(--text-muted); }
        
        .footer-actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .sidebar.collapsed .footer-actions { flex-direction: column-reverse; gap: 12px; }
        
        .collapse-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: var(--text-muted); background: #f1f5f9; transition: all 0.2s; }
        .collapse-btn:hover { background: #e2e8f0; color: var(--text-main); }
        
        .logout-btn { color: var(--text-muted); transition: color 0.2s ease; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; }
        .logout-btn:hover { color: #ef4444; background: #fee2e2; border-radius: 8px; }
        
        @media (max-width: 1024px) {
          .collapse-btn { display: none; } /* No manual collapse inside mobile drawer */
        }
      ` }} />
    </aside>
  );
};
