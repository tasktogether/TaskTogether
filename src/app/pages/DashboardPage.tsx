import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Heart, LogOut, User, BookOpen, Search, CheckCircle,
  MapPin, Clock, Users, Settings, Bell, Star, ArrowRight, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { currentVolunteer, logoutVolunteer, opportunities, applyForOpportunity } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'profile'>('overview');
  const [profileForm, setProfileForm] = useState({ name: '', newPassword: '' });
  const [savedProfile, setSavedProfile] = useState(false);

  if (!currentVolunteer) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #FCE7F3, #E9D5FF)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px'
      }}>
        <div className="tt-card animate-scale-in" style={{ padding: '48px', textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '26px', fontWeight: 600, color: '#1e1b4b', marginBottom: '12px' }}>
            Access Required
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>
            You need to be logged in as an approved volunteer to view this page.
          </p>
          <button onClick={() => navigate('/login')} className="tt-btn-primary" style={{ fontSize: '15px' }}>
            <LogOut size={16} />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const myOpportunities = opportunities.filter(o => currentVolunteer.assignedOpportunities.includes(o.id));
  const availableOpportunities = opportunities.filter(o =>
    !currentVolunteer.assignedOpportunities.includes(o.id) &&
    o.currentVolunteers < o.volunteerLimit
  );

  const handleApply = (oppId: string) => {
    applyForOpportunity(currentVolunteer.id, oppId);
  };

  const handleLogout = () => {
    logoutVolunteer();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Star size={16} /> },
    { id: 'opportunities', label: 'Opportunities', icon: <BookOpen size={16} /> },
    { id: 'profile', label: 'Profile', icon: <Settings size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7FF' }}>
      {/* Dashboard Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6D28D9, #4F46E5)',
        padding: '32px 24px 80px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                border: '3px solid rgba(255,255,255,0.4)',
                fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#fff'
              }}>
                {currentVolunteer.name[0]}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '28px', fontWeight: 600, color: '#fff' }}>
                    Hi, {currentVolunteer.name.split(' ')[0]}! 👋
                  </h1>
                  <span style={{
                    background: '#22C55E', color: '#fff', borderRadius: '20px',
                    padding: '3px 10px', fontFamily: "'Poppins', sans-serif",
                    fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Shield size={10} />
                    Approved
                  </span>
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#DDD6FE' }}>
                  Ready to make a difference today? 💜
                </p>
              </div>
            </div>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px', padding: '10px 18px', cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 500, color: '#fff',
              transition: 'background 0.2s ease',
            }}>
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '32px' }}>
            {[
              { label: 'Opportunities Joined', value: myOpportunities.length, icon: '🎯', color: '#E9D5FF' },
              { label: 'Available to Join', value: availableOpportunities.length, icon: '🌟', color: '#BFDBFE' },
              { label: 'Service Status', value: 'Active', icon: '✅', color: '#D1FAE5' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.15)', borderRadius: '16px',
                padding: '16px 20px', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{stat.icon}</div>
                <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '26px', fontWeight: 600, color: '#fff' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#DDD6FE', marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab nav + content */}
      <div style={{ maxWidth: '1100px', margin: '-48px auto 0', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
        {/* Tabs */}
        <div className="tt-card" style={{ padding: '8px', marginBottom: '28px', display: 'inline-flex', gap: '4px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', border: 'none',
                fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600,
                transition: 'all 0.2s ease',
                background: activeTab === tab.id ? '#6D28D9' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-cols-1-mobile">
            {/* My Applications */}
            <div className="tt-card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="#6D28D9" />
                My Opportunities
              </h3>
              {myOpportunities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌱</div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#94a3b8' }}>
                    No opportunities joined yet. Explore the Opportunities tab!
                  </p>
                  <button onClick={() => setActiveTab('opportunities')} className="tt-btn-primary"
                    style={{ fontSize: '13px', padding: '10px 20px', marginTop: '16px' }}>
                    Browse Opportunities
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {myOpportunities.map(opp => (
                    <div key={opp.id} style={{
                      padding: '16px', borderRadius: '14px', background: '#F5F3FF',
                      border: '1px solid #E9D5FF'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '16px', fontWeight: 600, color: '#1e1b4b' }}>
                          {opp.title}
                        </h4>
                        <span style={{ background: '#D1FAE5', color: '#065F46', fontSize: '12px', fontFamily: "'Poppins', sans-serif", fontWeight: 600, padding: '3px 8px', borderRadius: '8px' }}>
                          Active
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#64748b' }}>
                          <MapPin size={11} /> {opp.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#64748b' }}>
                          <Clock size={11} /> {opp.timeCommitment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Summary */}
            <div className="tt-card" style={{ padding: '28px' }}>
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="#6D28D9" />
                My Profile
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Full Name', value: currentVolunteer.name },
                  { label: 'Email', value: currentVolunteer.email },
                  { label: 'Age', value: `${currentVolunteer.age} years old` },
                  { label: 'Applied On', value: new Date(currentVolunteer.appliedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                  ...(currentVolunteer.guardianName ? [{ label: 'Guardian', value: currentVolunteer.guardianName }] : []),
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8F7FF', borderRadius: '10px' }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155', fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('profile')} className="tt-btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px', fontSize: '14px' }}>
                <Settings size={15} />
                Edit Profile
              </button>
            </div>

            {/* Notifications */}
            <div className="tt-card" style={{ padding: '28px', gridColumn: 'span 2' }} >
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b4b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="#6D28D9" />
                Recent Updates
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '✅', message: `Welcome, ${currentVolunteer.name.split(' ')[0]}! Your application was approved. You can now browse and join opportunities.`, time: 'Account approved', color: '#D1FAE5', border: '#A7F3D0' },
                  { icon: '📋', message: 'New opportunities have been added this week. Check them out!', time: '2 days ago', color: '#EEF2FF', border: '#C7D2FE' },
                  { icon: '💜', message: 'Thank you for being part of the TaskTogether family! Your service matters.', time: '1 week ago', color: '#F5F3FF', border: '#E9D5FF' },
                ].map((notif, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    padding: '16px', borderRadius: '14px',
                    background: notif.color, border: `1px solid ${notif.border}`
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{notif.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{notif.message}</p>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div>
            {myOpportunities.length > 0 && (
              <div style={{ marginBottom: '36px' }}>
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '20px' }}>
                  ✅ Currently Joined
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {myOpportunities.map(opp => (
                    <div key={opp.id} className="tt-card" style={{ padding: '24px', borderTop: '4px solid #22C55E' }}>
                      <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1e1b4b', marginBottom: '10px' }}>
                        {opp.title}
                      </h4>
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '14px' }}>{opp.description}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                          <MapPin size={13} color="#6D28D9" /> {opp.location}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                          <Clock size={13} color="#6D28D9" /> {opp.timeCommitment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '20px' }}>
              🌟 Available Opportunities
            </h3>
            {availableOpportunities.length === 0 ? (
              <div className="tt-card" style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8' }}>
                  You've joined all available opportunities! Check back soon for more.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {availableOpportunities.map(opp => (
                  <div key={opp.id} className="tt-card" style={{ padding: '24px' }}>
                    <h4 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1e1b4b', marginBottom: '10px' }}>
                      {opp.title}
                    </h4>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>{opp.description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        <MapPin size={13} color="#6D28D9" /> {opp.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        <Clock size={13} color="#6D28D9" /> {opp.timeCommitment}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        <Users size={13} color="#6D28D9" /> {opp.currentVolunteers}/{opp.volunteerLimit} volunteers
                      </span>
                    </div>
                    <button onClick={() => handleApply(opp.id)} className="tt-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px' }}>
                      <Heart size={14} fill="#fff" />
                      Join This Opportunity
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '560px' }}>
            <div className="tt-card" style={{ padding: '36px' }}>
              <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '28px' }}>
                ⚙️ Profile Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <input
                    className="tt-input"
                    placeholder={currentVolunteer.name}
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    className="tt-input"
                    value={currentVolunteer.email}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Email cannot be changed. Contact admin for help.</p>
                </div>
                <div>
                  <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                    New Password <span style={{ fontWeight: 400, color: '#94a3b8' }}>(leave blank to keep current)</span>
                  </label>
                  <input
                    className="tt-input"
                    type="password"
                    placeholder="New password"
                    value={profileForm.newPassword}
                    onChange={e => setProfileForm(p => ({ ...p, newPassword: e.target.value }))}
                  />
                </div>

                {savedProfile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#D1FAE5', borderRadius: '10px', padding: '12px 16px' }} className="animate-fade-in">
                    <CheckCircle size={16} color="#15803d" />
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#15803d', fontWeight: 500 }}>
                      Profile updated successfully!
                    </span>
                  </div>
                )}

                <button
                  onClick={() => { setSavedProfile(true); setTimeout(() => setSavedProfile(false), 3000); }}
                  className="tt-btn-primary"
                  style={{ fontSize: '15px', justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
