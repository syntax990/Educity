import React from "react";
import "./About.css";
import about_icon from "../../assets/about.png";
import play_icon from "../../assets/play_icon.png";

const About = ({ setPlayState }) => {
  return (
    <div className="about">
      <div className="about-left">
        <img src={about_icon} alt="" className="about_img" />
        <img
          src={play_icon}
          alt=""
          className="play_icon"
          onClick={() => {
            setPlayState(true);
          }}
        />
      </div>
      <div className="about-right">
        <h3>About Universities</h3>
        <h2>Nurturing tomoorow Leaders today</h2>
        <p>
          College life is a significant phase in every student’s journey. It is
          the time when we gain knowledge, develop new skills, and prepare
          ourselves for future challenges. I am fortunate to study at Loyola
          College, Chennai, one of the most prestigious institutions in India.
          Known for its academic excellence and holistic approach to education,
          Loyola College has been a stepping stone for thousands of students who
          have gone on to achieve great success.
        </p>

        <p>
          One of the best features of Loyola College is its beautiful campus,
          which spans over 99 acres. The campus is a blend of modern
          infrastructure and lush greenery, providing a peaceful and inspiring
          environment for learning. The college has well-equipped classrooms,
          advanced science and computer labs, a large library with over two lakh
          books, and excellent sports facilities.
        </p>

        <p>
          In conclusion, Loyola College is more than just an institution—it is a
          place that nurtures academic excellence, personal growth, and social
          responsibility. I am proud to be a part of this prestigious
          institution. The knowledge and values I gain here will guide me
          throughout my life, and the memories I create will always hold a
          special place in my heart.{" "}
        </p>
      </div>
    </div>
  );
};

export default About;
