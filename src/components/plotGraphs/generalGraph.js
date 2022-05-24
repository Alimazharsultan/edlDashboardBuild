import React from "react";
import Chart from "react-apexcharts";
import {Spinner} from '../Spinner/Spinner';
export default (props) => {
  const seriess = [
    {
      name: "Temperature",
      data: props.temperatureData,
    },
    {
      name: "Humidity",
      data: props.humidityData,
      style: {
        color: "#FF1654"
      }
    },
    
    {
      name: "Luminance",
      data: props.luminanceData,
    },
    // {
    //   name: "Pressure",
    //   data: props.pressureData,
    // },
  ]
  const optionss = {
    colors: ["#fb0b12", "#019707","#349eff","#10d4d2"],
    chart: {
      type:"line",
      animations: {
        easing: "linear",
        dynamicAnimation: {
          speed: 500
        }
      },
      
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    yaxis:[
      {
        
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#019707"
        },
        labels: {
          style: {
            colors: "#019707"
          }
        },
        title: {
          text: "Temperature/Humidity",
          style: {
            color: "#019707"
          }
        }
      },
      {
        show: false
      },
      {
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#247BA0"
        },
        labels: {
          style: {
            colors: "#247BA0"
          }
        },
        title: {
          text: "Luminance",
          style: {
            color: "#247BA2"
          }
        }
      },
    ],
    tooltip: {
      x: {
        format: "yyyy/MM/dd HH:mm:ss"
      }
    },
    xaxis: {
      type: "datetime",
      categories: props.timeData
    },
  };
  return (
  <div id="chart">
        {props.graphLoading ? (
         <Chart
         options={{
           ...optionss,
           theme: { mode: props.themeColor },
         }}
         series={seriess}
         type="line"
         height="255"
       />
        ): (
          <Spinner/>
          )
        }
      </div>
  );
};
