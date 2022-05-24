import React from "react";
import "./statuscard.css";
import AlarmContext from '../../context/alarm-context';
import {Spinner} from '../Spinner/Spinner'

class statusCard extends React.Component {
  state = {
    isLoading: false,
  };
  static contextType = AlarmContext;
  
  render() {
    
    return (
      <div className="">
        <div className="roww">
          <div className="columnn">
            Temperature
            <div className="status-card">
              <div className="status-card__icon">
                <i className="bx bxs-thermometer"></i>
              </div>
              <div className="status-card__info">
              {this.context.isLoading? <><h4>{this.context.temp}</h4><span>C</span></>: <Spinner/>}
                
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
              {this.context.isLoading? <><h4>{this.context.humidity}</h4><span>%</span></>: <Spinner/>}
        
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
              {this.context.isLoading? <><h4>{this.context.lum}</h4><span>Lux</span></>: <Spinner/>}
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
              {this.context.isLoading? <><h4>{this.context.pressure}</h4><span>HPa</span></>: <Spinner/>}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default statusCard;
