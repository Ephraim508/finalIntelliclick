import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./App.css";
import { MdOutlineMyLocation } from "react-icons/md";
import MyMapComponent from "./MyMapComponent";
import { CiTempHigh } from "react-icons/ci";
import { useSelector } from "react-redux";

const Weather = () => {
  const data = useSelector((state) => state.cityName);
  const navigate = useNavigate(); // Initialize useNavigate

  const [city, setCity] = useState(data);
  const [temdetails, setTempDetails] = useState([]);
  const [forecast, setForecast] = useState([]); // For 5-day forecast
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

 

  const convertTimestampToDate = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000); // Convert from seconds to milliseconds
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getData = async () => {
    setLoading(true); // Set loading to true
    setError(""); // Clear previous error message
    const apiKey = "a1b07968f1a9f0e18ff8d6886a9444ac"; // Your API key
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;
    const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`;
    try {
      const response = await fetch(api);
      const data = await response.json();
      
      if (data.cod === "404") {
        setError("City Not Found"); // Set error message if city is not found
        setTempDetails([]);
        setForecast([]);
        return;
      }

      const temparatureDetails = {
        temparature: data.main.temp - 273.15,
        humidity: data.main.humidity,
        windspeed: data.wind.speed * 3.6,
        pressure: data.main.pressure,
        sunrise: convertTimestampToDate(data.sys.sunrise, data.timezone),
        sunset: convertTimestampToDate(data.sys.sunset, data.timezone),
        feelslike: data.main.feels_like - 273.15,
      };
      setTempDetails(temparatureDetails);

      const forecastResponse = await fetch(forecastApi);
      const forecastData = await forecastResponse.json();

      const dailyForecast = [];
      for (let i = 0; i < 5; i++) {
        dailyForecast.push({
          minTemp: (forecastData.list[i].main.temp_min - 273.15).toFixed(1),
          maxTemp: (forecastData.list[i].main.temp_max - 273.15).toFixed(1),
          icon: forecastData.list[i].weather[0].icon, // Weather icon
          day: CheckDay(i),
        });
      }
      setForecast(dailyForecast);
    } catch (error) {
      console.error("Fetch error: ", error);
      setError("An error occurred while fetching data."); // Set error message if there's a fetch error
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    if (city) {
      getData();
    }
  }, [city]);

  var d = new Date();
  var weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  function CheckDay(day) {
    if (day + d.getDay() > 6) {
      return weekday[day + d.getDay() - 7];
    } else {
      return weekday[day + d.getDay()];
    }
  }

  const handleTryAgain = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="weather-details-container">
      {loading ? (
        <h1 className="loading-text">Loading...</h1> // Display loading text
      ) : error ? (
        <div className="handle-no-city-data">
          <h1 className="error-text">{error}</h1> 
          <button onClick={handleTryAgain} className="try-again-button">Try Again</button> 
        </div>
      ) : (
        <>
          <div className="weather-city">
            <h1 className="weather-city-heading">{data.toUpperCase()} CITY</h1>
          </div>

          <div className="main-weather-details-container">
            <div className="left-part">
              <h1>Temperature Details</h1>

              <div className="temp-div-main">
                <div className="temp-div">
                  <p>
                    Temp:{" "}
                    {temdetails.temparature
                      ? temdetails.temparature.toFixed(2)
                      : "N/A"}
                    °C
                  </p>
                </div>
                <img
                  src="https://res.cloudinary.com/day1peihn/image/upload/v1725797390/clear_swviry.png"
                  className="temp-image" alt="temp"
                />
              </div>

              <div className="humidity-speed">
                <div className="humidity-div">
                  <p>Humi: {temdetails.humidity}%</p>
                </div>

                <div className="wind-div">
                  <p>
                    wind: {temdetails.windspeed ? temdetails.windspeed.toFixed(2) : "N/A"}
                    km/h
                  </p>
                </div>
              </div>
            </div>

            <div className="right-part">
              <div className="location-icon">
                <MdOutlineMyLocation className="location" />
                <p>Location</p>
              </div>
              <MyMapComponent />
            </div>
          </div>

          <div className="additional-information">
            <div className="sunrise-sunset">
              <div className="sunrise">
                <img
                  src="https://res.cloudinary.com/day1peihn/image/upload/v1725797389/cloud_uvtvbb.png"
                  className="image" alt="sunrise"
                />
                <h1>Sunrise</h1>
                <p>{temdetails.sunrise} AM</p>
              </div>

              <div className="sunrise">
                <img
                  src="https://res.cloudinary.com/day1peihn/image/upload/v1725797389/drizzle_ptcbll.png"
                  className="image" alt="sunset"
                />
                <h1>Sunset</h1>
                <p>{temdetails.sunset} PM</p>
              </div>
            </div>
            <div className="pressure-feelslike">
              <div className="pressure">
                <CiTempHigh className="pressureicon" />
                <h1>Pressure: {temdetails.pressure}hPa</h1>
              </div>

              <div className="feels-like">
                <img
                  src="https://res.cloudinary.com/day1peihn/image/upload/v1725797389/humidity_dp848m.png" alt="feel-like"
                />
                <h1>Feels like: {temdetails.feelslike ? temdetails.feelslike.toFixed(2) : 'N/A'} °C</h1>
              </div>
            </div>
          </div>

          <div className="dayforecasting">
            <div className="upcomingdays">
              <h1 className="forecastind-heading">5 Days Forecasting</h1>
            </div>
            <div className="forecastind-details">
              {forecast.map((day, index) => (
                <div key={index} className="forecasting">
                  <p className="weekname">{day.day}</p>
                  <img
                   src="https://res.cloudinary.com/day1peihn/image/upload/v1725797389/drizzle_ptcbll.png"
                    className="icon-image" alt="cloudy"
                  />
                  <div className="min-max-temp">
                    <div className="min-max-value">
                      <p>Min: {day.minTemp}°</p>
                    </div>
                    <div className="min-max-value">
                      <p>Max: {day.maxTemp}°</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
