import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Video, Upload, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';

interface RegistrationData {
  fullName: string;
  email: string;
  age: number;
  guardianName?: string;
  guardianEmail?: string;
  videoUrl?: string;
}

export const RegistrationForm = () => {
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistrationData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);

  const age = watch('age');
  const isMinor = age && age < 18;

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    registerUser(data.fullName, data.email);
    setIsSubmitting(false);
  };

  const handleVideoUpload = () => {
    // Simulate video upload
    toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
      loading: 'Uploading your introduction...',
      success: () => {
        setVideoUploaded(true);
        return 'Video uploaded successfully!';
      },
      error: 'Upload failed',
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
      <div className="text-center mb-8 pt-8 px-6 bg-slate-50 border-b border-slate-100 pb-8">
        <h2 className="text-3xl font-fredoka font-semibold text-slate-800 mb-3 tracking-wide">Volunteer Application</h2>
        <p className="text-slate-600 font-medium text-lg">Thank you for your interest in serving our community. Please complete the form below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-8 pb-8">
        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
            <input
              {...register('fullName', { required: 'Name is required' })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-700"
              placeholder="e.g. Alex Smith"
            />
            {errors.fullName && <p className="text-red-500 text-xs font-medium ml-1">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-700"
              placeholder="alex@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs font-medium ml-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 ml-1">Age</label>
          <input
            type="number"
            {...register('age', { required: 'Age is required', min: { value: 13, message: 'Must be at least 13' } })}
            className="w-full md:w-1/3 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-slate-700"
            placeholder="16"
          />
          {errors.age && <p className="text-red-500 text-xs font-medium ml-1">{errors.age.message}</p>}
        </div>

        {/* Guardian Info if Minor */}
        {isMinor && (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
              Parental Consent
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-1 rounded-full">Required</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Guardian Name</label>
                <input
                  {...register('guardianName', { required: isMinor ? 'Guardian name is required' : false })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                  placeholder="Parent/Guardian Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">Guardian Email</label>
                <input
                  {...register('guardianEmail', { required: isMinor ? 'Guardian email is required' : false })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                  placeholder="parent@example.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
               <Button type="button" variant="secondary" size="sm" onClick={() => window.open('#', '_blank')} className="bg-white text-slate-700 hover:bg-slate-100 border-slate-300">
                 <Upload size={16} /> Download Consent Form
               </Button>
               <span className="text-xs text-slate-500 font-medium italic">Please have a guardian sign this form.</span>
            </div>
          </div>
        )}

        {/* Video Prompt */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Video Introduction
          </label>
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-100 transition-colors cursor-pointer group relative overflow-hidden" onClick={handleVideoUpload}>
            {videoUploaded ? (
              <div className="flex flex-col items-center gap-2 text-green-700 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                   <CheckCircle size={32} />
                </div>
                <span className="font-semibold text-lg">Video Uploaded Successfully</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform duration-300 border border-slate-200">
                  <Video size={28} />
                </div>
                <div className="space-y-3 max-w-lg mx-auto">
                  <p className="font-medium text-slate-700 text-lg">Please record a short video answering the following:</p>
                  <ul className="text-sm text-slate-600 text-left space-y-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <li className="flex gap-2"><span className="font-semibold">1.</span> <span>Tell us about yourself and why you are interested in volunteering with the Richmond Senior Center.</span></li>
                    <li className="flex gap-2"><span className="font-semibold">2.</span> <span>What experience do you have working with seniors? If you don't have any, what makes you interested in serving the senior community?</span></li>
                    <li className="flex gap-2"><span className="font-semibold">3.</span> <span>How much time can you commit to volunteering either weekly or monthly?</span></li>
                  </ul>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide pt-2">Click to Upload Video</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          size="lg" 
          className="mt-8 h-12 text-lg rounded-xl bg-violet-700 hover:bg-violet-800 shadow-md font-semibold text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Card>
  );
};