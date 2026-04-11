import { useAuth } from '../context/AuthContext';
import { useStories } from '../context/StoriesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { emailService } from '../utils/emailService';
import { VolunteerSchedulingCalendar } from '../components/VolunteerSchedulingCalendar';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Clock,
  Plus,
  Camera,
  Award,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';

interface Task {
  id: number;
  title: string;
  date: string;
  status: 'Upcoming' | 'Completed' | 'Pending Admin Approval';
  color: string;
  savedReflection?: string;
  hours?: number; // Hours for this task
}

export default function VolunteerDashboard() {
  const { user, logout, updateUser, authLoading } = useAuth();
  const { submitStory } = useStories();

  // State for Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState<number | null>(null);
  const [viewReflectionTask, setViewReflectionTask] = useState<Task | null>(null);
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [editedReflection, setEditedReflection] = useState('');

  // Form States
  const [noteContent, setNoteContent] = useState('');
  const [reflection, setReflection] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [receiveTaskEmails, setReceiveTaskEmails] = useState(true);
  const [receiveReminders, setReceiveReminders] = useState(true);
  const [shareStory, setShareStory] = useState(false);
  const [isShareStoryModalOpen, setIsShareStoryModalOpen] = useState(false);
  const [standaloneStory, setStandaloneStory] = useState('');
  const [standaloneTaskTitle, setStandaloneTaskTitle] = useState('');
  const [preferredSeniorHomes, setPreferredSeniorHomes] = useState<string[]>(user?.preferredSeniorHomeIds || []);

  // Mock senior homes list (in production, this would come from API)
  const seniorHomes = [
    { id: 'sh_richmond', name: 'Richmond Senior Center' },
    { id: 'sh_fairfax', name: 'Fairfax Community Senior Home' },
    { id: 'sh_arlington', name: 'Arlington Senior Living' },
  ];

  // Load email preferences when profile modal opens
  useEffect(() => {
    if (isProfileOpen && user?.id) {
      emailService.getEmailPreferences(user?.id)
        .then(prefs => {
          setReceiveTaskEmails(prefs.receiveTaskEmails);
          setReceiveReminders(prefs.receiveReminders);
        })
        .catch(err => {
          console.error('Failed to load email preferences:', err);
        });
    }
  }, [isProfileOpen, user?.id]);

  const handleSaveProfile = async () => {
    updateUser({ name: user?.Name, email: user?.Email });
    
    // Save email preferences
    if (user?.id) {
      try {
        await emailService.updateEmailPreferences(user?.id, {
          receiveTaskEmails,
          receiveReminders,
        });
        toast.success('Profile and email preferences saved! ✨');
      } catch (error) {
        console.error('Failed to save email preferences:', error);
        toast.error('Profile saved, but email preferences failed to save.');
      }
    }
    
    setIsProfileOpen(false);
  };

  const submitStandaloneStory = () => {
    if (!standaloneStory.trim() || !standaloneTaskTitle.trim()) {
      toast.error('Please enter a task title and story.');
      return;
    }
    submitStory({
      volunteerId: user?.id ?? 'unknown',
      volunteerName: user?.name ?? 'Volunteer',
      taskTitle: standaloneTaskTitle,
      reflection: standaloneStory,
      tags: [],
    });
    setIsShareStoryModalOpen(false);
    setStandaloneStory('');
    setStandaloneTaskTitle('');
    toast.success('Your story has been submitted for review! 📖');
  };

  // Mock Data (moved to state for interactivity)
  const [myTasks, setMyTasks] = useState<Task[]>([
    { id: 1, title: 'Grocery Run for Mrs. Potts', date: 'Tomorrow, 2:00 PM', status: 'Upcoming', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 2, title: 'Tech Help at the Center', date: 'Feb 28, 10:00 AM', status: 'Upcoming', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 3, title: 'Garden Cleanup Party', date: 'Feb 15', status: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', savedReflection: 'Had so much fun today! Mrs. Flores showed me how to prune roses. I learned that gardening is really about the stories you share while you dig.' },
  ]);

  const [myNotes, setMyNotes] = useState([
    { id: 1, content: "Mrs. Potts loves chamomile tea! 🍵 Don't forget to pick some up.", color: 'bg-yellow-100 rotate-1' },
    { id: 2, content: "Remember to bring the iPad charger for the tech session. 📱", color: 'bg-pink-100 -rotate-2' },
    { id: 3, content: "Had so much fun gardening today! Need to buy new gloves.", color: 'bg-blue-100 rotate-2' },
  ]);
if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <div className="w-10 h-10 mx-auto mb-4 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">
          Checking your application status...
        </p>
      </div>
    </div>
  );
if (!user || user.role !== 'volunteer') {
  return <Navigate to="/login" replace />;
}
}
 if (user?.status === 'pending') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Application Received
        </h1>
        <p className="text-slate-600">
          Your application is under review.
        </p>
      </div>
    </div>
  );
}

