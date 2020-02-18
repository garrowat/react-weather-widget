import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Day from "./components/day";
import {
  convertOpenMapUnixTimeStampToDateInfo,
  exampleWeatherData
} from "./helpers.js";
import "./styles.css";

// eslint-disable-next-line no-unused-vars
const dataEndpoint =
  "https://emuentes.github.io/example/weatherForecastData.json";

export const formatWeatherData = weatherData => {
  return weatherData.map(item => {
    const dateInfo = convertOpenMapUnixTimeStampToDateInfo(item.dt);
    const { weather, main } = item;
    const temps = main;
    return {
      dateInfo,
      temps,
      weather
    };
  });
};

export const groupByDay = weatherData => {
  const weatherByDay = {};
  for (let entry of weatherData) {
    let dayOfWeekName = entry.dateInfo.dayOfWeekName;
    let currentDay = dayOfWeekName;
    if (!weatherByDay[currentDay]) {
      weatherByDay[currentDay] = [entry];
    } else {
      weatherByDay[currentDay].push(entry);
    }
  }
  return weatherByDay;
};

export const getTemps = days => {
  const getMaxForDay = list => {
    return Math.round(Math.max(...list.map(day => day.temps.temp_max)));
  };

  const getMinForDay = list => {
    return Math.round(Math.min(...list.map(day => day.temps.temp_min)));
  };

  const getMostCommonIcon = list => {
    const iconCounter = {};
    let maxOccurrances = 0;
    let mostCommonIcon = "";
    let mostCommonDesc = "";
    for (let entry of list) {
      const icon = entry.weather[0].icon;
      const desc = entry.weather[0].description;
      if (!iconCounter[icon]) {
        iconCounter[icon] = 1;
      } else {
        iconCounter[icon] += 1;
      }
      if (iconCounter[icon] > maxOccurrances) {
        maxOccurrances += 1;
        mostCommonIcon = icon;
        mostCommonDesc = desc;
      }
    }
    return [mostCommonIcon, mostCommonDesc];
  };

  const getKey = list => {
    return `${list[0].dateInfo.dayOfMonthNum}${list[0].dateInfo.monthName}${
      list[0].dateInfo.hours
    }`;
  };

  return Object.keys(days).reduce((temps, day) => {
    const dayEntries = days[day];
    const iconAndDesc = getMostCommonIcon(dayEntries);
    temps.push({
      description: iconAndDesc[1],
      icon: iconAndDesc[0],
      key: getKey(dayEntries),
      label: day.slice(0, 3),
      max: getMaxForDay(dayEntries),
      min: getMinForDay(dayEntries)
    });
    return temps;
  }, []);
};

export default function App() {
  // eslint-disable-next-line no-unused-vars
  const dateInfo = convertOpenMapUnixTimeStampToDateInfo(
    exampleWeatherData.timestamp
  );
  /*
    // *** Properties returned by "dateInfo" ***
    1) dateInfo.dayOfWeekName
       -- example: "Thursday"
    2) dateInfo.dayOfMonthNum
       -- example: "28"
    3) dateInfo.hours
       -- example: "15"
       -- Note: format is 24hr time so "15" is 3pm;
    4) dateInfo.minutes
       -- example: "05"
    5) dateInfo.monthName
       -- example: "February"

    // *** HTML Entity for the "degrees" symbol ***
    // &deg;

    // *** Three letter "day of the week" in JSX ***
    {dateInfo.dayOfWeekName.substr(0, 3)}

    // *** Example Time in JSX ***
    {hours}:{minutes}
    
    // *** Example of the icon image tag in JSX ***
      <img
        alt={openWeatherMapExample.icon.desc}
        src={`http://openweathermap.org/img/w/${
          openWeatherMapExample.icon.code
        }.png`}
      />
    </div>
  */

  const [weatherData, setWeatherData] = useState(false);

  // data formatting helpers

  // async api caller

  const getWeatherData = async endpoint => {
    const response = await fetch(endpoint);
    const data = await response.json();

    const formattedData = formatWeatherData(data.list);
    const dataByDay = groupByDay(formattedData);
    const tempsAndIcon = getTemps(dataByDay);
    console.log({ dataByDay });
    setWeatherData(tempsAndIcon);
  };

  useEffect(() => {
    getWeatherData(dataEndpoint);
  }, []);

  return (
    <div className="App">
      <h1>Hello Candidate!</h1>
      <h2>Our Goal:</h2>
      <img
        alt="weather forecast example"
        src="https://emuentes.github.io/example/weatherWidgetExample.png"
        width="500px"
      />
      <h2>Your Code:</h2>
      <div className="widget">
        {weatherData !== false &&
          weatherData.map(dayData => {
            return <Day dayData={dayData} key={dayData.key} />;
          })}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
