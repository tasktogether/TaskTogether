import { useState } from 'react';
import { Mail, User, Search, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminRejectedPage() {
  const { volunteers, updateVolunteerStatus } = useApp();
  const [search, setSearch] = useState('');
  const [restoring, setRestoring] = useState<string | null>(null);

  const rejected = volunteers.filter(v => v.status === 'rejected').filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRestore = async (id: string) => {
    setRestoring(id);
    await new Promise(r => setTimeout(r, 500));
    updateVolunteerStatus(id, 'pending');
    setRestoring(null);
  };

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
          Rejected Applications
        </h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b' }}>
          View rejected applications. You can restore them to pending if needed.
        </p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="tt-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search rejected applications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{
          background: '#FEE2E2', color: '#991B1B', borderRadius: '20px',
          padding: '8px 16px', fontFamily: "'Poppins', sans-serif",
          fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap'
        }}>
          {rejected.length} rejected
        </span>
      </div>

      {rejected.length === 0 ? (
        <div className="tt-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌟</div>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '8px' }}>
            {search ? 'No matches found' : 'No rejected applications'}
          </h3>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8' }}>
            {search ? 'Try a different search term.' : 'All applications have been approved or are pending review.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {rejected.map(v => (
            <div key={v.id} className="tt-card" style={{ padding: '24px', borderLeft: '4px solid #EF4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FEE2E2, #EF4444)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#fff',
                  flexShrink: 0
                }}>
                  {v.name[0]}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
                    {v.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b' }}>
                      <Mail size={13} /> {v.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b' }}>
                      <User size={13} /> Age {v.age}
                    </span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8' }}>
                      Applied {new Date(v.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRestore(v.id)}
                  disabled={restoring === v.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#F5F3FF', border: '1px solid #E9D5FF', borderRadius: '10px',
                    padding: '8px 16px', cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#6D28D9',
                    transition: 'all 0.2s ease', opacity: restoring === v.id ? 0.6 : 1,
                  }}
                >
                  <RotateCcw size={14} />
                  {restoring === v.id ? 'Restoring...' : 'Move to Pending'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
