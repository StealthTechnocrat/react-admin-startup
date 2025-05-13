import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader';
import { useEffect, useState } from 'react';
import { authService } from '../../modules/admin/services';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  getCurrentAdmin,
  getCurrentAdminProfile,
} from '../../modules/admin/redux/adminSlice';

const ProtectedRoutes = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const currentAdmin = useAppSelector(getCurrentAdmin); // Store the current admin in a variable

  useEffect(() => {
    const fetchUser = async () => {
      const token = authService.getToken();

      // If no token, skip fetching user profile
      if (!token || currentAdmin) {
        setLoading(false);
        return;
      }

      try {
        // Dispatch action to fetch current admin profile
        await dispatch(getCurrentAdminProfile());
      } catch (error) {
        console.error('Error fetching user:', error);
        // Handle token expiry or other logout logic if necessary
        // dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, currentAdmin]);

  if (loading) {
    return <Loader />;
  }

  return currentAdmin ? <Outlet /> : <Navigate to="/login?session=logout" />;
};

export default ProtectedRoutes;
