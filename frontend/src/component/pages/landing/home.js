import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { Link } from 'react-router-dom';
import { FiPackage, FiUsers, FiDollarSign, FiAlertTriangle, FiLock, FiBarChart2 } from 'react-icons/fi'; // Import appropriate React icons
import heroImg from "../../../assets/dashboard.png";
import './Home.scss';
import report from "../../../assets/reports.png";
import order from "../../../assets/order.png";
import products from "../../../assets/products.png";
import testimonialImg from "../../../assets/products.png";
import Testimonial from "./Testimonial";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Pay from "../Pay";
import FAQs from "./Faq";
import yebirhanMain from "./yebirhan main.png"

const Home = () => {
  return (
    <>
      <LandingHeader />
      {/* <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Manage Your Inventory with Ease</h1>
            <p>Our web application helps small and medium-sized businesses in Adama city efficiently manage their inventory and finances.</p>
            <Link to="/signup" className="cta-button">Get Started</Link>
          </div>
          <img src={heroImg} alt="Inventory Management" className="hero-image" style={{width: "400px",height: "300px" }}/>
        </div>
      </div> */}
      <div className="features" style={{backgroundColor: "#eee"}}>
      <h1 style={{fontSize: "3.5rem", textAlign: "center", marginBottom: "2rem", color: "#196c00"}}>Manage Your Inventory with Ease</h1>
        <div className="container marketing">
          <div className="row">
            <FeatureColumn 
              icon={<FiPackage size={50}/>} 
              title="Inventory Management" 
              description="Efficiently manage your store's inventory, keep track of stock levels, and streamline the reordering process." 
            />
            <FeatureColumn 
              icon={<FiUsers size={50}/>} 
              title="Order Management" 
              description="Build and maintain relationships with your customers by tracking their orders and providing personalized service." 
            />
            <FeatureColumn 
              icon={<FiDollarSign size={50} />} 
              title="Sales Analytics" 
              description="Gain insights into your store's performance, track sales trends, and make data-driven decisions to optimize your business." 
            />
            <FeatureColumn 
              icon={<FiAlertTriangle size={50}/>} 
              title="Notifications and Alerts" 
              description="Receive low stock alerts and payment reminders to stay ahead of your inventory needs." 
            />
            <FeatureColumn 
              icon={<FiLock size={50}/>} 
              title="Secure User Management" 
              description="Role-based access control and secure user authentication for managing user accounts and permissions." 
            />
            <FeatureColumn 
              icon={<FiBarChart2 size={50} />} 
              title="Data Analytics" 
              description="Visualize sales trends and expense breakdowns to make informed business decisions." 
            />
          </div>
          <hr className="featurette-divider" />
          <Featurette 
            title="Inventory Tracking" 
            description="Track inventory levels in real-time, receive alerts for low stock items, and optimize stock replenishment to avoid stockouts." 
            icon={<FiPackage size={50}/>} 
            image={products} 
          />
          <hr className="featurette-divider" />
          <Featurette 
            title="Customer Engagement" 
            description="Engage with your customers through loyalty programs, promotions, and personalized recommendations to enhance their shopping experience." 
            icon={<FiUsers size={50}/>} 
            image={order} 
          />
          <hr className="featurette-divider" />
          <Featurette 
            title="Sales Reporting" 
            description="Generate detailed reports on sales performance, analyze product profitability, and identify opportunities for growth." 
            icon={<FiDollarSign size={50}/>} 
            image={report} 
          />
          <hr className="featurette-divider" />
        </div>
      </div>
      <div className="benefits">
        <div className="container">
          <h2 style={{fontSize: "2.5rem", textAlign: "center", marginBottom: "2rem", color: "#196c00"}}>How Yebirhan Inc. Inventory Managemnet Web App <br /> Benefits Your Business</h2>
          <div className="row">
            <BenefitColumn 
              title="Reduce Manual Errors" 
              description="Automate your inventory and financial management processes to reduce human errors and save time."
            />
            <BenefitColumn 
              title="Improve Cash Flow" 
              description="Optimize your inventory levels and avoid stockouts, ensuring a smoother cash flow."
            />
            <BenefitColumn 
              title="Accurate Tax Estimations" 
              description="Generate precise financial reports and tax estimates, easing the burden during tax season."
            />
          </div>
        </div>
      </div>
      <div className="testimonials">
        <div className="container">
          <div className="testimonial">
            <Testimonial />
          </div>
        </div>
      </div>
      <div className="container">
        <FAQs />
      </div>
      <div className="cta-section">
        <div className="container">
          <h2 style={{fontSize: "2.5rem", textAlign: "center", marginBottom: "2rem", color: "#196c00"}}>Ready to Streamline Your Inventory Management?</h2>
          <h3 to="/signup" className="cta-button" style={{fontSize: "2rem", textAlign: "center", marginBottom: "2rem", color: "#196c00"}}>Contact Us</h3>
        </div>
      </div>
      <div className="logo-container" style={{textAlign: "center", marginBottom: "2rem"}}>
        <img src={yebirhanMain} alt="Yebirhan Main Logo" width={300} height={270} style={{cursor: "pointer"}}/>
      </div>
      <div className="phone">
          <span>
            <FaPhoneAlt />
          </span>
          <p className="fs-1">+251 912 292684</p>
        </div>
        <div className="location">
          <span>
            <FaMapMarkerAlt />
          </span>
          <p className="fs-1">M.N.K.Y Business Center, Nerk Tera Adama, Ethiopia </p>
        </div>
      <div className="container">
        {/* <Pay /> */}
      </div>
      <LandingFooter />
    </>
  );
}

const FeatureColumn = ({ icon, title, description }) => {
  return (
    <div className="col-lg-4 text-center">
      {icon}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

const Featurette = ({ title, description, icon, image }) => {
  return (
    <div className="row featurette">
      <div className="col-md-7">
        <h2 className="featurette-heading">{title}</h2>
        <p className="lead fs-2">{description}</p>
      </div>
      <div className="col-md-5 text-center">
        {icon}
        <img src={image} alt={title} className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" />
      </div>
    </div>
  );
};

const BenefitColumn = ({ title, description }) => {
  return (
    <div className="col-lg-4 text-center">
      <h3>{title}</h3>
      <p className="fs-3">{description}</p>
    </div>
  );
};

export default Home;
