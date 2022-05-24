import React from 'react'
import io from "socket.io-client";
import servers from "../assets/servers";

function Settings() {
    function sendReset(){
        const socket = io(servers.wsServer, {
            transports: ["websocket", "polling"],
          });
        socket.emit("wifiReset",{value:'reset'});
        console.log('sent');
      }
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <div className="cardd">
                        <h1>Settings</h1>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="cardd">
                    <button class="button2" type="button" onClick={()=>sendReset()}>
                        Disconnect Device
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings

            
            
            