import { useEffect, useState } from "react";

function App() {
  const [weatherList, setWeatherList] = useState<any[]>([]);

  const cities = ["Tokyo", "Osaka", "Fukuoka"];

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchWeather = async () => {
      const results = await Promise.all(
        cities.map((city) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          ).then((res) => res.json())
        )
      );
      console.log(API_KEY);
      setWeatherList(results);
    };

    fetchWeather();
  }, []);

  const getTravelScore = (weather: any) => {
    let score = 0;

    const condition = weather.weather[0].main;
    const temp = weather.main.temp;

    // 날씨 조건
    if (condition === "Clear") score += 40;
    else if (condition === "Clouds") score += 10;
    else if (condition === "Rain") score -= 30;
    else score += 0;

    // 온도 조건
    if (temp >= 15 && temp <= 25) score += 30;
    else score -= 20;

    return score;
  };

  const getMessage = (score: number) => {
  if (score >= 60) return "여행하기 최고 👍";
  if (score >= 30) return "무난 👍";
  return "오늘은 비추천 😢";
  };

  return (
    <div>
      <h1>Japan Weather</h1>

      {weatherList.map((w, index) => {
        const score = getTravelScore(w);

        return (
          <div key={index}>
            <h2>{w.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <p>온도: {w.main.temp}°C</p>
            <p>날씨: {w.weather[0].main}</p>

            <p>여행 점수: {score}점</p>
            <p>{getMessage(score)}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;