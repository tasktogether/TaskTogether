import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Star, Users, ChevronDown, Upload, FileText, CheckCircle, X, ArrowRight, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── Success Popup ───────────────────────────────────────────────────────────
function SuccessPopup({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(109,40,217,0.15)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '24px'
    }}>
      <div className="tt-card" style={{
        maxWidth: '460px', width: '100%', padding: '48px 40px',
        textAlign: 'center', position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: '#F3E8FF', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={16} color="#6D28D9" />
        </button>

        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <CheckCircle size={40} color="#fff" />
        </div>

        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '28px', fontWeight: 600, color: '#6D28D9', marginBottom: '12px' }}>
          Thank You!
        </h2>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#334155', marginBottom: '8px', lineHeight: 1.6 }}>
          Your application is on its way!
        </p>
        <div style={{
          background: '#FEF3C7', borderRadius: '12px', padding: '16px',
          marginBottom: '28px', border: '1px solid #FDE68A'
        }}>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#92400E', fontWeight: 500 }}>
            Status: <strong>Pending Admin Approval</strong>
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#92400E', marginTop: '4px' }}>
            We'll reach out to you via email once reviewed!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onClose} className="tt-btn-primary" style={{ fontSize: '14px', padding: '10px 24px' }}>
            Back to Home
          </button>
          <button onClick={() => navigate('/opportunities')} className="tt-btn-secondary" style={{ fontSize: '14px', padding: '10px 24px' }}>
            Browse Opportunities
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Registration Section ────────────────────────────────────────────────────
function RegistrationSection() {
  const { addVolunteer } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '',
    guardianName: '', guardianEmail: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'age') {
      const numAge = parseInt(value);
      setIsMinor(!isNaN(numAge) && numAge < 18);
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    const age = parseInt(form.age);
    if (!form.age || isNaN(age) || age < 13 || age > 25) newErrors.age = 'Age must be between 13 and 25';
    if (isMinor) {
      if (!form.guardianName.trim()) newErrors.guardianName = 'Guardian name is required for applicants under 18';
      if (!form.guardianEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guardianEmail)) newErrors.guardianEmail = 'Valid guardian email is required';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    addVolunteer({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      age: parseInt(form.age),
      guardianName: isMinor ? form.guardianName.trim() : null,
      guardianEmail: isMinor ? form.guardianEmail.trim() : null,
      videoFileName: videoFileName,
    });
    setShowSuccess(true);
    setForm({ name: '', email: '', password: '', age: '', guardianName: '', guardianEmail: '' });
    setVideoFileName(null);
    setIsMinor(false);
    setErrors({});
  };

  return (
    <>
      {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
      <section id="register" style={{ background: 'linear-gradient(180deg, #fff 0%, #F5F0FF 100%)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#F3E8FF', borderRadius: '20px', padding: '8px 20px', marginBottom: '20px'
            }}>
              <Star size={16} color="#6D28D9" />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#6D28D9' }}>Join the Team</span>
            </div>
            <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '40px', fontWeight: 600, color: '#1e1b4b', marginBottom: '12px' }}>
              Apply to Volunteer
            </h2>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#64748b', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
              Ready to make a difference? Fill out the form below and we'll review your application with care.
            </p>
          </div>

          <div className="tt-card" style={{ padding: '40px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Full Name */}
              <div>
                <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Full Name *
                </label>
                <input
                  className="tt-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                />
                {errors.name && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '6px', fontFamily: "'Poppins', sans-serif" }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Email Address *
                </label>
                <input
                  className="tt-input"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
                {errors.email && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '6px', fontFamily: "'Poppins', sans-serif" }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Create a Password *
                </label>
                <input
                  className="tt-input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                />
                {errors.password && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '6px', fontFamily: "'Poppins', sans-serif" }}>{errors.password}</p>}
              </div>

              {/* Age */}
              <div>
                <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Age *
                </label>
                <input
                  className="tt-input"
                  type="number"
                  placeholder="Your age (13–25)"
                  min={13} max={25}
                  value={form.age}
                  onChange={e => handleChange('age', e.target.value)}
                  style={{ maxWidth: '200px' }}
                />
                {errors.age && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '6px', fontFamily: "'Poppins', sans-serif" }}>{errors.age}</p>}
              </div>

              {/* Guardian Fields (conditional) */}
              {isMinor && (
                <div style={{
                  background: '#EEF2FF', borderRadius: '16px', padding: '24px',
                  border: '1px solid #C7D2FE', display: 'flex', flexDirection: 'column', gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: '#6D28D9', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={14} color="#fff" />
                    </div>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#4338CA' }}>
                      Parent/Guardian Information Required
                    </p>
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                      Guardian Full Name *
                    </label>
                    <input
                      className="tt-input"
                      type="text"
                      placeholder="Parent or guardian's name"
                      value={form.guardianName}
                      onChange={e => handleChange('guardianName', e.target.value)}
                    />
                    {errors.guardianName && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '6px', fontFamily: "'Poppins', sans-serif" }}>{errors.guardianName}</p>}
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                      Guardian Email *
                    </label>
                    <input
                      className="tt-input"
                      type="email"
                      placeholder="guardian@email.com"
                      value={form.guardianEmail}
                      onChange={e => handleChange('guardianEmail', e.target.value)}
                    />
                    {errors.guardianEmail && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '6px', fontFamily: "'Poppins', sans-serif" }}>{errors.guardianEmail}</p>}
                  </div>
                </div>
              )}

              {/* Video Upload */}
              <div>
                <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Introduction Video <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional but encouraged)</span>
                </label>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#64748b', marginBottom: '12px', lineHeight: 1.6 }}>
                  Record a short 1-2 minute video introducing yourself and sharing why you want to volunteer. This helps us get to know you better.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={e => setVideoFileName(e.target.files?.[0]?.name || null)}
                />
                {videoFileName ? (
                  <div style={{
                    background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '12px',
                    padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle size={18} color="#16a34a" />
                      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#15803d', fontWeight: 500 }}>
                        {videoFileName}
                      </span>
                    </div>
                    <button type="button" onClick={() => setVideoFileName(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%', padding: '20px', border: '2px dashed #C4B5FD',
                      borderRadius: '12px', background: '#FAFAFF', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#6D28D9';
                      (e.currentTarget as HTMLButtonElement).style.background = '#F5F3FF';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#C4B5FD';
                      (e.currentTarget as HTMLButtonElement).style.background = '#FAFAFF';
                    }}
                  >
                    <Upload size={24} color="#6D28D9" />
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#6D28D9' }}>
                      Click to upload your video
                    </span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#94a3b8' }}>
                      MP4, MOV, AVI up to 100MB
                    </span>
                  </button>
                )}
              </div>

              {/* Parental Consent Download */}
              {isMinor && (
                <div style={{
                  background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#92400E' }}>
                      Parental Consent Form Required
                    </p>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#a16207', marginTop: '2px' }}>
                      Download, sign, and bring to your first session
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tt-btn-secondary"
                    style={{ fontSize: '13px', padding: '8px 16px', borderColor: '#FDE68A', color: '#92400E' }}
                    onClick={() => alert('Parental consent form download would start here. Please contact tasktogethercontact@gmail.com for the form.')}
                  >
                    <FileText size={15} />
                    Download Form
                  </button>
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="tt-btn-primary" style={{ fontSize: '16px', padding: '14px', justifyContent: 'center', width: '100%', borderRadius: '14px' }}>
                <Heart size={18} />
                Submit My Application
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Info Cards ──────────────────────────────────────────────────────────────
function InfoCards() {
  const cards = [
    {
      icon: Heart,
      title: 'Our Mission',
      description: 'We connect passionate teen volunteers with seniors in our community who need a helping hand — creating bonds that matter and memories that last.',
      color: '#F3E8FF',
      accent: '#6D28D9',
    },
    {
      icon: Star,
      title: 'Why It Matters',
      description: 'Loneliness is a growing challenge for seniors. Your time, energy, and kindness can completely change someone\'s day — and their life.',
      color: '#FCE7F3',
      accent: '#BE185D',
    },
    {
      icon: Users,
      title: 'Get Involved',
      description: 'Apply today, get approved, and start exploring opportunities near you. Every small act of service creates a big ripple of positive change.',
      color: '#DBEAFE',
      accent: '#1D4ED8',
    },
  ];

  return (
    <section style={{ background: '#FAFAFF', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '38px', fontWeight: 600, color: '#1e1b4b', marginBottom: '12px' }}>
            What We're All About
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#64748b', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            TaskTogether is more than volunteering — it's about building a community where every generation lifts each other up.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="tt-card"
                style={{ padding: '36px 32px' }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  background: card.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '20px'
                }}>
                  <Icon size={32} color={card.accent} />
                </div>
                <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '12px' }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b', lineHeight: 1.7 }}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ────────────────────────────────────────────────────────────
function StatsBanner() {
  const stats = [
    { value: '150+', label: 'Volunteers Registered' },
    { value: '300+', label: 'Hours Served' },
    { value: '80+', label: 'Seniors Helped' },
    { value: '5', label: 'Partner Centers' },
  ];

  return (
    <section style={{ background: 'linear-gradient(135deg, #6D28D9, #4F46E5)', padding: '60px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '42px', fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#DDD6FE', marginTop: '6px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollToRegister = () => {
    document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
  };
  const navigate = useNavigate();

  return (
    <section style={{
      background: 'linear-gradient(135deg, #FCE7F3 0%, #E9D5FF 50%, #BFDBFE 100%)',
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden', padding: '60px 24px',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '60px', alignItems: 'center', textAlign: 'center' }}>
          {/* Center content */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.9)', borderRadius: '20px',
              padding: '8px 18px', marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(109,40,217,0.12)'
            }}>
              <Star size={14} color="#6D28D9" fill="#6D28D9" />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#6D28D9' }}>
                Teens Helping Seniors Thrive
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: 'clamp(42px, 6vw, 68px)',
              fontWeight: 700,
              color: '#1e1b4b',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}>
              Small Acts.<br />
              <span style={{ color: '#6D28D9' }}>Big Impact.</span>
            </h1>

            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '18px',
              color: '#475569',
              lineHeight: 1.75,
              marginBottom: '36px',
              maxWidth: '600px',
              margin: '0 auto 36px'
            }}>
              TaskTogether connects passionate teen volunteers with seniors who need a helping hand. Together, we build a stronger, warmer community — one task at a time.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={scrollToRegister} className="tt-btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
                <Heart size={18} />
                Join as Volunteer
              </button>
              <button onClick={() => navigate('/opportunities')} className="tt-btn-secondary" style={{ fontSize: '16px', padding: '14px 32px' }}>
                Browse Opportunities
                <ArrowRight size={16} />
              </button>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginTop: '36px', justifyContent: 'center'
            }}>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#fff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: i === 1 ? '0' : '-8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid #fff'
                  }}>
                    <Heart size={16} color="#6D28D9" />
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                Join 150+ volunteers making a difference
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button
            onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '0 auto' }}
          >
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#6D28D9', fontWeight: 500 }}>Learn more</span>
            <ChevronDown size={20} color="#6D28D9" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    { text: "I helped Mrs. Eleanor learn how to video call her grandchildren for the first time. The look on her face was priceless!", name: "Mia T., Age 16", role: "Volunteer" },
    { text: "TaskTogether gave my daughter a structured, safe way to give back. We couldn't be more proud of her commitment.", name: "Jennifer K.", role: "Parent" },
    { text: "Having a young volunteer visit every week has completely changed my outlook. I feel so connected to the community again!", name: "Robert, Age 78", role: "Senior Participant" },
  ];

  return (
    <section style={{ background: '#fff', padding: '80px 24px' }} id="about-section">
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '38px', fontWeight: 600, color: '#1e1b4b', marginBottom: '12px' }}>
            Voices of Impact
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', color: '#64748b' }}>
            Real stories from our amazing community
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {quotes.map((q, i) => (
            <div key={i} className="tt-card" style={{ padding: '32px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', color: '#6D28D9', fontFamily: "'Fredoka', sans-serif" }}>"</div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#334155', lineHeight: 1.75, marginBottom: '20px', fontStyle: 'italic' }}>
                {q.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E9D5FF, #6D28D9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fredoka', sans-serif", fontSize: '18px', fontWeight: 600, color: '#fff'
                }}>
                  {q.name[0]}
                </div>
                <div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1e1b4b' }}>{q.name}</p>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#94a3b8' }}>{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Senior Home Application Section ─────────────────────────────────────────
function SeniorHomeSection() {
  const navigate = useNavigate();
  
  return (
    <section style={{ background: '#F8FAFC', padding: '60px 24px', borderTop: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="tt-card" style={{ 
          padding: '40px', 
          background: 'linear-gradient(135deg, #FEFCE8 0%, #FEF3C7 100%)',
          border: '2px solid #FDE68A'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Building2 size={28} color="#fff" />
            </div>
            
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h3 style={{ 
                fontFamily: "'Fredoka', sans-serif", 
                fontSize: '24px', 
                fontWeight: 600, 
                color: '#78350F',
                marginBottom: '8px' 
              }}>
                Are you a Senior Home?
              </h3>
              <p style={{ 
                fontFamily: "'Poppins', sans-serif", 
                fontSize: '15px', 
                color: '#92400E',
                lineHeight: 1.7,
                marginBottom: '20px'
              }}>
                Partner with TaskTogether to bring enthusiastic teen volunteers to your facility. Register your senior home to access our volunteer network and create meaningful connections for your residents.
              </p>
              
              <button 
                onClick={() => navigate('/register-senior-home')}
                style={{
                  background: '#F59E0B',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D97706';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F59E0B';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.25)';
                }}
              >
                <Building2 size={18} />
                Register Your Senior Home
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
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

// ─── Main Home Page ──────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <InfoCards />
      <StatsBanner />
      <Testimonials />
      <RegistrationSection />
      <SeniorHomeSection />
      <Footer />
    </div>
  );
}
