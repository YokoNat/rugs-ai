import React from "react";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <div className="text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rugs AI Partner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Phase 1 Complete: Design System Foundation
          </p>
          <div className="flex justify-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Design System Ready
            </span>
          </div>
        </div>

        {/* Design System Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Color Palette */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Color Palette</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-500 rounded"></div>
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="text-sm">Success</span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Typography</h3>
            <div className="space-y-2 text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">Heading 1</h1>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Heading 2</h2>
              <p className="text-base text-gray-600 leading-relaxed">Body text</p>
              <p className="text-sm text-gray-500 leading-relaxed">Small text</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Buttons</h3>
            <div className="space-y-3">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105">
                Primary
              </button>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Secondary
              </button>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                Ghost
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Cards</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
                <p className="text-sm">Standard Card</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-3">
                <p className="text-sm">Glass Card</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Phase 1 Complete! 🎉</h2>
          <p className="text-base text-gray-600 leading-relaxed mb-4">
            We've established our design system with:
          </p>
          <ul className="text-left space-y-2 text-sm text-gray-600">
            <li>• Modern color palette with primary, secondary, and semantic colors</li>
            <li>• Typography scale with proper line heights and weights</li>
            <li>• Component classes for buttons, inputs, cards, and badges</li>
            <li>• Utility classes for gradients, glassmorphism, and animations</li>
            <li>• Responsive design utilities</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default App;
