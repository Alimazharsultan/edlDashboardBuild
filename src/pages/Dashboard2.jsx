// Display Simple values from mqtt

import React, { useEffect, useState, useContext} from "react";
import CardsLayout from "../components/status-card/StatusCard";
import { useSelector, useDispatch } from "react-redux";
import ThemeAction from "../redux/actions/ThemeAction";
import GeneralGraph from "../components/plotGraphs/generalGraph";
import InputFields from "../components/inputFields/inputFields";
import AlarmContext from "../context/alarm-context";
import { Spinner } from "../components/Spinner/Spinner";
import io from "socket.io-client";
import servers from '../assets/servers'
// const socket = io("http://localhost:4002", {
//   transports: ["websocket", "polling"],
// });
// "https://aiem-wsocket.herokuapp.com/"
const socket = io(servers.wsServer, {
  transports: ["websocket", "polling"],
});
function Dashboard2() {
  const contextType = useContext(AlarmContext);
  // const [tempUpperLimit, setTempUpperLimit] = useState(50)
  const themeReducer = useSelector((state) => state.ThemeReducer.mode);
  const [timeData, setTimeData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [luminanceData, setLuminanceData] = useState([]);
  const [pressureData, setPressureData] = useState([])
  const [graphLoading, setGraphLoading] = useState(false);
  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState('Na');
  const [pressure, setPressure] = useState('Na');
  const [lum, setLum] = useState('Na');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    // Update the document title using the browser API
    socket.on("EDL_0002", (cpuPercent) => {
        // if(location.pathname==="/datalog"){
        //   console.log('data log open');
        // }
        
        if(cpuPercent.value==='NaN'){
          setIsLoading(false);
        }else{
          setTemp(cpuPercent.temp);
        setHumidity(cpuPercent.humidity);
        setPressure(cpuPercent.pressure);
        setLum(cpuPercent.lum);
          setIsLoading(true);
        }
    });
  },[]);
  useEffect(() => {
    
    const interval = setInterval(() => {
      console.log('interval')
      if(isLoading){
        var incomingDate = new Date();
        console.log(incomingDate.getHours());
        console.log(incomingDate.getMinutes());
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
          setTemperatureData((p)=>[...p,temp])
          setHumidityData((p)=>[...p,humidity ])
          setLuminanceData((p)=>[...p,lum])
          setGraphLoading(true);
          // setPressureData((p)=>[...p,+contextType.pressure])
          console.log('new value added at '+incomingDate);
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
      
      <div className="roww">
          <div className="columnn">
            Temperature
            <div className="status-card">
              <div className="status-card__icon">
                <i className="bx bxs-thermometer"></i>
              </div>
              <div className="status-card__info">
              {isLoading? <><h4>{temp}</h4><span>C</span></>: <Spinner/>}
                
              </div>
              {/* <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...tempChartOptions,
                                theme: {mode: 'dark'}
                            }:{
                                ...tempChartOptions,
                                theme: {mode: 'white'}
                            }}
                            series={tempChartSeries}
                            type='line'
                            height= '100%'
                        /> */}
            </div>
          </div>
          <div className="columnn">
            Humidity
            <div className="status-card">
              <div className="status-card__icon">
                <i className="bx bx-droplet"></i>
              </div>
              <div className="status-card__info">
              {isLoading? <><h4>{humidity}</h4><span>%</span></>: <Spinner/>}
        
              </div>
            </div>
          </div>
          <div className="columnn">
            Luminance
            <div className="status-card">
              <div className="status-card__icon">
                <i className="bx bx-bulb"></i>
              </div>
              <div className="status-card__info">
              {isLoading? <><h4>{lum}</h4><span>Lux</span></>: <Spinner/>}
              </div>
            </div>
          </div>
          <div className="columnn">
            Pressure
            <div className="status-card">
              <div className="status-card__icon">
                <i className="bx bx-anchor"></i>
              </div>
              <div className="status-card__info">
              {isLoading? <><h4>{pressure}</h4><span>HPa</span></>: <Spinner/>}
                
              </div>
            </div>
          </div>
        </div>
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

export default Dashboard2;
