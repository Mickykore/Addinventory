import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import expenseService from "../../../services/expenseService";

const initialState = {
    expenses: [],
    error: null,
    success: null,
    expense: null,
    isLoading: false,
}

export const createExpense = createAsyncThunk(
    'expense/createExpense',
    async (expense, thunkAPI) => {
        try {
            return await expenseService.createExpense(expense);
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

export const getExpenses = createAsyncThunk(
    'expense/getExpenses',
    async (_, thunkAPI) => {
        try {
            return await expenseService.getExpenses();
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

export const deleteExpense = createAsyncThunk(
    'expense/deleteExpense',
    async (id, thunkAPI) => {
        try {
            return await expenseService.deleteExpense(id);
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

export const updateExpense = createAsyncThunk(
    'expense/updateExpense',
    async ({id, data}, thunkAPI) => {
        try {
            return await expenseService.updateExpense(id, data);
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

export const getSingleExpense = createAsyncThunk(
    'expense/getSingleExpense',
    async (id, thunkAPI) => {
        try {
            return await expenseService.getSingleExpense(id);
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

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createExpense.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
                state.expense = action.payload;
                state.expenses.push(action.payload);
                toast.success("expense created successfully");
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getExpenses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.expenses = action.payload;
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
                toast.error(action.payload);
            })
            .addCase(deleteExpense.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
                state.expenses = state.expenses.filter(expense => expense._id !== action.payload._id);
                toast.success(action.payload.message);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(updateExpense.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = action.payload.message;
                state.expense = action.payload;
                state.expenses = state.expenses.map(expense => expense._id === action.payload._id ? action.payload : expense);
                console.log("toast", action.payload);
                toast.success("update expense successfully");
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(getSingleExpense.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSingleExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expense = action.payload;
            })
            .addCase(getSingleExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
});

export default expenseSlice.reducer;