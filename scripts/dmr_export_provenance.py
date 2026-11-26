"""External evidence for future DMR exports; no network or third-party imports."""
import hashlib
import json
import os
import pathlib
import re
import shutil
from datetime import datetime, timezone
from urllib.parse import urlsplit

SOURCE = "https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr4g/ImageServer/exportImage"
DATASET = "CZ-CUZK-DMR4G-V"
SERVICE = "CZ-CUZK-AGS-DMR4G"
PARAMS = {"f","bbox","bboxSR","imageSR","size","format","pixelType","interpolation","renderingRule"}

def digest(data):
    return {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}

def evidence_directory(repo, value=None):
    value = value if value is not None else os.environ.get("CROSSVEX_DMR_EVIDENCE_DIR")
    if not value:
        raise ValueError("Set CROSSVEX_DMR_EVIDENCE_DIR to an existing external directory")
    root = pathlib.Path(repo).resolve(strict=True)
    directory = pathlib.Path(value).resolve(strict=True)
    if not directory.is_dir() or directory == root or root in directory.parents:
        raise ValueError("DMR evidence directory must be outside the repository")
    return directory

def capture_export(params, info, response, raster, *, acquired=None):
    if set(params) != PARAMS:
        raise ValueError("Unexpected export parameters")
    stamp = acquired if acquired is not None else datetime.now(timezone.utc)
    if stamp.tzinfo is None or stamp.utcoffset() is None:
        raise ValueError("Acquisition timestamp must be timezone aware")
    url = urlsplit(info["href"])
    # Do not archive temporary query tokens or signed URLs.
    raster_url = f"{url.scheme}://{url.hostname}{url.path}"
    def http_metadata(headers):
        return {key: headers[key] for key in ("Date","Last-Modified","ETag","Content-Type") if key in headers}
    return {
        "schema": 1, "dataset": DATASET, "service": SERVICE,
        "endpoint": SOURCE, "requestParameters": dict(params),
        "acquiredUtc": stamp.astimezone(timezone.utc).isoformat(),
        "providerDatasetUpdateDate": None,
        "providerDatasetUpdateDateStatus": "not established by this export",
        "exportMetadata": {k: info[k] for k in ("width","height","extent","pixelSize","scale") if k in info},
        "rasterDownloadLocationWithoutQuery": raster_url,
        "exportHttpHeaders": http_metadata(response.headers),
        "rasterHttpHeaders": http_metadata(raster.headers),
        "raster": digest(raster.content),
    }

def write_evidence(directory, region, record, raster_bytes, output_bytes):
    if not re.fullmatch(r"[a-z0-9-]+", region):
        raise ValueError("Invalid evidence region")
    if record["raster"] != digest(raster_bytes):
        raise ValueError("Raster bytes do not match captured evidence")
    directory = pathlib.Path(directory).resolve(strict=True)
    if not directory.is_dir():
        raise ValueError("Missing evidence directory")
    # Exclusive directory creation prevents accidental replacement of older evidence.
    name = region + "-" + hashlib.sha256(output_bytes).hexdigest()[:16] + "-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    target = directory / name
    target.mkdir(exist_ok=False)
    try:
        (target / "source.tif").write_bytes(raster_bytes)
        (target / "terrain.json").write_bytes(output_bytes)
        manifest = {**record, "region": region, "terrain": digest(output_bytes)}
        # Manifest is written last; a crash before this point leaves incomplete evidence.
        with (target / "manifest.json").open("x", encoding="utf-8") as file:
            json.dump(manifest, file, ensure_ascii=False, indent=2, allow_nan=False)
            file.write("\n")
    except Exception:
        shutil.rmtree(target)
        raise
    return target
