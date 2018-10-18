import React, { Component } from 'react';
import Highcharts from 'highcharts';

import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/pro-regular-svg-icons'

import './animate.css'
import './App.scss'; // or `.scss` if you chose scss
import './App.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/logo.svg'
import consortium from './images/consortium.svg'
import membership from './images/membership.svg'
import environment from './images/environment.svg'
import node from './images/node.svg'
import invitation from './images/invitation.svg'

library.add(far)

class App extends Component {
  state = {
    consortium: '',
    invitations: '',
    invitationStates: {},
    memberships: '',
    audits: '',
    environments: '',
    series: []
  };

  componentDidMount() {
    document.title = "Anastasia's Kaleido App";
    this.getEndpoint("consortium")
      .then(res => this.setState({ consortium: res }))
      .catch(err => console.log(err));
    this.getEndpoint("invitations")
      .then(res => {
        this.setState({ invitations: res });
        for (var i in res){
          let state = res[i].state;
          if (this.state.invitationStates[state] == null){
            this.state.invitationStates[state] = 1;
          } else {
            this.state.invitationStates[state] += 1;
          }
        }
        let states = this.state.invitationStates;
        let data = [
            {
              name: 'Accepted',
              y: states.accepted,
              color: '#00cd79'
            },
            {
              name: 'Sent',
              y: states.sent,
              color: '#fa9a43'
            },
            {
              name: 'Declined',
              y: states.declined,
              color: '#ee34a8'
            }
          ];
          this.setState({ series: [{
            name: 'Invitations',
            dataLabels: {
              enabled: false
            },
            data: [
              {
                name: 'Accepted',
                y: states.accepted,
                color: '#00cd79'
              },
              {
                name: 'Sent',
                y: states.sent,
                color: '#fa9a43'
              },
              {
                name: 'Declined',
                y: states.declined,
                color: '#ee34a8'
              }
            ]}
          ]});
        this.highChartsRender();
      }).catch(err => console.log(err));

    this.getEndpoint("memberships")
      .then(res => this.setState({ memberships: res }))
      .catch(err => console.log(err));

    this.getEndpoint("environments")
        .then(res => this.setState({ environments: res }))
        .catch(err => console.log(err));

    this.getEndpoint("audits")
      .then(res => this.setState({ audits: res.reverse() }))
      .catch(err => console.log(err));
  }

  getEndpoint = async (endpointName) => {
    const response = await fetch('/' + endpointName);
    const body = await response.json();
    console.log(body);
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  highChartsRender() {
    console.log(this.state);
  	Highcharts.chart({
        credits: false,
  	    chart: {
  	      type: 'pie',
  	      renderTo: 'invitationsChart',
          style : {
            fontFamily: 'Lato',
            fontWeight: '700',
            padding: '0',
            margin: '0'
          }, legend : {
            enabled: true,
            layout: 'horizontal',
            align: 'right',
            floating: true,
            backgroundColor: '#FFFFFF',
            style: {
              fontWeight: 300
            }
          }
  	    },
  	    title: {
  	      verticalAlign: 'middle',
  	      text: `${this.state.invitations.length}`,
          y: -3,
  	      style: {
  	      	fontSize: '36px',
  	      }
  	    },
        legend: {
            itemStyle: {
                fontWeight: '300'
            }
        },
  	    plotOptions: {
  	      pie: {
  	        innerSize: '70%',
            showInLegend: true
  	      },
          legend : {
            enabled: true
          }
  	    },
  	    series: this.state.series
    	});
  }

  countTotalNodes(){
    let envs = this.state.environments;
    let totalNodes = 0;
    for (var i in envs){
      totalNodes += envs[i].node_list.length;
    }
    return totalNodes;
  }

  renderMembersList(){
    let members = this.state.memberships;
    let membersUl = [];
    for (var i in members){
      membersUl.push(<li key={members[i]._id} >{members[i].org_name}</li>);
    }
    return membersUl;
  }

  renderAuditLog(){
    let auditLogs = [];
    let header = <><thead><tr><th></th><th>Timestamp<FontAwesomeIcon className='right-fa' icon={['far', 'clock']} /></th><th>Activity<FontAwesomeIcon className='right-fa' icon={['far', 'cube']} /></th><th>Status<FontAwesomeIcon className='right-fa' icon={['far', 'heart-rate']} /></th></tr></thead></>;
    for (var i in this.state.audits){
      auditLogs.push(<AuditLog key= {this.state.audits[i]._id} audit={this.state.audits[i]}/>);
    }
    return <>{header}<tbody>{auditLogs}</tbody></>;
  }

  renderConsortiumInfo(){
    console.log(this.state.consortium);
    return <><div className='consortiumName'>{this.state.consortium.name}</div><div className='consortiumDescription'>{this.state.consortium.description}</div></>;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="">
            <div className="wrapper">
              <div className='logo'><img alt="" src={logo} width='180'></img></div>
              <div className='navIcons'>
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'question-circle']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'user']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'wrench']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'sign-out']} />
              </div>
            </div>
          </div>
        </header>
        {/* <p className="App-intro">{JSON.stringify(this.state.consortium, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.invitations, null, 2) }</p>
        <p className="App-intro">{JSON.stringify(this.state.memberships, null, 2) }</p> */}
        <div className="wrapper">
          <div className="column consortiumInfo">{this.renderConsortiumInfo()}</div>
          <div className="flexGridThree">
            <div className="column">
              <div className="columnHeader">Overview<FontAwesomeIcon className='right-fa' icon={['far', 'info-circle']} /></div>
                <div className="overview">
                  <div className="overviewElement"><div className='col'><img alt="" src={membership}></img></div><div className='col'><span className="propertyCount">{this.state.memberships.length}</span> members</div></div>
                  <div className="overviewElement"><div className='col'><img alt="" src={environment}></img></div><div className='col'><span className="propertyCount">{this.state.environments.length}</span> environments</div></div>
                  <div className="overviewElement"><div className='col'><img alt="" src={node}></img></div><div className='col'><span className="propertyCount">{this.countTotalNodes()}</span> nodes</div></div>
                </div>
            </div>
            <div className="column">
              <div className="columnHeader">Members<FontAwesomeIcon className='right-fa' icon={['far', 'users']} /></div>
              <div className="membersList">
                <ul>{this.renderMembersList()}</ul>
              </div>
            </div>
            <div className="column">
              <div className="columnHeader">Invitations<FontAwesomeIcon className='right-fa' icon={['far', 'envelope']} /></div>
              <div id="invitationsChart"></div>
            </div>
          </div>
          <div className="column">
            <div className="sectionTitle">Audit Logs</div>
            <table className='kaleidoTable' border="0" cellPadding="0" cellSpacing="0">{this.renderAuditLog()}</table>
          </div>
        </div>
      </div>
    );
  }
}

