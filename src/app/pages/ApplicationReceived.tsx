import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ApplicationReceived: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-14 w-14 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your application has been submitted successfully!
            </h1>

            <p className="text-gray-600 text-base sm:text-lg mb-8">
              Thank you for applying to volunteer with the Richmond Senior Center through TaskTogether.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 sm:p-6 text-left mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
                What happens next?
              </h2>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                  <p>
                    The admin at the Richmond Senior Center will review your application.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                  <p>
                    You will receive an email letting you know whether your application was approved or rejected.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                  <p>
                    If approved, you will use the link in the email to set your password before logging in.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white font-medium hover:opacity-90 transition"
              >
                Return to Home
              </button>

              <button
                onClick={() => navigate('/opportunities')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                View Opportunities
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationReceived;
