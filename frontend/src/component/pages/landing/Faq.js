import React, { useState } from "react";
import "./faqs.css";

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I add a new product to the inventory?",
      answer:
        "To add a new product, navigate to the 'Product' section, Fill in the product details such as name, quantity, price, and any other relevant information and click on the 'Submit' button. After completing adding products, finally submit the product to add it to your inventory.",
    },
    {
      question: "How can I manage sales and record transactions?",
      answer:
        "You can manage sales by going to the 'Sales' section. Here, you can record new sales transactions, view past sales. To record a new sale, click on the 'Add New Sale' button, enter the required details, and save the transaction.",
    },
    {
      question: "How do I record and categorize expenses?",
      answer:
        "In the 'Expenses' section, click on the 'Add New Expense' button to record an expense. Fill in the details such as expense type, amount, date, and description. You can also categorize expenses to better manage your financial records.",
    },
    {
      question: "Where can I view all my products?",
      answer:
        "You can view all your products in the 'Product' section. This section provides a list of all products along with details such as stock levels, prices, and categories. You can also search and filter products to find specific items quickly.",
    },
    {
      question: "How can I generate and view sales reports?",
      answer:
        "Sales reports can be generated in the 'Reports' section. Choose the type of report you want (daily, monthly, yearly, or custom) and click on 'Generate Report.' You can view, download, and analyze these reports to understand your sales performance.",
    },
    {
      question: "How do I estimate my taxes?",
      answer:
        "Tax estimation can be done in the 'Reports' section. Generate financial reports and the system will calculate the estimated tax amounts based on your sales and expenses. This helps you prepare for tax seasons without hassle.",
    },
    {
      question: "Can I control user access and permissions?",
      answer:
        "Yes, in the 'User Management' section, you can add and manage users. Assign roles and permissions based on the user's responsibilities. This helps in maintaining security and control over your inventory management system.",
    },
    {
      question: "What kind of data analytics does the app provide?",
      answer:
        "The app provides data analytics on sales trends, expense breakdowns, and overall business performance. These insights help you make informed decisions to optimize your inventory and financial management strategies.",
    },
  ];

  return (
    <div className="faqs">
      <h2>Frequently Asked Questions</h2>
      <div className="faqs__content">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq__question">{faq.question}</div>
            <div className="faq__answer">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
