import { useNavigate } from 'react-router';
import { Clock, CheckCircle, XCircle, Users, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminOverviewPage() {
  const { volunteers, opportunities } = useApp();
  const navigate = useNavigate();

  const pending = volunteers.filter(v => v.status === 'pending');
  const approved = volunteers.filter(v => v.status === 'approved');
  const rejected = volunteers.filter(v => v.status === 'rejected');

  const stats = [
    {
      label: 'Total Volunteers', value: volunteers.length,
      icon: <Users size={22} color="#6D28D9" />, bg: '#F5F3FF',
      iconBg: '#E9D5FF', change: '+3 this week', changeColor: '#22C55E',
    },
    {
      label: 'Pending Review', value: pending.length,
      icon: <Clock size={22} color="#D97706" />, bg: '#FFFBEB',
      iconBg: '#FDE68A', change: 'Needs attention', changeColor: '#D97706',
      action: () => navigate('/admin/pending'),
    },
    {
      label: 'Approved', value: approved.length,
      icon: <CheckCircle size={22} color="#16A34A" />, bg: '#F0FDF4',
      iconBg: '#A7F3D0', change: 'Active volunteers', changeColor: '#16A34A',
      action: () => navigate('/admin/approved'),
    },
    {
      label: 'Rejected', value: rejected.length,
      icon: <XCircle size={22} color="#DC2626" />, bg: '#FFF5F5',
      iconBg: '#FED7D7', change: 'Not approved', changeColor: '#DC2626',
    },
    {
      label: 'Opportunities', value: opportunities.length,
      icon: <Briefcase size={22} color="#2563EB" />, bg: '#EFF6FF',
      iconBg: '#BFDBFE', change: 'Active listings', changeColor: '#2563EB',
      action: () => navigate('/admin/opportunities'),
    },
  ];

  const recentApplicants = [...volunteers]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  const statusConfig = {
    pending:  { label: 'Pending',  bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
    approved: { label: 'Approved', bg: '#D1FAE5', color: '#065F46', dot: '#22C55E' },
    rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
  };

  return (
    <div style={{ padding: '36px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
          Dashboard Overview 📊
        </h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b' }}>
          Welcome back! Here's what's happening at TaskTogether today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            className="tt-card"
            style={{ padding: '24px', cursor: stat.action ? 'pointer' : 'default' }}
            onClick={stat.action}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              {stat.action && <ArrowRight size={16} color="#94a3b8" />}
            </div>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '38px', fontWeight: 600, color: '#1e1b4b', lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#64748b', marginTop: '6px', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: stat.changeColor, fontWeight: 600 }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Applications */}
        <div className="tt-card" style={{ padding: '28px', gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b4b' }}>
              Recent Applicants
            </h2>
            <button
              onClick={() => navigate('/admin/pending')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#6D28D9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View pending <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentApplicants.map(v => {
              const sc = statusConfig[v.status];
              return (
                <div key={v.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px', borderRadius: '12px', background: '#F8F7FF',
                  border: '1px solid #F1EFF9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: 600, color: '#fff',
                      flexShrink: 0
                    }}>
                      {v.name[0]}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1e1b4b' }}>
                        {v.name}
                      </p>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#94a3b8' }}>
                        Age {v.age} · {new Date(v.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color,
                    borderRadius: '20px', padding: '4px 10px',
                    fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions + Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Approval rate */}
          <div className="tt-card" style={{ padding: '28px' }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#6D28D9" />
              Application Breakdown
            </h2>
            {[
              { label: 'Pending', count: pending.length, total: volunteers.length, color: '#F59E0B' },
              { label: 'Approved', count: approved.length, total: volunteers.length, color: '#22C55E' },
              { label: 'Rejected', count: rejected.length, total: volunteers.length, color: '#EF4444' },
            ].map((bar, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                    {bar.label}
                  </span>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                    {bar.count}/{bar.total}
                  </span>
                </div>
                <div style={{ background: '#F1F5F9', borderRadius: '6px', height: '8px' }}>
                  <div style={{
                    width: bar.total > 0 ? `${(bar.count / bar.total) * 100}%` : '0%',
                    height: '100%', borderRadius: '6px',
                    background: bar.color, transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="tt-card" style={{ padding: '28px' }}>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b4b', marginBottom: '16px' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: `Review ${pending.length} pending application${pending.length !== 1 ? 's' : ''}`, icon: '⏳', path: '/admin/pending', color: '#FFFBEB', border: '#FDE68A' },
                { label: 'Add new opportunity', icon: '➕', path: '/admin/opportunities', color: '#EFF6FF', border: '#BFDBFE' },
                { label: 'View approved volunteers', icon: '✅', path: '/admin/approved', color: '#F0FDF4', border: '#A7F3D0' },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px', borderRadius: '12px', cursor: 'pointer',
                    background: action.color, border: `1px solid ${action.border}`,
                    fontFamily: "'Poppins', sans-serif", fontSize: '14px',
                    fontWeight: 500, color: '#334155', textAlign: 'left',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(4px)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)'}
                >
                  <span style={{ fontSize: '18px' }}>{action.icon}</span>
                  {action.label}
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
