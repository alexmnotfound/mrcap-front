import React from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = ({ chartData, chartOptions }) => {
  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="line"
      width="100%"
      height="300" 
    />
  );
};

export default LineChart;
