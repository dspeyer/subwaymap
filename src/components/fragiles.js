import React from 'react';
import * as data from '../../static_info/data.js'
import {fetch} from '../net.js';

fragileMap = {};

const emoji = {
    'EL': '🛗',
    'ES': '𝆱'
};

export class Fragiles extends React.Component {
    constructor(props) {
        super(props);
	this.station = props.station;
	this.typ = props.typ;
	this.state = {};
	for (let sid of this.station.AlsoShow.concat([this.station['GTFS Stop ID']])) {
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
	return <span className="fragile" style={{background: (total==working ? '#7f7' : '#f77')}} >
		   {emoji[this.typ]} {working} / {total}
	       </span>;
    }
}


export async function fetchfragiles(which) {
    let res = await fetch('nyct_ene.json', 'json');
    let broken = {};
    for (let problem of res) {
	if (problem.isupcomingoutage == 'N') {
	    broken[problem.equipment] = true;
	}
    }
    for (let eq in fragileMap) {
	fragileMap[eq].setState({ eq: (eq in broken) ? 0 : 1 });
    }
}
