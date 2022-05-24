import React, { Component } from 'react';
import Papa from 'papaparse'
import csvFile from './data.csv'

class Papaaparse extends Component {

  constructor(props) {
    // Call super class
    super(props);

    // Bind this to function updateData (This eliminates the error)
    this.updateData = this.updateData.bind(this);
  }

  componentWillMount() {

    // Your parse code, but not seperated in a function
    // var csvFilePath = require("da.txt");
    var Papa = require("papaparse/papaparse.min.js");
    Papa.parse(csvFile, {
      header: true,
      download: true,
      skipEmptyLines: true,
      // Here this is also available. So we can call our custom class method
      complete: this.updateData
    });
  }

  updateData(result) {
    const data = result.data;
    // Here this is available and we can call this.setState (since it's binded in the constructor)
    this.setState({data: data}); // or shorter ES syntax: this.setState({ data });
    console.log('data')
    console.log()
  }

  render() {
    // Your render function
    return <div>Data</div>
  }
}

export default Papaaparse;