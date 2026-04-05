import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, CheckCircle, ArrowLeft, Building2, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { RegistrationForm } from '../components/forms/RegistrationForm';

const perks = [
  'Flexible scheduling — after school, weekends, or summer',
  'Earn verified community service hours',
  'Build real-world experience and empathy',
  'Earn fun badges as you hit milestones',
  'Share your stories on the public blog',
];

export default function ApplyPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left: Info */}
            <div
              className="lg:col-span-2 space-y-8 lg:sticky lg:top-32"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Heart size={14} className="fill-pink-700" />
                  Volunteer Application
                </div>
                <h1 className="text-4xl font-fredoka font-bold text-slate-900 leading-tight mb-3">
                  Join TaskTogether
                </h1>
                <p className="text-slate-600 leading-relaxed">
                  Help seniors in your community — on your own schedule. All skill levels and backgrounds welcome!
                </p>
              </div>

              <div className="space-y-3">
                {perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-green-600" />
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{perk}</p>
                  </div>
                ))}
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-violet-800 mb-1">Questions?</p>
                <p className="text-sm text-violet-700 leading-relaxed">
                  Email us at{' '}
                  <a href="mailto:tasktogethercontact@gmail.com" className="underline hover:text-violet-900 transition-colors">
                    tasktogethercontact@gmail.com
                  </a>
                  . We typically respond within one business day.
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Volunteers under 18 will need a signed parental consent form.{' '}
                <Link to="/parental-consent" className="text-violet-500 hover:underline">
                  Learn more →
                </Link>
              </p>
            </div>

            {/* Right: Form */}
            <div
              className="lg:col-span-3"
            >
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>

      {/* Senior Home Section */}
      <div
        className="bg-slate-100 py-16 px-6 border-t border-slate-200"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 md:p-10 border-2 border-amber-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0 shadow-md">
                <Building2 size={28} className="text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-fredoka font-bold text-amber-900 mb-3">
                  Are you a Senior Home?
                </h3>
                <p className="text-amber-800 leading-relaxed mb-6">
                  Partner with TaskTogether to bring enthusiastic teen volunteers to your facility. Register your senior home to access our volunteer network and create meaningful connections for your residents.
                </p>
                
                <button 
                  onClick={() => navigate('/register-senior-home')}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Building2 size={18} />
                  Register Your Senior Home
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}