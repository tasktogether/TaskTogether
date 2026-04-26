import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  Briefcase,
  Check,
  X,
  LogOut,
  PlayCircle,
  Search,
  Calendar,
  Edit3,
  LayoutDashboard,
  MapPin,
  Clock3,
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
  authLoading,
} = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'volunteers' | 'opportunities'>('overview');
const [processingApplicationId, setProcessingApplicationId] = useState<string | number | null>(null);
const [processingAction, setProcessingAction] = useState<'approve' | 'reject' | null>(null);
const navigate = useNavigate();
const [isCreatingOpportunity, setIsCreatingOpportunity] = useState(false);
const [volunteerSearch, setVolunteerSearch] = useState('');
const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
const [isVolunteerProfileOpen, setIsVolunteerProfileOpen] = useState(false);
const [isCreateOpportunityOpen, setIsCreateOpportunityOpen] = useState(false);
const [isEditOpportunityOpen, setIsEditOpportunityOpen] = useState(false);
const [editingOpportunity, setEditingOpportunity] = useState<any | null>(null);
const [editOpportunityForm, setEditOpportunityForm] = useState({
  title: '',
  description: '',
  opportunity_date: '',
  time_commitment: '',
  volunteer_limit: '1',
});
const [editingOpportunityId, setEditingOpportunityId] = useState<string | number | null>(null);
const [deletingOpportunityId, setDeletingOpportunityId] = useState<string | number | null>(null);
const [removingSignupKey, setRemovingSignupKey] = useState<string | null>(null);
const [newOpportunity, setNewOpportunity] = useState({
  title: '',
  description: '',
  opportunity_date: '',
  time_commitment: '',
  volunteer_limit: '5',
});
  const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getOpportunityStatus = (
  dateString: string,
  currentVolunteers = 0,
  volunteerLimit = 0,
  dbStatus?: string
) => {
  const today = new Date();
  const oppDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  oppDate.setHours(0, 0, 0, 0);

  if (oppDate < today) return 'Past';

  // Use database status if available
  if (dbStatus) return dbStatus;

  if (volunteerLimit > 0 && currentVolunteers >= volunteerLimit) return 'Full';

  return 'Not Ready';
};
const isRecentlyCreated = (dateString: string) => {
  const createdDate = new Date(dateString);
  const today = new Date();

  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 7;
};
const isReadySoon = (dateString: string) => {
  const today = new Date();
  const oppDate = new Date(dateString);

  today.setHours(0, 0, 0, 0);
  oppDate.setHours(0, 0, 0, 0);

  const diffTime = oppDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= 3;
};

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
  const totalSignups = opportunities.reduce(
  (total, opp) => total + (opp.current_volunteers || 0),
  0
);
  if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500 text-sm">Loading dashboard...</p>
    </div>
  );
}

