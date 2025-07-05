import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { authHelpers } from '../lib/supabase';

interface UserLoginProps {
  onLoginComplete: (userData: { name: string; email: string }) => void;
  onShowRegistration: () => void;
  onBackToApp: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({
  onLoginComplete,
  onShowRegistration,
  onBackToApp,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      toast.error('Please enter your password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check for too many failed attempts
    if (loginAttempts >= 5) {
      toast.error('Too many failed attempts. Please wait 5 minutes before trying again.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      toast.loading('Signing you in...', { id: 'login' });
      
      // Authenticate user with Supabase
      const { data, error } = await authHelpers.signIn(
        formData.email.trim(),
        formData.password
      );

      if (error) {
        // Handle specific Supabase errors
        setLoginAttempts(prev => prev + 1);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please check your credentials and try again.', { id: 'login' });
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link before signing in.', { id: 'login' });
        } else if (error.message.includes('Too many requests')) {
          toast.error('Too many login attempts. Please wait a few minutes before trying again.', { id: 'login' });
        } else {
          toast.error(error.message || 'Login failed. Please try again.', { id: 'login' });
        }
        
        // Clear password field on failed attempt
        setFormData(prev => ({ ...prev, password: '' }));
        
        // Show additional help after multiple failed attempts
        if (loginAttempts >= 2) {
          setTimeout(() => {
            toast('💡 Tip: Make sure you\'ve confirmed your email address', {
              duration: 5000,
              icon: '💡',
            });
          }, 2000);
        }
        
        return;
      }

      if (data.user && data.session) {
        toast.success('Login successful! Welcome back.', { id: 'login' });
        setLoginAttempts(0); // Reset attempts on successful login
        
        // Pass user data back to parent
        onLoginComplete({
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || formData.email
        });
      } else {
        toast.error('Login failed. Please try again.', { id: 'login' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please check your connection and try again.', { id: 'login' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-3xl transition-all duration-500">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-light">Sign in to continue creating amazing podcasts</p>
          </div>

          {/* Supabase Info */}
          <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure Authentication:
            </h3>
            <div className="text-xs text-green-700 space-y-1">
              <p>✓ Powered by Supabase</p>
              <p>✓ Create an account or sign in with your credentials</p>
              <p>✓ Your data is securely encrypted</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-purple-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-700">
                  {loginAttempts === 1 && "Incorrect credentials. Please try again."}
                  {loginAttempts === 2 && "Still having trouble? Check your email and password."}
                  {loginAttempts >= 3 && loginAttempts < 5 && "Multiple failed attempts. Please verify your credentials."}
                  {loginAttempts >= 5 && "Too many failed attempts. Please wait 5 minutes before trying again."}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loginAttempts >= 5}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onShowRegistration}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                disabled={isSubmitting}
              >
                Create one here
              </button>
            </p>
          </div>

          {/* Back to App */}
          <div className="mt-4 text-center">
            <button
              onClick={onBackToApp}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              disabled={isSubmitting}
            >
              ← Back to Podcast Generator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;