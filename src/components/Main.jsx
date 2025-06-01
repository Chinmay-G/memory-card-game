import { API_KEY, URL } from "../constants";
import CardsContainer from "./CardsContainer";

import { useState } from "react";
import useLocalStorageState from "../useLocalStorageState";

export default function Main() {
  const [currentScore, setCurrentScore] = useState(0);
  const [sessionBestScore, setSessionBestScore] = useState(0);
  const [allTimeBestScore, setAllTimeBestScore] = useLocalStorageState(
    0,
    "allTimeBest"
  ); // Fetch from Local storage
  return (
    <main className="main">
      <ScoreBoard
        currentScore={currentScore}
        sessionBestScore={sessionBestScore}
        allTimeBestScore={allTimeBestScore}
      />
      <CardsContainer
        currentScore={currentScore}
        setCurrentScore={setCurrentScore}
        sessionBestScore={sessionBestScore}
        setSessionBestScore={setSessionBestScore}
        allTimeBestScore={allTimeBestScore}
        setAllTimeBestScore={setAllTimeBestScore}
      />
    </main>
  );
}

function ScoreBoard({ currentScore, sessionBestScore, allTimeBestScore }) {
  return (
    <div className="score-board">
      <span id="all-time-best-score">
        All Time Best Score : {allTimeBestScore}
      </span>
      <span id="session-best-score">
        Session's Best Score : {sessionBestScore}
      </span>
      <span id="current-score">Current Score : {currentScore}</span>
    </div>
  );
}
