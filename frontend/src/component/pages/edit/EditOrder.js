import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleOrder, updateOrder } from '../../../redux/features/orders/orderSlice';
import { toast } from 'react-toastify';
import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import { useNavigate, useParams } from 'react-router-dom';

const initialState = {
  name: "",
  orderer: "",
  quantity: "",
  category: "",
  phoneNumber: "",
  description: ""
}

export const EditOrder = () => {

  useRedirectLogOutUser();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  const [orderForm, setOrderForm] = useState(initialState);

  const {name, orderer, description, quantity, category, phoneNumber} = orderForm;

  useEffect(() => {
    dispatch(getSingleOrder(id));
  }, [dispatch, id]);
  
  const { order } = useSelector((state) => state.order);

  

  useEffect(() => {
    if (order) {
        const {orderBy, ...orderForm} = order;
        setOrderForm({...orderForm,
            phoneNumber: orderBy.phoneNumber,
            orderer: orderBy.name});
    }
  }, [order, dispatch, navigate]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value
    })
  }

  const editOrder = (e) => {
    e.preventDefault();
    if (!name || !orderer || !category || !quantity || !phoneNumber) {
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
    dispatch(updateOrder({id, data}));
    navigate("/Orders");
  }


  return (
    <div className="Orders">
      <div>
        <div>
        <div style={{padding: "1.5rem"}}><h2>Update Orders</h2></div>
          <form onSubmit={editOrder} className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}}>
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
      </div>
    </div>
  )
}
