import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
    const [statisticsData, setStatisticsData] = useState({
        bestFee: '',
        optimalFee: '',
        size: '',
        virtualSize: '',
        feeAmount: '',
        avgFeeAmount: '',
        inputsCount: '',
        inputsAmount: ''
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:8080/bitcoin/transactions');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const response1 = await fetch('http://localhost:8080/bitcoin/inputs');

            const data1 = await response1.json();
            setStatisticsData({
              bestFee: `${data.best_fee.toFixed(2)} s/vByte`,
              optimalFee: `${data.best_fee.toFixed(2)} / ${data.avg_fee.toFixed(2)}`,
              size: `${data.avg_size} Mb`,
              virtualSize: `${data.avg_v_size} vMb`,
              feeAmount: `${data1.transactions[data1.transactions.length - 1].feeValue.toFixed(2)} BTC`,
              avgFeeAmount: `${data1.transactions[data1.transactions.length - 1].avgFee} BTC`,
              inputsCount: `${data1.inputs[data1.inputs.length - 1].count}`,
              inputsAmount: `$ ${data1.inputs[data1.transactions.length - 1].value.toFixed(2)}`
            });
          } catch (error) {
            console.error("Could not fetch statistics", error);
          }
    };

    fetchData();
  }, []);

  return (
    <div className="statistics-container">
      <div className="statistics-item">
        <strong>Best fee:</strong> {statisticsData.bestFee}
      </div>
      <div className="statistics-item">
        <strong>Optimal fee:</strong> {statisticsData.optimalFee}
      </div>
      <div className="statistics-item">
        <strong>Size:</strong> {statisticsData.size}
      </div>
      <div className="statistics-item">
        <strong>Virtual size:</strong> {statisticsData.virtualSize}
      </div>
      <div className="statistics-item">
        <strong>Total Fee amount:</strong> {statisticsData.feeAmount}
      </div>
      <div className="statistics-item">
        <strong>Avg Fee amount:</strong> {statisticsData.avgFeeAmount}
      </div>
      <div className="statistics-item">
        <strong>Total Inputs count:</strong> {statisticsData.inputsCount}
      </div>
      <div className="statistics-item">
        <strong>Total Inputs amount:</strong> {statisticsData.inputsAmount}
      </div>
    </div>
  );
};

export default Statistics;