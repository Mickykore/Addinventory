import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import orderService from "../../../services/orderService";

const initialState = {
    orders: [],
    error: null,
    success: null,
    order: null,
    isLoading: false,
}

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (order, thunkAPI) => {
        try {
            return await orderService.createOrder(order);
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

export const getOrders = createAsyncThunk(
    'order/getOrders',
    async (_, thunkAPI) => {
        try {
            return await orderService.getOrders();
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

export const deleteOrder = createAsyncThunk(
    'order/deleteOrder',
    async (id, thunkAPI) => {
        try {
            return await orderService.deleteOrder(id);
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

export const updateOrder = createAsyncThunk(
    'order/updateOrder',
    async ({id, data}, thunkAPI) => {
        try {
            return await orderService.updateOrder(id, data);
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

export const getSingleOrder = createAsyncThunk(
    'order/getSingleOrder',
    async (id, thunkAPI) => {
        try {
            return await orderService.getsingleOrder(id);
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


const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.order = action.payload;
                state.orders.push(action.payload);
                toast.success("Order created successfully");
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = state.orders.filter((order) => order._id !== action.payload._id);
                toast.success("Order deleted successfully");
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(updateOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.order = action.payload;
                state.orders = state.orders.map((order) => order._id === action.payload._id ? action.payload : order);
                toast.success("Order updated successfully");
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getSingleOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.order = action.payload;
            })
            .addCase(getSingleOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
});

export const selectOrders = (state) => state.order.orders;

export default orderSlice.reducer;