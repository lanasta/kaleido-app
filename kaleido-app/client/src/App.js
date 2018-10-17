import React, { Component } from 'react';
import Parser from 'html-react-parser';

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/pro-regular-svg-icons'

import './App.scss'; // or `.scss` if you chose scss
import './App.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(far)

// import Image from './images/img.png'; // Import using relative path

// const styles = {
//     customListStyle: {
//         listStyleImage: 'url('+ Image +')'
//     }
// };

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

  renderAuditLog(){
    let auditLogs = [];
    for (var i in this.state.audits){
      auditLogs.push(<AuditLog key= {this.state.audits[i]._id} audit={this.state.audits[i]}/>);
    }
    console.log(auditLogs);
    return auditLogs;
  }

  render() {
    let actionPhrase = {
      "create" : "Created",
      "update" : "Updated",
      "delete" : "Deleted"
    }

    return (
      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro">{JSON.stringify(this.state.consortia, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.invitations, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.memberships, null, 2) }</p>
        <div className="App-intro"><ul className='cephThemeList'>{this.renderAuditLog()}</ul></div>
      </div>
    );
  }
}

function StatusSymbol(props){
  console.log(props);
    switch(props.state) {
      case 'sent':
        return <FontAwesomeIcon icon={['far', 'paper-plane']} />;
      case 'accepted':
        return <FontAwesomeIcon icon={['far', 'user-check']} />;
      case 'declined':
        return <FontAwesomeIcon icon={['far', 'user-times']} />;
      case 'initializing':
        return <FontAwesomeIcon icon={['far', 'spinner']} />;
      case 'started':
        return <FontAwesomeIcon icon={['far', 'cogs']} />;
      default:
        return null;
    }
}

function ConsortiaAuditLog(props){
  return  <>consortia <b> {props.data.name} </b> owned by <b> {props.data.owner_org_name}  </b></>;
}

function MembershipAuditLog(props){
  return  <>membership <b>{props.data.org_name}</b></>;
}

function EnvironmentAuditLog(props){
  return  <>environment <b> {props.data.name}</b> with consensus type <b>{props.data.consensus_type}</b> and provider <b>{props.data.provider}</b></>;
}

function NodeAuditLog(props){
  return  <>node <b> {props.data.name}</b> with the role of a <b>{props.data.role}</b>, status: <b>{props.data.state}</b> <StatusSymbol state={props.data.state}/></>;
}

function InvitationAuditLog(props){
  return  <>invitation to <b> {props.data.org_name}</b> , status: <b>{props.data.state}</b> <StatusSymbol state={props.data.state}/></>;
}

function AuditLog(props){
  let penIcon = <FontAwesomeIcon icon={['far', 'pen-alt']} />
  let time = <>At {(new Date(props.audit.timestamp).toLocaleString())}: </>;
  let actions = {
    "create" : "created",
    "update" : "updated",
    "delete" : "deleted"
  }
  switch(props.audit.objectType) {
     case 'consortia':
       return <li>{penIcon} {time}{actions[props.audit.action]} <ConsortiaAuditLog data={props.audit.data} /></li>;
      case 'memberships':
        return <li>{penIcon} {time}{actions[props.audit.action]} <MembershipAuditLog data={props.audit.data} /></li>;
      case 'environments':
        return <li>{penIcon} {time}{actions[props.audit.action]} <EnvironmentAuditLog data={props.audit.data} /></li>;
      case 'nodes':
        return <li>{penIcon} {time}{actions[props.audit.action]} <NodeAuditLog data={props.audit.data} /></li>;
      case 'invitations':
        return <li>{penIcon} {time}{actions[props.audit.action]} <InvitationAuditLog data={props.audit.data} /></li>;
      default:
        return null;
  }
}

export default App;
