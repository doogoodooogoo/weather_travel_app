import { useEffect, useState } from "react";

// 도시별 관광지 데이터
const attractions: Record<string, { name: string; image: string; desc: string }[]> = {
  Tokyo: [
    {
      name: "센소지",
      image: "https://images.unsplash.com/photo-1568028860651-ac5463c69d04?w=480&q=80",
      desc: "도쿄에서 가장 오래된 사찰",
    },
    {
      name: "시부야 스크램블",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=480&q=80",
      desc: "세계에서 가장 유명한 교차로",
    },
    {
      name: "신주쿠 교엔",
      image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=480&q=80",
      desc: "도쿄 중심부 국립 정원",
    },
  ],
  Osaka: [
    {
      name: "오사카성",
      image: "https://images.unsplash.com/photo-1626382591601-f37a1a2a9780?w=480&q=80",
      desc: "16세기 지어진 오사카의 상징",
    },
    {
      name: "도톤보리",
      image: "https://images.unsplash.com/photo-1565559204102-f59129a70ae2?w=480&q=80",
      desc: "오사카 최대 번화가 & 맛집 거리",
    },
    {
      name: "유니버설 스튜디오 재팬",
      image: "https://images.unsplash.com/photo-1612404834746-1ffba06de133?w=480&q=80",
      desc: "오사카 대표 테마파크",
    },
  ],
  Fukuoka: [
    {
      name: "다자이후 텐만구",
      image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=480&q=80",
      desc: "학문의 신을 모시는 유명 신사",
    },
    {
      name: "나카스 포장마차 거리",
      image: "https://images.unsplash.com/photo-1709384079027-8e0a44cafe3d?w=480&q=80",
      desc: "후쿠오카 명물 야외 포장마차",
    },
    {
      name: "후쿠오카성 터",
      image: "https://images.unsplash.com/photo-1573045736454-1abc56c6571d?w=480&q=80",
      desc: "벚꽃 명소로 유명한 성터 공원",
    },
  ],
};

// 점수별 스타일 — 완전한 클래스명으로 하드코딩 (Tailwind 빌드 감지용)
const scoreStyles = {
  good: {
    text: "text-green-500",
    bar: "bg-green-500",
    ring: "ring-2 ring-green-400",
  },
  okay: {
    text: "text-yellow-500",
    bar: "bg-yellow-400",
    ring: "",
  },
  bad: {
    text: "text-red-500",
    bar: "bg-red-400",
    ring: "",
  },
};

function getStyle(score: number) {
  if (score >= 60) return scoreStyles.good;
  if (score >= 30) return scoreStyles.okay;
  return scoreStyles.bad;
}

function getTravelScore(weather: any) {
  let score = 0;
  const condition = weather.weather[0].main;
  const temp = weather.main.temp;
  if (condition === "Clear") score += 40;
  else if (condition === "Clouds") score += 10;
  else if (condition === "Rain") score -= 30;
  if (temp >= 15 && temp <= 25) score += 30;
  else score -= 20;
  return score;
}

function getMessage(score: number) {
  if (score >= 60) return "여행하기 최고";
  if (score >= 30) return "무난한 날씨";
  return "오늘은 비추천";
}

function getBarWidth(score: number) {
  const min = -60, max = 100;
  return Math.max(0, Math.round(((score - min) / (max - min)) * 100));
}

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

        {/* 날씨 카드 3개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherList.map((w, index) => {
            const score = getTravelScore(w);
            const style = getStyle(score);
            const isBest = bestCity?.name === w.name;

            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition ${isBest ? style.ring : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-base font-semibold text-gray-800">{w.name}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                    {w.weather[0].main}
                  </span>
                </div>

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

                <div className="border-t border-gray-100 mb-3" />

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${style.bar}`}
                      style={{ width: `${getBarWidth(score)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${style.text} min-w-[40px] text-right`}>
                    {score}점
                  </span>
                </div>
                <p className="text-xs text-gray-400">{getMessage(score)}</p>
              </div>
            );
          })}
        </div>

        {/* 추천 도시 관광지 섹션 */}
        {bestCity && (
          <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-700 mb-4">
              📍 {bestCity.name} 추천 관광지
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {attractions[bestCity.name]?.map((place, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-36 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="p-4">
                    <p className="font-semibold text-sm text-gray-800">{place.name}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{place.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;