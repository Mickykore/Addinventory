import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import { useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../../globalFilter';
import { getCumulativeSales } from "../../../redux/features/sales/saleSlice"
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { SelectColumnFilter, multiSelectFilter } from "./SelectColumnFilter1";






export const CumulativeSales = () => {
    useRedirectLogOutUser();

    const dispatch = useDispatch();
    const componentRef = useRef();

    const [printView, setPrintView] = useState(false);
  
  
    useEffect(() => {
          dispatch(getCumulativeSales());
    }, [dispatch])
  
    const { salesCumulative } = useSelector((state) => state.sale); 


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
          Header: 'Product Name',
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
          Header: 'Minimum Sale Price',
          accessor: 'minimumSalePrice'
      },
      {
          Header: 'Maximum Sale Price',
          accessor: 'maximumSalePrice'
      },
      {
          Header: 'Total Sale Price',
          accessor: 'totalSalePrice'
      },
      {
          Header: 'Minimum Profit',
          accessor: 'minimumProfit'
      },
      {
          Header: 'Maximum Profit',
          accessor: 'maximumProfit'
      },
      {
          Header: 'Total Profit',
          accessor: 'totalProfit'
      },
      {
          Header: 'Quantity',
          accessor: 'quantity',
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
  
  const data = useMemo(() => salesCumulative, [salesCumulative]);

    // CHANGED: Added filterTypes to register custom filter
    const filterTypes = useMemo(() => ({
      multiSelectFilter: multiSelectFilter,
    }), []);

  const tableInstance = useTable({
    columns,
    data,
    filterTypes,
    defaultColumn: { Filter: () => null }
  }, useFilters ,useGlobalFilter, usePagination)

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
      <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => componentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
        />
    <div className="table-responsive">
    <div style={{padding: "1.5rem"}}><h2>Cumulative Sales Table</h2></div>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
    <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
      {printView && (
        <>
                <div style={{padding: "1.5rem"}}><h2>Cumulative Sales Table</h2></div>
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
      <tr className="bg-info">
            <td colSpan="5">Subtotal</td>
            <td>{rows.reduce((sum, sale) => sum + sale.original.totalSalePrice, 0)}</td>
            <td></td>
            <td></td>
            <td>{rows.reduce((sum, sale) => sum + sale.original.totalProfit, 0)}</td>
            <td>{rows.reduce((sum, sale) => sum + sale.original.quantity, 0)}</td>
            <td colSpan="2"></td>
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
    </div>
  )
}