if (!user || user.role !== 'director') {
  return <Navigate to="/login?role=director" replace />;
}
  const handleApprove = async (app: any) => {
  if (processingApplicationId === app.id) return;

  const confirmed = window.confirm(`Approve ${app.userName}?`);
  if (!confirmed) return;

  setProcessingApplicationId(app.id);
  setProcessingAction('approve');

  try {
    await updateApplicationStatus(app.id, 'approved');
    await emailService.sendApprovalEmail(app.userEmail, app.userName);
    toast.success(`${app.userName} was approved successfully.`);
  } catch (error: any) {
    console.error('Approve failed:', error);
    toast.error(error?.message || `Failed to approve ${app.userName}. Please try again.`);
  } finally {
    setProcessingApplicationId(null);
    setProcessingAction(null);
  }
};
 const handleReject = async (app: any) => {
  if (processingApplicationId === app.id) return;

  const confirmed = window.confirm(`Reject ${app.userName}?`);
  if (!confirmed) return;

  setProcessingApplicationId(app.id);
  setProcessingAction('reject');

  try {
    await updateApplicationStatus(app.id, 'rejected');
    toast.success(`${app.userName} was rejected.`);
  } catch (error: any) {
    console.error('Reject failed:', error);
    toast.error(error?.message || `Failed to reject ${app.userName}. Please try again.`);
  } finally {
    setProcessingApplicationId(null);
    setProcessingAction(null);
  }
};
 const handleCreateOpportunity = async () => {
  if (isCreatingOpportunity) return;

  const title = newOpportunity.title.trim();
  const description = newOpportunity.description.trim();
  const date = newOpportunity.opportunity_date.trim();
  const time = newOpportunity.time_commitment.trim();
  const volunteerLimit = Number(newOpportunity.volunteer_limit);

   if (!title || !description || !date || !time) {
    toast.error('Please complete all opportunity fields.');
    return;
  }

  if (isNaN(volunteerLimit) || volunteerLimit < 1) {
    toast.error('Volunteer limit must be at least 1.');
    return;
  }

 const today = new Date();
today.setHours(0, 0, 0, 0);

const selectedDate = new Date(date);
selectedDate.setHours(0, 0, 0, 0);

if (isNaN(selectedDate.getTime())) {
  toast.error('Please enter a valid date.');
  return;
}

if (selectedDate < today) {
  toast.error('Opportunity date must be today or in the future.');
  return;
}

  setIsCreatingOpportunity(true);

  try {
await createOpportunity({
  title,
  description,
  opportunity_date: date,
  time_commitment: time,
  location: 'Richmond Senior Center',
  volunteer_limit: volunteerLimit,
});

    setNewOpportunity({
      title: '',
      description: '',
      opportunity_date: '',
      time_commitment: '',
      volunteer_limit: '5',
    });

    setIsCreateOpportunityOpen(false);
    toast.success('Opportunity created successfully.');
  } catch (error: any) {
    console.error('Create opportunity failed:', error);
    toast.error(error?.message || 'Failed to create opportunity. Please try again.');
  } finally {
    setIsCreatingOpportunity(false);
  }
};
const handleEditOpportunity = (opp: any) => {
  setEditingOpportunity(opp);
  setEditOpportunityForm({
    title: opp.title || '',
    description: opp.description || '',
    opportunity_date: opp.opportunity_date || '',
    time_commitment: opp.time_commitment || '',
    volunteer_limit: String(opp.volunteer_limit || 1),
  });
  setIsEditOpportunityOpen(true);
};
  const handleSaveEditedOpportunity = async () => {
  if (!editingOpportunity) return;
  if (editingOpportunityId === editingOpportunity.id) return;

  const title = editOpportunityForm.title.trim();
  const description = editOpportunityForm.description.trim();
  const date = editOpportunityForm.opportunity_date.trim();
  const time = editOpportunityForm.time_commitment.trim();
  const volunteerLimit = Number(editOpportunityForm.volunteer_limit);

  if (!title || !description || !date || !time) {
    toast.error('Please complete all opportunity fields.');
    return;
  }

  if (isNaN(volunteerLimit) || volunteerLimit < 1) {
    toast.error('Volunteer limit must be at least 1.');
    return;
  }

  setEditingOpportunityId(editingOpportunity.id);

  try {
    await updateOpportunity(editingOpportunity.id, {
      title,
      description,
      opportunity_date: date,
      time_commitment: time,
      volunteer_limit: volunteerLimit,
    });

    toast.success('Opportunity updated successfully.');
    setIsEditOpportunityOpen(false);
    setEditingOpportunity(null);
  } catch (error: any) {
    console.error('Update opportunity failed:', error);
    toast.error(error?.message || 'Failed to update opportunity.');
  } finally {
    setEditingOpportunityId(null);
  }
};

