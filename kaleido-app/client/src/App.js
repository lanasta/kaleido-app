import React, { Component } from 'react';
import Parser from 'html-react-parser';

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/pro-regular-svg-icons'

import './App.scss'; // or `.scss` if you chose scss
import './App.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/kaleido.png'
import consortium from './images/consortium.svg'
import membership from './images/membership.svg'
import environment from './images/environment.svg'
import node from './images/node.svg'
import invitation from './images/invitation.svg'


library.add(far)

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
    return body;
  };

  renderAuditLog(){
    let auditLogs = [];
    let header = <><thead><tr><th></th><th>Timestamp<FontAwesomeIcon className='audit-fa' icon={['far', 'clock']} /></th><th>Activity<FontAwesomeIcon className='audit-fa' icon={['far', 'cube']} /></th><th>Status<FontAwesomeIcon className='audit-fa' icon={['far', 'heart-rate']} /></th></tr></thead></>;
    for (var i in this.state.audits){
      auditLogs.push(<AuditLog key= {this.state.audits[i]._id} audit={this.state.audits[i]}/>);
    }
    return <>{header}<tbody>{auditLogs}</tbody></>;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <div className="wrapper"><img src={logo} width='180'></img></div>
        </header>
        {/* <p className="App-intro">{JSON.stringify(this.state.consortia, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.invitations, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.memberships, null, 2) }</p> */}
        <div className="wrapper"><h2>Audit Logs</h2><table className='kaleidoTable' border="0" cellPadding="0" cellSpacing="0">{this.renderAuditLog()}</table></div>
      </div>
    );
  }
}

function StatusSymbol(props){
    switch(props.state) {
      case 'sent':
        return <FontAwesomeIcon className='status-fa neutral' icon={['far', 'paper-plane']} />;
      case 'accepted':
        return <FontAwesomeIcon className='status-fa green' icon={['far', 'user-check']} />;
      case 'declined':
        return <FontAwesomeIcon className='status-fa alert' icon={['far', 'user-times']} />;
      case 'initializing':
        return <FontAwesomeIcon className='status-fa neutral' icon={['far', 'spinner']} />;
      case 'started':
        return <FontAwesomeIcon className='status-fa green' icon={['far', 'cogs']} />;
      case 'active':
        return <FontAwesomeIcon className='status-fa green' icon={['far', 'circle']} />;
      case 'setup':
        return <FontAwesomeIcon className='status-fa neutral' icon={['far', 'wrench']} />;
      case 'live':
        return <FontAwesomeIcon className='status-fa green' icon={['far', 'globe']} />;
      default:
        return null;
    }
}

function ConsortiaAuditLog(props){
  return  <><td>{props.action} consortia <b> {props.data.name} </b> owned by <b> {props.data.owner_org_name}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></td></>;
}

function MembershipAuditLog(props){
  return  <><td>{props.action} membership <b>{props.data.org_name}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></td></>;
}

function EnvironmentAuditLog(props){
  return  <><td>{props.action} environment <b> {props.data.name}</b> with consensus type <b>{props.data.consensus_type}</b> and provider <b>{props.data.provider}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></td></>;
}

function NodeAuditLog(props){
  return  <><td>{props.action} node <b> {props.data.name}</b> with role <b>{props.data.role}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></td></>;
}

function InvitationAuditLog(props){
  return  <><td>{props.action} invitation to <b> {props.data.org_name}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></td></>;
}

function auditType(){
  return <><img src={consortium}></img></>;
}

function AuditLog(props){
  let penIcon = <FontAwesomeIcon icon={['far', 'pen-alt']} />
  let time = <>{(new Date(props.audit.timestamp).toLocaleString())}</>;
  let actions = {
    "create" : "Created",
    "update" : "Updated",
    "delete" : "Deleted"
  }
  switch(props.audit.objectType) {
     case 'consortia':
     // return <tr><td><img src={consortium}></img>{time}</td><td>{actions[props.audit.action]} <ConsortiaAuditLog data={props.audit.data} /></tr>;

       return <tr><td><img src={consortium}></img></td><td>{time}</td><ConsortiaAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'memberships':
//      return <img src={membership}></img>{time} <MembershipAuditLog data={props.audit.data} /></li></div>;
        return <tr><td><img src={membership}></img></td><td>{time}</td><MembershipAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'environments':
        return <tr><td><img src={environment}></img></td><td>{time}</td><EnvironmentAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'nodes':
        return <tr><td><img src={node}></img></td><td>{time}</td><NodeAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'invitations':
        return <tr><td><img src={invitation}></img></td><td>{time}</td><InvitationAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      default:
        return null;
  }
}

export default App;
