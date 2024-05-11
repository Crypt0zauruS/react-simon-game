import React, { useEffect, useState, useRef } from "react";
import ButtonList from "./components/ButtonList";
import Timer from "./components/Timer";
import wrong from "./components/wrong.mp3";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const ButtonConfig = {
  Buttons: [
    {
      color: "red",
    },
    {
      color: "green",
    },
    {
      color: "blue",
    },
    {
      color: "yellow",
    },
  ],
};

const App = () => {
  const [activeButton, setActiveButton] = useState("");
  const [gameDirections, setGameDirections] = useState("Click to Start!");
  const [gameState, setGameState] = useState("Not Started");
  const [gamePattern, setGamePattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [turns, setTurns] = useState(20);
  const [strict, setStrict] = useState(false);
  const [start, setStart] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const modal = useRef(null);

  const modalOpen = function () {
    modal.current.style.height = "100vh";
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const initGameParameters = () => {
    setActiveButton("");
    setGameDirections("Welcome to the Simon Game !");
    setGameState("Not Started");
    setGamePattern([]);
    setUserInput([]);
    setTimer(30);
  };

  // Click listener
  window.addEventListener("click", clickListener, false);
  let counting = 0,
    clicks = 1;

  function clickListener(e) {
    clicks++;

    if (!counting) {
      counting = 1;
      setTimeout(function () {
        console.log(clicks);
        if (clicks > 7) {
          modalOpen();
        }
        counting = 0;
        clicks = 0;
      }, 1000);
    }
  }

  // Controller
  useEffect(() => {
    const nextSequence = () => {
      let randomNumber = Math.floor(Math.random() * 4);
      let randomChosenColour = ButtonConfig.Buttons[randomNumber].color;
      setActiveButton(randomChosenColour);
      setGamePattern([...gamePattern, randomChosenColour]);
    };

    const waitFor = (ms) => new Promise((r) => setTimeout(r, ms));

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    const recallPattern = async (gamePattern) => {
      if (gamePattern.length < turns) {
        await asyncForEach(gamePattern, async (pattern) => {
          await waitFor(400);
          setActiveButton(pattern);
          await waitFor(400);
          setActiveButton("");
        });
        setTimeout(() => {
          setGameState("Game Continue");
        }, 400);
      } else {
        setTimeout(() => {
          setGameState("Game Ended");
        }, 400);
      }
    };

    const retryPattern = async (gamePattern) => {
      await asyncForEach(gamePattern, async (pattern) => {
        await waitFor(400);
        setActiveButton(pattern);
        await waitFor(400);
        setActiveButton("");
      });
    };

    // Start the game
    if (start) {
      if (gameState === "Not Started") {
        setGameDirections("Watch the patterns !");
        setTimeout(() => {
          nextSequence();
          setGameState("Game Started");
          setDisabled(true);
        }, 1000);
      }
    } else {
      initGameParameters();
    }

    // Game states
    switch (gameState) {
      case "Game Ended":
        setDisabled(false);
        setGameDirections("You Win !");

        setTimeout(() => {
          setStart(false);
          initGameParameters();
        }, 1000);
        break;

      case "Game Started":
        setUserInput([]);
        setGameState("Player Turn");
        setTimeout(() => {
          setGameDirections(
            `Level : ${gamePattern.length} ${
              gamePattern.length === 1 ? "step" : "steps"
            }`
          );

          setDisabled(false);
        }, 800);

        break;

      case "Game Recall":
        setDisabled(true);
        recallPattern(gamePattern);
        break;

      case "Game Retry":
        setDisabled(true);
        setGameDirections("Wrong button ! Retry !");

        setGamePattern([...gamePattern]);
        setTimeout(() => {
          retryPattern(gamePattern);
        }, 400);
        setGameState("Game Started");

        break;

      case "Game Continue":
        //setDisabled(false);
        setGameState("Game Started");
        nextSequence();

        break;

      default:
        break;
    }

    return () => {
      setActiveButton("");
    };
    // eslint-disable-next-line
  }, [gameState, start, turns]);

  useEffect(() => {
    switch (gameState) {
      case "Player Turn":
        if (
          gamePattern[userInput.length - 1] === userInput[userInput.length - 1]
        ) {
          //Correct pattern
          if (gamePattern.length === userInput.length) {
            setTimeout(() => {
              setGameState("Game Recall");
              gamePattern.length < turns &&
                setGameDirections("Playing pattern...");
              setDisabled(true);
            }, 1000);
          }
        }
        //incorrect pattern
        else {
          if (strict) {
            if (highScore < gamePattern.length) {
              setHighScore(gamePattern.length - 1);
            }
            setGameDirections("You loose !");
            const audio = new Audio(wrong);
            audio.play();
            document.body.classList.add("game-over");
            setTimeout(() => {
              document.body.classList.remove("game-over");
              setStart(false);
            }, 1000);
          } else {
            setDisabled(true);
            setTimeout(() => {
              setGameState("Game Retry");
            }, 200);
          }
        }
        break;

      default:
        break;
    }
    // eslint-disable-next-line
  }, [gameState, gamePattern, userInput, highScore]);

  const checkUserInput = (color) => {
    setUserInput([...userInput, color]);
  };

  return (
    <div className="container min-vh-auto">
      <div className="modal" ref={modal}>
        <h1>You are NOT serious !!</h1>
      </div>
      <h1 id="game-directions">{gameDirections}</h1>
      <div className="start-game">
        <input
          disabled={!start ? false : true}
          type="number"
          min="20"
          value={turns}
          onChange={(e) => setTurns(e.target.value)}
        />
        <button
          disabled={disabled}
          className="game-controls"
          onClick={() => setStart(!start)}
        >
          {!start ? "Start Game" : "Reset Game"}
        </button>
      </div>
      <div className="container w-50">
        <div className="row text-center">
          <button
            className="game-controls"
            disabled={!start ? false : true}
            onClick={() => setStrict(!strict)}
          >
            Strict Mode : {strict ? "On" : "Off"}
          </button>
        </div>
        <div className="row text-center">
          <Timer
            gameState={gameState}
            setUserInput={setUserInput}
            userInput={userInput}
            timer={timer}
            setTimer={setTimer}
            setGameDirections={setGameDirections}
            setStart={setStart}
          />

          <div className="col-lg-5 text-center counter">
            High Score: {strict ? highScore : "Strict mode only"}
          </div>
        </div>
        <ButtonList
          buttons={ButtonConfig.Buttons}
          activeButton={activeButton}
          gameState={gameState}
          checkUserInput={checkUserInput}
        />
        <div className="footer">
          &copy; Copyright by Crypt0zauruS
          <h1>
            Follow me on{" "}
            <a
              className="github"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/Crypt0zauruS"
            >
              <i className="fab fa-github"></i>
            </a>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;
