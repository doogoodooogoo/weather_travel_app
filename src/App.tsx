import { useEffect, useState } from "react";

function App() {
  const [weatherList, setWeatherList] = useState<any[]>([]);

  const cities = ["Tokyo", "Osaka", "Fukuoka"];

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Travel score
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

  // rating
  const getMessage = (score: number) => {
    if (score >= 60) return "여행하기 최고 👍";
    if (score >= 30) return "무난 👍";
    return "오늘은 비추천 😢";
  };

  // rating deco
  const getScoreColor = (score: number) => {
    if (score >= 60) return "text-green-500";
    if (score >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  // data fetch
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

  // best city
  const bestCity =
    weatherList.length > 0
      ? [...weatherList].sort(
          (a, b) => getTravelScore(b) - getTravelScore(a)
        )[0]
      : null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🇯🇵 Japan Travel Weather
      </h1>

      
      {bestCity && (
        <div className="bg-green-100 p-4 rounded-xl mb-6 text-center">
          <h2 className="text-lg font-semibold">
            오늘의 추천 도시: {bestCity.name} 🌟
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weatherList.map((w, index) => {
          const score = getTravelScore(w);
          const message = getMessage(score);

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-2">{w.name}</h2>

              <img
                className="mx-auto"
                src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                alt="weather icon"
              />

              <p className="text-lg">{w.main.temp}°C</p>
              <p className="text-gray-500">{w.weather[0].main}</p>

              <p
                className={`mt-3 text-2xl font-bold ${getScoreColor(score)}`}
              >
                {score}점
              </p>

              <p className="mt-1 text-sm text-blue-500">{message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;