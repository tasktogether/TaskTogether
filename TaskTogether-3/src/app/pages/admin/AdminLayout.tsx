import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Clock, CheckCircle, XCircle,
  Briefcase, LogOut, Heart, Menu, X, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminLayout() {
  const { isAdminLoggedIn, logoutAdmin, volunteers } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) {
    navigate('/admin');
    return null;
  }

  const pendingCount = volunteers.filter(v => v.status === 'pending').length;
  const approvedCount = volunteers.filter(v => v.status === 'approved').length;
  const rejectedCount = volunteers.filter(v => v.status === 'rejected').length;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      badge: null,
    },
    {
      path: '/admin/pending',
      label: 'Pending Applications',
      icon: <Clock size={18} />,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: '#F59E0B',
    },
    {
      path: '/admin/approved',
      label: 'Approved Volunteers',
      icon: <CheckCircle size={18} />,
      badge: approvedCount > 0 ? approvedCount : null,
      badgeColor: '#22C55E',
    },
    {
      path: '/admin/rejected',
      label: 'Rejected',
      icon: <XCircle size={18} />,
      badge: rejectedCount > 0 ? rejectedCount : null,
      badgeColor: '#EF4444',
    },
    {
      path: '/admin/opportunities',
      label: 'Opportunities',
      icon: <Briefcase size={18} />,
      badge: null,
    },
  ];

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#fff', lineHeight: 1 }}>
                TaskTogether
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                Admin Portal
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center',
                gap: sidebarOpen ? '12px' : '0',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                padding: sidebarOpen ? '11px 14px' : '11px',
                borderRadius: '12px', textDecoration: 'none',
                background: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                transition: 'all 0.2s ease',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: isActive ? 600 : 500, flex: 1 }}>
                  {item.label}
                </span>
              )}
              {sidebarOpen && item.badge !== null && (
                <span style={{
                  background: item.badgeColor, color: '#fff',
                  borderRadius: '10px', padding: '2px 7px',
                  fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: 700,
                  minWidth: '20px', textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: sidebarOpen ? '12px' : '0',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            padding: sidebarOpen ? '11px 14px' : '11px',
            borderRadius: '12px', background: 'transparent',
            border: '1px solid transparent', cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7FF' }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '260px' : '72px',
          background: 'linear-gradient(180deg, #4F46E5 0%, #6D28D9 100%)',
          flexShrink: 0, transition: 'width 0.25s ease',
          position: 'sticky', top: 0, height: '100vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '4px 0 20px rgba(79,70,229,0.2)',
          zIndex: 40,
        }}
        className="hidden md:flex"
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute', right: '-12px', top: '72px',
            width: '24px', height: '24px', borderRadius: '50%',
            background: '#fff', border: '2px solid #E9D5FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.25s ease',
            transform: sidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            zIndex: 10,
          }}
        >
          <ChevronRight size={12} color="#6D28D9" />
        </button>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50 }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        style={{
          position: 'fixed', left: mobileSidebarOpen ? 0 : '-280px',
          top: 0, width: '260px', height: '100vh',
          background: 'linear-gradient(180deg, #4F46E5 0%, #6D28D9 100%)',
          transition: 'left 0.3s ease', zIndex: 60,
          display: 'flex', flexDirection: 'column',
          boxShadow: mobileSidebarOpen ? '4px 0 30px rgba(0,0,0,0.3)' : 'none',
        }}
        className="md:hidden"
      >
        <button
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.2)', border: 'none',
            borderRadius: '8px', padding: '6px', cursor: 'pointer',
            color: '#fff'
          }}
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile topbar */}
        <div style={{
          background: '#fff', borderBottom: '1px solid #E9D5FF',
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px'
        }} className="md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6D28D9' }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#6D28D9' }}>
            Admin Dashboard
          </span>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '0' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
