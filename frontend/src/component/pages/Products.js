import React, { useRef } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getProducts, selectProducts, deleteProduct } from '../../redux/features/product/productSlice';
import { selectName } from '../../redux/features/auth/authSlice';
import { getallCategories } from '../../redux/features/product/categorySlice';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTable, usePagination, useGlobalFilter, useFilters } from 'react-table';
import BulkProductForm from './bulkProduct';
import { GlobalFilter } from '../globalFilter';
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { useRedirectEmployee } from "../../customHook/useRedirectEmploye"
import { Link } from 'react-router-dom';
import { MdEditSquare, MdDeleteForever } from 'react-icons/md';
import { confirmAlert } from 'react-confirm-alert';
import ButtonLoading from '../../loader/ButtonLoader';
import { ProductPrint } from './print/ProductPrint';
import ReactToPrint from 'react-to-print';
import fullLoader from '../../loader/fullLoader';
// CHANGED: Import the new enhanced filter components
import { SelectColumnFilter, multiSelectFilter } from './dashBoard/SelectColumnFilter1';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ComponentToPrint extends React.Component {
  render() {
    return(
      <div className='printOnly'>
      <ProductPrint Products={this.props.Products} />
      </div>
    )
  }
}

const initialState = {
  name: "",
  purchasedPrice: "",
  minSellingPrice: "",
  maxSellingPrice: "",
  description: "",
  quantity: "",
  category: "",
  date: "",
  includeVAT: false
}

