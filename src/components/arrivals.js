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

function setHilite(v) {
    for (let r in arrivalMap) {
	for (let s in arrivalMap[r]) {
	    arrivalMap[r][s].setState({hilite: v});
	}
    }
}

export class Arrivals extends React.Component {
    constructor(props) {
        super(props);
	this.route = data.routes[props.route];
	this.station = data.stations[props.station];
	this.state = {
	    now: (new Date()).getTime() / 1000,
	    N: [],
	    S: [],
	    asSid: this.station.Id,
	    hilite: null
	};
	arrivalMap[props.route][props.station] = this;
	tickees.push(this);
    }
    
    render() {
	if ( ( ! this.state.N.length)  && ( ! this.state.S.length ) ) {
	    return null;
	}
	return <div>
		   <span className="rn" style={{background: '#'+this.route.color}}>
		       {this.route.name}
		   </span>
		   { ['N', 'S'].map(dir => 
		       <span className="half" key={dir}>
			   { data.stations[this.state.asSid].ShortDirs[dir] }
			   <span className="hidden" style={{fontSize:'80%'}}>
			       ({data.stations[this.state.asSid].Directions[dir]})
			   </span>
			   { (this.state[dir]
			      .sort((a,b) => a.time - b.time)
			      .map(a => ({time: Math.round(a.time-this.state.now), id:a.id}))
			      .filter(a => a.time>=0)
			      .map( (a, i) => 
				  <span key={i}
					className={a.id==this.state.hilite ? 'hilite' : ''}
					onClick={setHilite.bind(null,a.id)} >
				      {Math.floor(a.time/60)
				      }{ i<2 ? <span className="hidden">:{pad(a.time%60)}</span> : null
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
    console.log(msg);
    let arrivals = {};
    for (let entity of msg.entityList) {
	if (entity.tripUpdate?.stopTimeUpdateList) {
	    let id = entity.tripUpdate.trip.tripId;
	    let rid = entity.tripUpdate.trip.routeId;
	    if ( ! (rid in arrivals)) {
		arrivals[rid] = {};
	    }
	    for (let stu of entity.tripUpdate.stopTimeUpdateList) {
		if ( ! stu.stopId ) continue;
		let asSid = stu.stopId.slice(0,-1);
		if (! (asSid in data.stations)) {
		    console.log({stu,asSid,msg:'failed to find station'});
		    continue;
		}
		let sid = data.stations[asSid].ShowAs || asSid;
		let dir = stu.stopId.slice(-1);
		if ( ! (sid in arrivals[rid])) {
		    arrivals[rid][sid] = {N:[], S:[], asSid}
		}
		let time = stu.arrival?.time || stu.departure?.time || 0;
		arrivals[rid][sid][dir].push({time,id});
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
	    
