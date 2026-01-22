import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import saleservices from "../../../services/saleService";


const initialState = {
    sales: [],
    salesCumulative: [],
    isLoading: false,
    isError: false,
    sale: "",
    success: false,
    error: null
};


export const createSales = createAsyncThunk(
    'sales/createSales',
    async (sale, thunkAPI) => {
        try {
            return await saleservices.createSales(sale);
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

export const getSales = createAsyncThunk(
    'sales/getSales',
    async (_, thunkAPI) => {
        try {
            return await saleservices.getSales();
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

export const deleteSale = createAsyncThunk(
    'sales/deleteSale',
    async (id, thunkAPI) => {
        try {
            return await saleservices.deleteSale(id);
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

export const updateSale = createAsyncThunk(
    'sales/updateSale',
    async ({id, data}, thunkAPI) => {
        try {
            return await saleservices.updateSale(id, data);
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

export const getSingleSale = createAsyncThunk(
    'sales/getSingleSale',
    async (id, thunkAPI) => {
        try {
            return await saleservices.getSingleSale(id);
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

export const getCumulativeSales = createAsyncThunk(
    'sales/getCumulativeSales',
    async (_, thunkAPI) => {
        try {
            return await saleservices.getCumulativeSales();
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


const saleSlice = createSlice({
    name: "sale",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createSales.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.success = false;
        });
        builder.addCase(createSales.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.success = true;
            state.sales.push(payload);
            toast.success("Sale created successfully");
        });
        builder.addCase(createSales.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload;
            toast.error(payload);
        });
        builder.addCase(getSales.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getSales.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.sales = payload;
        });
        builder.addCase(getSales.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload;
        });
        builder.addCase(deleteSale.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(deleteSale.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.sales = state.sales.filter((sale) => sale._id !== payload._id);
            toast.success("Sale deleted successfully");
        });
        builder.addCase(deleteSale.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload;
            toast.error(payload);
        });
        builder.addCase(updateSale.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(updateSale.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.sale = payload;
            state.sales = state.sales.map(sale => 
                sale.id === payload.id ? payload : sale
              );
            // state.sales = state.sales.filter((sale) => sale._id !== payload._id);
            toast.success("Sale updated successfully");
        });
        builder.addCase(updateSale.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload;
            toast.error(payload);
        });
        builder.addCase(getSingleSale.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getSingleSale.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.sale = payload;
        });
        builder.addCase(getSingleSale.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload;
        });
        builder.addCase(getCumulativeSales.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(getCumulativeSales.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.isError = false;
            state.salesCumulative = payload;
        });
        builder.addCase(getCumulativeSales.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.error = payload;
        });
    },
});

export const selectSales = (state) => state.Sale.sales;

export default saleSlice.reducer;