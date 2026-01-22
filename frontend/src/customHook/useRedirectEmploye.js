import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUserType } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

export const useRedirectEmployee = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectUserType);
  const redirected = useRef(false);

  useEffect(() => {
    if (userType === "employee" && !redirected.current) {
      redirected.current = true;

      setTimeout(() => {
        toast.info("You are not authorized to access this page");
        navigate("/category", { replace: true });
      }, 0);
    }
  }, [userType, navigate]);
};
