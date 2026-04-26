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

  return (
    <div>
      <h1>Japan Weather</h1>

      {weatherList.map((w, index) => (
        <div key={index}>
          <h2>{w.name}</h2>

          <img
            src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
            alt="weather icon"
          />

          <p>온도: {w.main.temp}°C</p>
          <p>날씨: {w.weather[0].main}</p>
        </div>
      ))}
    </div>
  );
}

export default App;