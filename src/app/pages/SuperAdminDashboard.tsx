import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, Users, Briefcase, TrendingUp, Check, X, 
  Mail, Eye, LogOut, BarChart3, Activity, Calendar,
  UserCheck, Clock, AlertCircle, ChevronRight, Search,
  Filter, Download, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Navbar } from '../components/layout/Navbar';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface SeniorHome {
  id: string;
  name: string;
  city: string;
  state: string;
  contactPerson: string;
  email: string;
  phone?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  statusUpdatedAt?: string;
  adminId?: string;
}

interface Analytics {
  totalSeniorHomes: number;
  activeSeniorHomes: number;
  pendingSeniorHomes: number;
  totalVolunteers: number;
  totalOpportunities: number;
  completedRequests: number;
  monthlyGrowth: number;
}

export default function SuperAdminDashboard() {
  const { user, logout, applications } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'senior-homes' | 'volunteers' | 'opportunities' | 'analytics'>('overview');
  const [seniorHomes, setSeniorHomes] = useState<SeniorHome[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSeniorHomes: 0,
    activeSeniorHomes: 0,
    pendingSeniorHomes: 0,
    totalVolunteers: 0,
    totalOpportunities: 0,
    completedRequests: 0,
    monthlyGrowth: 12.5
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Fetch senior homes
  useEffect(() => {
    if (user && user.isPlatformAdmin) {
      fetchSeniorHomes();
    }
  }, [user]);

  // Redirect if not platform admin
  if (!user || !user.isPlatformAdmin) {
    return <Navigate to="/login?role=admin" replace />;
  }

  const fetchSeniorHomes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/senior-homes`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch senior homes');
      
      const data = await response.json();
      setSeniorHomes(data.seniorHomes || []);
      
      // Calculate analytics
      const homes = data.seniorHomes || [];
      setAnalytics({
        totalSeniorHomes: homes.length,
        activeSeniorHomes: homes.filter((h: SeniorHome) => h.status === 'approved').length,
        pendingSeniorHomes: homes.filter((h: SeniorHome) => h.status === 'pending').length,
        totalVolunteers: applications.length,
        totalOpportunities: 15, // Would come from backend
        completedRequests: 127, // Would come from backend
        monthlyGrowth: 12.5
      });
    } catch (error) {
      console.error('Error fetching senior homes:', error);
      toast.error('Failed to load senior homes');
    } finally {
      setLoading(false);
    }
  };

  const updateSeniorHomeStatus = async (seniorHomeId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/senior-homes/${seniorHomeId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');
      
      const data = await response.json();
      toast.success(data.message || `Senior home ${status} successfully!`);
      
      // Refresh data
      fetchSeniorHomes();
    } catch (error) {
      console.error('Error updating senior home status:', error);
      toast.error('Failed to update senior home status');
    }
  };

  const filteredSeniorHomes = seniorHomes.filter(home => {
    const matchesSearch = home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         home.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         home.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || home.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden"
    >
      <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
            <Icon className="text-white" size={24} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp size={16} />
              +{trend}%
            </div>
          )}
        </div>
        <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
        <div className="text-sm text-slate-500 font-medium">{label}</div>
      </Card>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Building2} 
          label="Total Senior Homes" 
          value={analytics.totalSeniorHomes}
          color="from-violet-500 to-purple-600"
        />
        <StatCard 
          icon={UserCheck} 
          label="Active Homes" 
          value={analytics.activeSeniorHomes}
          color="from-green-500 to-emerald-600"
        />
        <StatCard 
          icon={Users} 
          label="Total Volunteers" 
          value={analytics.totalVolunteers}
          trend={analytics.monthlyGrowth}
          color="from-blue-500 to-cyan-600"
        />
        <StatCard 
          icon={Briefcase} 
          label="Active Opportunities" 
          value={analytics.totalOpportunities}
          color="from-pink-500 to-rose-600"
        />
      </div>

      {/* Pending Approvals */}
      {analytics.pendingSeniorHomes > 0 && (
        <Card className="p-6 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Clock className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {analytics.pendingSeniorHomes} Pending Senior Home{analytics.pendingSeniorHomes !== 1 ? 's' : ''}
              </h3>
              <p className="text-slate-600 mb-3">
                New senior homes are waiting for your approval to join TaskTogether.
              </p>
              <Button 
                size="sm" 
                onClick={() => setActiveTab('senior-homes')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Review Applications
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-violet-600" />
            Recent Senior Homes
          </h3>
          <div className="space-y-3">
            {seniorHomes.slice(0, 5).map((home) => (
              <div key={home.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{home.name}</div>
                  <div className="text-sm text-slate-500">{home.city}, {home.state}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  home.status === 'approved' ? 'bg-green-100 text-green-700' :
                  home.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {home.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Recent Volunteer Applications
          </h3>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{app.userName}</div>
                  <div className="text-sm text-slate-500">{app.userEmail}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  app.status === 'approved' ? 'bg-green-100 text-green-700' :
                  app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSeniorHomes = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Senior Homes Management</h2>
          <p className="text-slate-600">Review and manage senior home registrations</p>
        </div>
        <Button onClick={fetchSeniorHomes} variant="outline" className="gap-2">
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, city, or contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Senior Homes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading senior homes...</p>
        </div>
      ) : filteredSeniorHomes.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No senior homes found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSeniorHomes.map((home) => (
            <motion.div
              key={home.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{home.name}</h3>
                        <p className="text-slate-600 flex items-center gap-2">
                          <Building2 size={16} />
                          {home.city}, {home.state}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        home.status === 'approved' ? 'bg-green-100 text-green-700' :
                        home.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {home.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Contact Person</div>
                        <div className="font-medium text-slate-800">{home.contactPerson}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Email</div>
                        <div className="font-medium text-slate-800">{home.email}</div>
                      </div>
                      {home.phone && (
                        <div>
                          <div className="text-sm text-slate-500 mb-1">Phone</div>
                          <div className="font-medium text-slate-800">{home.phone}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Registered</div>
                        <div className="font-medium text-slate-800">
                          {new Date(home.registeredAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {home.message && (
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm text-slate-500 mb-1">Message</div>
                        <p className="text-slate-700">{home.message}</p>
                      </div>
                    )}
                  </div>

                  {home.status === 'pending' && (
                    <div className="flex lg:flex-col gap-3 lg:w-40">
                      <Button
                        fullWidth
                        onClick={() => updateSeniorHomeStatus(home.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                      >
                        <Check size={16} />
                        Approve
                      </Button>
                      <Button
                        fullWidth
                        variant="outline"
                        onClick={() => updateSeniorHomeStatus(home.id, 'rejected')}
                        className="border-red-300 text-red-600 hover:bg-red-50 gap-2"
                      >
                        <X size={16} />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-pink-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pt-28">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-fredoka font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                Super Admin Dashboard
              </h1>
              <p className="text-slate-600">
                Platform-wide management and analytics
              </p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="gap-2 border-slate-300"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'senior-homes', label: 'Senior Homes', icon: Building2 },
              { id: 'volunteers', label: 'Volunteers', icon: Users },
              { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'senior-homes' && renderSeniorHomes()}
        {activeTab === 'volunteers' && (
          <div className="text-center py-12">
            <Users className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Volunteers Management</h3>
            <p className="text-slate-600">Coming soon - view and manage all volunteers across homes</p>
          </div>
        )}
        {activeTab === 'opportunities' && (
          <div className="text-center py-12">
            <Briefcase className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Opportunities Management</h3>
            <p className="text-slate-600">Coming soon - view and manage all opportunities across homes</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Advanced Analytics</h3>
            <p className="text-slate-600">Coming soon - detailed analytics and insights</p>
          </div>
        )}
      </div>
    </div>
  );
}
