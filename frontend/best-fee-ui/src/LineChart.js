import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const LineChart = () => {
  // Sample data for the chart
  const data = [
    { name: 'Tokyo', data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2] },
    { name: 'New York', data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8] },
    { name: 'Berlin', data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6] },
    { name: 'London', data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0] }
  ];

  useEffect(() => {
    // Optional: You can customize Highcharts here if needed
    // For example, you can set a theme:
    // Highcharts.setOptions({
    //   colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
    //     '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
    // });
  }, []);

  // Highcharts configuration options
  const options = {
    title: {
      text: 'Monthly Average Temperature'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    yAxis: {
      title: {
        text: 'Temperature (°C)'
      }
    },
    series: data
  };

  return (
    <div className="chart-container">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default LineChart;
