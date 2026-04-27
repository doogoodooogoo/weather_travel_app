import { useEffect, useState } from "react";

function App() {
  const [weatherList, setWeatherList] = useState<any[]>([]);
  const cities = ["Tokyo", "Osaka", "Fukuoka"];
  const API_KEY = import.meta.env.VITE_API_KEY;

  const getTravelScore = (weather: any) => {
    let score = 0;
    const condition = weather.weather[0].main;
    const temp = weather.main.temp;
    if (condition === "Clear") score += 40;
    else if (condition === "Clouds") score += 10;
    else if (condition === "Rain") score -= 30;
    if (temp >= 15 && temp <= 25) score += 30;
    else score -= 20;
    return score;
  };

  const getMessage = (score: number) => {
    if (score >= 60) return "여행하기 최고";
    if (score >= 30) return "무난한 날씨";
    return "오늘은 비추천";
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return "text-green-500";
    if (score >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 60) return "bg-green-500";
    if (score >= 30) return "bg-yellow-400";
    return "bg-red-400";
  };

  const getBarWidth = (score: number) => {
    const min = -60, max = 100;
    return Math.max(0, Math.round(((score - min) / (max - min)) * 100));
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const results = await Promise.all(
        cities.map((city) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          ).then((res) => res.json())
        )
      );
      setWeatherList(results);
    };
    fetchWeather();
  }, []);

  const bestCity =
    weatherList.length > 0
      ? [...weatherList].sort((a, b) => getTravelScore(b) - getTravelScore(a))[0]
      : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">🇯🇵 Japan Travel Weather</h1>
          <p className="text-sm text-gray-400 mt-1">도쿄 · 오사카 · 후쿠오카 · 오늘 기준</p>
        </div>

        {/* 추천 배너 */}
        {bestCity && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700">
              오늘 추천 도시: {bestCity.name} — {getMessage(getTravelScore(bestCity))}
            </p>
          </div>
        )}

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherList.map((w, index) => {
            const score = getTravelScore(w);
            const isBest = bestCity?.name === w.name;

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-5 transition ${
                  isBest
                    ? "ring-2 ring-green-400 shadow-md"
                    : "border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* 도시명 + 날씨 상태 배지 */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-base font-semibold text-gray-800">{w.name}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {w.weather[0].main}
                  </span>
                </div>

                {/* 아이콘 + 온도 한 줄 */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gray-50 rounded-xl p-1">
                    <img
                      src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                      alt="weather icon"
                      className="w-10 h-10"
                    />
                  </div>
                  <span className="text-3xl font-semibold text-gray-800">
                    {Math.round(w.main.temp)}
                    <span className="text-base font-normal text-gray-400">°C</span>
                  </span>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-100 mb-3" />

                {/* 점수 바 */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getBarColor(score)}`}
                      style={{ width: `${getBarWidth(score)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(score)} min-w-[40px] text-right`}>
                    {score}점
                  </span>
                </div>

                <p className="text-xs text-gray-400">{getMessage(score)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;