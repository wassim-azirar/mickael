import React from "react";

interface PlayerProps {
  positionY: number;
}

const Player: React.FC<PlayerProps> = ({ positionY }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: positionY,
        width: "100px",
        height: "100px",
        backgroundColor: "cover"
      }}>
      <img src={`${process.env.PUBLIC_URL}/images/boy.svg`} alt="Boy Icon" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Player;
