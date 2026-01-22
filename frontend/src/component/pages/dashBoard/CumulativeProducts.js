import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import { useMemo, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../../globalFilter';
import { getComulativeProducts, deleteCumulativeProduct } from "../../../redux/features/product/productSlice"
import ReactToPrint from "react-to-print";
import { MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert';
import { SelectColumnFilter, multiSelectFilter } from './SelectColumnFilter1';






export const CumulativeProducts = () => {
    useRedirectLogOutUser();

    const dispatch = useDispatch();
    const componentRef = useRef();

    const [printView, setPrintView] = useState(false);
  
  
    useEffect(() => {
      const getProducts = async () => {
          await dispatch(getComulativeProducts());
      }
      getProducts();
    }, [dispatch])
  
    const { ProductsCumulative } = useSelector((state) => state.product); 
    const  { userType } = useSelector((state) => state.auth);
    const isAdmin = userType === "admin" ? true : false;
    // console.log(isAdmin)


    const handlePrint = () => {
      setPrintView(true);
    };
    const handleBeforeGetContent = async () => {
        await setPrintView(true);
    };

    const delCumulativeProduct= async(id) => {
      await dispatch(deleteCumulativeProduct(id));
      await dispatch(getComulativeProducts());
      // dispatch(getProducts());
      // setShowProduct(true);
    }

    const ConfirmDelete = (id) => {
      confirmAlert({
        title: 'Delete Cumulative Products',
        message: 'Are you sure to delete this Cumulative Product?',
        buttons: [
          {
            label: 'Delete',
            onClick: () => delCumulativeProduct(id)
          },
          {
            label: 'Cancel',
          }
        ]
      });
    }

    const columns = useMemo(() => {
      const baseColumns = [
        {
          Header: 'No',
          accessor: 'no', // Use the 'id' accessor for the ID column
          Cell: ({ row }) => row.index + 1,
          disableFilters: true
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
          Header: 'Purchased Price',
          accessor: 'purchasedPrice',
          disableFilters: true
        },
        {
          Header: 'Quantity',
          accessor: 'quantity',
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter',
        },
        {
          Header: 'Total purchased Price',
          accessor: row => row.purchasedPrice * row.quantity,
          disableFilters: true
        },
        {
          Header: 'Minimum Selling Price',
          accessor: 'sellingPriceRange.minSellingPrice',
          disableFilters: true
        },
        {
          Header: 'Maximum Selling Price',
          accessor: 'sellingPriceRange.maxSellingPrice',
          disableFilters: true
        },
        {
          Header: 'Seller',
          accessor: 'addedBy.firstname',
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter',
        },
        {
          Header: 'Date',
          accessor: 'updatedAt',
          Cell: ({ value }) => new Date(value).toLocaleDateString(),
          Filter: SelectColumnFilter,
          filter: 'multiSelectFilter'
        },
        // {
        //   Header: 'Action',
        //   Cell: ({ row }) => (
        //     <>
        //       <span
        //         className="text-danger"
        //         onClick={() => ConfirmDelete(row.original._id)}
        //         style={{ padding: '5px', cursor: 'pointer' }}
        //       >
        //         {row.original.quantity < 1 && <MdDeleteForever size={24} />}
        //       </span>
        //     </>
        //   )
        // }
      ];

      if (!printView && isAdmin) {
        console.log("isAdmin", isAdmin)
        console.log("printVieww", printView)
        baseColumns.push({
          Header: 'Action',
          disableFilters: true,
          Cell: ({ row }) => (
            <>
              <span
                className="text-danger"
                onClick={() => ConfirmDelete(row.original._id)}
                style={{ padding: '5px', cursor: 'pointer' }}
              >
                {row.original.quantity < 1 && <MdDeleteForever size={24} />}
              </span>
            </>
          )
        });
      }

      //   const fullColumns = isAdmin ? 
      //   [ ...baseColumns.slice(0, 3), {
      //     Header: 'Purchased Price',
      //     accessor: 'purchasedPrice',
      //     disableFilters: true
      //   },
      //    ...baseColumns.slice(3, 4), 
      //   ,
      //   {
      //     Header: 'Total purchased Price',
      //     accessor: row => row.purchasedPrice * row.quantity,
      //   }, ...baseColumns.slice(4)] : baseColumns;
      // return fullColumns;
      return baseColumns;

}, [printView]);
  const data = useMemo(() => ProductsCumulative, [ProductsCumulative]);

    // CHANGED: Added filterTypes to register custom filter
    const filterTypes = useMemo(() => ({
      multiSelectFilter: multiSelectFilter,
    }), []);

  const tableInstance = useTable({
    columns,
    data,
    filterTypes,
    defaultColumn: { Filter: () => null },
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
    rows,
    prepareRow,
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
    <div style={{padding: "1.5rem"}}><h2>Cumulative Products Table</h2></div>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
    <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
      {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>Cumulative Products Table</h2></div>
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
      {
        isAdmin ? (
          <tr className="bg-info">
            <td colSpan="3">Subtotal</td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + sale.original.purchasedPrice, 0)}</td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + sale.original.quantity, 0)}</td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + (sale.original.purchasedPrice * sale.original.quantity), 0)}</td>
            <td colSpan="5"></td>
          </tr>
            ) : (
      
      <tr className="bg-info">
            <td colSpan="3">Subtotal</td>
            {/* <td>{rows.reduce((sum, sale) => sum + sale.original.totalSalePrice, 0)}</td> */}
            <td></td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + sale.original.quantity, 0)}</td>
            <td colSpan="5"></td>
        </tr>
        )
      }
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
