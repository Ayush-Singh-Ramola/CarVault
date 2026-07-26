import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import FormInput from '@components/ui/FormInput';
import Button from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { registerFormSchema } from '@utils/validationSchemas';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async ({ confirmPassword: _confirmPassword, ...payload }) => {
    setIsSubmitting(true);
    try {
      await registerUser(payload);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Join CarVault to save favorites, compare cars, and leave reviews.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormInput
          label="Full name"
          placeholder="Jane Doe"
          error={errors.name}
          {...register('name')}
        />
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
        <FormInput
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          {...register('confirmPassword')}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}