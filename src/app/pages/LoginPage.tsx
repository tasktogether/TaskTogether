import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Heart, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!form.email || !form.password) {
    setError('Please fill in all fields.');
    return;
  }

  setIsLoading(true);

  (window as any).__LOGIN_PASSWORD__ = form.password;

const result = await login(form.email, 'volunteer');

  setIsLoading(false);

  if (!result.success) {
    setError(result.message || 'Login failed');
    return;
  }

  // Always go to dashboard
  navigate('/volunteer-dashboard');
};

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FCE7F3 0%, #E9D5FF 50%, #BFDBFE 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative bubbles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '5%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(109,40,217,0.07)' }} />
        <div className="animate-float2" style={{ position: 'absolute', bottom: '15%', right: '8%', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(191,219,254,0.5)' }} />
        <div className="animate-float3" style={{ position: 'absolute', top: '40%', right: '3%', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(252,231,243,0.7)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(109,40,217,0.3)'
            }}>
              <Heart size={24} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '28px', fontWeight: 600, color: '#6D28D9' }}>
              TaskTogether
            </span>
          </Link>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b', marginTop: '8px' }}>
            Welcome back, volunteer! 💜
          </p>
        </div>

        <div className="tt-card animate-scale-in" style={{ padding: '40px' }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '28px', fontWeight: 600, color: '#1e1b4b', marginBottom: '8px', textAlign: 'center' }}>
            Volunteer Login
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#94a3b8', textAlign: 'center', marginBottom: '32px' }}>
            Sign in to access your dashboard and opportunities
          </p>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '12px',
              padding: '14px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'flex-start', gap: '10px'
            }} className="animate-fade-in">
              <AlertCircle size={18} color="#E53E3E" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#E53E3E', lineHeight: 1.5 }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                className="tt-input"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError(''); }}
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                  Password
                </label>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#6D28D9', fontWeight: 500 }}
                  onClick={() => alert('💌 Please contact admin@tasktogether.org to reset your password.')}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className="tt-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
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
                    cursor: 'pointer', color: '#94a3b8', padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="tt-btn-primary"
              disabled={isLoading}
              style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '14px', opacity: isLoading ? 0.8 : 1 }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: '24px', background: '#F5F3FF', borderRadius: '12px',
            padding: '14px 16px', border: '1px solid #E9D5FF'
          }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#6D28D9', fontWeight: 600, marginBottom: '6px' }}>
              🎯 Demo — Try these approved accounts:
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#64748b' }}>
              Email: <strong>liam@example.com</strong> or <strong>olivia@example.com</strong><br />
              Password: <strong>Password123</strong>
            </p>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#94a3b8' }}>
              Don't have an account?{' '}
              <Link to="/#register" style={{ color: '#6D28D9', fontWeight: 600, textDecoration: 'none' }}
                onClick={() => { setTimeout(() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
              >
                Apply to volunteer →
              </Link>
            </p>
          </div>
        </div>

        {/* Admin link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/admin" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}>
            Staff admin login →
          </Link>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
