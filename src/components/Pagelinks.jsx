import React,{useContext} from 'react'

import {Route, Routes, Navigate} from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
// import Customers from '../pages/Customers'
import NotFound from '../pages/notFound';
import Comingsoon from '../pages/comingsoon'
import AlarmContext from "../context/alarm-context";
import Datalog from "../pages/datalog";
import Dashboard2 from '../pages/Dashboard2';
import Settings from '../pages/settings';
function Pagelinks() {
    const contextType = useContext(AlarmContext);
    const loggedInUser = window.localStorage.getItem("userName");
    return (
        <div>
            
            <Routes>
                <Route path="/logout" element={<Navigate to="/auth"/>} render={()=>contextType.logout()}/>
                <Route path="/notfound" element={<NotFound/>} />
                
                {loggedInUser && <Route path="/AIEMS_lab" element={<Dashboard/>}/>}
                {loggedInUser && <Route path="/data_center" element={<Dashboard2/>}/>}
                {loggedInUser && <Route path="/datalog" element={<Datalog/>}/>}
                {loggedInUser && <Route path="/dashboard2" element={<Comingsoon/>}/>}
                {loggedInUser && <Route path="/dashboard3" element={<Comingsoon/>}/>}
                {loggedInUser && <Route path="/analytics" element={<Comingsoon/>}/>}
                {loggedInUser && <Route path="/settings" element={<Settings/>}/>}
                {loggedInUser && <Route path="/" element={<Dashboard/>}/>}
                {loggedInUser && <Route path="/auth" element={<Navigate to="/AIEMS_lab"/>}/>}
                
                
                <Route path="*" element={<Navigate to="/notfound" />} />
                
            </Routes>
        </div>
    )
}

export default Pagelinks