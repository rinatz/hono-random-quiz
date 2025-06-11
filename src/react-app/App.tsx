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
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-4 border-pink-200">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl md:text-3xl font-bold text-pink-800 mb-6 leading-relaxed">
            ラノベのタイトルは
            <br />
            <span className="text-purple-600">実在する？</span>
            <br />
            <span className="text-indigo-600">AIが考えた？</span>
          </h2>
          <button
            onClick={() => fetchLightNovel(getRandomInt(100))}
            className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            ✨ スタート ✨
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full text-center border-4 border-pink-200">
          {/* タイトル表示部分 */}
          <div className="mb-8">
            <div className="text-4xl mb-4">📖</div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed px-4 py-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-2 border-pink-200 shadow-inner">
              {lightNovel?.title}
            </h1>
          </div>

          {/* ボタン部分 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              value="real-title"
              onClick={checkAnswer}
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg border-2 border-green-300"
            >
              ✅ 実在する
            </button>
            <button
              value="fake-title"
              onClick={checkAnswer}
              className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg border-2 border-orange-300"
            >
              🤖 AIが考えた
            </button>
          </div>

          {/* メッセージ表示部分 */}
          <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-2xl border-2 border-yellow-200 p-4">
            <p
              className="text-2xl font-bold text-gray-700 flex items-center justify-center"
              style={{ minHeight: "1.5em" }}
            >
              {showAnswer && (
                <span
                  className={`${
                    isCorrect
                      ? "text-green-600 animate-bounce"
                      : "text-red-500 animate-pulse"
                  }`}
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
