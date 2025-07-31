
import React, { useState } from 'react';

const TimeSelectionPage: React.FC = () => {
  const [morning, setMorning] = useState('08:00');
  const [lunch, setLunch] = useState('12:00');
  const [dinner, setDinner] = useState('18:00');

  const handleSave = () => {
    // TODO: 선택된 시간을 저장하는 로직 추가
    console.log('저장된 시간:', { morning, lunch, dinner });
  };

  const renderTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        const time = `${hour}:${minute}`;
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>알림 시간 설정</h1>
      <div>
        <label>아침: </label>
        <select value={morning} onChange={(e) => setMorning(e.target.value)}>
          {renderTimeOptions()}
        </select>
      </div>
      <div>
        <label>점심: </label>
        <select value={lunch} onChange={(e) => setLunch(e.target.value)}>
          {renderTimeOptions()}
        </select>
      </div>
      <div>
        <label>저녁: </label>
        <select value={dinner} onChange={(e) => setDinner(e.target.value)}>
          {renderTimeOptions()}
        </select>
      </div>
      <button onClick={handleSave} style={{ marginTop: '20px' }}>저장</button>
    </div>
  );
};

export default TimeSelectionPage;
