import React, { useState } from "react";
import "./Contact.css";
import phoneIcon from "../../assets/phoneicon.png";
import mailIcon from "../../assets/mail_icon.png";
import locationIcon from "../../assets/location_icon.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      alert(data.message);

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="contact" id="contact">
      <div className="contact-col">
        <h3>Contact Information</h3>
        <p>
          We are here to help you explore the right program and answer any
          questions about admission, scholarships, and campus life.
        </p>

        <ul>
          <li>
            <img src={locationIcon} alt="" />
            <span>123 University Avenue, Chennai, India</span>
          </li>

          <li>
            <img src={phoneIcon} alt="" />
            <span>+91 98765 43210</span>
          </li>

          <li>
            <img src={mailIcon} alt="" />
            <span>info@educity.com</span>
          </li>
        </ul>
      </div>

      <div className="contact-col">
        <h3>Send us a message</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            rows="5"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button className="btn" type="submit">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
