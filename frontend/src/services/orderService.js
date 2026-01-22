import axios from "axios";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export const createOrder = async (order) => {
    const response = await axios.post(`${BACKEND_URL}/api/orders/createOrders`, order)
    return response.data;
}

export const getOrders = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/orders`);
    return response.data;
}

export const getsingleOrder = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/orders/${id}`);
    return response.data;
}

export const deleteOrder = async (id) => {
    const response = await axios.delete(`${BACKEND_URL}/api/orders/${id}`);
    return response.data;
}

export const updateOrder = async (id, data) => {
    const response = await axios.patch(`${BACKEND_URL}/api/orders/${id}`, data);
    return response.data;
}


const orderService = {
    getOrders,
    createOrder,
    getsingleOrder,
    deleteOrder,
    updateOrder
}

export default orderService;