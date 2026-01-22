import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser"
import { useRedirectEmployee } from "../../customHook/useRedirectEmploye"
import { useEffect, useState } from "react"
import { getComulativeProducts } from "../../redux/features/product/productSlice"
import { useDispatch, useSelector } from "react-redux"
import { CumulativeProducts } from "./dashBoard/CumulativeProducts"
import { CumulativeSales } from "./dashBoard/CumulativeSales"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import Chart from "react-apexcharts";
import "../../dashboard.css"

import 'chartjs-plugin-datalabels';

const initialState = {
  totalStoreValue: 0,
  totalMinSellingStoreValue: 0,
  totalMaxSellingStoreValue: 0,
};

export const Dashboard = () => {

  useRedirectLogOutUser();
  useRedirectEmployee();

  const dispatch = useDispatch();

  const [storeValues, setStoreValues] = useState(initialState)
  const [showCumulate, setShowCumulate] = useState('cumulativeProducts');


  useEffect(() => {
    const getProducts = async () => {
        await dispatch(getComulativeProducts());
    }
    getProducts();
  }, [dispatch, storeValues])

  const { totalStoreValue, totalMinSellingStoreValue, totalMaxSellingStoreValue } = useSelector((state) => state.product); 

  useEffect(() => {
    setStoreValues({
      totalStoreValue,
      totalMinSellingStoreValue,
      totalMaxSellingStoreValue,
    });
  }, [totalStoreValue, totalMinSellingStoreValue, totalMaxSellingStoreValue]);
  

  

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="row" >
        <div className="col-md-4"  style={{padding: "5px"}}>
          <div className="card bg-primary text-black" >
            <div className="card-body">
              <h5 className="card-title fs-1">Purchased Store Value</h5>
              <p className="card-text fs-1 text-white">{storeValues.totalStoreValue} birr</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 "  style={{padding: "5px"}}>
          <div className="card bg-success text-black">
            <div className="card-body">
              <h5 className="card-title fs-1">Minimum Selling Store Value</h5>
              <p className="card-text fs-1 text-white">{storeValues.totalMinSellingStoreValue} birr</p>
            </div>
          </div>
        </div>
        <div className="col-md-4"  style={{padding: "5px"}}>
          <div className="card bg-info text-black">
            <div className="card-body">
              <h5 className="card-title fs-1">Maximum Selling Store Value</h5>
              <p className="card-text fs-1 text-white">{storeValues.totalMaxSellingStoreValue} birr</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row" >
        <div className="col-md-4"  style={{padding: "5px"}}>
          <div className="card bg-primary text-black" >
            <div className="card-body">
              <h5 className="card-title fs-1">Minimum Forcast Profit</h5>
              <p className="card-text fs-1 text-white">{storeValues.totalMinSellingStoreValue - storeValues.totalStoreValue} birr</p>
            </div>
          </div>
        </div>
        <div className="col-md-4"  style={{padding: "5px"}}>
          <div className="card bg-info text-black">
            <div className="card-body">
              <h5 className="card-title fs-1">Maximum Forcast Profit</h5>
              <p className="card-text fs-1 text-white">{storeValues.totalMaxSellingStoreValue - storeValues.totalStoreValue} birr</p>
            </div>
          </div>
        </div>
      </div>
      <ul class="nav nav-pills">
            <li class="nav-item">
            <button  className={(showCumulate === 'cumulativeProducts') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowCumulate('cumulativeProducts')}>Cumulative Products</button>
            </li>
            <li class="nav-item">
            <button  className={(showCumulate === 'cumulativeSales') ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowCumulate('cumulativeSales')}>Cumulative Sales</button>
            </li>
          </ul>
      {showCumulate === 'cumulativeSales' && 
        <div>
          <CumulativeSales />
        </div>
        }
      {showCumulate === 'cumulativeProducts' &&
        <div>
          <CumulativeProducts />
        </div>
        }
    </div>
  )
}
