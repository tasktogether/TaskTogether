import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Filter, Check, X, AlertTriangle, Search, Mail, Loader2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface SeniorHome {
  id: string;
  name: string;
  city: string;
  state: string;
  contactPerson: string;
  email: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  statusUpdatedAt?: string;
}

export default function AdminSeniorHomesPage() {
  const [seniorHomes, setSeniorHomes] = useState<SeniorHome[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHome, setSelectedHome] = useState<SeniorHome | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchSeniorHomes();
  }, []);

  const fetchSeniorHomes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/senior-homes`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch senior homes');
      }

      setSeniorHomes(data.seniorHomes || []);
    } catch (error) {
      console.error('Error fetching senior homes:', error);
      toast.error('Failed to load senior homes');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSeniorHomeStatus = async (homeId: string, status: 'approved' | 'rejected') => {
    setUpdatingStatus(homeId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/senior-homes/${homeId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      setSeniorHomes(prev =>
        prev.map(home =>
          home.id === homeId ? { ...home, status, statusUpdatedAt: new Date().toISOString() } : home
        )
      );

      toast.success(`Senior home ${status}! ${status === 'approved' ? '✅' : '❌'}`);
      setSelectedHome(null);
    } catch (error) {
      console.error('Error updating senior home status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update status: ${errorMessage}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredHomes = seniorHomes.filter(home => {
    if (filterStatus === 'all') return true;
    return home.status === filterStatus;
  });

  const statusCounts = {
    all: seniorHomes.length,
    pending: seniorHomes.filter(h => h.status === 'pending').length,
    approved: seniorHomes.filter(h => h.status === 'approved').length,
    rejected: seniorHomes.filter(h => h.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-violet-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-poppins text-slate-800">Senior Home Management</h1>
        <Button onClick={fetchSeniorHomes} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`p-4 cursor-pointer transition-all ${filterStatus === 'all' ? 'ring-2 ring-violet-300' : ''}`} hover onClick={() => setFilterStatus('all')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Building2 size={20} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Homes</p>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.all}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 cursor-pointer transition-all ${filterStatus === 'pending' ? 'ring-2 ring-orange-300' : ''}`} hover onClick={() => setFilterStatus('pending')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.pending}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 cursor-pointer transition-all ${filterStatus === 'approved' ? 'ring-2 ring-green-300' : ''}`} hover onClick={() => setFilterStatus('approved')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Approved</p>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.approved}</p>
            </div>
          </div>
        </Card>

        <Card className={`p-4 cursor-pointer transition-all ${filterStatus === 'rejected' ? 'ring-2 ring-red-300' : ''}`} hover onClick={() => setFilterStatus('rejected')}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-slate-800">{statusCounts.rejected}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Senior Homes List */}
      <Card className="p-6">
        {filteredHomes.length === 0 ? (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No senior homes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHomes.map(home => (
              <motion.div
                key={home.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-slate-200 rounded-xl hover:border-violet-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-800 text-lg">{home.name}</h3>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          home.status === 'pending'
                            ? 'bg-orange-100 text-orange-700'
                            : home.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {home.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-violet-400" />
                        {home.city}, {home.state}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-blue-400" />
                        {home.contactPerson}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-pink-400" />
                        {home.email}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500">
                      Registered: {new Date(home.registeredAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedHome(home)}>
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                    {home.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateSeniorHomeStatus(home.id, 'approved')}
                          disabled={updatingStatus === home.id}
                        >
                          {updatingStatus === home.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <>
                              <Check size={16} className="mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => updateSeniorHomeStatus(home.id, 'rejected')}
                          disabled={updatingStatus === home.id}
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedHome && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedHome(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 size={32} />
                  <h2 className="text-2xl font-bold">{selectedHome.name}</h2>
                </div>
                <p className="text-violet-100">
                  {selectedHome.city}, {selectedHome.state}
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Users size={18} className="text-violet-400" />
                      <span>{selectedHome.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={18} className="text-pink-400" />
                      <a href={`mailto:${selectedHome.email}`} className="text-violet-600 hover:underline">
                        {selectedHome.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <MapPin size={18} className="text-blue-400" />
                      <span>
                        {selectedHome.city}, {selectedHome.state}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedHome.message && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                      Message
                    </h3>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                      {selectedHome.message}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
                    Registration Details
                  </h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={`font-bold ${
                          selectedHome.status === 'pending'
                            ? 'text-orange-600'
                            : selectedHome.status === 'approved'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {selectedHome.status.toUpperCase()}
                      </span>
                    </p>
                    <p>
                      <strong>Registered:</strong> {new Date(selectedHome.registeredAt).toLocaleString()}
                    </p>
                    {selectedHome.statusUpdatedAt && (
                      <p>
                        <strong>Status Updated:</strong>{' '}
                        {new Date(selectedHome.statusUpdatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setSelectedHome(null)}>
                    Close
                  </Button>
                  {selectedHome.status === 'pending' && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          updateSeniorHomeStatus(selectedHome.id, 'approved');
                        }}
                        disabled={updatingStatus === selectedHome.id}
                      >
                        {updatingStatus === selectedHome.id ? (
                          <Loader2 className="animate-spin mr-2" size={18} />
                        ) : (
                          <Check size={18} className="mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          updateSeniorHomeStatus(selectedHome.id, 'rejected');
                        }}
                        disabled={updatingStatus === selectedHome.id}
                      >
                        <X size={18} className="mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}