import { useEffect, useState } from "react";
import Sidebarr from "../sidebar/Sidebar";
import TopNav from "../topnav/TopNav";
import Pagelinks from "../Pagelinks";
import "./layout.css";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import ThemeAction from "../../redux/actions/ThemeAction";
import AlarmContext from "../../context/alarm-context";
import servers from '../../assets/servers';
import AuthPage from "../../pages/Auth";

const socket = io(servers.wsServer, {
  transports: ["websocket", "polling"],
});
function Layout(props) {
  
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  
  function login (token, userId, tokenExpiration, username){
    setToken(token);
    setUserId(userId);
    window.localStorage.setItem('userName', username)
  }
  function logout(){
    setToken(null);
    setUserId(null);
    window.localStorage.removeItem('userName');
  }

  const [notifications, setNotificatoins] = useState([]);
  const [tempUpLimit, setTempUpLimit] = useState(50);
  const [tempLowLimit, setTempLowLimit] = useState(10);
  const [humidityUpLimit, setHumidityUpLimit] = useState(100);
  const [humidityLowLimit, setHumidityLowLimit] = useState(0);
  const [pressureUpLimit, setPressureUpLimit] = useState(1500);
  const [pressureLowLimit, setPressureLowLimit] = useState(10);


  const [temp, setTemp] = useState(25);
  const [humidity, setHumidity] = useState('Na');
  const [pressure, setPressure] = useState('Na');
  const [lum, setLum] = useState('Na');

  const [isLoading, setIsLoading] = useState(false);
  const [sideBarActive, setSideBarActive] = useState(true)
  // function incomingNotifications(n) {
  //   setNotificatoins((prevArray) => [...prevArray, n]);
  //   setHumidityLowLimit(0);
  //       console.log("set Humidity low limit: "+humidityLowLimit);
  // }

  const themeReducer = useSelector((state) => state.ThemeReducer);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const themeClass = localStorage.getItem("themeMode", "theme-mode-light");

    const colorClass = localStorage.getItem("colorMode", "theme-mode-light");

    dispatch(ThemeAction.setMode(themeClass));

    dispatch(ThemeAction.setColor(colorClass));
    
    socket.on("cpu", (cpuPercent) => {
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
    let currentDateTime = Date().toLocaleString();
    if(isLoading){
      if (temp > tempUpLimit && temp!==0) {
        setTempUpLimit(50);
        // console.log(tempUpLimit);
        setNotificatoins((prevArray) => [...prevArray, {
          icon: "bx bx-error",
          content:
            "Temp "+ temp +" Higher Than " + tempUpLimit + " C at " + currentDateTime,
        }]);
      }
      if (temp < tempLowLimit && temp!==0) {
        setTempLowLimit(10);
        setNotificatoins((prevArray) => [...prevArray, {
          icon: "bx bx-error",
          content:
            "Temp "+ temp +" Lower Than " + tempLowLimit + " C at " + currentDateTime,
        }]);
        
      }
      if (humidity < humidityLowLimit && humidity!==0) {
        setHumidityLowLimit(10);
        setNotificatoins((prevArray) => [...prevArray, {
          icon: "bx bx-error",
          content:
            "humidity "+ humidity +" Lower Than " +
            humidityLowLimit +
            " % at " +
            currentDateTime,
        }]);
        
      }
      if (humidity > humidityUpLimit && humidity!==0) {
        setHumidityUpLimit(70);
        setNotificatoins((prevArray) => [...prevArray, {
          icon: "bx bx-error",
          content:
            "humidity "+ humidity +" Higher Than " +
            humidityUpLimit +
            " % at " +
            currentDateTime,
        }]);
      
      
      }
      if (pressure < pressureLowLimit && pressure!==0) {
        setPressureLowLimit(900);
        setNotificatoins((prevArray) => [...prevArray, {
          icon: "bx bx-error",
          content:
            "Pressure "+ pressure +" Lower Than " +
            pressureLowLimit +
            " HPa at " +
            currentDateTime,
        }]);
    
      }
      if (pressure > pressureUpLimit && pressure!==0) {
        setPressureUpLimit(1000);
        setNotificatoins((prevArray) => [...prevArray, {
          icon: "bx bx-error",
          content:
            "Pressure "+ pressure +" Higher Than " +
            pressureUpLimit +
            " HPa at " +
            currentDateTime,
        }]);
      }
    }
  }, [
    dispatch,
    temp,
    isLoading,
    tempLowLimit,
    tempUpLimit,
    humidity,
    humidityLowLimit,
    humidityUpLimit,
    pressure,
    pressureUpLimit,
    pressureLowLimit,
    setTempUpLimit,
    setTempLowLimit,
    setHumidityLowLimit,
    setHumidityUpLimit,
    setPressureUpLimit,
    setPressureLowLimit
  ]);
  
  function sidebarChange(){
    
    setSideBarActive(!sideBarActive);
    if(sideBarActive){
      document.documentElement.style.setProperty('--sidebar-width','50px');
    }else{
      document.documentElement.style.setProperty('--sidebar-width','300px');
    }
  };
  const loggedInUser = window.localStorage.getItem("userName");
  
  return (
    <AlarmContext.Provider
      value={{
        notifications: notifications,
        tempUpLimit: tempUpLimit,
        tempLowLimit: tempLowLimit,
        humidityUpLimit: humidityUpLimit,
        humidityLowLimit: humidityLowLimit,
        pressureUpLimit: pressureUpLimit,
        pressureLowLimit: pressureLowLimit,
        temp: temp,
        humidity: humidity,
        pressure: pressure,
        lum: lum,
        isLoading: isLoading,
        token: token, 
        userId: userId,
        login: login, 
        logout: logout,
        setTempUpLimit:setTempUpLimit,
        setTempLowLimit: setTempLowLimit,
        setHumidityLowLimit: setHumidityLowLimit,
        setHumidityUpLimit: setHumidityUpLimit,
        setPressureLowLimit: setPressureLowLimit,
        setPressureUpLimit: setPressureUpLimit,
      }}
    >
      {loggedInUser && <BrowserRouter>
        <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
        {loggedInUser && <Sidebarr sideBarActive={sideBarActive} />} 
          <div className="layout__content">
          {loggedInUser && <TopNav sideBarActive={sideBarActive} onChange={()=>{sidebarChange()}}/>} 
            
            <div className="layout__content-main">
              <Pagelinks />
            </div>
          </div>
        </div>
      </BrowserRouter>}

      {!loggedInUser && 
      <AuthPage/>
      }
      
    </AlarmContext.Provider>
  );
}
export default Layout;
