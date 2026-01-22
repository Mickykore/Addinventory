
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getSingleProduct, updateProduct } from '../../../redux/features/product/productSlice';
import { getallCategories } from '../../../redux/features/product/categorySlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  name: "",
  purchasedPrice: "",
  minSellingPrice: "",
  maxSellingPrice: "",
  description: "",
  quantity: "",
  category: "",
  date: "",
  includeVAT: false,
}


export const EditProduct = () => {
  useRedirectLogOutUser()

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState(initialState);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  const { product} = useSelector((state) => state.product);
  const categories = useSelector((state) => state.category.categories);


  const {name, purchasedPrice, description, quantity, category, maxSellingPrice, minSellingPrice, sellingPriceRange, includeVAT, date} = productForm;
  

  useEffect(() => {
    if (product) {
      // Extract and set maxSellingPrice, minSellingPrice, and category name
      const { sellingPriceRange, ...productForm } = product;
      const { name } = product.category;
      setProductForm({
        ...productForm,
        maxSellingPrice: sellingPriceRange.maxSellingPrice,
        minSellingPrice: sellingPriceRange.minSellingPrice,
        category: name,
        date: product.createdAt ? new Date(product.createdAt) : "",
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProductForm({
      ...productForm,
      [name]: value
    })
  }

  const editProduct = (e) => {
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
    dispatch(updateProduct({id, data}));
    navigate("/Products")
  }


  useEffect(() => {
    dispatch(getallCategories());
    dispatch(getProducts());
  }, [dispatch]);



  return (
    <div className="Orders">
      <div>
        <>
        <div>
          <div id="hide-onprint" style={{padding: "1.5rem"}}><h2>Update Products</h2></div>
          <form id="hide-onprint" onSubmit={editProduct} className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}}>
          <div>
              <label htmlFor="category">Category</label>
              <select className="form-control form-select form-select-lg" placeholder="Category Of The Product" name="category" value={category} onChange={handleInputChange} >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>{category.name}</option>
                  ))}
              </select>
            </div>
            <div>
              <label className="form-label">Name</label>
              <input className="form-control" placeholder="Name Of The Product" type="text" name="name" value={name} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">purchasedPrice</label>
              <input className="form-control" type="number" placeholder="Price Of The Product" name="purchasedPrice" value={purchasedPrice} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Include VAT</label>
              <div className="form-check form-switch" style={{fontSize: "20px", paddingLeft: "0em"}}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="includeVAT"
                  checked={includeVAT}
                  style={{marginLeft: "0.1px"}}
                  onChange={(e) => setProductForm({ ...productForm, includeVAT: e.target.checked })}
                />
                <label className="form-check-label">-Include VAT</label>
              </div>
            </div>
            <div>
              <label className="form-label">minSellingPrice</label>
              <input className="form-control" type="number" placeholder="Minimum Selling Price" name="minSellingPrice" value={minSellingPrice} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">maxSellingPrice</label>
              <input className="form-control" type="number" placeholder="Maximum Selling Price" name="maxSellingPrice" value={maxSellingPrice} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input className="form-control" type="number" placeholder="Quantity Of The Product" name="quantity" value={quantity} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="date" className="form-label d-block mb-1">Date</label>
              <div className='w-100'></div>
              <DatePicker
                id="date"
                name="date"
                selected={productForm.date ? new Date(productForm.date) : null}
                showIcon
                dateFormat="yyyy/MM/dd"
                placeholderText="yyyy/mm/dd"
                showYearDropdown
                scrollableYearDropdown
                onChange={(selectedDate) => {
                  if (selectedDate) {
                    // Create a new Date object offset by +3 hours (GMT+3)
                    const gmtPlus3Date = new Date(selectedDate.getTime());

                    // Convert to ISO string in local timezone (will still show as Z, so use toISOString only if you're storing UTC)
                    // If you want ISO with offset, use this:
                    const isoWithOffset = gmtPlus3Date.toISOString(); // will be in UTC but already offset

                    setProductForm({ ...productForm, date: isoWithOffset });
                  } else {
                    setProductForm({ ...productForm, date: '' });
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
            <button type="submit" className="btn btn-primary">update</button>
            </div>
          </form>
        </div>
        </>
        {/* <div id="hide-onprint" className="table-style" style={{padding: "1.5rem"}}> */}
      </div>
      {/* </div> */}
    </div>
  )
}