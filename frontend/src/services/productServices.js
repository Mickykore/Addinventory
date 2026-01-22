import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const createProduct = async (product) => {
    const response = await axios.post(`${BACKEND_URL}/api/products/createProducts`, product)
    return response.data
}

const getProducts = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/products`)
    return response.data
}

const getCumulativeProducts = async () => {
    const response = await axios.get(`${BACKEND_URL}/api/products/cumulativeProduct`)
    return response.data
}

const deleteProduct = async (id) => {
    const response = await axios.delete(`${BACKEND_URL}/api/products/${id}`)
    return response.data
}

const getSingleProduct = async (id) => {
    const response = await axios.get(`${BACKEND_URL}/api/products/${id}`)
    return response.data
}

const updateProduct = async (id, data) => {
    const response = await axios.patch(`${BACKEND_URL}/api/products/${id}`, data)
    return response.data
}

const deleteCumulativeProduct = async (id) => {
    const response = await axios.delete(`${BACKEND_URL}/api/products/deleteCumulativeProduct/${id}`)
    return response.data
}

const productservices = {
    createProduct,
    getProducts,
    getCumulativeProducts,
    deleteProduct,
    getSingleProduct,
    updateProduct,
    deleteCumulativeProduct
}

export default productservices