function StatusSymbol(props){
  let states = {
    "upgrade_pending" : "Upgrade Pending"
  }
  let state = (states[props.state] == null) ? props.state : states[props.state];
    switch(props.state) {
      case 'sent':
        return <><FontAwesomeIcon className='status-fa neutral' icon={['far', 'paper-plane']} />{state}</>;
      case 'accepted':
        return <><FontAwesomeIcon className='status-fa green' icon={['far', 'user-check']} />{state}</>;
      case 'declined':
        return <><FontAwesomeIcon className='status-fa alert' icon={['far', 'user-times']} />{state}</>;
      case 'initializing':
        return <><FontAwesomeIcon className='status-fa neutral' icon={['far', 'spinner']} />{state}</>;
      case 'started':
        return <><FontAwesomeIcon className='status-fa green' icon={['far', 'cogs']} />{state}</>;
      case 'active':
        return <><FontAwesomeIcon className='status-fa green' icon={['far', 'circle']} />{state}</>;
      case 'setup':
        return <><FontAwesomeIcon className='status-fa neutral' icon={['far', 'wrench']} />{state}</>;
      case 'live':
        return <><FontAwesomeIcon className='status-fa green' icon={['far', 'globe']} />{state}</>;
      case 'upgrading':
        return <><FontAwesomeIcon className='status-fa green' icon={['far', 'sync']} />{state}</>;
      case 'upgrade_pending':
        return <><FontAwesomeIcon className='status-fa neutral' icon={['far', 'sync']} />{state}</>;
      default:
        return null;
    }
}

function ConsortiumAuditLog(props){
  return  <><td>{props.action} consortium <b> {props.data.name} </b> owned by <b> {props.data.owner_org_name}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/></div></td></>;
}

function MembershipAuditLog(props){
  return  <><td>{props.action} membership <b>{props.data.org_name}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/></div></td></>;
}

function EnvironmentAuditLog(props){
  return  <><td>{props.action} environment <b> {props.data.name}</b> with consensus type <b>{props.data.consensus_type}</b> and provider <b>{props.data.provider}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/></div></td></>;
}

function NodeAuditLog(props){
  return  <><td>{props.action} node <b> {props.data.name}</b> with role <b>{props.data.role}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/></div></td></>;
}

function InvitationAuditLog(props){
  return  <><td>{props.action} invitation to <b> {props.data.org_name}</b></td><td><div className='statusBox'><StatusSymbol state={props.data.state}/></div></td></>;
}

function AuditLog(props){
  let time = <>{(new Date(props.audit.timestamp).toLocaleString())}</>;
  let actions = {
    "create" : "Created",
    "update" : "Updated",
    "delete" : "Deleted"
  }
  switch(props.audit.objectType) {
     case 'consortium':
       return <tr><td><img alt="" src={consortium}></img></td><td>{time}</td><ConsortiumAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'memberships':
        return <tr><td><img alt="" src={membership}></img></td><td>{time}</td><MembershipAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'environments':
        return <tr><td><img alt="" src={environment}></img></td><td>{time}</td><EnvironmentAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'nodes':
        return <tr><td><img alt="" src={node}></img></td><td>{time}</td><NodeAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      case 'invitations':
        return <tr><td><img alt="" src={invitation}></img></td><td>{time}</td><InvitationAuditLog action={actions[props.audit.action]} data={props.audit.data} /></tr>;
      default:
        return null;
  }
}

export default App;
