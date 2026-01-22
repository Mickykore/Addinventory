import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { useRedirectEmployee } from "../../customHook/useRedirectEmploye";
import { useMemo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { GlobalFilter } from '../globalFilter';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { MdDeleteForever } from "react-icons/md";
import { getAllUsersData, deleteUser, getUserProfiile } from "../../services/authService"
import { selectUsers, SET_USERS, selectUser, SET_USER } from "../../redux/features/auth/authSlice"
import { UpdatedSecretKey } from "./UpdateSecretKey";




export const Users = () => {
  useRedirectLogOutUser();
  useRedirectEmployee()
  
  const dispatch = useDispatch();

  const [showUpdateSecretKey, setShowUpdateSecretKey] = useState(false);




  useEffect(() => {
    async function getuser() {
      const profiles = await getAllUsersData();
      const profile = await getUserProfiile();
      dispatch(SET_USERS(profiles));
      dispatch(SET_USER(profile));
    }
    getuser();
  },[dispatch])
  

  const users = useSelector(selectUsers);
  const user = useSelector(selectUser);

  console.log("users", user.email);

  const delUser = async (id) => {
    await deleteUser(id);
    const profiles = await getAllUsersData();
    dispatch(SET_USERS(profiles));
  }

  
  const ConfirmDelete = (id) => {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure to delete this user?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delUser(id)
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  const columns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'no', // Use the 'id' accessor for the ID column
      Cell: ({ row }) => row.index + 1
    },
    {
      Header: 'FIrst Name',
      accessor: 'firstname'
    },
    {
        Header: 'Father Name',
        accessor: 'fathername'
    },
    {
        Header: 'Email;',
        accessor: 'email'
    },
    {
        Header: 'Phone Number',
        accessor: 'phone'
    },
    {
        Header: 'User Type',
        accessor: 'userType'
    },
    {
    Header: 'Last Login',
    accessor: 'lastLogin',
    Cell: ({ value }) => value ? new Date(value).toLocaleString() : 'Never'
   },
    {
      Header: 'Action',
      Cell: ({ row }) => (
        <>
          {row.original.email !== user.email && (
            <span
              className="text-danger"
              onClick={() => ConfirmDelete(row.original._id)}
              style={{ padding: '5px', cursor: 'pointer' }}
            >
              <MdDeleteForever size={24} />
            </span>
          )}
        </>
      )
    }
  ], []);
  const data = useMemo(() => users, [users]);
  // const dataWithId = useMemo(() => {
  //   return data.map((category, index) => ({
  //     ...category,
  //     id: index + 1
  //   }));
  // }, [categories]);
  const tableInstance = useTable({
    columns,
    data
  }, useGlobalFilter, usePagination)

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
    prepareRow
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;


  
  return (
    <div>
      <div>
          <ul class="nav nav-pills">
            <li class="nav-item">
            <button  className={showUpdateSecretKey ? 'nav-link' : 'nav-link disabled'} onClick={() => setShowUpdateSecretKey(false)}>Users</button>
            </li>
            <li class="nav-item">
            <button  className={showUpdateSecretKey ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowUpdateSecretKey(true)}>Update Secrete keys</button>
            </li>
          </ul>
      </div>
    {!showUpdateSecretKey && (
     <>
    <div className="table-responsive">
      <div style={{padding: "1.5rem"}}><h2>Users</h2></div>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
      <table className="table table-striped table-hover caption-top" {...getTableProps()} style={{fontSize: "12px"}}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
        {[10, 15, 20, 30, 40, 50].map((pageSize,index) => (
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
    {showUpdateSecretKey && <UpdatedSecretKey />}
    </div>
  )
}
