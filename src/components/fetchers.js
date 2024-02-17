import React from 'react';
import { fetchgtfs } from './arrivals.js';
import { fetchfragiles } from './fragiles.js';
import * as data from '../../static_info/data.js'
import {tickees} from '../ticker.js';

function pad(x) {
    if (x < 10) {
	return '0'+x;
    } else {
	return x;
    }
}

let fetchers = [];

export class Fetcher extends React.Component {
    constructor(props) {
	super(props);
	this.which = props.which;
	this.rawfetch = fetchgtfs;
	if (this.which == 'fragile') {
	    this.displayname = '🛗𝆱';
	    this.rawfetch = fetchfragiles;
	    this.color = '#444';
	} else if (this.which == '') {
	    this.displayname = '#';
	    this.color = '#'+data.routes[1].color;
	} else {
	    this.displayname = this.which.slice(1).toUpperCase();
	    let r = data.routes[this.displayname[0]] || data.routes[this.displayname];
	    this.color = '#'+r.color;
	}
	this.state = {
	    readyState: 0,
	    lastFetched: -1/0,
	    now: (new Date()).getTime() / 1000
	};
	fetchers.push(this);
	tickees.push(this);
    }
    
    fetch() {
	fetchgtfs(this.which,
		  (xhttp) => { this.setState({readyState:xhttp.readyState}) }).
	    then(() => {
		this.setState({lastFetched: (new Date()).getTime() / 1000});
	    }).catch((e) => {
		console.log(e);
		this.setState({readyState: 5});
	    });
    }
    
    render() {
	const stateNames = ['not tried', 'working', 'sent', 'fetching', 'done', 'failed'];
	let age = this.state.now - this.state.lastFetched;
	return <div className="Fetcher" onClick={this.fetch.bind(this)}>
		   <b style={{background:this.color}}>{this.displayname}</b><br/>
		   <i>{stateNames[this.state.readyState]}</i><br/>
		   {Math.floor(age/60)}:{pad(Math.floor(age)%60)}
	       </div>;
    }
};

export let jumpers = [];
export class Jumper extends React.Component {
    constructor(props) {
	super(props);
	this.state = { callback: null };
	jumpers.push(this);
    }

    render() {
	if (this.state.callback) {
	    return <div onClick={this.state.callback} class='Fetcher'>
		       <div class="yahball">🚶</div>
		       jump
		   </div>;
	} else {
	    return <div class='Fetcher' style={{color:'#555'}}>🚶<br/>No GPS</div>;
	}
    }
};
	
		

export function FetcherBox () {
    return <div className="FetcherBox" id="fetcherBox">
	       <Fetcher which=""/>
	       <Fetcher which="-ace"/>
	       <Fetcher which="-g"/>
	       <Fetcher which="-nqrw"/>
	       <Fetcher which="-bdfm"/>
	       <Fetcher which="-jz"/>
	       <Fetcher which="-l"/>
	       <Fetcher which="-si"/>
	       <Fetcher which="fragile"/>
	       <Jumper/>
	   </div>;
}

let faoCalled = false;
export function fetchAllOnce() {
    if (faoCalled) return;
    faoCalled = true;
    for (let f of fetchers) {
	f.fetch();
    }
}

function fixFixed(){
    let div = document.getElementById('fetcherBox');
    if (div) {
	div.style.top = window.visualViewport.offsetTop+'px';
	div.style.left = window.visualViewport.offsetLeft+'px';
    }
}
window.visualViewport.addEventListener('scroll',fixFixed);
window.visualViewport.addEventListener('resize',fixFixed);
