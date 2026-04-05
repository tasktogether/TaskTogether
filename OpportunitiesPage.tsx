import { useState } from 'react';
import { MapPin, Clock, Users, Tag, Search, Filter, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Errands':       { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  'Technology':    { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  'Outdoor':       { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  'Companionship': { bg: '#FCE7F3', text: '#9D174D', border: '#FBCFE8' },
  'Transportation':{ bg: '#EEF2FF', text: '#3730A3', border: '#C7D2FE' },
};

export default function OpportunitiesPage() {
  const { opportunities, currentVolunteer, applyForOpportunity } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const categories = ['All', ...Array.from(new Set(opportunities.map(o => o.category)))];

  const filtered = opportunities.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase()) ||
      o.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || o.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleApply = (opportunityId: string) => {
    if (!currentVolunteer) {
      navigate('/login');
      return;
    }
    applyForOpportunity(currentVolunteer.id, opportunityId);
    setAppliedIds(prev => new Set([...prev, opportunityId]));
  };

  const isApplied = (opportunityId: string) =>
    appliedIds.has(opportunityId) ||
    currentVolunteer?.assignedOpportunities.includes(opportunityId);

  const isFull = (o: { currentVolunteers: number; volunteerLimit: number }) =>
    o.currentVolunteers >= o.volunteerLimit;

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFF' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #E9D5FF 0%, #BFDBFE 100%)',
        padding: '60px 24px 50px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.7)', borderRadius: '20px',
            padding: '8px 18px', marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(109,40,217,0.1)'
          }}>
            <Sparkles size={14} color="#6D28D9" />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#6D28D9' }}>
              Make a Difference Today
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(36px, 5vw, 54px)',
            fontWeight: 700, color: '#1e1b4b', marginBottom: '16px'
          }}>
            Volunteer Opportunities 🌟
          </h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '17px', color: '#475569', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Browse available opportunities and find the perfect way to serve your community. Each opportunity is a chance to create a real connection.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Filters */}
        <div className="tt-card" style={{
          padding: '24px', marginBottom: '36px',
          display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="tt-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search opportunities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Filter size={16} color="#6D28D9" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 500,
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: categoryFilter === cat ? '2px solid #6D28D9' : '2px solid #E9D5FF',
                  background: categoryFilter === cat ? '#6D28D9' : '#fff',
                  color: categoryFilter === cat ? '#fff' : '#6D28D9',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b' }}>
            <strong style={{ color: '#334155' }}>{filtered.length}</strong> opportunit{filtered.length === 1 ? 'y' : 'ies'} found
          </p>
          {!currentVolunteer && (
            <div style={{
              background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>💜</span>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#9A3412' }}>
                <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#C2410C', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                  Log in
                </button> to express interest in opportunities
              </span>
            </div>
          )}
        </div>

        {/* Opportunities Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '8px' }}>
              No opportunities found
            </h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8' }}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
            {filtered.map(opp => {
              const colors = CATEGORY_COLORS[opp.category] || { bg: '#F3E8FF', text: '#6D28D9', border: '#E9D5FF' };
              const full = isFull(opp);
              const applied = isApplied(opp.id);
              const spotsLeft = opp.volunteerLimit - opp.currentVolunteers;

              return (
                <div key={opp.id} className="tt-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {/* Category badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{
                      fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 600,
                      padding: '5px 12px', borderRadius: '20px',
                      background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`
                    }}>
                      <Tag size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {opp.category}
                    </span>
                    {full ? (
                      <span style={{
                        fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 600,
                        padding: '5px 12px', borderRadius: '20px', background: '#FEE2E2', color: '#DC2626',
                        border: '1px solid #FECACA'
                      }}>
                        Full
                      </span>
                    ) : (
                      <span style={{
                        fontFamily: "'Poppins', sans-serif", fontSize: '12px', fontWeight: 600,
                        padding: '5px 12px', borderRadius: '20px', background: '#D1FAE5', color: '#065F46',
                        border: '1px solid #A7F3D0'
                      }}>
                        {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b4b', marginBottom: '10px' }}>
                    {opp.title}
                  </h3>

                  {/* Description */}
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#64748b', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>
                    {opp.description}
                  </p>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="#6D28D9" />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>{opp.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="#6D28D9" />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>{opp.timeCommitment}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} color="#6D28D9" />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        {opp.currentVolunteers}/{opp.volunteerLimit} volunteers
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: '#F1F5F9', borderRadius: '6px', height: '6px', marginBottom: '20px' }}>
                    <div style={{
                      width: `${Math.min(100, (opp.currentVolunteers / opp.volunteerLimit) * 100)}%`,
                      height: '100%', borderRadius: '6px',
                      background: full ? '#EF4444' : 'linear-gradient(90deg, #6D28D9, #8B5CF6)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>

                  {/* CTA Button */}
                  {applied ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '12px', borderRadius: '12px', background: '#F0FDF4', border: '2px solid #86EFAC'
                    }}>
                      <span style={{ fontSize: '16px' }}>✅</span>
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
                        Interest Expressed!
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(opp.id)}
                      disabled={full}
                      className={full ? '' : 'tt-btn-primary'}
                      style={{
                        width: '100%', justifyContent: 'center', fontSize: '14px',
                        padding: '12px',
                        ...(full ? {
                          background: '#F1F5F9', color: '#94a3b8', borderRadius: '12px',
                          border: 'none', cursor: 'not-allowed', fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                        } : {}),
                      }}
                    >
                      {full ? 'No Spots Available' : (
                        <>Express Interest <ArrowRight size={15} /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA if not logged in */}
        {!currentVolunteer && (
          <div style={{
            marginTop: '60px', background: 'linear-gradient(135deg, #E9D5FF, #BFDBFE)',
            borderRadius: '24px', padding: '48px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💜</div>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '28px', fontWeight: 600, color: '#1e1b4b', marginBottom: '12px' }}>
              Ready to Get Started?
            </h3>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#475569', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
              Apply to become a TaskTogether volunteer and start making a difference in the lives of seniors in your community.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { window.scrollTo(0, 0); navigate('/'); setTimeout(() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="tt-btn-primary" style={{ fontSize: '15px' }}>
                Apply Now 🌟
              </button>
              <button onClick={() => navigate('/login')} className="tt-btn-secondary" style={{ fontSize: '15px' }}>
                Volunteer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
