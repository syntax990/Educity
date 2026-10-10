function ProgramCard({ image, icon, title, tall }) {
  return (
    <div className="program">
      <img src={image} alt={title} className={tall ? "tall-img" : ""} />
      <div className="caption">
        <img src={icon} alt="" />
        <p>{title}</p>
      </div>
    </div>
  );
}

export default ProgramCard;