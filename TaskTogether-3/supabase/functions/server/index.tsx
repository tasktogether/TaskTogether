import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Email templates
const emailTemplates = {
  approval: (name: string) => ({
    subject: "Welcome to TaskTogether! 🎉 Your Application is Approved",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #faf8ff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(109, 40, 217, 0.1); }
            .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .content h2 { color: #6D28D9; margin-top: 0; font-size: 24px; }
            .content p { margin: 16px 0; color: #475569; font-size: 16px; }
            .button { display: inline-block; background: #6D28D9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
            .button:hover { background: #5B21B6; }
            .footer { background: #F8F7FF; padding: 30px; text-align: center; font-size: 14px; color: #64748B; border-top: 1px solid #E9D5FF; }
            .emoji { font-size: 40px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to TaskTogether!</h1>
            </div>
            <div class="content">
              <div class="emoji">✨</div>
              <h2>Congratulations, ${name}!</h2>
              <p>We're thrilled to let you know that your volunteer application has been <strong>approved</strong>! You're now part of the TaskTogether community.</p>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>✅ Log in to your dashboard to view available opportunities</li>
                <li>💜 Browse tasks and select ones that match your interests</li>
                <li>🤝 Start making a difference in seniors' lives</li>
                <li>📖 Share your stories of kindness after completing tasks</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('APP_URL') || 'http://localhost:5173'}/login" class="button">Go to My Dashboard →</a>
              </div>
              
              <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us at <a href="mailto:tasktogethercontact@gmail.com" style="color: #6D28D9;">tasktogethercontact@gmail.com</a>.</p>
              
              <p style="margin-top: 20px; color: #8B5CF6; font-weight: 600;">Thank you for joining us in making a difference! 💜</p>
            </div>
            <div class="footer">
              <p>TaskTogether · Richmond Senior Center</p>
              <p style="font-size: 12px; margin-top: 10px;">Created by i2 scholar Kaitlyn Cleaveland</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Congratulations, ${name}! Your TaskTogether volunteer application has been approved. Log in at ${Deno.env.get('APP_URL') || 'http://localhost:5173'}/login to get started. Questions? Email tasktogethercontact@gmail.com`
  }),

  taskAssignment: (name: string, taskTitle: string, taskDate: string, taskLocation: string, taskDescription: string) => ({
    subject: `New Task Assigned: ${taskTitle} 📋`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #faf8ff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(109, 40, 217, 0.1); }
            .header { background: linear-gradient(135deg, #F59E0B, #EC4899); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 26px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .task-card { background: #FFF7ED; border-left: 4px solid #F59E0B; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .task-card h3 { color: #EA580C; margin-top: 0; font-size: 20px; }
            .task-details { margin: 15px 0; }
            .task-details div { margin: 8px 0; color: #475569; }
            .task-details strong { color: #1E293B; }
            .button { display: inline-block; background: #6D28D9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
            .footer { background: #F8F7FF; padding: 30px; text-align: center; font-size: 14px; color: #64748B; border-top: 1px solid #E9D5FF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Task Assigned!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Exciting news! You've been assigned a new volunteer task. Here are the details:</p>
              
              <div class="task-card">
                <h3>📌 ${taskTitle}</h3>
                <div class="task-details">
                  <div><strong>📅 Date & Time:</strong> ${taskDate}</div>
                  <div><strong>📍 Location:</strong> ${taskLocation}</div>
                  <div><strong>📝 Description:</strong> ${taskDescription}</div>
                </div>
              </div>
              
              <p><strong>What to do next:</strong></p>
              <ul>
                <li>Review the task details in your dashboard</li>
                <li>Mark your calendar for the date and time</li>
                <li>Prepare any materials you might need</li>
                <li>Reach out if you have questions or need to reschedule</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('APP_URL') || 'http://localhost:5173'}/dashboard" class="button">View Task Details →</a>
              </div>
              
              <p style="margin-top: 30px; color: #8B5CF6; font-weight: 600;">Thank you for making a difference! 💜</p>
            </div>
            <div class="footer">
              <p>TaskTogether · Richmond Senior Center</p>
              <p style="font-size: 12px; margin-top: 10px;">Created by i2 scholar Kaitlyn Cleaveland</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name}, you've been assigned: ${taskTitle} on ${taskDate} at ${taskLocation}. View details at ${Deno.env.get('APP_URL') || 'http://localhost:5173'}/dashboard`
  }),

  reminder: (name: string, taskTitle: string, taskDate: string, hoursUntil: number) => ({
    subject: `⏰ Reminder: ${taskTitle} in ${hoursUntil} hours`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #faf8ff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(109, 40, 217, 0.1); }
            .header { background: linear-gradient(135deg, #0EA5E9, #8B5CF6); padding: 40px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 26px; font-weight: 700; }
            .content { padding: 40px 30px; }
            .reminder-box { background: #DBEAFE; border-left: 4px solid #0EA5E9; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
            .reminder-box h2 { color: #0369A1; margin: 0 0 10px 0; font-size: 24px; }
            .reminder-box p { color: #075985; margin: 5px 0; font-size: 16px; }
            .button { display: inline-block; background: #6D28D9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 20px 0; }
            .footer { background: #F8F7FF; padding: 30px; text-align: center; font-size: 14px; color: #64748B; border-top: 1px solid #E9D5FF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Friendly Reminder!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>This is a friendly reminder about your upcoming volunteer task:</p>
              
              <div class="reminder-box">
                <h2>📌 ${taskTitle}</h2>
                <p><strong>Starting in ${hoursUntil} hours</strong></p>
                <p>📅 ${taskDate}</p>
              </div>
              
              <p><strong>Quick checklist:</strong></p>
              <ul>
                <li>✅ Double-check the time and location</li>
                <li>✅ Gather any materials you need</li>
                <li>✅ Plan your transportation</li>
                <li>✅ Bring your positive energy! 😊</li>
              </ul>
              
              <p>If you need to make any changes, please contact us as soon as possible at <a href="mailto:tasktogethercontact@gmail.com" style="color: #6D28D9;">tasktogethercontact@gmail.com</a>.</p>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('APP_URL') || 'http://localhost:5173'}/dashboard" class="button">View My Tasks →</a>
              </div>
              
              <p style="margin-top: 30px; color: #8B5CF6; font-weight: 600;">Looking forward to seeing you there! 💜</p>
            </div>
            <div class="footer">
              <p>TaskTogether · Richmond Senior Center</p>
              <p style="font-size: 12px; margin-top: 10px;">Created by i2 scholar Kaitlyn Cleaveland</p>
              <p style="font-size: 12px; margin-top: 10px; color: #94A3B8;">To manage your email preferences, visit your dashboard settings.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hi ${name}, reminder: ${taskTitle} starts in ${hoursUntil} hours on ${taskDate}. View at ${Deno.env.get('APP_URL') || 'http://localhost:5173'}/dashboard`
  }),
};

// Helper to send email via Resend
async function sendEmail(to: string, subject: string, html: string, text: string) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // TODO: Update this to your custom domain after DNS setup
        // For now using gmail - switch to: 'TaskTogether <noreply@tasktogether.org>'
        from: 'TaskTogether <tasktogethercontact@gmail.com>',
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: `Failed to send email: ${data.message || 'Unknown error'}` };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'An error occurred while sending the email' };
  }
}

// Health check endpoint
app.get("/make-server-1a1315c2/health", (c) => {
  return c.json({ status: "ok" });
});

// Send approval email
app.post("/make-server-1a1315c2/send-approval-email", async (c) => {
  try {
    const body = await c.req.json();
    const { to, name } = body;

    if (!to || !name) {
      return c.json({ error: 'Missing required fields: to, name' }, 400);
    }

    const template = emailTemplates.approval(name);
    const result = await sendEmail(to, template.subject, template.html, template.text);

    if (!result.success) {
      return c.json({ 
        error: 'Failed to send approval email',
        details: result.error
      }, 500);
    }

    return c.json({ 
      success: true, 
      message: `Approval email sent to ${to}` 
    });
  } catch (error) {
    console.error('Error in send-approval-email route:', error);
    return c.json({ 
      error: 'Failed to send approval email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Send task assignment email
app.post("/make-server-1a1315c2/send-task-assignment-email", async (c) => {
  try {
    const body = await c.req.json();
    const { to, name, taskTitle, taskDate, taskLocation, taskDescription } = body;

    if (!to || !name || !taskTitle || !taskDate || !taskLocation || !taskDescription) {
      return c.json({ 
        error: 'Missing required fields: to, name, taskTitle, taskDate, taskLocation, taskDescription' 
      }, 400);
    }

    const template = emailTemplates.taskAssignment(name, taskTitle, taskDate, taskLocation, taskDescription);
    const result = await sendEmail(to, template.subject, template.html, template.text);

    if (!result.success) {
      return c.json({ 
        error: 'Failed to send task assignment email',
        details: result.error
      }, 500);
    }

    return c.json({ 
      success: true, 
      message: `Task assignment email sent to ${to}` 
    });
  } catch (error) {
    console.error('Error in send-task-assignment-email route:', error);
    return c.json({ 
      error: 'Failed to send task assignment email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Send reminder email
app.post("/make-server-1a1315c2/send-reminder-email", async (c) => {
  try {
    const body = await c.req.json();
    const { to, name, taskTitle, taskDate, hoursUntil } = body;

    if (!to || !name || !taskTitle || !taskDate || hoursUntil === undefined) {
      return c.json({ 
        error: 'Missing required fields: to, name, taskTitle, taskDate, hoursUntil' 
      }, 400);
    }

    const template = emailTemplates.reminder(name, taskTitle, taskDate, hoursUntil || 24);
    const result = await sendEmail(to, template.subject, template.html, template.text);

    if (!result.success) {
      return c.json({ 
        error: 'Failed to send reminder email',
        details: result.error
      }, 500);
    }

    return c.json({ 
      success: true, 
      message: `Reminder email sent to ${to}` 
    });
  } catch (error) {
    console.error('Error in send-reminder-email route:', error);
    return c.json({ 
      error: 'Failed to send reminder email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get volunteer email preferences (stored in KV store)
app.get("/make-server-1a1315c2/email-preferences/:volunteerId", async (c) => {
  try {
    const volunteerId = c.req.param('volunteerId');
    const key = `email_prefs_${volunteerId}`;
    
    const prefs = await kv.get(key);
    
    // Default preferences if not set
    const defaultPrefs = {
      receiveTaskEmails: true,
      receiveReminders: true,
    };

    return c.json({ 
      preferences: prefs || defaultPrefs 
    });
  } catch (error) {
    console.error('Error fetching email preferences:', error);
    return c.json({ 
      error: 'Failed to fetch email preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Update volunteer email preferences
app.post("/make-server-1a1315c2/email-preferences/:volunteerId", async (c) => {
  try {
    const volunteerId = c.req.param('volunteerId');
    const body = await c.req.json();
    const { receiveTaskEmails, receiveReminders } = body;

    const key = `email_prefs_${volunteerId}`;
    await kv.set(key, {
      receiveTaskEmails: receiveTaskEmails ?? true,
      receiveReminders: receiveReminders ?? true,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ 
      success: true,
      message: 'Email preferences updated successfully' 
    });
  } catch (error) {
    console.error('Error updating email preferences:', error);
    return c.json({ 
      error: 'Failed to update email preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// ===== SENIOR HOME MANAGEMENT ROUTES =====

// Register a new senior home
app.post("/make-server-1a1315c2/senior-homes/register", async (c) => {
  try {
    const body = await c.req.json();
    const { name, city, state, contactPerson, email, message } = body;

    if (!name || !city || !state || !contactPerson || !email) {
      return c.json({ 
        error: 'Missing required fields: name, city, state, contactPerson, email' 
      }, 400);
    }

    const seniorHomeId = `sh_${Date.now()}`;
    const seniorHome = {
      id: seniorHomeId,
      name,
      city,
      state,
      contactPerson,
      email,
      message: message || '',
      status: 'pending',
      registeredAt: new Date().toISOString(),
    };

    await kv.set(`senior_home_${seniorHomeId}`, seniorHome);

    return c.json({ 
      success: true, 
      message: 'Senior home registration submitted successfully',
      seniorHomeId 
    });
  } catch (error) {
    console.error('Error registering senior home:', error);
    return c.json({ 
      error: 'Failed to register senior home',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get all senior homes
app.get("/make-server-1a1315c2/senior-homes", async (c) => {
  try {
    const seniorHomesData = await kv.getByPrefix('senior_home_');
    const seniorHomes = seniorHomesData.map(item => item.value);
    
    return c.json({ 
      success: true,
      seniorHomes 
    });
  } catch (error) {
    console.error('Error fetching senior homes:', error);
    return c.json({ 
      error: 'Failed to fetch senior homes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get approved senior homes only
app.get("/make-server-1a1315c2/senior-homes/approved", async (c) => {
  try {
    const seniorHomesData = await kv.getByPrefix('senior_home_');
    const approvedHomes = seniorHomesData
      .map(item => item.value)
      .filter((home: any) => home.status === 'approved');
    
    return c.json({ 
      success: true,
      seniorHomes: approvedHomes 
    });
  } catch (error) {
    console.error('Error fetching approved senior homes:', error);
    return c.json({ 
      error: 'Failed to fetch approved senior homes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Update senior home status (platform admin only)
app.put("/make-server-1a1315c2/senior-homes/:seniorHomeId/status", async (c) => {
  try {
    const seniorHomeId = c.req.param('seniorHomeId');
    const body = await c.req.json();
    const { status } = body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const key = `senior_home_${seniorHomeId}`;
    const seniorHome = await kv.get(key);

    if (!seniorHome) {
      return c.json({ error: 'Senior home not found' }, 404);
    }

    const updatedHome = {
      ...seniorHome,
      status,
      statusUpdatedAt: new Date().toISOString(),
    };

    await kv.set(key, updatedHome);

    // If approved, automatically create a Senior Home Admin account
    if (status === 'approved') {
      const adminId = `admin_${seniorHomeId}`;
      const adminAccount = {
        id: adminId,
        name: seniorHome.contactPerson,
        email: seniorHome.email,
        role: 'admin',
        seniorHomeId: seniorHomeId,
        seniorHomeName: seniorHome.name,
        isPlatformAdmin: false, // Senior home admins are NOT platform admins
        createdAt: new Date().toISOString(),
        // Password would be generated and sent via email in a real app
        tempPassword: `temp_${Date.now()}`, // Placeholder
      };

      // Store the admin account
      await kv.set(`admin_${adminId}`, adminAccount);

      console.log(`Created admin account for senior home: ${seniorHome.name}`);

      // TODO: Send email with login credentials
      // In a real app, you would:
      // 1. Generate a secure temporary password
      // 2. Send welcome email with login link and password
      // 3. Require password change on first login
    }

    return c.json({ 
      success: true,
      message: `Senior home ${status} successfully${status === 'approved' ? ' and admin account created' : ''}`,
      seniorHome: updatedHome
    });
  } catch (error) {
    console.error('Error updating senior home status:', error);
    return c.json({ 
      error: 'Failed to update senior home status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

Deno.serve(app.fetch);