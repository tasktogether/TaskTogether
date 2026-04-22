import { supabase } from '../../lib/supabase';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type UserRole = 'volunteer' | 'director' | null;
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'not_found';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: ApplicationStatus;
  totalHours?: number;
  joinDate?: string;
}

export interface Opportunity {
  id: number;
  title: string;
  description: string;
  opportunity_date: string;
  time_commitment: string;
  location: string;
  volunteer_limit: number;
  current_volunteers?: number;
  signups?: { volunteer_name: string; volunteer_email: string }[];
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
  createOpportunity: (newOpp: {
  title: string;
  description: string;
  opportunity_date: string;
  time_commitment: string;
  location: string;
  volunteer_limit: number;
}) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string) => void;
  updateUser: (updates: Partial<User>) => void;
  applications: Application[];
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  opportunities: Opportunity[];
  authLoading: boolean;
  deleteOpportunity: (id: number) => Promise<void>;
  signUpForOpportunity: (
  opportunityId: number,
  volunteerName: string,
  volunteerEmail: string
) => Promise<void>;
  updateOpportunity: (
  id: number,
  updates: {
    title?: string;
    description?: string;
    opportunity_date?: string;
    time_commitment?: string;
    location?: string;
    volunteer_limit?: number;
  }
) => Promise<void>;
removeVolunteerFromOpportunity: (
  opportunityId: number,
  volunteerEmail: string
) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const DIRECTOR_SESSION_KEY = 'tasktogether_director_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
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

  const fetchOpportunities = async () => {
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
  *,
  opportunity_signups(
    volunteer_name,
    volunteer_email
  )
`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading opportunities:', error);
      return;
    }

    const mappedOpportunities = (data || []).map((opp: any) => ({
  ...opp,
  current_volunteers: opp.opportunity_signups?.length || 0,
  signups: opp.opportunity_signups || [],
}));

    setOpportunities(mappedOpportunities);
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
const savedDirectorSession = localStorage.getItem(DIRECTOR_SESSION_KEY);

if (savedDirectorSession) {
  setUser({
    id: 'director-1',
    name: 'Richmond Senior Center Director',
    email: 'tasktogethercontact@gmail.com',
    role: 'director',
  });
  setAuthLoading(false);
  return;
}
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
      } else {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Volunteer',
          email,
          role: 'volunteer',
        });
      }
    } else {
      setUser(null);
    }

    setAuthLoading(false);
  };

  loadSession();

  fetchApplications();
fetchOpportunities();

  const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(async (_event, session) => {
  const savedDirectorSession = localStorage.getItem(DIRECTOR_SESSION_KEY);

  if (savedDirectorSession && !session?.user) {
    setUser({
      id: 'director-1',
      name: 'Richmond Senior Center Director',
      email: 'tasktogethercontact@gmail.com',
      role: 'director',
    });
    setAuthLoading(false);
    return;
  }

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
    } else {
      setUser({
        id: session.user.id,
        name: session.user.user_metadata?.name || 'Volunteer',
        email,
        role: 'volunteer',
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
  role: 'volunteer' | 'director'
) => {
  setAuthLoading(true);

  try {
    // DIRECTOR LOGIN
    if (role === 'director') {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.user) {
        return {
          success: false,
          message: 'Wrong director email or password.',
        };
      }

      setUser({
        id: authData.user.id,
        name: 'Richmond Senior Center Director',
        email: authData.user.email || email,
        role: 'director',
      });

      return {
        success: true,
      };
    }

    // VOLUNTEER LOGIN
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }

    setUser({
      id: authData.user.id,
      name: authData.user.user_metadata?.name || 'Volunteer',
      email: authData.user.email || email,
      role: 'volunteer',
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Login failed:', error);

    return {
      success: false,
      message: 'Login failed. Please try again.',
    };
  } finally {
    setAuthLoading(false);
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
    fetchOpportunities();
  };
const logout = async () => {
  localStorage.removeItem(DIRECTOR_SESSION_KEY);
  await supabase.auth.signOut();
  setUser(null);
  toast.success('You have been logged out.');
  window.location.href = '/';
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
    )
  };
const createOpportunity = async (newOpp: {
  title: string;
  description: string;
  opportunity_date: string;
  time_commitment: string;
  location: string;
  volunteer_limit: number;
}) => {
  if (
    !newOpp.title.trim() ||
    !newOpp.description.trim() ||
    !newOpp.opportunity_date.trim() ||
    !newOpp.time_commitment.trim()
  ) {
    throw new Error('Please fill in all required fields.');
  }

  if (newOpp.volunteer_limit < 1) {
    throw new Error('Volunteer limit must be at least 1.');
  }

  const { error } = await supabase.from('opportunities').insert([
    {
      title: newOpp.title.trim(),
      description: newOpp.description.trim(),
      opportunity_date: newOpp.opportunity_date.trim(),
      time_commitment: newOpp.time_commitment.trim(),
      location: 'Richmond Senior Center',
      volunteer_limit: newOpp.volunteer_limit,
    },
  ]);

  if (error) {
    console.error('Error creating opportunity:', error);
    throw new Error(error.message || 'Failed to create opportunity.');
  }

  await fetchOpportunities();
};
const deleteOpportunity = async (id: number) => {
  const { error } = await supabase
    .from('opportunities')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting opportunity:', error);
    toast.error('Failed to delete opportunity.');
    return;
  }

  toast.success('Opportunity deleted.');
  fetchOpportunities();
};
const updateOpportunity = async (
  id: number,
  updates: {
    title?: string;
    description?: string;
    opportunity_date?: string;
    time_commitment?: string;
    location?: string;
    volunteer_limit?: number;
  }
) => {
  const cleanedUpdates = {
    ...updates,
    title: updates.title?.trim(),
    description: updates.description?.trim(),
    opportunity_date: updates.opportunity_date?.trim(),
    time_commitment: updates.time_commitment?.trim(),
    location: 'Richmond Senior Center',
  };

  if (
    !cleanedUpdates.title ||
    !cleanedUpdates.description ||
    !cleanedUpdates.opportunity_date ||
    !cleanedUpdates.time_commitment
  ) {
    toast.error('All opportunity fields are required.');
    return;
  }

  if (
    cleanedUpdates.volunteer_limit !== undefined &&
    cleanedUpdates.volunteer_limit < 1
  ) {
    toast.error('Volunteer limit must be at least 1.');
    return;
  }

  const { error } = await supabase
    .from('opportunities')
    .update(cleanedUpdates)
    .eq('id', id);

  if (error) {
    console.error('Error updating opportunity:', error);
    toast.error('Failed to update opportunity.');
    return;
  }

  toast.success('Opportunity updated!');
  fetchOpportunities();
};

const signUpForOpportunity = async (
  opportunityId: number,
  volunteerName: string,
  volunteerEmail: string
) => {
  if (!volunteerName.trim() || !volunteerEmail.trim()) {
    toast.error('Missing volunteer information.');
    return;
  }

  const selectedOpportunity = opportunities.find(
    o => o.id === opportunityId
  );

  if (!selectedOpportunity) {
    toast.error('Opportunity not found.');
    return;
  }

  if (
    (selectedOpportunity.current_volunteers || 0) >=
    selectedOpportunity.volunteer_limit
  ) {
    toast.error('This opportunity is already full.');
    return;
  }

  const { data: existingSignup, error: existingSignupError } =
    await supabase
      .from('opportunity_signups')
      .select('id')
      .eq('opportunity_id', opportunityId)
      .eq('volunteer_email', volunteerEmail)
      .maybeSingle();

  if (existingSignupError) {
    console.error('Error checking signup:', existingSignupError);
    toast.error('Could not check existing signup.');
    return;
  }

  if (existingSignup) {
    toast.error('You already signed up for this opportunity.');
    return;
  }

  const { error } = await supabase
    .from('opportunity_signups')
    .insert([
      {
        opportunity_id: opportunityId,
        volunteer_name: volunteerName.trim(),
        volunteer_email: volunteerEmail.trim(),
      },
    ]);

  if (error) {
    console.error('Signup failed:', error);
    toast.error('Failed to sign up.');
    return;
  }

  toast.success('You successfully signed up!');
  fetchOpportunities();
};

const removeVolunteerFromOpportunity = async (
  opportunityId: number,
  volunteerEmail: string
) => {
  const confirmed = window.confirm(
    'Remove this volunteer from the opportunity?'
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from('opportunity_signups')
    .delete()
    .eq('opportunity_id', opportunityId)
    .eq('volunteer_email', volunteerEmail);

  if (error) {
    console.error('Remove failed:', error);
    toast.error('Failed to remove volunteer.');
    return;
  }

  toast.success('Volunteer removed.');
  fetchOpportunities();
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
  opportunities,
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
  signUpForOpportunity,
  removeVolunteerFromOpportunity,
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
