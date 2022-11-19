import React, { useEffect } from "react";

const Timer = ({
  gameState,
  setUserInput,
  userInput,
  timer,
  setTimer,
  setGameDirections,
  setStart,
}) => {
  useEffect(() => {
    let thisTimer;
    if (gameState === "Player Turn") {
      thisTimer = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      if (timer === 0) {
        document.body.classList.add("game-over");
        setGameDirections("Time out ! You loose !");
        setTimeout(() => {
          document.body.classList.remove("game-over");
          setStart(false);
        }, 1000);
      }
    }
    return () => {
      clearInterval(thisTimer);
    };
    // eslint-disable-next-line
  }, [userInput, timer, gameState, setUserInput, setTimer]);

  useEffect(() => {
    if (gameState === "Player Turn") {
      setTimer(30);
    }
  }, [userInput, gameState, setTimer]);

  return (
    <div className="col-lg-5 text-center counter">
      Timer:
      <br /> {timer}
    </div>
  );
};

export default Timer;
