import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, Eye, EyeOff, LogIn, AlertCircle, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminLoginPage() {
  const { loginAdmin, isAdminLoggedIn } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAdminLoggedIn) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter your credentials.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const success = loginAdmin(form.email, form.password);
    setIsLoading(false);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #E9D5FF 50%, #F0F9FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Subtle bubbles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-float" style={{ position: 'absolute', top: '8%', right: '8%', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(109,40,217,0.06)' }} />
        <div className="animate-float2" style={{ position: 'absolute', bottom: '10%', left: '6%', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(191,219,254,0.4)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #6D28D9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(79,70,229,0.3)'
            }}>
              <Heart size={24} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '28px', fontWeight: 600, color: '#4F46E5' }}>
              TaskTogether
            </span>
          </Link>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
            Staff Administration Portal
          </p>
        </div>

        <div className="tt-card animate-scale-in" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(79,70,229,0.15)'
            }}>
              <Shield size={28} color="#4F46E5" />
            </div>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '26px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
              Admin Login
            </h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#94a3b8' }}>
              Senior center staff access only
            </p>
          </div>

          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '12px',
              padding: '14px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'flex-start', gap: '10px'
            }} className="animate-fade-in">
              <AlertCircle size={18} color="#E53E3E" style={{ flexShrink: 0 }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#E53E3E' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Admin Email
              </label>
              <input
                className="tt-input"
                type="email"
                placeholder="admin@tasktogether.org"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError(''); }}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="tt-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Admin password"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'transparent', border: 'none',
                    cursor: 'pointer', color: '#94a3b8'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px', borderRadius: '14px', border: 'none', cursor: isLoading ? 'wait' : 'pointer',
                background: 'linear-gradient(135deg, #4F46E5, #6D28D9)', color: '#fff',
                fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 600,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div style={{ marginTop: '20px', background: '#F5F3FF', borderRadius: '12px', padding: '14px 16px', border: '1px solid #E9D5FF' }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#6D28D9', fontWeight: 600, marginBottom: '4px' }}>
              🔐 Demo Admin Credentials:
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#64748b' }}>
              Email: <strong>admin@tasktogether.org</strong><br />
              Password: <strong>Admin123!</strong>
            </p>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}>
              ← Volunteer Login
            </Link>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
