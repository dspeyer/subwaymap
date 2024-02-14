import React from 'react';
import * as data from '../../static_info/data.js'
import './appe.css'

import {Arrivals, fetchgtfs} from './arrivals.js';
import {Fragiles, fetchfragiles} from './fragiles.js';


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
    return <div className="station" style={{left:mapx(s.Long)+'in', top:mapy(s.Lat)+'in'}}>
	       {s.Name}
	       { Object.keys(data.routes).map( r => <Arrivals route={r} station={s.Id} key={r} /> ) }
	       <div>
		   <Fragiles station={s} typ="EL" />
		   <Fragiles station={s} typ="ES" />
	       </div>
	   </div>
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
	       <div className="ball" style={{
			background: color,
			top: `calc(${ym}in - .1in * var(--zoom-text))`,
			left: `calc(${xm}in -  .1in * var(--zoom-text))`}}>
		   {txt}
	       </div>
	   </div>;
}
	       
export default function App() {
    let pieces = [];
    for (let s of Object.values(data.stations)) {
	if ( ! s.ShowAs ) {
	    pieces.push( <Station s={s} key={s.Id} /> );
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
	    if (old) {
		pieces.push( <Line s1={old} s2={newStop} color={'#'+r.color} os={os} txt={r.name} key={"r"+r.name+i} /> );
	    }
	    old = newStop;
	}
	os += 1;
    }
    window.setTimeout(()=>fetchgtfs('-ace'), 100);
    window.setTimeout(()=>fetchgtfs('-g'), 100);
    window.setTimeout(()=>fetchgtfs('-nqrw'), 100);
    window.setTimeout(()=>fetchgtfs(''), 100);
    window.setTimeout(()=>fetchgtfs('-bdfm'), 100);
    window.setTimeout(()=>fetchgtfs('-jz'), 100);
    window.setTimeout(()=>fetchgtfs('-l'), 100);
    window.setTimeout(()=>fetchgtfs('-si'), 100);
    window.setTimeout(()=>fetchfragiles(), 100);
    
    return <div>Content:  <Dbg/> { pieces } </div>;
}

let theDbg = null;
export class Dbg extends React.Component {
    
    constructor(props) {
        super(props);
	/* global */ theDbg = this;
        this.state = {
	    msgs: ''
	};
    }

    log(txt) {
	this.setState({msg: this.state.msg+'; '+txt});
    }
    
    render() {
	return <span>{this.state.msg}</span>;
    }
}
	

function teachCssZoom() {
    let app = document.getElementById("app");
    let zoom = window.devicePixelRatio * window.visualViewport.scale;
    app.style.setProperty('--zoom-box', Math.pow(zoom, -0.6));
    app.style.setProperty('--zoom-text', Math.pow(zoom, -0.9));
}

window.addEventListener('resize', teachCssZoom);
window.addEventListener('wheel', teachCssZoom);
window.addEventListener('touchend', teachCssZoom);
teachCssZoom();
