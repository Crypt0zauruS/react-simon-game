import React, { useState, useEffect, useCallback } from "react";

const Button = ({ color, activeButton, gameState, checkUserInput }) => {
  const [pressed, setPressed] = useState(false);

  const animate = useCallback(() => {
    setPressed(true);
    const soundByColor = {
      red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
      blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
      green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
      yellow: new Audio(
        "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
      ),
    };
    soundByColor[color].play();

    setTimeout(() => {
      setPressed(false);
    }, 150);
  }, [color]);

  useEffect(() => {
    if (color === activeButton) {
      animate();
    }
  }, [activeButton, color, animate]);

  const onButtonClick = () => {
    if (gameState === "Player Turn") {
      animate();
      checkUserInput(color);
    }
  };

  return (
    <div
      className={`game-btn ${color} ${pressed ? "pressed" : ""}`}
      onClick={onButtonClick}
    ></div>
  );
};

export default Button;
