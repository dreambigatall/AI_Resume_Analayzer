// src/pages/LoginPage.tsx
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabaseClient';
// import { LoginSchema, LoginFormData } from '@/lib/validators';
import { LoginSchema,type LoginFormData } from '@/lib/validators';
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Input } from '../components/ui/input';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast"; // npx shadcn-ui@latest add use-toast
import { toast } from 'sonner';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // To redirect if already logged in

const LoginPage = () => {
  const navigate = useNavigate();
  // const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth(); // Get session from context

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  // Redirect if user is already logged in
  if (session) {
    navigate('/');
    return null; // or a loading indicator
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        toast.error("Login Failed", {
          description: error.message || "Invalid credentials."
        });
      } else {
        // Wait for session to be set
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          toast.success("Login Successful", {
            description: "Welcome back!"
          });
          navigate('/');
        }
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
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
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
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
            </span>
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;