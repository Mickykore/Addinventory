import axios from "axios";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const createSales = async (sale) => {
    const response = await axios.post(`${BACKEND_URL}/api/sales/createsales`, sale);
    return response.data;
    }

const getSales = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/sales`);
    return response.data;
}

const deleteSale = async (id) => {
    const response = await axios.delete(`${BACKEND_URL}/api/sales/${id}`);
    console.log("deletedata",response.data)
    return response.data;
}

const updateSale = async (id, data) => {
    const response = await axios.patch(`${BACKEND_URL}/api/sales/${id}`, data);
    return response.data;
}

const getSingleSale = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/sales/${id}`);
    return response.data;
}

const getCumulativeSales = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/sales/cumulativesale`);
    return response.data;
}

const saleservices = {
    createSales,
    getSales,
    deleteSale,
    updateSale,
    getSingleSale,
    getCumulativeSales
}

export default saleservices;