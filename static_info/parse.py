#!/usr/bin/python

from csv import DictReader
import json
import cv2
import numpy as np
import matplotlib.pyplot as plt
import re

stations = list(DictReader(open('Stations.csv')))

canon = {}

for s in stations:
    s['Name'] = s['Stop Name']
    s['Id'] = s['GTFS Stop ID']
    s['Lat'] = float(s['GTFS Latitude'])
    s['Long'] = float(s['GTFS Longitude'])
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

kernel = np.ones((5,5), dtype=np.uint8)
onecold = np.ones((200,200), dtype=np.uint8)
onecold[100,100] = 0
goal = cv2.distanceTransform(onecold, cv2.DIST_L2, 3, cv2.DIST_LABEL_CCOMP)
for s in stations:
    mask = np.ones((200,200), dtype=np.uint8)
    for s2 in stations:
        if s == s2:
            continue
        s2c = s2.get('DisplayAt', s2)
        x = int((s2c['Long'] - s['Long'])*1000) + 100
        y = int((s2c['Lat'] - s['Lat'])*1000) + 100
        if x>=0 and x<200 and y>=0 and y<200:
            mask[x,y] = 0
    mask = cv2.erode(mask, kernel)
    if not mask[100,100]:
        mask = cv2.erode(mask, kernel)
        opts = goal * mask + 255 * (1-mask)
        if np.min(opts) < 10:
            best = np.argmin(opts)
            bx,by = (best//200, best%200)
            opts[bx,by]=127
            # plt.imshow(opts)
            # plt.show()
            nlg = (bx - 100) / 1000 + s['Long']
            nlt = (by - 100) / 1000 + s['Lat']
            s['DisplayAt'] = { 'Lat': nlt, 'Long': nlg }

        
smap = { s['Id']: s for s in stations }

def mergeDesc(l,s):
    if s.lower() == 'street':
        m = l.replace(' St ',' ').replace(' Ave ',' ').replace(' Av ',' ').replace(' Avenue ',' ')
        m = m.replace('Lexington','Lex').replace('Central Park West','CPW')
        m = re.sub('\(([NESW]*) corner\)', '\\1', m)
        m = re.sub('\\b([EW]) ([0-9]*)\\b', '\\1\\2', m)
        if len(m) < 20:
            return f'{s} ({m})'
        else:
            return s
    if s.lower() == 'mezzanine' and len(l) > 25:
        fm = re.search('\\b([A-Z0-9&][ /])+service', l)
        if fm:
            fr = fm.group(0).replace(' service','').replace('/','')
        else:
            fr = ''
        am = re.search('access([ /][A-Z0-9&])+\\b', l)
        if am:
            ac = am.group(0).replace('access ','').replace('/','')
            if ac and ac != fr:
                fr += f'(+{ac})'
        elif 'access street' in l:
            fr += '(+St)'
        if fr:
            return f'{fr} {s}'
    if len(l) < 25:
        return l
    return s

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
                placed = s
                break
    if not placed:
        print('WARNING: did not place %s in %s (%s:%s)'%(e['equipmentno'],e['station'],e['stationcomplexid'],e['linesservedbyelevator']))
    try:
        lfrom, lto = e['serving'].replace('access to','access').replace('to access','access').replace('to reach','access').replace('passageway to','').split(' to ')
        sfrom, sto = e['shortdescription'].split(' to ')
    except:
        e['mergeddescription'] = e['shortdescription']
        continue
    
    mfrom = mergeDesc(lfrom, sfrom)
    mto = mergeDesc(lto, sto)
    mdesc = f'{mfrom} to {mto}'
    nl = ''
    dr = set(placed['Daytime Routes'].split(' '))
    ls = set(e['linesservedbyelevator'].split('/'))
    if dr != ls:
        for line in sorted(ls):
            if not line in mdesc:
                nl += line
        if nl:
            mdesc += f' (+{nl})'
    if len(mdesc) > 35:
        mdesc = mdesc.replace('mezzanine', 'mezz')
    e['mergeddescription'] = mdesc
    print(f'{placed["Name"]} ({placed["Daytime Routes"]})')
    print(e['serving'])
    print(e['shortdescription'])
    print(e['linesservedbyelevator'])
    print(e['mergeddescription'])
    print('------------------------------------------')
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

# EVERY other route is encoded N to S
routes['GS']['stops'].reverse() 
        
def triples(l):
    yield [l[0],l[0],l[1]]
    for i in range(1,len(l)-1):
        yield l[i-1:i+2]
    yield [l[-2],l[-1],l[-1]]
        
for r in routes.values():
    if len(r['stops']) < 2:
        continue
    for p,s,n in triples(r['stops']):
        dlt = smap[n]['Lat'] - smap[p]['Lat']
        dlg = smap[n]['Long'] - smap[p]['Long']
        if 2 * abs(dlt) > abs(dlg):
            smap[s]['ShortDirs'] = {'N': '↑', 'S': '↓'}
        else:
            if dlg < 0:
                smap[s]['ShortDirs'] = {'N': '→', 'S': '←'}
            else:
                smap[s]['ShortDirs'] = {'N': '←', 'S': '→'}
    smap[r['stops'][0]]['ShortDirs']['N'] = '☒'
    smap[r['stops'][0]]['Directions']['N'] = 'End of Line'
    smap[r['stops'][-1]]['ShortDirs']['S'] = '☒'
    smap[r['stops'][-1]]['Directions']['S'] = 'End of Line'
        
coasts = []
for rawcoast in json.load(open('shoreline.json'))['data']:
    #if float(rawcoast['SHAPE_Leng']) < 70000:
    #    continue
    coasts.append([]);
    ln = rawcoast[9].replace('LINESTRING (','').replace(')','').split(', ')
    llt = 0
    llg = 0
    for c in ln:
        Long, Lat = tuple(int(float(t)*10000)/10000 for t in c.split(' '))
        if ( (Lat-llt)**2 + (Long-llg)**2 ) ** .5 > .01:
            coasts[-1].append({'Lat':Lat, 'Long':Long})
            llt = Lat
            llg = Long
    coasts[-1].append({'Lat':Lat, 'Long':Long})
            
coasts = [ c for c in coasts if len(c)>4 ]
            
outf = open('data.js','w')
outf.write('export const stations =')
json.dump(smap, outf, indent=4)
outf.write('\n\n export const fragiles =')
json.dump(fmap, outf, indent=4)
outf.write('\n\n export const transfers =')
json.dump(transfers, outf, indent=4)
outf.write('\n\n export const routes =')
json.dump(routes, outf, indent=4)
outf.write('\n\n export const coasts =')
json.dump(coasts, outf, indent=4)
