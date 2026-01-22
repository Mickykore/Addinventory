import React, { useRef } from 'react';
import styles from './invoiceStyle.module.scss';
import jokalogo from "../../partials/sidebar/jokalogo3.png";

export const Invoice = ({ AddedSales }) => {
  // Use useRef to reference the address element for editing
  const addressRef = useRef(null);

  if (AddedSales.length === 0) 
  {
    return null;
  }

  // extract buyer information
  const selectedSale = AddedSales[0];
  const buyer = selectedSale.buyer;


  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Calculate total amount for each product and grand total
  const grandTotal = AddedSales.reduce((total, product) => {

    const productTotal =parseFloat((product.includeVAT ? (product.singleSalePrice * product.quantity / 1.15) : product.singleSalePrice * product.quantity).toFixed(2));
    return total + productTotal;
  }, 0);
  console.log("sales", AddedSales);
  const VATinclude = AddedSales[0].includeVAT;
  console.log("vat", VATinclude);
  

  return (
    <div style={{padding: "20px",}}>
        <header className="mb-3">
          <address  ref={addressRef} className="float-left">
            <p><img src={jokalogo} alt="joka logo" width={100} height={90}/></p>
            <p>Adama Mebrat Hile infront of Dada Mallss</p>
            <p>Adama, Ethiopia</p>
            <p>(+251) 902 05 05 05</p>
          </address>
          <h1  className="float-right">Sales Invoice</h1>
        </header>
        <article>
          <div style={{textAlign: "right"}}>
            <p>Invoice: 102458</p>
            <p>Date: {currentDate}</p>
            <p>Buyer Name: {buyer.name}</p>
            <p>Phone Number: {buyer.phoneNumber}</p>
            <p>TIN Number: {buyer.tinNumber}</p>
          </div>
          <table className={`table table-striped ${styles.inventory}`}>
            <thead>
              <tr>
                <th><span >Item</span></th>
                <th><span >Description</span></th>
                <th><span >Rate</span></th>
                <th><span >Quantity</span></th>
                <th><span >Price</span></th>
              </tr>
            </thead>
            <tbody>
              {AddedSales.map((product, index) => (
                <tr key={index}>
                  <td><a className="cut">-</a><span >{product.name}</span></td>
                  <td><span >{product.description}</span></td>
                  <td><span data-prefix>$</span><span >{parseFloat((product.includeVAT ? (product.singleSalePrice * 1  / 1.15) : product.singleSalePrice * 1).toFixed(2))}</span></td>
                  <td><span >{product.quantity}</span></td>
                  <td><span data-prefix>$</span><span>{parseFloat((product.includeVAT ? (product.singleSalePrice * product.quantity / 1.15) : (product.singleSalePrice * product.quantity)).toFixed(2))}</span></td>
                </tr>
              ))}
              <tr>
                <th style={{ border: "none" }}></th>
                <th style={{ border: "none" }}></th>
                <th style={{ border: "none" }}></th>
                <th style={{ border: "none", textAlign: "end" }}><span>Sub Total</span></th>
                <th colSpan="4"><span data-prefix>$</span><span>{grandTotal}</span></th>
              </tr>
              {VATinclude && (
                <>
                <tr>
                  <th style={{ border: "none" }}></th>
                  <th style={{ border: "none" }}></th>
                  <th style={{ border: "none" }}></th>
                  <th style={{ border: "none", textAlign: "end" }}><span>VAT (15%)</span></th>
                  <th colSpan="4"><span data-prefix>$</span><span>{parseFloat((grandTotal * 0.15).toFixed(2))}</span></th>
                </tr>
                <tr>
                  <th style={{ border: "none" }}></th>
                  <th style={{ border: "none" }}></th>
                  <th style={{ border: "none" }}></th>
                  <th style={{ border: "none", textAlign: "end" }}><span>Total</span></th>
                  <th colSpan="4"><span data-prefix>$</span><span>{parseFloat((grandTotal + (grandTotal * 0.15)).toFixed(2))}</span></th>
                </tr>
                </>
              )}
            </tbody>
          </table>
        </article>
    </div>
  );
}
