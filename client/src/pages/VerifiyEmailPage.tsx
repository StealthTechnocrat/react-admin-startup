import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  getVerifyEmailStatus,
  verifyEmail,
} from '../modules/admin/redux/adminSlice';
import { toast } from '@/shared/hooks/use-toast';

const VerifyEmailPage = () => {
  const location = useLocation();

  const dispatch = useAppDispatch();
  const emailVerifiyStatus = useAppSelector(getVerifyEmailStatus);

  // Extract token from query string
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      // Redirect or show an error if the token is missing
      return;
    }

    // Call the API to verify the email
    const verifiyEmailAddress = async () => {
      try {
        await dispatch(verifyEmail({ token: token }));
        toast({
          title: `Email Verified Successfull Please Check Mail to Reset Password`,
        });
      } catch (error) {
        toast({
          title: `Email Not Verified Successfull Please Contact To Admins`,
        });
      }
    };
    verifiyEmailAddress();
  }, [token]);

  // Render based on status
  if (emailVerifiyStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (emailVerifiyStatus === 'succeeded') {
    return <Navigate to={'/login'} />;
  }

  if (emailVerifiyStatus === 'failed') {
    return <div>Invalid or missing token. Please check your email link.</div>;
  }

  return <div>Something went wrong. Please try again later.</div>;
};

export default VerifyEmailPage;
