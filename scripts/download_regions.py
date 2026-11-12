#!/usr/bin/env python3
"""Export authentic OSM ways for outer Milovice, in small connected geographic tiles.

Never substitutes generated roads or buildings for missing source data. Region exports
can overlap; the client deduplicates OSM IDs. Building heights/tags can be incomplete.
"""
import json
import pathlib
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ROOT=pathlib.Path(__file__).resolve().parent.parent
REGIONS=json.loads((ROOT/"data/regions/index.json").read_text(encoding="utf8"))["regions"]
HIGHWAYS={"motorway","trunk","primary","secondary","tertiary","residential","living_street","service","unclassified","pedestrian","footway","path","track","cycleway"}
RAILWAYS={"rail","platform","disused","tram"}
AMENITY={"place_of_worship","school","college","university","townhall","community_centre","theatre","bus_station","hospital","fire_station"}
USER_AGENT="MiloviceLifeRP/0.48 (public OSM data for Czech open world game)"

def parse(raw, region):
    root=ET.fromstring(raw)
    if root.tag!="osm":
        raise ValueError("Expected OSM XML")
    nodes={}
    for n in root.findall("node"):
        nodes[int(n.attrib["id"])]=(float(n.attrib["lat"]),float(n.attrib["lon"]))
    features=[]
    for way in root.findall("way"):
        tags={t.attrib["k"]:t.attrib["v"] for t in way.findall("tag")}
        if not ("building" in tags or tags.get("highway") in HIGHWAYS or tags.get("railway") in RAILWAYS or tags.get("historic") or tags.get("amenity") in AMENITY or tags.get("leisure") in ("park","playground","pitch") or tags.get("landuse") in ("grass","forest","residential") or tags.get("waterway")):
            continue
        geometry=[{"lat":nodes[int(nd.attrib["ref"])][0],"lon":nodes[int(nd.attrib["ref"])][1]}
                  for nd in way.findall("nd") if int(nd.attrib["ref"]) in nodes]
        if len(geometry)<2:continue
        features.append({"type":"way","id":int(way.attrib["id"]),"tags":tags,"geometry":geometry})
    roads=sum("highway" in e["tags"] for e in features)
    buildings=sum("building" in e["tags"] for e in features)
    if roads<8 or buildings<8:
        raise ValueError(f"Unexpectedly small tile '{region['id']}': {roads} roads {buildings} buildings")
    return {"type":"osm-regional-export","area":region["name"],"bbox":region["bbox"],
            "source":"OpenStreetMap API","downloaded_at":datetime.now(timezone.utc).isoformat(),
            "attribution":"© OpenStreetMap contributors (ODbL)","elements":features}

def download(region):
    bbox=",".join(map(str,region["bbox"]))
    urls=[
      "https://api.openstreetmap.org/api/0.6/map?bbox="+bbox,
      "https://overpass-api.de/api/map?bbox="+bbox,
      "https://overpass.kumi.systems/api/map?bbox="+bbox
    ]
    errs=[]
    for url in urls:
        for attempt in range(2):
            try:
                req=urllib.request.Request(url,headers={"User-Agent":USER_AGENT,"Accept":"application/xml"})
                with urllib.request.urlopen(req,timeout=90) as response:
                    raw=response.read(60_000_000)
                result=parse(raw,region)
                result["source_url"]=url
                return result
            except Exception as exc:
                errs.append(f"{url} attempt{attempt+1}: {repr(exc)}")
                time.sleep(2+attempt*4)
    raise RuntimeError("Unable to export "+region["id"]+":\n"+"\n".join(errs))

def main():
    only=set(sys.argv[1:])
    for region in REGIONS:
        if region["id"]=="old" or (only and region["id"] not in only):
            continue
        print("Downloading",region["id"],"bbox",region["bbox"],flush=True)
        data=download(region)
        output=ROOT/"data/regions"/region["file"]
        output.parent.mkdir(parents=True,exist_ok=True)
        output.write_text(json.dumps(data,ensure_ascii=False,separators=(",",":")),encoding="utf8")
        print("Exported",output.name,len(data["elements"]),"ways",output.stat().st_size,"bytes",flush=True)

if __name__=="__main__":
    main()
