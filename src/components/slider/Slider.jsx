import React,{useState, useEffect, useLayoutEffect, useContext} from "react";
import './Slider.css'
import AlarmContext from "../../context/alarm-context";


const thumbsize = 10
const Slider = ({ min, max , value}) => {
    const contextType = useContext(AlarmContext) ;
    const [fullWidth, setFullWidth] = useState(window.innerWidth);
    const [avg, setAvg] = useState((min + max) / 2);
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    
    const checkSize = () => {
        setFullWidth(window.innerWidth);
      };
      
    useEffect(() => {
        window.addEventListener('resize', checkSize);
        return () => {
          window.removeEventListener('resize', checkSize);
        };
      }, []);

    const width = (fullWidth+200)/7;
    const minWidth =
      thumbsize + ((avg - min) / (max - min)) * (width - 2 * thumbsize);
    const minPercent = ((minVal - min) / (avg - min)) * 100;
    const maxPercent = ((maxVal - avg) / (max - avg)) * 100;
    const styles = {
      min: {
        width: minWidth,
        left: 0,
        "--minRangePercent": `${minPercent}%`
      },
      max: {
        width: thumbsize + ((max - avg) / (max - min)) * (width - 2 * thumbsize),
        left: minWidth,
        "--maxRangePercent": `${maxPercent}%`
      }
    };
  
    useLayoutEffect(() => {
      setAvg((maxVal + minVal) / 2);
    }, [minVal, maxVal]);
  
  
    return (
      <div className="carddd">

      <p style={{marginBottom:"20px"}}>Min value:{parseInt(minVal)}  Max value: 
         {parseInt(maxVal)}</p>
      <div
        className="min-max-slider"
        data-legendnum="2"
        data-rangemin={min}
        data-rangemax={max}
        data-thumbsize={thumbsize}
        data-rangewidth={width}
      >
        <label htmlFor="min">{minVal}</label>
        <input
          id="min"
          className="min"
          style={styles.min}
          name="min"
          type="range"
          step="1"
          min={min}
          max={avg}
          value={minVal}
          onChange={({ target }) => {
              if(value==="Temp"){
                  contextType.setTempLowLimit(parseInt(target.value))
              }
              if(value==="Humidity"){
                contextType.setHumidityLowLimit(parseInt(target.value))
              }
              if(value==="Pressure"){
                contextType.setPressureLowLimit(parseInt(target.value))
              }
            setMinVal(Number(target.value))
          }}
        />
        <label htmlFor="max">Maximum price</label>
        <input
          id="max"
          className="max"
          style={styles.max}
          name="max"
          type="range"
          step="1"
          min={avg}
          max={max}
          value={maxVal}
          onChange={({ target }) => {
            if(value==="Temp"){
                contextType.setTempUpLimit(parseInt(target.value))
            }
            if(value==="Humidity"){
              contextType.setHumidityUpLimit(parseInt(target.value))
            }
            if(value==="Pressure"){
              contextType.setPressureUpLimit(parseInt(target.value))
            }
              setMaxVal(Number(target.value))
            }}
        />
      </div>
     
      </div>
    );
  };

  export default Slider;