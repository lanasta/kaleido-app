import React, { Component } from 'react';
import Highcharts from 'highcharts';
import WOW from "wowjs";

import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/pro-regular-svg-icons'

import './animate.css'
import './App.scss'; // or `.scss` if you chose scss
import './App.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './images/logo.svg'
import squid from './images/s1.png'
import consortium from './images/consortium.svg'
import membership from './images/membership.svg'
import environment from './images/environment.svg'
import node from './images/node.svg'
import invitation from './images/invitation.svg'


library.add(far)

class App extends Component {
  constructor(props) {
    super(props);
    this.chartCol= React.createRef();
    this.updateChartYVal = this.updateChartYVal;
}

  state = {
    loading: true,
    consortium: '',
    invitations: '',
    invitationStates: {},
    memberships: '',
    audits: '',
    environments: '',
    series: [],
    timestamp: '',
    chartYVal: -3,
    colors: ['#00cd79', '#fa9a43', '#ee34a8']
  };

  componentDidMount() {
    document.title = "Anastasia's Kaleido App";
    this.getData();
    this.timer = setInterval(() => {
        this.getData();
    }, 2000);
    const wow = new WOW.WOW();
    wow.init();
  }

  componentWillUnmount() {
    this.timer = null;
  }

  getData() {
    this.setState({invitationStates:{}});
    this.getEndpoint("consortium")
      .then(res => this.setState({ consortium: res }))
      .catch(err => console.log(err));
    this.getEndpoint("invitations")
      .then(res => {
        this.setState({ invitations: res });
        let invitationStates = {
          'accepted' : 0,
          'declined' : 0,
          'sent' : 0
        };
        for (var i in res){
          let state = res[i].state;
          if (invitationStates[state] == null){
            invitationStates[state] = 1;
          } else {
            invitationStates[state] += 1;
          }
        }
        this.setState({invitationStates: invitationStates});
        let states = this.state.invitationStates;
        this.setState({ series: [{
            name: 'Invitations',
            dataLabels: {
              enabled: false
            },
            data: [
              {
                name: 'Accepted',
                y: states.accepted,
                color: this.state.colors[0]
              },
              {
                name: 'Sent',
                y: states.sent,
                color: this.state.colors[1]
              },
              {
                name: 'Declined',
                y: states.declined,
                color: this.state.colors[2]
              }
            ]}
          ]});
        this.highChartsRender(this.state);
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

    setTimeout(()=> this.setState({loading: false}), 2000);
  }

  getEndpoint = async (endpointName) => {
    const response = await fetch('/' + endpointName);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  highChartsRender(props) {
  	Highcharts.chart({
        credits: false,
  	    chart: {
  	      type: 'pie',
  	      renderTo: 'invitationsChart',
          marginTop: 0,
          marginBottom: 45,
          style : {
            fontFamily: 'Lato',
            fontWeight: '700',
            padding: '0',
            margin: '0'
          }, legend : {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            floating: false,
            backgroundColor: '#FFFFFF',
 verticalAlign: 'bottom',
          }
  	    },
        title: {
          text: null
        },
  	    subtitle: {
  	      verticalAlign: 'middle',
  	      text: `${this.state.invitations.length}`,
          y: -5,
  	      style: {
  	      	fontSize: '36px',
  	      }
  	    },
        legend: {
            itemStyle: {
                fontSize: '14px',
                margin: 0,
                padding: 0,
                fontWeight: '300'
            },
            labelFormatter: function() {
              let count = props.invitationStates[(this.name).toLowerCase()];
              return this.name + ": <b>" + count + "</b>";
            }
        },
  	    plotOptions: {
  	      pie: {
  	        innerSize: '70%',
            showInLegend: true
  	      },
          legend : {
            enabled: true,
            floating: false
          },
          series : {
            animation: false
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
    return <><div className='consortiumName'>{this.state.consortium.name}</div><div className='consortiumDescription'>{this.state.consortium.description}</div></>;
  }

  render() {
    while (this.state.loading){
      return (
        <div className="App">

        <header className="App-header">
            <div className="wrapper">
              <div className='logo'><img alt="" src={logo} width='180'></img></div>
              <div className='navIcons'>
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'question-circle']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'user']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'wrench']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'sign-out']} />
              </div>
            </div>
        </header>
        <div className="squid wow rubberBand"><img alt="" src={squid}></img></div>
      </div>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
            <div className="wrapper">
              <div className='logo'><img alt="" src={logo} width='180'></img></div>
              <div className='navIcons'>
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'question-circle']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'user']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'wrench']} />
                <FontAwesomeIcon className='navIcons-fa' icon={['far', 'sign-out']} />
              </div>
            </div>
        </header>
        <div className="wrapper">
          <div className="column consortiumInfo"><img alt="" src={consortium}></img>{this.renderConsortiumInfo()}</div>
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
            <div className="column" ref="chartCol">
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
  return  <><td>{props.action} consortium <b> {props.data.name} </b> owned by <b> {props.data.owner_org_name}</b></td><td><div className='auditStatus'><StatusSymbol state={props.data.state}/></div></td></>;
}

function MembershipAuditLog(props){
  return  <><td>{props.action} membership <b>{props.data.org_name}</b></td><td><div className='auditStatus'><StatusSymbol state={props.data.state}/></div></td></>;
}

function EnvironmentAuditLog(props){
  return  <><td>{props.action} environment <b> {props.data.name}</b> with consensus type <b>{props.data.consensus_type}</b> and provider <b>{props.data.provider}</b></td><td><div className='auditStatus'><StatusSymbol state={props.data.state}/></div></td></>;
}

function NodeAuditLog(props){
  return  <><td>{props.action} <b> {props.data.membership_name}</b> node <b> {props.data.name}</b> with role <b>{props.data.role}</b> in environment <b>{props.data.environment_name}</b></td><td><div className='auditStatus'><StatusSymbol state={props.data.state}/></div></td></>;
}

function InvitationAuditLog(props){
  return  <><td>{props.action} invitation to <b> {props.data.org_name}</b></td><td><div className='auditStatus'><StatusSymbol state={props.data.state}/></div></td></>;
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
