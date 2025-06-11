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
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const fetchLightNovel = async (id: number) => {
    const response = await fetch(`/api/light_novels/${id}`);

    if (!response.ok) {
      console.error(`Error fetching light novel with ID:${id}`);
      return;
    }

    setLightNovel((await response.json()) as LightNovel);
  };

  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedChoice = (event.target as HTMLButtonElement).value;

    if (lightNovel?.isRealTitle && selectedChoice === "real-title") {
      setIsCorrect(true);
    } else if (!lightNovel?.isRealTitle && selectedChoice === "fake-title") {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setShowAnswer(true);

    setTimeout(async () => {
      // 次のクイズを取得
      await fetchLightNovel(getRandomInt(100));

      setIsCorrect(false);
      setShowAnswer(false);
    }, 1000);
  };

  if (lightNovel === null) {
    return (
      <div className="main-container">
        <div className="card-container">
          <div className="emoji-icon-large">📚</div>
          <h2 className="title-text">
            ラノベのタイトルは
            <br />
            <span className="title-purple">実在する？</span>
            <br />
            <span className="title-indigo">AIが考えた？</span>
          </h2>
          <button
            onClick={() => fetchLightNovel(getRandomInt(100))}
            className="start-button"
          >
            ✨ スタート ✨
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="main-container">
        <div className="card-container-large">
          {/* タイトル表示部分 */}
          <div className="mb-8">
            <div className="emoji-icon-medium">📖</div>
            <h1 className="light-novel-title">{lightNovel?.title}</h1>
          </div>

          {/* ボタン部分 */}
          <div className="button-container">
            <button
              value="real-title"
              onClick={checkAnswer}
              className="choice-button-base real-button"
            >
              ✅ 実在する
            </button>
            <button
              value="fake-title"
              onClick={checkAnswer}
              className="choice-button-base fake-button"
            >
              🤖 AIが考えた
            </button>
          </div>

          {/* メッセージ表示部分 */}
          <div className="message-area">
            <p className="message-text" style={{ minHeight: "1.5em" }}>
              {showAnswer && (
                <span
                  className={isCorrect ? "correct-answer" : "incorrect-answer"}
                >
                  {isCorrect ? "🎉 正解！" : "❌ 不正解..."}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
