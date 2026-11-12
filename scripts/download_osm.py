#!/usr/bin/env python3
"""Fetch genuine OSM roads and buildings for a small area of Milovice, CZ."""
import json, os, sys, time, urllib.parse, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
BBOX=(14.885,50.223,14.895,50.229)  # west,south,east,north
urls=[
 "https://api.openstreetmap.org/api/0.6/map?bbox="+",".join(map(str,BBOX)),
 "https://overpass-api.de/api/map?bbox="+",".join(map(str,BBOX)),
]
data=None
for url in urls:
 try:
  req=urllib.request.Request(url,headers={"User-Agent":"MiloviceLifeRP/0.2 (open source map export)"})
  with urllib.request.urlopen(req,timeout=35) as response:
   raw=response.read(9_000_000)
  root=ET.fromstring(raw)
  if root.tag!="osm": raise ValueError("Not OSM XML")
  nodes={int(n.attrib["id"]):(float(n.attrib["lat"]),float(n.attrib["lon"])) for n in root.findall("node")}
  result=[]
  for way in root.findall("way"):
   tags={t.attrib["k"]:t.attrib["v"] for t in way.findall("tag")}
   if not ("building" in tags or tags.get("highway") in ("residential","living_street","tertiary","secondary","primary","service","unclassified","pedestrian")):continue
   geometry=[{"lat":nodes[int(nd.attrib["ref"])][0],"lon":nodes[int(nd.attrib["ref"])][1]} for nd in way.findall("nd") if int(nd.attrib["ref"]) in nodes]
   if len(geometry)<2:continue
   result.append({"type":"way","id":int(way.attrib["id"]),"tags":tags,"geometry":geometry})
  if not any(e["tags"].get("highway") for e in result):raise ValueError("No roads in extract")
  data={"type":"osm-overpass-export","area":"Milovice, Stredocesky kraj, Czechia","bbox":BBOX,"source":"OpenStreetMap API","source_url":url,"downloaded_at":datetime.now(timezone.utc).isoformat(),"attribution":"© OpenStreetMap contributors (ODbL)","elements":result}
  print("OSM features:",len(result),"roads:",sum("highway" in e["tags"] for e in result),"buildings:",sum("building" in e["tags"] for e in result))
  break
 except Exception as exc:
  print("Download failed:",url,repr(exc),file=sys.stderr)
if data is None:raise SystemExit("No valid OSM export; keep previous data untouched")
os.makedirs("data",exist_ok=True)
with open("data/milovice-osm.json","w",encoding="utf8") as out:json.dump(data,out,ensure_ascii=False,separators=(",",":"))
