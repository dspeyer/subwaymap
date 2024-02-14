#!/usr/bin/python

from csv import DictReader
import json


stations = list(DictReader(open('Stations.csv')))

canon = {}

for s in stations:
    s['Name'] = s['Stop Name']
    s['Id'] = s['GTFS Stop ID']
    s['Lat'] = s['GTFS Latitude']
    s['Long'] = s['GTFS Longitude']
    s['Directions'] = {
        'N': s['North Direction Label'] or 'Uptown',
        'S': s['South Direction Label'] or 'Downtown'
    }    
    del s['Stop Name']
    del s['GTFS Stop ID']
    del s['GTFS Latitude']
    del s['GTFS Longitude']
    del s['North Direction Label']
    del s['South Direction Label']    
    s['ES'] = []
    s['EL'] = []
    s['AlsoShow'] = []
    key =  s['Complex ID'] + s['Name']
    if key in canon and s['Name'] != '14 St':
        canon[key]['AlsoShow'].append(s['Id'])
        s['ShowAs'] = canon[key]['Id']
    else:
        canon[key] = s
smap = { s['Id']: s for s in stations }

fragiles = json.load(open('tmp/nyct_ene_equipments.json'))

for e in fragiles:
    placed = False
    for s in stations:
        if e['stationcomplexid'] != s['Complex ID']:
            continue
        for l in s['Daytime Routes']:
            if l==' ':
                continue
            if l in e['linesservedbyelevator'] or e['linesservedbyelevator'] == 'LIRR':
                s[e['equipmenttype']].append(e['equipmentno'])
                placed = True
                break
    if not placed:
        print('WARNING: did not place %s in %s (%s:%s)'%(e['equipmentno'],e['station'],e['stationcomplexid'],e['linesservedbyelevator']))
fmap = { e['equipmentno']: e for e in fragiles }

transfers = DictReader(open('transfers.txt'))
transfers = [ [t['from_stop_id'],t['to_stop_id'],int(t['min_transfer_time'])//60] for t in transfers if t['from_stop_id']>t['to_stop_id'] ]

for t in transfers:
    if t[0]=='R27' and t[1]=='140':
        # South Ferry was renumbered after transfers.txt was created, possibly because of Sandy
        t[1]='142'

routes = {}
for r in DictReader(open('routes.csv')):
    id = r["route_id"]
    ss = json.load(open(f'tmp/{id}.json'))
    if len(s) > 0:
        routes[id] = {
            "name": r['route_short_name'],
            "color": r['route_color'] or '0000ff',
            "stops": [ s['stopId'].replace('MTASBWY:','') for s in ss ]
        }

outf = open('data.js','w')
outf.write('export const stations =')
json.dump(smap, outf, indent=4)
outf.write('\n\n export const fragiles =')
json.dump(fmap, outf, indent=4)
outf.write('\n\n export const transfers =')
json.dump(transfers, outf, indent=4)
outf.write('\n\n export const routes =')
json.dump(routes, outf, indent=4)
