import {useLocation, Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../Store/Store';


const RequireAuth = ({ allowedRoles }) => {
  const profile = useProfile((state) => state.profile);
    const location = useLocation();
    return (
        profile?.roles?.find(role => allowedRoles?.includes(role))
        ? <Outlet />
        : profile?.accessToken
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
