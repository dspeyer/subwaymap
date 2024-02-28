import React, {useEffect} from 'react';
import * as data from '../../static_info/data.js'
import './appe.css'

import {Arrivals, fetchgtfs} from './arrivals.js';
import {Fragiles, fetchfragiles} from './fragiles.js';
import {FetcherBox, fetchAllOnce, jumpers} from './fetchers.js';
import {tickees, tick} from '../ticker.js';


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

function pad(x) {
    if (x < 10) {
	return '0'+x;
    } else {
	return x;
    }
}


function sigmoid(x) {
    return 1/(1+Math.exp(-x));
}

function mapCoords({Lat, Long}) {
    let x1 = (Long - minlong) / (maxlong - minlong);
    let y1 = (maxlat - Lat) / (maxlat - minlat);
    const theta = - Math.PI / 8;
    let x = Math.cos(theta) * x1 - Math.sin(theta) * y1;
    let y = Math.sin(theta) * x1 + Math.cos(theta) * y1;
    y -= Math.sin(theta);
    let siness = sigmoid((40.67-Lat)/.015) * sigmoid((-74.05-Long)/.02);
    y -= 0.25 * siness;
    x += Math.max(2*(.61-x)/3, 0) * siness;
    // TODO: something more principled
    x -= .5;
    y -= .07;
    x *= 10000;
    y *= 10000;
    return {x,y};
}
    
let maxz = 1;

function stationClick(id, ev) {
    let div = document.getElementById('station'+id);
    div.style.zIndex = ++maxz;
    div.classList.add('enlarged');
}

function stationShrink(id, ev) {
    let div = document.getElementById('station'+id);    
    div.classList.remove('enlarged');
    ev.stopPropagation();
}

export function Station({s}) {
    let {x,y} = mapCoords(s);
    return <div className="station"
		style={{left:x+'px', top:y+'px'}}
		id={'station'+s.Id}
		onClick={stationClick.bind(null,s.Id)}
	   >
	       <div className="hidden closebutton" onClick={stationShrink.bind(null,s.Id)}>↙</div>
	       {s.Name}
	       { Object.keys(data.routes).map( r => <Arrivals route={r} station={s.Id} key={r} /> ) }
	       <div>
		   <Fragiles station={s} typ="EL" />
		   <Fragiles station={s} typ="ES" />
	       </div>
	   </div>
}

export class YouAreHere extends React.Component {
    constructor(props) {
        super(props);
	this.state = {
	    Lat: 0,
	    Long: 0,
	    updated: 0,
	    now: 0,
	}
	this.hasJumped = false;
	tickees.push(this);
    }

    render() {
	let age = Math.round(this.state.now - this.state.updated);
	if ( this.state.Lat < maxlat &&
	     this.state.Lat > minlat &&
	     this.state.Long < maxlong &&
	     this.state.Long > minlong ) {
	    for (let jumper of jumpers) {
		jumper.setState({callback: this.jump.bind(this)});
	    }
	    let vvw = window.visualViewport.width;
	    let vvh = window.visualViewport.height
	    let {x,y} = mapCoords(this.state);
	    return <div id='yah-jump'
			style={{position:'absolute',
				left: x-vvw*.4+'px',
				top: y-vvh*.4+'px',
				width: vvw*.8+'px',
				height: vvh*.8+'px',
			       }}>
		       <div className="yahball" style={{position:'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%);'}}>
			   🚶
			   { age>10 ?
			     <div style={{fontSize:'40%'}}>
				 { Math.floor(age/60)}:{pad(age%60)}
			     </div>			      
			     : <span/> }
		       </div>
		   </div>;
		       
	} else {
	    for (let jumper of jumpers) {
		jumper.setState({callback: null});
	    }
	    //theDbg.log('outside '+[minlat,maxlat,minlong,maxlong]);
	    return null;
	}
    }

    getLoc(pos) {
	if (pos?.coords?.latitude) {
	    this.setState({Lat: pos.coords.latitude,
			   Long: pos.coords.longitude,
			   updated: (new Date()).getTime() / 1000});
	}
    }
    
    err() {
	//theDbg.log('geoerror:')
	//theDbg.log(arguments);
    }
    
    componentDidMount() {
	navigator.geolocation.getCurrentPosition(this.getLoc.bind(this), this.err);
	navigator.geolocation.watchPosition(this.getLoc.bind(this), this.err);
    }

    componentDidUpdate() {
	if (! this.hasJumped) {
	    this.jump();
	}
    }

    jump() {
	let div = document.getElementById('yah-jump');
	if (div) {
	    div.scrollIntoView({block: 'nearest', behavior:'smooth'});
	    this.hasJumped = true;
	}
    }
};
	    
	    
	

export function Line({s1, s2, color, os, txt, zi}){
    if ( ! os) os=0;
    let {x,y} = mapCoords(s1);
    let p2 = mapCoords(s2);
    let l = Math.sqrt((p2.x-x)*(p2.x-x)+(p2.y-y)*(p2.y-y));
    let theta = Math.atan2(p2.y-y, p2.x-x);
    let f = 0.1 * ((os + 4) % 8 + 1);
    let xm = x + os * .02 + f * l * Math.cos(theta);
    let ym = y + f * l * Math.sin(theta);
    return <div>
	       <div style={{
			background: color,
			top: y+'px',
			left: (x + os*0.02)+'px',
			width: l+'px',
			height: '0.03in',
			transform: `rotate(${theta}rad)`,
			transformOrigin: 'left',
			position: 'absolute',
			zIndex: zi || -2}} />
	       { txt ? 
		 <div className="ball" style={{
			  background: color,
			  top: `calc(${ym}in - .1in * var(--zoom-text))`,
			  left: `calc(${xm}in -  .1in * var(--zoom-text))`}}>
		     {txt}
		 </div>
		 : null }
	   </div>;
}


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can customize the error message or UI here
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
        </div>
      );
    }
    // Render children if there's no error
    return this.props.children;
  }
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
    let key=1000;
    for (let c of data.coasts) {
	for (let i=0; i<c.length-1; i++) {
	    let s1 = c[i];
	    let s2 = c[i+1];
	    pieces.push( <Line s1={s1} s2={s2} color='#77f' key={key++} zi='-3' /> );
	}
    }	    
    useEffect(fetchAllOnce);
    
    return <ErrorBoundary>Content:  <Dbg/> <FetcherBox/> <YouAreHere/> { pieces } </ErrorBoundary>;
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
	return <span style={{marginLeft: 'calc(1in * var(--zoom-text))'}}>{this.state.msg}</span>;
    }
}
	

function teachCssZoom() {
    let app = document.getElementById("app");
    let zoom = window.devicePixelRatio * window.visualViewport.scale;
    app.style.setProperty('--zoom-box', Math.pow(zoom, -0.6));
    app.style.setProperty('--zoom-text', Math.pow(zoom, -0.9));
    app.style.setProperty('--vvh', window.visualViewport.height+'px');
}

window.addEventListener('resize', teachCssZoom);
window.visualViewport.addEventListener('resize',teachCssZoom);
teachCssZoom();

tick();
