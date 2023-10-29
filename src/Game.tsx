import { useEffect, useState } from "react";
import Column from "./Column";
import Obstacle from "./Obstacle";
import Player from "./Player";

const Game = () => {
  const [playerColumn, setPlayerColumn] = useState<number>(2);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentIcon, setCurrentIcon] = useState<string>("images/pause.svg");
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showExplosion, setShowExplosion] = useState(false);
  const [explosionCoords, setExplosionCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [obstacles, setObstacles] = useState<Array<{ position: number; column: number; exploded: boolean }>>([
    {
      position: 0,
      column: Math.floor(Math.random() * 3),
      exploded: false
    }
  ]);

  const resetGame = () => {
    setScore(0); // Reset score when restarting game
    setIsGameOver(false);
    setPlayerColumn(2);
    setShowExplosion(false);
    setExplosionCoords(null);
    setObstacles([
      {
        position: 0,
        column: Math.floor(Math.random() * 3),
        exploded: false
      }
    ]);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          setPlayerColumn((prevColumn) => Math.max(prevColumn - 1, 0));
          break;
        case "ArrowRight":
          setPlayerColumn((prevColumn) => Math.min(prevColumn + 1, 2));
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handlePauseResume = () => {
    setIsPaused(!isPaused); // Toggle the pause state
    setCurrentIcon((prevIcon) => (prevIcon === "images/pause.svg" ? "images/resume.svg" : "images/pause.svg"));
  };

  useEffect(() => {
    if (isPaused) return; // Do not execute the game loop if the game is paused

    const interval = setInterval(() => {
      setObstacles((prevObstacles) => {
        let newObstacles = [...prevObstacles];

        if (prevObstacles[prevObstacles.length - 1].position > 500) {
          newObstacles.push({
            position: 0,
            column: Math.floor(Math.random() * 3),
            exploded: false
          });
        }

        newObstacles = newObstacles.map((obstacle) => {
          if (!obstacle.exploded && obstacle.position > window.innerHeight - 120 && playerColumn === obstacle.column) {
            setIsGameOver(true);
            setExplosionCoords({
              top: window.innerHeight - 120,
              left: playerColumn * 33.33
            });
            return {
              ...obstacle,
              exploded: true
            };
          }
          return {
            ...obstacle,
            position: obstacle.position + 25
          };
        });

        // Modify the Check for avoided obstacle and increment score
        newObstacles.forEach((obstacle, index) => {
          if (obstacle.position > window.innerHeight - 130 && obstacle.position <= window.innerHeight - 120 && !obstacle.exploded) {
            setScore((prevScore) => prevScore + 10);
          }
        });

        // Cleanup: Remove obstacles that are out of view
        newObstacles = newObstacles.filter((obstacle) => obstacle.position <= window.innerHeight);

        return newObstacles;
      });
    }, 50);

    // Clear the interval when the game is over
    if (isGameOver) clearInterval(interval);

    return () => clearInterval(interval);
  }, [playerColumn, isGameOver, isPaused]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px", fontSize: "24px", backgroundColor: "#ccc" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="images/euro.svg" alt="Coin" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
          {score}
        </div>

        <img src={currentIcon} alt={isPaused ? "Resume" : "Pause"} style={{ width: "50px", height: "50px", marginRight: "10px" }} onClick={handlePauseResume} />
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <Column backgroundColor="#BFBFBF">
          {!isGameOver && playerColumn === 0 && <Player positionY={50} />}
          {obstacles
            .filter((ob) => ob.column === 0)
            .map((obstacle, index) => (
              <Obstacle key={index} position={obstacle.position} column={obstacle.column} isExploded={obstacle.exploded} />
            ))}
        </Column>
        <Column backgroundColor="#ABABAB">
          {!isGameOver && playerColumn === 1 && <Player positionY={50} />}
          {obstacles
            .filter((ob) => ob.column === 1)
            .map((obstacle, index) => (
              <Obstacle key={index} position={obstacle.position} column={obstacle.column} isExploded={obstacle.exploded} />
            ))}
        </Column>
        <Column backgroundColor="#B3B3B3">
          {!isGameOver && playerColumn === 2 && <Player positionY={50} />}
          {obstacles
            .filter((ob) => ob.column === 2)
            .map((obstacle, index) => (
              <Obstacle key={index} position={obstacle.position} column={obstacle.column} isExploded={obstacle.exploded} />
            ))}
        </Column>
        {showExplosion && explosionCoords && (
          <img
            src="images/explosion.gif"
            alt="Explosion"
            style={{
              top: `calc(${explosionCoords.top}px  - 50px)`,
              left: `calc(${explosionCoords.left}%  + 250px)`,
              position: "absolute",
              width: "100px",
              height: "100px"
            }}
          />
        )}
        {isGameOver && (
          <button
            onClick={resetGame}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "20px 40px",
              fontSize: "24px",
              backgroundColor: "#FF5733",
              border: "none",
              borderRadius: "50px",
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "CaskaydiaCove",
              letterSpacing: "2px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
              e.currentTarget.style.backgroundColor = "#FF8E66";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
              e.currentTarget.style.backgroundColor = "#FF5733";
            }}>
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
