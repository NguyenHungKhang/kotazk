import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as apiService from '../api/index'
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/actions/user.action';

const AuthCheck = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // List of paths where we don't want to call the API
    const skipPaths = ['/login', '/register', '/OtpVerification'];

    useEffect(() => {
        if (!skipPaths.includes(location.pathname)) {
            const checkUserAuth = async () => {
                try {
                    const response = await apiService.userAPI.getCurrentOne();
                    if (response?.status == 401) {
                        navigate('/login');
                    } else {
                        dispatch(setCurrentUser(response.data))
                    }
                } catch (error) {
                    navigate('/login');
                    console.log(error);
                }
            };

            checkUserAuth();
        }
    }, [location, navigate]);
    return null;
};

export default AuthCheck;