import React, { useContext } from "react";

import "./topnav.css";

import { Link, useLocation } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import ThemeMenu from "../thememenu/ThemeMenu";

import AlarmContext from "../../context/alarm-context";


const user_menu = [
      {
          "icon": "bx bx-user",
          "content": "Profile",
          "linkk": "/dashboard"
      },
      {
          "icon": "bx bx-cog",
          "content": "Settings",
          "linkk": "/settings"
      },
      {
          "icon": "bx bx-log-out-circle bx-rotate-180",
          "content": "Logout",
          "linkk": "/logout"
      }
    ]
const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <a href={item.linkk}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
    </a>
    
  </div>
);

const renderUserToggle = () => (
  <div className="topnav__right-user">
    <i className="bx bx-user"></i>
    <div className="topnav__right-user__name">
      Welcome 
      {window.localStorage.getItem("userName")}
    </div>
  </div>
);



function Topnav(props) {
  const contextType = useContext(AlarmContext);
  let location = useLocation();
  const renderUserMenu = (item, index) => (
    <div>
      {(item.linkk==="/logout")?(
        <div>
          <button className="button3" onClick={contextType.logout}>
            <div className="notification-item">
                    
            <i className={item.icon}></i>
            <span>{item.content}</span>
            
            
          </div>
          </button>
        </div>
      ):(
        <Link to={item.linkk} key={index}>
        <div className="notification-item">
          
            
          <i className={item.icon}></i>
          <span>{item.content}</span>
          
          
        </div>
        </Link>
      )}
      
    </div>
    
  );

  return (
    <div className="topnav">
      {props.sideBarActive ? (
        <div className="toggle active">
          <button className="active" onClick={props.onChange}>
            <i className="open">
            <i class='bx bxs-right-arrow'></i>
            </i>
            <i className="close">
            <i class='bx bxs-left-arrow'></i>
            </i>
          </button>
        </div>
      ) : (
        <div className="toggle">
          <button className="" onClick={props.onChange}>
            <i className="open">
            <i class='bx bxs-right-arrow'></i>
            </i>
            <i className="close">
            <i class='bx bxs-left-arrow'></i>
            </i>
          </button>
        </div>
      )}

      <h2>Autonomous Indoor Environment Monitoring System</h2>
        {/* <h4>AIEMS</h4> */}
        <h4><i className="bx bx-location-plus"></i>{location.pathname.slice(1,)}</h4>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle()}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge={contextType.notifications.length}
            contentData={contextType.notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/"></Link>}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
}

export default Topnav;
