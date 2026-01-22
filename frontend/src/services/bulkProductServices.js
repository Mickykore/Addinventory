import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const createBulkProduct = async (product) => {
    const response = await axios.post(`${BACKEND_URL}/api/products/createBulkProduct`, product)
    return response.data
}


const updateBulkProducts = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/products/updateBulkProduct`)
    return response.data
}


const bulkProductservices = {
    createBulkProduct,
    updateBulkProducts
}

export default bulkProductservices