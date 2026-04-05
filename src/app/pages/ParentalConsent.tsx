import React from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';

export default function ParentalConsent() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-32 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl font-fredoka font-bold text-slate-900">Parental Consent</h1>
          <Link to="/consent-form">
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white border-none shadow-md">
              <Download size={16} /> Download Consent Form
            </Button>
          </Link>
        </div>

        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-2xl shrink-0">📄</span>
          <div>
            <p className="font-bold text-violet-800 mb-1">Need the form?</p>
            <p className="text-sm text-violet-700 leading-relaxed">
              Download and print the consent form, have a parent or guardian sign it, then email the completed form to{' '}
              <a href="mailto:tasktogethercontact@gmail.com" className="underline font-medium">tasktogethercontact@gmail.com</a>.
              Use your browser's <strong>Print → Save as PDF</strong> option to save a digital copy.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <p>
            At TaskTogether, we prioritize the safety and well-being of all our volunteers.
            For volunteers under the age of 18, we require explicit parental or guardian consent before they can participate in any activities.
          </p>
          <h3>Why is consent required?</h3>
          <p>
            Volunteering involves interaction with seniors and may take place in various community settings.
            We want to ensure that parents are fully aware of the activities their child is participating in and have given their permission.
          </p>
          <h3>The Process</h3>
          <ol>
            <li><strong>Registration:</strong> During sign-up, if a volunteer indicates they are under 18, they will be prompted to provide guardian contact information.</li>
            <li><strong>Download the Form:</strong> Use the button above to download the printable consent form.</li>
            <li><strong>Signature:</strong> A parent or guardian must sign the form. It outlines the scope of volunteer activities, emergency contacts, and liability waivers.</li>
            <li><strong>Return:</strong> Email the completed signed form to <a href="mailto:tasktogethercontact@gmail.com">tasktogethercontact@gmail.com</a>.</li>
          </ol>
          <p>
            If you have any questions, contact us at{' '}
            <a href="mailto:tasktogethercontact@gmail.com">tasktogethercontact@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
