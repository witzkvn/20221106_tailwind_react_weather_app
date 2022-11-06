import React, { useState, useEffect, useCallback } from "react";
import TodayCard from "./components/TodayCard";
import WeekDayCard from "./components/WeekDayCard";
import { formatWeatherDataDaily } from "./utils/formatWeatherDataDaily";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherUnits, setWeatherUnits] = useState({});

  const fetchWeather = useCallback(async (fetchUrl) => {
    setError(false);
    try {
      const res = await fetch(fetchUrl);
      const data = await res.json();

      if (Object.keys(data).length === 0) {
        setError(true);
      } else {
        const formattedDailyData = formatWeatherDataDaily(data.daily);
        setWeatherData(formattedDailyData);

        setWeatherUnits({
          rain: data.daily_units.precipitation_sum,
          temperature: data.daily_units.temperature_2m_max,
          wind: data.daily_units.windspeed_10m_max,
        });
      }
    } catch (error) {
      setError(true);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);

    // TODO get geoloc and dynamic url
    fetchWeather(
      "https://api.open-meteo.com/v1/forecast?latitude=48.55&longitude=7.74&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max&timezone=Europe%2FLondon"
    ).then(() => setIsLoading(false));
  }, [fetchWeather]);

  // useEffect(() => {
  //   console.log(weatherData);
  // }, [weatherData]);

  if (isLoading) {
    return (
      <div className="">
        <TodayCard />
        <div>
          <WeekDayCard />
          <WeekDayCard />
          <WeekDayCard />
          <WeekDayCard />
          <WeekDayCard />
          <WeekDayCard />
        </div>
      </div>
    );
  }

  if (!isLoading && weatherData.length === 0) {
    return <p>Aucune prévision météo disponible.</p>;
  }

  if (error) {
    return (
      <p>
        Une erreur est survenue lors de la récupération des prévisions météo ...
      </p>
    );
  }

  return (
    <div className="">
      <TodayCard data={weatherData[0]} weatherUnits={weatherUnits} />
      <div>
        {weatherData &&
          weatherData
            .slice(1, weatherData.length)
            .map((data, index) => (
              <WeekDayCard
                key={index}
                data={data}
                weatherUnits={weatherUnits}
              />
            ))}
      </div>
    </div>
  );
}

export default App;
