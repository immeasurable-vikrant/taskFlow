import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupValues = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const [signupError, setSignupError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupValues) => {
    try {
      setSignupError(null);
      await signup(data.firstName, data.lastName, data.email, data.password);
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : 'Failed to sign up. Please try again.');
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Sign up to get started with TaskFlow"
    >
      {signupError && (
        <Alert 
          variant="error" 
          message={signupError} 
          onDismiss={() => setSignupError(null)} 
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="First Name"
          placeholder="John"
          icon={<User className="w-4 h-4" />}
          error={errors.firstName?.message}
          {...register('firstName')}
        />

         <Input
          label="Last Name"
          placeholder="Doe"
          icon={<User className="w-4 h-4" />}
          error={errors.lastName?.message}
          {...register('lastName')}
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          icon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        
        <div className="pt-2">
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isSubmitting}
          >
            Sign up
          </Button>
        </div>
        
        <div className="text-center text-sm mt-4">
          <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium">
            Log in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};