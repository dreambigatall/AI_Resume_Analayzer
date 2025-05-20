import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SignupSchema } from '../lib/validators';
import type { SignupFormData } from '../lib/validators';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Simple spinner for loading state
const Spinner = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
);

export default function SignupPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { email: '', password: '' },
  });

  // Redirect if already logged in
  if (session) {
    navigate('/');
    return null;
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      // If Supabase reported an error or didn't return a user, treat as failure
      if (error || !signUpData?.user) {
        throw new Error(error?.message || 'Signup failed. Please try again.');
      }

      toast.success('Account Created!', {
        description: 'Check your inbox to verify and then log in.',
      });
      navigate('/login');
    } catch (err: any) {
      toast.error('Signup Failed', {
        description: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-4xl font-bold text-indigo-600 dark:text-teal-300">
            Join the Hiring Hub
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage job posts and candidate resumes in one place.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoFocus
                className={`mt-1 h-12 px-4 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 border rounded-lg shadow-sm ${
                  errors.email
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus-visible:ring-indigo-500 dark:focus-visible:ring-teal-400'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`mt-1 h-12 px-4 pr-10 w-full bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 border rounded-lg shadow-sm ${
                    errors.password
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus-visible:ring-indigo-500 dark:focus-visible:ring-teal-400'
                  }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.055 10.055 0 013.158-4.415m3.3-2.01A9.973 9.973 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.978 9.978 0 01-1.249 2.527M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white flex items-center justify-center transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Creating...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 dark:text-teal-300 font-medium underline hover:text-indigo-500 dark:hover:text-teal-200"
            >
              Log In
            </Link>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
