import axios from "axios";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export const createExpense = async (expense) => {
    const response = await axios.post(`${BACKEND_URL}/api/expenses/createExpense`, expense)
    return response.data;
}

export const getExpenses = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/expenses`);
    return response.data;
}

export const getSingleExpense = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/expenses/${id}`);
    return response.data;
}

export const deleteExpense = async (id) => {
    const response = await axios.delete(`${BACKEND_URL}/api/expenses/${id}`);
    return response.data;
}

export const updateExpense = async (id, data) => {
    const response = await axios.patch(`${BACKEND_URL}/api/expenses/${id}`, data);
    return response.data;
}

const expenseService = {
    getExpenses,
    createExpense,
    getSingleExpense,
    deleteExpense,
    updateExpense
}

export default expenseService;