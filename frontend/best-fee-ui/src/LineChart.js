import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const response1 = await fetch('http://localhost:8080/bitcoin/inputs');

const data1 = await response1.json();

console.log(data1.transactions)

const avgFee = []

const totalFee = []

for(let i = 0; i < data1.transactions.length; i ++)
{
  avgFee.push(data1.transactions[i].avgFee)
  totalFee.push(data1.transactions[i].feeValue)
}

console.log(avgFee);

const LineChart = () => {
  
  const data = [
    { name: 'Total Transaction Fee', data: totalFee },
    { name: 'Average Fee', data: avgFee },
  ];

  useEffect(() => {
    // Optional: You can customize Highcharts here if needed
    // For example, you can set a theme:
    // Highcharts.setOptions({
    //   colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
    //     '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1']
    // });
  }, []);

  function getDatesFromTodayToSevenDaysAgo() {
    let dates = [];
    let today = new Date();
    for (let i = 6; i >= 0; i--) {
      let date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }
  
  let dateRange = getDatesFromTodayToSevenDaysAgo();
  console.log(dateRange);

  // Highcharts configuration options
  const options = {
    title: {
      text: 'Daily Fee Amount'
    },
    xAxis: {
      categories: dateRange
    },
    yAxis: {
      title: {
        text: 'Transaction Fee (BTC)'
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
