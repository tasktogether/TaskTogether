import { supabase } from '../../lib/supabase';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export type UserRole = 'volunteer' | 'admin' | 'platform_admin' | null;
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: ApplicationStatus; // Only for volunteers
  totalHours?: number; // Track volunteer hours
  joinDate?: string; // When they joined
  preferredSeniorHomeIds?: string[]; // Multiple preferred senior homes for volunteers
  seniorHomeId?: string; // For senior home admins - which home they manage
  isPlatformAdmin?: boolean; // True for main platform admins who can manage everything
}

export interface SeniorHome {
  id: string;
  name: string;
  city: string;
  state: string;
  contactPerson: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  timeCommitment: string;
  imageUrl: string;
  timeSlot: 'After School' | 'Weekends' | 'Summer' | 'Flexible';
  location: string;
  seniorHomeId?: string; // Which senior home posted this opportunity
  seniorHomeName?: string; // For display
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  videoUrl?: string;
  age?: number;   // ← ADD THIS LINE
  status: ApplicationStatus;
  submittedAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  register: (name: string, email: string) => void;
  updateUser: (updates: Partial<User>) => void;
  // Admin functions (simulated)
  applications: Application[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  opportunities: Opportunity[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Data
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
  age: app.age,   // ← ADD THIS LINE
  status: app.status,
  submittedAt: new Date(app.created_at),
}));

    setApplications(mappedApplications);
  };

  useEffect(() => {
    fetchApplications();

    const interval = setInterval(() => {
      fetchApplications();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  
  const login = (email: string, role: UserRole) => {
    // Simulated login logic
    if (role === 'admin') {
      // Check if this is the platform creator/admin (hardcoded for demo)
      // In production, this would be checked against a database
      const isPlatformAdmin = email === 'tasktogethercontact@gmail.com';
      
      setUser({
        id: 'admin-1',
        name: isPlatformAdmin ? 'Platform Admin' : 'Senior Home Admin',
        email,
        role: 'admin',
        isPlatformAdmin,
      });
      toast.success(`Logged in as ${isPlatformAdmin ? 'Platform' : 'Senior Home'} Admin`);
    } else {
      // Check if user exists in applications to determine status
      const existingApp = applications.find(app => app.userEmail === email);
      
      setUser({
        id: existingApp ? existingApp.userId : 'user-' + Date.now(),
        name: existingApp ? existingApp.userName : 'New Volunteer',
        email,
        role: 'volunteer',
        status: existingApp ? existingApp.status : 'pending',
      });
      toast.success(`Welcome back! Status: ${existingApp ? existingApp.status : 'Pending'}`);
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
    setApplications([...applications, newApp]);
    
    // Auto login
    setUser({
      id: newApp.userId,
      name: newApp.userName,
      email: newApp.userEmail,
      role: 'volunteer',
      status: 'pending',
    });
    fetchApplications();
    toast.success('Application submitted successfully!');
  };

  const logout = () => {
    setUser(null);
    toast.info('Logged out');
  };
const updateApplicationStatus = async (
  appId: string,
  status: 'pending' | 'approved' | 'rejected'
) => {
  console.log('Updating application:', { appId, status, appIdType: typeof appId });

  const { data, error } = await supabase
  .from('volunteer_applications')
  .update({ status })
  .eq('id', Number(appId))
  .select('id, status')
  .maybeSingle();

  console.log('Supabase update result:', { data, error });

  if (error) {
    console.error('Error updating application status:', error);
    toast.error(`Supabase update failed: ${error.message}`);
    throw error;
  }

  if (!data) {
    const message =
      'No row was updated. This usually means RLS blocked the update or the id did not match.';
    console.error(message, { appId, status });
    toast.error(message);
    throw new Error(message);
  }

  setApplications(prev =>
    prev.map(app =>
      app.id === String(data.id) ? { ...app, status: data.status } : app
    )
  );

  toast.success(`Application ${data.status}`);
};
  const updateUser = (updates: Partial<User>) => {
  setUser(prev => (prev ? { ...prev, ...updates } : null));
  toast.success('Profile updated successfully!');
};

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      updateUser,
      applications, 
      updateApplicationStatus,
      opportunities: MOCK_OPPORTUNITIES 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    console.error("useAuth called outside AuthProvider");
    throw new Error('useAuth must be used within an AuthProvider');
  }

  console.log("Auth context loaded:", context);

  return context;
};
