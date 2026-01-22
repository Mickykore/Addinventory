import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRedirectLogOutUser } from '../../../../customHook/useRedirectLogOutUser';
import { useRedirectEmployee } from '../../../../customHook/useRedirectEmploye';
import { useSelector, useDispatch } from 'react-redux';
import ReactToPrint from 'react-to-print';
import calculateYearlyTax from './taxUtils';
import { getReport } from '../../../../redux/features/sales/reportSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../../../dashboard.css"

const TaxReport = () => {
  useRedirectLogOutUser();
  useRedirectEmployee();

  const firstComponentRef = useRef();
  const dispatch = useDispatch();

  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const [taxYear, setTaxYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [printView, setPrintView] = useState(false);

  useEffect(() => {
    const updateTaxDates = () => {
      const startOfTaxYear = new Date(taxYear - 1, 6, 8); // July 8 of the previous year
      const endOfTaxYear = new Date(taxYear, 6, 7); // July 7 of the current year

      setStartDate(startOfTaxYear.toISOString().slice(0, 10));
      setEndDate(endOfTaxYear.toISOString().slice(0, 10));
    };
    updateTaxDates();
  }, [taxYear]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getReport({ startDate, endDate }));
    }
  }, [dispatch, startDate, endDate]);

  const { reports, totalExpense } = useSelector((state) => state.report);
  const totalProfit = reports.reduce((sum, report) => sum + report.totalProfit, 0);

  const tax = calculateYearlyTax(totalProfit - totalExpense);

  useEffect(() => {
    setTotalExpenses(totalExpense);
    setTotalProfits(totalProfit);
  }, [totalExpense, totalProfit]);

  const handlePrint = () => {
    setPrintView(true);
  };

  const handleBeforeGetContent = async () => {
    await setPrintView(true);
  };

  const handleTaxYearChange = (date=2024) => {
    setTaxYear(date.getFullYear());
  };

  return (
    <>
      <div>
        <ul className="nav nav-pills">
          <Link to="/reports"><button className="nav-link">Custom Report</button></Link>
          <Link to="/Daily-report"><button className="nav-link">Daily Report</button></Link>
          <Link to="/Monthly-Report"><button className="nav-link">Monthly Reports</button></Link>
          <Link to="/Yearly-report"><button className="nav-link">Yearly Report</button></Link>
          <button className="nav-link disabled"><Link to="/Tax-report">Yearly Report</Link></button>
        </ul>
      </div>
      <div>
        <h2>Yearly Profit After Expense</h2>
        <div>
          <label htmlFor="taxYearSelect" style={{fontSize: "2rem"}}>Select Tax Year: </label>
          <DatePicker
            selected={new Date(taxYear, 0, 1)}
            onChange={handleTaxYearChange}
            showIcon
            showYearPicker
            dateFormat="yyyy"
            showYearDropdown
            scrollableYearDropdown
            className="form-control"
          />
        </div>
        <div className='table-responsive'>
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
            )}
            content={() => firstComponentRef.current}
            onAfterPrint={() => setPrintView(false)}
            onBeforeGetContent={handleBeforeGetContent}
          />
          <div style={{ margin: printView ? "30px" : null }} ref={firstComponentRef}>
            {printView && (
              <>
                <div style={{ padding: "1.5rem" }}><h2>Yearly Income</h2></div>
                <div style={{ marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem" }}>Date: {new Date().toLocaleDateString()}</div>
              </>
            )}
            <table className="table table-striped table-hover caption-top" style={{ fontSize: "12px" }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Gross Profit</th>
                  <th>Total Expense</th>
                  <th>Net Income</th>
                  <th>Taxable Range</th>
                  <th>Tax Percentage</th>
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{totalProfits.toFixed(2)}</td>
                  <td>{totalExpenses.toFixed(2)}</td>
                  <td>{(totalProfits - totalExpenses).toFixed(2)}</td>
                  <td>{tax.range}</td>
                  <td>{tax.percentage}%</td>
                  <th>{tax.tax.toFixed(2)} Birr</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxReport;
