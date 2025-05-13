import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminService } from '../services';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/shared/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

// Define the validation schema using zod
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
});

// Infer the TypeScript type for form data
export type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Submit handler
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const result = await adminService.adminLogin(data);

      if (result.isLeft()) {
        toast({
          variant: 'destructive',
          title: 'Error In Login',
          description: result.value,
        });
        setLoading(false);
      } else {
        toast({ title: 'LOGIN SUCCESSFUL', variant: 'success' });
        navigate('/');
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error In Login' });
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-stroke'
                  } bg-transparent py-4 pl-6 pr-10  outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-Input dark:`}
                  {...register('email')}
                  autoFocus
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                {/* <div className="flex items-center">
                  <Link
                    to="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>

                  <div className=""> */}
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`w-full rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-stroke'
                  } bg-transparent py-4 pl-6 pr-10  outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-Input dark:`}
                  {...register('password')}
                />
                <div className="absolute right-2 top-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                {/* </div> */}
                {/* </div> */}
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
