import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const TaskTokAuth = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Signup specific validations
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      try {
        // Mock authentication - always succeed for demo purposes
        const mockUser = {
          id: 1,
          name: isLogin ? 'Demo User' : formData.name,
          email: formData.email,
          token: 'mock-jwt-token-12345'
        };

        // Store user data in memory (not localStorage for hosting compatibility)
        window.currentUser = mockUser;

        // Call the parent component to indicate successful authentication
        if (onAuthenticated) {
          onAuthenticated(mockUser);
        }

        setIsLoading(false);
      } catch (error) {
        setErrors({ submit: 'Authentication failed. Please try again.' });
        setIsLoading(false);
      }
    }, 1500); // Simulate network delay
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    
    // Mock social login
    setTimeout(() => {
      const mockUser = {
        id: 1,
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        token: `mock-${provider.toLowerCase()}-token`
      };

      window.currentUser = mockUser;

      if (onAuthenticated) {
        onAuthenticated(mockUser);
      }

      setIsLoading(false);
    }, 1000);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 p-4 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 w-12 h-12 bg-pink-300 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute top-20 right-20 w-8 h-8 bg-purple-300 rounded-full opacity-40 animate-bounce delay-300"></div>
      <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-yellow-300 rounded-full opacity-40 animate-bounce delay-700"></div>
      <div className="absolute top-1/3 right-10 w-10 h-10 bg-blue-300 rounded-full opacity-40 animate-bounce delay-500"></div>

      {/* Heart decorations */}
      <div className="absolute top-16 right-1/3 text-pink-400 text-3xl animate-pulse opacity-60">💖</div>
      <div className="absolute bottom-32 right-16 text-purple-400 text-2xl animate-pulse delay-1000 opacity-60">💜</div>
      <div className="absolute top-1/2 left-8 text-yellow-400 text-xl animate-pulse delay-700 opacity-60">💛</div>

      {/* Main container */}
      <div className="max-w-md mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            TaskTok
          </h1>
          <p className="text-purple-600 text-lg">
            {isLogin ? 'Welcome back! ✨' : 'Join the productivity fun! 🎉'}
          </p>
        </div>

        {/* Auth form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-purple-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-purple-500 text-sm">
              {isLogin ? 'Continue your productivity journey!' : 'Start your kawaii productivity adventure!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                      errors.name 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-purple-200 focus:border-purple-500'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-purple-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-purple-200 focus:border-purple-500'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-purple-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-11 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                    errors.password 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-purple-200 focus:border-purple-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field (signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                      errors.confirmPassword 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-purple-200 focus:border-purple-500'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit error */}
            {errors.submit && (
              <div className="text-center">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <div className="text-center mt-6">
            <p className="text-purple-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-2 font-semibold text-purple-700 hover:text-purple-900 underline transition-colors"
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Forgot password (login only) */}
          {isLogin && (
            <div className="text-center mt-4">
              <button 
                className="text-purple-500 text-sm hover:text-purple-700 underline transition-colors"
                disabled={isLoading}
                onClick={() => alert('Password reset feature coming soon! 🌸')}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Social login options */}
        <div className="mt-6 text-center">
          <p className="text-purple-600 text-sm mb-4">Or continue with</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 border-2 border-purple-200 hover:border-purple-300 rounded-2xl p-3 shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                G
              </div>
            </button>
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 border-2 border-purple-200 hover:border-purple-300 rounded-2xl p-3 shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-gray-800 to-black rounded text-white flex items-center justify-center text-xs font-bold">
                G
              </div>
            </button>
          </div>
        </div>

        {/* Demo note */}
        <div className="mt-6 text-center">
          <p className="text-purple-500 text-xs bg-white/50 rounded-full px-4 py-2 inline-block">
            🌸 This is a demo - any email/password will work! 🌸
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskTokAuth;