import React from 'react';
import LineChart from './LineChart';
import Card from './Card';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Highcharts Line Chart</h1>
      <Card/>
      <div className="chart-container">
        <LineChart />
      </div>
    </div>
  );
}

export default App;
