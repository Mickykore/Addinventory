import { useDispatch } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import {useEffect, useState, useMemo} from 'react';
import { useSelector } from 'react-redux';
import { createSales, getSales, deleteSale } from '../../redux/features/sales/saleSlice';
import { selectName } from '../../redux/features/auth/authSlice';
import { getallCategories } from '../../redux/features/product/categorySlice';
import { getComulativeProducts } from '../../redux/features/product/productSlice';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import { GlobalFilter } from '../globalFilter';
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { confirmAlert } from 'react-confirm-alert'; // Import
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import ButtonLoading from '../../loader/ButtonLoader';
import ReactToPrint from 'react-to-print';
import { Invoice } from './invoice/invoice';
import React, { useRef} from 'react';
import DailySales from './reports/DailySales';
import { CumulativeProducts } from './dashBoard/CumulativeProducts';
import { SelectColumnFilter, multiSelectFilter } from './dashBoard/SelectColumnFilter1';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// class TableToPrint extends React.Component {
//   render() {
//     return(
//     <div className='printOnly'>
//       <SalePrint Sales={this.props.Sales} />;
//     </div>
//     )
//   }
// }


const initialState = {
  name: "",
  category: "",
  singleSalePrice: "",
  quantity: "",
  description: "",
  buyer: {
    name: "",
    phoneNumber: "",
    tinNumber: ""
  },
  includeVAT: false,
  paymentMethod: "",
  date: "",
  itemIdentification: "",
  includeVAT: false,
}

class ComponentToPrint extends React.Component {
  render() {
    return(
    <div className='printOnly'>
      <Invoice AddedSales={this.props.addedSales} />;
    </div>
    )
  }
}

