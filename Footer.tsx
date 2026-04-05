import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 border-t border-violet-100 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background elements - static */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-violet-200/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-fredoka text-xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                TaskTogether
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Connecting teen volunteers with seniors in a safe, organized, and welcoming way.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-poppins font-semibold text-slate-800 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/" className="hover:text-violet-600 transition-colors">Home</Link></li>
              <li><Link to="/opportunities" className="hover:text-violet-600 transition-colors">Opportunities</Link></li>
              <li><Link to="/stories" className="hover:text-violet-600 transition-colors">Stories of Kindness</Link></li>
              <li><Link to="/learn-more" className="hover:text-violet-600 transition-colors">Learn More</Link></li>
              <li><Link to="/apply" className="hover:text-violet-600 transition-colors">Apply Now</Link></li>
              <li><Link to="/login" className="hover:text-violet-600 transition-colors">Volunteer Login</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-violet-600 transition-colors">Admin Access</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-poppins font-semibold text-slate-800 mb-4">
              Safety & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/parental-consent" className="hover:text-violet-600 transition-colors">Parental Consent</Link></li>
              <li><Link to="/safety-guidelines" className="hover:text-violet-600 transition-colors">Safety Guidelines</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-violet-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-slate-800 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                <span>Richmond Senior Center<br/>123 Community Lane<br/>Richmond, CA 94804</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-violet-500 shrink-0" />
                <a href="mailto:tasktogethercontact@gmail.com" className="hover:text-violet-600 transition-colors">tasktogethercontact@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-violet-500 shrink-0" />
                <a href="tel:+15105550123" className="hover:text-violet-600 transition-colors">(510) 555-0123</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-violet-200 pt-8 text-center">
          <p className="text-slate-500 text-sm mb-2">
            &copy; {new Date().getFullYear()} TaskTogether. Made with care by <span className="font-semibold text-violet-600">i2 scholar Kaitlyn Cleaveland</span>
          </p>
          <p className="text-slate-400 text-xs">
            Building bridges between generations, one task at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};