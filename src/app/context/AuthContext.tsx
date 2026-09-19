import { supabase } from '../../lib/supabase';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { toast } from 'sonner';

export type UserRole = 'volunteer' | 'director' | null;
export type ApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'not_found';

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
  schedule_type?: 'specific' | 'flexible';

  // Director-only fields loaded from opportunity_contacts
  senior_name?: string;
  senior_email?: string;
  senior_phone?: string;

  current_volunteers?: number;
  signups?: {
    volunteer_name: string;
    volunteer_email: string;
    is_adult?: boolean;
    one_on_one_opt_in?: boolean;
    background_check_completed?: boolean;
  }[];
  status?: string;
  adult_volunteers?: number;
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
    schedule_type: 'specific' | 'flexible';
    senior_name?: string;
    senior_email?: string;
    senior_phone?: string;
  }) => Promise<void>;

  logout: () => Promise<void>;
  register: (name: string, email: string) => void;
  updateUser: (updates: Partial<User>) => void;

  applications: Application[];

  updateApplicationStatus: (
    appId: string,
    status: ApplicationStatus
  ) => Promise<void>;

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
      schedule_type?: 'specific' | 'flexible';
      senior_name?: string;
      senior_email?: string;
      senior_phone?: string;
    }
  ) => Promise<void>;

  removeVolunteerFromOpportunity: (
    opportunityId: number,
    volunteerEmail: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DIRECTOR_SESSION_KEY = 'tasktogether_director_session';
const DIRECTOR_EMAIL = 'tasktogethercontact@gmail.com';

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [authLoading, setAuthLoading] = useState(true);

  /*
   * APPLICATIONS
   */

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading applications:', error);
      return;
    }

    const mappedApplications: Application[] = (data || []).map(
      (app: any) => ({
        id: String(app.id),
        userId: String(app.id),
        userName: app.full_name,
        userEmail: app.email,
        videoUrl: app.video_url,
        age: app.age,
        status: app.status,
        submittedAt: new Date(app.created_at),
        processedAt: app.processed_at
          ? new Date(app.processed_at)
          : undefined,
      })
    );

    setApplications(mappedApplications);
  };

  /*
   * OPPORTUNITIES
   */

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

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    let contacts: any[] = [];

    // Only the real authenticated director can read private contact info.
    if (authUser?.email === DIRECTOR_EMAIL) {
      const { data: contactData, error: contactError } =
        await supabase
          .from('opportunity_contacts')
          .select('*');

      if (contactError) {
        console.error(
          'Error loading opportunity contacts:',
          contactError
        );
      } else {
        contacts = contactData || [];
      }
    }

    const mappedOpportunities = (data || []).map((opp: any) => {
      const signups = opp.opportunity_signups || [];

      const contact = contacts.find(
        (item: any) => item.opportunity_id === opp.id
      );

      return {
        ...opp,

        ...(authUser?.email === DIRECTOR_EMAIL
          ? {
              senior_name: contact?.senior_name || '',
              senior_email: contact?.senior_email || '',
              senior_phone: contact?.senior_phone || '',
            }
          : {}),

        current_volunteers: signups.length,
        adult_volunteers: 0,
        signups,
      };
    });

    setOpportunities(mappedOpportunities);
  };

  /*
   * SESSION / AUTH
   */

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

      const savedDirectorSession = localStorage.getItem(
        DIRECTOR_SESSION_KEY
      );

      if (savedDirectorSession) {
        setUser({
          id: 'director-1',
          name: 'Richmond Senior Center Director',
          email: DIRECTOR_EMAIL,
          role: 'director',
        });

        setAuthLoading(false);
        return;
      }

      if (session?.user) {
        const email = session.user.email || '';

        if (email === DIRECTOR_EMAIL) {
          setUser({
            id: session.user.id,
            name: 'Richmond Senior Center Director',
            email,
            role: 'director',
          });

          setAuthLoading(false);
          return;
        }

        const {
          data,
          error: appError,
        } = await supabase
          .from('volunteer_applications')
          .select(
            'id, full_name, email, status'
          )
          .eq('email', email)
          .order('created_at', {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (appError) {
          console.error(
            'Error loading volunteer after refresh:',
            appError
          );
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
            toast(
              'Your application is still under review.'
            );
          }

          if (data.status === 'rejected') {
            toast.error(
              'Your application was not approved.'
            );
          }

          if (data.status === 'approved') {
            toast.success(
              'Welcome! Your application has been approved.'
            );
          }
        } else {
          setUser({
            id: session.user.id,
            name:
              session.user.user_metadata?.name ||
              'Volunteer',
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
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const savedDirectorSession =
          localStorage.getItem(
            DIRECTOR_SESSION_KEY
          );

        if (
          savedDirectorSession &&
          !session?.user
        ) {
          setUser({
            id: 'director-1',
            name:
              'Richmond Senior Center Director',
            email: DIRECTOR_EMAIL,
            role: 'director',
          });

          setAuthLoading(false);
          return;
        }

        if (session?.user) {
          const email =
            session.user.email || '';

          if (email === DIRECTOR_EMAIL) {
            setUser({
              id: session.user.id,
              name:
                'Richmond Senior Center Director',
              email,
              role: 'director',
            });

            setAuthLoading(false);
            return;
          }

          const { data } = await supabase
            .from('volunteer_applications')
            .select(
              'id, full_name, email, status'
            )
            .eq('email', email)
            .order('created_at', {
              ascending: false,
            })
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
              name:
                session.user.user_metadata?.name ||
                'Volunteer',
              email,
              role: 'volunteer',
            });
          }
        } else {
          setUser(null);
        }

        setAuthLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * LOGIN
   */

  const login = async (
    email: string,
    password: string,
    role: 'volunteer' | 'director'
  ) => {
    setAuthLoading(true);

    try {
      const {
        data: authData,
        error: authError,
      } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.user) {
        return {
          success: false,
          message:
            role === 'director'
              ? 'Wrong director email or password.'
              : 'Wrong email or password.',
        };
      }

      const signedInEmail =
        authData.user.email || email;

      if (role === 'director') {
        if (
          signedInEmail !== DIRECTOR_EMAIL
        ) {
          await supabase.auth.signOut();

          return {
            success: false,
            message:
              'Wrong director email or password.',
          };
        }

        setUser({
          id: authData.user.id,
          name:
            'Richmond Senior Center Director',
          email: signedInEmail,
          role: 'director',
        });

        return {
          success: true,
        };
      }

      const {
        data: application,
        error: appError,
      } = await supabase
        .from('volunteer_applications')
        .select(
          'id, full_name, email, status'
        )
        .eq('email', signedInEmail)
        .order('created_at', {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (appError) {
        console.error(
          'Error loading volunteer application:',
          appError
        );

        await supabase.auth.signOut();

        return {
          success: false,
          message:
            'Could not verify your application.',
        };
      }

      if (!application) {
        await supabase.auth.signOut();

        return {
          success: false,
          message:
            'No volunteer application was found for this account.',
        };
      }

      if (
        application.status !== 'approved'
      ) {
        await supabase.auth.signOut();

        return {
          success: false,
          message:
            application.status === 'pending'
              ? 'Your application is still under review.'
              : 'Your application has not been approved.',
        };
      }

      setUser({
        id: String(application.id),
        name: application.full_name,
        email: application.email,
        role: 'volunteer',
        status: application.status,
      });

      return {
        success: true,
        status: application.status,
      };
    } catch (error: any) {
      console.error('Login failed:', error);

      return {
        success: false,
        message:
          'Login failed. Please try again.',
      };
    } finally {
      setAuthLoading(false);
    }
  };

  /*
   * REGISTER
   */

  const register = (
    name: string,
    email: string
  ) => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      userId: `user-${Date.now()}`,
      userName: name,
      userEmail: email,
      status: 'pending',
      submittedAt: new Date(),
    };

    setApplications(prev => [
      ...prev,
      newApp,
    ]);

    setUser({
      id: newApp.userId,
      name: newApp.userName,
      email: newApp.userEmail,
      role: 'volunteer',
      status: 'pending',
    });

    toast.success(
      'Application submitted successfully!'
    );

    fetchOpportunities();
  };

  /*
   * LOGOUT
   */

  const logout = async () => {
    await supabase.auth.signOut();

    setUser(null);

    toast.success(
      'You have been logged out.'
    );
  };

  /*
   * APPLICATION STATUS
   */

  const updateApplicationStatus = async (
    appId: string,
    status: ApplicationStatus
  ) => {
    const processedAt =
      status === 'pending'
        ? null
        : new Date().toISOString();

    const { error } = await supabase
      .from('volunteer_applications')
      .update({
        status,
        processed_at: processedAt,
      })
      .eq('id', appId);

    if (error) {
      console.error(
        'Error updating application status:',
        error
      );

      throw error;
    }

    await fetchApplications();
  };

  /*
   * CREATE OPPORTUNITY
   */

  const createOpportunity = async (
    newOpp: {
      title: string;
      description: string;
      opportunity_date: string;
      time_commitment: string;
      location: string;
      volunteer_limit: number;
      schedule_type:
        | 'specific'
        | 'flexible';
      senior_name?: string;
      senior_email?: string;
      senior_phone?: string;
    }
  ) => {
    if (
      !newOpp.title.trim() ||
      !newOpp.description.trim()
    ) {
      throw new Error(
        'Please fill in all required fields.'
      );
    }

    if (
      newOpp.schedule_type ===
        'specific' &&
      (!newOpp.opportunity_date.trim() ||
        !newOpp.time_commitment.trim())
    ) {
      throw new Error(
        'Please provide a date and time for a specific opportunity.'
      );
    }

    if (newOpp.volunteer_limit < 1) {
      throw new Error(
        'Volunteer limit must be at least 1.'
      );
    }

    const { data, error } =
      await supabase
        .from('opportunities')
        .insert([
          {
            title:
              newOpp.title.trim(),
            description:
              newOpp.description.trim(),
            opportunity_date:
              newOpp.opportunity_date.trim() ||
              new Date()
                .toISOString()
                .split('T')[0],
            time_commitment:
              newOpp.time_commitment.trim() ||
              'Flexible — based on volunteer availability',
            location:
              'Richmond Senior Center',
            volunteer_limit:
              newOpp.volunteer_limit,
            schedule_type:
              newOpp.schedule_type,
          },
        ])
        .select('id')
        .single();

    if (error || !data) {
      console.error(
        'Error creating opportunity:',
        error
      );

      throw new Error(
        error?.message ||
          'Failed to create opportunity.'
      );
    }

    const hasContactInfo =
      newOpp.senior_name?.trim() ||
      newOpp.senior_email?.trim() ||
      newOpp.senior_phone?.trim();

    if (hasContactInfo) {
      const {
        error: contactError,
      } = await supabase
        .from('opportunity_contacts')
        .insert({
          opportunity_id: data.id,
          senior_name:
            newOpp.senior_name?.trim() ||
            null,
          senior_email:
            newOpp.senior_email?.trim() ||
            null,
          senior_phone:
            newOpp.senior_phone?.trim() ||
            null,
        });

      if (contactError) {
        console.error(
          'Error saving private contact info:',
          contactError
        );

        throw new Error(
          'Opportunity created, but contact information could not be saved.'
        );
      }
    }

    await fetchOpportunities();
  };

  /*
   * UPDATE OPPORTUNITY
   */

  const updateOpportunity = async (
    id: number,
    updates: {
      title?: string;
      description?: string;
      opportunity_date?: string;
      time_commitment?: string;
      location?: string;
      volunteer_limit?: number;
      schedule_type?:
        | 'specific'
        | 'flexible';
      senior_name?: string;
      senior_email?: string;
      senior_phone?: string;
    }
  ) => {
    const cleanedUpdates = {
      title: updates.title?.trim(),
      description:
        updates.description?.trim(),
      opportunity_date:
        updates.schedule_type ===
        'flexible'
          ? new Date()
              .toISOString()
              .split('T')[0]
          : updates.opportunity_date?.trim(),
      time_commitment:
        updates.schedule_type ===
        'flexible'
          ? 'Flexible — based on volunteer availability'
          : updates.time_commitment?.trim(),
      location:
        'Richmond Senior Center',
      volunteer_limit:
        updates.volunteer_limit,
      schedule_type:
        updates.schedule_type,
    };

    if (
      !cleanedUpdates.title ||
      !cleanedUpdates.description
    ) {
      toast.error(
        'Title and description are required.'
      );
      return;
    }

    if (
      cleanedUpdates.schedule_type ===
        'specific' &&
      (!cleanedUpdates.opportunity_date ||
        !cleanedUpdates.time_commitment)
    ) {
      toast.error(
        'A specific opportunity requires a date and time.'
      );
      return;
    }

    if (
      cleanedUpdates.volunteer_limit !==
        undefined &&
      cleanedUpdates.volunteer_limit < 1
    ) {
      toast.error(
        'Volunteer limit must be at least 1.'
      );
      return;
    }

    const { error } = await supabase
      .from('opportunities')
      .update(cleanedUpdates)
      .eq('id', id);

    if (error) {
      console.error(
        'Error updating opportunity:',
        error
      );

      toast.error(
        'Failed to update opportunity.'
      );

      return;
    }

    const contactData = {
      opportunity_id: id,
      senior_name:
        updates.senior_name?.trim() ||
        null,
      senior_email:
        updates.senior_email?.trim() ||
        null,
      senior_phone:
        updates.senior_phone?.trim() ||
        null,
    };

    const hasContactInfo =
      contactData.senior_name ||
      contactData.senior_email ||
      contactData.senior_phone;

    if (hasContactInfo) {
      const {
        error: contactError,
      } = await supabase
        .from('opportunity_contacts')
        .upsert(contactData, {
          onConflict:
            'opportunity_id',
        });

      if (contactError) {
        console.error(
          'Error updating private contact info:',
          contactError
        );

        toast.error(
          'Opportunity updated, but contact information could not be saved.'
        );

        return;
      }
    } else {
      const {
        error: contactDeleteError,
      } = await supabase
        .from('opportunity_contacts')
        .delete()
        .eq('opportunity_id', id);

      if (contactDeleteError) {
        console.error(
          'Error clearing private contact info:',
          contactDeleteError
        );
      }
    }

    toast.success(
      'Opportunity updated!'
    );

    await fetchOpportunities();
  };

  /*
   * DELETE OPPORTUNITY
   */

  const deleteOpportunity = async (
    id: number
  ) => {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(
        'Error deleting opportunity:',
        error
      );

      throw new Error(
        error.message ||
          'Failed to delete opportunity.'
      );
    }

    await fetchOpportunities();
  };

  /*
   * SIGN UP
   */

  const signUpForOpportunity = async (
    opportunityId: number,
    volunteerName: string,
    volunteerEmail: string
  ) => {
    if (
      !volunteerName.trim() ||
      !volunteerEmail.trim()
    ) {
      toast.error(
        'Missing volunteer information.'
      );
      return;
    }

    const selectedOpportunity =
      opportunities.find(
        o => o.id === opportunityId
      );

    if (!selectedOpportunity) {
      toast.error(
        'Opportunity not found.'
      );
      return;
    }

    const {
      data: volunteer,
      error: volunteerError,
    } = await supabase
      .from('volunteer_applications')
      .select(
        'is_adult, one_on_one_opt_in, background_check_completed'
      )
      .eq('email', volunteerEmail)
      .maybeSingle();

    if (
      volunteerError ||
      !volunteer
    ) {
      toast.error(
        'Could not verify volunteer safety status.'
      );
      return;
    }

    const {
      data: existingSignup,
    } = await supabase
      .from('opportunity_signups')
      .select('id')
      .eq(
        'opportunity_id',
        opportunityId
      )
      .eq(
        'volunteer_email',
        volunteerEmail
      )
      .maybeSingle();

    // SAFETY: prevent overfilling
    if (
      (selectedOpportunity.current_volunteers ||
        0) >=
      selectedOpportunity.volunteer_limit
    ) {
      toast.error(
        'This opportunity is already full.'
      );
      return;
    }

    // SAFETY: minors cannot volunteer alone
    if (
      !volunteer.is_adult &&
      (selectedOpportunity.current_volunteers ||
        0) === 0
    ) {
      toast.error(
        'Volunteers under 18 must be accompanied by an adult volunteer.'
      );
      return;
    }

    // SAFETY: 1-on-1 requires adult opt-in + background check
    if (
      volunteer.is_adult &&
      (selectedOpportunity.current_volunteers ||
        0) === 0 &&
      (!volunteer.one_on_one_opt_in ||
        !volunteer.background_check_completed)
    ) {
      toast.error(
        'You must opt into 1-on-1 volunteering and complete a background check before volunteering alone.'
      );
      return;
    }

    if (existingSignup) {
      toast.error(
        'You already signed up for this opportunity.'
      );
      return;
    }

    const { error } =
      await supabase
        .from('opportunity_signups')
        .insert([
          {
            opportunity_id:
              opportunityId,
            volunteer_name:
              volunteerName.trim(),
            volunteer_email:
              volunteerEmail.trim(),
          },
        ]);

    if (error) {
      console.error(
        'Signup failed:',
        error
      );

      toast.error(
        'Failed to sign up.'
      );

      return;
    }

    toast.success(
      'You successfully signed up!'
    );

    await fetchOpportunities();
  };

  /*
   * REMOVE VOLUNTEER
   */

  const removeVolunteerFromOpportunity =
    async (
      opportunityId: number,
      volunteerEmail: string
    ) => {
      const confirmed =
        window.confirm(
          'Remove this volunteer from the opportunity?'
        );

      if (!confirmed) return;

      const { error } =
        await supabase
          .from('opportunity_signups')
          .delete()
          .eq(
            'opportunity_id',
            opportunityId
          )
          .eq(
            'volunteer_email',
            volunteerEmail
          );

      if (error) {
        console.error(
          'Remove failed:',
          error
        );

        toast.error(
          'Failed to remove volunteer.'
        );

        return;
      }

      toast.success(
        'Volunteer removed.'
      );

      await fetchOpportunities();
    };

  /*
   * USER
   */

  const updateUser = (
    updates: Partial<User>
  ) => {
    setUser(prev =>
      prev
        ? {
            ...prev,
            ...updates,
          }
        : null
    );
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
  const context = useContext(
    AuthContext
  );

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};
