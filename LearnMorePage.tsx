import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Clock, CheckCircle, Star, BookOpen, Smile, MapPin, ArrowRight, HelpCircle } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

const steps = [
  {
    number: '01',
    title: 'Apply Online',
    desc: 'Fill out a short application, record a brief intro video, and submit. It takes less than 10 minutes.',
    icon: '📋',
    color: 'bg-violet-50 border-violet-100',
    accent: 'text-violet-600',
  },
  {
    number: '02',
    title: 'Admin Review',
    desc: 'Our team at Richmond Senior Center reviews your application and verifies your consent forms.',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-100',
    accent: 'text-blue-600',
  },
  {
    number: '03',
    title: 'Browse Opportunities',
    desc: 'Once approved, log in to browse available tasks and pick the ones that fit your schedule.',
    icon: '🗓️',
    color: 'bg-pink-50 border-pink-100',
    accent: 'text-pink-600',
  },
  {
    number: '04',
    title: 'Make a Difference',
    desc: 'Complete tasks, log your reflections, earn badges, and optionally share your story publicly.',
    icon: '🌟',
    color: 'bg-orange-50 border-orange-100',
    accent: 'text-orange-600',
  },
];

const faqs = [
  {
    q: 'Who can volunteer with TaskTogether?',
    a: 'Anyone passionate about helping seniors! We welcome volunteers of all ages. Volunteers under 18 will need a signed parental consent form.',
  },
  {
    q: 'Is there a minimum time commitment?',
    a: 'Nope! We offer flexible opportunities — from one-time tasks on weekends to ongoing weekly commitments. You decide what works for you.',
  },
  {
    q: 'Are activities supervised?',
    a: 'Yes. All activities are coordinated through the Richmond Senior Center. Staff are available on-site for any in-person tasks.',
  },
  {
    q: 'Do I earn community service hours?',
    a: 'Absolutely. Every completed task is logged in your dashboard. You can export your hours for school, college applications, or other purposes.',
  },
  {
    q: 'What kinds of tasks are available?',
    a: 'Grocery runs, tech help, gardening, reading circles, letter writing, friendly visits, and more — all matched to your skills and interests.',
  },
  {
    q: 'How do I get parental consent if I\'m under 18?',
    a: 'Download the consent form from our Parental Consent page, have a parent or guardian sign it, and upload it during registration.',
  },
];

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-violet-50 via-white to-pink-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart size={16} className="fill-violet-700" />
              About TaskTogether
            </div>
            <h1 className="text-5xl md:text-6xl font-fredoka font-bold text-slate-900 mb-6">
              How It <span className="text-violet-600">Works</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              TaskTogether connects caring volunteers with seniors at the Richmond Senior Center. 
              Whether you have an hour a week or a full Saturday, we have a place for you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link to="/apply">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white border-none shadow-lg shadow-violet-200">
                  Apply Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button size="lg" variant="outline">Browse Opportunities</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-fredoka font-bold text-slate-900 mb-3">Why It Matters</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Volunteering with seniors creates real, lasting change — for them and for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Smile size={28} className="fill-pink-600" />, color: 'bg-pink-50 border-pink-100', iconBg: 'bg-pink-100 text-pink-600', title: 'Combat Loneliness', desc: 'Regular visits and companionship significantly improve mental health and happiness for isolated seniors.' },
              { icon: <Users size={28} className="fill-blue-600" />, color: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100 text-blue-600', title: 'Build Community', desc: 'Strengthen the fabric of Richmond by creating genuine intergenerational bonds and shared experiences.' },
              { icon: <Star size={28} className="fill-violet-600" />, color: 'bg-violet-50 border-violet-100', iconBg: 'bg-violet-100 text-violet-600', title: 'Grow as a Person', desc: 'Gain empathy, responsibility, and real-world experience that lasts long after your volunteer hours end.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`p-8 rounded-3xl border ${item.color}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-fredoka font-bold text-slate-900 mb-3">Your Journey</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Four simple steps from sign-up to making a real difference.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-8 rounded-3xl border-2 ${step.color} flex items-start gap-6`}
              >
                <div className="text-4xl shrink-0">{step.icon}</div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${step.accent}`}>Step {step.number}</p>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
            <Shield size={32} className="text-green-600" />
          </div>
          <h2 className="text-4xl font-fredoka font-bold text-slate-900 mb-4">Safety First, Always</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every volunteer is reviewed before activation. For volunteers under 18, parental consent is required. 
            All in-person activities are supervised by Richmond Senior Center staff.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: '✅', title: 'Background-Checked Process', desc: 'Applications reviewed by senior center staff before access is granted.' },
              { icon: '📝', title: 'Parental Consent Forms', desc: 'Required for all volunteers under 18. Download on our Parental Consent page.' },
              { icon: '👥', title: 'Supervised Activities', desc: 'In-person sessions are run with senior center staff present.' },
            ].map((item, i) => (
              <div key={i} className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <p className="text-2xl mb-3">{item.icon}</p>
                <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-100 rounded-2xl mb-4">
              <HelpCircle size={28} className="text-violet-600" />
            </div>
            <h2 className="text-4xl font-fredoka font-bold text-slate-900 mb-2">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <h4 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
                  <span className="text-violet-500 mt-0.5 shrink-0">Q.</span>
                  {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed pl-5">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-5xl mb-4">💜</p>
          <h2 className="text-4xl font-fredoka font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-violet-100 mb-8 text-lg leading-relaxed">
            Join our community of volunteers and start brightening someone's day — it only takes a few minutes to apply.
          </p>
          <Link to="/apply">
            <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 border-none shadow-lg font-bold px-10">
              Apply Now <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}