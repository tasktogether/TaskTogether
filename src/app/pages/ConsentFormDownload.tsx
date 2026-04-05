import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/button';

export default function ConsentFormDownload() {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Screen-only header */}
      <div className="print:hidden">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 pt-28 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/parental-consent" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => window.print()}
            >
              <Printer size={16} /> Print / Save as PDF
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 pb-4 print:hidden">
          Use your browser's <strong>Print</strong> dialog and choose <strong>"Save as PDF"</strong> to download.
        </p>
      </div>

      {/* Printable Form */}
      <div className="max-w-3xl mx-auto px-6 pb-20 print:px-0 print:pb-0 print:max-w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 print:rounded-none print:shadow-none print:border-0">

          {/* Form Header */}
          <div className="text-center border-b-2 border-slate-200 pb-8 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">TaskTogether</h1>
            <p className="text-slate-500 text-sm mb-4">Richmond Senior Center Volunteer Program</p>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide border border-slate-300 inline-block px-6 py-2 rounded">
              Parental / Guardian Consent Form
            </h2>
          </div>

          {/* Intro */}
          <p className="text-sm text-slate-600 leading-relaxed mb-8">
            This form must be completed and signed by a parent or legal guardian for any volunteer under the age of 18. 
            Please read all sections carefully before signing.
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 mb-5">
              Section 1 — Volunteer Information
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <FormField label="Volunteer's Full Name" />
              <FormField label="Date of Birth" />
              <FormField label="Age" />
              <FormField label="Grade / School" />
              <FormField label="Email Address" span={2} />
              <FormField label="Phone Number" />
              <FormField label="Address" />
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 mb-5">
              Section 2 — Parent / Guardian Information
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <FormField label="Guardian's Full Name" span={2} />
              <FormField label="Relationship to Volunteer" />
              <FormField label="Phone Number" />
              <FormField label="Email Address" span={2} />
              <FormField label="Emergency Contact Name" />
              <FormField label="Emergency Contact Phone" />
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 mb-5">
              Section 3 — Consent & Acknowledgment
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              As the parent/legal guardian of the above-named volunteer, I hereby:
            </p>
            <div className="space-y-4 text-sm text-slate-700">
              {[
                'Grant permission for my child/ward to participate in TaskTogether volunteer activities organized through Richmond Senior Center.',
                'Acknowledge that activities may include in-person visits to senior residences and/or the Richmond Senior Center facility, and that all sessions are supervised by staff.',
                'Consent to my child\'s name and first initial being used (with their opt-in) in the public "Stories of Kindness" blog if they choose to share a reflection.',
                'Confirm that I have read and agree to the TaskTogether Terms of Service and Privacy Policy.',
                'Understand that this consent may be withdrawn at any time by contacting tasktogethercontact@gmail.com.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-4 h-4 border-2 border-slate-400 rounded shrink-0 print:block" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 mb-5">
              Section 4 — Medical / Allergy Information (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <FormField label="Known Allergies (if any)" span={2} />
              <FormField label="Medical Conditions / Notes" span={2} />
            </div>
          </section>

          {/* Signatures */}
          <section>
            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 mb-6">
              Section 5 — Signatures
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-6">Guardian Signature</p>
                <div className="border-b-2 border-slate-300 h-10 mb-2" />
                <p className="text-xs text-slate-400">Signature</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-6">Date</p>
                <div className="border-b-2 border-slate-300 h-10 mb-2" />
                <p className="text-xs text-slate-400">MM / DD / YYYY</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-6">Guardian Printed Name</p>
                <div className="border-b-2 border-slate-300 h-10 mb-2" />
                <p className="text-xs text-slate-400">Print clearly</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-6">Volunteer Signature</p>
                <div className="border-b-2 border-slate-300 h-10 mb-2" />
                <p className="text-xs text-slate-400">Volunteer signs here</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 space-y-1">
            <p>Please return the completed and signed form to: <strong>tasktogethercontact@gmail.com</strong></p>
            <p>Richmond Senior Center · TaskTogether Volunteer Program</p>
            <p className="mt-2 text-slate-300">Form version 1.0 · {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white; }
          nav, .print\\:hidden { display: none !important; }
          @page { margin: 1in; }
        }
      `}</style>
    </div>
  );
}

function FormField({ label, span = 1 }: { label: string; span?: number }) {
  return (
    <div className={span === 2 ? 'col-span-2' : 'col-span-1'}>
      <label className="text-xs font-bold uppercase tracking-wide text-slate-500 block mb-2">{label}</label>
      <div className="border-b-2 border-slate-200 h-8" />
    </div>
  );
}
