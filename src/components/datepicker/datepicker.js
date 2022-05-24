import React,{useState} from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
export const Datepicker = (props) => {
  
  return (
    <DatePicker selected={props.date} onChange={(date) => props.recieveDate(date)} />
  );
};