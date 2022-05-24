import React from 'react';

export default React.createContext({
    notifications: [],
    temp:0,
    humidity:0,
    pressure:0,
    lum:0,
    isLoading:0,
    graphLoading:0,
    liveGraph:0,
    setTempUpLimit:(n)=>{},
    setTempLowLimit:(n)=>{},
    setHumidityUpLimit:(n)=>{},
    setHumidityLowLimit:(n)=>{},
    setPressureUpLimit:(n)=>{},
    setPressureLowLimit:(n)=>{},
    setLoadSockets:(n)=>{},
    token: null,
    userId: null,
    login: (token, userId, tokenExpiration, username)=>{},
    logout:()=>{}
});