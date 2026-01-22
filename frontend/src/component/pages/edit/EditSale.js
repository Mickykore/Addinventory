import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {useEffect, useState, useMemo} from 'react';
import { useSelector } from 'react-redux';
import {  getSales, updateSale, getSingleSale } from '../../../redux/features/sales/saleSlice';
import { selectName } from '../../../redux/features/auth/authSlice';
import { getallCategories } from '../../../redux/features/product/categorySlice';
import { getComulativeProducts } from '../../../redux/features/product/productSlice';
import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  name: "",
  category: "",
  singleSalePrice: "",
  quantity: "", 
  discription: "",
  buyer: {
    name: "",
    phoneNumber: "",
    tinNumber: ""
  },
  buyername: "",
  phoneNumber: "",
  tinNumber: "",
  itemIdentification: "",
  paymentMethod: "",
  date: "",
  includeVAT: false,
}

export const EditSale = () => {

  useRedirectLogOutUser();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [saleForm, setSaleForm] = useState(initialState);

  useEffect(() => {
    const getsale = async () => {
      await dispatch(getSingleSale(id));
    }
    getsale();
  }, [dispatch]);

  const categories = useSelector((state) => state.category.categories);
  const { ProductsCumulative, product, isLoading, isError } = useSelector((state) => state.product);
  const { sale } = useSelector((state) => state.sale);


  const {name, category, singleSalePrice, quantity, discription, itemIdentification, buyerName, phoneNumber, tinNumber, paymentMethod, date, buyer, includeVAT} = saleForm;
  const seller = useSelector(selectName);

  // useEffect(() => {
  //   setSaleForm(sale);
  //   }, [sale]);

  useEffect(() => {
    if (sale) {
      // Extract and set maxSellingPrice, minSellingPrice, and category name
      const { product, buyer, ...saleForm } = sale;
      console.log("sallllleeeeeff", sale);

      // const { _id, category } = sale.product;
      setSaleForm({
        ...saleForm,
        name: product.name,
        category: product.category.name,
        buyerName: buyer.buyerName,
        phoneNumber: buyer.phoneNumber,
        tinNumber: buyer.tinNumber,
        date: sale.createdAt ? new Date(sale.createdAt) : "",
      });
    }
  }, [sale]);



  useEffect(() => {
    const getsale = async () => {
      await dispatch(getallCategories());
      await dispatch(getComulativeProducts());
      await dispatch(getSales());
    }
    getsale();
  }, [dispatch]);


  const handleInputChange = (e) => {
    setSaleForm({ ...saleForm, [e.target.name]: e.target.value });
  }

  const editSale = (e) => {
    e.preventDefault();
    const data = {
      name,
      category,
      singleSalePrice,
      quantity,
      seller,
      discription,
      paymentMethod,
      date,
      buyer: {buyerName, phoneNumber, tinNumber},
      itemIdentification,
      includeVAT,
    }
    dispatch(updateSale({id, data}));
    navigate('/Sales')
  }


  const filteredProducts = useMemo(() => {
    // Filter ProductsCumulative based on the selected category
    return ProductsCumulative.filter(product => product.category.name === category);
  }, [category, ProductsCumulative]);




  return (
      <div>
        <h1 style={{textAlign: "center"}}>Update Sales</h1>
          <form onSubmit={editSale} className=" g-3 col-md-5"style={{fontSize: "1.5rem", padding: "1.5rem"}}>
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
              <input type="number" className="form-control" id="singleSalePrice" placeholder="Enter Single Sale Price" name="singleSalePrice" value={singleSalePrice} onChange={handleInputChange}/>
            </div>
            {/* <div className="form-group">
              <label className="form-label">Include VAT</label>
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
              <input type="number" className="form-control" id="quantity" placeholder="Enter Quantity" name="quantity" value={quantity} onChange={handleInputChange}/>
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
                    onChange={(selectedDate) => {
                      if (selectedDate) {
                        // Create a new Date object offset by +3 hours (GMT+3)
                        const gmtPlus3Date = new Date(selectedDate.getTime());

                        // Convert to ISO string in local timezone (will still show as Z, so use toISOString only if you're storing UTC)
                        // If you want ISO with offset, use this:
                        const isoWithOffset = gmtPlus3Date.toISOString(); // will be in UTC but already offset

                        setSaleForm({ ...saleForm, date: isoWithOffset });
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
              <label htmlFor="discription">Discription</label>
              <textarea type="text" className="form-control" id="discription" placeholder="Enter Discription" name="discription" value={discription} onChange={handleInputChange}/>
            </div>
            <br />
              <h2>Buyer Info</h2>
              <div className="form-group">
                <label htmlFor="buyerName">Buyer Name</label>
                <input type="text" className="form-control" id="buyerName" placeholder="Enter Buyer Name" name="buyerName" value={buyerName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="buyerPhoneNumber">Buyer Phone Number</label>
                <input type="text" className="form-control" id="buyerPhoneNumber" placeholder="Enter Buyer Phone Number" name="PhoneNumber" value={phoneNumber} onChange={handleInputChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="buyerTinNumber">Buyer TIN Number</label>
                <input type="text" className="form-control" id="buyerTinNumber" placeholder="Enter Buyer TIN Number" name="tinNumber" value={tinNumber} onChange={handleInputChange} />
              </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
    </div>
  )
}