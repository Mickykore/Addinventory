import React, { useState, useEffect } from 'react';
import ReportGenerator from '../ReportGenerator';
import { Link } from 'react-router-dom';
import { useRedirectLogOutUser } from '../../../../customHook/useRedirectLogOutUser';
import { useRedirectEmployee } from '../../../../customHook/useRedirectEmploye';
import ExpenseReportGerator from '../ExpenseReportGenerator';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import calculateYearlyTax from './taxUtils';

const YearlyReport = () => {

  useRedirectLogOutUser();
  useRedirectEmployee();

  const firstComponentRef = useRef();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProfits, setTotalProfits] = useState(0);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [printView, setPrintView] = useState(false);

  const { totalSale, totalExpense, totalProfit, totalPurchase } = useSelector((state) => state.report);
  const tax = calculateYearlyTax(totalProfit - totalExpense);

  useEffect(() => {
    const currentDate = new Date();

    const firstDayOfYear = new Date(currentDate.getFullYear(), 7, 8); // July 8 of the current year
    const lastDayOfYear = new Date(currentDate.getFullYear() + 1, 7, 7); // July 7 of the next year

    // If the current date is before July 8, adjust to the previous tax year
    if (currentDate < firstDayOfYear) {
        firstDayOfYear.setFullYear(currentDate.getFullYear() - 1);
        lastDayOfYear.setFullYear(currentDate.getFullYear());
    }

    console.log(`Start of tax year: ${firstDayOfYear}`);
    console.log(`End of tax year: ${lastDayOfYear}`);
    setStartDate(firstDayOfYear.toISOString().slice(0, 10));
    setEndDate(lastDayOfYear.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    setTotalExpenses(totalExpense);
    setTotalSales(totalSale);
    setTotalProfits(totalProfit);
    setTotalPurchases(totalPurchase);
  }, [totalSale, totalExpense, totalProfit, totalPurchase]);

  const handlePrint = () => {
    setPrintView(true);
  };
  const handleBeforeGetContent = async () => {
      await setPrintView(true);
  };

  return (
    <>
      <div>
      <ul class="nav nav-pills">
        <Link to="/reports" ><button  className="nav-link">Custom Report</button></Link>
        <Link to="/Daily-report" ><button  className="nav-link">Daily Report</button></Link>
        <Link to="/Monthly-Report"><button  className="nav-link">Monthly Reports</button></Link>
        <button  className="nav-link disabled" ><Link to="/Yearly-report">Yearly Report</Link></button>
        <Link to="/Tax-report"><button  className="nav-link">Tax Report</button></Link>
      </ul>
      </div>
      <div>
        <h2>Yearly Sale Report</h2>
        <ReportGenerator startDate={startDate} endDate={endDate} timeframe="Yearly"/>
      </div>
      <div>
        <h2>Yearly Expense Report</h2>
        <ExpenseReportGerator startDate={startDate} endDate={endDate} timeframe="Yearly"/>
      </div>
      <div>
          <h2>Yearly Profit After Expense</h2>
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
          <div style={{padding: "1.5rem"}}><h2 >Yearly Income</h2></div>
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
                <th>Total Expense</th>
                <th>Net Income</th>

              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>1</td>
                  <td>{totalPurchases.toFixed(2)}</td>
                  <td>{totalSales.toFixed(2)}</td>
                  <td>{totalProfits.toFixed(2)}</td>
                  <td>{totalExpenses.toFixed(2)}</td>
                  <td>{(totalProfits - totalExpenses).toFixed(2)}</td>
                </tr>
            </tbody>
          </table>
          </div>
          </div>
      </div>

      <br />
      <div>
          <h2>Estimated Tax</h2>
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
          <div style={{padding: "1.5rem"}}><h2 >Yearly Income</h2></div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
          <table className="table table-striped table-hover caption-top"  style={{fontSize: "12px"}}>
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

export default YearlyReport;
