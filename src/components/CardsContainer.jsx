import Tilt from "react-parallax-tilt";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import LostMessage from "./LostMessage";

export default function CardsContainer({
  currentScore,
  setCurrentScore,
  sessionBestScore,
  setSessionBestScore,
  allTimeBestScore,
  setAllTimeBestScore,
}) {
  const [session, setSession] = useState(1);
  const [cardsArr, setCardsArr] = useState(null);
  const [gameArr, setGameArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLost, setIsLost] = useState(false);

  useEffect(() => {
    try {
      async function fetchData() {
        setIsLoading(true);
        const res = await fetch(
          `https://api.pokemontcg.io/v2/cards?pageSize=150`
        );
        const data = await res.json();
        console.log(data);
        const randomNumArr = getRandomNums(12, 150);
        const cards = randomNumArr.map((n) => {
          return { id: data.data[n].id, imageUrl: data.data[n].images.small };
        });
        setCardsArr(cards);
        setIsLoading(false);
        setIsLost(false);
      }

      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, [session]);

  function handleClickOnCard(id) {
    // check if card exists in the game array
    if (gameArr.includes(id)) {
      reloadGame();
      // Also Show LOST message
      setIsLost(true);
    } else {
      // Add the clicked card id to the gameArr
      const newGameArr = gameArr.slice();
      newGameArr.push(id);
      setGameArr(newGameArr);

      //Update current score
      setCurrentScore((curSc) => curSc + 1);
      // Check if the current score's greater than the session best score and update it if yes
      if (currentScore + 1 > sessionBestScore)
        setSessionBestScore(currentScore + 1);
      // Check if the current score's greater than the all time best score and update it if yes
      if (currentScore + 1 > allTimeBestScore)
        setAllTimeBestScore(currentScore + 1);

      // Shuffle the cards
      const cardsArrCopy = cardsArr.slice();
      shuffleArray(cardsArrCopy);
      setCardsArr(cardsArrCopy);

      if (newGameArr.length === 12) {
        alert("🏆 We have a WINNER!! 🫵");
        reloadGame();
      }
    }
    console.log(id, gameArr);
  }

  function reloadGame() {
    setSession((session) => session + 1);
    setGameArr([]);
    setCardsArr(null);
    setCurrentScore(0);
  }

  function getRandomNums(num, limit) {
    // num-number of random numbers needed, limit-range limit for random number
    const arr = [];

    for (let i = 0; i < num; i++) {
      let randomNum = Math.floor(Math.random() * limit);

      while (arr.includes(randomNum)) {
        randomNum = Math.floor(Math.random() * limit);
      }
      arr.push(randomNum);
    }

    console.log(arr);
    return arr;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  console.log(cardsArr);

  return (
    <div className="cards-container">
      {isLost && isLoading && <LostMessage />}
      {isLoading && <Loader />}
      {cardsArr?.map((card) => {
        return (
          <Tilt
            key={card.id}
            glareEnable={true}
            glarePosition="all"
            glareMaxOpacity={0.4}
            perspective={800}
          >
            <img
              className="card"
              src={card.imageUrl}
              alt="Loading.."
              onClick={() => handleClickOnCard(card.id)}
              data-tilt
            />
          </Tilt>
        );
      })}
      {/* <img src={cardsArr?.at(1).imageUrl} alt="Loading.." /> */}
    </div>
  );
}
