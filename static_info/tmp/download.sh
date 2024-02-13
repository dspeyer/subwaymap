#!/bin/bash

curl https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fnyct_ene_equipments.json  -H 'x-api-key: LCJwHB1PF2aA67XcxldJ01QGyWuhNZrGS3v6Uk33' > nyct_ene_equipments.json
for i in `cat ../routes.csv  | sed 's/,.*//' | grep -v route_id`; do curl "https://collector-otp-prod.camsys-apps.com/schedule/MTASBWY/stopsForRoute?apikey=qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP&&routeId=MTASBWY:$i" > "$i.json";done
