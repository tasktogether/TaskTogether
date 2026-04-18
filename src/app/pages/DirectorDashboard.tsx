import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Briefcase,
  Check,
  X,
  Eye,
  LogOut,
  PlayCircle,
  Search,
  Settings,
  Calendar,
  Edit3,
  LayoutDashboard,
  MapPin,
  Clock3,
  Filter,
  Download,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { emailService } from '../utils/emailService';

export default function AdminDashboard() {
  const {
  user,
  applications,
  updateApplicationStatus,
  logout,
  opportunities,
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
  removeVolunteerFromOpportunity,
} = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'volunteers' | 'opportunities'>('overview');
  const [isSendingEmail, setIsSendingEmail] = useState<string | number | null>(null);
  const [volunteerSearch, setVolunteerSearch] = useState('');

  const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getOpportunityStatus = (dateString: string, currentVolunteers = 0, volunteerLimit = 0) => {
  const today = new Date();
  const oppDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  oppDate.setHours(0, 0, 0, 0);

  if (oppDate < today) return 'Past';
  if (volunteerLimit > 0 && currentVolunteers >= volunteerLimit) return 'Full';
  return 'Upcoming';
};
const isRecentlyCreated = (dateString: string) => {
  const createdDate = new Date(dateString);
  const today = new Date();

  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
};
if (!user || user.role !== 'director') {
  return <Navigate to="/login?role=director" replace />;
}

    const pendingApps = applications.filter(app => app.status === 'pending');
  const approvedApps = applications.filter(app => app.status === 'approved');
  const rejectedApps = applications.filter(app => app.status === 'rejected');

  const filteredApprovedApps = useMemo(() => {
    return approvedApps.filter(app =>
      `${app.userName} ${app.userEmail}`
        .toLowerCase()
        .includes(volunteerSearch.toLowerCase())
    );
  }, [approvedApps, volunteerSearch]);

  const upcomingOpportunities = opportunities.filter(opp => {
    const oppDate = new Date(opp.opportunity_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    oppDate.setHours(0, 0, 0, 0);
    return oppDate >= today;
  });

  const filledOpportunities = opportunities.filter(
    opp => (opp.current_volunteers || 0) >= opp.volunteer_limit
  );
  const handleApprove = async (app: any) => {
    const confirmed = window.confirm(`Approve ${app.userName}?`);
    if (!confirmed) return;

    setIsSendingEmail(app.id);

    try {
      await updateApplicationStatus(app.id, 'approved');
      await emailService.sendApprovalEmail(app.userEmail, app.userName);
      toast.success(`${app.userName} was approved.`);
    } catch (error: any) {
      console.error('Approve failed:', error);
      toast.error(error.message || 'Failed to approve application.');
    } finally {
      setIsSendingEmail(null);
    }
  };

  const handleReject = async (app: any) => {
    const confirmed = window.confirm(`Reject ${app.userName}?`);
    if (!confirmed) return;

    setIsSendingEmail(app.id);

    try {
      await updateApplicationStatus(app.id, 'rejected');
      toast.success(`${app.userName} was rejected.`);
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error('Failed to reject application.');
    } finally {
      setIsSendingEmail(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-violet-600">Director Dashboard</p>
        <h1 className="text-3xl font-bold font-poppins text-slate-800">
          Richmond Senior Center
        </h1>
        <p className="text-slate-500 mt-1">
          Manage volunteers, review applications, and oversee opportunities.
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          Quick Summary
        </p>
        <p className="text-sm text-slate-600 mt-1">
          {approvedApps.length} approved volunteers • {pendingApps.length} pending applications • {upcomingOpportunities.length} upcoming opportunities
        </p>
      </div>
    </div>
  </div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <p className="text-2xl font-bold text-slate-800">
          {upcomingOpportunities.length}
        </p>
      </div>
    </div>
  </Card>

  <Card className="bg-blue-50 border-blue-100 p-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
        <Check size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">Filled Opportunities</p>
        <p className="text-2xl font-bold text-slate-800">{filledOpportunities.length}</p>
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
              <h1 className="text-2xl font-bold font-poppins text-slate-800">Volunteer Applications</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter size={16} /> Filter
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download size={16} /> Export
                </Button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              Pending Review
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{pendingApps.length}</span>
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
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">
                            Volunteer Applicant
                          </span>
                        </div>

                        <p className="text-slate-600 text-sm flex items-center gap-2">
                          <span className="font-semibold">Email:</span> {app.userEmail}
                        </p>

                        <p className="text-xs text-slate-400">
                          Submitted: {new Date(app.submittedAt).toLocaleDateString()} at{' '}
                          {new Date(app.submittedAt).toLocaleTimeString()}
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl mt-4 border border-slate-100">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                            Required Documents
                          </p>

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
                              <span className="text-sm text-slate-400">No video uploaded</span>
                            )}

                            {app.age && app.age < 18 && (
                              <a
                                href="/consent-form"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 text-sm font-medium bg-white text-slate-700 pl-3 pr-4 py-2 rounded-lg border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all"
                              >
                                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                  <FileText size={16} />
                                </div>
                                Consent Form
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col justify-center gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                        <Button
  size="sm"
  className="bg-green-600 hover:bg-green-700 shadow-green-200 w-full justify-center"
  onClick={() => handleApprove(app)}
  disabled={isSendingEmail === app.id}
>
  <Check size={16} className="mr-2" />
  {isSendingEmail === app.id ? 'Sending...' : 'Approve'}
</Button>

                        <Button
  size="sm"
  variant="ghost"
  className="text-red-500 hover:bg-red-50 hover:text-red-600 w-full justify-center"
  onClick={() => handleReject(app)}
  disabled={isSendingEmail === app.id}
>
  <X size={16} className="mr-2" />
  {isSendingEmail === app.id ? 'Updating...' : 'Reject'}
</Button>

                        <Button
  size="sm"
  variant="ghost"
  className="text-slate-400 hover:text-slate-600 w-full justify-center"
  disabled
>
  <Eye size={16} className="mr-2" /> Review
</Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-12">
              <h2 className="text-lg font-bold text-slate-700 mb-4">Rejected Applications</h2>

              {rejectedApps.length === 0 ? (
  <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
    <p className="text-slate-500">No rejected applications.</p>
  </div>
) : (
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                Rejected
              </span>
            </td>
            <td className="px-6 py-4 text-slate-500">
              {app.processedAt ? new Date(app.processedAt).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-6 py-4 text-right">
              <button className="text-slate-400 hover:text-violet-600">
                <Eye size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
            </div>
          </div>
        );

         case 'volunteers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold font-poppins text-slate-800">
                Approved Volunteers
              </h1>

              <div className="flex gap-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    value={volunteerSearch}
                    onChange={(e) => setVolunteerSearch(e.target.value)}
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
                {filteredApprovedApps.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No volunteers match that search.</p>
                  </div>
                ) : (
                  filteredApprovedApps.map((app) => (
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
                          <p className="text-slate-400 text-xs uppercase font-bold">
                            Approved
                          </p>
                          <p className="font-medium text-slate-700">
                            {app.processedAt
                              ? new Date(app.processedAt).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-slate-400 text-xs uppercase font-bold">
                            Status
                          </p>
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      </div>

                      <Button variant="ghost" size="icon">
                        <Settings size={16} className="text-slate-400" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );

case 'opportunities':
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-poppins text-slate-800">
          Volunteer Opportunities
        </h1>

        <Button
          className="gap-2"
          onClick={async () => {
            const title = prompt('Opportunity title:');
            if (!title || !title.trim()) {
              alert('Title is required.');
              return;
            }

            const description = prompt('Opportunity description:');
            if (!description || !description.trim()) {
              alert('Description is required.');
              return;
            }

            const opportunityDate = prompt('Opportunity date (YYYY-MM-DD):');
            if (!opportunityDate || !opportunityDate.trim()) {
              alert('Date is required.');
              return;
            }

            const timeCommitment = prompt('Time commitment:');
            if (!timeCommitment || !timeCommitment.trim()) {
              alert('Time commitment is required.');
              return;
            }

            const volunteerLimitInput = prompt('Volunteer limit:', '5');
            const volunteerLimit = Number(volunteerLimitInput);

            if (!volunteerLimitInput || isNaN(volunteerLimit) || volunteerLimit < 1) {
              alert('Volunteer limit must be at least 1.');
              return;
            }

            await createOpportunity({
              title: title.trim(),
              description: description.trim(),
              opportunity_date: opportunityDate.trim(),
              time_commitment: timeCommitment.trim(),
              location: 'Richmond Senior Center',
              volunteer_limit: volunteerLimit,
            });
          }}
        >
          <Briefcase size={16} /> Create New
        </Button>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-700 font-medium">No opportunities yet.</p>
          <p className="text-slate-500 text-sm mt-1">
            Create your first volunteer opportunity for Richmond Senior Center.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...opportunities]
            .sort(
              (a, b) =>
                new Date(a.opportunity_date).getTime() -
                new Date(b.opportunity_date).getTime()
            )
            .map((opp) => {
              const status = getOpportunityStatus(
                opp.opportunity_date,
                opp.current_volunteers || 0,
                opp.volunteer_limit
              );

              const statusClasses =
                status === 'Past'
                  ? 'bg-slate-100 text-slate-600'
                  : status === 'Full'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700';

              return (
                <Card key={opp.id} className="relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />

                  <div className="pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
  <span
    className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${statusClasses}`}
  >
    {status}
  </span>

  {isRecentlyCreated(opp.opportunity_date) && (
    <span className="text-xs font-bold px-2 py-1 rounded-md bg-violet-100 text-violet-700">
      New
    </span>
  )}
</div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={async () => {
                            const newTitle = prompt('Enter new title:', opp.title);
                            if (!newTitle) return;

                            const newDescription = prompt(
                              'Enter new description:',
                              opp.description
                            );

                            const newDate = prompt(
                              'Enter new date (YYYY-MM-DD):',
                              opp.opportunity_date
                            );

                            const newLimit = prompt(
                              'Enter volunteer limit:',
                              String(opp.volunteer_limit)
                            );

                            await updateOpportunity(opp.id, {
                              title: newTitle,
                              description: newDescription || opp.description,
                              opportunity_date: newDate || opp.opportunity_date,
                              volunteer_limit: Number(newLimit) || opp.volunteer_limit,
                            });
                          }}
                        >
                          <Edit3 size={14} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            const confirmed = window.confirm(`Delete "${opp.title}"?`);
                            if (!confirmed) return;
                            deleteOpportunity(opp.id);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                      {opp.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                      <MapPin size={14} />
                      Richmond Senior Center
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Calendar size={14} /> {formatDate(opp.opportunity_date)}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Clock3 size={14} /> {opp.time_commitment}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={14} /> {opp.current_volunteers || 0} / {opp.volunteer_limit} spots filled
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500 mb-1">
                        Signed Up Volunteers
                      </p>

                      {opp.signups && opp.signups.length > 0 ? (
                        <div className="space-y-1">
                          {opp.signups.map((signup: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded"
                            >
                              <span>{signup.volunteer_name}</span>

                              <button
                                type="button"
                                className="text-red-500 hover:underline ml-2"
                                onClick={() =>
                                  removeVolunteerFromOpportunity(
                                    opp.id,
                                    signup.volunteer_email
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No volunteers yet</p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );

    default:
      return null;
  }
};

  return (
  <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed inset-y-0 z-20">
      <div className="p-6 border-b border-slate-100">
        <span className="font-fredoka text-xl font-bold text-slate-800 flex items-center gap-2">
          Richmond Senior Center
        </span>
        <span className="text-xs font-bold text-violet-500 uppercase tracking-widest ml-1">
          Director Portal
        </span>
      </div>

      <div className="p-4 space-y-2 flex-1">
        <Button
          variant={activeTab === 'overview' ? 'primary' : 'ghost'}
          fullWidth
          className="justify-start gap-3"
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={18} /> Overview
        </Button>

        <Button
          variant={activeTab === 'applications' ? 'primary' : 'ghost'}
          fullWidth
          className="justify-start gap-3"
          onClick={() => setActiveTab('applications')}
        >
          <FileText size={18} /> Applications
          {pendingApps.length > 0 && (
            <span className="ml-auto bg-orange-100 text-orange-700 text-xs font-bold py-0.5 px-2 rounded-full">
              {pendingApps.length}
            </span>
          )}
        </Button>

        <Button
          variant={activeTab === 'volunteers' ? 'primary' : 'ghost'}
          fullWidth
          className="justify-start gap-3"
          onClick={() => setActiveTab('volunteers')}
        >
          <Users size={18} /> Volunteers
        </Button>

        <Button
          variant={activeTab === 'opportunities' ? 'primary' : 'ghost'}
          fullWidth
          className="justify-start gap-3"
          onClick={() => setActiveTab('opportunities')}
        >
          <Briefcase size={18} /> Opportunities
        </Button>
      </div>

      <div className="p-4 border-t border-slate-100">
        <Button
          variant="ghost"
          fullWidth
          className="justify-start text-red-500 hover:bg-red-50 hover:text-red-600 gap-3"
          onClick={logout}
        >
          <LogOut size={18} /> Sign Out
        </Button>
      </div>
    </aside>

    <main className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
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
