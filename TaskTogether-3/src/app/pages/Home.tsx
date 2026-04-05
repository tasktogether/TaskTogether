import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Users, Heart, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BubbleBackground } from '../components/background/BubbleBackground';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-slate-800 overflow-x-hidden relative">
      <Navbar />
      <BubbleBackground />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-lg border border-pink-200">
                <Star size={16} className="fill-pink-700" />
                Making a difference, together.
              </div>
              <h1 className="text-5xl md:text-7xl font-fredoka font-bold leading-tight text-slate-900 mb-6">
                Connecting <span className="text-violet-600 relative">
                  Volunteers
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-violet-200/50 -z-10 rounded-full" />
                </span> with <span className="text-blue-500 relative">
                  Seniors
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200/50 -z-10 rounded-full" />
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">
                Join a community of kind-hearted volunteers. Gain experience, make new friends, and brighten someone's day. Safe, organized, and open to all!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/apply">
                  <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Apply Now
                  </Button>
                </Link>
                <Link to="/learn-more">
                  <Button variant="outline" size="lg" className="border-2 hover:bg-purple-50 transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium h-12">
              {/* Placeholder for future social proof */}
            </div>
          </div>

          <div className="relative">
            {/* Empty placeholder - photo removed for professional design */}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-20 bg-white/50 backdrop-blur-sm relative">
        {/* Decorative background elements - static */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 border-2 relative overflow-hidden" hover>
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/50 rounded-bl-full" />
              <div className="w-14 h-14 bg-purple-200 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-lg relative z-10">
                <Heart size={28} className="fill-purple-600" />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To bridge the generational gap by fostering meaningful connections between dedicated volunteers and wise seniors.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 border-2 relative overflow-hidden" hover>
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/50 rounded-bl-full" />
              <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-lg relative z-10">
                <Star size={28} className="fill-blue-600" />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">Why It Matters</h3>
              <p className="text-slate-600 leading-relaxed">
                Combat loneliness, build community resilience, and teach responsibility through service and care.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 border-2 relative overflow-hidden" hover>
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200/50 rounded-bl-full" />
              <div className="w-14 h-14 bg-pink-200 rounded-2xl flex items-center justify-center text-pink-600 mb-6 shadow-lg relative z-10">
                <Users size={28} className="fill-pink-600" />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">Get Involved</h3>
              <p className="text-slate-600 leading-relaxed">
                Sign up, get verified, and start making a difference in your local neighborhood today.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 px-6 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white text-center relative overflow-hidden">
        {/* Decorative static shapes */}
        <div className="absolute top-5 left-10 w-16 h-16 border-4 border-white/30 rounded-full opacity-50" />
        <div className="absolute bottom-5 right-20 w-20 h-20 bg-white/10 rounded-lg opacity-50" />

        <h2 className="text-3xl font-fredoka font-bold mb-3 relative z-10">Ready to get started?</h2>
        <p className="text-violet-100 mb-6 max-w-xl mx-auto relative z-10">
          Volunteers of all ages and backgrounds welcome. Apply in minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Link to="/apply">
            <Button className="bg-white text-violet-700 hover:bg-violet-50 border-none shadow-lg font-bold px-8 hover:shadow-2xl transition-all duration-300">
              Apply Now
            </Button>
          </Link>
          <Link to="/learn-more">
            <Button variant="outline" className="border-2 border-white/60 text-white hover:bg-white/20 hover:text-white hover:border-white transition-all duration-300">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Your Journey Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-slate-900 mb-4">
              Your Journey with TaskTogether
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From application to making a difference — here's how it works
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Card className="bg-violet-50 border-violet-100 p-6 text-center h-full">
                <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Apply</h3>
                <p className="text-sm text-slate-600">
                  Fill out a quick application form and upload your consent documents
                </p>
              </Card>
            </div>

            <div>
              <Card className="bg-blue-50 border-blue-100 p-6 text-center h-full">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Get Approved</h3>
                <p className="text-sm text-slate-600">
                  Our team reviews your application and you'll receive an email confirmation
                </p>
              </Card>
            </div>

            <div>
              <Card className="bg-pink-50 border-pink-100 p-6 text-center h-full">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Choose Tasks</h3>
                <p className="text-sm text-slate-600">
                  Browse opportunities and pick tasks that match your schedule and interests
                </p>
              </Card>
            </div>

            <div>
              <Card className="bg-green-50 border-green-100 p-6 text-center h-full">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Make Impact</h3>
                <p className="text-sm text-slate-600">
                  Complete tasks, share reflections, and build meaningful connections
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}