import { useRedirectLogOutUser } from "../../../customHook/useRedirectLogOutUser"
import { editCategory, getallCategories, getSingleCategory} from "../../../redux/features/product/categorySlice"
import { useState, useEffect } from "react"

import { useDispatch, useSelector } from "react-redux"
import ButtonLoading  from "../../../loader/ButtonLoader"
import { useNavigate, useParams } from "react-router-dom"

const initialState = {
  name: "",
}

export const EditCategory = () => {
  useRedirectLogOutUser();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  // Define state variables
  const [categoryForm, setCategoryForm] = useState(initialState);
  const { name } = categoryForm;

  // Fetch category data on component mount
  useEffect(() => {
    dispatch(getSingleCategory(id));
  }, [dispatch, id]);

  // Get category data from Redux store
  const { category, isLoading } = useSelector((state) => state.category);

  // Update categoryForm state when category data changes
  useEffect(() => {
    if (category) {
      setCategoryForm(category);
    }
  }, [category]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({[name]: value});
  };

  // Handle form submission
  const editACategory = async (e) => {
    e.preventDefault();
    const data = { name };
    dispatch(editCategory({ id, data }));
    dispatch(getallCategories());
    navigate("/Category");
  };

  useEffect(() => {
    dispatch(getallCategories());
  }, [dispatch]);

  return (
    <div className="Category">
      <div className="form-signin">
        <form className="bg-white" onSubmit={editACategory}>
          <h1 className="h3 mb-3 fw-normal">Please add category</h1>

          <div className="form-outline mb-4 form-floating">
            <input
              type="text"
              className="form-control form-control-lg"
              id="name"
              placeholder="printer"
              name="name"
              value={name}
              onChange={handleChange}
            />
            <label htmlFor="name">category</label>
          </div>
          {isLoading ? (
            <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
          ) : (
            <button className="btn btn-lg btn-primary" type="submit">Update Category</button>
          )}
        </form>
      </div>
    </div>
  );
};

