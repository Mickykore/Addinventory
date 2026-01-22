import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { addCategory, getallCategories, removeCategory, getSingleCategory} from "../../redux/features/product/categorySlice"
import { useState, useMemo, useEffect } from "react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ButtonLoading  from "../../loader/ButtonLoader"
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../globalFilter';

import { CategoryHeaders } from "../Headers/CategoryHeaders"
import { selectCategory, selectIsLoading } from "../../redux/features/product/categorySlice"
import { useNavigate } from "react-router-dom"
import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { CategoryPrint } from "./print/CategoryPrint";
import { SelectColumnFilter, multiSelectFilter } from "./dashBoard/SelectColumnFilter1"


class ComponentToPrint extends React.Component {
  render() {
    return(
    <div className='printOnly'>
      <CategoryPrint Categories={this.props.Categories} />;
    </div>
    )
  }
}

const initialState = {
   name: "",
}


export const Category = () => {
  useRedirectLogOutUser();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [categoryForm, setCategoryForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [printView, setPrintView] = useState(false);

  const { name } = categoryForm;

  useEffect(() => {
    dispatch(getallCategories());
  }, [dispatch]); 
  


  const handleChange = (e) => {
    setCategoryForm({ name: e.target.value });
  }

  const addNewCategory = async (e) => {
    e.preventDefault()
    if (!name) {
      return toast.error("Please fill in the field")
    }
    setIsLoading(true)
    const data = { name
    }
      await dispatch(addCategory(data));
      setIsLoading(false)
  }

  const { categories, isError } = useSelector((state) => state.category);
  const  { userType } = useSelector((state) => state.auth);
  const isAdmin = userType === "admin" ? true : false;
  console.log(isAdmin);




  const delCategory = async(id) => {
    dispatch(removeCategory(id));
 
  }

  
  const ConfirmDelete = (id) => {
    confirmAlert({
      title: 'Delete Category',
      message: 'Are you sure to delete this category?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delCategory(id)
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
        accessor: 'no',
        Cell: ({ row }) => row.index + 1
      },
      {
        Header: 'Category',
        accessor: 'name',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
    ];
  
    if (!printView && isAdmin) {
      baseColumns.push({
        Header: 'Action',
        Cell: ({ row }) => (
          <>
            {/* Your action buttons */}
            <span className="text-warning" style={{ padding: '5px', cursor: 'pointer' }}>
              <Link to={`/Category/edit-category/${row.original._id}`}>
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
  
  
  const data = useMemo(() => categories, [categories]);
  // const dataWithId = useMemo(() => {
  //   return data.map((category, index) => ({
  //     ...category,
  //     id: index + 1
  //   }));
  // }, [categories]);

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
    rows,
    setAllFilters,
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;

  return (
    <div>
      <div style={{padding: "1.5rem"}}>
      <form className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}} onSubmit={addNewCategory}>
        <h1 className="h3 mb-3 fw-normal">Please add category</h1>
        <div className="form-outline mb-4">
        <label htmlFor="email">category</label>
          <input type="text" className="form-control form-control-lg" id="name" placeholder="Category name" name="name" value={name} onChange={handleChange}/>
        </div>
        {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <button className="btn btn-lg btn-primary" type="submit">Add Category</button>
          )}
        {/* <a href="/signup"><button type="button" className="btn btn-primary">Sign-up</button></a> */}
      </form>
    </div>
    <div className="table-responsive">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => componentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
          />
          {/* <ComponentToPrint ref={componentRef} Categories={data} /> */}
         <div style={{padding: "1.5rem"}}><h2>Categories</h2></div>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
    <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
    {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>Categories</h2></div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
    <table className="table table-striped table-hover caption-top" {...getTableProps()}  style={{fontSize: "12px", margin: printView ? "30px" : "0"}}>
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
    </div>
  )
}
