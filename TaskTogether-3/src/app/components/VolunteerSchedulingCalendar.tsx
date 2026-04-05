import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Users, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ScheduleOpportunity {
  id: string;
  seniorHomeName: string;
  seniorHomeCity: string;
  title: string;
  time: string;
  slotsAvailable: number;
  totalSlots: number;
}

interface DaySchedule {
  date: Date;
  opportunities: ScheduleOpportunity[];
}

// Mock data - in a real app, this would come from the backend
const generateMockSchedule = (year: number, month: number): DaySchedule[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const schedule: DaySchedule[] = [];
  
  const seniorHomes = [
    { name: 'Richmond Senior Center', city: 'Richmond' },
    { name: 'Sunrise Senior Living', city: 'Oakland' },
    { name: 'Golden Years Community', city: 'Berkeley' },
  ];
  
  const activities = [
    { title: 'Grocery Shopping Help', time: '10:00 AM', slots: 2 },
    { title: 'Tech Support Session', time: '2:00 PM', slots: 1 },
    { title: 'Gardening Activity', time: '3:00 PM', slots: 3 },
    { title: 'Reading Circle', time: '11:00 AM', slots: 2 },
    { title: 'Arts & Crafts', time: '1:00 PM', slots: 4 },
  ];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Skip past dates
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      schedule.push({ date, opportunities: [] });
      continue;
    }
    
    // Generate opportunities for weekdays (skip weekends for some variety)
    const opportunities: ScheduleOpportunity[] = [];
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      // Randomly add 1-3 opportunities
      const numOpps = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numOpps; i++) {
        const home = seniorHomes[Math.floor(Math.random() * seniorHomes.length)];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const available = Math.floor(Math.random() * activity.slots) + 1;
        
        opportunities.push({
          id: `opp_${date.getTime()}_${i}`,
          seniorHomeName: home.name,
          seniorHomeCity: home.city,
          title: activity.title,
          time: activity.time,
          slotsAvailable: available,
          totalSlots: activity.slots,
        });
      }
    }
    
    schedule.push({ date, opportunities });
  }
  
  return schedule;
};

export function VolunteerSchedulingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOpportunities, setSelectedOpportunities] = useState<Set<string>>(new Set());
  const [schedule, setSchedule] = useState(() => 
    generateMockSchedule(currentDate.getFullYear(), currentDate.getMonth())
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    setSchedule(generateMockSchedule(newDate.getFullYear(), newDate.getMonth()));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSchedule(generateMockSchedule(newDate.getFullYear(), newDate.getMonth()));
    setSelectedDate(null);
  };

  const toggleOpportunity = (oppId: string) => {
    const newSelected = new Set(selectedOpportunities);
    if (newSelected.has(oppId)) {
      newSelected.delete(oppId);
    } else {
      newSelected.add(oppId);
    }
    setSelectedOpportunities(newSelected);
  };

  const confirmSelection = () => {
    if (selectedOpportunities.size === 0) {
      toast.error('Please select at least one opportunity');
      return;
    }
    
    toast.success(`${selectedOpportunities.size} volunteer slot(s) confirmed! 🎉`);
    setSelectedOpportunities(new Set());
    setSelectedDate(null);
  };

  const getDaySchedule = (date: Date): DaySchedule | undefined => {
    return schedule.find(s => 
      s.date.getDate() === date.getDate() &&
      s.date.getMonth() === date.getMonth() &&
      s.date.getFullYear() === date.getFullYear()
    );
  };

  // Calendar grid generation
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-fredoka text-slate-800">
          Volunteer Schedule
        </h2>
        <p className="text-slate-600">Pick dates you're available to help</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToPreviousMonth}
                  className="w-10 h-10 p-0"
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={goToNextMonth}
                  className="w-10 h-10 p-0"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const daySchedule = getDaySchedule(date);
                const hasOpportunities = daySchedule && daySchedule.opportunities.length > 0;
                const isPast = date < today;

                return (
                  <motion.button
                    key={date.toISOString()}
                    whileHover={!isPast && hasOpportunities ? { scale: 1.05 } : {}}
                    whileTap={!isPast && hasOpportunities ? { scale: 0.95 } : {}}
                    onClick={() => !isPast && hasOpportunities && setSelectedDate(date)}
                    disabled={isPast || !hasOpportunities}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center p-2 transition-all relative
                      ${isPast ? 'opacity-40 cursor-not-allowed' : ''}
                      ${isSelected(date) 
                        ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg' 
                        : isToday(date)
                        ? 'bg-blue-50 border-2 border-blue-400 text-blue-700'
                        : hasOpportunities
                        ? 'bg-violet-50 hover:bg-violet-100 border border-violet-200 text-slate-800'
                        : 'bg-slate-50 text-slate-400'
                      }
                    `}
                  >
                    <span className={`text-sm font-semibold ${isSelected(date) ? 'text-white' : ''}`}>
                      {date.getDate()}
                    </span>
                    {hasOpportunities && !isPast && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <div className={`flex gap-0.5 ${isSelected(date) ? 'opacity-100' : 'opacity-60'}`}>
                          {Array(Math.min(daySchedule.opportunities.length, 3)).fill(0).map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 h-1 rounded-full ${isSelected(date) ? 'bg-white' : 'bg-violet-500'}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Opportunities Panel */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            {selectedDate ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                </div>

                <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                  {getDaySchedule(selectedDate)?.opportunities.map(opp => {
                    const isSelected = selectedOpportunities.has(opp.id);
                    return (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-violet-500 bg-violet-50' 
                            : 'border-slate-200 bg-white hover:border-violet-300'
                          }
                        `}
                        onClick={() => toggleOpportunity(opp.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-800 text-sm flex-1">
                            {opp.title}
                          </h4>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{opp.seniorHomeName}, {opp.seniorHomeCity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <span>{opp.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>{opp.slotsAvailable} of {opp.totalSlots} slots available</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <Button
                  fullWidth
                  onClick={confirmSelection}
                  disabled={selectedOpportunities.size === 0}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                >
                  Confirm {selectedOpportunities.size > 0 ? `(${selectedOpportunities.size})` : 'Selection'}
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto mb-4 text-slate-300" size={48} />
                <p className="text-slate-500 text-sm">
                  Select a date to view available volunteer opportunities
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}