export const Products = () => {
  useRedirectLogOutUser();
  useRedirectEmployee();

  const dispatch = useDispatch();
  // const navigate = Navigate();
  const componentRef = useRef();

  const [product, setProduct] = useState(initialState);
  const [addedProduct, setAddedProduct] = useState([]);
  const [printMode, setPrintMode] = useState(false);
  const [showProduct, setShowProduct] = useState("add product");
  const [isLoading, setIsLoading] = useState(false);
  const [printView, setPrintView] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredPurchased, setFilteredPurchased] = useState([]);
  const [filteredMinSelling, setFilteredMinSelling] = useState([]);
  const [filteredMaxSelling, setFilteredMaxSelling] = useState([]);

  const {name, purchasedPrice, description, quantity, category, maxSellingPrice, minSellingPrice, includeVAT, date} = product;
  const seller = useSelector(selectName);

  const categories = useSelector((state) => state.category.categories);
  const { products, isError } = useSelector((state) => state.product);
  const  { userType } = useSelector((state) => state.auth);
  const isAdmin = userType === "admin" ? true : false;
  console.log(isAdmin);
 
  const ProductsFiltered = useMemo(() => {
    return products.filter(product => product.category.name === category);
  }, [category, products]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProduct({
      ...product,
      [name]: value
    })

    if (value === '') {
      setFilteredProducts([]);
      setFilteredPurchased([])
      setFilteredMinSelling([])
      setFilteredMaxSelling([])
      return;
    }
    if(name === 'name') {
      const filtered = ProductsFiltered.filter((prod) =>
          prod.name.toLowerCase().startsWith(value.toLowerCase())
        );
      setFilteredProducts(filtered);
    }
    if(name === 'purchasedPrice') {
      const filtered = ProductsFiltered.filter((prod) =>
          prod.purchasedPrice.toString().startsWith(value)
        );
      setFilteredPurchased(filtered);
    }
    if(name === 'minSellingPrice') {
      const filtered = ProductsFiltered.filter((prod) =>
          prod.sellingPriceRange.minSellingPrice.toString().startsWith(value)
        );
      setFilteredMinSelling(filtered);
    }
    if(name === 'maxSellingPrice') {
      const filtered = ProductsFiltered.filter((prod) =>
          prod.sellingPriceRange.maxSellingPrice.toString().startsWith(value)
        );
      setFilteredMaxSelling(filtered);
    }
  }

  const handleSelectProduct = (selectedProduct) => {
    setProduct({ ...product, name: selectedProduct });
    setFilteredProducts([]);
  };

  const handleSelectPurchased = (selectedPurchased) => {
    setProduct({ ...product, purchasedPrice: selectedPurchased });
    setFilteredPurchased([]);
  };

  const handleSelectMinSelling = (selectedMinSelling) => {
    setProduct({ ...product, minSellingPrice: selectedMinSelling });
    setFilteredMinSelling([]);
  };

  const handleSelectMaxSelling = (selectedMaxSelling) => {
    setProduct({ ...product, maxSellingPrice: selectedMaxSelling });
    setFilteredMaxSelling([]);
  };
  
  const addProduct = (e) => {
    e.preventDefault();

    if (!name || !purchasedPrice || !minSellingPrice || !maxSellingPrice || !category || !quantity) {
      return toast.error("Please fill in all fieldsllll")
    }
   
    const data = {
      name,
      purchasedPrice,
      minSellingPrice,
      maxSellingPrice,
      description,
      category,
      quantity,
      includeVAT,
      date,
    }

    setAddedProduct([...addedProduct, data]);
    setProduct(initialState);
  }

  const submitProduct = async () => {
    setIsLoading(true);
    try {
        await Promise.all(addedProduct.map((product) => dispatch(createProduct(product))));
        setAddedProduct([]);
    } catch (error) {
        // Handle dispatch error if necessary
    }
    setIsLoading(false);
  }

  const delProduct= async(id) => {
    dispatch(deleteProduct(id));
    dispatch(getProducts());
  }

  const remove = async (no) => {
    const newOrder = addedProduct.filter((order, index) => index !== no - 1);
    setAddedProduct(newOrder);
  }

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getallCategories());
  }, [dispatch, showProduct]);

  const ConfirmDelete = (id) => {
    confirmAlert({
      title: 'Delete Products',
      message: 'Are you sure to delete this Product?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => delProduct(id)
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

  // CHANGED: Updated columns configuration
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: 'No',
        accessor: 'no',
        Cell: ({ row }) => row.index + 1
      },
      {
        Header: 'Name Of Product',
        accessor: 'name',
        Filter: SelectColumnFilter, // CHANGED: Use enhanced filter
        filter: multiSelectFilter // CHANGED: Use multiSelectFilter function
      },
      {
        Header: 'Category',
        accessor: 'category.name',
        Filter: SelectColumnFilter, // CHANGED: Use enhanced filter
        filter: multiSelectFilter // CHANGED: Use multiSelectFilter function
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Filter: SelectColumnFilter, // CHANGED: Use enhanced filter
        filter: multiSelectFilter // CHANGED: Use multiSelectFilter function
      },
      {
        Header: 'Minimum Selling Price',
        accessor: 'sellingPriceRange.minSellingPrice'
      },
      {
        Header: 'Maximum Selling Price',
        accessor: 'sellingPriceRange.maxSellingPrice'
      },
      {
        Header: 'Added By',
        accessor: 'addedBy.firstname',
        Filter: SelectColumnFilter, // CHANGED: Use enhanced filter
        filter: multiSelectFilter // CHANGED: Use multiSelectFilter function
      },
      {
        Header: 'Date',
        accessor: 'createdAt',
        Filter: SelectColumnFilter, // CHANGED: Use enhanced filter
        filter: multiSelectFilter, // CHANGED: Use multiSelectFilter function
        // ADDED: Custom cell to format date nicely
        Cell: ({ value }) => {
          if (!value) return '';
          return new Date(value).toLocaleDateString();
        }
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
        Filter: SelectColumnFilter, // CHANGED: Use enhanced filter
        filter: multiSelectFilter, // CHANGED: Use multiSelectFilter function
        // ADDED: Custom cell to format date nicely
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
              <Link to={`/Product/edit-product/${row.original._id}`}>
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

    if (isAdmin) {
      baseColumns.splice(3, 0, {
        Header: 'Purchased Price',
        accessor: 'purchasedPrice'
      });
      baseColumns.splice(5, 0, {
        Header: 'Total Price',
        accessor: (row) => row.purchasedPrice * row.quantity,
        Cell: ({ value }) => value.toFixed(2),
      });
    }
  
    return baseColumns;
  }, [printView, isAdmin]); // CHANGED: Added isAdmin as dependency
  
  const data = useMemo(() => products, [products]);

  // CHANGED: Added filterTypes to register custom filter
  const filterTypes = useMemo(() => ({
    multiSelectFilter: multiSelectFilter,
  }), []);

  const tableInstance = useTable({
    columns,
    data,
    filterTypes, // CHANGED: Added filterTypes
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
    // ADDED: Add setAllFilters for clear all functionality
    setAllFilters,
  } = tableInstance;

  const { pageIndex, globalFilter, pageSize } = state;

  // ADDED: Function to clear all filters
  // const clearAllFilters = () => {
  //   setAllFilters([]);
  //   setGlobalFilter('');
  // };

  return (
    <div className="Orders">
      <div>
        <div>
          <ul className="nav nav-pills">
            <li className="nav-item">
            <button  className={showProduct === "add product" ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowProduct("add product")}>Add Products</button>
            </li>
            <li className="nav-item">
            <button  className={showProduct === "add bulk product" ? 'nav-link disabled' : 'nav-link' } onClick={() => setShowProduct("add bulk product")}>Add Bulk Products</button>
            </li>
            <li className="nav-item">
            <button  className={showProduct === "products" ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowProduct("products")}>Show Products</button>
            </li>
          </ul>
        </div>
        {(showProduct === "add bulk product") && (
          <BulkProductForm />
        )}
        { showProduct === "add product" && (
        <>
          <div className="row">
            <div className="col-md-2" style={{ width: "350px"}}>
              <div id="hide-onprint" style={{ padding: "1.5rem" }}>
                <h2>Add Products</h2>
              </div>
              <form id="hide-onprint" onSubmit={addProduct}  style={{ fontSize: "1.3rem", padding: "1.5rem"}}>
                <div className="mb-2">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select className="form-control form-select form-select-lg" placeholder="Category Of The Product" name="category" value={category} onChange={handleInputChange}>
                    <option value="">Select a category...</option>
                    {categories.map((category) => (
                      <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-0">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input className="form-control" placeholder="Name Of The Product" type="text" name="name" value={name} onChange={handleInputChange} />
                  {filteredProducts.length > 0 && (
                    <ul className="form-control">
                      {filteredProducts.map((prod) => (
                        <li key={prod._id} style={{cursor: "pointer"}} onClick={() => handleSelectProduct(prod.name)}>{prod.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-0">
                  <label htmlFor="purchasedPrice" className="form-label">Purchased Price</label>
                  <input className="form-control" type="number" min="1" required placeholder="Price Of The Product" name="purchasedPrice" value={purchasedPrice} onChange={handleInputChange} />
                  {filteredPurchased.length > 0 && (
                    <ul className="form-control">
                      {filteredPurchased.map((prod) => (
                        <li key={prod._id} style={{cursor: "pointer"}} onClick={() => handleSelectPurchased(prod.purchasedPrice)}>{prod.purchasedPrice}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-0 form-check form-switch" style={{ fontSize: "20px" }}>
                  <input className="form-check-input" type="checkbox" name="includeVAT" checked={includeVAT} style={{ marginLeft: "0.1px" }} onChange={(e) => setProduct({ ...product, includeVAT: e.target.checked })} />
                  <label className="form-check-label">-Include VAT</label>
                </div>
                <div className="mb-0">
                  <label htmlFor="minSellingPrice" className="form-label">Minimum Selling Price</label>
                  <input className="form-control" type="number" min="1" required placeholder="Minimum Selling Price" name="minSellingPrice" value={minSellingPrice} onChange={handleInputChange} />
                  {filteredMinSelling.length > 0 && (
                    <ul className="form-control">
                      {filteredMinSelling.map((prod) => (
                        <li key={prod._id} style={{cursor: "pointer"}} onClick={() => handleSelectMinSelling(prod.sellingPriceRange.minSellingPrice)}>{prod.sellingPriceRange.minSellingPrice}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-0">
                  <label htmlFor="maxSellingPrice" className="form-label">Maximum Selling Price</label>
                  <input className="form-control" type="number" min="1" required placeholder="Maximum Selling Price" name="maxSellingPrice" value={maxSellingPrice} onChange={handleInputChange} />
                  {filteredMaxSelling.length > 0 && (
                    <ul className="form-control">
                      {filteredMaxSelling.map((prod) => (
                        <li key={prod._id} style={{cursor: "pointer"}} onClick={() => handleSelectMaxSelling(prod.sellingPriceRange.maxSellingPrice)}>{prod.sellingPriceRange.maxSellingPrice}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mb-0">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input className="form-control" type="number" min="1" required placeholder="Quantity Of The Product" name="quantity" value={quantity} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="date" className="form-label d-block mb-1">Date</label>
                  <div className='w-100'></div>
                  <DatePicker
                    id="date"
                    name="date"
                    selected={product.date ? new Date(product.date) : null}
                    showIcon
                    dateFormat="yyyy/MM/dd"
                    placeholderText="yyyy/mm/dd"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                    dropdownMode="scroll"
                    popperPlacement="bottom-start"
                    maxDate={new Date()} // 👈 No future dates
                    // minDate={new Date(new Date().getFullYear() - 20, 0, 2)} // 👈 10 years back
                    onChange={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const formattedDate = `${year}-${month}-${day}`;
                        setProduct({ ...product, date: formattedDate });
                      } else {
                        setProduct({ ...product, date: '' });
                      }
                    }}
                    className="form-control"
                />
                </div>
                <div className="mb-0">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea type="text" name="description" value={description} onChange={handleInputChange} className="form-control" />
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
            <div className="col-md-8">
              <div id="printableArea" className='table-responsive' >
                <br />
                <div id="hide-onprint" style={{ padding: "1.5rem" }}>
                <h2>Added Products</h2>
              </div>
                <table className="table table-striped table-hover caption-top" style={{ fontSize: "12px", width: "100%" }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th className="action-column">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedProduct.map((product, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.purchasedPrice}</td>
                        <td>{product.quantity}</td>
                        <td>{product.purchasedPrice * product.quantity}</td>
                        <td className="action-column">
                          <button className="btn btn-danger" style={{ fontSize: "1.5rem" }} onClick={() => remove(index + 1)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5">Subtotal</td>
                      <td>{addedProduct.reduce((sum, product) => sum + product.purchasedPrice * product.quantity, 0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
                {isLoading ? (
                  <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
                ) : (
                  <button className="btn btn-lg btn-primary" type="submit" onClick={submitProduct}>Submit Product</button>
                )}
              </div>
            </div>
          </div>
        </>
        )}
        
        { (showProduct === "products") && ( 
        <>
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-primary" onClick={handlePrint}>Print Table</button>
            )}
            content={() => componentRef.current}
            onAfterPrint={() => setPrintView(false)}
            onBeforeGetContent={handleBeforeGetContent}/>
          
          {/* ADDED: Filter control section */}
          <div style={{padding: "1.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Products</h2>
            {/* <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <span style={{fontSize: '14px', color: '#666'}}>
                Showing {page.length} of {rows.length} items
              </span>
              <button
                onClick={clearAllFilters}
                className="btn btn-outline-secondary btn-sm"
              >
                Clear All Filters
              </button>
            </div> */}
          </div>
          
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <div className='table-responsive' >
            <div style={{margin: printView ? "30px" : null}} ref={componentRef}>
            {printView && (
        <>
          <div style={{padding: "1.5rem"}}><h2>Products</h2></div>
          <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
      <div>
          <table className="table table-striped table-hover caption-top"  {...getTableProps()} style={{fontSize: "12px"}}>
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
            {isAdmin ? (
            <tr className="bg-info">
            <td colSpan="4">Subtotal</td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + (sale.original.quantity || 0), 0)}</td>
            <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + (sale.original.purchasedPrice * sale.original.quantity), 0)}</td>
            <td colSpan="3"></td>
            </tr>
            ) : (
            <tr className="bg-info">
              <td colSpan="3">Subtotal</td>
              <td className="fw-bold text-decoration-underline">{rows.reduce((sum, sale) => sum + (sale.original.quantity || 0), 0)}</td>
            </tr>
            )
            }
          </tbody>
        </table>
        </div>
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