if (user?.status === 'rejected') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Application Update
        </h1>
        <p className="text-slate-600">
          Your application was not approved at this time.
        </p>
      </div>
    </div>
  );
}

if (user?.status === 'not_found') {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          No Application Found
        </h1>
        <p className="text-slate-600">
          We could not find an application for this email address.
        </p>
      </div>
    </div>
  );
}
  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    const colors = ['bg-yellow-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRotate = Math.random() > 0.5 ? 'rotate-1' : '-rotate-1';

    setMyNotes([{
      id: Date.now(),
      content: noteContent,
      color: `${randomColor} ${randomRotate}`
    }, ...myNotes]);

    setNoteContent('');
    setIsNoteModalOpen(false);
    toast.success('Note added to your notebook! 📝');
  };

  const handleCompleteTask = (task: Task) => {
    const isFuture = task.date.includes('Tomorrow') || task.date.includes('Feb 28');
    if (isFuture) {
      toast.error(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Not so fast! 🏃‍♂️</span>
          <span>You can only complete tasks after they happen.</span>
        </div>
      );
      return;
    }
    setSelectedTaskForCompletion(task.id);
    setCompletionModalOpen(true);
  };

  const handleViewReflection = (task: Task) => {
    setViewReflectionTask(task);
    setEditedReflection(task.savedReflection || '');
    setIsEditingReflection(false);
  };

  const handleSaveEditedReflection = () => {
    if (!viewReflectionTask) return;
    setMyTasks(prev =>
      prev.map(t => t.id === viewReflectionTask.id ? { ...t, savedReflection: editedReflection } : t)
    );
    setViewReflectionTask(prev => prev ? { ...prev, savedReflection: editedReflection } : null);
    setIsEditingReflection(false);
    toast.success('Reflection updated! ✨');
  };

  const submitCompletion = () => {
    if (!reflection.trim()) {
      toast.error("Please write a short reflection.");
      return;
    }

    setMyTasks(myTasks.map(t =>
      t.id === selectedTaskForCompletion
        ? { ...t, status: 'Completed', color: 'bg-green-100 text-green-700 border-green-200', savedReflection: reflection }
        : t
    ));

    if (shareStory) {
      const task = myTasks.find(t => t.id === selectedTaskForCompletion);
      submitStory({
        volunteerId: user?.id ?? 'unknown',
        volunteerName: user?.name ?? 'Volunteer',
        taskTitle: task?.title ?? 'Volunteer Task',
        reflection,
        tags: [],
      });
    }

    setCompletionModalOpen(false);
    setReflection('');
    setPhotos([]);
    setShareStory(false);
    setSelectedTaskForCompletion(null);

    toast.success(
      <div className="space-y-2">
        <p className="font-bold text-lg">Thank You! 🎉</p>
        <p>Your kindness makes a huge difference. Keep it up!</p>
        {shareStory && <p className="text-xs opacity-80">Your story has been submitted for review 📖</p>}
      </div>,
      { duration: 5000 }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);
      toast.success(`Added ${newPhotos.length} photo(s)! 📸`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-fredoka relative">
      <main className="pt-28 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="relative bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-xl shadow-violet-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">
              Hi, {user?.name}! 👋
            </h1>
            <p className="text-violet-100 text-lg md:text-xl font-medium">Ready to make someone's day awesome?</p>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => window.location.href = '/opportunities'}
                className="bg-white text-violet-600 hover:bg-violet-50 font-bold rounded-full px-6 shadow-md border-none"
              >
                Find New Tasks 🔎
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsProfileOpen(true)}
                className="text-white border-white/50 hover:bg-white/20 font-bold rounded-full px-6 hover:text-white"
              >
                My Profile ✏️
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsShareStoryModalOpen(true)}
                className="text-white border-white/50 hover:bg-white/20 font-bold rounded-full px-6 hover:text-white"
              >
                Share a Story 📖
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Tasks & Notes */}
          <div className="lg:col-span-2 space-y-8">

            {/* My Tasks */}
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-orange-100 p-2 rounded-xl">📋</span> My Tasks
              </h2>
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white p-5 rounded-3xl shadow-sm border-2 ${task.status === 'Completed' ? 'border-green-100 bg-green-50/30' : 'border-slate-100'} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${task.color.split(' ')[0]}`}>
                        {task.status === 'Completed' ? '✅' : '📅'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{task.title}</h3>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                          <Clock size={16} /> {task.date}
                        </p>
                        {task.status === 'Completed' && task.savedReflection && (
                          <p className="text-xs text-slate-400 mt-1 italic line-clamp-1 max-w-xs">
                            "{task.savedReflection}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${task.color}`}>
                        {task.status}
                      </span>
                      {task.status === 'Completed' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewReflection(task)}
                          className="text-violet-600 hover:bg-violet-50 border border-violet-200 rounded-xl"
                        >
                          View Reflection
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task)}
                          className={`shadow-green-200 border-none text-white ${
                            task.date.includes('Tomorrow') || task.date.includes('Feb 28')
                              ? 'bg-slate-300 cursor-not-allowed hover:bg-slate-300'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* My Notebook */}
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-yellow-100 p-2 rounded-xl">📝</span> My Notebook
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {myNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05, rotate: 0 }}
                    className={`p-6 rounded-2xl shadow-md min-h-[160px] flex flex-col justify-between font-handwriting ${note.color} transition-all duration-300 transform cursor-pointer`}
                  >
                    <p className="text-slate-700 font-medium text-lg leading-relaxed font-sans">{note.content}</p>
                    <div className="flex justify-end mt-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-2 py-1 rounded-lg">Note</span>
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="border-4 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-violet-500 hover:border-violet-200 hover:bg-violet-50 transition-all min-h-[160px] group"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-violet-100 transition-colors">
                    <Plus size={24} />
                  </div>
                  <span className="font-bold">Add Note</span>
                </button>
              </div>
            </section>

            {/* Volunteer Schedule Calendar */}
            <section>
              <VolunteerSchedulingCalendar />
            </section>
          </div>

          {/* Right Column: Badges & Stats */}
          <div className="lg:col-span-1 space-y-8">
            <StatsColumn logout={logout} />
          </div>
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {/* My Profile Modal */}
        {isProfileOpen && (
          <Modal key="profile" onClose={() => setIsProfileOpen(false)} title={`Hi, ${user?.name}! 👋`}>
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full shadow-md hover:bg-violet-700">
                    <Camera size={14} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Bio</label>
                <textarea rows={3} defaultValue="I love helping others!" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {['Gardening', 'Tech', 'Reading'].map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      {tag} <button className="hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                  <button className="bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-sm font-bold hover:bg-violet-100">+ Add</button>
                </div>
              </div>

              {/* Preferred Senior Homes */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Building2 size={16}/> Preferred Senior Homes</h4>
                
                <p className="text-xs text-slate-600 mb-3">
                  Select one or more preferred senior homes to see their opportunities more prominently.
                </p>
                
                <div className="space-y-2">
                  {seniorHomes.map(home => (
                    <label
                      key={home.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={preferredSeniorHomes.includes(home.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredSeniorHomes([...preferredSeniorHomes, home.id]);
                          } else {
                            setPreferredSeniorHomes(preferredSeniorHomes.filter(id => id !== home.id));
                          }
                        }}
                        className="w-5 h-5 rounded border-2 border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-200"
                      />
                      <span className="text-sm font-medium text-slate-700">{home.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button fullWidth onClick={handleSaveProfile}>Save Changes</Button>
                <Button fullWidth variant="ghost" onClick={() => setIsProfileOpen(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Note Modal */}
        {isNoteModalOpen && (
          <Modal key="note" onClose={() => setIsNoteModalOpen(false)} title="New Note">
            <div className="space-y-4">
              <textarea
                placeholder="What's on your mind? (e.g., Mrs. Potts birthday is coming up!)"
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 text-lg font-handwriting"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddNote} disabled={!noteContent.trim()}>Add Note</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Task Completion Modal */}
        {completionModalOpen && (
          <Modal key="completion" onClose={() => setCompletionModalOpen(false)} title="Task Complete! 🎉">
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <p className="text-slate-600">Great job! Take a moment to reflect on your experience.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reflection <span className="text-red-400">*</span></label>
                <textarea
                  placeholder="How did it go? What did you learn?"
                  rows={3}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Photos (Optional)</label>
                <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer block relative overflow-hidden group">
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  <Upload size={24} className="mx-auto text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-slate-500 font-medium">
                    {photos.length > 0 ? `${photos.length} photos selected` : 'Click to upload photos'}
                  </p>
                  {photos.length > 0 && (
                    <div className="mt-2 flex gap-1 justify-center">
                      {photos.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-violet-400" />
                      ))}
                    </div>
                  )}
                </label>
              </div>

              {/* Share Story Opt-In */}
              <div
                onClick={() => setShareStory(!shareStory)}
                className={`cursor-pointer flex items-start gap-3 p-4 rounded-2xl border-2 transition-all ${
                  shareStory ? 'border-violet-300 bg-violet-50' : 'border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-violet-50/50'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  shareStory ? 'bg-violet-600 border-violet-600' : 'border-slate-300'
                }`}>
                  {shareStory && <CheckCircle size={12} className="text-white" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Share my story publicly ✨</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Submit your reflection to "Stories of Kindness" — an admin will review it before it goes live.
                  </p>
                </div>
              </div>

              <Button fullWidth size="lg" onClick={submitCompletion}>
                Confirm Completion
              </Button>
            </div>
          </Modal>
        )}

        {/* View / Edit Reflection Modal */}
        {viewReflectionTask && (
          <Modal
            key="view-reflection"
            onClose={() => { setViewReflectionTask(null); setIsEditingReflection(false); }}
            title={viewReflectionTask.title}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Completed</span>
                <span>{viewReflectionTask.date}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Your Reflection</label>
                  {!isEditingReflection && (
                    <button
                      onClick={() => setIsEditingReflection(true)}
                      className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1"
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  )}
                </div>

                {isEditingReflection ? (
                  <textarea
                    rows={5}
                    value={editedReflection}
                    onChange={e => setEditedReflection(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-200 text-slate-700"
                    autoFocus
                  />
                ) : (
                  <blockquote className="pl-4 border-l-4 border-violet-200 text-slate-600 italic leading-relaxed rounded-r-xl bg-violet-50/50 py-3 pr-4">
                    {viewReflectionTask.savedReflection || <span className="text-slate-400 not-italic">No reflection written yet.</span>}
                  </blockquote>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                {isEditingReflection ? (
                  <>
                    <Button fullWidth onClick={handleSaveEditedReflection} disabled={!editedReflection.trim()}>
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                    <Button fullWidth variant="ghost" onClick={() => { setIsEditingReflection(false); setEditedReflection(viewReflectionTask.savedReflection || ''); }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button fullWidth variant="ghost" onClick={() => { setViewReflectionTask(null); }}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Share a Story Modal */}
        {isShareStoryModalOpen && (
          <Modal key="share-story" onClose={() => setIsShareStoryModalOpen(false)} title="Share Your Story 📖">
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">
                Did you have a memorable experience volunteering? Share it with the community! Submitted stories will be reviewed by our admins before being published to the <strong>Stories of Kindness</strong> blog.
              </p>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">What was the task or event?</label>
                <input
                  type="text"
                  placeholder="e.g. Baking with Mrs. Potts"
                  value={standaloneTaskTitle}
                  onChange={(e) => setStandaloneTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Your Story</label>
                <textarea
                  placeholder="Tell us what happened and why it was special..."
                  rows={5}
                  value={standaloneStory}
                  onChange={(e) => setStandaloneStory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setIsShareStoryModalOpen(false)}>Cancel</Button>
                <Button onClick={submitStandaloneStory} disabled={!standaloneStory.trim() || !standaloneTaskTitle.trim()}>
                  Submit Story ✨
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents
function StatsColumn({ logout }: { logout: () => void }) {
  const badges = [
    { id: 1, name: 'First Steps', icon: '👣', desc: 'Completed 1st Task', earned: true, color: 'bg-sky-100 border-sky-200 text-sky-600' },
    { id: 2, name: 'Tech Whiz', icon: '💻', desc: 'Helped 3 seniors with tech', earned: true, color: 'bg-violet-100 border-violet-200 text-violet-600' },
    { id: 3, name: 'Super Star', icon: '⭐', desc: '5 Tasks Completed!', earned: true, color: 'bg-yellow-100 border-yellow-200 text-yellow-600' },
    { id: 4, name: 'Green Thumb', icon: '🌱', desc: 'Joined a garden event', earned: false, color: 'bg-green-50 border-green-100 text-green-300 grayscale' },
  ];

  return (
    <>
      <Card className="rounded-3xl border-4 border-violet-100 overflow-hidden shadow-lg shadow-violet-100/50">
        <div className="bg-violet-50 p-6 border-b-2 border-violet-100">
          <h2 className="text-xl font-bold text-violet-800 flex items-center gap-2">
            <Award className="text-violet-600" />
            Trophy Case
          </h2>
          <p className="text-violet-600/80 text-sm font-medium mt-1">Collect them all! 🏆</p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center gap-2 ${badge.color} transition-all hover:scale-105 cursor-default`}>
              <div className="text-3xl filter drop-shadow-sm">{badge.icon}</div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{badge.name}</h4>
                <p className="text-[10px] mt-1 opacity-80 font-medium">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-pink-50 p-6 rounded-3xl border-2 border-pink-100 text-center">
          <h3 className="text-4xl font-bold text-pink-500 mb-1">12</h3>
          <p className="font-bold text-pink-800 text-sm uppercase tracking-wide">Hours<br />Volunteered</p>
        </div>
        <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100 text-center">
          <h3 className="text-4xl font-bold text-sky-500 mb-1">5</h3>
          <p className="font-bold text-sky-800 text-sm uppercase tracking-wide">Lives<br />Impacted</p>
        </div>
      </div>

      <Button variant="ghost" onClick={logout} className="w-full text-red-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-2xl">
        <LogOut size={18} className="mr-2" /> Log Out
      </Button>
    </>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 backdrop-blur-md z-10">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
