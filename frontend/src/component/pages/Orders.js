import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, getOrders, deleteOrder, getSingleOrder } from '../../redux/features/orders/orderSlice';
import { toast } from 'react-toastify';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../globalFilter';
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { Link } from 'react-router-dom';
import { MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert';
import { AutoOrders } from './AutoOrders';
import ButtonLoading  from '../../loader/ButtonLoader';
import ReactToPrint from 'react-to-print';
import { SelectColumnFilter, multiSelectFilter } from './dashBoard/SelectColumnFilter1';

const initialState = {
  name: "",
  orderer: "",
  quantity: "",
  category: "",
  phoneNumber: "",
  description: ""
}

export const Orders = () => {

  useRedirectLogOutUser();

    const dispatch = useDispatch();
    const componentRef = React.useRef();
  // const navigate = Navigate();

  const [order, setOrder] = useState(initialState);
  const [showOrder, setShowOrder] = useState(false);
  const [addedOrder, setAddedOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [printView, setPrintView] = useState(false);


  const {name, orderer, description, quantity, category, phoneNumber} = order;
  // const seller = useSelector(selectName);
  
  

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const { orders, isError } = useSelector((state) => state.order);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setOrder({
      ...order,
      [name]: value
    })
  }

  const addOrder = (e) => {
    e.preventDefault();
    if (!name || !orderer || !category || !quantity || !description || !phoneNumber) {
      return toast.error("Please fill in all fieldsll")
    }
    
    const data = {
      name,
      orderer,
      description,
      category,
      quantity,
      phoneNumber
    }

    setAddedOrder([...addedOrder, data]);
    setOrder(initialState);
  }


  const submitOrder = async () => {
    setIsLoading(true);
    try {
        await Promise.all(addedOrder.map((order) => dispatch(createOrder(order))));
        setAddedOrder([]);
    } catch (error) {
        // Handle dispatch error if necessary
    }
    setIsLoading(false);
}

  const delOrder = async(id) => {
    dispatch(deleteOrder(id));
    // dispatch(getallCategories())
    // dispatch(getSingleCategory(id));
  }

  const remove = async (no) => {
    const newOrder = addedOrder.filter((order, index) => index !== no - 1);
    setAddedOrder(newOrder);
  }


  const ConfirmDelete = (id) => {
    confirmAlert({
      title: 'Delete Category',
      message: 'Are you sure to delete this category?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delOrder(id)
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

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
        Header: 'Ordered item',
        accessor: 'name',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
      {
        Header: 'Category',
        accessor: 'category',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
      {
        Header: 'Quantity',
        accessor: 'multiSelectFilter'
      },
      {
        Header: 'order by',
        accessor: 'orderBy.name',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
      {
        Header: 'phone Number',
        accessor: 'orderBy.phoneNumber'
      },
      {
        Header: 'Date',
        accessor: 'createdAt'
      }
    ];
  
    if (!printView) {
      // If printView is false, include the 'Action' column
      baseColumns.push({
        Header: 'Action',
        Cell: ({ row }) => (
          <>
            {/* Your action buttons */}
            <span className="text-warning" style={{ padding: '5px', cursor: 'pointer' }}>
              <Link to={`/Order/edit-order/${row.original._id}`}>
              <MdEditSquare size={24} />
              </Link>
            </span>
            <span
              className="text-danger"
              onClick={() => ConfirmDelete(row.original._id)}
              style={{ padding: '5px', cursor: 'pointer' }}
            >
              <MdDeleteForever size={24} />
            </span>
          </>
        )
      });
    }
  
    return baseColumns;
  }, [printView]);
  
  const data = useMemo(() => orders, [orders]);

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
    setAllFilters,
    prepareRow
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;

  return (
    <div className="Orders">
      <div>
        <ul class="nav nav-pills">
            <li class="nav-item">
            <button  className={showOrder ? 'nav-link' : 'nav-link disabled'} onClick={() => setShowOrder(false)}>Add Orders</button>
            </li>
            <li class="nav-item">
            <button  className={showOrder ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowOrder(true)}>Show Orders</button>
            </li>
          </ul>
        {!showOrder && (
        <>
        <div className='row'>
          <div className='col-md-2' style={{ width: "300px"}}>
            <div style={{padding: "1.5rem"}}><h2>Add Orders</h2></div>
            <form onSubmit={addOrder} style={{fontSize: "1.5rem", padding: "1.5rem"}}>
              <div>
                <label className="form-label">Name</label>
                <input className="form-control" placeholder="Ordered item" type="text" name="name" value={name} onChange={handleInputChange} />
              </div>
              <div>
                <label htmlFor="category">Category</label>
                <input className="form-control" placeholder="Category" type="text" name="category" value={category} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input className="form-control" type="number" placeholder="Quantity" name="quantity" value={quantity} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">order By</label>
                <input className="form-control" type="name" placeholder="Order By" name="orderer" value={orderer} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input className="form-control" type="text" placeholder="Phone number" name="phoneNumber" value={phoneNumber} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea type="text" name="description" value={description} onChange={handleInputChange} className="form-control"/>
              </div>
              <div>
              <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
            
          </div>
          <div className='col-md-8'>
          <div id="printableArea" className='table-responsive'>
          <div style={{padding: "1.5rem"}}><h2>Added Orders</h2></div>
            <table className="table table-striped table-hover caption-top" style={{fontSize: "12px"}}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Order By</th>
                  <th>Phone Number</th>
                  <th className="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {addedOrder.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.name}</td>
                    <td>{order.category}</td>
                    <td>{order.quantity}</td>
                    <td>{order.orderer}</td>
                    <td>{order.phoneNumber}</td>
                    <td className="action-column">
                      <button className="btn btn-danger" style={{fontSize:"1.5rem"}} onClick={() => remove(index + 1)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <button className="btn btn-primary action-column" onClick={submitOrder}>Submit Product</button> */}
            {isLoading ? (
            <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
              ) : (
                <button className="btn btn-lg btn-primary" type="submit" onClick={submitOrder}>Submit Order</button>
            )}
            {/* <ReactToPrint
              trigger={() => <button className="btn btn-primary action-column">Print Added Products</button>}
              content={() => componentRef.current}/>
            <ComponentToPrint ref={componentRef} addedProduct={addedProduct} /> */}
          </div>
          </div>
        </div>
        </>
        )}
        {showOrder && (
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
        <div style={{padding: "1.5rem"}}><h2>Orders By Customers</h2></div>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
        <div style={{margin: printView ? "50px" : null, }} ref={componentRef}>
          {printView && (
          <>
            <div style={{padding: "1.5rem"}}><h2>Customers Orders</h2></div>
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
        <br />
        <AutoOrders />
        </>
        )
        
        }
      </div>
    </div>
  )
}
