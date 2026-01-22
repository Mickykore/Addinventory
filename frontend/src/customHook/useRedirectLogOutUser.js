import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SET_LOGIN } from "../redux/features/auth/authSlice";
import { getLoginStatus } from "../services/authService";
import { toast } from "react-toastify";

export const useRedirectLogOutUser = () => {
 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const redirectLogoutUser = async () => {
            const status = await getLoginStatus();
            dispatch(SET_LOGIN(status));
            if (!status) {
                toast.info("session expired, please login again")
                navigate("/login");
            }
        }
        redirectLogoutUser();
    }, [dispatch, navigate])
}