export const Sales = () => {

  useRedirectLogOutUser();

  const dispatch = useDispatch();
  const componentRef = useRef();

  // const navigate = Navigate();

  const [saleForm, setSaleForm] = useState(initialState);
  const [showSales, setShowSales] = useState("add sales");
  const [addedSales, setAddedSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [printView, setPrintView] = useState(false);
  const [showBuyerInfo, setShowBuyerInfo] = useState(false);


  const {name, category, singleSalePrice, quantity, description, buyer, paymentMethod, date, itemIdentification, includeVAT} = saleForm;

  const seller = useSelector(selectName);

  useEffect(() => {
    dispatch(getallCategories());
    dispatch(getComulativeProducts());
    dispatch(getSales());
  }, [dispatch]);

  

  const categories = useSelector((state) => state.category.categories);
  const { ProductsCumulative } = useSelector((state) => state.product);
  const sales = useSelector((state) => state.sale.sales);
  const  { userType } = useSelector((state) => state.auth);
  const isAdmin = userType === "admin" ? true : false;
  console.log(isAdmin);

  const handleInputChange = (e) => {
    setSaleForm({ ...saleForm, [e.target.name]: e.target.value });
  }

  const addSale = (e) => {
    e.preventDefault();
    const data = {
      name,
      category,
      singleSalePrice,
      quantity,
      seller,
      description,
      buyer, 
      paymentMethod,
      date,
      itemIdentification,
      includeVAT,
    }
    setAddedSales([...addedSales, data]);
    setSaleForm(initialState);
    // dispatch(createSales(data));
    // // navigate("/Sales")
  }

  // const submitSales = () => {
  //   setIsLoading(true);
  //   addedSales.map((sale) => {
  //     dispatch(createSales(sale));
  //     setAddedSales([]);
  //   })
  // }
  const submitSales = async () => {
    setIsLoading(true);
    try {
        await Promise.all(addedSales.map((sale) => dispatch(createSales(sale))));
        setAddedSales([]);
        dispatch(getSales());
    } catch (error) {
        // Handle dispatch error if necessary
    }
    setIsLoading(false);
}

  const delSale= async(id) => {
    dispatch(deleteSale(id));
    dispatch(getSales());
  }

  const remove = async (no) => {
    const newAddedProduct = addedSales.filter((order, index) => index !== no - 1);
    setAddedSales(newAddedProduct);
  }

  const ConfirmDelete = (id) => {
    confirmAlert({
      title: 'Delete Sale',
      message: 'Are you sure to delete this Sale?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delSale(id)
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
        Header: 'Sale Price',
        accessor: 'singleSalePrice'
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
      {
        Header: 'Total Price',
        accessor: 'totalPrice'
      },
      {
        Header: 'Seller',
        accessor: 'seller.firstname',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter'
      },
      {
        Header: 'Created Date',
        accessor: 'createdAt',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter',
        Cell: ({ value }) => {
          if (!value) return '';
          return new Date(value).toLocaleDateString();
        }
      },
      {
        Header: 'Updated Date',
        accessor: 'updatedAt',
        Filter: SelectColumnFilter,
        filter: 'multiSelectFilter',
        Cell: ({ value }) => {
          if (!value) return '';
          return new Date(value).toLocaleDateString();
        }
      }
    ];
  
    if (!printView && isAdmin) {
      baseColumns.push({
        Header: 'Action',
        Cell: ({ row }) => (
          <>
            <span className="text-warning" style={{ padding: '5px', cursor: 'pointer' }}>
              <Link to={`/sale/edit-sale/${row.original._id}`}>
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
  
  const data = useMemo(() => sales, [sales]);
  console.log("sales", data);

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
    prepareRow
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;

  const filteredProducts = useMemo(() => {
  // Filter ProductsCumulative based on the selected category and quantity > 1
  return ProductsCumulative.filter(product => 
    product.category.name === category && product.quantity >= 1
  );
}, [category, ProductsCumulative]);


  return (
    <>
      <div>

        <ul class="nav nav-pills">
            <li class="nav-item">
            <button  className={(showSales === 'add sales') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowSales("add sales")}>Add Sales</button>
            </li>
            <li class="nav-item">
            <button  className={(showSales=== 'view sales') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowSales("view sales")}>Show Sales</button>
            </li>
            <li class="nav-item">
            <button  className={(showSales === 'view Products') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowSales("view Products")}>View Products</button>
            </li>
            <li class="nav-item">
            <button  className={(showSales=== 'daily sales in cash') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowSales("daily sales in cash")}>Show Daily Sales cash</button>
            </li>
            <li class="nav-item">
            <button  className={(showSales=== 'daily sales in bank') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowSales("daily sales in bank")}>Show Daily Sales bank</button>
            </li>
          </ul>
        </div>
        {(showSales === "add sales") && (
          <>
          <div className='row'>
            <div className='col-md-2' style={{ width: "350px"}}>
            <form onSubmit={addSale} style={{fontSize: "1.5rem", padding: "1.5rem"}}>
              <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select className="form-control form-select form-select-lg" name="category" value={category} onChange={handleInputChange} >
                        <option value="">Select a category...</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
              <div className="form-group">
                    <label htmlFor="category">Product Name</label>
                    <select className="form-control form-select form-select-lg" name="name" value={name} onChange={handleInputChange} >
                        <option value="">Select Product Name...</option>
                        {filteredProducts.map((product) => (
                          <option key={product._id} value={product.name}>{product.name}</option>
                        ))}
                    </select>
                  </div>
                <div className="form-group">
                  <label htmlFor="singleSalePrice">Selling Price</label>
                  <input type="number" min="1" required className="form-control" id="singleSalePrice" placeholder="Enter Single Sale Price" name="singleSalePrice" value={singleSalePrice} onChange={handleInputChange}/>
                </div>
                {/* <div className="form-group">
                <div className="form-check form-switch" style={{fontSize: "20px", paddingLeft: "0em"}}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="includeVAT"
                    checked={includeVAT}
                    style={{marginLeft: "0.1px"}}
                    onChange={(e) => setSaleForm({ ...saleForm, includeVAT: e.target.checked })}
                  />
                  <label className="form-check-label">-Include VAT</label>
                </div>
              </div> */}
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input type="number" min="1" required className="form-control" id="quantity" placeholder="Enter Quantity" name="quantity" value={quantity} onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select className="form-control" id="paymentMethod" name="paymentMethod" value={paymentMethod} onChange={handleInputChange}>
                    <option value="">Select Payment Method</option>
                    <option value="bank">Bank</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date" className="form-label d-block mb-1">Date</label>
                  <div className='w-100'></div>
                  <DatePicker
                    id="date"
                    name="date"
                    selected={saleForm.date ? new Date(saleForm.date) : null}
                    showIcon
                    dateFormat="yyyy/MM/dd"
                    placeholderText="yyyy/mm/dd"
                    showYearDropdown
                    scrollableYearDropdown
                    onChange={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const formattedDate = `${year}-${month}-${day}`;
                        setSaleForm({ ...saleForm, date: formattedDate }); // ✅ Send this
                      } else {
                        setSaleForm({ ...saleForm, date: '' });
                      }
                    }}
                    className="form-control"
                />

                </div>

                {/* <div className="form-group">
                  <label htmlFor="itemIdentification">Item Identification</label>
                  <input type="text" className="form-control" id="itemIdentification" placeholder="Enter Item Identification" name="itemIdentification" value={itemIdentification} onChange={handleInputChange} />
                </div> */}
                <div className="form-group">
                  <label htmlFor="description">Discription</label>
                  <textarea type="text" className="form-control" id="description" placeholder="Enter Discription" name="description" value={description} onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                <div className="form-check form-switch" style={{fontSize: "20px", paddingLeft: "0em"}}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={showBuyerInfo}
                    style={{marginLeft: "0.1px"}}
                    onChange={(e) => setShowBuyerInfo(e.target.checked)}
                  />
                  <label className="form-check-label">-Fill Buyer Info</label>
                </div>
              </div>
              {showBuyerInfo && (
                <>
                <h2>Buyer Info</h2>
                <div className="form-group">
                  <label htmlFor="buyerName">Buyer Name</label>
                  <input type="text" className="form-control" id="buyerName" placeholder="Enter Buyer Name" name="buyerName" value={buyer.buyerName} onChange={(e) => setSaleForm({ ...saleForm, buyer: { ...buyer, buyerName: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label htmlFor="buyerPhoneNumber">Buyer Phone Number</label>
                  <input type="text" className="form-control" id="buyerPhoneNumber" placeholder="Enter Buyer Phone Number" name="buyerPhoneNumber" value={buyer.phoneNumber} onChange={(e) => setSaleForm({ ...saleForm, buyer: { ...buyer, phoneNumber: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label htmlFor="buyerTinNumber">Buyer TIN Number</label>
                  <input type="text" className="form-control" id="buyerTinNumber" placeholder="Enter Buyer TIN Number" name="buyerTinNumber" value={buyer.tinNumber} onChange={(e) => setSaleForm({ ...saleForm, buyer: { ...buyer, tinNumber: e.target.value } })} />
                </div>
                </>
              )}
                <button type="submit" className="btn btn-primary">Add Sale</button>
            </form>
            </div>
            <div className='col-md-8'>
            <div id="printableArea" className='table-responsive'>
              <br />
            <h2>Added Sales</h2>
            <table className="table table-striped table-hover caption-top" style={{fontSize: "12px"}}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Buyer Name</th>
                  <th>Buyer Phone Number</th>
                  <th>Buyer Tin</th>
                  <th className="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
                {addedSales.map((sale, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{sale.name}</td>
                    <td>{sale.category}</td>
                    <td>{sale.singleSalePrice}</td>
                    <td>{sale.quantity}</td>
                    <td>{sale.singleSalePrice * sale.quantity}</td>
                    <td>{sale.buyer.buyerName}</td>
                    <td>{sale.buyer.phoneNumber}</td>
                    <td>{sale.buyer.tinNumber}</td>
                    <td className="action-column">
                    <button className="btn btn-danger" style={{fontSize:"1.5rem"}} onClick={() => remove(index + 1)}>Remove</button>
                    </td>
                  </tr>
                ))}
                <tr>
              <td colSpan="6">Subtotal</td>
              <td>{addedSales.reduce((sum, sale) => sum + sale.singleSalePrice * sale.quantity, 0)}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
              </tbody>
            </table>
            {/* <button className="btn btn-primary action-column" >Submit Sale</button> */}
            {isLoading ? (
            <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
              ) : (
                <button className="btn btn-lg btn-primary" type="submit" onClick={submitSales}>Submit Sale</button>
            )}

            <ReactToPrint
              trigger={() => <button className="btn btn-primary action-column">Print Added Sales</button>}
              content={() => componentRef.current}/>
            <ComponentToPrint ref={componentRef} addedSales={addedSales} />
          </div>
            </div>
          </div>
        </>
        )}
        {(showSales === "view sales") && (
          <>
          <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
          )}
          content={() => componentRef.current}
          onAfterPrint={() => setPrintView(false)}
          onBeforeGetContent={handleBeforeGetContent}
          />

          <div style={{padding: "1.5rem"}}><h2>Sales</h2></div>
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
          <div className="table-responsive">
          <div style={{margin: printView ? "50px" : null}} ref={componentRef}>
          {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>Sales</h2></div>
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
        {(showSales === "daily sales in cash") && (
          <div >
          
          <DailySales paymentMethod="cash"/>
          <br />
          </div>
        )}
        {(showSales === "daily sales in bank") && (
          <>
          
          <DailySales paymentMethod="bank" />
          <br />
          </>
        )}
        {(showSales === "view Products") && (
          <>
          <CumulativeProducts />
          </>
        )}
        {/* <div className="table-style" style={{padding: "1.5rem"}}> */}
      {/* </div> */}
    </>
  )
}
