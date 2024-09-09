import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./App.css";
import { IoSearchSharp } from "react-icons/io5";
import { changeCity, setLongitude, setLatitude } from "./store";

const Cities = () => {
  const [city, setCity] = useState("");
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const getData = async (api) => {
    setLoading(true); // Set loading to true when fetching data
    const response = await fetch(api);
    const data = await response.json();
    const results = data.results.map((each) => ({
      GeonameID: each.geoname_id,
      Name: each.ascii_name,
      CountrynameEN: each.cou_name_en,
      ASCIIName: each.ascii_name,
      Population: each.population,
      DigitalElevationModel: each.dem,
      Timezone: each.timezone,
      CountryCode: each.country_code,
      Coordinates: each.coordinates
        ? `${each.coordinates.lon}, ${each.coordinates.lat}`
        : "N/A",
    }));

    setCities(results);
    setFilteredCities(results);
    setLoading(false); // Set loading to false when data is fetched
  };

  useEffect(() => {
    const api = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100`;
    getData(api);
  }, []);

  useEffect(() => {
    if (city.trim() === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((each) =>
        each.Name.toLowerCase().includes(city.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [city, cities]);

  function changeCityFunc(e) {
    setCity(e.target.value);
  }

  function handleRowClick(cityData) {
    dispatch(changeCity(cityData.Name)); // Update city name in Redux store
    if (cityData.Coordinates !== "N/A") {
      const [lon, lat] = cityData.Coordinates.split(", ");
      dispatch(setLongitude(lon)); // Update latitude in Redux store
      dispatch(setLatitude(lat)); // Update longitude in Redux store
    }
    navigate("/weather"); // Redirect to Weather page
  }

  
  return (
    <div className="cities-container">
      <div className="cities-main-container">
        <div className="nav-bar">
          <div className="heading-container">
            <h1 className="main-heading">INTELLICLICK</h1>
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/day1peihn/image/upload/v1725797389/snow_hm2csb.png"
              alt="logo"
            />
          </div>
        </div>

        <div className="search-bar-container">
          <div className="search-icon-container">
            <IoSearchSharp className="search-icon" />
            <input
              type="text"
              placeholder="Enter country name"
              onChange={changeCityFunc}
              value={city}
            />
          </div>
        </div>

        <div className="cities-data">
          <div className="cities-heading">
            <h1>CITIES DATA</h1>
          </div>

          <div className="main-data">
            {loading ? ( // Check if loading is true
              <p className="paragraph-no-data">Loading...</p> // Show loading message
            ) : filteredCities.length === 0 ? (
              <p className="paragraph-no-data">No data available</p>
            ) : (
              <table className="cities-table">
                <thead>
                  <tr>
                    <th>GeonameID</th>
                    <th>Name</th>
                    <th>Country Name</th>
                    <th>ASCII Name</th>
                    <th>Population</th>
                    <th>Digital Elevation Model</th>
                    <th>Timezone</th>
                    <th>Country Code</th>
                    <th>Coordinates</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCities.map((each) => (
                    <tr
                      key={each.GeonameID}
                      onClick={() => handleRowClick(each)} // Update row click handler
                    >
                      <td>{each.GeonameID}</td>
                      <td>{each.Name}</td>
                      <td>{each.CountrynameEN}</td>
                      <td>{each.ASCIIName}</td>
                      <td>{each.Population}</td>
                      <td>{each.DigitalElevationModel}</td>
                      <td>{each.Timezone}</td>
                      <td>{each.CountryCode}</td>
                      <td>{each.Coordinates}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
