import { getReport } from '../../../redux/features/sales/reportSlice';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalFilter } from '../../globalFilter';
import ReactToPrint from 'react-to-print';
import { useRef } from 'react';
import { SelectColumnFilter, multiSelectFilter } from '../dashBoard/SelectColumnFilter1';


const ReportGenerator = ({startDate, endDate, timeframe}) => {


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

  

  const { reports } = useSelector((state) => state.report);
  

  const columns = useMemo(() => [
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
      Header: 'purchased Price',
      accessor: product => product.singleSalePrice - product.singleProfit,
      cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    },
    {
      Header: 'Selling Price',
      accessor: 'singleSalePrice',
      cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    },
    {
      Header: 'profit',
      accessor: 'singleProfit',
      cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Total Purchased Price',
      accessor: product => (product.singleSalePrice - product.singleProfit) * product.quantity,
      Cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    },
    {
      Header: 'Total Selling Price',
      accessor: product => product.singleSalePrice * product.quantity,
      Cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    },
    {
      Header: 'Total Profit',
      accessor: 'totalProfit',
      Cell: ({ value }) => value.toFixed(2) // Format to 2 decimal
    },
    {
      Header: 'payment Method',
      accessor: 'paymentMethod',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Seller',
      accessor: 'seller.firstname',
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
    {
      Header: 'Date',
      accessor: 'createdAt',
      cell: ({ value }) => new Date(value).toLocaleDateString(),
      Filter: SelectColumnFilter,
      filter: 'multiSelectFilter'
    },
  ], []);
  const data = useMemo(() => reports, [reports]);

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
          <br />
          <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => componentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
          <br />
          <div className='table-responsive'>
          <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
          {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>{timeframe} Sales Report</h2></div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
          <table className="table table-striped table-hover caption-top" {...getTableProps()} style={{fontSize: "12px"}}>
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
            <td colSpan="7">Subtotal</td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, row) => sum + ((row.original?.singleSalePrice - row.original?.singleProfit) * row.original?.quantity || 0), 0).toFixed(2)}</td>
            <td class="fw-bold text-decoration-underline">{rows.reduce((sum, row) => sum + (row.original?.totalPrice || 0), 0).toFixed(2)}</td>
            <td className="fw-bold text-decoration-underline">
              {rows.reduce((sum, row) => {
                const purchasedPrice = (row.original?.singleSalePrice - row.original?.singleProfit) || 0;
                const quantity = row.original?.quantity || 0;
                const expense = purchasedPrice * quantity;
                const totalPrice = row.original?.totalPrice || 0;

                return sum + (totalPrice - expense);
              }, 0).toFixed(2)}
            </td>
            <td></td>
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
              {[10, 15, 20, 30, 40, 50, data.length].map((pageSize,index) => (
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

export default ReportGenerator;
