import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleExpense, updateExpense } from '../../../redux/features/expense/expenseSlice';
import { toast } from 'react-toastify';
import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialState = {
  type: '',
  amount: "",
  description: '',
  expenseMethod: '',
  date: ''
}

export const EditExpense = () => {

  useRedirectLogOutUser();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();


  const [expenseForm, setExpenseForm] = useState(initialState);

  const {type, amount, description, date, expenseMethod} = expenseForm;

  useEffect(() => {
    dispatch(getSingleExpense(id));
  }, [dispatch, id]);
  
  const { expense } = useSelector((state) => state.expense);
  console.log("fgds", expense);
  
  useEffect(() => {
    if (expense) {
      setExpenseForm({...expense,
        date: expense.createdAt,
    });
    }
  }, [expense]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setExpenseForm({
      ...expenseForm,
      [name]: value
    })
  }

  const editExpense = (e) => {
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
    dispatch(updateExpense({id, data}));
    navigate("/Expenses");
  }


  return (
    <div className="Expenses">
      <div>
        <div>
        <div style={{padding: "1.5rem"}}><h2>Update Expenses</h2></div>
          <form onSubmit={editExpense} className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}}>
          <div>
              <label className="form-label">Purpose Of Expense</label>
              <input className="form-control" placeholder="Expense purpose" type="text" name="type" value={type} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Amount</label>
              <input className="form-control" placeholder="Amount" type="number" name="amount" value={amount} onChange={handleInputChange} />
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
              onChange={(selectedDate) => {
                if (selectedDate) {
                  // Create a new Date object offset by +3 hours (GMT+3)
                  const gmtPlus3Date = new Date(selectedDate.getTime());

                  // Convert to ISO string in local timezone (will still show as Z, so use toISOString only if you're storing UTC)
                  // If you want ISO with offset, use this:
                  const isoWithOffset = gmtPlus3Date.toISOString(); // will be in UTC but already offset

                  setExpenseForm({ ...expenseForm, date: isoWithOffset });
                } else {
                  setExpenseForm({ ...expenseForm, date: '' });
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
      </div>
    </div>
  )
}
