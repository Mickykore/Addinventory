import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import { getReport } from '../redux/features/sales/reportSlice';

const initialState = {
  startDate: '',
  endDate: '',
};

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [Date, setDate] = useState(initialState);

  const dispatch = useDispatch();

  const { startDate, endDate } = Date;

  const generateCustomReport = async () => {
    e.preventDefault();

    if(!startDate || !endDate) {
      return alert('Please select start and end date');
    }

    data = {
      startDate,
      endDate,
    };

    dispatch(getReport(data))
  };

  const handleDateChange = (e) => {
    const {name, value} = e.target;
    setDate({ ...Date, [name]: value });
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    return formattedDate;
  };

  const getStartOfMonth = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const formattedDate = startDate.toISOString().split('T')[0];
    return formattedDate;
  };

  const getEndOfMonth = () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const formattedDate = endDate.toISOString().split('T')[0];
    return formattedDate;
  };

  const getStartOfYear = () => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const formattedDate = startDate.toISOString().split('T')[0];
    return formattedDate;
  };

  const getEndOfYear = () => {
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), 11, 31);
    const formattedDate = endDate.toISOString().split('T')[0];
    return formattedDate;
  };

  const handleGenerateDailyReport = () => {
    const currentDate = getCurrentDate();
    setStartDate(currentDate);
    setEndDate(currentDate);
    generateCustomReport();
  };

  const handleGenerateMonthlyReport = () => {
    const startDate = getStartOfMonth();
    const endDate = getEndOfMonth();
    setStartDate(startDate);
    setEndDate(endDate);
    generateCustomReport();
  };

  const handleGenerateYearlyReport = () => {
    const startDate = getStartOfYear();
    const endDate = getEndOfYear();
    setStartDate(startDate);
    setEndDate(endDate);
    generateCustomReport();
  };

  return (
    <div>
      <h2>Auto Reports</h2>
      <div>
        <h3>Daily Report</h3>
        {reportData && (
          <table>
            {/* Render daily report table */}
          </table>
        )}
      </div>

      <div>
        <h3>Monthly Report</h3>
        {reportData && (
          <table>
            {/* Render monthly report table */}
          </table>
        )}
      </div>

      <div>
        <h3>Yearly Report</h3>
        {reportData && (
          <table>
            {/* Render yearly report table */}
          </table>
        )}
      </div>

      <h2>Custom Report</h2>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" name={startDate} value={startDate} onChange={handleDateChange} />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" name={endDate} value={endDate} onChange={handleDateChange} />
      </div>
      <button onClick={generateCustomReport}>Generate Report</button>
      {reportData && (
        <div>
          <h3>Custom Report</h3>
          <table>
            {/* Render custom report table */}
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
