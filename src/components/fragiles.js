import React from 'react';
import * as data from '../../static_info/data.js'
import {fetch} from '../net.js';

let fragileMap = {};

const emoji = {
    'EL': '🛗',
    'ES': '𝆱'
};

const longform = {
    'EL': 'Elevators',
    'ES': 'Escalators'
};

export class Fragiles extends React.Component {
    constructor(props) {
        super(props);
	this.station = props.station;
	this.typ = props.typ;
	this.state = {};
	for (let sid of this.station.AlsoShow.concat([this.station.Id])) {
	    let s = data.stations[sid];
	    if ( ( ! s[this.typ]) || typeof(s[this.typ][Symbol.iterator])!='function'){
		console.log({s,t:this.typ,msg:'Not Iterable'});
		continue;
	    }
	    for (let eq of s[this.typ]) {
		fragileMap[eq] = this;
		this.state[eq] = 1;
	    }
	}
    }

    render() {
	let total = Object.values(this.state).length;
	if (total==0) return null;
	let working = Object.values(this.state).reduce((a,b)=>a+b, 0);
	return <span>
		   <span className="fragile" style={{background: (total==working ? '#7f7' : '#f77')}} >
		       <span className="hidden"> {longform[this.typ]} </span>
		       {emoji[this.typ]} {working} / {total}
		   </span>
		   { Object.keys(this.state).map( (eq) =>
		       <div className="hidden" key={this.station.Id+eq}>
			   { this.state[eq] ? '✅' : '❌' }
			   { data.fragiles[eq]?.shortdescription }
			   { data.fragiles[eq]?.shortdescription.indexOf(data.fragiles[eq]?.linesservedbyelevator) == -1 ?
			     ' ('+data.fragiles[eq]?.linesservedbyelevator+')' : '' }
		       </div> ) }
	       </span>;
    }
}


export async function fetchfragiles(which, cb) {
    let res = await fetch('nyct_ene.json', 'json', cb);
    let broken = {};
    for (let problem of res) {
	if (problem.isupcomingoutage == 'N') {
	    broken[problem.equipment] = true;
	}
    }
    for (let eq in fragileMap) {
	fragileMap[eq].setState({ [eq]: (eq in broken) ? 0 : 1 });
    }
}
