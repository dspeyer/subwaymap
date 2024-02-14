import React from 'react';
import * as data from '../../static_info/data.js';
import {fetch} from '../net.js';

// protoc --js_out=import_style=commonjs,binary:src  gtfs-realtime.proto
import FeedMessage from '../gtfs-realtime_pb.js'


arrivalMap = {};
for (let r in data.routes) {
    arrivalMap[r] = {};
}

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
    }
    render() {
	if ( ( ! this.state.N.length)  && ( ! this.state.S.length ) ) {
	    return null;
	}
	return <div>
		   <span className="rn" style={{background: '#'+this.route.color}}>
		       {this.route.name}
		   </span>
		   <span className="half">
		       ↑
		       { this.state.N.map(t => Math.round((t-this.state.now)/60)).sort((a,b)=>a-b).filter(x => x>=0).join(', ') }
		   </span>
		   <span className="half">
		       ↓
		       { this.state.S.map(t => Math.round((t-this.state.now)/60)).sort((a,b)=>a-b).filter(x => x>=0).join(', ') }
		   </span>
	       </div>;
    }
};

export async function fetchgtfs(which) {
    let res = await fetch('gtfs'+which, 'arraybuffer');
    console.log({res, t:typeof(res)});
    let msg = FeedMessage.FeedMessage.deserializeBinary(res).toObject();
    let arrivals = {};
    for (let entity of msg.entityList) {
	console.log({entity});
	if (entity.tripUpdate?.stopTimeUpdateList) {
	    let rid = entity.tripUpdate.trip.routeId;
	    if ( ! (rid in arrivals)) {
		arrivals[rid] = {};
	    }
	    for (let stu of entity.tripUpdate.stopTimeUpdateList) {
		console.log({stu});
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
		console.log({rid,sid,dir});
		arrivals[rid][sid][dir].push(stu.arrival?.time || stu.departure.time);
	    }
	}
    }
    console.log({arrivals,arrivalMap,msg});
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

