import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminService } from '../../modules/admin/services';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo/logo.svg';
import { toast } from '@/shared/hooks/use-toast';

// Define the schema for form validation
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Define TypeScript types from the Zod schema
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      const result = await adminService.sendresetLinkToEmail(data.email);
      if (result.isLeft()) {
        toast({ title: result.value });
        setLoading(false);
      } else {
        setLoading(false);
        navigate('/login');
        toast({ title: 'Email Send Successfully!!! Check Your Email' });
      }
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
        <Link to="/dashboard">
          <div className="flex justify-center gap-2">
            <img src={Logo} alt="Logo" />
            <span className="text-4xl font-semibold ">MMG</span>
          </div>
        </Link>
        <h1 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:">
          Forgot your password?
        </h1>
        <p className="font-light text-gray-500 dark:text-gray-400">
          Don't fret! Just type in your email, and we will send you a link to
          reset your password!
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:">
              Your email
            </label>
            <input
              type="email"
              {...register('email')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark: dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