const handleDeleteOpportunity = async (opp: any) => {
  if (deletingOpportunityId === opp.id) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete the opportunity "${opp.title}"?`
  );

  if (!confirmed) return;

  setDeletingOpportunityId(opp.id);

  try {
    await deleteOpportunity(opp.id);
    toast.success('Opportunity deleted successfully.');
  } catch (error: any) {
    console.error('Delete opportunity failed:', error);
    toast.error('Failed to delete opportunity.');
  } finally {
    setDeletingOpportunityId(null);
  }
};

const handleRemoveVolunteer = async (oppId: string | number, signup: any) => {
  const key = `${oppId}-${signup.volunteer_email}`;

  if (removingSignupKey === key) return;

  const confirmed = window.confirm(
    `Remove ${signup.volunteer_name} from this opportunity?`
  );
  if (!confirmed) return;

  setRemovingSignupKey(key);

  try {
    await removeVolunteerFromOpportunity(oppId, signup.volunteer_email);
    toast.success(`${signup.volunteer_name} was removed from the opportunity.`);
  } catch (error: any) {
    console.error('Remove volunteer failed:', error);
    toast.error(error?.message || 'Failed to remove volunteer.');
  } finally {
    setRemovingSignupKey(null);
  }
};
  const handleOpenVolunteerProfile = (volunteer: any) => {
  setSelectedVolunteer(volunteer);
  setIsVolunteerProfileOpen(true);
};
  const selectedVolunteerOpportunities = selectedVolunteer
  ? opportunities.filter((opp) =>
      opp.signups?.some(
        (signup: any) => signup.volunteer_email === selectedVolunteer.userEmail
      )
    )
  : [];

const selectedVolunteerUpcomingOpportunities = selectedVolunteerOpportunities.filter(
  (opp) => {
    const oppDate = new Date(opp.opportunity_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    oppDate.setHours(0, 0, 0, 0);
    return oppDate >= today;
  }
);

const selectedVolunteerPastOpportunities = selectedVolunteerOpportunities.filter(
  (opp) => {
    const oppDate = new Date(opp.opportunity_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    oppDate.setHours(0, 0, 0, 0);
    return oppDate < today;
  }
);
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
 Manage volunteer applications, approved volunteers, and volunteer opportunities for Richmond Senior Center.
</p>
<p className="text-xs text-slate-400 mt-2">
  Last updated: {new Date().toLocaleDateString()}
</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          Quick Summary
        </p>
        <p className="text-sm text-slate-600 mt-1">
  {approvedApps.length} approved volunteers • {pendingApps.length} pending applications • {upcomingOpportunities.length} upcoming opportunities scheduled
</p>
      </div>
    </div>
  </div>
<div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
  
  <Card className="bg-indigo-50 border-indigo-100 p-6">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
      <Users size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">
        Total Signups
      </p>
      <p className="text-2xl font-bold text-slate-800">
        {totalSignups}
      </p>
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
              <div className="text-sm text-slate-500">
  Review and manage volunteer applications.
</div>
            </div>

            <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
              Pending Review
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{pendingApps.length}</span>
            </h2>

            <div className="space-y-6">
              {pendingApps.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
<p className="text-slate-500">There are no pending volunteer applications at this time.</p>
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
  disabled={processingApplicationId === app.id}
>
  <Check size={16} className="mr-2" />
  {processingApplicationId === app.id && processingAction === 'approve'
    ? 'Approving...'
    : 'Approve'}
</Button>
                        <Button
  size="sm"
  variant="ghost"
  className="text-red-500 hover:bg-red-50 hover:text-red-600 w-full justify-center"
  onClick={() => handleReject(app)}
  disabled={processingApplicationId === app.id}
>
  <X size={16} className="mr-2" />
  {processingApplicationId === app.id && processingAction === 'reject'
    ? 'Rejecting...'
    : 'Reject'}
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
            <td className="px-6 py-4 text-right text-slate-400 text-xs">
  No actions
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
                <p className="text-slate-500">There are no approved volunteers yet.</p>
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
  onClick={() => handleOpenVolunteerProfile(app)}
  className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
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
                      
<span className="inline-flex items-center rounded-full bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 border border-green-100">
  Approved
</span>
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
  className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
  onClick={() => setIsCreateOpportunityOpen(true)}
  disabled={isCreatingOpportunity}
>
  <Briefcase size={16} /> Create New Opportunity
</Button>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-700 font-medium">No volunteer opportunities have been created yet.</p>
<p className="text-slate-500 text-sm mt-1">
  Create the first opportunity to begin accepting volunteer sign-ups.
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
  opp.current_volunteers,
  opp.volunteer_limit,
  opp.status
);
const statusClasses =
  status === 'Needs Adult Volunteer'
    ? 'bg-red-100 text-red-700'
    : status === 'Ready / Active'
    ? 'bg-green-100 text-green-700'
    : status === 'Full'
    ? 'bg-blue-100 text-blue-700'
    : status === 'Past'
    ? 'bg-slate-100 text-slate-600'
    : 'bg-yellow-100 text-yellow-700'; // Not Ready

              return (
<Card
  key={opp.id}
  className={`relative overflow-hidden group ${
    opp.status === 'Needs Adult Volunteer'
      ? 'border-2 border-red-300'
      : (opp.current_volunteers || 0) === 1
      ? 'border-2 border-yellow-300'
      : ''
  }`}
>
                  <div
  className={`absolute top-0 left-0 w-1 h-full ${
    opp.status === 'Needs Adult Volunteer'
      ? 'bg-red-400'
      : status === 'Ready / Active'
      ? 'bg-green-400'
      : status === 'Not Ready'
      ? 'bg-yellow-400'
      : status === 'Full'
      ? 'bg-blue-400'
      : 'bg-slate-300'
  }`}
/>

                  <div className="pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${statusClasses}`}
                      >
                        {status}
                      </span>
                      {status === 'Not Ready' && (
  <p className="text-xs text-slate-500 mt-1">
    Needs at least 2 volunteers.
  </p>
)}

