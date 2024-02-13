import React from 'react';
import * as data from '../../static_info/data.js'
import './app5.css'

// protoc --js_out=import_style=commonjs,binary:src  gtfs-realtime.proto
import FeedMessage from '../gtfs-realtime_pb.js'

// It's a client-only app and the key only accesses public data
API_KEY = 'LCJwHB1PF2aA67XcxldJ01QGyWuhNZrGS3v6Uk33'

window.fm = FeedMessage

async function fetchgtfs(which) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-'+which);
    xhttp.setRequestHeader('x-api-key', API_KEY);
    xhttp.responseType = "arraybuffer";
    let p = new Promise((res, rej) => {
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4) {
		if (this.status == 200) {
		    res();
		} else {
		    rej();
		}
	    }	
	}
    });
    xhttp.send()
    await p;
    let r = xhttp.response;
    let msg = FeedMessage.FeedMessage.deserializeBinary(r);
    //console.log({msg,r,t:typeof(r),xhttp});
    console.log(msg);
    window.m=msg;
    //theApp.setState({msg});
}


let theApp;

let minlat = 361;
let minlong = 361;
let maxlat = -361;
let maxlong = -361;

for (let id in data.stations) {
    let s = data.stations[id];
    if (s.Long < minlong) minlong = s.Long;
    if (s.Long > maxlong) maxlong = s.Long;
    if (s.Lat < minlat) minlat = s.Lat;
    if (s.Lat > maxlat) maxlat = s.Lat;
}
    
function mapx(lon) {
    return 100 * (maxlong - lon) / (maxlong - minlong);
}
function mapy(lat) {
    return 100 * (maxlat - lat) / (maxlat - minlat);
}
    

export function Station({s}) {
    return <div className="station" style={{left:mapx(s.Long)+'in', top:mapy(s.Lat)+'in'}}>{s.Name}</div>
}

export function Line({s1, s2, color, os, txt}){
    if ( ! os) os=0;
    let x1 = mapx(s1.Long);
    let x2 = mapx(s2.Long)
    let y1 = mapy(s1.Lat);
    let y2 = mapy(s2.Lat);
    let l = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    let theta = Math.atan2(y2-y1, x2-x1);
    let f = 0.1 * ((os + 4) % 8 + 1);
    let xm = x1 + os * .02 + f * l * Math.cos(theta);
    let ym = y1 + f * l * Math.sin(theta);
    return <div>
	       <div style={{
			background: color,
			top: y1+'in',
			left: (x1 + os*0.02)+'in',
			width: l+'in',
			height: '0.03in',
			transform: `rotate(${theta}rad)`,
			transformOrigin: 'left',
			position: 'absolute',
			zIndex: -2}} />
	       <div style={{
			background: color,
			top: `calc(${ym}in - min(.16in, .4vw)`,
			left: `calc(${xm}in - min(.16in, .4vw)`,
			width: `calc(min(.32in, .8vw)`,
			height: `calc(min(.32in, .8vw)`,
			borderRadius: '50%',
			textAlign: 'center',
			color: 'white',
			fontSize: 'min(.32in, .8vw)',
			textShadow: '0 0 .1vw black',
			position: 'absolute',
			zIndex: -1}}> {txt} </div>
	   </div>;
}
	       

export default class App extends React.Component {
    
    constructor(props) {
        super(props);
	/* global */ theApp = this;
        this.state = {};
//	fetchgtfs('ace');
    }
    
    render() {
	let pieces = [];
	for (let s of Object.values(data.stations)) {
	    if ( ! s.ShowAs ) {
		pieces.push( <Station s={s} key={s['GTFS Stop ID']} /> );
	    }
	}
	
	for (let t of data.transfers) {
	    let s1 = data.stations[t[0]];
	    let s2 = data.stations[t[1]];
	    if ( ! s1) {
		pieces.push(<div>Error: No stations {t[0]}</div>);
		continue;
	    }
	    if ( ! s2) {
		pieces.push(<div>Error: No stations {t[1]}</div>);
		continue;
	    }
	    if ( ! (s1.ShowAs || s2.ShowAs) ) {
		pieces.push( <Line s1={s1} s2={s2} color="black" txt={t[2]} key={"t"+t[0]+t[1]}/> );
	    }
	}
	let os = 0;
	for (let r of Object.values(data.routes)) {
	    let old = null;
	    for (let i of r.stops) {
		let newStop = data.stations[i];
		if (newStop.ShowAs) newStop = data.stations[newStop.ShowAs];
		console.log({r,old,newStop});
		if (old) {
		    pieces.push( <Line s1={old} s2={newStop} color={'#'+r.color} os={os} txt={r.name} key={"r"+r.name+i} /> );
		}
		old = newStop;
	    }
	    os += 1;
	}
		    
	return <div>Content:  { pieces } </div>;
    }
}
