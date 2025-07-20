import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl text-center space-y-8">
      <div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          AI-Powered Content Tools
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Generate high-quality content and receive expert critiques with our advanced AI suite. 
          Built for professionals who demand excellence.
        </p>
        <div className="flex justify-center space-x-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            AI Ready
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Phase 2: Navigation Complete
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 