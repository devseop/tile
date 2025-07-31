import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { WeatherIconDisplay } from './components/WeatherIconDisplay';
import { WeatherInfoContainer } from './components/WeatherInfoContainer';
import { LocationSelectionPage } from './pages/LocationSelectionPage';

export default function App() {
  const locationId = localStorage.getItem('user_location');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LocationSelectionPage />} />
        {/* <Route
          path="/forecast"
          element={locationId ? <ForecastPage /> : <Navigate to="/" />}
        /> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
