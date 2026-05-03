import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BubbleBackground } from '../components/background/BubbleBackground';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import logo from '../../assets/rsc-logo.png';
import { supabase } from '../../lib/supabase.ts';

export default function Home() {
const [announcements, setAnnouncements] = React.useState<any[]>([]);
  React.useEffect(() => {
const fetchAnnouncement = async () => {
 const { data } = await supabase
  .from('announcements')
  .select('*')
  .gte('expires_at', new Date().toISOString().split('T')[0]);

    if (data?.announcement) {
      setAnnouncements(data || []);
    }
  };

  fetchAnnouncement();
}, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 overflow-x-hidden relative">
      <Navbar />
      <BubbleBackground />
{announcements.map((a) => (
  <div key={a.id} className="mb-3 bg-[#FFF8E1] border border-[#FFC72C] p-4 rounded-xl">
    {a.message}
  </div>
))}
   <section className="pt-32 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-green-100 text-pink-700 px-5 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-lg border border-pink-200">
                <Star size={16} className="fill-pink-700" />
                Volunteer with Richmond Senior Center
              </div>

              <h1 className="text-5xl md:text-7xl font-fredoka font-bold leading-tight text-slate-900 mb-6">
                Support <span className="text-green-600 relative">
                  Richmond
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-green-200/50 -z-10 rounded-full" />
                </span>{' '}
                Senior Center <span className="text-blue-500 relative">
                  Volunteers
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200/50 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">
                Join Richmond Senior Center as a volunteer. Help seniors, gain experience, and make a real difference in your local community.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/apply">
                  <Button size="lg" className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700">
                    Apply Now
                  </Button>
                </Link>

                <Link to="/learn-more">
                  <Button variant="outline" size="lg" className="border-2 hover:bg-green-50 transition-all duration-300">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium h-12" />
          </div>

          <div className="relative flex items-center justify-center">
  <img
    src={logo}
    alt="Richmond Senior Center Logo"
    className="w-72 md:w-96 lg:w-[420px] object-contain"
  />
</div>
        </div>
      </section>

      <section className="py-20 bg-white/50 backdrop-blur-sm relative">
        <div className="absolute top-10 right-20 w-32 h-32 bg-green-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-200/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 border-2 relative overflow-hidden" hover>
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/50 rounded-bl-full" />
              <div className="w-14 h-14 bg-green-200 rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-lg relative z-10">
                <Heart size={28} className="fill-green-600" />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To build meaningful connections between volunteers and seniors at Richmond Senior Center.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 border-2 relative overflow-hidden" hover>
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/50 rounded-bl-full" />
              <div className="w-14 h-14 bg-blue-200 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-lg relative z-10">
                <Star size={28} className="fill-blue-600" />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">Why It Matters</h3>
              <p className="text-slate-600 leading-relaxed">
                Volunteering helps reduce loneliness, strengthens community, and creates meaningful experiences for everyone involved.
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 border-2 relative overflow-hidden" hover>
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200/50 rounded-bl-full" />
              <div className="w-14 h-14 bg-pink-200 rounded-2xl flex items-center justify-center text-pink-600 mb-6 shadow-lg relative z-10">
                <Users size={28} className="fill-pink-600" />
              </div>
              <h3 className="text-xl font-bold font-poppins mb-3 text-slate-800">Get Involved</h3>
              <p className="text-slate-600 leading-relaxed">
                Apply, get approved, and start volunteering with Richmond Senior Center.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-r from-green-500 via-green-500 to-cyan-500 text-white text-center relative overflow-hidden">
        <div className="absolute top-5 left-10 w-16 h-16 border-4 border-white/30 rounded-full opacity-50" />
        <div className="absolute bottom-5 right-20 w-20 h-20 bg-white/10 rounded-lg opacity-50" />

        <h2 className="text-3xl font-fredoka font-bold mb-3 relative z-10">Ready to get started?</h2>
        <p className="text-lg text-slate-60 mb-6 max-w-xl mx-auto relative z-10">
          Apply to volunteer with Richmond Senior Center in just a few minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4 relative z-10">
          <Link to="/apply">
            <Button className="bg-white text-green-700 hover:bg-green-50 border-none shadow-lg font-bold px-8 hover:shadow-2xl transition-all duration-300">
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

      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-fredoka font-bold text-slate-900 mb-4">
              Your Journey with Richmond Senior Center
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From application to volunteering, here is how it works
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Card className="bg-green-50 border-green-100 p-6 text-center h-full">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Apply</h3>
                <p className="text-sm text-slate-600">
                  Fill out the volunteer application and upload your required documents.
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
                  Richmond Senior Center reviews your application and sends you an update.
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
                  Browse available volunteer opportunities and choose what fits your schedule.
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
                  Volunteer, build connections, and make a positive impact in your community.
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
