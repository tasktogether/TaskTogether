import React, { useState } from 'react';
import { Building2, MapPin, Mail, User, MessageSquare, Check, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function RegisterSeniorHomePage() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    contactPerson: '',
    contactTitle: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1a1315c2/senior-homes/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setIsSubmitted(true);
      toast.success('Registration submitted successfully! We\'ll review your application and be in touch soon.', {
        duration: 5000,
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to submit registration: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Navbar />
        <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
          <div
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-fredoka font-bold text-slate-900 mb-4">
              Registration Submitted! 🎉
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Thank you for your interest in bringing TaskTogether to your community. 
              We'll review your application and contact you at <strong>{formData.email}</strong> within 2-3 business days.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Building2 size={16} />
              Expand Your Community Support
            </div>
            <h1 className="text-4xl md:text-5xl font-fredoka font-bold text-slate-900 mb-4">
              Bring TaskTogether to Your Community
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Connect your senior home residents with dedicated volunteers. TaskTogether makes it easy to manage volunteer opportunities, build meaningful connections, and strengthen your community.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-purple-50 border-purple-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold font-poppins text-slate-800 mb-2">Easy to Use</h3>
            <p className="text-sm text-slate-600">
              Simple dashboard to post opportunities and manage volunteers
            </p>
          </Card>

          <Card className="bg-blue-50 border-blue-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold font-poppins text-slate-800 mb-2">Verified Volunteers</h3>
            <p className="text-sm text-slate-600">
              All volunteers are vetted and approved before participating
            </p>
          </Card>

          <Card className="bg-pink-50 border-pink-100 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-pink-600" />
            </div>
            <h3 className="font-bold font-poppins text-slate-800 mb-2">Free Platform</h3>
            <p className="text-sm text-slate-600">
              No cost to join — supported by our commitment to community service
            </p>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="p-8 md:p-12">
          <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-6">
            Register Your Senior Home
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Senior Home Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Richmond Senior Center"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Richmond"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-slate-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="VA"
                  maxLength={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all uppercase"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactPerson" className="block text-sm font-semibold text-slate-700 mb-2">
                Contact Person *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  required
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactTitle" className="block text-sm font-semibold text-slate-700 mb-2">
                Contact Title *
              </label>
              <input
                type="text"
                id="contactTitle"
                name="contactTitle"
                required
                value={formData.contactTitle}
                onChange={handleChange}
                placeholder="Director of Programs"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@seniorcenter.org"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                Tell us about your use of TaskTogether *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-slate-400" size={20} />
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="We're looking to connect our residents with local volunteers for companionship visits, tech help, and activity support..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                className="font-bold shadow-lg shadow-violet-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={20} className="mr-2" />
                    Register Your Senior Home
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Section */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-2">
            Have questions? Contact us at{' '}
            <a href="mailto:tasktogethercontact@gmail.com" className="text-violet-600 font-semibold hover:underline">
              tasktogethercontact@gmail.com
            </a>
          </p>
          <p className="text-sm text-slate-500">
            We'll review your application and get back to you within 2-3 business days.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
