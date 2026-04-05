import { useState } from 'react';
import { Mail, User, BookOpen, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp, Volunteer } from '../../context/AppContext';

export default function AdminApprovedPage() {
  const { volunteers, opportunities, updateVolunteerStatus } = useApp();
  const [search, setSearch] = useState('');
  const [deactivating, setDeactivating] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const approved = volunteers.filter(v => v.status === 'approved').filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeactivate = async (v: Volunteer) => {
    if (confirmed !== v.id) {
      setConfirmed(v.id);
      return;
    }
    setDeactivating(v.id);
    await new Promise(r => setTimeout(r, 500));
    updateVolunteerStatus(v.id, 'rejected');
    setDeactivating(null);
    setConfirmed(null);
  };

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
          Approved Volunteers ✅
        </h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b' }}>
          Manage your active volunteer community.
        </p>
      </div>

      {/* Search + count */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="tt-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search volunteers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{
          background: '#D1FAE5', color: '#065F46', borderRadius: '20px',
          padding: '8px 16px', fontFamily: "'Poppins', sans-serif",
          fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap'
        }}>
          {approved.length} active volunteer{approved.length !== 1 ? 's' : ''}
        </span>
      </div>

      {approved.length === 0 ? (
        <div className="tt-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '8px' }}>
            {search ? 'No matches found' : 'No approved volunteers yet'}
          </h3>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8' }}>
            {search ? 'Try a different search term.' : 'Approve pending applications to see them here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {approved.map(v => {
            const assignedOpps = opportunities.filter(o => v.assignedOpportunities.includes(o.id));
            const isConfirming = confirmed === v.id;

            return (
              <div key={v.id} className="tt-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #A7F3D0, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#fff',
                    flexShrink: 0
                  }}>
                    {v.name[0]}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b4b' }}>
                        {v.name}
                      </h3>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', padding: '2px 8px', fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: 600 }}>
                        <CheckCircle size={10} />
                        Approved
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b' }}>
                        <Mail size={13} /> {v.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b' }}>
                        <User size={13} /> Age {v.age}
                      </span>
                    </div>

                    {/* Assigned opportunities */}
                    {assignedOpps.length > 0 ? (
                      <div>
                        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BookOpen size={12} /> ASSIGNED OPPORTUNITIES
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {assignedOpps.map(opp => (
                            <span key={opp.id} style={{
                              background: '#F5F3FF', color: '#6D28D9',
                              border: '1px solid #E9D5FF', borderRadius: '8px',
                              padding: '4px 10px', fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 500
                            }}>
                              {opp.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                        No opportunities joined yet
                      </p>
                    )}
                  </div>

                  {/* Deactivate button */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    {isConfirming && (
                      <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#EF4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={12} /> Click again to confirm
                      </p>
                    )}
                    <button
                      onClick={() => handleDeactivate(v)}
                      disabled={deactivating === v.id}
                      style={{
                        background: isConfirming ? '#EF4444' : '#F8F7FF',
                        border: `1px solid ${isConfirming ? '#EF4444' : '#E9D5FF'}`,
                        borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600,
                        color: isConfirming ? '#fff' : '#94a3b8',
                        transition: 'all 0.2s ease',
                        opacity: deactivating === v.id ? 0.6 : 1,
                      }}
                    >
                      {deactivating === v.id ? 'Deactivating...' : isConfirming ? 'Confirm Deactivate' : 'Deactivate'}
                    </button>
                    {isConfirming && (
                      <button onClick={() => setConfirmed(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#94a3b8' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
