import React,{useContext} from 'react'

import { Link, useLocation } from 'react-router-dom'

import './sidebar.css'

import nust from '../../assets/images/Nust.svg'

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import AlarmContext from "../../context/alarm-context";
const SidebarItem = props => {

    const active = props.active ? 'active' : ''
    const sidebarActive = props.sideBarActive ? 'sidebar__item':'sidebar__item2'
    return (
        <div className={`${sidebarActive}`}>
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = (props) => {
    let location = useLocation();
    const activeItem = sidebar_items.findIndex(item => item.route === location.pathname)
    const contextType = useContext(AlarmContext);
    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img src={nust} alt="company logo" />
            </div>
            {
                sidebar_items.map((item, index) => (
                    <div>
                    {(item.route)==="/logout"?(
                    <button className="button3" onClick={contextType.logout}>
                        <SidebarItem
                            title={item.display_name}
                            icon={item.icon}
                            active={index === activeItem}
                            sideBarActive={props.sideBarActive}
                        />
                    </button>
                    ):(
                        <Link to={item.route} key={index}>
                            <SidebarItem
                                title={item.display_name}
                                icon={item.icon}
                                active={index === activeItem}
                                sideBarActive={props.sideBarActive}
                            />
                        </Link>
                    )}
                    
                    </div>
                ))
            }
        </div>
    )
}

export default Sidebar
