import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer style={{ background: '#1e1b4b', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <Heart size={20} color="#E9D5FF" fill="#E9D5FF" />
          <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#E9D5FF' }}>
            TaskTogether
          </span>
        </div>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
          "Serving Seniors. Together."
        </p>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
          Contact: tasktogethercontact@gmail.com
        </p>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#475569' }}>
          © 2026 TaskTogether. Created by i2 scholar Kaitlyn Cleaveland
        </p>
      </div>
    </footer>
  );
}

const ApplicationReceived: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #F5F0FF 100%)', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div
          className="tt-card"
          style={{
            width: '100%',
            maxWidth: '720px',
            padding: '48px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle size={42} color="#fff" />
          </div>

          <h1
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 600,
              color: '#1e1b4b',
              marginBottom: '14px',
              lineHeight: 1.2,
            }}
          >
            Your application has been submitted successfully!
          </h1>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '16px',
              color: '#64748b',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto 28px',
            }}
          >
            Thank you for applying to volunteer with Richmond Senior Center through TaskTogether.
          </p>

          <div
            style={{
              background: '#FAFAFF',
              border: '1px solid #E9D5FF',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'left',
              maxWidth: '580px',
              margin: '0 auto 32px',
            }}
          >
            <h2
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '22px',
                fontWeight: 600,
                color: '#6D28D9',
                marginBottom: '18px',
                textAlign: 'center',
              }}
            >
              What happens next?
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#6D28D9', marginTop: '8px', flexShrink: 0 }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  The admin at the Richmond Senior Center will review your application.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#6D28D9', marginTop: '8px', flexShrink: 0 }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  You will receive an approval or rejection email after your application is reviewed.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#6D28D9', marginTop: '8px', flexShrink: 0 }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  If approved, you will set your password through the email link before logging in.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '9999px', background: '#6D28D9', marginTop: '8px', flexShrink: 0 }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  Until then, you will need to wait for approval before you can log in.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              className="tt-btn-primary"
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              Return to Home
            </button>

            <button
              onClick={() => navigate('/opportunities')}
              className="tt-btn-secondary"
              style={{ padding: '12px 24px', fontSize: '15px' }}
            >
              View Opportunities
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationReceived;
