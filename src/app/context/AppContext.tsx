import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

export type VolunteerStatus = 'pending' | 'approved' | 'rejected';

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  guardianName: string | null;
  guardianEmail: string | null;
  videoFileName: string | null;
  status: VolunteerStatus;
  appliedAt: string;
  assignedOpportunities: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  timeCommitment: string;
  date: string;
  category: string;
  volunteerLimit: number;
  currentVolunteers: number;
}

interface AppContextType {
  volunteers: Volunteer[];
  opportunities: Opportunity[];
  currentVolunteer: Volunteer | null;
  isAdminLoggedIn: boolean;
  addVolunteer: (data: Omit<Volunteer, 'id' | 'status' | 'appliedAt' | 'assignedOpportunities'>) => void;
  updateVolunteerStatus: (id: string, status: VolunteerStatus) => void;
  loginVolunteer: (email: string, password: string) => { success: boolean; message: string };
  logoutVolunteer: () => void;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  addOpportunity: (data: Omit<Opportunity, 'id' | 'currentVolunteers'>) => void;
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  applyForOpportunity: (volunteerId: string, opportunityId: string) => void;
}

const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    password: 'Password123',
    age: 16,
    guardianName: 'Mary Johnson',
    guardianEmail: 'mary.johnson@example.com',
    videoFileName: 'emma_intro.mp4',
    status: 'pending',
    appliedAt: '2026-02-10',
    assignedOpportunities: [],
  },
  {
    id: 'v2',
    name: 'Liam Chen',
    email: 'liam@example.com',
    password: 'Password123',
    age: 17,
    guardianName: 'Wei Chen',
    guardianEmail: 'wei.chen@example.com',
    videoFileName: 'liam_intro.mp4',
    status: 'approved',
    appliedAt: '2026-02-05',
    assignedOpportunities: ['o1', 'o3'],
  },
  {
    id: 'v3',
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    password: 'Password123',
    age: 18,
    guardianName: null,
    guardianEmail: null,
    videoFileName: null,
    status: 'rejected',
    appliedAt: '2026-02-08',
    assignedOpportunities: [],
  },
  {
    id: 'v4',
    name: 'Noah Williams',
    email: 'noah@example.com',
    password: 'Password123',
    age: 15,
    guardianName: 'James Williams',
    guardianEmail: 'james.w@example.com',
    videoFileName: 'noah_intro.mp4',
    status: 'pending',
    appliedAt: '2026-02-12',
    assignedOpportunities: [],
  },
  {
    id: 'v5',
    name: 'Olivia Brown',
    email: 'olivia@example.com',
    password: 'Password123',
    age: 17,
    guardianName: 'Patricia Brown',
    guardianEmail: 'pat.brown@example.com',
    videoFileName: 'olivia_intro.mp4',
    status: 'approved',
    appliedAt: '2026-02-01',
    assignedOpportunities: ['o2'],
  },
  {
    id: 'v6',
    name: 'Aiden Park',
    email: 'aiden@example.com',
    password: 'Password123',
    age: 16,
    guardianName: 'Soo-Jin Park',
    guardianEmail: 'soojin.p@example.com',
    videoFileName: null,
    status: 'pending',
    appliedAt: '2026-02-15',
    assignedOpportunities: [],
  },
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'example-opp-1',
    title: 'Technology Tutor',
    description: 'Teach seniors how to use smartphones, tablets, video calling apps, and social media to stay connected with their loved ones and the world around them.',
    location: 'Richmond Senior Center',
    timeCommitment: '2 hrs/week',
    date: '2026-04-15',
    category: 'Technology',
    volunteerLimit: 8,
    currentVolunteers: 0,
  },
  {
    id: 'example-opp-2',
    title: 'Friendly Visitor & Companion',
    description: 'Spend quality time with isolated seniors through friendly conversation, board games, art activities, and more. Your presence truly makes a difference.',
    location: 'Richmond Senior Center',
    timeCommitment: '1-2 hrs/week',
    date: '2026-04-20',
    category: 'Companionship',
    volunteerLimit: 10,
    currentVolunteers: 0,
  },
];

