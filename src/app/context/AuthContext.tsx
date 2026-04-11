import { supabase } from '../../lib/supabase';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type UserRole = 'volunteer' | 'admin' | 'platform_admin' | null;
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'not_found';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: ApplicationStatus;
  totalHours?: number;
  joinDate?: string;
  preferredSeniorHomeIds?: string[];
  seniorHomeId?: string;
  isPlatformAdmin?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  timeCommitment: string;
  imageUrl: string;
  timeSlot: 'After School' | 'Weekends' | 'Summer' | 'Flexible';
  location: string;
  seniorHomeId?: string;
  seniorHomeName?: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  videoUrl?: string;
  age?: number;
  status: ApplicationStatus;
  submittedAt: Date;
  processedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<{
    success: boolean;
    status?: ApplicationStatus;
    message?: string;
  }>;
  logout: () => Promise<void>;
  register: (name: string, email: string) => void;
  updateUser: (updates: Partial<User>) => void;
  applications: Application[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  opportunities: Opportunity[];
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Senior Tech Buddy',
    description: 'Help seniors learn how to use their smartphones and tablets to stay connected with family.',
    timeCommitment: '2 hours / week',
    imageUrl: 'https://images.unsplash.com/photo-1576267460635-dad0eede4415?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    timeSlot: 'After School',
    location: 'Richmond Senior Center',
  },
  {
    id: '2',
    title: 'Community Garden Helper',
    description: 'Assist in maintaining the local community garden alongside senior gardening experts.',
    timeCommitment: '3 hours / weekend',
    imageUrl: 'https://images.unsplash.com/photo-1628243989859-db92e2de1340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    timeSlot: 'Weekends',
    location: 'Community Garden',
  },
  {
    id: '3',
    title: 'Grocery Delivery Assistant',
    description: 'Help pack and deliver groceries to homebound seniors in your neighborhood.',
    timeCommitment: 'Flexible',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    timeSlot: 'Flexible',
    location: 'Local neighborhoods',
  },
  {
    id: '4',
    title: 'Reading Circle Companion',
    description: 'Lead or join weekly reading circles — share books, stories, and great conversation with seniors.',
    timeCommitment: '1–2 hours / week',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    timeSlot: 'After School',
    location: 'Richmond Senior Center',
  },
  {
    id: '5',
    title: 'Summer Activity Leader',
    description: 'Plan and run fun summer activities — from arts & crafts to outdoor games — for senior residents.',
    timeCommitment: '4–6 hours / week',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    timeSlot: 'Summer',
    location: 'Richmond Senior Center',
  },
  {
    id: '6',
    title: 'Weekend Companion Visit',
    description: 'Drop in for a friendly visit — chat, play cards, or simply keep a senior company on the weekend.',
    timeCommitment: '1–3 hours / weekend',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    timeSlot: 'Weekends',
    location: 'Richmond Senior Center',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading applications:', error);
      return;
    }

    const mappedApplications: Application[] = (data || []).map((app: any) => ({
      id: String(app.id),
      userId: String(app.id),
      userName: app.full_name,
      userEmail: app.email,
      videoUrl: app.video_url,
      age: app.age,
      status: app.status,
      submittedAt: new Date(app.created_at),
      processedAt: app.processed_at ? new Date(app.processed_at) : undefined,
    }));

    setApplications(mappedApplications);
  };

useEffect(() => {
  let mounted = true;

  const loadSession = async () => {
    setAuthLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
    }

    if (!mounted) return;

    if (session?.user) {
      const email = session.user.email || '';

      const { data, error: appError } = await supabase
        .from('volunteer_applications')
        .select('id, full_name, email, status')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (appError) {
        console.error('Error loading volunteer after refresh:', appError);
      }

      if (data) {
        setUser({
          id: String(data.id),
          name: data.full_name,
          email: data.email,
          role: 'volunteer',
          status: data.status,
        });

        if (data.status === 'pending') {
  toast('Your application is still under review.');
}

if (data.status === 'rejected') {
  toast.error('Your application was not approved.');
}

if (data.status === 'approved') {
  toast.success('Welcome! Your application has been approved.');
}

    setAuthLoading(false);
  };

  loadSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const email = session.user.email || '';

      const { data } = await supabase
        .from('volunteer_applications')
        .select('id, full_name, email, status')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setUser({
          id: String(data.id),
          name: data.full_name,
          email: data.email,
          role: 'volunteer',
          status: data.status,
        });
      }
    } else {
      setUser(null);
    }

    setAuthLoading(false);
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

const login = async (
  email: string,
  password: string,
  role: UserRole
) => {
  setAuthLoading(true);

  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      setAuthLoading(false);
      return {
        success: false,
        message: 'Wrong email or password.',
      };
    }

    if (role === 'admin') {
      const isPlatformAdmin = email === 'tasktogethercontact@gmail.com';

      setUser({
        id: authData.user.id,
        name: isPlatformAdmin ? 'Platform Admin' : 'Senior Home Admin',
        email,
        role: 'admin',
        isPlatformAdmin,
      });

      setAuthLoading(false);

      return {
        success: true,
      };
    }

    const { data, error } = await supabase
      .from('volunteer_applications')
      .select('id, full_name, email, status')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      await supabase.auth.signOut();
      setAuthLoading(false);

      return {
        success: false,
        message: 'No application found.',
      };
    }

    if (data.status !== 'approved') {
      await supabase.auth.signOut();
      setAuthLoading(false);

      return {
        success: false,
        message: 'Your application is not approved yet.',
      };
    }

    setUser({
      id: String(data.id),
      name: data.full_name,
      email: data.email,
      role: 'volunteer',
      status: data.status,
    });

    setAuthLoading(false);

    return {
      success: true,
      status: data.status,
    };
  } catch (err) {
    console.error('Login error:', err);
    setAuthLoading(false);

    return {
      success: false,
      message: 'Login failed.',
    };
  }
};
  const register = (name: string, email: string) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      userId: `user-${Date.now()}`,
      userName: name,
      userEmail: email,
      status: 'pending',
      submittedAt: new Date(),
    };

    setApplications(prev => [...prev, newApp]);

    setUser({
      id: newApp.userId,
      name: newApp.userName,
      email: newApp.userEmail,
      role: 'volunteer',
      status: 'pending',
    });

    toast.success('Application submitted successfully!');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  const updateApplicationStatus = async (
    appId: string,
    status: ApplicationStatus
  ) => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('volunteer_applications')
      .update({
        status,
        processed_at: status === 'pending' ? null : now,
      })
      .eq('id', Number(appId))
      .select('id, status, processed_at')
      .maybeSingle();

    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No application was updated.');
    }

    setApplications(prev =>
      prev.map(app =>
        app.id === String(data.id)
          ? {
              ...app,
              status: data.status,
              processedAt: data.processed_at ? new Date(data.processed_at) : undefined,
            }
          : app
      )
    );

    setUser(prev =>
      prev && prev.role === 'volunteer' && prev.id === String(data.id)
        ? { ...prev, status: data.status }
        : prev
    );
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        applications,
        updateApplicationStatus,
        opportunities: MOCK_OPPORTUNITIES,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
