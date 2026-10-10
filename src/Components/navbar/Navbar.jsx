import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-scroll";
import menu_icon from "../../assets/menu_icon.png";

const Navbar = ({ currentUser, onUserAuth, onAdminAuth, onLogout }) => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav className={`container ${sticky ? "dark-nav" : ""}`}>
      <div className="nav-left">
        <img src={logo} alt="" className="logo" />
        <img
          src={menu_icon}
          alt="menu"
          className="menu-icon"
          onClick={toggleMenu}
        />
      </div>
      <div className={`nav-right ${mobileMenu ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="hero" smooth={true} offset={0} duration={500}>
              Home
            </Link>
          </li>
          <li>
            <Link to="program" smooth={true} offset={-300} duration={500}>
              Program
            </Link>
          </li>
          <li>
            <Link to="about" smooth={true} offset={-150} duration={500}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="campus" smooth={true} offset={-260} duration={500}>
              Campus
            </Link>
          </li>
          <li>
            <Link to="testimonials" smooth={true} offset={-260} duration={500}>
              Testimonials
            </Link>
          </li>
          <li>
            <Link
              to="contact"
              smooth={true}
              offset={-260}
              duration={500}
              className="btn"
            >
              contact us
            </Link>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="sign-btn" onClick={onUserAuth}>
            Student Signup
          </button>
          <button className="sign-btn" onClick={onAdminAuth}>
            Admin Sign In
          </button>
          {currentUser && (
            <button className="sign-btn logout-btn" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
