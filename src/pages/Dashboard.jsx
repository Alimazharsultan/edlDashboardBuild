// Display Simple values from mqtt

import React, { useEffect, useState, useContext} from "react";
import CardsLayout from "../components/status-card/StatusCard";
import { useSelector, useDispatch } from "react-redux";
import ThemeAction from "../redux/actions/ThemeAction";
import GeneralGraph from "../components/plotGraphs/generalGraph";
import InputFields from "../components/inputFields/inputFields";
import AlarmContext from "../context/alarm-context";
import servers from '../assets/servers';

function Dashboard() {
  const contextType = useContext(AlarmContext);
  // const [tempUpperLimit, setTempUpperLimit] = useState(50)
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  const [timeData, setTimeData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [luminanceData, setLuminanceData] = useState([]);
  const [pressureData, setPressureData] = useState([])
  const [graphLoading, setGraphLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    
    const interval = setInterval(() => {
      // console.log('interval')
      if(contextType.isLoading){
        var incomingDate = new Date();
        if(incomingDate.getHours()==24 && incomingDate.getMinutes()==0){
          setTimeData([]);
        setTemperatureData([]);
        setHumidityData([]);
        setLuminanceData([]);
        // setPressureData(pressure);
        setGraphLoading(false); 
        }else{
          incomingDate = incomingDate.setHours(incomingDate.getHours()+5);
          incomingDate = new Date(incomingDate).toISOString();
          setTimeData((prevArray) => [...prevArray, incomingDate]);
          setTemperatureData((p)=>[...p,+contextType.temp])
          setHumidityData((p)=>[...p,+contextType.humidity ])
          setLuminanceData((p)=>[...p,+contextType.lum])
          setGraphLoading(true);
          // setPressureData((p)=>[...p,+contextType.pressure])
          // console.log('new value added at '+incomingDate);
        }
        
      }
        
      }, 5000);
      
      return () => window.clearInterval(interval);
  }, [contextType.isLoading,contextType.temp, contextType.lum]);
  useEffect(() => {
    var today = new Date();
    today = new Date(today).toISOString()
    var yesterday = new Date();
    yesterday=yesterday.setDate(yesterday.getDate()-1)
    yesterday = new Date(yesterday).toISOString()

    // console.log('yesterday: '+yesterday);
    // console.log('today: '+today)
    
    
      const requestBody = {
        query: `
          query{
            events(cutoff1:"${yesterday}",cutoff2:"${today}") {
              readingtime
              temperature
              humidity
              altitude
            }
          }
          `
      };
      // http://localhost:8000/graphql
      // https://aiems-dashboard.herokuapp.com/graphql
      fetch(servers.gqServer, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        
        var time= []
        var temp= []
        var humidity = []
        var luminance = []
        // var pressure = []
        // console.log(resData.data.events.length)
        for(let i = 0; i < resData.data.events.length; i+=50) {
              try{
                var incomingDate = new Date(resData.data.events[i].readingtime);
              incomingDate = incomingDate.setHours(incomingDate.getHours()+5);
              
              incomingDate = new Date(incomingDate).toISOString();
              
              time.push(incomingDate);
              temp.push(resData.data.events[i].temperature);
              humidity.push(resData.data.events[i].humidity);
              luminance.push(resData.data.events[i].altitude);
              // setTimeData((prevArray) => [...prevArray, incomingDate]);
              // setTemperatureData((p)=>[...p,+resData.data.events[i].temperature])
              // setHumidityData((p)=>[...p,+resData.data.events[i].humidity ])
              // setLuminanceData((p)=>[...p,+resData.data.events[i].altitude])
              
              // pressure.push(+resData.data.events[i].pressure);
              }catch{
                continue;
              }
        }
        // console.log(time.length);
        setTimeData(time);
        setTemperatureData(temp);
        setHumidityData(humidity);
        setLuminanceData(luminance);
        // setPressureData(pressure);
        setGraphLoading(true); 
        
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="dashboard">
      
      <CardsLayout />
      <div className="roww">
      <div className="card">
              {themeReducer === "theme-mode-dark" ? (
                <GeneralGraph graphLoading={graphLoading} timeData={timeData} pressureData={pressureData} temperatureData={temperatureData} humidityData={humidityData} luminanceData={luminanceData} themeColor="dark" />
              ) : (
                <GeneralGraph graphLoading={graphLoading} timeData={timeData} pressureData={pressureData} temperatureData={temperatureData} humidityData={humidityData} luminanceData={luminanceData} themeColor="light" />
              )}
            </div>
      </div>
      
      <InputFields/>
    </div>
  );
}

export default Dashboard;
