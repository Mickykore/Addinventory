import { getReport } from '../../../redux/features/sales/reportSlice';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalFilter } from '../../globalFilter';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { SelectColumnFilter, multiSelectFilter } from '../dashBoard/SelectColumnFilter1';


const ExpenseReportGerator = ({startDate, endDate, timeframe, expenseMethod}) => {


  const dispatch = useDispatch();
  const componentRef = useRef();

  const [printView, setPrintView] = useState(false);


  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getReport({ startDate, endDate }));
    }
  }, [dispatch, startDate, endDate]);


  const handlePrint = () => {
    setPrintView(true);
  };
  const handleBeforeGetContent = async () => {
      await setPrintView(true);
  };

  

  const { expenses} = useSelector((state) => state.report);
  const filteredExpenses = expenseMethod === "cash"
  ? expenses.filter(expense => (expense.expenseMethod || 'cash').toLowerCase() === 'cash')
  : expenseMethod === "bank" ? expenses.filter(expense => (expense.expenseMethod || "bank").toLowerCase() === 'bank') : expenses;

  const columns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'no', // Use the 'id' accessor for the ID column
      Cell: ({ row }) => row.index + 1
    },
    {
      Header: 'Expense purpose',
      accessor: 'type',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Amount',
      accessor: 'amount'
    },
    {
      Header: 'Expense Method',
      accessor: 'expenseMethod',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Date',
      accessor: 'createdAt',
      Cell: ({ value }) => new Date(value).toLocaleDateString(),
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
  ], []);
  const data = useMemo(() => filteredExpenses, [expenses]);

    // CHANGED: Added filterTypes to register custom filter
    const filterTypes = useMemo(() => ({
      multiSelectFilter: multiSelectFilter,
    }), []);

  const tableInstance = useTable({
    columns,
    data,
    filterTypes,
    defaultColumn: { Filter: () => null }
  }, useFilters, useGlobalFilter, usePagination);
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
        <div>
          <>
          <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => componentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
          <br />
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
          <br />
          <div className='table-responsive'>
          <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
            {printView && (
          <>
            <div style={{padding: "1.5rem"}}><h2>{timeframe} Expenses Report</h2></div>
            <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
          </>
        )}
          <table className="table table-striped table-hover caption-top" {...getTableProps()}  style={{fontSize: "12px"}}>
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
            <tr>
            <td colSpan="2">Subtotal</td>
            <td class="fw-bold text-decoration-underline">{rows.reduce((sum, expense) => sum + expense.original.amount, 0)}</td>
            <td></td>
        </tr>
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
    </div>
  );
};

export default ExpenseReportGerator;
