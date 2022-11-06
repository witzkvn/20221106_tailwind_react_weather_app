import React, { useEffect, useState } from "react";
import { getEmojis } from "../utils/getEmojis";

const WeekDayCard = ({ data, weatherUnits }) => {
  const [weatherEmojis, setWeatherEmojis] = useState("");
  const [averageTemperature, setAverageTemperature] = useState(0);

  useEffect(() => {
    if (!data) return;

    const avTemp = (
      (data.temperature_2m_max + data.temperature_2m_min) /
      2
    ).toFixed(1);

    const weatherEmojis = getEmojis(
      avTemp,
      data.precipitation_sum,
      data.windspeed_10m_max
    );

    setWeatherEmojis(weatherEmojis);
    setAverageTemperature(avTemp);
  }, [data]);

  if (!data || !weatherUnits) {
    return <div>loading</div>;
  }

  return (
    <div>
      <p>{data.day}</p>
      <div>{weatherEmojis}</div>
      <p>
        {averageTemperature}
        {weatherUnits.temperature}
      </p>
    </div>
  );
};

export default WeekDayCard;
