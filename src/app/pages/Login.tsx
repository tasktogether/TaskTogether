import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Navbar } from '../components/layout/Navbar';
import { BubbleBackground } from '../components/background/BubbleBackground';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check URL params for role=admin on mount (simulated)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const onSubmit = async (data: any) => {
  const role = isAdmin ? 'admin' : 'volunteer';

  if (role === 'admin') {
    const isPlatformAdmin = data.email === 'tasktogethercontact@gmail.com';

    if (isPlatformAdmin && data.password !== 'TaskTogether123$') {
      toast.error('Invalid password');
      return;
    }

    const result = await login(data.email, data.password, 'admin');

    if (!result.success) {
      toast.error(result.message || 'Login failed');
      return;
    }

    navigate(isPlatformAdmin ? '/superadmin/dashboard' : '/admin/dashboard');
    return;
  }

  const result = await login(data.email, data.password, 'volunteer');

  if (!result.success || result.status !== 'approved') {
    toast.error(result.message || 'Login failed');
    return;
  }

  navigate('/volunteer-dashboard');
};
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      <Navbar />
      <BubbleBackground />

      <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-12">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl border-white/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-fredoka font-bold text-slate-800 mb-2">
              {isAdmin ? 'Admin Portal' : 'Welcome Back!'}
            </h1>
            <p className="text-slate-500">
              {isAdmin ? 'Please sign in to manage volunteers.' : 'Log in to see your opportunities.'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  {...register('email', { required: true })}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  {...register('password', { required: true })}
                  type="password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-all bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button fullWidth size="lg" className="group">
              Sign In <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className="text-xs text-slate-400 hover:text-violet-600 underline decoration-dotted"
            >
              Switch to {isAdmin ? 'Volunteer' : 'Admin'} Login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
