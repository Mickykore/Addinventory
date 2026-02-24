import axios from 'axios';
import { toast } from 'react-toastify';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/register`, user);
        toast.success("User registered successfully")
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message) || error.message || error.toString();
        toast.error(message);
    }
    }
export const loginUser = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/login`, user);
        if (response.statusText === "OK") {
            toast.success("Login successfully")
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
        throw new Error(message); 
    }
    }

export const logoutUser = async () => {
    try {
        await axios.get(`${BACKEND_URL}/api/users/logout`);
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

                ) || error.message || error.toString();
        toast.error(message);
        throw new Error(message); 
    }
}

export const forgetpassword = async (user) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/users/forgotpassword`, user);
        if (response.status === 200 ) {
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
        throw new Error(message); 
    }
}

export const resetpassword = async (user, resetToken) => {
    try {
        const response = await axios.put(`${BACKEND_URL}/api/users/resetpassword/${resetToken}`, user);
        if (response.statusText === "OK") {
            toast.success(response.data.message)
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
        throw new Error(message); 
    }
}

export const getLoginStatus = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const getUserProfiile = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/users/profile/`);
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const updateUserProfile = async (profileData) => {
    try {
        const response = await axios.patch(`${BACKEND_URL}/api/users/updateprofile/`, profileData);
        if (response.statusText === "OK") {
            toast.success("Profile updated successfully")
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const getAllUsersData = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/users`);
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${BACKEND_URL}/api/users/${id}`);
        if (response && response.statusText === "OK") {
            toast.success("User deleted successfully")
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const updatePassword = async (password) => {
    try {
        const response = await axios.patch(`${BACKEND_URL}/api/users/updatepassword`, password);
        if (response.statusText === "OK") {
            toast.success("Password updated successfully")
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const updateSecretKey = async (secretKey) => {
    try {
        const response = await axios.patch(`${BACKEND_URL}/api/updatesecretkey`, secretKey);
        if (response.statusText === "OK") {
            toast.success("Secret Key updated successfully")
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}

export const contactUs = async (formData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/contactUs`, formData, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.statusText === "OK") {
            toast.success("Message sent successfully")
        }
        return response.data;
    } catch (error) {
        const message = (
            error.response && error.response.data &&
            error.response.data.message

               ) || error.message || error.toString();
        toast.error(message);
    }
}