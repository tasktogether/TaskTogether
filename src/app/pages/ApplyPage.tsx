import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle, ArrowLeft } from 'lucide-react';
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
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2 space-y-8 lg:sticky lg:top-32">
              <div>
                <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Heart size={14} className="fill-pink-700" />
                  Richmond Senior Center Volunteer Application
                </div>

                <h1 className="text-4xl font-fredoka font-bold text-slate-900 leading-tight mb-3">
                  Apply to Volunteer
                </h1>

                <p className="text-slate-600 leading-relaxed">
                  Help seniors at Richmond Senior Center on a schedule that works for you.
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
                  <a
                    href="mailto:tasktogethercontact@gmail.com"
                    className="underline hover:text-violet-900 transition-colors"
                  >
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

            <div className="lg:col-span-3">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
