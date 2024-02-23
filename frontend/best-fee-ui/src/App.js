import React from 'react';
import LineChart from './LineChart';
import Statistics from './Statistics'
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Best fee Pool Statistics For Today</h1>
      <Statistics />
      <h2>Last 7 days Bitcoin Transaction data</h2>
      <div className="chart-container">
        <LineChart />
      </div>
    </div>
  );
}

export default App;
