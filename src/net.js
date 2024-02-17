// It's a client-only app and the key only accesses public data
const API_KEY = 'LCJwHB1PF2aA67XcxldJ01QGyWuhNZrGS3v6Uk33'

export  async function fetch(which, rt, cb) {
    console.log('fetching');
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET",  'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2F'+which);
    xhttp.setRequestHeader('x-api-key', API_KEY);
    xhttp.responseType = rt;
    cb(xhttp);
    let p = new Promise((res, rej) => {
	xhttp.onreadystatechange = function() {
	    if (cb) cb(xhttp);
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
    cb(xhttp);
    await p;
    console.log(xhttp);
    return xhttp.response;
}
