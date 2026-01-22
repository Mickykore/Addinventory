import { getReport } from '../../../redux/features/sales/reportSlice';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalFilter } from '../../globalFilter';
import ExpenseReportGerator from './ExpenseReportGenerator';
import { useRedirectLogOutUser } from '../../../customHook/useRedirectLogOutUser';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { SelectColumnFilter, multiSelectFilter } from '../dashBoard/SelectColumnFilter1';


const DailySales = ({paymentMethod}) => {
  useRedirectLogOutUser();

  
  const dispatch = useDispatch();
  const firstComponentRef = useRef();
  const secondComponentRef = useRef();

  const [filteredReports, setFilteredReports] = useState([]);
  const [totalSaleInCash, setTotalSaleInCash] = useState(0);
  const [totalSaleInBank, setTotalSaleInBank] = useState(0);
  const [printView, setPrintView] = useState(false);

  const currentDate = new Date().toISOString().slice(0, 10);


  const startDate = currentDate;
  const endDate = currentDate;

  

  useEffect(() => {
      const fetchReport = async () => {
          await dispatch(getReport({startDate, endDate}));
      }
      fetchReport();
  }, [paymentMethod]);

  const { reports, totalExpenseCash, totalExpenseBank } = useSelector((state) => state.report);
  const  { userType } = useSelector((state) => state.auth);
  const isAdmin = userType === "admin" ? true : false;


  useEffect(() => {
    const filteredReports = reports.filter(report => report.paymentMethod === paymentMethod);
    setFilteredReports(filteredReports);
    if (paymentMethod === "cash") {
      setTotalSaleInCash(filteredReports.reduce((sum, report) => sum + report.totalPrice, 0));
    } else {
      setTotalSaleInBank(filteredReports.reduce((sum, report) => sum + report.totalPrice, 0));
    }
  }, [paymentMethod, reports]);

  const handlePrint = () => {
    setPrintView(true);
  };
  const handleBeforeGetContent = async () => {
      await setPrintView(true);
  };


  const columns = useMemo(() => {
    const baseColumns = [
    {
      Header: 'No',
      accessor: 'no', // Use the 'id' accessor for the ID column
      Cell: ({ row }) => row.index + 1
    },
    {
      Header: 'Name Of Product',
      accessor: 'product.name',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Category',
      accessor: 'product.category.name',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Selling Price',
      accessor: 'singleSalePrice'
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Total Selling Price',
      accessor: product => product.singleSalePrice * product.quantity,
    },
    {
      Header: 'Seller',
      accessor: 'seller.firstname',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
        Header: 'payment Method',
        accessor: 'paymentMethod',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
    },
    {
      Header: 'Date',
      accessor: 'createdAt'
    },
    ];

    const fullColumns = isAdmin ? [...baseColumns.slice(0, 3), {
      Header: 'Purchased Price',
      accessor: product => (product.singleSalePrice - product.singleProfit),
    }, ...baseColumns.slice(3, 4), 
    {
      Header: 'profit',
      accessor: 'singleProfit',
    }, ...baseColumns.slice(4, 5),
    {
      Header: 'Total Purchased Price',
      accessor: product => (product.singleSalePrice - product.singleProfit) * product.quantity,
      Cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    }, ...baseColumns.slice(5, 6),
    {
      Header: 'Total Profit',
      accessor: 'totalProfit',
    }, ...baseColumns.slice(7)] : baseColumns;

    return fullColumns;
}, []);
  const data = useMemo(() => filteredReports, [filteredReports]);

    // CHANGED: Added filterTypes to register custom filter
    const filterTypes = useMemo(() => ({
      multiSelectFilter: multiSelectFilter,
    }), []);

  const tableInstance = useTable({
    columns,
    data,
    filterTypes,
    defaultColumn: { Filter: () => null }
  }, useFilters,useGlobalFilter, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    setGlobalFilter,
    pageOptions,
    setPageSize,
    state,
    prepareRow,
    rows,
    setAllFilters,
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;

  return (
    <div>
      <div className="col-md-8 align-items-center justify-content-center">
      </div>
      <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => firstComponentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
        <div>
          <>
          <br />
          {(paymentMethod === "cash") ? (<h2 >Daily Sales in Cash</h2>) : (<h2 >Daily Sales in Bank</h2>)}
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
          <br />
          <div className='table-responsive'>
          <div style={{margin: printView ? "30px" : null}} ref={firstComponentRef}>
          {printView && (
        <>
          <div style={{padding: "1.5rem"}}>{(paymentMethod === "cash") ? (<h2 >Daily Sales in Cash</h2>) : (<h2 >Daily Sales in Bank</h2>)}</div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
          <table className="table table-striped table-hover caption-top"  {...getTableProps()} style={{fontSize: "12px"}}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}
                  {!printView && (
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
            {isAdmin ? (
            <tr>
              <td colSpan="7">Subtotal</td>
              <td class="fw-bold text-decoration-underline">{rows.reduce((sum, row) => sum + row.original.product.purchasedPrice * row.original.quantity, 0)}</td>
              <td class="fw-bold text-decoration-underline">{rows.reduce((sum, row) => sum + row.original.totalPrice, 0)}</td>
              <td className="fw-bold text-decoration-underline">
                {rows.reduce((sum, row) => {
                  const purchasedPrice = row.original?.product.purchasedPrice || 0;
                  const quantity = row.original?.quantity || 0;
                  const expense = purchasedPrice * quantity;
                  const totalPrice = row.original?.totalPrice || 0;

                  return sum + (totalPrice - expense);
                }, 0).toFixed(2)}
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr> ) : (
              <tr>
              <td colSpan="5">Subtotal</td>
              <td class="fw-bold text-decoration-underline">{filteredReports.reduce((sum, report) => sum + report.totalPrice, 0)}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            )}
          </tbody>
        </table>
        </div>
          </div>
          <div>
            <ul className="pagination justify-content-center pagination-lg">
              <span style={{padding: "5px", fontSize: '15px'}}>
              page{' '}
              <strong>
                <em style={{color: 'blue'}}>{pageIndex + 1}</em> of {pageOptions.length}
              </strong>
            </span>
            <select className="form-select form-select-lg" style={{maxWidth: '90px'}}
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }} >
              {[10, 15, 20, 30, 40, 50, data.length].map((pageSize, index) => (
                <option key={index} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <li>
                <button className="page-link" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
              </li>
              <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={previousPage} disabled={!canPreviousPage}>Previous</button>
              </li>
              <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
                <button className="page-link" onClick={nextPage} disabled={!canNextPage}>Next</button>
              </li>
              <li>
                <button className="page-link" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
              </li>
            </ul>
          </div>
        </>
        </div>
        {(paymentMethod === "bank" && (
          <>
          <div>
            <h2>Daily Bank Expense Report</h2>
            <ExpenseReportGerator startDate={currentDate} endDate={currentDate} expenseMethod="bank"/>
          </div>
          <h2>Today's Income</h2>
          <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => secondComponentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
        <div style={{margin: printView ? "30px" : null}} ref={secondComponentRef}>
        {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>Today's Income</h2></div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
        <table className="table table-striped table-hover caption-top"  style={{fontSize: "12px"}}>
            <thead>
              <tr>
                <th>No</th>
                <th>Total Today Sales</th>
                <th>Total Today Expense</th>
                <th>Income</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>1</td>
                  <td>{totalSaleInBank}</td>
                  <td>{totalExpenseBank}</td>
                  <td>{totalSaleInBank - totalExpenseBank}</td>
                </tr>
            </tbody>
          </table>
          </div>
          </>
          ))}
        {(paymentMethod === "cash") && (
        <div >
          <div>
            <h2>Daily Cash Expense Report</h2>
            <ExpenseReportGerator startDate={currentDate} endDate={currentDate} expenseMethod="cash"/>
          </div>
        <h2>Today's Income</h2>
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => secondComponentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
        <div style={{margin: printView ? "30px" : null}} ref={secondComponentRef}>
          {printView && (
          <>
            <div style={{padding: "1.5rem"}}><h2>Today's Income</h2></div>
            <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
          </>
          )}
          <table className="table table-striped table-hover caption-top"  style={{fontSize: "12px"}}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Total Today Sales</th>
                  <th>Total Today Expense</th>
                  <th>Income</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td>1</td>
                    <td>{totalSaleInCash}</td>
                    <td>{totalExpenseCash}</td>
                    <td>{totalSaleInCash - totalExpenseCash}</td>
                  </tr>
              </tbody>
          </table>
        </div>
      </div>
        )}
      </div>
);
}

export default DailySales;
