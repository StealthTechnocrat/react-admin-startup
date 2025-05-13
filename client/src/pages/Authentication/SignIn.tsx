import React, { useEffect } from 'react';
import LoginForm from '../../modules/admin/components/LoginForm';
import { useSearchParams } from 'react-router-dom';
import { authService } from '@/modules/admin/services';
import { toast } from '@/shared/hooks/use-toast';

const SignIn: React.FC = () => {
  const [params, setSearchParams] = useSearchParams();

  const sessionParam = params.get('session');
  if (sessionParam === 'expired') {
    toast({ title: 'Session Expired' });
  }

  useEffect(() => {
    setSearchParams(new URLSearchParams());
  }, []);

  return (
    <>
      <div className="rounded-sm border h-screen ">
        <div className="w-full h-screen flex flex-wrap items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default SignIn;
