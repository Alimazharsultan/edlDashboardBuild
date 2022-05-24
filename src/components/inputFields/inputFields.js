import React,{useState} from "react";
import Slider from '../slider/Slider'
import './inputFields.css'
import io from "socket.io-client";
import servers from "../../assets/servers";
function InputFields() {
  function sendIntervall(args){
    const socket = io(servers.wsServer, {
        transports: ["websocket", "polling"],
      });
      if(args>0 && args<3600){
        socket.emit("interval",{value:+args});
      }
    
    
  }
  const [interval, setInterval] = useState(10);
  return (
    <div>
      <div className="roww">
        <div className="columnn">
          <div className="cardd">
            <h1 style={{marginBottom:"20px"}} >Temp Range</h1>
            <Slider min={16} max={41} value="Temp"/>
          </div>
        </div>
        <div className="columnn">
          <div className="cardd">
            <h1 style={{marginBottom:"20px"}} >Humidity Range</h1>
            <Slider min={10} max={71} value="Humidity"/>
          </div>
        </div>
        <div className="columnn">
          <div className="cardd">
            <h1 style={{marginBottom:"20px"}} >Pressure Range</h1>
            <Slider min={900} max={1001} value="Pressure"/>
          </div>
        </div>
        <div className="columnn">
          <div className="cardd">
            <label>Interval Time  1 to 3600 (seconds):
              <input type="text" value={interval} onChange={(e)=>setInterval(e.target.value)}/>
              <button className="button2" type="button" onClick={()=>sendIntervall(interval)}>
                Send
              </button>
            </label>
          </div>
        </div>
        
      </div>
         
    </div>
  );
}

export default InputFields;
