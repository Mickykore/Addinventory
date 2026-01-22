import axios from 'axios';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const getReport = async (Date) => {
    const response = await axios.post(`${BACKEND_URL}/api/sales/reports`, Date);
    return response.data;
  };

const reportService = {
    getReport
};

export default reportService;

