import { createStore } from "redux";

const initialState = {
  cityName: "Hyderabad",
  longitude: 17.4065,  // Corrected field name
  latitude: 78.4772,
};

function reducerFunc(state = initialState, action) {
  switch (action.type) {
    case "CHANGE_CITY":
      return { ...state, cityName: action.payload }; // Update cityName
    
    case "SET_LONGITUDE":  // Corrected action type
      return { ...state, longitude: action.payload };
      
    case "SET_LATITUDE":  // Corrected action type
      return { ...state, latitude: action.payload };

    default:
      return state;    
  }
}

const store = createStore(reducerFunc);

export default store;

export function changeCity(city) {
  return { type: "CHANGE_CITY", payload: city };
}

export function setLongitude(long) {  // Corrected function name
  return { type: "SET_LONGITUDE", payload: long };
}

export function setLatitude(lat) {  // Corrected function name
  return { type: "SET_LATITUDE", payload: lat };
}
