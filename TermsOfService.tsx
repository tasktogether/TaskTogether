import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32 space-y-8">
        <h1 className="text-4xl font-fredoka font-bold text-slate-900">Terms of Service</h1>
        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p>Last updated: February 2026</p>
          <p>
            Welcome to TaskTogether. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By creating an account or using our services, you agree to comply with and be legally bound by these Terms.
          </p>

          <h3>2. User Conduct</h3>
          <p>
            You agree to use the platform only for lawful purposes and in accordance with our Safety Guidelines. 
            Harassment, discrimination, or any form of inappropriate behavior toward volunteers or seniors will not be tolerated and may result in immediate termination of your account.
          </p>

          <h3>3. Volunteer Responsibilities</h3>
          <p>
            Volunteers agree to perform tasks to the best of their ability and to communicate effectively if they are unable to fulfill a commitment.
          </p>

          <h3>4. Limitation of Liability</h3>
          <p>
            TaskTogether facilitates connections but does not directly supervise every interaction. We are not liable for any damages or losses resulting from interactions between users, though we strive to maintain a safe environment through vetting and monitoring.
          </p>

          <h3>5. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any significant changes.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}