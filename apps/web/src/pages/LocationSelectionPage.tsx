import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { registerUserLocation } from '../utils/location';

const LOCATIONS = [
  { id: "seoul_gangnam", label: "서울 강남구", displayName: "서울 강남구" },
  { id: "busan_haeundae", label: "부산 해운대구", displayName: "부산 해운대구" },
];


export const LocationSelectionPage = () => {
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedId) return;

    const selected = LOCATIONS.find((location) => location.id === selectedId);
    if (!selected) return;

    await registerUserLocation(selected.displayName, selected.id);
    localStorage.setItem('user_location', selected.id);

    navigate('/forecast');
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>날씨 정보를 확인할 지역을 선택하세요</h1>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem", marginTop: "1rem" }}
      >
        <option value="">지역 선택</option>
        {LOCATIONS.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.label}
          </option>
        ))}
      </select>

      <br />
      <button
        disabled={!selectedId}
        onClick={handleSubmit}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        확인
      </button>
    </div>
  );
}