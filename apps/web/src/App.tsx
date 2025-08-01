import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LocationSelectionPage } from './pages/LocationSelectionPage';
import { ForecastPage } from './pages/ForecastPage';

export default function App() {
  const locationId = localStorage.getItem('user_location');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LocationSelectionPage />} />
        <Route
          path="/forecast"
          element={locationId ? <ForecastPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
