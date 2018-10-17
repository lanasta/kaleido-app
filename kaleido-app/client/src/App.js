import React, { Component } from 'react';
import Parser from 'html-react-parser';

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/pro-regular-svg-icons'

import './App.scss'; // or `.scss` if you chose scss
import './App.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    return (
      <div className="App">
        <header className="App-header">
        </header>
        {/* <p className="App-intro">{JSON.stringify(this.state.consortia, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.invitations, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.memberships, null, 2) }</p> */}
        <div className="App-intro"><ul className='kaleidoList'>{this.renderAuditLog()}</ul></div>
      </div>
    );
  }
}

function StatusSymbol(props){
    switch(props.state) {
      case 'sent':
        return <FontAwesomeIcon className='audit-fa neutral' icon={['far', 'paper-plane']} />;
      case 'accepted':
        return <FontAwesomeIcon className='audit-fa green' icon={['far', 'user-check']} />;
      case 'declined':
        return <FontAwesomeIcon className='audit-fa alert' icon={['far', 'user-times']} />;
      case 'initializing':
        return <FontAwesomeIcon className='audit-fa neutral' icon={['far', 'spinner']} />;
      case 'started':
        return <FontAwesomeIcon className='audit-fa green' icon={['far', 'cogs']} />;
      case 'active':
        return <FontAwesomeIcon className='audit-fa green' icon={['far', 'plug']} />;
      case 'setup':
        return <FontAwesomeIcon className='audit-fa neutral' icon={['far', 'wrench']} />;
      case 'live':
        return <FontAwesomeIcon className='audit-fa green' icon={['far', 'globe']} />;
      default:
        return null;
    }
}

function ConsortiaAuditLog(props){
  return  <>consortia <b> {props.data.name} </b> owned by <b> {props.data.owner_org_name}</b><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></>;
}

function MembershipAuditLog(props){
  return  <>membership <b>{props.data.org_name}</b><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></>;
}

function EnvironmentAuditLog(props){
  return  <>environment <b> {props.data.name}</b> with consensus type <b>{props.data.consensus_type}</b> and provider <b>{props.data.provider}</b><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></>;
}

function NodeAuditLog(props){
  return  <>node <b> {props.data.name}</b> with the role <b>{props.data.role}</b><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></>;
}

function InvitationAuditLog(props){
  return  <>invitation to <b> {props.data.org_name}</b><div className='statusBox'><StatusSymbol state={props.data.state}/>{props.data.state}</div></>;
}

function auditType(){
  return <><img src={consortium}></img></>;
}

function AuditLog(props){
  let penIcon = <FontAwesomeIcon icon={['far', 'pen-alt']} />
  let time = <>{(new Date(props.audit.timestamp).toLocaleString())}: </>;
  let actions = {
    "create" : "created",
    "update" : "updated",
    "delete" : "deleted"
  }
  switch(props.audit.objectType) {
     case 'consortia':
       return <div className='auditEntry'><img src={consortium}></img><li>{time}{actions[props.audit.action]} <ConsortiaAuditLog data={props.audit.data} /></li></div>;
      case 'memberships':
        return <div className='auditEntry'><img src={membership}></img><li>{time}{actions[props.audit.action]} <MembershipAuditLog data={props.audit.data} /></li></div>;
      case 'environments':
        return <div className='auditEntry'><img src={environment}></img><li>{time}{actions[props.audit.action]} <EnvironmentAuditLog data={props.audit.data} /></li></div>;
      case 'nodes':
        return <div className='auditEntry'><img src={node}></img> <li>{time}{actions[props.audit.action]} <NodeAuditLog data={props.audit.data} /></li></div>;
      case 'invitations':
        return <div className='auditEntry'><img src={invitation}></img><li>{time}{actions[props.audit.action]} <InvitationAuditLog data={props.audit.data} /></li></div>;
      default:
        return null;
  }
}

export default App;
