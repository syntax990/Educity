import React from "react";

const Card = ({ img, user, age, level }) => {
  return (
    <div className="card">
      <img src={img} alt={user} />
      <span className="level">{level}</span>
      <span className="certificate">🎓 Certificate</span>
      <h1>
        {user}, {age}
      </h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <button>View Profile</button>
    </div>
  );
};

export default Card;