{status === 'Needs Adult Volunteer' && (
  <p className="text-xs text-red-600 mt-1 font-semibold">
    Adult volunteer required for safety.
  </p>
)}

                      <div className="flex gap-1">
                        <Button
  variant="ghost"
  size="icon"
  className="h-6 w-6"
  onClick={() => handleEditOpportunity(opp)}
  disabled={editingOpportunityId === opp.id || deletingOpportunityId === opp.id}
>
  <Edit3 size={14} />
</Button>
<Button
  variant="ghost"
  size="icon"
  className="h-6 w-6 text-red-500 hover:bg-red-50"
  onClick={() => handleDeleteOpportunity(opp)}
  disabled={editingOpportunityId === opp.id || deletingOpportunityId === opp.id}
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

<span className="ml-2 text-xs text-slate-500">
  ({opp.adult_volunteers || 0} adult{(opp.adult_volunteers || 0) === 1 ? '' : 's'})
</span>
                    </div>
                    {status === 'Not Ready' && (
  <p className="mt-2 text-xs text-slate-500">
    Needs at least 2 volunteers before this opportunity is ready.
  </p>
)}

{status === 'Needs Adult Volunteer' && (
  <p className="mt-2 text-xs text-yellow-700 bg-yellow-50 border border-yellow-100 rounded-lg p-2">
    Needs at least one adult volunteer before this opportunity is ready.
  </p>
)}

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
  <span>
    {signup.volunteer_name}
    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
      {signup.is_adult ? 'Adult' : 'Minor'}
    </span>
  </span>

  <button
    type="button"
    className="text-red-500 hover:underline ml-2 disabled:text-slate-400 disabled:no-underline"
    onClick={() => handleRemoveVolunteer(opp.id, signup)}
    disabled={removingSignupKey === `${opp.id}-${signup.volunteer_email}`}
  >
    {removingSignupKey === `${opp.id}-${signup.volunteer_email}`
      ? 'Removing...'
      : 'Remove'}
  </button>
</div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No volunteers have signed up yet.</p>
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
  onClick={async () => {
    await logout();
    navigate('/');
  }}
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

      {/* CREATE OPPORTUNITY MODAL — GLOBAL */}
