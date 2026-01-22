import { selectIsLoggedIn, selectUserType } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';

export const ShowOnLogout = ({ children }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return !isLoggedIn ? children : null;
    }

export const ShowOnLogin = ({ children }) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return isLoggedIn ? children : null;
}

export const ShowOnAdmin = ({ children }) => {
    const isAdmin = useSelector(selectUserType);
    return isAdmin ? children : null;
}