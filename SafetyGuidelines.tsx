import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export default function SafetyGuidelines() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32 space-y-8">
        <h1 className="text-4xl font-fredoka font-bold text-slate-900">Safety Guidelines</h1>
        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p>
            Safety is our top priority. We have established strict guidelines to ensure a safe environment for both our teen volunteers and the seniors they assist.
          </p>
          
          <h3>For Volunteers</h3>
          <ul>
            <li><strong>Always stay in public areas:</strong> When meeting with seniors, stay in common areas unless explicitly authorized for specific home-helper tasks that have been vetted.</li>
            <li><strong>Buddy System:</strong> We encourage volunteers to work in pairs whenever possible.</li>
            <li><strong>Check-in/Check-out:</strong> Always log your arrival and departure times through the app.</li>
            <li><strong>Report Concerns:</strong> If you ever feel uncomfortable or notice something concerning, report it to an admin immediately.</li>
          </ul>

          <h3>For Seniors</h3>
          <ul>
            <li><strong>Verification:</strong> All volunteers are verified. You can ask to see their digital badge on their phone.</li>
            <li><strong>Boundaries:</strong> Volunteers are there to help with specific tasks. Please respect their time and boundaries.</li>
          </ul>

          <h3>Emergency Procedures</h3>
          <p>
            In case of an emergency, call 911 immediately. Then, contact the TaskTogether program coordinator as soon as it is safe to do so.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}