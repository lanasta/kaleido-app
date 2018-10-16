import React, { Component } from 'react';

import logo from './logo.svg';

import './App.min.css';

class App extends Component {
  state = {
    consortium: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ consortium: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/consortia');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro">{JSON.stringify(this.state.consortium, null, 2) }</p>
      </div>
    );
  }
}

export default App;
