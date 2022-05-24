import React, {useState, useEffect} from 'react'
import Table from '../components/table/Table'
import {Spinner} from '../components/Spinner/Spinner';
import { Datepicker } from '../components/datepicker/datepicker';
import servers from '../assets/servers';
import { CSVLink } from 'react-csv'
const customerTableHead =[
    
    'Time',
    'Temp (C)',
    'Humidity (%)',
    'Luminance (Lux)',
    'Pressure (Hpa)',
]

const renderHead = (item, index) => <th key={index}>{item}</th>

function renderBody(item, index) {
    // let datetime = new Date(item.readingtime);
    // let time = datetime.toLocaleTimeString('en',
    // { timeStyle: 'long', hour12: true });
    // let date = datetime.toLocaleDateString('en');
    // datetime = date+ " " +time.slice(0,-5)
    return(
        
            <tr key={index}>
                    
                    <td>{item.DateTime}</td>
                    <td>{item.Temperature}</td>
                    <td>{item.Humidity}</td>
                    <td>{item.Luminance}</td>
                    <td>{item.Pressure}</td>

                </tr>
    );
    
}

function Datalog() {
    
    function recieveDate(d){
         setDate(date);
        // console.log('date recieved' + date);
        
        let d1 = d
        
        d1=d1.setHours(0,0,0,0);
        let d2=new Date(d1).setDate(new Date(d1).getDate()+1);
        setDataExport(d2+'.csv');
        d1 = new Date(d1).toISOString();
        
       
        d2 = new Date(d2).toISOString();
        
        setDataLoading(false); 
        const requestBody = {
            query: `
              query{
                events(cutoff1:"${d1}",cutoff2:"${d2}") {
                    _id
                    readingtime
                    temperature
                    humidity
                    altitude
                    pressure
                    
                }
              }
              `
          };
          // http://localhost:8000/graphql
          // https://aiems-dashboard.herokuapp.com/graphql
          fetch(servers.gqHeroku, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            // console.log(resData.data.events);
            
            
            var dataSingle = [];
            for(let i=0; i<resData.data.events.length; i++){
              let datetime = new Date(resData.data.events[i].readingtime);
              let time = datetime.toLocaleTimeString('en',
              { timeStyle: 'long', hour12: true });
              let date = datetime.toLocaleDateString('en');
              datetime = date+ " " +time.slice(0,-5)
              let value= {
                DateTime:datetime, 
                Temperature: resData.data.events[i].temperature,
                Humidity: resData.data.events[i].humidity,
                Luminance: resData.data.events[i].altitude,
                Pressure: resData.data.events[i].pressure
              }
              
              dataSingle.push(value);
            }
            setDataSet(dataSingle);
            setDataLoading(true); 
            
            
          })
          .catch(err => {
            console.log(err);
          });

    }
    const [date, setDate] = useState(new Date());
    const [dataLoading, setDataLoading] = useState(false);
    const [dataSet, setDataSet] = useState([]);
    const [dataExport, setDataExport] = useState('');
    useEffect(() => {
        var today = new Date();
        today = new Date(today).toISOString()
        
        var yesterday= new Date();
        yesterday = yesterday.setHours(0,0,0,0);
        yesterday = new Date(yesterday).toISOString()
        
          const requestBody = {
            query: `
              query{
                events(cutoff1:"${yesterday}",cutoff2:"${today}") {
                    _id
                    readingtime
                    temperature
                    humidity
                    altitude
                    pressure
                    
                }
              }
              `
          };
          // http://localhost:8000/graphql
          // https://aiems-dashboard.herokuapp.com/graphql
          fetch(servers.gqHeroku, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            // console.log(resData.data.events);
            var dataSingle = [];
            for(let i=0; i<resData.data.events.length; i++){
              let datetime = new Date(resData.data.events[i].readingtime);
              let time = datetime.toLocaleTimeString('en',
              { timeStyle: 'long', hour12: true });
              let date = datetime.toLocaleDateString('en');
              datetime = date+ " " +time.slice(0,-5)
              let value= {
                DateTime:datetime, 
                Temperature: resData.data.events[i].temperature,
                Humidity: resData.data.events[i].humidity,
                Luminance: resData.data.events[i].altitude,
                Pressure: resData.data.events[i].pressure
              }
              
              dataSingle.push(value);
            }
            setDataSet(dataSingle);
            setDataLoading(true); 
            
          })
          .catch(err => {
            console.log(err);
          });
      }, []);
    return (
        <div >
            <div className="roww">
                <div className="columnn">
                  <Datepicker date={date} recieveDate={(date)=>recieveDate(date)}/>
                </div>
                <div className="columnn">
                  {dataLoading && <button button class="button2" type="button">
                      <CSVLink data={dataSet} filename={dataExport}>Export</CSVLink>
                  </button>}
                  
                </div>
                
            </div>
                
            
            {
            dataLoading?(
                <div className="row">
                <div className="col-12">
                
                    <div className="card">
                    
                        <div className="card__body">
                        
                            <Table 
                                limit='60'
                                headData = {customerTableHead}
                                renderHead = {(item, index) => renderHead(item, index)}
                                bodyData={dataSet}
                                renderBody={(item, index)=> renderBody(item,index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            ):(
                <Spinner/>
                
            )
            }
            
        </div>
    )
}

export default Datalog
