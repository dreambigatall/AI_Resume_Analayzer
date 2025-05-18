// src/pages/SignupPage.tsx
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../lib/supabaseClient';
import { SignupSchema } from '../lib/validators';
import type { SignupFormData } from '../lib/validators';
 import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

   if (session) {
    navigate('/');
    return null;
  }

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });

      if (error) {
        toast.error("Signup Failed", {
          description: error.message
        });
      } else {
        toast.success("Signup Successful!", {
          description: "Please check your email to confirm your account."
        });
        navigate('/login');
      }
    } catch (err) {
      toast.error("An Unexpected Error Occurred", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-11"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                className="h-11"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Account...
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
            </span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;