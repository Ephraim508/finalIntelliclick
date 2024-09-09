import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cities from './Cities';
import Weather from './Weather';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cities />} />
        <Route path="/weather" element={<Weather />} />
      </Routes>
    </Router>

  );
};

export default App;
