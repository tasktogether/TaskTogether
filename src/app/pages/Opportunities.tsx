import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, X, Check, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const TIME_SLOT_COLORS: Record<string, string> = {
  'After School': 'bg-blue-100 text-blue-700',
  'Weekends': 'bg-green-100 text-green-700',
  'Summer': 'bg-orange-100 text-orange-700',
  'Flexible': 'bg-violet-100 text-violet-700',
};

type FilterSlot = 'All' | 'After School' | 'Weekends' | 'Summer' | 'Flexible';

export default function Opportunities() {
  const { opportunities, user } = useAuth();
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterSlot>('All');
  const [selectedSeniorHome, setSelectedSeniorHome] = useState<string>('all');

  // In a real app, this would come from an API call to get approved senior homes
  const seniorHomes = [
    { id: 'sh_richmond', name: 'Richmond Senior Center', city: 'Richmond', state: 'VA' },
    { id: 'sh_fairfax', name: 'Fairfax Community Senior Home', city: 'Fairfax', state: 'VA' },
    { id: 'sh_arlington', name: 'Arlington Senior Living', city: 'Arlington', state: 'VA' },
  ];

  const handleOptIn = (opp: any) => {
    if (!user) {
      toast.error('Please log in to join this opportunity!', {
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/login'
        }
      });
      return;
    }
    toast.success(`You've successfully signed up for "${opp.title}"! 🎉`);
    setSelectedOpp(null);
  };

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch =
      !searchQuery ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || opp.timeSlot === activeFilter;
    const matchesSeniorHome = selectedSeniorHome === 'all' || opp.seniorHomeId === selectedSeniorHome;
    return matchesSearch && matchesFilter && matchesSeniorHome;
  });

  const filters: FilterSlot[] = ['All', 'After School', 'Weekends', 'Summer', 'Flexible'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-slate-900 mb-4">
            Find Your Cause 🌟
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse available volunteer roles and find the perfect way to give back — on your schedule.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-4">
          {/* Senior Home Filter */}
          <div className="bg-gradient-to-r from-violet-50 to-pink-50 p-4 rounded-2xl border border-violet-100">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="text-violet-600" size={20} />
              <h3 className="font-bold text-slate-800">Filter by Senior Home</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSeniorHome('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedSeniorHome === 'all'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-violet-100'
                }`}
              >
                All Locations
              </button>
              {seniorHomes.map(home => (
                <button
                  key={home.id}
                  onClick={() => setSelectedSeniorHome(home.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedSeniorHome === home.id
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-violet-100'
                  }`}
                >
                  {home.name}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-violet-200 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors border ${
                    activeFilter === f
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredOpps.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-slate-500 font-medium">No opportunities match your search.</p>
            <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="mt-3 text-violet-600 font-bold text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOpps.map((opp, i) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card hover className="overflow-hidden flex flex-col h-full p-0 cursor-pointer" onClick={() => setSelectedOpp(opp)}>
                  <div className="h-48 overflow-hidden relative group">
                    <img
                      src={opp.imageUrl}
                      alt={opp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TIME_SLOT_COLORS[opp.timeSlot]}`}>
                        {opp.timeSlot}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-violet-600 shadow-sm">
                      Active
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold font-poppins text-slate-800 mb-2">{opp.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-3">{opp.description}</p>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock size={14} className="text-violet-400" />
                        {opp.timeCommitment}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={14} className="text-pink-400" />
                        {opp.location}
                      </div>
                    </div>

                    <Button fullWidth variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedOpp(opp); }}>
                      View Details
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Opportunity Details Modal */}
      <AnimatePresence>
        {selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOpp(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img src={selectedOpp.imageUrl} alt={selectedOpp.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="absolute top-4 right-4 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors"
                >
                  <X size={20} className="text-slate-800" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TIME_SLOT_COLORS[selectedOpp.timeSlot]}`}>
                      {selectedOpp.timeSlot}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{selectedOpp.title}</h2>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex flex-wrap gap-4">
                  <div className="bg-violet-50 text-violet-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Clock size={18} /> {selectedOpp.timeCommitment}
                  </div>
                  <div className="bg-pink-50 text-pink-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <MapPin size={18} /> {selectedOpp.location}
                  </div>
                  <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Calendar size={18} /> {selectedOpp.timeSlot}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">About this Opportunity</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{selectedOpp.description}</p>
                  <p className="text-slate-600 leading-relaxed mt-4">
                    Join us in making a difference! This role is perfect for anyone looking to gain community service experience while building meaningful connections with seniors. Training and support will be provided.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">Requirements</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full" /> Must be 13 years or older</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full" /> Parental consent required for volunteers under 18</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full" /> Friendly, patient, and reliable attitude</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setSelectedOpp(null)}>Close</Button>
                  <Button size="lg" className="px-8 shadow-lg shadow-violet-200" onClick={() => handleOptIn(selectedOpp)}>
                    Opt In & Join <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
