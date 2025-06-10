import { useState } from "react";
import "./App.css";

interface LightNovel {
  id: number;
  title: string;
  isRealTitle: boolean;
}

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * (max - 1)) + 1;
};

const App = () => {
  const [lightNovel, setLightNovel] = useState<LightNovel | null>(null);
  const [message, setMessage] = useState<string>("");

  const fetchLightNovel = async (id: number) => {
    const response = await fetch(`/api/light_novels/${id}`);
    setLightNovel((await response.json()) as LightNovel);
  };

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedChoice = (event.target as HTMLButtonElement).value;

    if (lightNovel?.isRealTitle && selectedChoice === "real-title") {
      setMessage("正解！");
    } else if (!lightNovel?.isRealTitle && selectedChoice === "fake-title") {
      setMessage("正解！");
    } else {
      setMessage("不正解");
    }

    setTimeout(() => {
      setMessage("");

      // 次のクイズを取得
      fetchLightNovel(getRandomInt(100));
    }, 1000);
  };

  if (lightNovel === null) {
    return (
      <>
        <h2>ラノベのタイトルは実在する？AIが考えた？</h2>
        <button onClick={() => fetchLightNovel(getRandomInt(100))}>
          スタート
        </button>
      </>
    );
  } else {
    return (
      <>
        <h1>{lightNovel?.title}</h1>

        <div>
          <button value="real-title" onClick={checkAnswer}>
            実在する
          </button>
          <button value="fake-title" onClick={checkAnswer}>
            AIが考えた
          </button>
        </div>

        <p style={{ minHeight: "1.5em" }}>{message}</p>
      </>
    );
  }
};

export default App;
