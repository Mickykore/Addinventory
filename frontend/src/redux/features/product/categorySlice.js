import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, getCategories, deleteCategory, updateCategory, getCategoryById } from '../../../services/categoryServices';
import { toast } from 'react-toastify';


const initialState = {
  isLoading: false,
  category: null,
  isSuccess: false,
  isError: false,
  categories: []
};


export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (category, thunkAPI) => {
    try {
      return await createCategory(category);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getallCategories = createAsyncThunk(
  'category/getCategories',
  async (_, thunkAPI) => {
    try {
      return await getCategories();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeCategory = createAsyncThunk(
  'category/removeCategory',
  async (id, thunkAPI) => {
    try {
      return await deleteCategory(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editCategory = createAsyncThunk(
  'category/editCategory',
  async ({id, data}, thunkAPI) => {
    try {
      return await updateCategory(id, data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSingleCategory = createAsyncThunk(
  'category/getSingleCategory',
  async (id, thunkAPI) => {
    try {
      return await getCategoryById(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(addCategory.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    })
    .addCase(addCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.categories.push(action.payload);
      toast.success("Category added successfully!");
    })
    .addCase(addCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      toast.error(action.payload);
    })
    .addCase(getallCategories.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    })
    .addCase(getallCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.categories = action.payload;
    })
    .addCase(getallCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      toast.error(action.payload);
    })
    .addCase(removeCategory.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    })
    .addCase(removeCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.category = action.payload;
      state.categories = state.categories.filter(category => category._id !== action.payload._id);
      toast.success("Category removed successfully!");
    })
    .addCase(removeCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      toast.error(action.payload);
    })
    .addCase(editCategory.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    })
    .addCase(editCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      // Update the edited category in the categories array
      state.categories = state.categories.map(category => 
        category.id === action.payload.id ? action.payload : category
      );
      toast.success("Category updated successfully!");
    })
    .addCase(editCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      toast.error(action.payload);
    })

    .addCase(getSingleCategory.pending, (state) => {
      state.isLoading = true;
      state.isSuccess = false;
      state.isError = false;
    })
    .addCase(getSingleCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.category = action.payload;
    })
    .addCase(getSingleCategory.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      toast.error(action.payload);
    })

}
});

export const selectIsLoading = (state) => state.category.isLoading;
export const selectCategory = (state) => state.category.category;


export default categorySlice.reducer;

