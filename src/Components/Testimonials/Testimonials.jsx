import React, { useRef } from "react";
import "./Testimonials.css";
import next_icon from "../../assets/next_icon.png";
import back_icon from "../../assets/back_icon.png";
import user_1 from "../../assets/user_1.png";
import user_2 from "../../assets/user_2.png";
import user_3 from "../../assets/user_3.png";
import user_4 from "../../assets/user_4.png";

const Testimonials = () => {
  const slider = useRef(null);
  const tx = useRef(0);

  const slideForward = () => {
    if (tx.current > -50) {
      tx.current -= 25;
    }
    if (slider.current) {
      slider.current.style.transform = `translateX(${tx.current}%)`;
    }
  };

  const slidebackward = () => {
    if (tx.current < 0) {
      tx.current += 25;
    }
    if (slider.current) {
      slider.current.style.transform = `translateX(${tx.current}%)`;
    }
  };

  return (
    <div className="testimonials">
      <img src={next_icon} alt="" className="next-btn" onClick={slideForward} />
      <img
        src={back_icon}
        alt=""
        className="back-btn"
        onClick={slidebackward}
      />
      <div className="slider">
        <ul ref={slider}>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_1} alt="" />
                <div>
                  <h3>William jackson</h3>
                  <span>Edusity , Banglore </span>
                </div>
              </div>
              <p>
                A business degree can lead you towards many career paths,
                including that of a marketing executive, accountant, business
                owner, and financial analyst. The coursework you might have in
                your college programme may include:
              </p>
            </div>
          </li>

          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_2} alt="" />
                <div>
                  <h3>alisonnn</h3>
                  <span>Edusity , Banglore </span>
                </div>
              </div>
              <p>
                A business degree can lead you towards many career paths,
                including that of a marketing executive, accountant, business
                owner, and financial analyst. The coursework you might have in
                your college programme may include:
              </p>
            </div>
          </li>

          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_3} alt="" />
                <div>
                  <h3>jack sparrow</h3>
                  <span>Edusity , Banglore </span>
                </div>
              </div>
              <p>
                A business degree can lead you towards many career paths,
                including that of a marketing executive, accountant, business
                owner, and financial analyst. The coursework you might have in
                your college programme may include:
              </p>
            </div>
          </li>

          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_4} alt="" />
                <div>
                  <h3>monoply</h3>
                  <span>Edusity , Banglore </span>
                </div>
              </div>
              <p>
                A business degree can lead you towards many career paths,
                including that of a marketing executive, accountant, business
                owner, and financial analyst. The coursework you might have in
                your college programme may include:
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Testimonials;
