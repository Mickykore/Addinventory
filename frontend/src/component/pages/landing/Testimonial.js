import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./about.css";
// import client1 from "../../assets/images/client1.png"
// import client2 from "../../assets/images/client2.png"
import client from "../../../assets/avatar.jpg"
import ET_Passprt from './ET_Passport.jpg';

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      name: "Yidnekachew Shewarega (Joka Trading)",
      quote:
        "Yebirhan Inc. has revolutionized the way we manage our inventory. Their user-friendly interface and real-time tracking capabilities have saved us time and reduced errors significantly.",
      image: client,
    },
    {
      id: 2,
      name: "Bethelihem Girma (YD Accessories)",
      quote:
        "Using Yebirhan Inc.'s inventory management system has been a game-changer for our business. The detailed sales analytics and automated order recommendations have helped us optimize our stock levels and increase our profits.",
      image: client,
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  function handlePrevious() {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }

  function handleNext() {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }
  return (
    <div className="testimonial">
      <h2>Client Testimonial</h2>
      <div className="testimonial__content">
        <button className="arrow__button arrow__left" onClick={handlePrevious}>
          <FaChevronLeft />
        </button>
        <div className="testimonial__item">
          <div className="testimonial__image">
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
            />
          </div>
          <div className="testimonial__text">
            <h3>{testimonials[currentIndex].name}</h3>
            <p>"{testimonials[currentIndex].quote}"</p>
          </div>
        </div>
        <button className="arrow__button arrow__right" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>
      {/* <div className="testimonial__controls"></div> */}
    </div>
  );
}