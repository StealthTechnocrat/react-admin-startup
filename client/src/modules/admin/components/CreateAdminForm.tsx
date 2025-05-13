import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminService } from '../services';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/shared/hooks/use-toast';

// Define the validation schema using zod
const createAdminSchema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
});

// Infer the TypeScript type for form data
export type CreateAdminData = z.infer<typeof createAdminSchema>;

const CreateAdminForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAdminData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      password: 'Admin@123',
    },
  });

  // Submit handler
  const onSubmit = async (data: CreateAdminData) => {
    try {
      const result = await adminService.createAdmin(data);

      if (result.isLeft()) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.value,
        });
      } else {
        toast({ title: 'Admin Created Successfully' });
        navigate('#');
        reset();
      }
    } catch (error) {}
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Name"
              className={`w-full rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-stroke'
              } bg-transparent py-4 pl-6 pr-10  outline-none focus:border-primary 
               dark:border-form-strokedark dark:bg-form-input dark:`}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-stroke'
              } bg-transparent py-4 pl-6 pr-10  outline-none focus:border-primary 
               dark:border-form-strokedark dark:bg-form-input dark:`}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-5">
          <input
            type="submit"
            value="Sign In"
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4  
            transition hover:bg-opacity-90"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAdminForm;
