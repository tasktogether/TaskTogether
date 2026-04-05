import { useState } from 'react';
import { CheckCircle, XCircle, Play, FileText, Mail, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp, Volunteer } from '../../context/AppContext';

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const { updateVolunteerStatus } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [actionTaken, setActionTaken] = useState<'approved' | 'rejected' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    updateVolunteerStatus(volunteer.id, 'approved');
    setActionTaken('approved');
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 500));
    updateVolunteerStatus(volunteer.id, 'rejected');
    setActionTaken('rejected');
    setIsProcessing(false);
  };

  if (actionTaken) {
    return (
      <div style={{
        padding: '20px 24px', borderRadius: '16px',
        background: actionTaken === 'approved' ? '#D1FAE5' : '#FEE2E2',
        border: `1px solid ${actionTaken === 'approved' ? '#86EFAC' : '#FCA5A5'}`,
        display: 'flex', alignItems: 'center', gap: '12px'
      }} className="animate-fade-in">
        {actionTaken === 'approved'
          ? <CheckCircle size={20} color="#16A34A" />
          : <XCircle size={20} color="#DC2626" />
        }
        <div>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: actionTaken === 'approved' ? '#15803d' : '#991B1B' }}>
            {volunteer.name} has been {actionTaken === 'approved' ? 'approved ✅' : 'rejected'}
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {actionTaken === 'approved'
              ? 'They can now log in and browse opportunities.'
              : 'Application has been moved to rejected list.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tt-card" style={{ overflow: 'hidden' }}>
      {/* Card header */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#fff',
          flexShrink: 0
        }}>
          {volunteer.name[0]}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b4b' }}>
              {volunteer.name}
            </h3>
            {volunteer.age < 18 && (
              <span style={{
                background: '#EEF2FF', color: '#4338CA', borderRadius: '8px',
                padding: '2px 8px', fontFamily: "'Poppins', sans-serif", fontSize: '11px', fontWeight: 600
              }}>
                Minor (under 18)
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b' }}>
              <Mail size={13} /> {volunteer.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b' }}>
              <User size={13} /> Age {volunteer.age}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8' }}>
              <Clock size={13} /> Applied {new Date(volunteer.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#F8F7FF', border: '1px solid #E9D5FF', borderRadius: '10px',
              padding: '8px 14px', cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 500, color: '#6D28D9',
              transition: 'background 0.2s ease',
            }}
          >
            Details {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '10px',
              padding: '8px 14px', cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#DC2626',
              transition: 'all 0.2s ease',
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            <XCircle size={15} />
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#6D28D9', border: 'none', borderRadius: '10px',
              padding: '8px 18px', cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#fff',
              transition: 'all 0.2s ease',
              opacity: isProcessing ? 0.6 : 1,
              boxShadow: '0 4px 12px rgba(109,40,217,0.3)',
            }}
          >
            {isProcessing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Processing...
              </span>
            ) : (
              <><CheckCircle size={15} /> Approve</>
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          padding: '0 24px 24px', borderTop: '1px solid #F1F5F9'
        }} className="animate-fade-in">
          <div style={{ paddingTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Guardian info */}
            {volunteer.age < 18 && volunteer.guardianName && (
              <div style={{ background: '#EEF2FF', borderRadius: '14px', padding: '18px', border: '1px solid #C7D2FE' }}>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 700, color: '#4338CA', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  👤 Guardian Information
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#334155' }}>
                    <strong>Name:</strong> {volunteer.guardianName}
                  </p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#334155' }}>
                    <strong>Email:</strong> {volunteer.guardianEmail}
                  </p>
                </div>
              </div>
            )}

            {/* Video */}
            <div style={{ background: '#F5F3FF', borderRadius: '14px', padding: '18px', border: '1px solid #E9D5FF' }}>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 700, color: '#6D28D9', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🎥 Introduction Video
              </p>
              {volunteer.videoFileName ? (
                <div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155', marginBottom: '10px' }}>
                    File: <strong>{volunteer.videoFileName}</strong>
                  </p>
                  <button
                    onClick={() => alert(`🎥 Video playback: "${volunteer.videoFileName}"\n\nIn a full implementation, this would stream the uploaded video.`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: '#6D28D9', border: 'none', borderRadius: '10px',
                      padding: '8px 16px', cursor: 'pointer',
                      fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#fff',
                    }}
                  >
                    <Play size={14} fill="#fff" />
                    Watch Video
                  </button>
                </div>
              ) : (
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                  No video uploaded
                </p>
              )}
            </div>

            {/* Consent form */}
            {volunteer.age < 18 && (
              <div style={{ background: '#FFFBEB', borderRadius: '14px', padding: '18px', border: '1px solid #FDE68A' }}>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📄 Parental Consent Form
                </p>
                <button
                  onClick={() => alert('📄 Consent form download would start here.')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: '#F59E0B', border: 'none', borderRadius: '10px',
                    padding: '8px 16px', cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#fff',
                  }}
                >
                  <FileText size={14} />
                  Download Form
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminPendingPage() {
  const { volunteers } = useApp();
  const pending = volunteers.filter(v => v.status === 'pending');

  return (
    <div style={{ padding: '36px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
          Pending Applications ⏳
        </h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b' }}>
          Review and approve or reject volunteer applications carefully.
        </p>
      </div>

      {/* Stats bar */}
      <div style={{
        background: '#FFFBEB', borderRadius: '14px', padding: '16px 24px',
        border: '1px solid #FDE68A', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <span style={{ fontSize: '20px' }}>⏳</span>
        <div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', fontWeight: 700, color: '#92400E' }}>
            {pending.length} application{pending.length !== 1 ? 's' : ''} awaiting your review
          </span>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#a16207', marginTop: '2px' }}>
            Each application is carefully reviewed before approval.
          </p>
        </div>
      </div>

      {pending.length === 0 ? (
        <div className="tt-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '8px' }}>
            All caught up!
          </h3>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8' }}>
            No pending applications right now. Check back later!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pending.map(v => (
            <VolunteerCard key={v.id} volunteer={v} />
          ))}
        </div>
      )}
    </div>
  );
}
