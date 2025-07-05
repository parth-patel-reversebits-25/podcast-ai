import React, { useState } from 'react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Mic, Sparkles, Users, FileText, Zap, Target, Headphones } from 'lucide-react';
import PodcastGenerator from './components/PodcastGenerator';
import GeneratedPodcast from './components/GeneratedPodcast';
import Header from './components/Header';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import { authHelpers } from './lib/supabase';
import { toast } from 'react-hot-toast';

export interface PodcastData {
  id: string;
  title: string;
  description: string;
  duration: string;
  transcript: string;
  speakers: string[];
  topic: string;
  context: string;
  personalities: string[];
  generatedAt: string;
}

export interface UserData {
  name: string;
  email: string;
}
function App() {
  const [currentView, setCurrentView] = useState<'login' | 'registration' | 'generator' | 'podcast'>('login');
  const [generatedPodcast, setGeneratedPodcast] = useState<PodcastData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        
        if (error) {
          console.error('Auth check error:', error);
        } else if (user) {
          // User is already logged in
          setUserData({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || ''
          });
          setCurrentView('generator');
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();

    // Listen for auth state changes
    const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserData(null);
        setCurrentView('login');
        toast.success('Signed out successfully');
      } else if (event === 'SIGNED_IN' && session?.user) {
        setUserData({
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || ''
        });
        setCurrentView('generator');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLoginComplete = (user: UserData) => {
    setUserData(user);
    setCurrentView('generator');
  };

  const handleRegistrationComplete = (user: UserData) => {
    setUserData(user);
    setCurrentView('generator');
  };

  const handleShowLogin = () => {
    setCurrentView('login');
    setUserData(null);
  };

  const handleShowRegistration = () => {
    setCurrentView('registration');
  };

  const handleBackToApp = () => {
    // If user is logged in, go to generator, otherwise go to login
    setCurrentView(userData ? 'generator' : 'login');
  };

  const handlePodcastGenerated = (podcast: PodcastData) => {
    setGeneratedPodcast(podcast);
    setCurrentView('podcast');
  };

  const handleBackToGenerator = () => {
    setCurrentView('generator');
    setGeneratedPodcast(null);
  };

  const handleLogout = async () => {
    try {
      const { error } = await authHelpers.signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        setUserData(null);
        setCurrentView('login');
        toast.success('Signed out successfully');
      }
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  // Show loading screen while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
              <Sparkles className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading PodcastAI</h2>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
          },
        }}
      />
      
      <Header 
        userData={userData}
        onShowLogin={handleShowLogin}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'login' && (
          <div className="animate-fade-in">
            <UserLogin 
              onLoginComplete={handleLoginComplete}
              onShowRegistration={handleShowRegistration}
              onBackToApp={handleBackToApp}
            />
          </div>
        )}
        
        {currentView === 'registration' && (
          <div className="animate-fade-in">
            <UserRegistration 
              onRegistrationComplete={handleRegistrationComplete}
              onShowLogin={handleShowLogin}
              onBackToApp={handleBackToApp}
            />
          </div>
        )}
        
        {currentView === 'generator' && (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              {userData && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-green-700 font-medium">
                    Welcome back, {userData.name}! 👋
                  </p>
                </div>
              )}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
                AI Podcast
                <br />
                <span className="text-4xl md:text-6xl">Generator</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                Transform your ideas into engaging podcast episodes with AI-powered conversation generation.
                <br />
                <span className="text-lg text-gray-500">Define topics, personalities, and let AI create compelling dialogues.</span>
              </p>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-white">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-500 transition-colors duration-300">
                    <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">Smart Topics</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">Define compelling subjects with rich context for authentic, engaging podcast conversations</p>
              </div>
              
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-white">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-500 transition-colors duration-300">
                    <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">Dynamic Voices</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">Craft unique speaker personalities that bring diverse perspectives and natural dialogue flow</p>
              </div>
              
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:bg-white">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-500 transition-colors duration-300">
                    <Headphones className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 ml-4">Instant Audio</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">Generate complete episodes with built-in text-to-speech for immediate listening experience</p>
              </div>
            </div>

            {/* Generator Section */}
            <div className="animate-slide-up">
              <PodcastGenerator 
                onPodcastGenerated={handlePodcastGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
          </div>
        )}
        
        {currentView === 'podcast' && (
          <div className="animate-fade-in">
            <GeneratedPodcast 
              podcast={generatedPodcast}
              onBackToGenerator={handleBackToGenerator}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;