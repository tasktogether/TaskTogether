import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Menu, X, Heart, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentVolunteer, logoutVolunteer } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutVolunteer();
    navigate('/');
  };

  const scrollToRegister = () => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/#register');
    } else {
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Opportunities', to: '/opportunities' },
  ];

  return (
    <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E9D5FF', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Heart size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '24px',
            fontWeight: 600,
            color: '#6D28D9',
            letterSpacing: '-0.3px'
          }}>
            TaskTogether
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '15px',
                fontWeight: 500,
                color: location.pathname === link.to ? '#6D28D9' : '#334155',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                background: location.pathname === link.to ? '#F3E8FF' : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
          {currentVolunteer ? (
            <>
              <Link to="/dashboard" style={{
                fontFamily: "'Poppins', sans-serif", fontSize: '15px', fontWeight: 500,
                color: location.pathname === '/dashboard' ? '#6D28D9' : '#334155',
                textDecoration: 'none', padding: '8px 16px', borderRadius: '10px',
                background: location.pathname === '/dashboard' ? '#F3E8FF' : 'transparent',
              }}>
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 500,
                  color: '#94a3b8', background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: '8px 12px', borderRadius: '10px',
                  transition: 'color 0.2s ease',
                }}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{
              fontFamily: "'Poppins', sans-serif", fontSize: '15px', fontWeight: 500,
              color: location.pathname === '/login' ? '#6D28D9' : '#334155',
              textDecoration: 'none', padding: '8px 16px', borderRadius: '10px',
              background: location.pathname === '/login' ? '#F3E8FF' : 'transparent',
            }}>
              Volunteer Login
            </Link>
          )}
          <button onClick={scrollToRegister} className="tt-btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }}>
            Apply Now ✨
          </button>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6D28D9', padding: '8px' }}
          className="md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid #E9D5FF',
          padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: '8px'
        }} className="md:hidden">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 500,
                color: '#334155', textDecoration: 'none', padding: '12px 16px',
                borderRadius: '12px', background: '#F8F7FF',
              }}
            >
              {link.label}
            </Link>
          ))}
          {currentVolunteer ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{
                fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 500,
                color: '#334155', textDecoration: 'none', padding: '12px 16px',
                borderRadius: '12px', background: '#F8F7FF',
              }}>
                My Dashboard
              </Link>
              <button onClick={handleLogout} style={{
                fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 500,
                color: '#94a3b8', background: '#F8F7FF', border: 'none', cursor: 'pointer',
                padding: '12px 16px', borderRadius: '12px', textAlign: 'left',
              }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{
              fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 500,
              color: '#334155', textDecoration: 'none', padding: '12px 16px',
              borderRadius: '12px', background: '#F8F7FF',
            }}>
              Volunteer Login
            </Link>
          )}
          <button onClick={scrollToRegister} className="tt-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            Apply Now ✨
          </button>
        </div>
      )}
    </header>
  );
}
