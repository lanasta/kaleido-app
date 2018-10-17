import React, { Component } from 'react';

import logo from './logo.svg';

import './App.scss'; // or `.scss` if you chose scss
import './App.min.css';

class App extends Component {
  state = {
    consortia: '',
    invitations: '',
    memberships: '',
    audits: '',
  };

  componentDidMount() {
    this.getEndpoint("consortia")
      .then(res => this.setState({ consortia: res }))
      .catch(err => console.log(err));

    this.getEndpoint("invitations")
      .then(res => this.setState({ invitations: res }))
      .catch(err => console.log(err));

    this.getEndpoint("memberships")
      .then(res => this.setState({ memberships: res }))
      .catch(err => console.log(err));

    this.getEndpoint("audits")
      .then(res => this.setState({ audits: res }))
      .catch(err => console.log(err));
  }

  getEndpoint = async (endpointName) => {
    const response = await fetch('/' + endpointName);
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
        <p className="App-intro">{JSON.stringify(this.state.consortia, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.invitations, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.memberships, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.audits, null, 4) }</p>
      </div>
    );
  }
}

export default App;
