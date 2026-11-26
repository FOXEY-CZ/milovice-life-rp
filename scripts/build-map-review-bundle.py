#!/usr/bin/env python3
"""Build a review-only map data ZIP from exact committed bytes; no network."""
import argparse
import hashlib
import json
import pathlib
import re
import subprocess
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
REGIONS = ("mlada", "vrutice", "westlink", "centerlink", "bozidar")
OSM = ["data/milovice-osm.json"] + [f"data/regions/{r}.json" for r in REGIONS]
DEM = ["data/milovice-terrain.json"] + [f"data/regions/terrain-{r}.json" for r in REGIONS]
METHODS = ["scripts/download_osm.py", "scripts/download_regions.py",
           "scripts/build_terrain.py", "scripts/build_region_terrain.py"]
INVENTORY = "data/rebuild2-street-inventory.json"
INDEX = "data/regions/index.json"
PATHS = sorted(OSM + DEM + METHODS + [INVENTORY, INDEX])
ODBL = "https://opendatacommons.org/licenses/odbl/1-0/"
CCBY = "https://creativecommons.org/licenses/by/4.0/"

def git(*args):
    return subprocess.check_output(["git", "-C", str(ROOT), *args])

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def collect(commit):
    if not re.fullmatch(r"[a-f0-9]{40}", commit):
        raise ValueError("Use exact 40-character commit SHA")
    if git("rev-parse", commit + "^{commit}").decode().strip() != commit:
        raise ValueError("Commit mismatch")
    files, records = {}, []
    methods = list(METHODS)
    helper = 'scripts/dmr_export_provenance.py'
    # The helper is required only by newer committed exporters.
    if any(b'from dmr_export_provenance import' in git('show', commit + ':' + p) for p in METHODS):
        methods.append(helper)
    for path in sorted(OSM + DEM + methods + [INVENTORY, INDEX]):
        raw = git("show", commit + ":" + path)
        files[path] = raw
        row = {"path": path, "bytes": len(raw), "sha256": digest(raw)}
        if path in OSM:
            obj = json.loads(raw)
            if obj.get("source") != "OpenStreetMap API" or "ODbL" not in obj.get("attribution","") or not obj.get("elements"):
                raise ValueError("Unexpected OSM metadata: " + path)
            row.update(kind="osm-snapshot", declared_license=ODBL,
                       attribution=obj["attribution"], source_url=obj.get("source_url"),
                       downloaded_at=obj.get("downloaded_at"), records=len(obj["elements"]))
        elif path in DEM:
            obj = json.loads(raw)
            step = 10 if path == DEM[0] else 20
            if obj.get("license") != "CC BY 4.0" or obj.get("step") != step or "DMR 4G" not in obj.get("source",""):
                raise ValueError("Unexpected terrain metadata: " + path)
            row.update(kind="resampled-terrain", declared_license=CCBY,
                       attribution=obj.get("credit"), source=obj["source"], step_m=step)
        elif path == INVENTORY:
            obj = json.loads(raw)
            if "ODbL" not in obj.get("attribution",""):
                raise ValueError("Street inventory attribution missing")
            row.update(kind="derived-street-inventory", declared_license=ODBL,
                       attribution=obj["attribution"], review="mixed metadata scope pending")
        else:
            row.update(kind="source-method" if path in methods else "region-index",
                       review="project-file terms pending; not assigned data license")
        records.append(row)
    manifest = {"schema": 1, "commit": commit, "review": "pending",
                "scope": "exact selected data and existing method scripts; not full corresponding database or release authorization",
                "files": records}
    files["manifest.json"] = (json.dumps(manifest, indent=2, ensure_ascii=False, sort_keys=True)+"\n").encode()
    files["README.txt"] = ("CROSSVEX map data review bundle\n"
      "Commit: "+commit+"\n"
      "OSM: copyright OpenStreetMap contributors; declared ODbL 1.0, "+ODBL+"\n"
      "Terrain: copyright CUZK / Zemeremericky urad; declared CC BY 4.0, "+CCBY+"\n"
      "Terrain service: https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr4g/ImageServer\n"
      "OSM snapshots contain original names and GPS. Do not remove attribution.\n"
      "Terrain samples are resampled 10m central / 20m regional grids, not surveyed building heights.\n"
      "Included scripts document existing extraction and sampling methods; rerunning live requests may return different data.\n"
      "No claim of complete reproduction, corresponding database scope, service-specific permissions, or code license.\n"
      "Mixed architecture records, game code, assets and complete license texts are outside this review bundle.\n"
      "Not approved for final distribution. Review remaining obligations in issue #147.\n").encode()
    return files, manifest

def build(commit, output):
    files, manifest = collect(commit)
    output = pathlib.Path(output)
    if output.exists():
        raise FileExistsError(output)
    try:
        with zipfile.ZipFile(output, "x", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            for path, raw in sorted(files.items()):
                entry = zipfile.ZipInfo(path, date_time=(1980,1,1,0,0,0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                entry.create_system = 3
                entry.external_attr = 0o100644 << 16
                z.writestr(entry, raw, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
        with zipfile.ZipFile(output) as z:
            if z.namelist() != sorted(files) or z.testzip() is not None:
                raise ValueError("Archive inventory or CRC failed")
            for path, raw in files.items():
                if z.read(path) != raw:
                    raise ValueError("Archive content mismatch: "+path)
    except Exception:
        # Never delete a pre-existing archive; x-mode must successfully create it first.
        raise
    print(json.dumps({"commit":commit,"records":len(manifest["files"]),
                      "entries":len(files),"zip_sha256":digest(output.read_bytes()),
                      "review":"pending"},sort_keys=True))

if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("commit")
    p.add_argument("output")
    args = p.parse_args()
    build(args.commit,args.output)
