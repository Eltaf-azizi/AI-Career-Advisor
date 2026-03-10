import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, BarChart2, MessageSquare, Home, User, ArrowLeftRight } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/test', icon: Compass, label: 'Career Test' },
    { path: '/career-paths', icon: User, label: 'Career Paths' },
    { path: '/career-comparison', icon: ArrowLeftRight, label: 'Compare' },
    { path: '/chat', icon: MessageSquare, label: 'AI Mentor' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white group-hover:bg-emerald-700 transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">PathFinder AI</span>
            </Link>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-emerald-600'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-stone-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-500 text-sm">
            © 2026 PathFinder AI Career Advisor. Empowering the next generation of professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}
