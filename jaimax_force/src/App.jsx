import React from 'react';
export default function App() {
  return (
    <div className="font-sans bg-gray-900 text-white">
      <section className="min-h-screen relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwVjBoLTJ2MzRoMnptLTYgMGgyVjBoLTJ2MzR6bS0yIDBoMlYwaC0ydjM0em0tNiAwaDJWMGgtMnYzNHoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 h-screen flex flex-col justify-center items-center md:items-start">
          <div className="max-w-4xl">
            {/* Glowing badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-opacity-20 bg-purple-500 backdrop-blur-sm border border-purple-400 mb-6 animate-pulse">
              <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
              <span className="text-xs font-semibold text-purple-200">Experience The Future</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Welcome to{" "}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Jaimax Force</span>
                <span className="absolute -bottom-1 left-0 h-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 blur-md"></span>
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Craft exceptional web experiences with the ultimate React & Tailwind toolkit. Unleash your creativity without limits.
            </p>
            
            <div className="flex flex-wrap gap-5 mb-12">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                <span className="relative z-10 font-medium text-white flex items-center">
                  Get Started
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-50 transition-opacity"></span>
              </button>
              
              <button className="px-8 py-4 border border-purple-400 text-purple-300 rounded-lg hover:bg-purple-900 hover:bg-opacity-30 transition-colors duration-300">
                View Demo
              </button>
            </div>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-sm">Responsive Design</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span className="text-sm">Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
                <span className="text-sm">Customizable</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}