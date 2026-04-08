import { supabase } from '../../lib/supabase';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

// Types
export type UserRole = 'volunteer' | 'admin' | 'platform_admin' | null;
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'not_found';

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
  age?: number;
  status: ApplicationStatus;
  submittedAt: Date;
  processedAt?: Date;
}
interface AuthContextType {
  user: User | null;
  login: (
  email: string,
  role: UserRole
) => Promise<{
  success: boolean;
  status?: ApplicationStatus;
  message?: string;
}>;
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
  age: app.age,
  status: app.status,
  submittedAt: new Date(app.created_at),
  processedAt: app.processed_at ? new Date(app.processed_at) : undefined,
}));
    setApplications(mappedApplications);
  };

  useEffect(() => {
  fetchApplications();
  
  useEffect(() => {
  if (!user?.email || user.role !== 'volunteer') return;

  const channel = supabase
    .channel('volunteer-status-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'volunteer_applications',
      },
      (payload) => {
        const updated = payload.new as {
          id: number;
          email: string;
          status: ApplicationStatus;
        };

        if (updated.email !== user.email) return;

        setUser(prev =>
          prev
            ? {
                ...prev,
                id: String(updated.id),
                status: updated.status,
              }
            : prev
        );

        setApplications(prev =>
          prev.map(app =>
            app.id === String(updated.id)
              ? { ...app, status: updated.status }
              : app
          )
        );

        if (updated.status === 'approved') {
          toast.success('Your application has been approved!');
        }

        if (updated.status === 'rejected') {
          toast.error('Your application was not approved at this time.');
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.email, user?.role]);

  const interval = setInterval(() => {
    fetchApplications();

    setUser(currentUser => {
      if (currentUser?.role === 'volunteer' && currentUser.email) {
        refreshVolunteerStatus(currentUser.email);
      }
      return currentUser;
    });
  }, 10000);

  return () => clearInterval(interval);
}, []);
const refreshVolunteerStatus = async (email: string) => {
  const { data, error } = await supabase
    .from('volunteer_applications')
    .select('id, full_name, email, status, created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error refreshing volunteer status:', error);
    return;
  }

  if (!data) {
    setUser(prev =>
      prev
        ? {
            ...prev,
            status: 'not_found',
          }
        : null
    );
    return;
  }

  setUser(prev =>
    prev
      ? {
          ...prev,
          id: String(data.id),
          name: data.full_name,
          email: data.email,
          status: data.status,
        }
      : null
  );
};  
  const login = async (email: string, role: UserRole) => {
  if (role === 'admin') {
    const isPlatformAdmin = email === 'tasktogethercontact@gmail.com';

    setUser({
      id: 'admin-1',
      name: isPlatformAdmin ? 'Platform Admin' : 'Senior Home Admin',
      email,
      role: 'admin',
      isPlatformAdmin,
    });

    toast.success(`Logged in as ${isPlatformAdmin ? 'Platform' : 'Senior Home'} Admin`);

    return {
      success: true,
    };
  }

  if (role === 'volunteer') {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .select('id, full_name, email, status, created_at')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error checking volunteer status:', error);
      toast.error('Could not check application status');
      return {
        success: false,
        message: 'Could not check application status',
      };
    }

    if (!data) {
      setUser({
        id: 'not-found-' + Date.now(),
        name: 'Volunteer',
        email,
        role: 'volunteer',
        status: 'not_found',
      });

      toast.error('No application found for that email');

      return {
        success: true,
        status: 'not_found',
      };
    }

    setUser({
      id: String(data.id),
      name: data.full_name,
      email: data.email,
      role: 'volunteer',
      status: data.status,
    });

    if (data.status === 'approved') {
      toast.success('Your application has been approved!');
    } else if (data.status === 'rejected') {
      toast.error('Your application was not approved at this time.');
    } else {
      toast.success('Your application is under review.');
    }

    return {
      success: true,
      status: data.status,
    };
  }

  return {
    success: false,
    message: 'Invalid role selected',
  };
};
      // Check if user exists in applications to determine status
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
    ? {
        ...prev,
        status: data.status,
      }
    : prev
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
