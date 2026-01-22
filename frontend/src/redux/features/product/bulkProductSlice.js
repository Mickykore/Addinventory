import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import bulkProductservices from '../../../services/bulkProductServices';

const initialState = {
    products: [],
    isLoading: false,
    isError: false,
    product: null,
    success: false,
    error: null
};

export const createBulkProduct = createAsyncThunk(
    'product/createBulkProduct',
    async (product, thunkAPI) => {
        try {
            return await bulkProductservices.createBulkProduct(product);
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

export const updateBulkProducts = createAsyncThunk(
    'product/updateBulkProducts',
    async (_, thunkAPI) => {
        try {
            return await bulkProductservices.updateBulkProducts();
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
)


const bulkProductSlice = createSlice({
    name: 'bulkProduct',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createBulkProduct.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.success = false
        })
        .addCase(createBulkProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.product = action.payload;
            state.products.push(action.payload);
            toast.success("Product added successfully!");
        })
        .addCase(createBulkProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.success = false;
            state.error = action.payload;
            toast.error(action.payload);
        })
        .addCase(updateBulkProducts.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.success = false
        })
        .addCase(updateBulkProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.product = action.payload;
            state.products.push(action.payload);
            toast.success("Product updated successfully!");
        })
        .addCase(updateBulkProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.success = false;
            state.error = action.payload;
            toast.error(action.payload);
        })
    }
});

export const { addProduct, removeProduct, updateProduct } = bulkProductSlice.actions;

export const selectProducts = (state) => state.bulkProduct.products;

export default bulkProductSlice.reducer;
