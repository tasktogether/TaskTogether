import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import dasLogo from 'src/assets/das-logo.png';

export const Footer = () => {
  return (
    <footer className="bg-[#8CC63F] border-t border-[#5E8F25] pt-16 pb-8 relative overflow-hidden text-white">
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
                Richmond Senior Center Volunteers
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Supporting volunteers who serve seniors at the Richmond Senior Center in a safe and organized environment.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li><Link to="/" className="hover:text-[#FFC72C] transition-colors">Home</Link></li>
              <li><Link to="/opportunities" className="hover:text-[#FFC72C] transition-colors">Opportunities</Link></li>
              <li><Link to="/stories" className="hover:text-[#FFC72C] transition-colors">Stories of Kindness</Link></li>
              <li><Link to="/learn-more" className="hover:text-[#FFC72C] transition-colors">Learn More</Link></li>
              <li><Link to="/apply" className="hover:text-[#FFC72C] transition-colors">Apply Now</Link></li>
              <li><Link to="/login" className="hover:text-[#FFC72C] transition-colors">Volunteer Login</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-[#FFC72C] transition-colors">Admin Access</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">
              Safety & Legal
            </h4>
            <ul className="space-y-2 text-sm text-white">
              <li><Link to="/parental-consent" className="hover:text-[#FFC72C] transition-colors">Parental Consent</Link></li>
              <li><Link to="/safety-guidelines" className="hover:text-[#FFC72C] transition-colors">Safety Guidelines</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#FFC72C] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-[#FFC72C] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-poppins font-semibold text-white mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>Richmond Senior Center<br/>123 Community Lane<br/>Richmond, CA 94804</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white shrink-0" />
                <a href="mailto:tasktogethercontact@gmail.com" className="hover:text-[#FFC72C] transition-colors">tasktogethercontact@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white shrink-0" />
                <a href="tel:+15105550123" className="hover:text-[#FFC72C] transition-colors">(510) 555-0123</a>
              </li>
            </ul>
          </div>
        </div>
<div className="flex justify-center mb-6">
  <img
    src={dasLogo}
    alt="Department of Disability and Aging Services Funding"
    className="h-16 md:h-20 object-contain"
  />
</div>
        <div className="border-t border-white/30 pt-8 text-center">
          <p className="text-white text-sm mb-2">
            &copy; {new Date().getFullYear()} Richmond Senior Center Volunteers. Made with care by <span className="font-semibold text-violet-600">i2 scholar Kaitlyn Cleaveland</span>
          </p>
          <p className="text-white/80 text-xs">
            Building bridges between generations, one task at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};
