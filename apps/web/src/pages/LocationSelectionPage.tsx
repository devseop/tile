import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getGeoLocation,
  dfsXYConv,
  getDistrictName,
  registerUserLocation,
  getUserXYCoords,
} from '../utils/location';

interface UserCoordsProps {
  districtName: string | null;
  nx: number | null;
  ny: number | null;
}

export const LocationSelectionPage = () => {
  const [userCoords, setUserCoords] = useState<UserCoordsProps | null>({
    districtName: null,
    nx: null,
    ny: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { name, x, y } = await getUserXYCoords();
        
        setUserCoords({
          districtName: name,
          nx: x,
          ny: y
        })
      } catch (err) {
        console.error("위치 추적 실패:", err);
        setUserCoords(null)
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleSubmit = async () => {
    if (!userCoords?.districtName) return;

    await registerUserLocation(userCoords.districtName);
    localStorage.setItem('user_location', JSON.stringify(userCoords));
    navigate('/forecast');
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>🔍 위치를 확인 중입니다...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>현재 위치: {userCoords?.districtName ?? "확인 실패"}</h1>

      <button
        onClick={handleSubmit}
        disabled={!userCoords?.districtName}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        확인
      </button>
    </div>
  );
};
