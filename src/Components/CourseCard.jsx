import React from "react";
import "./CourseCard.css";

const CourseCard = ({
  image,
  level,
  title,
  likes,
  duration,
  learners,
  certificate,
  isOwned,
  isInCart,
  currentUser,
  onAddToCart,
  onRemoveFromCart,
  onOpenAuth,
}) => {
  const renderActionButton = () => {
    if (currentUser?.isAdmin) {
      return <button className="info-btn">Admin Course</button>;
    }

    if (isOwned) {
      return <button className="start-btn">Start Learning</button>;
    }

    if (!currentUser) {
      return (
        <button className="start-btn" onClick={onOpenAuth}>
          Signup to Buy
        </button>
      );
    }

    return isInCart ? (
      <button className="info-btn" onClick={onRemoveFromCart}>
        Remove from Cart
      </button>
    ) : (
      <button className="start-btn" onClick={onAddToCart}>
        Add to Cart
      </button>
    );
  };

  return (
    <div className="course-card">
      <div className="card-image">
        <img src={image} alt={title} />

        <span className="level">{level}</span>
        {certificate && <span className="certificate">🎓 Certificate</span>}
      </div>

      <div className="card-content">
        <h3>{title}</h3>

        <div className="course-info">
          <p>👍 {likes} liked this course</p>
        </div>

        <div className="course-meta">
          <span>⏱ {duration}</span>
          <span>👨‍🎓 {learners} learners</span>
        </div>

        <div className="card-buttons">{renderActionButton()}</div>
      </div>
    </div>
  );
};

export default CourseCard;
