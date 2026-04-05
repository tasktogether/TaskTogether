import React from 'react';

export const BubbleBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Large Soft Static Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
      
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-pink-200/30 rounded-full blur-3xl" />

      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl" />

      {/* Additional decorative static blobs */}
      <div className="absolute top-[50%] left-[50%] w-[350px] h-[350px] bg-yellow-200/20 rounded-full blur-3xl" />

      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] bg-cyan-200/25 rounded-full blur-3xl" />

      {/* Decorative gradient orbs - static */}
      <div className="absolute top-[30%] right-[5%] w-32 h-32 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%]" />

      <div className="absolute bottom-[40%] left-[8%] w-40 h-40 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%]" />
    </div>
  );
};