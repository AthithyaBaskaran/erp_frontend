import React from "react";

interface PanelProps {
  side: "left" | "right";
  heading: string;
  text: string;
  buttonText: string;
  onClick: () => void;
  imgSrc: string;
}

const Panel: React.FC<PanelProps> = ({
  side,
  heading,
  text,
  buttonText,
  onClick,
  imgSrc,
}) => {
  return (
    <div className={`panel ${side}-panel`}>
      <div className="content">
        <h3>{heading}</h3>
        <p>{text}</p>
        <button className="btn transparent" onClick={onClick}>
          {buttonText}
        </button>
      </div>
      <img src={imgSrc} className="image" alt={`${side} panel`} />
    </div>
  );
};

export default Panel;
