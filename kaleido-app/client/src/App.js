import React, { Component } from 'react';
import Parser from 'html-react-parser';

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
      .then(res => this.setState({ audits: res.reverse() }))
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
    let actionPhrase = {
      "create" : "Created",
      "update" : "Updated",
      "delete" : "Deleted"
    }
    let auditLogs = [];
    for (var i in this.state.audits){
      var audit = this.state.audits[i];
      auditLogs.push(<li>{Parser("At " + (new Date(audit.timestamp)).toLocaleString() + ": ")}{actionPhrase[audit.action]}{Parser(logMessageBuilder(audit.objectType, audit.data))} </li>);
    }
    console.log(auditLogs);


    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro">{JSON.stringify(this.state.consortia, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.invitations, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.memberships, null, 2) }</p>
        <div className="App-intro">{auditLogs}</div>
      </div>
    );
  }
}

function logMessageBuilder(objectType, data){
  if (objectType == 'consortia'){
    return " consortia <b>" + data.name + "</b> owned by <b>" + data.owner_org_name + "</b>";
  } else if (objectType == 'memberships'){
    return " membership <b>" + data.org_name + "</b>";
  } else if (objectType == 'environments'){
    return " environment <b>" + data.name + "</b> with consensus type  <b>" + data.consensus_type + "</b> and provider <b>" + data.provider + "</b>";
  } else if (objectType == 'nodes'){
    return " node <b>" + data.name + "</b> as  <b>" + data.role + "</b> with state <b>" + data.state + "</b>";
  } else if (objectType == 'invitations'){
    return " invitation to <b>" + data.org_name + "</b> with state <b>" + data.state + "</b>";
  } else {
    alert(objectType);
  }
}

export default App;