<AnimatePresence>
  {isVolunteerProfileOpen && selectedVolunteer && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsVolunteerProfileOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            Volunteer Profile
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            View volunteer details and opportunity activity.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {selectedVolunteer.userName?.charAt(0) || 'V'}
            </div>

<div>
  <h3 className="text-xl font-bold text-slate-800">
    {selectedVolunteer.userName}
  </h3>

  <p className="text-sm text-slate-500">
    {selectedVolunteer.userEmail}
  </p>

  <div className="mt-1 space-y-2">
    <p className="text-xs font-semibold">
      {selectedVolunteer.one_on_one_opt_in
        ? 'Opted into 1-on-1 volunteering'
        : 'Not opted into 1-on-1 volunteering'}
    </p>

    {selectedVolunteer.one_on_one_opt_in &&
    !selectedVolunteer.background_check_completed ? (
      <button
        type="button"
        onClick={() => {
          window.open('https://www.sterlingvolunteers.com/', '_blank');
        }}
        className="text-xs font-semibold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
      >
        Open Sterling Background Check
      </button>
    ) : null}

    <p
      className={`text-xs font-semibold ${
        selectedVolunteer.one_on_one_opt_in &&
        selectedVolunteer.background_check_completed
          ? 'text-green-700'
          : 'text-slate-500'
      }`}
    >
      {selectedVolunteer.one_on_one_opt_in &&
      selectedVolunteer.background_check_completed
        ? '1-on-1 Approved'
        : '1-on-1 Not Approved'}
    </p>
  </div>
</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-xs uppercase font-bold text-slate-400">
                Approved Date
              </p>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {selectedVolunteer.processedAt
                  ? new Date(selectedVolunteer.processedAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-xs uppercase font-bold text-slate-400">
                Signed Up
              </p>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {selectedVolunteerUpcomingOpportunities.length}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <p className="text-xs uppercase font-bold text-slate-400">
                Past Opportunities
              </p>
              <p className="text-sm font-medium text-slate-700 mt-1">
                {selectedVolunteerPastOpportunities.length}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3">
              Signed Up Opportunities
            </h4>

            {selectedVolunteerUpcomingOpportunities.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
                No upcoming opportunity sign-ups.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedVolunteerUpcomingOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
                  >
                    <p className="font-semibold text-slate-800">{opp.title}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(opp.opportunity_date)} • {opp.time_commitment}
                    </p>
                    <p className="text-sm text-slate-500">
                      {opp.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3">
              Past Opportunities
            </h4>

            {selectedVolunteerPastOpportunities.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
                No past opportunities found.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedVolunteerPastOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
                  >
                    <p className="font-semibold text-slate-800">{opp.title}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(opp.opportunity_date)} • {opp.time_commitment}
                    </p>
                    <p className="text-sm text-slate-500">
                      {opp.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => setIsVolunteerProfileOpen(false)}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  (isEditOpportunityOpen && editingOpportunity && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsEditOpportunityOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            Edit Opportunity
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Update this volunteer opportunity for Richmond Senior Center.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Opportunity Title
            </label>
            <input
              type="text"
              required
              value={editOpportunityForm.title}
              onChange={(e) =>
                setEditOpportunityForm({
                  ...editOpportunityForm,
                  title: e.target.value,
                })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Opportunity Description
            </label>
            <textarea
              required
              value={editOpportunityForm.description}
              onChange={(e) =>
                setEditOpportunityForm({
                  ...editOpportunityForm,
                  description: e.target.value,
                })
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={editOpportunityForm.opportunity_date}
                onChange={(e) =>
                  setEditOpportunityForm({
                    ...editOpportunityForm,
                    opportunity_date: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Time Range
              </label>
              <input
                type="text"
                required
                value={editOpportunityForm.time_commitment}
                onChange={(e) =>
                  setEditOpportunityForm({
                    ...editOpportunityForm,
                    time_commitment: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Number of Volunteer Spots
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={editOpportunityForm.volunteer_limit}
                onChange={(e) =>
                  setEditOpportunityForm({
                    ...editOpportunityForm,
                    volunteer_limit: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-xl px-4 py-3"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsEditOpportunityOpen(false)}
            disabled={editingOpportunityId === editingOpportunity.id}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSaveEditedOpportunity}
            disabled={editingOpportunityId === editingOpportunity.id}
          >
            {editingOpportunityId === editingOpportunity.id ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  ))
<AnimatePresence>

      <AnimatePresence>
        {isCreateOpportunityOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreateOpportunityOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">
                  Create New Opportunity
                </h2>
               <p className="text-sm text-slate-500 mt-1">
  Create a new volunteer opportunity for Richmond Senior Center.
</p>
              </div>

<div className="p-6 space-y-6">
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">
      Opportunity Title
    </label>
    <input
      type="text"
      required
      value={newOpportunity.title}
      onChange={(e) =>
        setNewOpportunity({
          ...newOpportunity,
          title: e.target.value,
        })
      }
      className="w-full border border-slate-200 rounded-xl px-4 py-3"
      placeholder="Bingo Night"
    />
  </div>

  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">
      Opportunity Description
    </label>
    <textarea
      required
      value={newOpportunity.description}
      onChange={(e) =>
        setNewOpportunity({
          ...newOpportunity,
          description: e.target.value,
        })
      }
      className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[100px]"
      placeholder="Help run bingo for seniors..."
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        Date
      </label>
      <input
        type="date"
        required
        value={newOpportunity.opportunity_date}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            opportunity_date: e.target.value,
          })
        }
        className="w-full border border-slate-200 rounded-xl px-4 py-3"
      />
    </div>

    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        Time Range
      </label>
      <input
        type="text"
        required
        placeholder="12:30-3:30"
        value={newOpportunity.time_commitment}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            time_commitment: e.target.value,
          })
        }
        className="w-full border border-slate-200 rounded-xl px-4 py-3"
      />
      <p className="text-xs text-slate-500 mt-1">
        Enter the time range for this opportunity.
      </p>
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        Number of Volunteer Spots
      </label>
      <input
        type="number"
        min="1"
        max="50"
        required
        value={newOpportunity.volunteer_limit}
        onChange={(e) =>
          setNewOpportunity({
            ...newOpportunity,
            volunteer_limit: e.target.value,
          })
        }
        className="w-full border border-slate-200 rounded-xl px-4 py-3"
      />
    </div>
  </div>
</div>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <Button
  variant="ghost"
  onClick={() => setIsCreateOpportunityOpen(false)}
  disabled={isCreatingOpportunity}
>
  Cancel
</Button>

<Button
  onClick={handleCreateOpportunity}
  disabled={isCreatingOpportunity}
>
  {isCreatingOpportunity ? 'Creating...' : 'Create Opportunity'}
</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
