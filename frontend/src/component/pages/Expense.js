import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createExpense, getExpenses, updateExpense, deleteExpense, getSingleExpense } from '../../redux/features/expense/expenseSlice';
import { toast } from 'react-toastify';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../globalFilter';
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { useRedirectEmployee } from "../../customHook/useRedirectEmploye"
import { Link } from 'react-router-dom';
import { MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert';
import ButtonLoading from '../../loader/ButtonLoader';
import ReactToPrint from 'react-to-print';
import { SelectColumnFilter, multiSelectFilter } from './dashBoard/SelectColumnFilter1';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
    type: "",
    amount: "",
    description: "",
    expenseMethod: "",
    date: "",
}

export const Expense = () => {

  useRedirectLogOutUser();

    const dispatch = useDispatch();
    const componentRef = React.useRef();
  // const navigate = Navigate();

  const [expense, setExpense] = useState(initialState);
  const [showExpense, setShowExpense] = useState(false);
  const [addedExpense, setAddedExpense] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [printView, setPrintView] = useState(false);


  const {type, amount, description, expenseMethod,date} = expense;
  // const seller = useSelector(selectName);

  
  

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  const { expenses, isError } = useSelector((state) => state.expense);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setExpense({
      ...expense,
      [name]: value
    })
  }

  const addExpense = (e) => {
    e.preventDefault();
    if (!type || !amount || !expenseMethod) {
      return toast.error("Please fill in all fieldsll")
    }
    
   
    const data = {
        type,
        amount,
        description,
        expenseMethod,
        date,
    }

    setAddedExpense([...addedExpense, data]);
    setExpense(initialState);
    // dispatch(createExpense(data));
    // navigate("/Expenses")
  }


  const submitExpense = async () => {
    setIsLoading(true);
    try {
        await Promise.all(addedExpense.map((expense) => dispatch(createExpense(expense))));
        setAddedExpense([]);
    } catch (error) {
        // Handle dispatch error if necessary
    }
    setIsLoading(false);
}

  const delExpense = async(id) => {
    dispatch(deleteExpense(id));
    // dispatch(getallCategories())
    // dispatch(getSingleCategory(id));
  }

  const remove = async (no) => {
    const newExpense = addedExpense.filter((expense, index) => index !== no - 1);
    setAddedExpense(newExpense);
  }


  const ConfirmDelete = (id) => {
    confirmAlert({
      title: 'Delete Expense',
      message: 'Are you sure to delete this expense?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delExpense(id)
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
        Header: 'Expense purpose',
        accessor: 'type',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter',
      },
      {
        Header: 'Expense Method',
        accessor: 'expenseMethod',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
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
              <Link to={`/Expenses/edit-expense/${row.original._id}`}>
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
  
  const data = useMemo(() => expenses, [expenses]);

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
    <div className="Expenses">
      <div>
        <ul class="nav nav-pills">
            <li class="nav-item">
            <button  className={showExpense ? 'nav-link' : 'nav-link disabled'} onClick={() => setShowExpense(false)}>Add Expense</button>
            </li>
            <li class="nav-item">
            <button  className={showExpense ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowExpense(true)}>Show Expenses</button>
            </li>
          </ul>
        {!showExpense && (
        <>
        <div>
        <div style={{padding: "1.5rem"}}><h2>Add Expense</h2></div>
          <form onSubmit={addExpense} className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}}>
            <div>
              <label className="form-label">Purpose Of Expense</label>
              <input className="form-control" placeholder="Expense purpose" type="text" name="type" value={type} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Amount</label>
              <input className="form-control" placeholder="Amount" type="text" name="amount" value={amount} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <label className="form-label">Expense Method</label>
              <select className="form-control form-select form-select-lg" name="expenseMethod" value={expenseMethod} onChange={handleInputChange}>
                <option value="">Select Expense Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date" className="form-label d-block mb-1">Date</label>
              <DatePicker
                id="date"
                name="date"
                selected={date ? new Date(date) : null}
                showIcon
                dateFormat="yyyy-MM-dd"
                placeholderText="yyyy-mm-dd"
                showYearDropdown
                scrollableYearDropdown
                onChange={(dateObj) => {
                  if (dateObj) {
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const formatted = `${year}-${month}-${day}`;
                    setExpense({ ...expense, date: formatted });
                  } else {
                    setExpense({ ...expense, date: '' });
                  }
                }}
                className="form-control"
              />
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
        <div id="printableArea" className='table-responsive'>
          <br />
          <h2>Added Expense</h2>
          <table className="table table-striped table-hover caption-top" style={{fontSize: "12px"}}>
            <thead>
              <tr>
                <th>No</th>
                <th>Expense Purpose</th>
                <th>Amount</th>
                <th>Expense Method</th>
                <th>Description</th>
                <th className="action-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {addedExpense.map((expense, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{expense.type}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.expenseMethod}</td>
                  <td>{expense.description}</td>
                  <td className="action-column">
                    <button className="btn btn-danger" style={{fontSize:"1.5rem"}} onClick={() => remove(index + 1)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <button className="btn btn-primary action-column" onClick={submitExpense}>Submit Product</button> */}
          {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <button className="btn btn-lg btn-primary" type="submit" onClick={submitExpense}>Submit Expenses</button>
          )}
          {/* <ReactToPrint
            trigger={() => <button className="btn btn-primary action-column">Print Added Products</button>}
            content={() => componentRef.current}/>
          <ComponentToPrint ref={componentRef} addedProduct={addedProduct} /> */}
        </div>
        </>
        )}
        {showExpense && (
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
        <div style={{padding: "1.5rem"}}><h2>Expenses</h2></div>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
        <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
        {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>Expenses</h2></div>
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
        )}
      </div>
    </div>
  )
}
