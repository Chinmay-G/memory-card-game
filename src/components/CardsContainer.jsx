import Tilt from "react-parallax-tilt";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    try {
      async function fetchData() {
        setIsLoading(true);
        const res = await fetch(
          `https://api.pokemontcg.io/v2/cards?pageSize=100`
        );
        const data = await res.json();
        console.log(data);
        const randomNumArr = getRandomNums(12, 100);
        const cards = randomNumArr.map((n) => {
          return { id: data.data[n].id, imageUrl: data.data[n].images.small };
        });
        setCardsArr(cards);
        setIsLoading(false);
      }

      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, [session]);

  function handleClickOnCard(id) {
    // check if card exists in the game array
    if (gameArr.includes(id)) {
      setSession((session) => session + 1);
      setGameArr([]);
      setCardsArr(null);
      setCurrentScore(0);
      // Also Show LOST message
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
        setSession((session) => session + 1);
        setGameArr([]);
        setCardsArr(null);
        setCurrentScore(0);
      }
    }
    console.log(id, gameArr);
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
      {isLoading && <h3>Loading...</h3>}
      {cardsArr?.map((card) => {
        return (
          <Tilt
            glareEnable={true}
            glarePosition="all"
            glareMaxOpacity={0.4}
            perspective={800}
          >
            <img
              className="card"
              key={card.id}
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
