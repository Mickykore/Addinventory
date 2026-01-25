import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserType } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

export const useRedirectEmployee = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userType = useSelector(selectUserType);

    useEffect(() => {
        if (userType === "employee") {
            toast.info("You are not authorized to access this page");
            navigate("/category");
        }
    }, [userType, navigate]);
};
