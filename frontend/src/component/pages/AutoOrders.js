import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComulativeProducts } from '../../redux/features/product/productSlice';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../globalFilter';
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { SelectColumnFilter, multiSelectFilter } from './dashBoard/SelectColumnFilter1';

import ReactToPrint from 'react-to-print';


export const AutoOrders = () => {

  useRedirectLogOutUser();

    const dispatch = useDispatch();
    const componentRef = React.useRef();

    const [printView, setPrintView] = useState(false);

  
  

  useEffect(() => {
    dispatch(getComulativeProducts());
  }, [dispatch]);

  const { ProductsCumulative } = useSelector((state) => state.product);
  
  
    // const productsNedded = ProductsCumulative.filter(product => product.quantity < 3);

    const handlePrint = () => {
      setPrintView(true);
    };
    const handleBeforeGetContent = async () => {
        await setPrintView(true);
    };



    const columns = useMemo(() => [
        {
          Header: 'No',
          accessor: 'no', // Use the 'id' accessor for the ID column
          Cell: ({ row }) => row.index + 1
        },
        {
          Header: 'Name Of Product',
          accessor: 'name',
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter'
        },
        {
          Header: 'Category',
          accessor: 'category.name',
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter'
        },
        {
          Header: 'Quantity',
          accessor: 'quantity',
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter'
        },
        {
          Header: 'Date',
          accessor: 'updatedAt',
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter',
        },
  ], []);
  const data = useMemo(() => { return ProductsCumulative
    .filter(product => product.quantity < 4)
    .sort((a, b) => a.quantity - b.quantity);
  }, [ProductsCumulative]);


    // CHANGED: Added filterTypes to register custom filter
    const filterTypes = useMemo(() => ({
      multiSelectFilter: multiSelectFilter,
    }), []);

  const tableInstance = useTable({
    columns,
    data,
    filterTypes,
    defaultColumn: { Filter: () => null }
  }, useFilters, useGlobalFilter, usePagination)

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
    setAllFilters,
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;

  return (
    <div className="Orders">
      <div>
        <h1>orders</h1>
        <>
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => componentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
        <div className="table-responsive">
        <div style={{padding: "1.5rem"}}><h2>Recommended Orders</h2></div>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
        <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
        {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>recommended Orders</h2></div>
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
  )
}
