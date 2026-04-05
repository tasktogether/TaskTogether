import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32 space-y-8">
        <h1 className="text-4xl font-fredoka font-bold text-slate-900">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p>Last updated: February 2026</p>
          <p>
            TaskTogether ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
          </p>

          <h3>Information We Collect</h3>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and age.</li>
            <li><strong>Volunteer Data:</strong> Records of tasks completed, hours volunteered, and badges earned.</li>
            <li><strong>Guardian Information:</strong> For minors, we collect parent/guardian contact details for consent purposes.</li>
          </ul>

          <h3>How We Use Your Information</h3>
          <ul>
            <li>To facilitate volunteer connections with seniors.</li>
            <li>To verify volunteer identity and safety.</li>
            <li>To track volunteer hours for school or community service credit.</li>
            <li>To communicate with you regarding updates, new opportunities, or safety alerts.</li>
          </ul>

          <h3>Data Security</h3>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h3>Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}