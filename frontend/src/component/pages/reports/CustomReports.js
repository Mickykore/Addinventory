
import { useState, useEffect } from 'react';
import ReportGenerator from './ReportGenerator';
import ExpenseReportGerator from './ExpenseReportGenerator';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { useRedirectEmployee } from '../../../customHook/useRedirectEmploye';
import { useRedirectLogOutUser } from '../../../customHook/useRedirectLogOutUser';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toEthiopian, toGregorian } from 'ethiopic-js';
import { EthDateTime, limits } from 'ethiopian-calendar-date-converter'



const CustomReports = () => {

  useRedirectLogOutUser();
  useRedirectEmployee();

  const firstComponentRef = useRef();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [printView, setPrintView] = useState(false);
  const [convertedDate, setConveredDate] = useState('');
  const [conversionType, setConversionType] = useState('toGregorian');
  const [gDate, setGDate] = useState("")


  const { totalSale, totalExpense, totalProfit, totalPurchase } = useSelector((state) => state.report);

  useEffect(() => {
    setTotalExpenses(totalExpense);
    setTotalSales(totalSale);
    setTotalProfits(totalProfit);
    setTotalPurchases(totalPurchase);
  }, [totalSale, totalExpense, totalProfit, totalPurchase]);

  useEffect(() => {
  if (startDate && !endDate) {
    setEndDate(startDate);
  } else if (!startDate && endDate) {
    setStartDate(endDate);
  }
}, [startDate, endDate]);



  const handlePrint = () => {
    setPrintView(true);
  };
  const handleBeforeGetContent = async () => {
      await setPrintView(true);
  };


  const convertToGregorian = (ethiopianDate) => {
    const [year, month, day] = ethiopianDate.split('/').map(Number);
    const gregorianDate = toGregorian(year, month, day);
    return gregorianDate.join('/');
  };

  // const convertToEthiopian = (gregorianDate) => {
  //   const [year, month, day] = gregorianDate.split('/').map(Number);
  //   console.log("oj", year, month, day);
  //   const ethiopianDate = EthDateTime.fromEuropeanDate(year, month, day, 1, // hour (in Ethioian Time format)
  //   52, // minute (in Ethioian Time format)
  //   52,)
  //   return ethiopianDate.join('/');
  // };

  const handleDateConversion = () => {
    if (conversionType === 'toGregorian') {
      setGDate(convertToGregorian(convertedDate));
    } 
    // else {
    //   setGDate((convertToEthiopian(convertedDate)));
    // }
  };

  

  

  return (
    <div>
      <div>
      <ul class="nav nav-pills">
        <button  className="nav-link disabled"><Link to="/reports">Custom Report</Link></button>
        <Link to="/Daily-report" ><button  className="nav-link">Daily Report</button></Link>
        <Link to="/Monthly-Report"><button  className="nav-link">Monthly Reports</button></Link>
        <Link to="/Yearly-report" ><button  className="nav-link">Yearly Report</button></Link>
        <Link to="/Tax-report"><button  className="nav-link">Tax Report</button></Link>
      </ul>
        </div>
        <div className='row mx-auto'>
          <div className="col-md-6">
      <h2>input Dates</h2>
      <form style={{fontSize: "1.5rem", padding: "1.5rem", maxWidth: "300px", minHeight: "230px"}}>
      <div className="form-group">
        <label htmlFor="startDate" >Start Date:</label>
        <DatePicker 
          selected={startDate ? new Date(startDate) : null} 
          showIcon
          dateFormat="yyyy/MM/dd"
          placeholderText="yyyy/mm/dd" 
          showYearDropdown
          scrollableYearDropdown
          onChange={(date) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              setStartDate(`${year}-${month}-${day}`); // Store as "YYYY-MM-DD"
            } else {
              setStartDate(null); // Clear startDate if date is removed
            }
          }} 
          className="form-control"
        />
      </div>
      <div >
        <label htmlFor="endDate" className="form-label">End Date  : </label>
        <DatePicker
          selected={endDate ? new Date(endDate) : null}
          showIcon
          placeholderText="yyyy/mm/dd"
          showYearDropdown
          scrollableYearDropdown
          onChange={(date) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              setEndDate(`${year}-${month}-${day}`); // Store as "YYYY-MM-DD" string
            } else {
              setEndDate(null); // Clear endDate state if user removes the date
            }
          }}
          dateFormat="yyyy/MM/dd"
          className="form-control"
          style={{ width: '300px', height: '350px' }}
        />
      </div>
      {/* <button className="btn btn-lg btn-primary ">Generate Report</button> */}
      </form>
      </div>
      <div className="col-md-6 px-auto">
      <h2>Date Converter</h2>
      <form className="col" style={{ fontSize: "1.5rem", padding: "1.5rem",  maxWidth: "300px", minHeight: "230px" }}>
        <div className="form-group">
          <label htmlFor="ethiopianDate">Ethiopian Date:</label>
          <input
            type="text"
            className="form-control"
            id="ethiopianDate"
            placeholder="yyyy/mm/dd"
            required
            value={convertedDate}
            onChange={(e) => setConveredDate(e.target.value)}
          />
          
        </div>
        {/* <div className="form-group">
          <label>Convert:</label>
          <select className="form-control" onChange={(e) => setConversionType(e.target.value)}>
            <option value="toGregorian">To Gregorian</option>
            <option value="toEthiopian">To Ethiopian</option>
          </select>
        </div> */}
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={handleDateConversion}>Convert</button>
        </div>
        <label htmlFor="ethiopianDate">Gregorian Date:</label>
        <input
            type="text"
            className="form-control"
            id="ethiopianDate"
            disabled
            value={gDate}
          />
      </form>
      </div>
      </div>
        <div>
        </div>
        <div>
          <br />
        <h2>Custom Sale Report</h2>
        <ReportGenerator startDate={startDate} endDate={endDate} />
      </div>
        <div>
        <h2>Custom Expense Report</h2>
        <ExpenseReportGerator startDate={startDate} endDate={endDate} />
      </div>
      <div>
          <h2>Profit After Expense Within Selected Period</h2>
          <div className='table-responsive'>
          <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => firstComponentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
          <div style={{margin: printView ? "30px" : null}} ref={firstComponentRef}>
          {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2 >Income Within selected period</h2></div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
          <table className="table table-striped table-hover caption-top"  style={{fontSize: "12px"}}>
            <thead>
              <tr>
                <th>No</th>
                <th>Total Purchase Price</th>
                <th>Total Sales</th>
                <th>Gross Profit</th>
                <th>TOtal Expense</th>
                <th>Net Income</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>1</td>
                  <td>{totalPurchases}</td>
                  <td>{totalSales}</td>
                  <td>{totalProfits}</td>
                  <td>{totalExpenses}</td>
                  <td>{totalProfits - totalExpenses}</td>
                </tr>
            </tbody>
          </table>
          </div>
          </div>
        </div>
    </div>
  );
};

export default CustomReports;
