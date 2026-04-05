import React, { useRef } from 'react';
import { Download, Award } from 'lucide-react';
import { Button } from './ui/Button';
import { toast } from 'sonner';

interface CertificateProps {
  volunteerName: string;
  totalHours: number;
  joinDate: string;
}

export function VolunteerCertificate({ volunteerName, totalHours, joinDate }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      // Use html2canvas if available, otherwise show a message
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `TaskTogether-Certificate-${volunteerName.replace(/\s/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Certificate downloaded! 🎉');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Could not download certificate. Try taking a screenshot instead!');
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="bg-white p-12 md:p-16 rounded-3xl shadow-2xl border-8 border-violet-200 relative overflow-hidden"
        style={{ aspectRatio: '1.414', maxWidth: '800px', margin: '0 auto' }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full -translate-x-16 -translate-y-16 opacity-50" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full translate-x-20 translate-y-20 opacity-50" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-between text-center">
          {/* Header */}
          <div>
            <div className="mb-6">
              <Award size={64} className="mx-auto text-violet-600 mb-4" />
            </div>
            <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-violet-600 mb-2">
              Certificate of Appreciation
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 mx-auto rounded-full" />
          </div>

          {/* Body */}
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <p className="text-slate-600 text-lg font-medium">
              This is to certify that
            </p>
            
            <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-slate-800 border-b-4 border-slate-800 pb-2 px-8 inline-block mx-auto">
              {volunteerName}
            </h2>

            <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
              has generously volunteered <span className="font-bold text-violet-600 text-2xl">{totalHours} hours</span> of their time 
              to support seniors and make a meaningful difference in our community through <span className="font-bold">TaskTogether</span>.
            </p>

            <p className="text-slate-500 text-sm italic">
              Member since {new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Footer */}
          <div className="w-full">
            <div className="flex justify-between items-end gap-8 mb-6">
              <div className="flex-1 text-left">
                <div className="border-t-2 border-slate-300 pt-2">
                  <p className="text-sm font-bold text-slate-700">Richmond Senior Center</p>
                  <p className="text-xs text-slate-500">Community Partner</p>
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <div className="border-t-2 border-slate-300 pt-2">
                  <p className="text-sm font-bold text-slate-700">{currentDate}</p>
                  <p className="text-xs text-slate-500">Date Issued</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              Created by i2 scholar Kaitlyn Cleaveland
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <Button onClick={downloadCertificate} className="gap-2 text-lg px-8 py-6">
          <Download size={20} />
          Download Certificate
        </Button>
        <p className="text-xs text-slate-500 mt-3">
          Share your achievement with family, friends, and college applications! 🎓
        </p>
      </div>
    </div>
  );
}
