import React from 'react';
import * as data from '../../static_info/data.js';
import {fetch} from '../net.js';
import {tickees} from '../ticker.js';

// protoc --js_out=import_style=commonjs,binary:src  gtfs-realtime.proto
import FeedMessage from '../gtfs-realtime_pb.js'


function pad(x) {
    if (x < 10) {
	return '0'+x;
    } else {
	return x;
    }
}


let arrivalMap = {};
for (let r in data.routes) {
    arrivalMap[r] = {};
}

let key=9999999;

export class Arrivals extends React.Component {
    constructor(props) {
        super(props);
	this.route = data.routes[props.route];
	this.station = data.stations[props.station];
	this.state = {
	    now: (new Date()).getTime() / 1000,
	    N: [],
	    S: []
	};
	arrivalMap[props.route][props.station] = this;
	tickees.push(this);
    }
    
    render() {
	const shortDirs = { 'N': '↑', 'S': '↓'};
	if ( ( ! this.state.N.length)  && ( ! this.state.S.length ) ) {
	    return null;
	}
	return <div>
		   <span className="rn" style={{background: '#'+this.route.color}}>
		       {this.route.name}
		   </span>
		   { ['N', 'S'].map(dir => 
		       <span className="half" key={dir}>
			   { shortDirs[dir] }
			   <span className="hidden" style={{fontSize:'80%'}}>
			       ({this.station.Directions[dir]})
			   </span>
			   { (this.state[dir]
			      .map(t => Math.round(t-this.state.now))
			      .sort((a,b)=>a-b)
			      .filter(x => x>=0)
			      .map( (t, i) => 
				  <span key={i}>
				      {Math.floor(t/60)
				      }{ i<2 ? <span className="hidden">:{pad(t%60)}</span> : null
				       }, </span> )
			     ) }
		       </span>
		   ) }
	       </div>;
    }
};

export async function fetchgtfs(which, cb) {
    let res = await fetch('gtfs'+which, 'arraybuffer', cb);
    let msg = FeedMessage.FeedMessage.deserializeBinary(res).toObject();
    let arrivals = {};
    for (let entity of msg.entityList) {
	if (entity.tripUpdate?.stopTimeUpdateList) {
	    let rid = entity.tripUpdate.trip.routeId;
	    if ( ! (rid in arrivals)) {
		arrivals[rid] = {};
	    }
	    for (let stu of entity.tripUpdate.stopTimeUpdateList) {
		if ( ! stu.stopId ) continue;
		let sid = stu.stopId.slice(0,-1);
		if (! (sid in data.stations)) {
		    console.log({stu,sid,msg:'failed to find station'});
		    continue;
		}
		if (data.stations[sid].ShowAs) sid = data.stations[sid].ShowAs;
		let dir = stu.stopId.slice(-1);
		if ( ! (sid in arrivals[rid])) {
		    arrivals[rid][sid] = {N:[], S:[]}
		}
		arrivals[rid][sid][dir].push(stu.arrival?.time || stu.departure?.time || 0);
	    }
	}
    }
    for (let r in arrivals) {
	for (let s in arrivalMap[r]) {
	    if (s in arrivals[r]) {
		arrivalMap[r][s].setState(arrivals[r][s]);
	    } else {
		arrivalMap[r][s].setState({N:[],S:[]});
	    }
	}
    }		
}
	    
