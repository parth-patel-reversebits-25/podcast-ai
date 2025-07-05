import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { authHelpers } from '../lib/supabase';

interface UserRegistrationProps {
  onRegistrationComplete: (userData: { name: string; email: string }) => void;
  onShowLogin: () => void;
  onBackToApp: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({
  onRegistrationComplete,
  onShowLogin,
  onBackToApp,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      toast.error('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      toast.loading('Creating your account...', { id: 'registration' });
      
      // Register user with Supabase
      const { data, error } = await authHelpers.signUp(
        formData.email.trim(),
        formData.password,
        formData.name.trim()
      );

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please sign in instead.', { id: 'registration' });
          setTimeout(() => {
            onShowLogin();
          }, 2000);
          return;
        } else if (error.message.includes('Password should be at least')) {
          toast.error('Password must be at least 6 characters long', { id: 'registration' });
          return;
        } else if (error.message.includes('Invalid email')) {
          toast.error('Please enter a valid email address', { id: 'registration' });
          return;
        } else {
          toast.error(error.message || 'Registration failed. Please try again.', { id: 'registration' });
          return;
        }
      }

      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          toast.success('Account created! Please check your email to verify your account.', { id: 'registration' });
          setTimeout(() => {
            onShowLogin();
          }, 3000);
        } else {
          // User is automatically signed in
          toast.success('Account created successfully! Welcome aboard!', { id: 'registration' });
          
          // Pass user data back to parent
          onRegistrationComplete({
            name: data.user.user_metadata?.full_name || formData.name,
            email: data.user.email || formData.email
          });
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Network error. Please check your connection and try again.', { id: 'registration' });
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
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
              Create Account
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-light">Join us to start creating amazing podcasts</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  disabled={isSubmitting}
                  required
                  minLength={2}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-purple-500" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
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
                  <Lock className="w-5 h-5 text-green-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  disabled={isSubmitting}
                  required
                  minLength={6}
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
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-orange-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onShowLogin}
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                disabled={isSubmitting}
              >
                Sign in here
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

export default UserRegistration;