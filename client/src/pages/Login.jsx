import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import FormInput from '@components/ui/FormInput';
import Button from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { loginFormSchema } from '@utils/validationSchemas';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sign in to save favorites and manage your account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email}
          {...register('email')}
        />
        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password}
          {...register('password')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-xs text-gray-500 dark:text-gray-400">
        Demo: <span className="font-mono">user@carvault.com</span> /{' '}
        <span className="font-mono">User@123</span>
      </div>
    </div>
  );
}