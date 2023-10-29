import React, { useEffect, useState } from "react";

interface ObstacleProps {
  position: number;
  column: number;
  isExploded: boolean;
}

const obstacleImages = [
  "/images/obstacles/snake.svg",
  "/images/obstacles/monster.svg",
  "/images/obstacles/angry.svg",
  "/images/obstacles/fire.svg",
  "/images/obstacles/halloween.svg",
  "/images/obstacles/orc.svg",
  "/images/obstacles/zombie.svg"
];

const Obstacle: React.FC<ObstacleProps> = ({ position, column, isExploded }) => {
  const [selectedObstacleImage, setSelectedObstacleImage] = useState<string>("");

  useEffect(() => {
    const randomObstacleImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
    setSelectedObstacleImage(randomObstacleImage);
  }, []); // Only run this effect once upon mounting

  if (!selectedObstacleImage) return null; // Don't render until an image is selected

  return (
    <div
      style={{
        position: "absolute",
        top: `${position}px`,
        left: `${column * 33.33}%`,
        width: "33.33%",
        height: "100px",
        backgroundImage: isExploded ? `url(images/explosion.gif)` : `url(${selectedObstacleImage})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}></div>
  );
};

export default Obstacle;
