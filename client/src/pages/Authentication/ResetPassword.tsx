import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { adminService } from '../../modules/admin/services';
import { toast } from 'react-toastify';
import Logo from '../../assets/images/logo/logo.svg';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Skull } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [tokenMissing, setTokenMissing] = useState<boolean>(false);

  // Extract token from query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenMissing(true);
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormType) => {
    try {
      if (!token) {
        toast.error('Token not found');
        return;
      }
      setLoading(true);

      const result = await adminService.resetPassword(data, token);

      if (result.isLeft()) {
        toast.error(result.value);
      } else {
        toast.success('Password changed successfully');
        setLoading(false);
        navigate('/login');
        reset();
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error in changing password');
    }
  };

  if (tokenMissing) {
    return <Navigate to={'/not-found'} />;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        <div className="flex justify-center gap-2">
          <img src={Logo} alt="Logo" />
          <span className="text-4xl font-semibold">MMG</span>
        </div>
        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:">
          Reset Password
        </h2>
        <form
          className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:ring-blue-500 dark:focus:border-blue-500"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-lg py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover: dark:hover:bg-gray-700"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
