import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Users, FileText, Briefcase, Check, X, Eye, LogOut, 
  MessageCircle, PlayCircle, Filter, Download, Search, 
  Settings, Calendar, Edit3, LayoutDashboard, Building2 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { emailService } from '../utils/emailService';
import AdminSeniorHomesPage from './admin/AdminSeniorHomesPage';

// Mock Data for other sections
const MOCK_OPPORTUNITIES = [
  { id: 1, title: 'Grocery Run', requester: 'Mrs. Potts', date: 'Weekly', status: 'open', volunteersNeeded: 1 },
  { id: 2, title: 'Tech Help', requester: 'Senior Center', date: 'Feb 28, 10:00 AM', status: 'filled', volunteersNeeded: 0 },
  { id: 3, title: 'Garden Cleanup', requester: 'Community Garden', date: 'Mar 15, 09:00 AM', status: 'open', volunteersNeeded: 5 },
];

export default function AdminDashboard() {
  const { user, applications, updateApplicationStatus, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
  'overview' | 'applications' | 'volunteers' | 'opportunities' | 'senior_homes'
>('applications');
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login?role=admin" replace />;
  }

  // Check if user is platform admin (can manage senior homes)
  const isPlatformAdmin = user.isPlatformAdmin === true;

  const pendingApps = applications.filter(app => app.status === 'pending');
const approvedApps = applications.filter(app => app.status === 'approved');
const rejectedApps = applications.filter(app => app.status === 'rejected');

// Send approval email function
const sendApprovalEmail = async (app: any) => {
  setIsSendingEmail(app.id);
  try {
    await emailService.sendApprovalEmail(app.userEmail, app.userName);
    toast.success(`📧 Approval email sent to ${app.userName}!`, { duration: 5000 });
  } catch (error) {
    console.error('Error sending approval email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to send email: ${errorMessage}`, { duration: 7000 });
  } finally {
    setIsSendingEmail(null);
  }
};

const sendRejectionEmail = async (app: any) => {
  setIsSendingEmail(app.id);
  try {
    await emailService.sendRejectionEmail(app.userEmail, app.userName);
    toast.success(`📧 Rejection email sent to ${app.userName}!`, { duration: 5000 });
  } catch (error) {
    console.error('Error sending rejection email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Failed to send email: ${errorMessage}`, { duration: 7000 });
  } finally {
    setIsSendingEmail(null);
  }
};

  // Handle approve with email
 const handleApprove = async (app: any) => {
  try {
    await updateApplicationStatus(app.id, 'approved');
    await sendApprovalEmail(app);
    toast.success(`${app.userName} was approved.`);
  } catch (error) {
    console.error('Approve failed:', error);
    toast.error('Failed to approve application.');
  }
};

const handleApprove = async (app: any) => {
  const confirmed = window.confirm(`Approve ${app.userName}?`);
  if (!confirmed) return;

  try {
    await updateApplicationStatus(app.id, 'approved');
    await sendApprovalEmail(app);
    toast.success(`${app.userName} was approved.`);
  } catch (error) {
    console.error('Approve failed:', error);
    toast.error('Failed to approve application.');
  }
};

const handleReject = async (app: any) => {
  const confirmed = window.confirm(`Reject ${app.userName}?`);
  if (!confirmed) return;

  try {
    await updateApplicationStatus(app.id, 'rejected');
    await sendRejectionEmail(app);
    toast.success(`${app.userName} was rejected.`);
  } catch (error) {
    console.error('Reject failed:', error);
    toast.error('Failed to reject application.');
  }
};

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold font-poppins text-slate-800">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card 
                 className="bg-violet-50 border-violet-100 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                 onClick={() => setActiveTab('volunteers')}
               >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Volunteers</p>
                      <p className="text-2xl font-bold text-slate-800">{approvedApps.length}</p>
                    </div>
                  </div>
                </Card>
                <Card 
                  className="bg-orange-50 border-orange-100 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveTab('applications')}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Pending Apps</p>
                      <p className="text-2xl font-bold text-slate-800">{pendingApps.length}</p>
                    </div>
                  </div>
                </Card>
                <Card 
                  className="bg-green-50 border-green-100 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setActiveTab('opportunities')}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Active Opportunities</p>
                      <p className="text-2xl font-bold text-slate-800">{MOCK_OPPORTUNITIES.filter(o => o.status === 'open').length}</p>
                    </div>
                  </div>
                </Card>
             </div>
          </div>
        );

      case 'applications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold font-poppins text-slate-800">Applications</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2"><Filter size={16}/> Filter</Button>
                <Button variant="outline" size="sm" className="gap-2"><Download size={16}/> Export</Button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              Pending Review <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{pendingApps.length}</span>
            </h2>

            <div className="space-y-6">
              {pendingApps.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-500">No pending applications. Good job! 🎉</p>
                </div>
              ) : (
                pendingApps.map(app => (
                  <Card key={app.id} className="border-l-4 border-l-yellow-400 overflow-visible">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-800">{app.userName}</h3>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200"> 
                            Age: {app.age ?? 'N/A'}
                          </span>
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">Student</span>
                        </div>
                        <p className="text-slate-600 text-sm flex items-center gap-2">
                          <span className="font-semibold">Email:</span> {app.userEmail}
                        </p>
                        <p className="text-xs text-slate-400">Submitted: {new Date(app.submittedAt).toLocaleDateString()} at {new Date(app.submittedAt).toLocaleTimeString()}</p>
                        
                        {/* Attachments Section - Enhanced */}
                        <div className="bg-slate-50 p-4 rounded-xl mt-4 border border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Required Documents</p>
                          <div className="flex flex-wrap gap-3">
                            {app.videoUrl ? (
  <a
    href={app.videoUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-2 text-sm font-medium bg-white text-slate-700 pl-3 pr-4 py-2 rounded-lg border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all"
  >
    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
      <PlayCircle size={16} />
    </div>
    Intro Video
  </a>
) : (
  <span className="text-sm text-slate-400">
    No video uploaded
  </span>
)}
{app.age && app.age < 18 && (
  <button 
    onClick={() => alert("Opening Consent Form...")}
    className="group flex items-center gap-2 text-sm font-medium bg-white text-slate-700 pl-3 pr-4 py-2 rounded-lg border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all"
  >
    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
      <FileText size={16} />
    </div>
    Consent Form
  </button>
)}
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-center gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 shadow-green-200 w-full justify-center"
                          onClick={() => handleApprove(app)}
                        >
                          <Check size={16} className="mr-2" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 w-full justify-center"
                          onClick={() => handleReject(app)}
                        >
                          <X size={16} className="mr-2" /> Reject
                        </Button>
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-600 w-full justify-center">
                          <MessageCircle size={16} className="mr-2" /> Message
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-12">
              <h2 className="text-lg font-bold text-slate-700 mb-4">Rejected Applications</h2>
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date Processed</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                   {rejectedApps.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-medium text-slate-800">{app.userName}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            app.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-violet-600"><Eye size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

     case 'volunteers':
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-800">Volunteers</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search volunteers..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 w-64"
            />
          </div>
        </div>
      </div>

      {approvedApps.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500">No approved volunteers yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {approvedApps.map(app => (
            <div
              key={app.id}
              className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold">
                  {app.userName?.charAt(0) || 'V'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{app.userName}</h3>
                  <p className="text-sm text-slate-500">{app.userEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase font-bold">Approved</p>
                  <p className="font-medium text-slate-700">
                    {app.processedAt
  ? new Date(app.processedAt).toLocaleDateString()
  : 'N/A'}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-slate-400 text-xs uppercase font-bold">Status</p>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <Settings size={16} className="text-slate-400" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

      case 'opportunities':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold font-poppins text-slate-800">Opportunities</h1>
              <Button className="gap-2"><Briefcase size={16}/> Create New</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_OPPORTUNITIES.map(opp => (
                <Card key={opp.id} className="relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full ${opp.status === 'open' ? 'bg-green-400' : 'bg-slate-300'}`} />
                  <div className="pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${opp.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {opp.status}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Edit3 size={14} /></Button>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{opp.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">Requested by: {opp.requester}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Calendar size={14} /> {opp.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={14} /> {opp.volunteersNeeded} spots remaining
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'senior_homes':
        return (
          isPlatformAdmin ? <AdminSeniorHomesPage /> : <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500">You do not have permission to manage senior homes.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-slate-100">
          <span className="font-fredoka text-xl font-bold text-slate-800 flex items-center gap-2">
             TaskTogether
          </span>
          <span className="text-xs font-bold text-violet-500 uppercase tracking-widest ml-1">Admin Portal</span>
        </div>
        <div className="p-4 space-y-2 flex-1">
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'ghost'} 
            fullWidth className="justify-start gap-3" 
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} /> Overview
          </Button>
          <Button 
            variant={activeTab === 'applications' ? 'primary' : 'ghost'} 
            fullWidth className="justify-start gap-3"
            onClick={() => setActiveTab('applications')}
          >
            <FileText size={18} /> Applications
            {pendingApps.length > 0 && (
              <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold py-0.5 px-2 rounded-full">{pendingApps.length}</span>
            )}
          </Button>
          <Button 
            variant={activeTab === 'volunteers' ? 'primary' : 'ghost'} 
            fullWidth className="justify-start gap-3"
            onClick={() => setActiveTab('volunteers')}
          >
            <Users size={18} /> Volunteers
          </Button>
          <Button 
            variant={activeTab === 'opportunities' ? 'primary' : 'ghost'} 
            fullWidth className="justify-start gap-3"
            onClick={() => setActiveTab('opportunities')}
          >
            <Briefcase size={18} /> Opportunities
          </Button>
          <Button
            variant={activeTab === 'senior_homes' ? 'primary' : 'ghost'}
            fullWidth className="justify-start gap-3"
            onClick={() => setActiveTab('senior_homes')}
          >
            <Building2 size={18} /> Senior Homes
          </Button>
        </div>
        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" fullWidth className="justify-start text-red-500 hover:bg-red-50 hover:text-red-600 gap-3" onClick={logout}>
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
