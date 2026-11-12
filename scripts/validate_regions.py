#!/usr/bin/env python3
"""Offline integrity checks for the real Milovice city sectors and road network."""
import json
import math
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
regions=json.loads((ROOT/"data/regions/index.json").read_text(encoding="utf8"))["regions"]
assert len(regions)>=6, "Not all planned districts are mapped"
ROADS={"primary","secondary","tertiary","residential","unclassified","service","living_street"}
ways={}
roadways=[]
bbox_by_id={}
for meta in regions:
    area=meta["id"]
    bbox=meta["bbox"]
    center=meta["center"]
    assert bbox[0]<center[1]<bbox[2] and bbox[1]<center[0]<bbox[3], (area,"bad region center")
    bbox_by_id[area]=bbox
    base=ROOT/"data/regions"
    path=(base/meta["file"]).resolve()
    assert path.exists(),(area,"OSM file missing")
    geodata=json.loads(path.read_text(encoding="utf8"))
    es=geodata["elements"]
    road_count=sum("highway" in e["tags"] for e in es)
    building_count=sum("building" in e["tags"] for e in es)
    assert road_count>=15 and building_count>=15,(area,road_count,building_count)
    for e in es:
        if e["id"] in ways:continue
        ways[e["id"]]=e
        if e["tags"].get("highway") in ROADS:roadways.append(e)
    terrain=(base/meta["terrain"]).resolve()
    assert terrain.exists(),(area,"ČÚZK tile missing")
    dem=json.loads(terrain.read_text(encoding="utf8"))
    assert "DMR 4G" in dem["source"],(area,"unverified heights")
    nx=dem.get("nx",dem.get("n"))
    nz=dem.get("nz",dem.get("n"))
    assert nx>=30 and nz>=30 and len(dem["values"])==nx*nz,(area,"bad elevation matrix")
    assert 100<dem["base"]<350,(area,"unrealistic base elevation")
    print(area,"buildings",building_count,"road ways",road_count,"official DEM samples",nx*nz)

# Regions must touch other regions with overlap, so there is no invented jump
# between the centre, Mladá, Benátecká Vrutice and Boží Dar.
def overlap(a,b):
    return min(a[2],b[2])-max(a[0],b[0])>0.001 and min(a[3],b[3])-max(a[1],b[1])>0.001
reachable={"old"}
while True:
    new={item["id"] for item in regions if item["id"] not in reachable
         and any(overlap(item["bbox"],bbox_by_id[q]) for q in reachable)}
    if not new:break
    reachable.update(new)
assert len(reachable)==len(regions),("Disconnected map areas",reachable)

# Inspect real drivable OSM way nodes, not arbitrary invented road links.
index={}
parent=[]
size=[]
points=[]
def node(p):
    key=(round(p["lat"],6),round(p["lon"],6))
    if key not in index:
        n=len(parent);index[key]=n
        parent.append(n);size.append(1);points.append(p)
    return index[key]
def root(x):
    while x!=parent[x]:
        parent[x]=parent[parent[x]]
        x=parent[x]
    return x
def union(a,b):
    a=root(a);b=root(b)
    if a!=b:
        if size[a]<size[b]:a,b=b,a
        parent[b]=a;size[a]+=size[b]
for road in roadways:
    geometry=road.get("geometry",[])
    for i in range(1,len(geometry)):
        union(node(geometry[i-1]),node(geometry[i]))
assert parent,"No road graph"
component_sizes={}
for v in range(len(parent)):
    r=root(v);component_sizes[r]=component_sizes.get(r,0)+1
largest=max(component_sizes,key=component_sizes.get)
coverage=component_sizes[largest]/len(parent)
assert coverage>.97,("OSM route coverage is fragmented",coverage)
for region in regions:
    lat,lon=region["center"]
    nearest=min(range(len(points)),key=lambda i:((points[i]["lat"]-lat)*111320)**2
                +((points[i]["lon"]-lon)*71100)**2)
    assert root(nearest)==largest,(region["id"],"center road is not in connected network")
print("PASS:",len(regions),"regions,",len(ways),"unique OSM ways,",
      len(parent),"road nodes,",f"{coverage:.1%}","in primary connected road network")
