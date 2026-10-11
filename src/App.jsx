import React, { useState, useEffect } from "react";
import Hero from "./Components/Hero/Hero.jsx";
import Navbar from "./Components/navbar/Navbar.jsx";
import Programs from './Components/Programs/programs-temp.jsx'
import Title from "./Components/Title/Title.jsx";
import About from "./Components/About/About.jsx";
import Campus from "./Components/Campus/Campus.jsx";
import Testimonials from "./Components/Testimonials/Testimonials.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer.jsx";
import AdminAuth from "./Components/Auth/AdminAuth.jsx";
import Auth from "./Components/Auth/Auth.jsx";
import AdminPanel from "./Components/AdminPanel/AdminPanel.jsx";
import Card from "./Cards.jsx";
import CourseCard from "./Components/CourseCard.jsx";

const App = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserAuth, setShowUserAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [cart, setCart] = useState([]);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [playState, setPlayState] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("educityUser");
    const savedCart = localStorage.getItem("educityCart");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser({
        ...parsed,
        purchasedCourses: parsed.purchasedCourses || [],
      });
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:4000/api/courses");
        if (!response.ok) {
          throw new Error(`Failed to load courses: ${response.status}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load course data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleUserSuccess = (user) => {
    const normalizedUser = {
      ...user,
      purchasedCourses: Array.isArray(user.purchasedCourses)
        ? user.purchasedCourses
        : [],
    };
    setCurrentUser(normalizedUser);
    localStorage.setItem("educityUser", JSON.stringify(normalizedUser));
    setShowUserAuth(false);
    setShowAdminAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setPurchaseMessage("");
    localStorage.removeItem("educityUser");
    localStorage.removeItem("educityCart");
  };

  const handleAddToCart = (courseId) => {
    if (!currentUser || currentUser.isAdmin) {
      setShowUserAuth(true);
      return;
    }
    if (cart.includes(courseId)) {
      setCart(cart.filter((id) => id !== courseId));
    } else {
      setCart([...cart, courseId]);
    }
  };

  const handlePurchase = async () => {
    if (!currentUser || currentUser.isAdmin || cart.length === 0) {
      setPurchaseMessage(
        "Please sign in as a student and add courses to your cart before purchasing.",
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${currentUser.id}/purchase`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseIds: cart }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to complete purchase");
      }
      setCurrentUser(data);
      localStorage.setItem("educityUser", JSON.stringify(data));
      setCart([]);
      localStorage.removeItem("educityCart");
      setPurchaseMessage(
        "Purchase complete! You can now access your purchased courses.",
      );
    } catch (err) {
      console.error(err);
      setPurchaseMessage(err.message || "Purchase failed. Please try again.");
    }
  };

  const handleUserAuthOpen = () => {
    setShowUserAuth(true);
    setShowAdminAuth(false);
  };

  const handleAdminAuthOpen = () => {
    setShowAdminAuth(true);
    setShowUserAuth(false);
  };

  const handleCourseAuthOpen = () => {
    setShowUserAuth(true);
    setShowAdminAuth(false);
  };

  useEffect(() => {
    localStorage.setItem("educityCart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div>
      <Navbar
        currentUser={currentUser}
        onUserAuth={handleUserAuthOpen}
        onAdminAuth={handleAdminAuthOpen}
        onLogout={handleLogout}
      />

      {showUserAuth ? (
        <Auth
          onSuccess={handleUserSuccess}
          onClose={() => setShowUserAuth(false)}
        />
      ) : showAdminAuth ? (
        <AdminAuth
          onSuccess={handleUserSuccess}
          onClose={() => setShowAdminAuth(false)}
        />
      ) : (
        <>
          <Hero />

          <div className="parent">
            <Card
              user="sajid"
              age={26}
              img="https://images.unsplash.com/photo-1751554933476-d029737d58b2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <Card
              user="Akhtar"
              age={24}
              img="https://plus.unsplash.com/premium_photo-1677094766815-e0fe790e364a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <Card
              user="Aman Singh"
              age={18}
              img="https://images.unsplash.com/photo-1751097006268-ae4601fcb117?q=80&w=1518&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <Card
              user="Sarthak"
              age={28}
              img="https://images.unsplash.com/photo-1752801516481-cfb8c47ee9a3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>

          <div className="course-container">
            {loading && <p>Loading courses…</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && courses.length === 0 && (
              <p>No courses available.</p>
            )}
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                isOwned={currentUser?.purchasedCourses?.includes(course.id)}
                isInCart={cart.includes(course.id)}
                onAddToCart={() => handleAddToCart(course.id)}
                onRemoveFromCart={() => handleAddToCart(course.id)}
                onOpenAuth={handleCourseAuthOpen}
                currentUser={currentUser}
              />
            ))}
          </div>

          {currentUser && !currentUser.isAdmin && (
            <section className="cart-panel">
              <h2>{currentUser.username}'s Course Cart</h2>
              {cart.length === 0 ? (
                <p>
                  Your cart is empty. Add courses from the catalog to purchase
                  them.
                </p>
              ) : (
                <>
                  <ul>
                    {courses
                      .filter((course) => cart.includes(course.id))
                      .map((course) => (
                        <li key={course.id}>{course.title}</li>
                      ))}
                  </ul>
                  <button className="btn" onClick={handlePurchase}>
                    Purchase Selected Courses
                  </button>
                  {purchaseMessage && (
                    <p className="purchase-message">{purchaseMessage}</p>
                  )}
                </>
              )}
            </section>
          )}

          {currentUser?.isAdmin ? (
            <AdminPanel courses={courses} setCourses={setCourses} />
          ) : currentUser?.purchasedCourses?.length > 0 ? (
            <section className="owned-courses">
              <h2>Your Purchased Courses</h2>
              <div className="course-list">
                {courses
                  .filter((course) =>
                    currentUser.purchasedCourses.includes(course.id),
                  )
                  .map((course) => (
                    <div key={course.id} className="owned-course-card">
                      <h3>{course.title}</h3>
                      <p>Access granted</p>
                    </div>
                  ))}
              </div>
            </section>
          ) : null}

          <div className="container">
            <Title subTitle="Our Program" title="What we offer " />
            <Programs />
            <About setPlayState={setPlayState} />
            <Title subTitle="Gallery" title="Campus Photos " />
            <Campus />
            <Title subTitle="Testimonials" title="What Student says" />
            <Testimonials />
            <Title subTitle="Contact us" title="Get in touch" />
            <Contact />
            <Footer />
          </div>

          {playState && (
            <VideoPlayer playState={playState} setPlayState={setPlayState} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
