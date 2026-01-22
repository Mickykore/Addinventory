import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/pages/landing/home"; // import the Home component
import 'bootstrap/dist/css/bootstrap.min.css';
import "./dashboard.css";
import "./component/partials/sidebar/Sidebar.scss";
import { Products } from "./component/pages/Products";
import { Orders } from "./component/pages/Orders";
import { Reports } from "./component/pages/reports/Reports";
import { Profile } from "./component/pages/Profiles";
import { Nopage } from "./component/pages/Nopage";
import { Sales } from "./component/pages/Sales";
import { Login } from "./component/pages/Login";
import { Signup } from "./component/pages/Signup";
import { Forget } from "./component/pages/Forget";
import { Reset } from "./component/pages/Reset";
import { Dashboard } from "./component/pages/Dashboard";
import { Category } from "./component/pages/Category";
import Sidebar from "./component/partials/sidebar/Sidebar";
import { Layout } from "./component/pages/Layout";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getLoginStatus } from "./services/authService";
import { SET_LOGIN } from "./redux/features/auth/authSlice";
import { EditCategory } from "./component/pages/edit/EditCategory";
import { EditProduct } from "./component/pages/edit/EditProduct";
import { EditSale } from "./component/pages/edit/EditSale";
import { EditOrder } from "./component/pages/edit/EditOrder";
import { UpdateProfile } from "./component/pages/UpdateProfile";
import DailyReport from "./component/pages/reports/AutoReport/DailyReport";
import YearlyReport from "./component/pages/reports/AutoReport/YearlyReport";
import MonthlyReport from "./component/pages/reports/AutoReport/MonthlyReport";
import { Users } from "./component/pages/Users";
import { Expense } from "./component/pages/Expense";
import { EditExpense } from "./component/pages/edit/EditExpense";
import ContactUs from "./component/pages/ContactUs";
import TaxReport from "./component/pages/reports/AutoReport/TaxReport";

axios.defaults.withCredentials = true;
// import './signup.css';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    async  function loginStatus() {
      const status = await getLoginStatus();
      dispatch(SET_LOGIN(status));
    }
    loginStatus();
    }, [dispatch])


  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/Dashboard" element={
        <Sidebar>
          <Layout>
            <Dashboard />
          </Layout>
        </Sidebar>} />

        <Route path="/Category" element={
        <Sidebar>
          <Layout>
            <Category />
          </Layout>
        </Sidebar>} />

        <Route path="/Category/edit-category/:id" element={
        <Sidebar>
          <Layout>
            <EditCategory />
          </Layout>
        </Sidebar>} />

        <Route path="/product/edit-product/:id" element={
        <Sidebar>
          <Layout>
            <EditProduct />
          </Layout>
        </Sidebar>} />

        <Route path="/sale/edit-sale/:id" element={
        <Sidebar>
          <Layout>
            <EditSale />
          </Layout>
        </Sidebar>} />

        <Route path="/order/edit-order/:id" element={
        <Sidebar>
          <Layout>
            <EditOrder />
          </Layout>
        </Sidebar>} />

        <Route path="Products" element={
        <Sidebar>
          <Layout>
            <Products />
          </Layout>
        </Sidebar>} />
        
        <Route path="Orders" element={
        <Sidebar>
          <Layout>
            <Orders />
          </Layout>
        </Sidebar>} />
        
        <Route path="Reports" element={
        <Sidebar>
          <Layout>
            <Reports />
          </Layout>
        </Sidebar>} />

        <Route path="Sales" element={
        <Sidebar>
          <Layout>
            <Sales />
          </Layout>
        </Sidebar>} />

        <Route path="Expenses" element={
        <Sidebar>
          <Layout>
            <Expense />
          </Layout>
        </Sidebar>} />

        <Route path="/Expenses/edit-expense/:id" element={
        <Sidebar>
          <Layout>
            <EditExpense />
          </Layout>
        </Sidebar>} />
        
        <Route path="Users" element={
        <Sidebar>
          <Layout>
            <Users />
          </Layout>
        </Sidebar>} />

        <Route path="Profile" element={
        <Sidebar>
          <Layout>
            <Profile />
          </Layout>
        </Sidebar>} />

        <Route path="update-profile" element={
        <Sidebar>
          <Layout>
            <UpdateProfile />
          </Layout>
        </Sidebar>} />

        <Route path="Daily-report" element={
        <Sidebar>
          <Layout>
            <DailyReport />
          </Layout>
        </Sidebar>} />

        <Route path="Monthly-report" element={
        <Sidebar>
          <Layout>
            <MonthlyReport />
          </Layout>
        </Sidebar>} />

        <Route path="Yearly-report" element={
        <Sidebar>
          <Layout>
            <YearlyReport />
          </Layout>
        </Sidebar>} />

        <Route path="Tax-report" element={
        <Sidebar>
          <Layout>
            <TaxReport />
          </Layout>
        </Sidebar>} />

        <Route path="ContactUs" element={
        <Sidebar>
          <Layout>
            <ContactUs />
          </Layout> 
        </Sidebar>} />

        <Route path="Signin" element={<Login />} />
        <Route path="Login" element={<Login />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="Signout" element={<Login />} />
        <Route path="Logout" element={<Login />} />
        <Route path="ForgotPassword" element={<Forget />} />
        <Route path="ResetPassword/:resetToken" element={<Reset />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
