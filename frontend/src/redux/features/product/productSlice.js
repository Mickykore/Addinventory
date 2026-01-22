import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import productservices from '../../../services/productServices';

const initialState = {
    products: [],
    ProductsCumulative: [],
    totalStoreValue: 0,
    totalMinSellingStoreValue: 0,
    totalMaxSellingStoreValue: 0,
    isLoading: false,
    isError: false,
    product: null,
    success: false,
    error: null
};

export const createProduct = createAsyncThunk(
    'product/createProduct',
    async (product, thunkAPI) => {
        try {
            return await productservices.createProduct(product);
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

export const getProducts = createAsyncThunk(
    'product/getProducts',
    async (_, thunkAPI) => {
        try {
            return await productservices.getProducts();
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

export const getComulativeProducts = createAsyncThunk(
    'product/getComulativeProducts',
    async (_, thunkAPI) => {
        try {
            return await productservices.getCumulativeProducts();
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

export const deleteProduct = createAsyncThunk(
    'product/deleteProduct',
    async (id, thunkAPI) => {
        try {
            return await productservices.deleteProduct(id);
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

export const deleteCumulativeProduct = createAsyncThunk(
    'product/deleteCumulativeProduct',
    async (id, thunkAPI) => {
        try {
            return await productservices.deleteCumulativeProduct(id);
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

export const getSingleProduct = createAsyncThunk(
    'product/getSingleProduct',
    async (id, thunkAPI) => {
        try {
            return await productservices.getSingleProduct(id);
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

export const updateProduct = createAsyncThunk(
    'product/updateProduct',
    async ({id, data}, thunkAPI) => {
        try {
            return await productservices.updateProduct(id, data);
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

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createProduct.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.success = false
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.product = action.payload;
            state.products.push(action.payload);
            console.log(action.payload);
            toast.success("Product added successfully!");
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.success = false;
            state.error = action.payload;
            toast.error(action.payload);
        })

        .addCase(getProducts.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.products = action.payload;
        })
        .addCase(getProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
            toast.error(action.payload);
        })
        .addCase(getComulativeProducts.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getComulativeProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.ProductsCumulative = action.payload;
            state.totalStoreValue = action.payload.reduce((acc, product) => acc + (product.purchasedPrice * product.quantity), 0);
            state.totalMinSellingStoreValue = action.payload.reduce((acc, product) => acc + (product.sellingPriceRange.minSellingPrice * product.quantity), 0);
            state.totalMaxSellingStoreValue = action.payload.reduce((acc, product) => acc + (product.sellingPriceRange.maxSellingPrice * product.quantity), 0);
        })
        .addCase(getComulativeProducts.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
            toast.error(action.payload);
        })
        .addCase(deleteProduct.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.products = state.products.filter((product) => product._id !== action.payload._id);
            toast.success("Product removed successfully!");
        })
        .addCase(deleteProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
            toast.error(action.payload);
        })
        .addCase(deleteCumulativeProduct.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(deleteCumulativeProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.ProductsCumulative = state.ProductsCumulative.filter((product) => product._id !== action.payload._id);
            toast.success("Cumulative Product removed successfully!");
        })
        .addCase(deleteCumulativeProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
            toast.error(action.payload);
        })
        .addCase(getSingleProduct.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getSingleProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.product = action.payload;
        })
        .addCase(getSingleProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
            toast.error(action.payload);
        })
        .addCase(updateProduct.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.product = action.payload;
            // state.products = state.products.filter((product) => product._id !== action.payload._id);
            state.products = state.products.map(product => 
                product.id === action.payload.id ? action.payload : product
              );
            toast.success("Product updated successfully!");
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.error = action.payload;
            toast.error(action.payload);
        })
    }
});

export const { TOTAL_STORE_VALUE, TOTAL_MIN_SELLING_STORE_VALUE, TOTAL_MAX_SELLING_STORE_VALUE } = productSlice.actions;

export const selectProducts = (state) => state.product.products;

export default productSlice.reducer;