const ADMIN_EMAIL = 'admin@tasktogether.org';
const ADMIN_PASSWORD = 'Admin123!';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(() => {
    try {
      const saved = localStorage.getItem('tt_volunteers');
      return saved ? JSON.parse(saved) : MOCK_VOLUNTEERS;
    } catch { return MOCK_VOLUNTEERS; }
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem('tt_opportunities');
      return saved ? JSON.parse(saved) : MOCK_OPPORTUNITIES;
    } catch { return MOCK_OPPORTUNITIES; }
  });

  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(() => {
    try {
      const saved = localStorage.getItem('tt_current_volunteer');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('tt_admin_logged_in') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('tt_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  useEffect(() => {
    localStorage.setItem('tt_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    if (currentVolunteer) {
      localStorage.setItem('tt_current_volunteer', JSON.stringify(currentVolunteer));
    } else {
      localStorage.removeItem('tt_current_volunteer');
    }
  }, [currentVolunteer]);

  useEffect(() => {
    localStorage.setItem('tt_admin_logged_in', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const addVolunteer = (data: Omit<Volunteer, 'id' | 'status' | 'appliedAt' | 'assignedOpportunities'>) => {
    const newVolunteer: Volunteer = {
      ...data,
      id: `v${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
      assignedOpportunities: [],
    };
    setVolunteers(prev => [...prev, newVolunteer]);
  };

  const updateVolunteerStatus = (id: string, status: VolunteerStatus) => {
    const volunteer = volunteers.find(v => v.id === id);
    
    setVolunteers(prev =>
      prev.map(v => v.id === id ? { ...v, status } : v)
    );

    // Send approval email if status is approved
    if (status === 'approved' && volunteer) {
      sendApprovalEmail(volunteer.email, volunteer.name);
    }
  };

  // Helper function to send approval email
  const sendApprovalEmail = async (email: string, name: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/send-approval-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ to: email, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to send approval email:', data);
        toast.error('Volunteer approved, but email notification failed');
        return;
      }

      console.log('Approval email sent successfully to', email);
      toast.success(`📧 Approval email sent to ${name}!`);
    } catch (error) {
      console.error('Error sending approval email:', error);
      toast.error('Volunteer approved, but email notification failed');
    }
  };

  const loginVolunteer = (email: string, password: string): { success: boolean; message: string } => {
    const volunteer = volunteers.find(v => v.email.toLowerCase() === email.toLowerCase());
    if (!volunteer) return { success: false, message: 'No account found with that email address.' };
    if (volunteer.password !== password) return { success: false, message: 'Incorrect password. Please try again.' };
    if (volunteer.status === 'pending') return { success: false, message: 'Your application is still being carefully reviewed. Please check back soon! 💜' };
    if (volunteer.status === 'rejected') return { success: false, message: 'Unfortunately, your application was not approved at this time. Please contact us for more information.' };
    setCurrentVolunteer(volunteer);
    return { success: true, message: 'Welcome back!' };
  };

  const logoutVolunteer = () => setCurrentVolunteer(null);

  const loginAdmin = (email: string, password: string): boolean => {
    if (email === tasktogethercontact@gmail.com && password === TaskTogether123$) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdminLoggedIn(false);

  const addOpportunity = (data: Omit<Opportunity, 'id' | 'currentVolunteers'>) => {
    const newOpp: Opportunity = {
      ...data,
      id: `o${Date.now()}`,
      currentVolunteers: 0,
    };
    setOpportunities(prev => [...prev, newOpp]);
  };

  const updateOpportunity = (id: string, data: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const applyForOpportunity = (volunteerId: string, opportunityId: string) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    const opportunity = opportunities.find(o => o.id === opportunityId);
    
    setVolunteers(prev =>
      prev.map(v => {
        if (v.id === volunteerId && !v.assignedOpportunities.includes(opportunityId)) {
          const updated = { ...v, assignedOpportunities: [...v.assignedOpportunities, opportunityId] };
          if (currentVolunteer?.id === volunteerId) setCurrentVolunteer(updated);
          return updated;
        }
        return v;
      })
    );
    setOpportunities(prev =>
      prev.map(o => o.id === opportunityId ? { ...o, currentVolunteers: o.currentVolunteers + 1 } : o)
    );

    // Send task assignment email
    if (volunteer && opportunity) {
      sendTaskAssignmentEmail(
        volunteer.email,
        volunteer.name,
        opportunity.title,
        opportunity.date,
        opportunity.location,
        opportunity.description
      );
    }
  };

  // Helper function to send task assignment email
  const sendTaskAssignmentEmail = async (
    email: string,
    name: string,
    taskTitle: string,
    taskDate: string,
    taskLocation: string,
    taskDescription: string
  ) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/send-task-assignment-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            to: email,
            name,
            taskTitle,
            taskDate,
            taskLocation,
            taskDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to send task assignment email:', data);
        // Don't show error toast to user, just log it
        return;
      }

      console.log('Task assignment email sent successfully to', email);
      toast.success(`📧 Task details sent to your email!`);
    } catch (error) {
      console.error('Error sending task assignment email:', error);
      // Don't show error toast to user, just log it
    }
  };

  return (
    <AppContext.Provider value={{
      volunteers, opportunities, currentVolunteer, isAdminLoggedIn,
      addVolunteer, updateVolunteerStatus, loginVolunteer, logoutVolunteer,
      loginAdmin, logoutAdmin, addOpportunity, updateOpportunity, deleteOpportunity,
      applyForOpportunity,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
