import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@hooks/useAuth';
import { authService } from '@services/authService';
import FormInput from '@components/ui/FormInput';
import Button from '@components/ui/Button';
import { profileFormSchema, changePasswordFormSchema } from '@utils/validationSchemas';

function ProfileDetailsForm() {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: user.name, phone: user.phone || '' },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProfile({ ...data, phone: data.phone || null });
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput label="Full name" error={errors.name} {...register('name')} />
      <FormInput label="Email" value={user.email} disabled className="opacity-60" />
      <FormInput
        label="Phone (optional)"
        placeholder="+1 555 000 0000"
        error={errors.phone}
        {...register('phone')}
      />
      <Button type="submit" isLoading={isSubmitting} className="!w-auto px-6">
        Save changes
      </Button>
    </form>
  );
}

function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(changePasswordFormSchema) });

  const onSubmit = async ({ confirmNewPassword: _c, ...payload }) => {
    setIsSubmitting(true);
    try {
      await authService.changePassword(payload);
      toast.success('Password changed successfully');
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Current password"
        type="password"
        error={errors.currentPassword}
        {...register('currentPassword')}
      />
      <FormInput
        label="New password"
        type="password"
        error={errors.newPassword}
        {...register('newPassword')}
      />
      <FormInput
        label="Confirm new password"
        type="password"
        error={errors.confirmNewPassword}
        {...register('confirmNewPassword')}
      />
      <Button type="submit" isLoading={isSubmitting} variant="secondary" className="!w-auto px-6">
        Update password
      </Button>
    </form>
  );
}

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <span className="grid place-items-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-500">
                Admin
              </span>
            )}
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Profile details
          </h2>
          <ProfileDetailsForm />
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Change password
          </h2>
          <ChangePasswordForm />
        </div>
      </motion.div>
    </div>
  );
}