import React from "react";
import Button from "./Button";

const ButtonList = ({ buttons, activeButton, gameState, checkUserInput }) => {
  // Prepare the buttons for mapping
  const rows = buttons.reduce((rows, key, index) => {
    return (
      (index % 2 === 0
        ? rows.push([key.color])
        : rows[rows.length - 1].push(key.color)) && rows
    );
  }, []);

  // Mapping buttons
  const renderedList = rows.map((row, index) => {
    return (
      <div key={index} className="row">
        {row.map((col, index) => {
          return (
            <div key={index} className={`col-md-6 text-center`}>
              <Button
                color={col}
                activeButton={activeButton}
                gameState={gameState}
                checkUserInput={checkUserInput}
              ></Button>
            </div>
          );
        })}
      </div>
    );
  });

  return <div className="row">{renderedList}</div>;
};

export default ButtonList;
