import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportService from "../../../services/reportService";

const initialState = {
    reports: [],
    expenses: [],
    totalExpense: 0,
    totalExpenseBank: 0,
    totalExpenseCash: 0,
    totalSale: 0,
    totalProfit: 0,
    totalPurchase: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
};

export const getReport = createAsyncThunk(
    'reports/getReport',
    async (date, thunkAPI) => {
        try {
            return await reportService.getReport(date);
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

const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getReport.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        });
        builder.addCase(getReport.fulfilled, (state, { payload }) => {
            state.reports = payload.reportData;
            state.expenses = payload.expenseData;
            state.totalSale = payload.reportData.reduce((sum, report) => sum + (report.singleSalePrice * report.quantity), 0);
            state.totalExpense = payload.expenseData.reduce((sum, expense) => sum + expense.amount, 0);
            state.totalExpenseBank = payload.expenseData.filter(expense => expense.expenseMethod === 'Bank').reduce((sum, expense) => sum + expense.amount, 0);
            state.totalExpenseCash = payload.expenseData.filter(expense => expense.expenseMethod === 'Cash').reduce((sum, expense) => sum + expense.amount, 0);
            state.totalProfit = payload.reportData.reduce((sum, report) => sum + report.totalProfit, 0)
            console.log(payload.reportData);
            state.totalPurchase = payload.reportData.reduce((sum, report) => sum + ((report.singleSalePrice - report.singleProfit) * report.quantity), 0)
            console.log(state.totalPurchase);
            state.isLoading = false;
            state.isSuccess = true;
        });
        builder.addCase(getReport.rejected, (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            toast.error(payload);
        });
    }
});

export const selectReports = (state) => state.report.reports; 

export default reportSlice.reducer;

