import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const createCategory = async (category) => {
        const response = await axios.post(`${BACKEND_URL}/api/categories/createCategory`, category);
        return response.data;
    }

export const getCategories = async () => {
        const response = await axios.get(`${BACKEND_URL}/api/Categories`);
        return response.data;
}

export const deleteCategory = async (id) => {
        const response = await axios.delete(`${BACKEND_URL}/api/categories/deleteCategory/${id}`);
        console.log(response);
        return response.data;
}

export const updateCategory = async (id, data) => {
        const response = await axios.patch(`${BACKEND_URL}/api/categories/updateCategory/${id}`, data);
        return response.data;
}

export const getCategoryById = async (id) => {
        const response = await axios.get(`${BACKEND_URL}/api/categories/${id}`);
        return response.data;
};