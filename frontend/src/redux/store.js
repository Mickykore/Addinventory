import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import categoryReducer from "./features/product/categorySlice";
import productReducer from "./features/product/productSlice";
import saleReducer from "./features/sales/saleSlice";
import orderSlice from "./features/orders/orderSlice";
import bulkProductSlice from "./features/product/bulkProductSlice";
import reportSlice from "./features/sales/reportSlice";
import expenseSlice from "./features/expense/expenseSlice";

export default configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        product: productReducer,
        sale: saleReducer,
        order: orderSlice,
        bulkProduct: bulkProductSlice,
        report: reportSlice,
        expense: expenseSlice
    },
});


