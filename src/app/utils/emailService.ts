import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2`;

interface EmailPreferences {
  receiveTaskEmails: boolean;
  receiveReminders: boolean;
}

export const emailService = {
  // Send approval email
  async sendApprovalEmail(to: string, name: string): Promise<void> {
    const response = await fetch(`${API_BASE}/send-approval-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ to, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to send approval email');
    }
  async sendRejectionEmail(to: string, name: string): Promise<void> {
  const response = await fetch(`${API_BASE}/send-rejection-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ to, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to send rejection email');
  }

  return response.json();
},

    return response.json();
  },

  // Send task assignment email
  async sendTaskAssignmentEmail(
    to: string,
    name: string,
    taskTitle: string,
    taskDate: string,
    taskLocation: string,
    taskDescription: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/send-task-assignment-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        to,
        name,
        taskTitle,
        taskDate,
        taskLocation,
        taskDescription,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to send task assignment email');
    }

    return response.json();
  },

  // Send reminder email
  async sendReminderEmail(
    to: string,
    name: string,
    taskTitle: string,
    taskDate: string,
    hoursUntil: number
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/send-reminder-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        to,
        name,
        taskTitle,
        taskDate,
        hoursUntil,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to send reminder email');
    }

    return response.json();
  },

  // Get email preferences for a volunteer
  async getEmailPreferences(volunteerId: string): Promise<EmailPreferences> {
    const response = await fetch(`${API_BASE}/email-preferences/${volunteerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to fetch email preferences');
    }

    const data = await response.json();
    return data.preferences;
  },

  // Update email preferences for a volunteer
  async updateEmailPreferences(
    volunteerId: string,
    preferences: EmailPreferences
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/email-preferences/${volunteerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to update email preferences');
    }

    return response.json();
  },
};
