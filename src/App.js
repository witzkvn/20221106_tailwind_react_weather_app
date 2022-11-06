import React, { useState, useEffect, useCallback } from "react";
import TodayCard from "./components/TodayCard";
import WeekDayCard from "./components/WeekDayCard";
import { formatWeatherDataDaily } from "./utils/formatWeatherDataDaily";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [weatherUnits, setWeatherUnits] = useState({});
  const [geoLoc, setGeoLoc] = useState({ latitude: 0, longitude: 0 });

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

    if (!navigator.geolocation) {
      window.alert(
        "Votre navigateur ne permet pas la géolocalisation pour utiliser cette application !"
      );
    }

    getGeolocalisation();

    fetchWeather(
      `https://api.open-meteo.com/v1/forecast?latitude=${geoLoc.latitude}&longitude=${geoLoc.longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max&timezone=Europe%2FLondon`
    ).then(() => setIsLoading(false));
  }, [fetchWeather, geoLoc.latitude, geoLoc.longitude]);

  const getGeolocalisation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoc({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError(true);
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen h-max  bg-cyan-600 flex justify-center items-start p-8 md:px-20">
        <p className="text-center">Chargement ...</p>
      </div>
    );
  }

  if (!isLoading && weatherData.length === 0) {
    return (
      <div className="min-h-screen h-max  bg-cyan-600 flex justify-center items-start p-8 md:px-20">
        <p className="text-center">
          Aucune données n'a pu être récupérée. Merci de réessayer.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen h-max  bg-cyan-600 flex justify-center items-start p-8 md:px-20">
        <p className="text-red-500 text-center">
          Une erreur est survenue lors de la récupération des prévisions météo
          ...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-max  bg-cyan-600 flex justify-center items-start p-8 md:px-20 ">
      <div className="w-full max-w-7xl bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg px-4 py-4 xl:py-12 xl:px-28 md:px-12 md:py-8 ">
        <TodayCard data={weatherData[0]} weatherUnits={weatherUnits} />
        <div className=" grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-6">
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
    </div>
  );
}

export default App;
