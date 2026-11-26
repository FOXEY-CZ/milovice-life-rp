#!/usr/bin/env python3
"""Extract a review-only street grouping projection, excluding mixed audit notes."""
import argparse
import hashlib
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
PATHS = {"old": "data/milovice-osm.json", **{r: f"data/regions/{r}.json" for r in ("mlada","vrutice","westlink","centerlink","bozidar")}}
INVENTORY = "data/rebuild2-street-inventory.json"
CATEGORIES = ("buildings","roads","walkways","railway","landscape","publicObjects","utilities","other")

def git(*args):
    return subprocess.check_output(["git","-C",str(ROOT),*args])

def project(commit):
    if not re.fullmatch(r"[a-f0-9]{40}",commit) or git("rev-parse",commit+"^{commit}").decode().strip()!=commit:
        raise ValueError("Use exact 40-character commit SHA")
    def read(path):
        raw=git("show",commit+":"+path)
        return json.loads(raw),{"path":path,"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest()}
    inventory, inventory_evidence=read(INVENTORY)
    sources, ids, names = [], {}, {}
    for region,path in PATHS.items():
        data,evidence=read(path)
        if data.get("source")!="OpenStreetMap API" or "ODbL" not in data.get("attribution",""):
            raise ValueError("Unexpected source metadata: "+path)
        elements=data["elements"]
        ids[region]={f"{e['type']}:{e['id']}" for e in elements}
        if len(ids[region])!=len(elements):
            raise ValueError("Repeated snapshot IDs: "+path)
        names[region]={name for e in elements for name in (e["tags"].get("addr:street"),e["tags"].get("name") if e["tags"].get("highway") else None) if name}
        sources.append({**evidence,"region":region,"records":len(elements),"downloadedAt":data.get("downloaded_at"),"sourceUrl":data.get("source_url")})
    expected={(r,p,len(ids[r])) for r,p in PATHS.items()}
    declared={(x["region"],x["path"],x["rawElements"]) for x in inventory["sources"]}
    if declared!=expected or len(inventory["sources"])!=len(expected):
        raise ValueError("Street inventory source mismatch")
    seen=set()
    groups=[]
    for group in inventory["streets"]:
        region,street=group["region"],group["street"]
        if region not in ids or (street is not None and street not in names[region]):
            raise ValueError("Street label not found in region source")
        if set(group["mapped"])!=set(CATEGORIES):
            raise ValueError("Unrecognized grouping category")
        mapped={}
        for category in CATEGORIES:
            values=group["mapped"][category]
            if not isinstance(values,list):
                raise ValueError("Invalid mapped IDs")
            for key in values:
                if key not in ids[region] or key in seen:
                    raise ValueError("Missing or repeated mapped ID: "+key)
                seen.add(key)
            mapped[category]=sorted(values)
        groups.append({"region":region,"street":street,"mapped":mapped})
    if seen!=set().union(*ids.values()):
        raise ValueError("Projection does not cover the source ID union")
    return {"schema":1,"review":"pending; not a legal scope determination","commit":commit,
            "attribution":"© OpenStreetMap contributors","declaredDataLicense":"https://opendatacommons.org/licenses/odbl/1-0/",
            "description":"Existing heuristic street grouping projected from source-backed IDs and source-observed labels; not a surveyed road boundary or independent recreation.",
            "sourceInventory":inventory_evidence,"sources":sources,
            "summary":{"rawRecords":sum(len(v) for v in ids.values()),"uniqueMappedWays":len(seen),"groups":len(groups)},
            "groups":groups}

if __name__=="__main__":
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("commit");p.add_argument("output",type=pathlib.Path)
    args=p.parse_args()
    output=args.output.resolve()
    if ROOT==output or ROOT in output.parents:
        raise ValueError("Use an external output path")
    data=project(args.commit)
    raw=(json.dumps(data,ensure_ascii=False,indent=2,sort_keys=True)+"\n").encode()
    with output.open("xb") as f:f.write(raw)
    print(json.dumps({**data["summary"],"sha256":hashlib.sha256(raw).hexdigest(),"review":"pending"}))
